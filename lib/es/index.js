function noop() {
}
const identity = (x) => x;
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
const managed_styles = /* @__PURE__ */ new Map();
let active$1 = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active$1 += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1);
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active$1 -= deleted;
    if (!active$1)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active$1)
      return;
    managed_styles.forEach((info) => {
      const { stylesheet } = info;
      let i = stylesheet.cssRules.length;
      while (i--)
        stylesheet.deleteRule(i);
      info.rules = {};
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css: css2 } = config || null_transition;
    if (css2)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css2, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css: css2 } = config || null_transition;
    if (css2)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css2);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config();
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;
const call = function(fn, self, ...args) {
  if (typeof fn === "function") {
    return fn.call(self, ...args);
  }
  return void 0;
};
const isDoc = function(el) {
  return el === document.body || el === document;
};
const isMobile = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent);
const clickEvent = isMobile ? "touchstart" : "click";
const headNodeNameRE = /^h(\d)$/i;
let nodeIdIndex = 0;
const buildNode = (el, level, oriLevel, parent, idPrefix, levelClassPrefix, scrollElement) => {
  idPrefix = idPrefix || "bitoc-heading-";
  levelClassPrefix = levelClassPrefix || "bitoc-ml-";
  let id = el.getAttribute("id");
  nodeIdIndex = nodeIdIndex + 1;
  let oriId = id;
  if (!id) {
    id = idPrefix + nodeIdIndex;
  }
  const title = (el.textContent || "").trim();
  return {
    class: levelClassPrefix + level,
    title,
    parent,
    target: el,
    level,
    oriLevel,
    id,
    oriId,
    y: getOffset(el, scrollElement).y
  };
};
const fallback = function(parent, level) {
  if (!parent) {
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
const build = (headings, idPrefix, levelClassPrefix, scrollElement) => {
  if (!headings || !headings.length) {
    return { nodes: [], offsets: {} };
  }
  const offsets = {};
  const nodes = [];
  let prevNode = null;
  headings.forEach((head) => {
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
        parent = fallback(prevNode.parent, oriLevel);
        level = parent ? parent.level + 1 : 1;
      } else {
        level = prevNode.level + 1;
        parent = prevNode;
      }
    } else {
      level = 1;
      parent = null;
    }
    const node = buildNode(head, level, oriLevel, parent, idPrefix, levelClassPrefix, scrollElement);
    if (parent) {
      if (parent.nodes) {
        parent.nodes.push(node);
      } else {
        parent.nodes = [node];
      }
    } else {
      nodes.push(node);
    }
    prevNode = node;
    offsets[node.y] = node;
  });
  return { nodes, offsets };
};
const setTimer = function(fn, delay = 16) {
  let timer, canceled = false;
  let start = Date.now();
  const cancel = () => {
    canceled = true;
    timer && CAF(timer);
  };
  const loop2 = () => {
    if (canceled) {
      return;
    }
    if (Date.now() - start >= delay) {
      cancel();
      call(fn, this, timer);
      return;
    }
    timer = RAF(loop2);
  };
  loop2();
  return cancel;
};
const throttle = function(fn, duration = 24) {
  let time = null;
  return function() {
    const context = this;
    const args = arguments;
    const now2 = Date.now();
    if (!time || now2 - time > duration) {
      fn.apply(context, args);
      time = now2;
    }
  };
};
const animator = function(duration, progress, finished) {
  if (duration <= 0 || isNaN(duration)) {
    duration = 500;
  }
  const start = Date.now();
  let next = true;
  RAF(function step() {
    const p = (Date.now() - start) / duration;
    call(progress, void 0, p);
    if (p >= 1) {
      progress(1);
      next = false;
      call(finished, void 0, 1);
    }
    if (next) {
      RAF(step);
    }
  });
  return function() {
    next = false;
  };
};
const isScroll = function(el) {
  return el.scrollHeight > el.clientHeight;
};
const getOffset = function(el, scrollElement) {
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
  if (offsetParent === s.offsetParent) {
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
const scrollTop = function(el) {
  if (el === window) {
    return el.screenY;
  }
  if (el === document) {
    return document.scrollingElement.scrollTop;
  }
  return el.scrollTop;
};
const css = function(el, key, value) {
  if (key && !value) {
    return window.getComputedStyle(el).getPropertyValue(key);
  }
  el.style[key] = value;
};
const getScrollElement = function(el) {
  if (isDoc(el)) {
    return document;
  }
  if (!el || isScroll(el)) {
    return el;
  }
  const position = css(el, "position");
  if (position === "fixed" || !el.parentElement) {
    return document;
  }
  return getScrollElement(el.parentElement);
};
const scrollEnd = (el, top, finish, maxTimes) => {
  let times = 0;
  const _maxTimes = maxTimes || 100;
  return function end(el2, top2, finish2) {
    if (scrollTop(el2) === top2) {
      times = 0;
      call(finish2);
    } else {
      if (times > _maxTimes) {
        times = 0;
        call(finish2);
        return;
      }
      times += 1;
      setTimer(() => {
        end(el2, top2, finish2);
      });
    }
  }(el, top, finish);
};
const scrollTo = function(el, top, duration = 200, finish) {
  if (isScroll(el)) {
    const scrolledTop = scrollTop(el);
    const offsetTop = top - scrolledTop;
    animator(duration, (progress) => {
      el.scrollTo({
        left: 0,
        top: scrolledTop + progress * offsetTop,
        behavior: "smooth"
      });
    }, finish);
  } else {
    call(finish, void 0, 1);
  }
};
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
const slide = function(node, { delay = 0, duration = 150, easing = cubicOut } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${Math.min(t * 20, 1) * opacity}; max-height: ${t * height}px;`
  };
};
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
const locker = writable(0);
const active = writable(null);
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[18] = list[i];
  return child_ctx;
}
function create_if_block(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "bitoc-nav");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(div, "introstart", ctx[10]),
          listen(div, "introend", ctx[11]),
          listen(div, "outrostart", ctx[12]),
          listen(div, "outroend", ctx[13])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 495) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      add_render_callback(() => {
        if (div_outro)
          div_outro.end(1);
        div_intro = create_in_transition(div, slide, {});
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      if (div_intro)
        div_intro.invalidate();
      div_outro = create_out_transition(div, slide, {});
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      if (detaching && div_outro)
        div_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1(ctx) {
  let nav;
  let current;
  nav = new Nav({
    props: {
      nodes: ctx[18].nodes,
      parent: ctx[18],
      scrollOffset: ctx[6],
      onNav: ctx[5],
      scrollElement: ctx[1],
      scrollDuration: ctx[2],
      collapsedLevel: ctx[3],
      transitionEnd: ctx[7]
    }
  });
  return {
    c() {
      create_component(nav.$$.fragment);
    },
    m(target, anchor) {
      mount_component(nav, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const nav_changes = {};
      if (dirty & 1)
        nav_changes.nodes = ctx2[18].nodes;
      if (dirty & 1)
        nav_changes.parent = ctx2[18];
      if (dirty & 64)
        nav_changes.scrollOffset = ctx2[6];
      if (dirty & 32)
        nav_changes.onNav = ctx2[5];
      if (dirty & 2)
        nav_changes.scrollElement = ctx2[1];
      if (dirty & 4)
        nav_changes.scrollDuration = ctx2[2];
      if (dirty & 8)
        nav_changes.collapsedLevel = ctx2[3];
      if (dirty & 128)
        nav_changes.transitionEnd = ctx2[7];
      nav.$set(nav_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(nav.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(nav.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(nav, detaching);
    }
  };
}
function create_each_block(ctx) {
  let a;
  let t0_value = ctx[18].title + "";
  let t0;
  let a_href_value;
  let a_class_value;
  let handler_action;
  let t1;
  let if_block_anchor;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[18].nodes && ctx[18].nodes.length && create_if_block_1(ctx);
  return {
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(a, "href", a_href_value = "#" + ctx[18].id);
      attr(a, "class", a_class_value = ctx[18].class);
      toggle_class(a, "active", ctx[8] === ctx[18]);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = action_destroyer(handler_action = ctx[9].call(null, a, ctx[18]));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if ((!current || dirty & 1) && t0_value !== (t0_value = ctx[18].title + ""))
        set_data(t0, t0_value);
      if (!current || dirty & 1 && a_href_value !== (a_href_value = "#" + ctx[18].id)) {
        attr(a, "href", a_href_value);
      }
      if (!current || dirty & 1 && a_class_value !== (a_class_value = ctx[18].class)) {
        attr(a, "class", a_class_value);
      }
      if (handler_action && is_function(handler_action.update) && dirty & 1)
        handler_action.update.call(null, ctx[18]);
      if (dirty & 257) {
        toggle_class(a, "active", ctx[8] === ctx[18]);
      }
      if (ctx[18].nodes && ctx[18].nodes.length) {
        if (if_block) {
          if_block.p(ctx, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (detaching)
        detach(t1);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$1(ctx) {
  let show_if = !ctx[14](ctx[8], ctx[4]);
  let if_block_anchor;
  let current;
  let if_block = show_if && create_if_block(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 272)
        show_if = !ctx2[14](ctx2[8], ctx2[4]);
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 272) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let $locker;
  let $active;
  component_subscribe($$self, locker, ($$value) => $$invalidate(16, $locker = $$value));
  component_subscribe($$self, active, ($$value) => $$invalidate(8, $active = $$value));
  let { nodes = [] } = $$props;
  let { scrollElement } = $$props;
  let { scrollDuration } = $$props;
  let { collapsedLevel } = $$props;
  let { parent = null } = $$props;
  let { onNav = null } = $$props;
  let { scrollOffset = 0 } = $$props;
  let { transitionStart = null } = $$props;
  let { transitionEnd = null } = $$props;
  const handler = function(el, node) {
    node.element = el;
    let _heading = node;
    const click = function(e) {
      set_store_value(active, $active = _heading, $active);
      let el2 = scrollElement;
      if (scrollElement.scrollingElement) {
        el2 = scrollElement.scrollingElement;
      }
      const offsetTop = _heading.y - scrollOffset;
      set_store_value(locker, $locker = $locker + 1, $locker);
      scrollTo(el2, offsetTop, scrollDuration, function() {
        if (typeof onNav !== "function") {
          scrollEnd(el2, offsetTop, () => {
            set_store_value(locker, $locker = $locker - 1, $locker);
          });
          return;
        }
        onNav(e.target, _heading, function() {
          scrollEnd(el2, offsetTop, () => {
            set_store_value(locker, $locker = $locker - 1, $locker);
          });
        });
      });
    };
    el.addEventListener(clickEvent, click);
    return {
      update(next) {
        _heading = next;
        _heading.element = el;
      },
      destory() {
        node.element = null;
        _heading = null;
        el.removeEventListener(clickEvent, click);
      }
    };
  };
  const introstart = (e) => {
    set_store_value(locker, $locker = $locker + 1, $locker);
    call(transitionStart, void 0, e);
  };
  const introend = (e) => {
    set_store_value(locker, $locker = $locker - 1, $locker);
    call(transitionEnd, void 0, e);
  };
  const outrostart = (e) => {
    set_store_value(locker, $locker = $locker + 1, $locker);
    call(transitionStart, void 0, e);
  };
  const outroend = (e) => {
    set_store_value(locker, $locker = $locker - 1, $locker);
    call(transitionEnd, void 0, e);
  };
  const isChain = function(activeNode, parentNode) {
    if (activeNode && parentNode) {
      if (activeNode === parentNode) {
        return true;
      }
      return isChain(activeNode.parent, parentNode);
    }
    return false;
  };
  const isCollapsed = function(activeNode, parentNode) {
    if (!activeNode || !parentNode) {
      return false;
    }
    return parentNode.level + 1 > collapsedLevel && !isChain(activeNode, parentNode);
  };
  $$self.$$set = ($$props2) => {
    if ("nodes" in $$props2)
      $$invalidate(0, nodes = $$props2.nodes);
    if ("scrollElement" in $$props2)
      $$invalidate(1, scrollElement = $$props2.scrollElement);
    if ("scrollDuration" in $$props2)
      $$invalidate(2, scrollDuration = $$props2.scrollDuration);
    if ("collapsedLevel" in $$props2)
      $$invalidate(3, collapsedLevel = $$props2.collapsedLevel);
    if ("parent" in $$props2)
      $$invalidate(4, parent = $$props2.parent);
    if ("onNav" in $$props2)
      $$invalidate(5, onNav = $$props2.onNav);
    if ("scrollOffset" in $$props2)
      $$invalidate(6, scrollOffset = $$props2.scrollOffset);
    if ("transitionStart" in $$props2)
      $$invalidate(15, transitionStart = $$props2.transitionStart);
    if ("transitionEnd" in $$props2)
      $$invalidate(7, transitionEnd = $$props2.transitionEnd);
  };
  return [
    nodes,
    scrollElement,
    scrollDuration,
    collapsedLevel,
    parent,
    onNav,
    scrollOffset,
    transitionEnd,
    $active,
    handler,
    introstart,
    introend,
    outrostart,
    outroend,
    isCollapsed,
    transitionStart
  ];
}
class Nav extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      nodes: 0,
      scrollElement: 1,
      scrollDuration: 2,
      collapsedLevel: 3,
      parent: 4,
      onNav: 5,
      scrollOffset: 6,
      transitionStart: 15,
      transitionEnd: 7
    });
  }
}
function add_css(target) {
  append_styles(target, "svelte-f3ug8b", '.bitoc.svelte-f3ug8b.svelte-f3ug8b,.bitoc.svelte-f3ug8b .svelte-f3ug8b{box-sizing:border-box}.bitoc-fixed{position:fixed !important}.bitoc.svelte-f3ug8b.svelte-f3ug8b{width:100%;position:relative;overflow-y:auto;-ms-overflow-style:none;overflow:-moz-scrollbars-none;scroll-behavior:smooth}.bitoc.svelte-f3ug8b.svelte-f3ug8b::-webkit-scrollbar{width:0 !important}.bitoc-nav a{display:block;padding:0.2rem 1.7rem;font-size:0.9rem;text-decoration:none;color:#555;position:relative;transition:all 0.25s}.bitoc-nav{overflow:hidden;transition:max-height 0.25s}.bitoc-nav a:before{content:" ";height:0.25rem;width:0.25rem;background:#555;position:absolute;top:0.72rem;left:1rem}.bitoc-nav a:hover, .bitoc-nav a.active{color:#009a61}.bitoc-nav a.active::before, .bitoc-nav a:hover:before{background:#009a61}.bitoc-nav a.bitoc-ml-2{margin-left:1rem !important}.bitoc-nav a.bitoc-ml-3{margin-left:2rem !important}.bitoc-nav a.bitoc-ml-4{margin-left:3rem !important}.bitoc-nav a.bitoc-ml-5{margin-left:4rem !important}.bitoc-nav a.bitoc-ml-6{margin-left:5rem !important}');
}
function create_fragment(ctx) {
  let main;
  let div;
  let nav;
  let current;
  nav = new Nav({
    props: {
      scrollOffset: ctx[2],
      collapsedLevel: ctx[0],
      scrollDuration: ctx[1],
      nodes: ctx[3],
      scrollElement: ctx[5],
      transitionEnd: ctx[6]
    }
  });
  return {
    c() {
      main = element("main");
      div = element("div");
      create_component(nav.$$.fragment);
      attr(div, "class", "bitoc-navs svelte-f3ug8b");
      attr(main, "class", "bitoc svelte-f3ug8b");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div);
      mount_component(nav, div, null);
      ctx[20](main);
      current = true;
    },
    p(ctx2, dirty) {
      const nav_changes = {};
      if (dirty[0] & 4)
        nav_changes.scrollOffset = ctx2[2];
      if (dirty[0] & 1)
        nav_changes.collapsedLevel = ctx2[0];
      if (dirty[0] & 2)
        nav_changes.scrollDuration = ctx2[1];
      if (dirty[0] & 8)
        nav_changes.nodes = ctx2[3];
      nav.$set(nav_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(nav.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(nav.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      destroy_component(nav);
      ctx[20](null);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $locker;
  let $active;
  component_subscribe($$self, locker, ($$value) => $$invalidate(24, $locker = $$value));
  component_subscribe($$self, active, ($$value) => $$invalidate(25, $active = $$value));
  let { contentElement } = $$props;
  let { scrollElement } = $$props;
  let { fixedElement } = $$props;
  let { headingSelector = "h1, h2, h3, h4, h5, h6" } = $$props;
  let { collapsedLevel = 3 } = $$props;
  let { idPrefix = "" } = $$props;
  let { levelClassPrefix = "" } = $$props;
  let { scrollDuration = 200 } = $$props;
  let { fixedOffset = 0 } = $$props;
  let { fixedClassName = "bitoc-fixed" } = $$props;
  let { scrollOffset = 0 } = $$props;
  let { beforeFixed = null } = $$props;
  let { afterFixed = null } = $$props;
  const reset = function() {
    parseHeadings();
    onscroll();
  };
  const isEmpty = function() {
    return nodes.length === 0;
  };
  const syncScroll = function() {
    oriFixedOffset = getOffset(fixedElement || tocMain, document.documentElement).y;
    onscroll();
  };
  let nodes = [];
  let offset2Node = {};
  let tocMain = null;
  let oriFixedOffset = 0;
  let realScrollElement = getScrollElement(scrollElement);
  let offsets = [];
  const parseHeadings = function() {
    const headings = contentElement.querySelectorAll(headingSelector);
    const result = build(headings, idPrefix, levelClassPrefix, realScrollElement);
    $$invalidate(3, nodes = result.nodes);
    offset2Node = result.offsets;
    offsets = Object.keys(offset2Node).map(Number);
    const offsetY = scrollOffsetY();
    if (offset2Node[offsetY]) {
      set_store_value(active, $active = offset2Node[offsetY], $active);
    }
  };
  const scrollOffsetY = function() {
    const top = scrollTop(realScrollElement);
    return offsets.find((y) => y >= top);
  };
  const scrollActive = function(finish) {
    if (isEmpty()) {
      return;
    }
    const offsetY = scrollOffsetY();
    const node = offset2Node[offsetY];
    if (offsetY !== void 0 && node) {
      set_store_value(active, $active = node, $active);
      const el = node.element;
      scrollNav(el, finish);
    } else {
      call(finish);
    }
  };
  const scrollNav = function(el, finish) {
    if (isEmpty()) {
      call(finish);
      return;
    }
    let tocScrollElement = tocMain;
    if (el && tocScrollElement) {
      let top = getOffset(el, tocScrollElement).y;
      const tocOffsetHeight = tocScrollElement.offsetHeight;
      const tocScrollHeight = tocScrollElement.scrollHeight;
      const maxScrollOffset = tocScrollHeight - tocOffsetHeight;
      const halfTocOffsetHeight = tocOffsetHeight / 2;
      if (top <= halfTocOffsetHeight) {
        top = 0;
      } else if (top - tocOffsetHeight > maxScrollOffset) {
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
  const tocFixed = function() {
    if (isEmpty()) {
      return;
    }
    if (fixedOffset !== false && fixedClassName && isDoc(realScrollElement)) {
      const _fixedElement = fixedElement || tocMain;
      const scrollElementTop = scrollTop(document);
      let _fixedOffset = fixedOffset;
      if (!_fixedOffset) {
        _fixedOffset = oriFixedOffset;
      }
      if (scrollElementTop >= _fixedOffset) {
        if (!_fixedElement.classList.contains(fixedClassName)) {
          if (call(beforeFixed, void 0, true) === false) {
            return;
          }
          _fixedElement.classList.add(fixedClassName);
          call(afterFixed, void 0, true);
        }
      } else {
        if (_fixedElement.classList.contains(fixedClassName)) {
          if (call(beforeFixed, void 0, false) === false) {
            return;
          }
          _fixedElement.classList.remove(fixedClassName);
          call(afterFixed, void 0, false);
        }
      }
    }
  };
  const scrollHandler = function() {
    tocFixed();
    if ($locker === 0) {
      scrollActive();
    }
  };
  const onscroll = function() {
    scrollThrottleHandler();
  };
  const transitionEnd = () => {
    scrollHandler();
  };
  const scrollThrottleHandler = throttle(scrollHandler, 16);
  onMount(() => {
    oriFixedOffset = getOffset(fixedElement || tocMain, document.documentElement).y;
    onscroll();
    realScrollElement.addEventListener("scroll", onscroll);
    return () => {
      realScrollElement.removeEventListener("scroll", onscroll);
    };
  });
  function main_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tocMain = $$value;
      $$invalidate(4, tocMain);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("contentElement" in $$props2)
      $$invalidate(7, contentElement = $$props2.contentElement);
    if ("scrollElement" in $$props2)
      $$invalidate(8, scrollElement = $$props2.scrollElement);
    if ("fixedElement" in $$props2)
      $$invalidate(9, fixedElement = $$props2.fixedElement);
    if ("headingSelector" in $$props2)
      $$invalidate(10, headingSelector = $$props2.headingSelector);
    if ("collapsedLevel" in $$props2)
      $$invalidate(0, collapsedLevel = $$props2.collapsedLevel);
    if ("idPrefix" in $$props2)
      $$invalidate(11, idPrefix = $$props2.idPrefix);
    if ("levelClassPrefix" in $$props2)
      $$invalidate(12, levelClassPrefix = $$props2.levelClassPrefix);
    if ("scrollDuration" in $$props2)
      $$invalidate(1, scrollDuration = $$props2.scrollDuration);
    if ("fixedOffset" in $$props2)
      $$invalidate(13, fixedOffset = $$props2.fixedOffset);
    if ("fixedClassName" in $$props2)
      $$invalidate(14, fixedClassName = $$props2.fixedClassName);
    if ("scrollOffset" in $$props2)
      $$invalidate(2, scrollOffset = $$props2.scrollOffset);
    if ("beforeFixed" in $$props2)
      $$invalidate(15, beforeFixed = $$props2.beforeFixed);
    if ("afterFixed" in $$props2)
      $$invalidate(16, afterFixed = $$props2.afterFixed);
  };
  {
    parseHeadings();
  }
  return [
    collapsedLevel,
    scrollDuration,
    scrollOffset,
    nodes,
    tocMain,
    realScrollElement,
    transitionEnd,
    contentElement,
    scrollElement,
    fixedElement,
    headingSelector,
    idPrefix,
    levelClassPrefix,
    fixedOffset,
    fixedClassName,
    beforeFixed,
    afterFixed,
    reset,
    isEmpty,
    syncScroll,
    main_binding
  ];
}
class Toc extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      contentElement: 7,
      scrollElement: 8,
      fixedElement: 9,
      headingSelector: 10,
      collapsedLevel: 0,
      idPrefix: 11,
      levelClassPrefix: 12,
      scrollDuration: 1,
      fixedOffset: 13,
      fixedClassName: 14,
      scrollOffset: 2,
      beforeFixed: 15,
      afterFixed: 16,
      reset: 17,
      isEmpty: 18,
      syncScroll: 19
    }, add_css, [-1, -1]);
  }
  get reset() {
    return this.$$.ctx[17];
  }
  get isEmpty() {
    return this.$$.ctx[18];
  }
  get syncScroll() {
    return this.$$.ctx[19];
  }
}
const selector = function(el, propName, def, allow) {
  if (!el && allow) {
    return void 0;
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
      afterFixed
    } = options || {};
    el = selector(el, "mount");
    const contentElement = selector(contentSelector, "contentSelector", document.body);
    const scrollElement = selector(scrollSelector, "scrollSelector", document.body);
    const fixedElement = selector(fixedSelector, "fixedSelector", null, true);
    this.toc = new Toc({
      target: el,
      props: {
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
        afterFixed
      }
    });
  }
  reset() {
    this.toc.reset();
  }
  isEmpty() {
    return this.toc.isEmpty();
  }
  syncScroll() {
    this.toc.syncScroll();
  }
}
export { TocHelper as default };
