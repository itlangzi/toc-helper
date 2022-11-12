const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

/**
 * @param {Function} fn 
 * @param {any} [self] 
 * @param  {...any} args 
 */
export const call = function (fn, self, ...args) {
  if (typeof fn === "function") {
    return fn.call(self, ...args);
  }
  return undefined
};

/**
 * @param {HTMLElement|Document} el 
 * @returns {Boolean}
 */
export const isDoc = function (el) {
  return el === document.body || el === document;
};

export const isMobile =
  /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
    navigator.userAgent
  );
export const enterEvent = isMobile ? "touchstart" : "mouseenter";
export const leaveEvent = isMobile ? "touchend" : "mouseleave";
export const clickEvent = isMobile ? "touchstart" : "click";

const headNodeNameRE = /^h(\d)$/i;
let nodeIdIndex = 0;

/**
 * @param {HTMLElement} el 
 * @param {Number} level 
 * @param {Number} oriLevel 
 * @param {any} parent 
 * @param {String} idPrefix 
 * @param {String} levelClassPrefix 
 * @param {Document|HTMLElement} scrollElement 
 * @returns 
 */
const buildNode = (
  el,
  level,
  oriLevel,
  parent,
  idPrefix,
  levelClassPrefix,
  scrollElement
) => {
  idPrefix = idPrefix || "bitoc-heading-";
  levelClassPrefix = levelClassPrefix || "bitoc-ml-";

  // 没有就创建一个
  let id = el.getAttribute("id");
  nodeIdIndex = nodeIdIndex + 1;

  let oriId = id;

  if (!id) {
    id = idPrefix + nodeIdIndex;
  }

  // 名称
  const title = (el.textContent || "").trim();
  return {
    class: levelClassPrefix + level,
    title,
    // 父级节点
    parent,
    // 目标节点
    target: el,
    // 当前级
    level,
    //原级
    oriLevel,
    // id hash
    id,
    // 原id
    oriId,
    // y 轴偏移量
    y: getOffset(el, scrollElement).y,
  };
};

/**
 * @param {{level: Number, parent?: any}} parent 
 * @param {Number} level 
 * @returns 
 */
const fallback = function (parent, level) {
  if (!parent) {
    // 顶级元素
    return null;
  }
  if (parent.level === level) {
    return parent.parent;
  }
  if (parent.level === level - 1) {
    return parent;
  }
  return fallback(parent.parent, level);
};

/**
 * @param {HTMLElement[]} headings 
 * @param {String} idPrefix 
 * @param {String} levelClassPrefix 
 * @param {Document|HTMLElement} scrollElement 
 * @returns {{
 *  nodes: {
 *    class?: String,   
 *    title?: String,
 *    parent?: any,
 *    target?: HTMLElement,
 *    level?: Number,
 *    oriLevel?: Number,
 *    id?: String,
 *    oriId?: String,
 *    y?: Number,
 *  }[], 
 *  offsets: {
 *    Number?: {
    *    class?: String,   
    *    title?: String,
    *    parent?: any,
    *    target?: HTMLElement,
    *    level?: Number,
    *    oriLevel?: Number,
    *    id?: String,
    *    oriId?: String,
    *    y?: Number,
  *   }
 *  }
 * }}
 */
export const build = (headings, idPrefix, levelClassPrefix, scrollElement) => {
  if (!headings || !headings.length) {
    return { nodes: [], offsets: {} };
  }

  // 原节点偏移量到新node的映射
  const offsets = {};
  const nodes = [];

  // 前一个节点
  let prevNode = null;

  // @ts-ignore
  headings.forEach(head => {
    let oriLevel = null;
    const re = headNodeNameRE.exec(head.nodeName);
    if (re) {
      oriLevel = re[1];
    } else {
      oriLevel = head.getAttribute("data-level");
    }
    oriLevel = parseInt(oriLevel);
    oriLevel = Math.max(1, Math.min(oriLevel, 6)) || 6;

    let level = oriLevel;
    let parent = null;
    if (prevNode) {
      if (prevNode.level >= oriLevel) {
        // 当前节点需要退级处理
        parent = fallback(prevNode.parent, oriLevel);
        // parent 为null是退级到顶级节点
        level = parent ? parent.level + 1 : 1;
      } else {
        level = prevNode.level + 1;
        parent = prevNode;
      }
    } else {
      level = 1;
      parent = null;
    }

    // 顶级节点目录
    const node = buildNode(
      head,
      level,
      oriLevel,
      parent,
      idPrefix,
      levelClassPrefix,
      scrollElement
    );
    if (parent) {
      // 正常节点
      // @ts-ignore
      if (parent.nodes) {
        // @ts-ignore
        parent.nodes.push(node);
      } else {
        // @ts-ignore
        parent.nodes = [node];
      }
    } else {
      // 顶级节点
      nodes.push(node);
    }
    prevNode = node;
    offsets[node.y] = node;
  });
  return { nodes, offsets };
};


/**
 * @param {Function} fn 
 * @param {number} [delay = 16] 
 * @returns {Function}
 */
export const setTimer = function (fn, delay = 16) {
  let timer, canceled = false;
  let start = Date.now();

  const cancel = () => {
    canceled = true
    timer && CAF(timer);
  }

  const loop = () => {

    if (canceled) {
      return
    }

    if (Date.now() - start >= delay) {
      cancel()
      call(fn, this, timer)
      return;
    }

    timer = RAF(loop);

  };
  loop();
  return cancel;
};
/**
 * @param {Function} fn 
 * @param {number} [delay = 16]
 * @returns 
 */
export const debounce = function (fn, delay = 16) {
  let cancel;
  const debounced = function () {
    const context = this;
    const args = arguments;

    if (cancel) cancel();

    cancel = setTimer(() => fn.apply(context, args), delay);

  };

  debounced.cancel = function () {
    cancel && cancel();
    cancel = null;
  };

  return debounced;
};

/**
 * @param {Function} fn 
 * @param {Number} [duration = 24]
 * @returns {Function}
 */
export const throttle = function (fn, duration = 24) {
  let time = null;
  return function () {
    const context = this;
    const args = arguments;
    const now = Date.now();
    if (!time || now - time > duration) {
      fn.apply(context, args);
      time = now;
    }
  };
};

/**
 * @param {Number} duration 
 * @param {Function} progress 
 * @param {Function} finished 
 * @returns {Function}
 */
export const animator = function (duration, progress, finished) {
  if (duration <= 0 || isNaN(duration)) {
    duration = 500;
  }
  const start = Date.now();
  let next = true;
  RAF(function step() {
    const p = (Date.now() - start) / duration;
    call(progress, undefined, p);
    if (p >= 1) {
      progress(1);
      next = false;
      call(finished, undefined, 1);
    }
    if (next) {
      RAF(step);
    }
  });

  return function () {
    // 取消动画
    next = false;
  };
};

/**
 * @param {HTMLElement} el 
 * @returns {Boolean}
 */
export const isScroll = function (el) {
  return el.scrollHeight > el.clientHeight;
};

/**
 * @param {HTMLElement} el 
 * @param {Document|HTMLElement} scrollElement 
 * @returns 
 */
export const getOffset = function (el, scrollElement) {
  let s = scrollElement;
  if (!scrollElement || isDoc(scrollElement)) {
    s = document.documentElement;
  }
  let y = el.offsetTop || 0;
  let x = el.offsetLeft || 0;

  const offsetParent = el.offsetParent;
  if (isDoc(el) || !offsetParent) {
    return { x, y };
  }
  // @ts-ignore
  if (offsetParent === s.offsetParent) {
    // scrollElement 只具有滚动属性没有position，
    // 即子元素通过offsetParent 无法找到自己，但可以找到自己的父级
    // 也就是拥有同样的父级
    // 需要减去自己的偏移量
    // @ts-ignore
    const y1 = s.offsetTop || 0;
    // @ts-ignore
    const x1 = s.offsetLeft || 0;
    return { x: x - x1, y: y - y1 };
  }

  if (offsetParent !== s) {
    //@ts-ignore
    const offset = getOffset(offsetParent);
    y += offset.y;
    x += offset.x;
  }
  return { x, y };
};

/**
 * @param {HTMLElement|window|document} el 
 * @returns 
 */
export const scrollTop = function (el) {
  if (el === window) {
    return el.screenY
  }
  if (el === document) {
    // scrollingElement
    //    PC = document.documentElement
    //    Mobile = document.body
    return document.scrollingElement.scrollTop
  }
  // @ts-ignore
  return el.scrollTop
};

/**
 * @param {HTMLElement} el 
 * @param {String} key 
 * @param {String} [value]
 * @returns {String?}
 */
export const css = function (el, key, value) {
  if (key && !value) {
    return window.getComputedStyle(el).getPropertyValue(key);
  }
  el.style[key] = value;
};

/**
 * @param {Document|HTMLElement} el 
 * @returns {Document|HTMLElement} 
 */
export const getScrollElement = function (el) {
  if (isDoc(el)) {
    return document;
  }
  // @ts-ignore
  if (!el || isScroll(el)) {
    // @ts-ignore
    return el;
  }
  // @ts-ignore
  const position = css(el, "position");
  if (position === "fixed" || !el.parentElement) {
    return document;
  }
  return getScrollElement(el.parentElement);
};

/**
 * @param {HTMLElement} el 
 * @param {Number} top 
 * @param {Function} [finish] 
 * @param {Number} [maxTimes] 
 * @returns 
 */
export const scrollEnd = (el, top, finish, maxTimes) => {
  let times = 0;
  const _maxTimes = maxTimes || 100;
  return function end(el, top, finish) {
    if (scrollTop(el) === top) {
      times = 0;
      call(finish);
    } else {
      if (times > _maxTimes) {
        times = 0;
        // 强制结束
        call(finish);
        return;
      }
      times += 1;
      setTimer(() => {
        end(el, top, finish);
      });
    }
  }(el, top, finish)
}

/**
 * @param {HTMLElement} el 
 * @param {Number} top 
 * @param {Number} [duration = 200]
 * @param {Function} [finish] 
 */
export const scrollTo = function (el, top, duration = 200, finish) {
  if (isScroll(el)) {
    const scrolledTop = scrollTop(el);
    const offsetTop = top - scrolledTop;

    animator(duration, (/** @type {Number}*/progress) => {
      el.scrollTo({
        left: 0,
        top: scrolledTop + progress * offsetTop,
        behavior: "smooth",
      });
    }, finish
    );
  } else {
    call(finish, undefined, 1)
  }
};
/**
 * 线性匀速算法
 * @param {Number} t  当前时间
 * @param {Number} b  初始值
 * @param {Number} c  变化值，总长度
 * @param {Number} d  持续时间
 * @returns 
 */
// @ts-ignore
function linear(t, b, c, d) {
  return c * t / d + b;
}
/**
 * @param {Number} t 
 * @returns {Number}
 */
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
/**
 * slide 动画
 * @param {HTMLElement} node 
 * @param {{delay?: Number, duration?: Number, easing?: Function }}  [params]
 * @returns {any}
 */
// @ts-ignore
export const slide = function (node, { delay = 0, duration = 150, easing = cubicOut } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  return {
    delay,
    duration,
    easing,
    css: (/** @type {Number} */t) =>
      `opacity: ${Math.min(t * 20, 1) * opacity}; max-height: ${t * height}px;`,
  };
};
