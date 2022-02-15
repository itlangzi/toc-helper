<script>
  import { onMount } from "svelte";
  import Nav from "./nav.svelte";
  import { active, hightlight, scrollLock } from "./store";

  import {
    build,
    getScrollTop,
    getScrollElement,
    scrollTo,
    getOffset,
    throttle,
    debounce,
    isDoc,
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

  export const resetHeadings = function () {
    resolveHeadings();
  };

  export const isEmpty = function () {
    return nodes.length === 0;
  };

  export let beforeFixed = null;
  export let afterFixed = null;

  // 所有的栏目节点
  let nodes = [];

  // 目标元素偏移量到node的映射
  let offset2Node = {};

  let tocMain = null;

  // 元素栏目偏移量
  let oriFixedOffset = 0;

  // 真实的滚动元素
  let realScrollElement = getScrollElement(scrollElement);

  // 目前元素的偏移量集合
  let offsets = [];

  const resolveHeadings = function () {
    const allHeadings = contentElement.querySelectorAll(headingSelector);
    const result = build(
      allHeadings,
      idPrefix,
      levelClassPrefix,
      realScrollElement
    );
    nodes = result.nodes;
    offset2Node = result.offsets;
    offsets = Object.keys(offset2Node);

    // 初始滚动的位置，计算出高亮的标题
    const offsetY = findByScrollTop();
    if (offset2Node[offsetY]) {
      $active = { node: offset2Node[offsetY], el: null, hoverd: null };
    }
  };

  $: {
    resolveHeadings();
  }

  const findByScrollTop = function () {
    // 根据滚动的距离匹配当前高亮标题
    const top = getScrollTop(realScrollElement);
    return offsets.find(y => y >= top);
  };

  const tocActive = function () {
    if (isEmpty()) {
      return;
    }
    const found = findByScrollTop();
    const node = offset2Node[found];

    if (found !== undefined && node) {
      const el = node.element;
      $active = { node, el, hoverd: null };

      // 先取消之前的
      scrollNavDebounce.cancel();
      scrollNavDebounce(el);
    }
  };

  const scrollNav = function (el) {
    if (isEmpty()) {
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
      scrollTo(tocScrollElement, top, scrollDuration);
    }
  };

  const fixed = function () {
    if (isEmpty()) {
      return;
    }
    // fixedOffset = false 表示禁用
    // @ts-ignore
    if (fixedOffset !== false && isDoc(realScrollElement)) {
      const _fixedElement = fixedElement || tocMain;

      // fixed 元素滚动的距离是以document为基础
      const scrollElementTop = getScrollTop(document.scrollingElement);

      let _fixedOffset = fixedOffset;
      if (isNaN(_fixedOffset)) {
        _fixedOffset = oriFixedOffset;
      }
      if (scrollElementTop >= _fixedOffset) {
        if (!_fixedElement.classList.contains(fixedClassName)) {
          if (typeof beforeFixed == "function" && beforeFixed(true) === false) {
            return;
          }
          _fixedElement.classList.add(fixedClassName);
          if (typeof afterFixed == "function" && afterFixed(true) === false) {
            return;
          }
        }
      } else {
        if (_fixedElement.classList.contains(fixedClassName)) {
          if (
            typeof beforeFixed == "function" &&
            beforeFixed(false) === false
          ) {
            return;
          }
          _fixedElement.classList.remove(fixedClassName);
          if (typeof afterFixed == "function" && afterFixed(false) === false) {
            return;
          }
        }
      }
    }
  };

  const onNav = function (el, node) {
    fixed();
    scrollNav(el);
  };
  const scrollHandler = function () {
    fixed();
    tocActive();
  };

  const onscroll = function (e) {
    if (!$scrollLock) {
      scrollThrottleEvent();
    }
  };

  const scrollNavDebounce = debounce(scrollNav);
  const scrollThrottleEvent = throttle(scrollHandler);

  onMount(() => {
    const _fixedElement = fixedElement || tocMain;

    // 计算原始fixed的偏移量
    // 若初始隐藏且有滚动的情况下不不准确
    oriFixedOffset = getOffset(_fixedElement, document).y;

    scrollHandler();

    const observer = new IntersectionObserver(function (entries) {
      const entry = entries[0];
      // 监听toc元素是否显示
      if (entry.intersectionRatio > 0) {
        // 元素从隐藏到展现
        oriFixedOffset = getOffset(_fixedElement, document).y;
        scrollHandler();
      }
    });
    observer.observe(_fixedElement);

    // 大小监视
    const resizeObserver = new ResizeObserver(function (entries) {
      const entry = entries[0];
      if (entry.contentRect.width > 0) {
        active.hoverd($active.el);
      }
    });
    resizeObserver.observe(_fixedElement);

    realScrollElement.addEventListener("scroll", onscroll);
    return () => {
      observer.disconnect();
      realScrollElement.removeEventListener("scroll", onscroll);
    };
  });
</script>

<main class="bitoc" bind:this={tocMain}>
  <div class="bitoc-hightlight" style={$hightlight} />
  <div class="bitoc-navs">
    <Nav
      {onNav}
      {scrollOffset}
      {collapsedLevel}
      {scrollDuration}
      {nodes}
      scrollElement={realScrollElement}
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
  }
  /* chrome 和Safari */
  .bitoc::-webkit-scrollbar {
    width: 0 !important;
  }
  :global(.bitoc-hightlight) {
    width: 100%;
    background: #eee;
    position: absolute;
    left: 0;
    top: 0;
    height: 12px;
    border-left: 3px solid #009a61;
    transition: top 0.25s cubic-bezier(0.075, 0.82, 0.165, 1),
      height 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
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
    transition: max-height 0.25s;
  }
  :global(.bitoc-nav.is-collapsed) {
    max-height: 0;
    overflow: hidden;
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
