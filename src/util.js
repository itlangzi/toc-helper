const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

const call = function (fn, ...args) {
  if (typeof fn === "function") {
    fn.call(...args);
  }
};

const trimRE = /(^\s*)|(\s*$)/g;

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
const buildNode = (
  node,
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
  let id = node.getAttribute("id");
  nodeIdIndex = nodeIdIndex + 1;

  let oriId = id;

  if (!id) {
    id = idPrefix + nodeIdIndex;
  }

  // 名称
  const title = (node.textContent || "").replace(trimRE, "");
  return {
    class: levelClassPrefix + level,
    title,
    // 父级节点
    parent,
    // 目标节点
    target: node,
    // 当前级
    level,
    //原级
    oriLevel,
    // id hash
    id,
    // 原id
    oriId,
    // y 轴偏移量
    y: getOffset(node, scrollElement).y,
  };
};

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

export const setTimer = function (fn, delay, next) {
  let timer;
  let start = Date.now();
  const loop = () => {
    if (Date.now() - start >= delay) {
      CAF(timer);
      call(fn, this, timer);
      timer = null;
      return;
    }
    timer = RAF(loop);
    call(next, undefined, timer);
  };
  loop();
  return timer;
};
export const clearTimer = function (id) {
  CAF(id);
};
export const debounce = function (fn, delay = 16) {
  let id;
  const debounced = function () {
    const context = this;
    const args = arguments;
    if (id) clearTimer(id);
    id = setTimer(
      () => fn.apply(context, args),
      delay,
      nextId => (id = nextId)
    );
  };
  debounced.cancel = function () {
    clearTimer(id);
    id = null;
  };
  return debounced;
};
export const throttle = function (fn, duration = 16) {
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

export const isScroll = function (el) {
  return el.scrollHeight > el.clientHeight;
};

export const getOffset = function (el, scrollElement) {
  let s = scrollElement;
  if (!scrollElement || isDoc(scrollElement)) {
    s = document;
  }
  let y = el.offsetTop || 0;
  let x = el.offsetLeft || 0;

  const offsetParent = el.offsetParent;
  if (isDoc(el) || !offsetParent) {
    return { x, y };
  }
  if (offsetParent === s.offsetParent) {
    // scrollElement 只具有滚动属性没有position，
    // 即子元素通过offsetParent 无法找到自己，但可以找到自己的父级
    // 也就是拥有同样的父级
    // 需要减去自己的偏移量
    const y1 = s.offsetTop || 0;
    const x1 = s.offsetLeft || 0;
    return { x: x - x1, y: y - y1 };
  }

  if (offsetParent !== s) {
    const offset = getOffset(offsetParent);
    y += offset.y;
    x += offset.x;
  }
  return { x, y };
};
export const getScrollTop = function (el) {
  return el === window
    ? el.pageYOffset
    : el === document
    ? // scrollingElement
      //    PC = document.documentElement
      //    Mobile = document.body
      document.scrollingElement.scrollTop
    : el.scrollTop;
};

export const css = function (el, key, value) {
  if (key && !value) {
    return window.getComputedStyle(el).getPropertyValue(key);
  }
  el.style[key] = value;
};
export const getScrollElement = function (el) {
  if (isDoc(el)) {
    return document;
  }
  if (!el || isDoc(el) || isScroll(el)) {
    return el;
  }
  const position = css(el, "position");
  if (position === "fixed" || !el.parentElement) {
    return document;
  }
  return getScrollElement(el.parentElement);
};

export const scrollTo = function (el, top, duration = 200, finished) {
  if (isScroll(el)) {
    const scrolledTop = getScrollTop(el);

    const offsetTop = top - scrolledTop;
    animator(
      duration,
      progress => {
        el.scrollTo({
          left: 0,
          top: scrolledTop + progress * offsetTop,
          behavior: "smooth",
        });
      },
      finished
    );
  } else {
    if (typeof finished === "function") {
      finished();
    }
  }
};
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
export const slide = function (
  node,
  { delay = 0, duration = 150, easing = cubicOut } = {}
) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  return {
    delay,
    duration,
    easing,
    css: t =>
      `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};height: ${
        t * height
      }px;`,
  };
};
