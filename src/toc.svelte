<script>
  import { onMount } from "svelte";
  import Nav from "./nav.svelte";
  import { active, locker } from "./store";

  import {
    build,
    scrollTop,
    getScrollElement,
    scrollTo,
    getOffset,
    // debounce,
    throttle,
    isDoc,
    call,
  } from "./util";

  // export let tocElement;
  export let contentElement;
  export let scrollElement;
  export let fixedElement;
  export let headingSelector = "h1, h2, h3, h4, h5, h6";
  // 折叠深度
  export let collapsedLevel = 3;
  export let idPrefix = "";
  export let levelClassPrefix = "";
  export let scrollDuration = 200;
  // 栏目停靠顶部触发的偏移量
  // 默认动态计算fixedElement元素到document的距离
  // 但是若是隐藏且有滚动的情况下计算会有误差
  // 建议给固定的值
  // false 表示禁用
  /**
   * @type {Number|Boolean|NaN}
   */
  export let fixedOffset = 0;
  export let fixedClassName = "bitoc-fixed";
  // 滚动偏移量，若滚动元素内有fixed布局，一般是header采用fixed布局
  // 点击标题滚动到内容对应的位置会有偏差，可以设置该值使滚动位置正确
  // 也可一使用样式处理，该值或样式只能设置一个
  // 样式处理示例，假如header高度是64
  // h1, h2, h3, h4, h5, h6{
  //   margin-top: -64px;
  //   pading-top: 64px;
  // }
  export let scrollOffset = 0;

  export let beforeFixed = null;
  export let afterFixed = null;

  export const reset = function () {
    parseHeadings();
    onscroll();
  };

  export const isEmpty = function () {
    return nodes.length === 0;
  };

  export const syncScroll = function () {
    oriFixedOffset = getOffset(
      fixedElement || tocMain,
      document.documentElement
    ).y;
    onscroll();
  };

  // 所有的栏目节点
  let nodes = [];

  /**
   * @type {{Number?:any}}
   * @desc 目标元素偏移量到node的映射
   */
  let offset2Node = {};

  let tocMain = null;

  // 元素栏目偏移量
  let oriFixedOffset = 0;

  // 真实的滚动元素
  let realScrollElement = getScrollElement(scrollElement);

  /**
   * @type {Number[]}
   * @desc 目前元素的偏移量集合
   */
  let offsets = [];

  const parseHeadings = function () {
    const headings = contentElement.querySelectorAll(headingSelector);
    const result = build(
      headings,
      idPrefix,
      levelClassPrefix,
      realScrollElement
    );
    nodes = result.nodes;
    offset2Node = result.offsets;
    offsets = Object.keys(offset2Node).map(Number);

    // 初始滚动的位置，计算出高亮的标题
    const offsetY = scrollOffsetY();
    if (offset2Node[offsetY]) {
      $active = offset2Node[offsetY];
    }
  };

  $: {
    // 优先于onMount
    parseHeadings();
  }

  const scrollOffsetY = function () {
    // 根据滚动的距离匹配当前高亮标题
    const top = scrollTop(realScrollElement);
    return offsets.find((y) => y >= top);
  };

  /**
   * 内容容器滚动，目录同步滚动到相应的位置，并激活
   * @param {Function} [finish]
   */
  const scrollActive = function (finish) {
    if (isEmpty()) {
      return;
    }
    const offsetY = scrollOffsetY();
    const node = offset2Node[offsetY];

    if (offsetY !== undefined && node) {
      $active = node;

      const el = node.element;
      // 先取消之前的
      // scrollNavDebounce.cancel();
      // scrollNavDebounce(el, finish);
      scrollNav(el, finish);
    } else {
      call(finish);
    }
  };

  /**
   * @param {HTMLElement|undefined} el
   * @param {Function} [finish]
   */
  const scrollNav = function (el, finish) {
    if (isEmpty()) {
      call(finish);
      return;
    }
    let tocScrollElement = tocMain;

    if (el && tocScrollElement) {
      // 需要滚动的位置
      let top = getOffset(el, tocScrollElement).y;

      const tocOffsetHeight = tocScrollElement.offsetHeight;
      const tocScrollHeight = tocScrollElement.scrollHeight;
      // 最大滚动距离
      const maxScrollOffset = tocScrollHeight - tocOffsetHeight;

      const halfTocOffsetHeight = tocOffsetHeight / 2;
      // 小于可视高度
      if (top <= halfTocOffsetHeight) {
        top = 0;
      } else if (top - tocOffsetHeight > maxScrollOffset) {
        // 当超过最大滚动距离，再多的滚动也是无意义，直接最大即可
        top = maxScrollOffset;
      } else {
        top = top - halfTocOffsetHeight;
      }

      scrollTo(tocScrollElement, top, scrollDuration, () => {
        call(finish);
      });
    } else {
      call(finish);
    }
  };

  /**
   * 目录停靠
   */
  const tocFixed = function () {
    if (isEmpty()) {
      return;
    }
    // fixedOffset = false 表示禁用
    if (fixedOffset !== false && fixedClassName && isDoc(realScrollElement)) {
      const _fixedElement = fixedElement || tocMain;

      // fixed 元素滚动的距离是以document为基础
      const scrollElementTop = scrollTop(document);

      let _fixedOffset = fixedOffset;
      if (!_fixedOffset) {
        _fixedOffset = oriFixedOffset;
      }
      if (scrollElementTop >= _fixedOffset) {
        if (!_fixedElement.classList.contains(fixedClassName)) {
          if (call(beforeFixed, undefined, true) === false) {
            return;
          }

          _fixedElement.classList.add(fixedClassName);

          call(afterFixed, undefined, true);
        }
      } else {
        if (_fixedElement.classList.contains(fixedClassName)) {
          if (call(beforeFixed, undefined, false) === false) {
            return;
          }

          _fixedElement.classList.remove(fixedClassName);

          call(afterFixed, undefined, false);
        }
      }
    }
  };

  // const onNav = function (el, node, finish) {
  //   // fixed();
  //   if (!$locker) {
  //     scrollNav(el, finish);
  //   } else {
  //     call(finish);
  //   }
  // };
  const scrollHandler = function () {
    tocFixed();
    if ($locker === 0) {
      scrollActive();
    }
  };

  const onscroll = function () {
    scrollThrottleHandler();
  };

  const transitionEnd = () => {
    scrollHandler();
  };

  // const scrollNavDebounce = debounce(scrollNav, 24);
  const scrollThrottleHandler = throttle(scrollHandler, 16);
  // const scrollDebounceHandler = debounce(scrollHandler, 16);

  onMount(() => {
    // 计算原始fixed的偏移量
    // fixed 布局默认以document.documentElement为基础
    // 若初始隐藏且有滚动的情况下不不准确
    oriFixedOffset = getOffset(
      fixedElement || tocMain,
      document.documentElement
    ).y;

    onscroll();

    realScrollElement.addEventListener("scroll", onscroll);
    return () => {
      realScrollElement.removeEventListener("scroll", onscroll);
    };
  });
</script>

<main class="bitoc" bind:this={tocMain}>
  <div class="bitoc-navs">
    <Nav
      {scrollOffset}
      {collapsedLevel}
      {scrollDuration}
      {nodes}
      scrollElement={realScrollElement}
      {transitionEnd}
    />
  </div>
</main>

<style>
  .bitoc,
  .bitoc * {
    box-sizing: border-box;
  }
  :global(.bitoc-fixed) {
    position: fixed !important;
  }
  .bitoc {
    width: 100%;
    position: relative;
    overflow-y: auto;
    /*  IE 10+ */
    -ms-overflow-style: none;
    /*  Firefox */
    overflow: -moz-scrollbars-none;
    scroll-behavior: smooth;
  }
  /* chrome 和Safari */
  .bitoc::-webkit-scrollbar {
    width: 0 !important;
  }

  :global(.bitoc-nav a) {
    display: block;
    padding: 0.2rem 1.7rem;
    font-size: 0.9rem;
    text-decoration: none;
    color: #555;
    position: relative;
    transition: all 0.25s;
  }

  :global(.bitoc-nav) {
    overflow: hidden;
    transition: max-height 0.25s;
  }

  :global(.bitoc-nav a:before) {
    content: " ";
    height: 0.25rem;
    width: 0.25rem;
    background: #555;
    position: absolute;
    top: 0.72rem;
    left: 1rem;
  }
  :global(.bitoc-nav a:hover, .bitoc-nav a.active) {
    color: #009a61;
  }
  :global(.bitoc-nav a.active::before, .bitoc-nav a:hover:before) {
    background: #009a61;
  }
  :global(.bitoc-nav a.bitoc-ml-2) {
    margin-left: 1rem !important;
  }
  :global(.bitoc-nav a.bitoc-ml-3) {
    margin-left: 2rem !important;
  }
  :global(.bitoc-nav a.bitoc-ml-4) {
    margin-left: 3rem !important;
  }
  :global(.bitoc-nav a.bitoc-ml-5) {
    margin-left: 4rem !important;
  }
  :global(.bitoc-nav a.bitoc-ml-6) {
    margin-left: 5rem !important;
  }
</style>
