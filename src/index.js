// @ts-ignore
import Toc from "./toc.svelte";

/**
 * @param {undefined|String|HTMLElement} el 
 * @param {String} propName 
 * @param {HTMLElement} [def] 
 * @param {Boolean} [allow] 
 * @returns {HTMLElement|undefined}
 */
const selector = function (el, propName, def, allow) {
  if (!el && allow) {
    return undefined;
  }
  if (typeof el === "string") {
    // @ts-ignore
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
  /**
   * @param {undefined|String|HTMLElement} el 
   * @param {{ 
   *  contentSelector?: undefined|String|HTMLElement, 
   *  scrollSelector?: undefined|String|HTMLElement,
   *  fixedSelector?: undefined|String|HTMLElement,
   *  headingSelector?: undefined|String,
   *  collapsedLevel?: Number,
   *  idPrefix?: String,
   *  levelClassPrefix?: String,
   *  scrollDuration?: Number,
   *  fixedOffset?: Number,
   *  fixedClassName?: String,
   *  scrollOffset?: Number,
   *  beforeFixed?: Function,
   *  afterFixed?: Function,
   * }} [options] 
   */
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

  reset() {
    // @ts-ignore
    this.toc.reset();
  }
  /**
   * @returns {Boolean}
   */
  isEmpty() {
    // @ts-ignore
    return this.toc.isEmpty();
  }
  syncScroll() {
    // @ts-ignore
    this.toc.syncScroll();
  }
}

export default TocHelper;
