<script>
  import {
    enterEvent,
    leaveEvent,
    clickEvent,
    scrollTo,
    setTimer,
    slide,
  } from "./util";
  import { active, scrollLock } from "./store";

  export let nodes = [];
  export let scrollElement;
  export let scrollDuration;
  export let collapsedLevel;
  export let parent = null;
  export let onNav = null;
  export let scrollOffset = 0;

  const handler = function (el, node) {
    node.element = el;

    if ($active.node === node) {
      // 初始的时候没有el，在此处设置
      $active = { node, el, hoverd: null };
    }

    let _heading = node;
    const enter = function (e) {
      active.hoverd(e.target);
    };
    const leave = function (e) {
      active.unHoverd();
    };
    const click = function (e) {
      $active = { node: _heading, el: e.target, hoverd: null };

      let el = scrollElement;
      if (scrollElement.scrollingElement) {
        el = scrollElement.scrollingElement;
      }
      $scrollLock = true;
      scrollTo(el, _heading.y - scrollOffset, scrollDuration, function () {
        if (typeof onNav === "function") {
          onNav(e.target, _heading);
        }
        setTimer(() => {
          $scrollLock = false;
        }, 16);
      });
    };

    el.addEventListener(enterEvent, enter);
    el.addEventListener(leaveEvent, leave);
    el.addEventListener(clickEvent, click);

    return {
      update(next) {
        _heading = next;
        _heading.element = el;
      },
    };
  };

  const onIntroend = function () {
    active.hoverd($active.el);
  };

  const onOutroend = function () {
    active.hoverd($active.el);
  };
  const lookup = function (activeNode, parentNode) {
    if (activeNode && parentNode) {
      if (activeNode.id === parentNode.id) {
        return true;
      }
      return lookup(activeNode.parent, parentNode);
    }
    return false;
  };
  const isCollapsed = function (activeNode, parentNode) {
    if (!activeNode || !parentNode) {
      return false;
    }
    return (
      parentNode.level + 1 > collapsedLevel && !lookup(activeNode, parentNode)
    );
  };
</script>

{#if !isCollapsed($active.node, parent)}
  <div
    class="bitoc-nav"
    in:slide
    out:slide
    on:introend={onIntroend}
    on:outroend={onOutroend}
  >
    {#each nodes as node}
      <a
        href={"#" + node.id}
        class={node.class}
        class:active={$active.node === node}
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
        />
      {/if}
    {/each}
  </div>
{/if}
