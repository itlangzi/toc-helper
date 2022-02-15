import Toc from "./toc.svelte";

const selector = function (el, propName, def, allow) {
  if (!el && allow) {
    return el;
  }
  if (typeof el === "string") {
    el = document.querySelector(el);
  }
  if (!(el instanceof HTMLElement)) {
    if (def) {
      el = def;
    } else {
      throw new Error(`"${propName}"is an invalid selector or non-DOM node`);
    }
  }
  return el;
};

class TocHelper {
  constructor(el, options) {
    const {
      contentSelector,
      scrollSelector,
      fixedSelector,
      headingSelector,
      collapsedLevel,
      idPrefix,
      levelClassPrefix,
      scrollDuration,
      fixedOffset,
      fixedClassName,
      scrollOffset,
      beforeFixed,
      afterFixed,
    } = options || {};

    el = selector(el, "mount");

    const contentElement = selector(
      contentSelector,
      "contentSelector",
      document.body
    );
    const scrollElement = selector(
      scrollSelector,
      "scrollSelector",
      document.body
    );

    const fixedElement = selector(fixedSelector, "fixedSelector", null, true);
    this.toc = new Toc({
      target: el,
      props: {
        // tocElement: el,
        contentElement,
        scrollElement,
        fixedElement,
        headingSelector,
        collapsedLevel: Math.max(1, Math.min(collapsedLevel, 6)) || 3,
        idPrefix,
        levelClassPrefix,
        scrollDuration,
        fixedOffset,
        fixedClassName,
        scrollOffset,
        beforeFixed,
        afterFixed,
      },
    });
  }

  resetHeadings() {
    this.toc.resetHeadings();
  }
  isEmpty() {
    return this.toc.isEmpty();
  }
}

export default TocHelper;
