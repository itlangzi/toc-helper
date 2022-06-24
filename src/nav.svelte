<script>
  import { clickEvent, scrollTo, slide, scrollEnd, call } from "./util";
  import { active, locker } from "./store";

  export let nodes = [];
  export let scrollElement;
  export let scrollDuration;
  export let collapsedLevel;
  export let parent = null;
  export let onNav = null;
  export let scrollOffset = 0;
  export let transitionStart = null;
  export let transitionEnd = null;

  /**
   * @param {HTMLElement} el
   * @param {{element: HTMLElement, y: Number}} node
   */
  const handler = function (el, node) {
    // 设置element
    node.element = el;

    let _heading = node;

    /**
     * @param {TouchEvent | MouseEvent} e
     */
    const click = function (e) {
      $active = _heading;

      // document or content container
      let el = scrollElement;
      if (scrollElement.scrollingElement) {
        el = scrollElement.scrollingElement;
      }

      const offsetTop = _heading.y - scrollOffset;
      $locker = $locker + 1;
      scrollTo(el, offsetTop, scrollDuration, function () {
        if (typeof onNav !== "function") {
          scrollEnd(el, offsetTop, () => {
            // 尽量保证滚动完成
            $locker = $locker - 1;
          });
          return;
        }
        onNav(e.target, _heading, function () {
          scrollEnd(el, offsetTop, () => {
            // 尽量保证滚动完成
            $locker = $locker - 1;
          });
        });
      });
    };

    el.addEventListener(clickEvent, click);

    return {
      /**
       * @param {any} next
       */
      update(next) {
        _heading = next;
        _heading.element = el;
      },
      destory() {
        node.element = null;
        _heading = null;
        el.removeEventListener(clickEvent, click);
      },
    };
  };

  /**
   * @param {CustomEvent|undefined|null} e
   */
  const introstart = (e) => {
    $locker = $locker + 1;
    call(transitionStart, undefined, e);
  };
  /**
   * @param {CustomEvent|undefined|null} e
   */
  const introend = (e) => {
    $locker = $locker - 1;
    call(transitionEnd, undefined, e);
  };
  /**
   * @param {CustomEvent|undefined|null} e
   */
  const outrostart = (e) => {
    $locker = $locker + 1;
    call(transitionStart, undefined, e);
  };
  /**
   * @param {CustomEvent|undefined|null} e
   */
  const outroend = (e) => {
    $locker = $locker - 1;
    call(transitionEnd, undefined, e);
  };

  /**
   * 向上递归查找是否是同一父级 (同一链路)
   * @param {{parent?: any, id: Number}} activeNode 当前激活的node
   * @param {{id: Number}} parentNode 父级node
   */
  const isChain = function (activeNode, parentNode) {
    if (activeNode && parentNode) {
      // if (activeNode.id === parentNode.id) {
      if (activeNode === parentNode) {
        return true;
      }
      return isChain(activeNode.parent, parentNode);
    }
    return false;
  };
  /**
   * 是否折叠状态
   * @param {{parent?: any, level: Number, id: Number}} activeNode 当前激活的node
   * @param {{level: Number, id: Number}} parentNode 父级node
   */
  const isCollapsed = function (activeNode, parentNode) {
    if (!activeNode || !parentNode) {
      return false;
    }
    return (
      parentNode.level + 1 > collapsedLevel && !isChain(activeNode, parentNode)
    );
  };
</script>

{#if !isCollapsed($active, parent)}
  <div
    class="bitoc-nav"
    in:slide
    out:slide
    on:introstart={introstart}
    on:introend={introend}
    on:outrostart={outrostart}
    on:outroend={outroend}
  >
    {#each nodes as node}
      <a
        href={"#" + node.id}
        class={node.class}
        class:active={$active === node}
        use:handler={node}
      >
        {node.title}
      </a>
      {#if node.nodes && node.nodes.length}
        <svelte:self
          nodes={node.nodes}
          parent={node}
          {scrollOffset}
          {onNav}
          {scrollElement}
          {scrollDuration}
          {collapsedLevel}
          {transitionEnd}
        />
      {/if}
    {/each}
  </div>
{/if}
