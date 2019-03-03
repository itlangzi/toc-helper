 
'use strict';


const doc = document,
    win = window,
    body = doc.body,
    $ = doc.querySelector.bind(doc),
    $$ = doc.querySelectorAll.bind(doc),
    isMobile = (/Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)),
    enterEvent = isMobile ? 'touchstart' : 'mouseenter',
    leaveEvent = isMobile ? 'touchend' : 'mouseleave',
    clickEvent = isMobile ? 'touchend' : 'click',
    scrollEvent = 'scroll',
    isHTMLElement = function (el) {
        return el instanceof HTMLElement
    },
    isString = function (o) {
        return typeof o === 'string'
    },
    isObject = function (o) {
        return Object.prototype.toString.call(o) === '[object Object]'
    },
    getDom = (selector) => {
        try {
            return $(selector)
        } catch (error) {
            return null
        }
    },
    css = function (el, key, value) {
        if (el && !value) {
            return win.getComputedStyle(el).getPropertyValue(key)
        }
        el.style[key] = value
    }


const CLASS_NAMES = {
    TOC: 'toc'
}
const SELECTORS = {
    DATA_TOC: '*[data-toc]'
}
const defaultOptions = {
    dom: SELECTORS.DATA_TOC,
    classNames: {
        toc: CLASS_NAMES.TOC,
        fxied: `${CLASS_NAMES.TOC}-fixed`,
        brand: `${CLASS_NAMES.TOC}-brand`,
        navbar: `${CLASS_NAMES.TOC}-navbar`,
        hightlight: `${CLASS_NAMES.TOC}-hightlight`,
        nav: `${CLASS_NAMES.TOC}-nav`,
        link: `${CLASS_NAMES.TOC}-link`,
        active: 'active',
        marginLeft1: 'ml-1',
        marginLeft2: 'ml-2',
        marginLeft3: 'ml-3',
        marginLeft4: 'ml-4',
        marginLeft5: 'ml-5',
        marginLeft6: 'ml-6'
    },
    hightlight: true,
    brand: '目录',
    shadow: 'shadow',
    idPrefix: 'toc-heading-',
    offsetBody: body,
    topFixed: {
        top: 24,
        left: 0
    },
    maxDepth: 6
}

const TocHelper = function (selector, options = defaultOptions) {

    if (isString(selector) || isHTMLElement(selector)) {
        options.dom = selector
    } else if (isObject(selector)) {
        options = selector
    }
    this.options = Object.assign({}, defaultOptions, options)

    this.megre()

    return this

}

TocHelper.prototype = {
    megre: function (newOptions = {}) {
        if (!isObject(newOptions)) return
        this.options = Object.assign({}, this.options, newOptions)

        if (isString(this.options.dom)) {
            this.options.dom = $(this.options.dom) || $(SELECTORS.DATA_TOC)
        }
        if (!this.options.dom || !isHTMLElement(this.options.dom)) {
            throw new Error('Not found any content, Please sure this dom is exist')
        }

        let maxDepth = null
        this.options.maxDepth = (maxDepth = parseInt(this.options.maxDepth || 6), maxDepth >= 1 && maxDepth <= 6 ? maxDepth : 6)

        let offsetBody = this.options.offsetBody
        if (!offsetBody || offsetBody === body) {
            this.options.offsetBody = body
        } else if (isHTMLElement(offsetBody)) {
            const position = css(offsetBody, 'position')
            this.options.offsetBody = position && position !== 'static' ? offsetBody : body
        } else if (isString(offsetBody)) {
            const _offsetBody = getDom(offsetBody)
            if (!_offsetBody || _offsetBody === body) {
                this.options.offsetBody = body
            } else {
                const position = css(_offsetBody, 'position')
                this.options.offsetBody = position && position !== 'static' ? _offsetBody : body
            }
        } else {
            this.options.offsetBody = body
        }

        this.toc = $(this.options.dom.dataset.toc) || $(`.${this.options.classNames.toc}`)
        const tocClassList = this.toc && this.toc.classList
        tocClassList && !tocClassList.contains(this.options.classNames.toc) && tocClassList.add(this.options.classNames.toc)

        return this
    },
    reload: function () {

        this.hightlight = this.options.hightlight === true ? $(`.${this.options.classNames.hightlight}`) : null

        this.tocEvent()

        this.fixed()

        this.shadow()

        !this.elements && (this.elements = this.loadHeadings());
        this.events = [this.offsetBodyScrollEvent.bind(this)]
        
        this.offsetBodyScrollDebounce()
        // 默认读取hash
        this.setActive($(`.${this.options.classNames.toc} a[href="${location.hash}"]`))
    },
    offsetBodyScrollEvent: function(){
        this.scollToc.call(this)
    },
    addOffsetBodyScrollEvent: function () {
        const el = this.options.offsetBody === body ? win : this.options.offsetBody
        el.addEventListener(scrollEvent, this.events[0])
    },
    removeOffsetBodyScrollEvent: function () {
        const el = this.options.offsetBody === body ? win : this.options.offsetBody
        el.removeEventListener(scrollEvent, this.events[0])
    },
    offsetBodyScrollDebounce: function () {
        this.removeOffsetBodyScrollEvent()
        // 防止抖动
        this.debounce(this.addOffsetBodyScrollEvent, 200).call(this)
    },
    reset: function () {

        this.clear()

        const frag = doc.createDocumentFragment()
        const elements = this.elements = this.loadHeadings(),
            targets = elements.targets,
            levels = elements.levels

        // 创建 brand = 目录
        if (typeof this.options.brand === 'string') {
            const brand = doc.createElement('div')
            brand.classList.add(this.options.classNames.brand)
            brand.textContent = this.options.brand
            frag.appendChild(brand)
        }

        // 创建navbar
        const navbar = doc.createElement('div')
        navbar.classList.add(this.options.classNames.navbar)
        frag.appendChild(navbar)

        // 创建hightlight
        if (this.options.hightlight === true) {
            const hightlight = doc.createElement('div')
            hightlight.classList.add(this.options.classNames.hightlight)
            navbar.appendChild(hightlight)
        }

        const navClassName = this.options.classNames.nav
        // 将节点添加到文档中
        let lastNavNode = null, lastLevel = 1;
        levels.forEach((level, index, thisArray) => {
            const target = targets[index]
            if(!target) return 

            if (index === 0 || thisArray[index - 1] !== level) {
                // 创建nav
                const nav = doc.createElement('nav')
                nav.classList.add(navClassName)
                nav.appendChild(target)

                if (level === 1) {
                    // 层级为1 
                    navbar.appendChild(nav)
                } else if (level >= lastLevel) {
                    lastNavNode.appendChild(nav)
                } else {
                    let _lastLevelNode = lastNavNode.parentNode
                    for (let i = 0; i < lastLevel - level - 1; i++) {
                        _lastLevelNode = _lastLevelNode.parentNode
                    }
                    _lastLevelNode && _lastLevelNode.appendChild(nav)
                }
                lastNavNode = nav
                lastLevel = level

            } else {
                lastNavNode.appendChild(target)
            }
        })

        this.toc.appendChild(frag)

        this.reload()
    },
    scrollTop: function () {
        const offsetBody = this.options.offsetBody
        return offsetBody === win ? offsetBody.pageYOffset : offsetBody === body ? doc.documentElement.scrollTop || body.scrollTop : offsetBody.scrollTop
    },
    // __GID().next().value
    GID: function() {
        let current_id = 0,
            idPrefix = this.options.idPrefix
        /* while (true) {
            current_id++
            yield `${idPrefix}${current_id}`
        } */
        return {
            next: function(){
                current_id ++ ;
                const value = `${idPrefix}${current_id}`
                return {
                    value: value
                }
            }
        }
    },
    /* throttle: function (fn, delay) {
        const _this = this
        return function () {
            const now = +new Date(), self = this, args = arguments
            if (_this.lastTime && _this.lastTime < now + delay) {
                !_this.timer && (_this.timer = setTimeout(() => {
                    clearTimeout(_this.timer)
                    _this.lastTime = now
                    _this.timer = null
                    fn.apply(self, args)
                }, delay))
            } else {
                clearTimeout(_this.timer)
                _this.lastTime = now
                _this.timer = null
                fn.apply(self, args)
            }
        }
    }, */
    debounce: function (fn, delay) {
        return function () {
            var _this = this, args = arguments
            fn.timer && clearTimeout(fn.timer)

            fn.timer = setTimeout(() => {
                fn.apply(_this, args)
            }, delay)
        }
    },
    empty: function (parent) {
        if (!parent || !isHTMLElement(parent)) return
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild)
        }
    },
    clear: function () {
        this.empty(this.toc)
        this.elements = null
    },

    scollToc: function () {
        const _this = this,
            elements = this.elements,
            offsets = elements.offsets,
            targets = elements.targets,
            top = _this.scrollTop(),
            // 判断当前滚动条在那个区间
            index = offsets.findIndex(el => Number(el) > top)

        let tocLink = null;
        if (index === 0) {
            tocLink = targets[index]
        } else if (index > 0) {
            const preOffsetTop = offsets[index - 1]
            const curOffsetTop = offsets[index]
            const offset = Math.abs((curOffsetTop - preOffsetTop) / 4)
            if (top < offset + preOffsetTop && top >= preOffsetTop) {
                tocLink = targets[index - 1]
            } else if (top <= curOffsetTop && top > curOffsetTop - offset) {
                tocLink = targets[index]
            }
        }
        tocLink && (this.setActive(tocLink))
    },
    /**
     * 获取heading对应的信息
     * @returns levels 所有元素的层级
     * @returns offsets heading元素的偏移量
     * @returns sources heading元素集合
     * @returns targets heading元素对于的目录元素
     */
    loadHeadings: function () {
        const _this = this, maxDepth = this.options.maxDepth,
            rootLevel = 1, lastLevel = maxDepth,
            headings = Array.from(this.options.dom.querySelectorAll(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, maxDepth).join(',')) || []),
            GID_GENERATE = this.GID()

        /**
         * 元素退级处理
         * @param {*} headings heading元素集合
         * @param {*} curIndex 当前元素在headings集合中的下表
         * @param {*} curOriginaLevel 当前元素原始的层级
         */
        const backLevel = function (headings, curIndex, curOriginaLevel) {

            // if (headings[curIndex].textContent.indexOf('Test') > -1) debugger

            // 小于1 和当前为第一个heading的层级均为1
            if (curOriginaLevel <= rootLevel || curIndex === 0) return rootLevel

            // 大于最大层级的heading层级均为maxDepth
            if (curOriginaLevel > lastLevel) return lastLevel

            // 将当前heading的层级和heading之前的层级对比，进行退级或保留层级操作
            const _headings = headings.filter((head, i) => i < curIndex)

            for (let i = _headings.length - 1; i >= 0; i--) {

                // 上一个heading的层级 - 经过退级操作的层级
                const preLevel = _headings[i][1]
                // 上一个heading
                const preHeading = _headings[i][3]
                
                // 上一个heading的元素原始层级
                const preOriginaLevel = +preHeading.nodeName[1]

                if (curOriginaLevel < preOriginaLevel) {
                    // 当前层级比上一层级小直接退级到上一层级 - 对比原始层级
                    if (curOriginaLevel > preLevel) {
                        // 当前层级比上一层级退级的大
                        return preLevel
                    }
                    return curOriginaLevel//preLevel
                } else if (curOriginaLevel === preOriginaLevel) {
                    // 当前层级于上一层级相等直接等于上一层级 - 对比原始层级
                    return preLevel
                } else if (preOriginaLevel < curOriginaLevel) {
                    // 当前层级比上一层级大 ， 退级到上一层级+1 - 对比原始层级
                    // 此处对比原始层级无意义
                    return preLevel + 1
                }
                // 继续 对比
            }
        }
        /**
         * 设置heading的id
         * @param {*} heading 给没有ID或ID重复的heading设置Id
         */

        const setId = function (heading) {
            if (!heading.id || $$(`#${heading.id}`).length !== 1) {
                heading.id = GID_GENERATE.next().value
            }
            return heading
        }
        /**
         * 获取当前heading元素到offsetBody元素的距离
         * @param {*} heading  heading元素
         */
        const getOffsetY = function (heading) {
            let y = heading.offsetTop
            if (heading.offsetParent && heading.offsetParent !== _this.options.offsetBody) {
                y += getOffsetY(heading.offsetParent)
            }
            return y
        }
        /**
         * 获取toclink
         * @param {*} heading 
         * @param {*} level 
         */
        const loadTocLink = function (heading, level) {
            if(!heading.textContent.replace(/\s/g,'')) return false
            let tocLink = _this.toc.querySelector(`a[href="#${heading.id}"]`)
            if (!tocLink) {
                // 不存在就创建一个
                tocLink = doc.createElement('a')
                tocLink.href = `#${heading.id}`
                tocLink.classList.add(_this.options.classNames.link)
                if (level >= 2) {
                    tocLink.classList.add(`${_this.options.classNames[`marginLeft${level - 1}`]}`)
                }
                tocLink.textContent = heading.textContent
            }
            return tocLink
        }

        headings.forEach((heading, i, thisArray) => {
            // 获取层级
            const level = backLevel(thisArray, i, +heading.nodeName[1]),
                // 获取当前heading元素距离父级的距离
                y = getOffsetY(heading)
            // 设置ID
            setId(heading)
            // 获取toc目录
            const tocLink = loadTocLink(heading, level)
            /* if(tocLink === false){
                thisArray.splice(i, 1)
                i = i - 1
            }else{
            } */
            /* * @returns 0 heading元素下标 */
            /* * @returns 1 heading元素的层级 */
            /* * @returns 2 heading到父级（offsetBody ）的距离*/
            /* * @returns 3 heading元素本身 */
            /* * @returns 4 heading元素对应的link元素 */
            // [0, level, offsetTop, element, tocLinkElement]
            thisArray.splice(i, 1, [i, level, y, heading, tocLink])

        })

        const levels = [], offsets = [], sources = [], targets = []
        headings.forEach((headingItem, i) => {
            levels[i] = headingItem[1]
            offsets[i] = headingItem[2]
            sources[i] = headingItem[3]
            targets[i] = headingItem[4]
        })
        const elements = {
            levels: levels,
            offsets: offsets,
            sources: sources,
            targets: targets
        }
        return elements
    },
    setHash: function () {
        const hash = this.active ? this.active.getAttribute('href') : null
        hash && (location.hash = hash)
    },
    setActive: function (el) {

        let active = this.active,
            classList = active ? active.classList : []

        const activeClassName = this.options.classNames.active,
            defaultActiveSelector = `.${this.options.classNames.link}.${this.options.classNames.active}`

        // 移除激活状态
        active && classList.contains(activeClassName) && classList.remove(activeClassName)

        active = this.active = el && isHTMLElement(el) ? el : $(defaultActiveSelector)
        classList = active && (active.classList || [])

        // 激活状态
        active && !classList.contains(activeClassName) && classList.add(activeClassName)

        // 设置高亮
        this.setHightlight(active)

        // this.setHash()
    },
    setHightlight: function (active) {
        if (!this.hightlight) return

        if (!active) {
            this.hightlight.style.top = 0
            this.hightlight.style.height = 0
        } else {

            const activeOffset = {
                y: active.offsetTop,
                height: active.offsetHeight
            }
            this.hightlight.style.top = activeOffset.y + 'px'
            this.hightlight.style.height = activeOffset.height + 'px'
        }
    },
    __enter: function (e) {
        this.setHightlight(e.target)
    },
    __leave: function () {
        this.setActive(this.active)
    },
    __click: function (e) {
        // 防止滚动条抖动
        this.offsetBodyScrollDebounce()
        this.setActive(e.target)
    },
    // toc 事件
    tocEvent: function () {
        if (!this.hightlight) return

        const _this = this
        Array.from($$(`.${this.options.classNames.toc} .${this.options.classNames.link}`) || []).forEach(a => {
            a.addEventListener(enterEvent, _this.__enter.bind(_this))
            a.addEventListener(leaveEvent, _this.__leave.bind(_this))
            a.addEventListener(clickEvent, _this.__click.bind(_this))
        })

    },
    // 阴影
    shadow: function () {
        if (this.options.shadow === false) return
        this.toc && !this.toc.classList.contains(this.options.shadow) && this.toc.classList.add(this.options.shadow)
    },
    // fixed
    fixed: function () {
        const toc = this.toc
        let topFixed = this.options.topFixed
        if (!toc) return
        const tocFixedClassName = this.options.classNames.fxied
        const classList = toc.classList
        if (topFixed === false) {
            toc.style.top = 'inherit'
            toc.style.left = 'inherit'
            classList.contains(tocFixedClassName) && classList.remove(tocFixedClassName)
        } else {
            !classList.contains(tocFixedClassName) && classList.add(tocFixedClassName)
            topFixed.top && (toc.style.top = topFixed.top + 'px')
            topFixed.left && (toc.style.left = topFixed.left + 'px')
        }
    }
}

module.exports = TocHelper
module.exports.default = TocHelper