# toc-helper

<center>
    <img src="./demo/logo.svg" title="toc-helper" alt="toc-helper" style="width: 64px">
</center>

`TocHelper` 是一款给文章自动生成目录及侧边栏目录滚动特效的插件

> v1 [入口](https://github.com/itlangzi/toc-helper/blob/v1/README.md)

> 预览 [`Demo`](http://itlangzi.com/s/toc-helper.html)


# 一、 v2 特性
- 简介，减少了大量的配置，去除不必要的API，仅需要引入一个js文件
- 性能优化，联动滚动更加流畅，自动停靠顶部更加精准
- 目录支持自动展开、折叠
- 自动定位，初始目录高亮位置自动识别
- 支持显示、隐藏、自适应宽度变化
- 支持非标题标签, 但需要提供 `data-level` 属性
- 支持内容局部滚动（非`body`, 内容`div`滚动）
- 支持 `React、Vue、Svelte`

# 二、 使用
## 浏览器
1. 引入JS
```js
<script src="lib/umd/index.js"></script>
```
> `esmodule` 引入 `lib/es/index.js`

2. 使用
```js
new TocHelper(el [, options])
```

## npm方式
### 1. 安装
```bash
npm install toc-helper --save 
# 或者
yarn add toc-helper
```
### 2. 使用  
#### 2.1 `require`
```js
const TocHelper = require('toc-helper')
new TocHelper(el [, options])
```

#### 2.2 `import`
```js
import TocHelper from 'toc-helper'
new TocHelper(el [, options])
```
#### 2.3 `React` 示例
##### 2.3.1 普通模式
  ```js
  import TocHelper from 'toc-helper'
  class App extends React.PureComponent{
    constructor(props){
      super(props)
      this.ref = null
    }
    componentDidMount(){
      new TocHelper(this.ref [, options])
    }
    render(){
      return <div ref={ref => this.ref = ref} />
    }
  } 
  ```
##### 2.3.2 Hook 模式
   ```js
  import TocHelper from 'toc-helper'
  export default App(){
    const ref = useRef()
    useEffect(()=>{
      new TocHelper(ref [, options])
    })
    return <div ref={ref} />
  }
  ```
#### 2.4 `vue` 示例 `v3`
```js
<script>
  import TocHelper from 'toc-helper'
  setup(props, { emit }) {
    const toc = ref(null);
    let helper = null;
    onMounted(function () {
      helper = new TocHelper(toc [, options]);
    });

    return { toc };
  },
</script>
<template>
  <div ref="toc"></div>
</template>
```
#### 2.5 `svelte` 示例
```js
<script>
  import TocHelper from 'toc-helper'
  let toc = null
  let helper = null
  onMount(function(){
    helper = new TocHelper(toc [, options])
  })
</script>
<div bind:this={toc}/>
```
# 三、API
## **`TocHelper(selector [, options])`**
> 构造器方法, 只能通过 new 创建实例  

**selector**  
类型：`string` | `HTMLElement`  
默认值：`无`  
必须：`是`
> selector 若为字符串，则必须是选择器，切可以通过`ducument.querySelector`获取相应的元素，否则将报错

**options**  
类型：`object` | `undefined`  
默认值：`无`  
必须：`可选`

## **`resetHeadings`**  
> 无参  

实例方法，重新解析 `heading`, 若数据是异步获取，该方法会有用

## **`isEmpty`**  
> 无参

实例方法，判断是否有 `heading`


# 四、配置  
## **`options`**
### 1. `contentSelector`  
类型: `string` | `HTMLElement`  
默认值: `document.body`  

> 若为字符串，则必须是选择器，切可以通过`ducument.querySelector`获取相应的元素

通过该选择器解析内容中的目录元素

### 2. `scrollSelector`  
类型: `string` | `HTMLElement`  
默认值: `document.body`  
> 若为字符串，则必须是选择器，切可以通过`ducument.querySelector`获取相应的元素

滚动元素的选择器; 若内容不是整个文档，且滚动也不是整个文档，是局部内容的局部咕哝则需要指定该值，否则目录无法同步滚动  

### 3. `fixedSelector`  
类型: `string` | `HTMLElement`  
默认值: `目录本身`  
> 若为字符串，则必须是选择器，切可以通过`ducument.querySelector`获取相应的元素

文档滚动到该选择器元素的位置就停靠在顶部

### 4. `headingSelector`  
类型: `string`  
默认值: `h1, h2, h3, h4, h5, h6`  

内容元素通过该选择器解析出所有的目录  

> 1. 可以不是`h`标签，但是标签要提供属性 `data-level` 已指定当前目录的层级  
> 2. 具体用法是`[contentSelector].querySelectorAll(headingSelector)`, 所以需要正确配置 `contentSelector`和`headingSelector`, 否则解析的目录将会为空


### 5. `collapsedLevel`  
类型: `number`  
默认值: `3`

该层级以上的目录将默认折叠(隐藏)，当内容滚动该位置对应的目录或点击后都将自动展开，之后又将折叠  


### 6. `idPrefix`  
类型: `string`  
默认值: `bitoc-heading-`

目录ID的前缀

> 仅影响目录本身，不影响内容  

### 7. `levelClassPrefix`  
类型: `string`  
默认值: `bitoc-ml-`

层级偏移样式前缀，默认二级目录偏移`1rem`, 三级目录偏移`2rem`, 以此累加；可用样式更改，默认样式名

- 一级目录: bitoc-ml-1
- 二级目录: bitoc-ml-2
- 三级目录: bitoc-ml-3
- 四级目录: bitoc-ml-4
- 五级目录: bitoc-ml-5
- 六级目录: bitoc-ml-6


### 8. `scrollDuration`  
类型: `number`  
默认值: `200`

默认支持滚动动画，动画的持续时间由该值控制  

### 9. `scrollOffset`  
类型: `number`  
默认值: `0`

滚动偏移量 

> 该值只针对内容，点击目录后内容会自动滚动到先对应的位置；内若容顶部有fixed或absolute定位，滚动的位置将会有偏差，解决的方案有两种，假如`fixed`定位元素的高度为 `64px`:  
1. 使用`css`将所有的标题`padding-top`等于头部的高, `margin-top`等于头部高的相反值; 示例`css`代码如下
```css
[contentSelector] h1,
[contentSelector] h2,
[contentSelector] h3,
[contentSelector] h4,
[contentSelector] h5,
[contentSelector] h6{
  margin-top: -64px;
  padding-top: 64px;
}
```
2. 配置该值为 `64`, 不要加单位  
- **注意**: 以上两种方案只能`二选其一`
 
### 10. `fixedOffset`  
类型: `number` | `false`  
默认值: 动态计算

目录滚动到该位置将自动停靠在顶部

1. 该值默认通过目录元素计算获取，若初始目录处于隐藏且整个文档有滚动的话，自动计算的值将会有很大的偏差，所以尽量要指定该值  
2. 若顶部有`fixed`布局的元素，则需要减去`fixed`布局元素的高度，否则可能会有较大的抖动  
3. 若该值为`false`, 将禁用停靠功能

### 11. `fixedClassName`  
类型: `string`  
默认值: `.bitoc-fixed`

目录停靠顶部样式，默认样式
```css
.bitoc-fixed{
  position: fixed !important;
}
```

### 12. `beforeFixed`
类型: `Function(isFixed: boolean) => false|void`  
默认值: `null`  
目录 `Fixed` 前的钩子函数
> `isFixed = true`,表示将要`Fixed`  
> `isFixed = false`, 表示将要取消`Fixed`  
> **若返回`false`将取消`fixed`操作**

### 13. `afterFixed`
类型: `Function(isFixed: boolean) => void`  
默认值: `null`  
目录`Fixed`后的钩子函数
> `isFixed = true`,表示已经成功 `Fixed`  
> `isFixed = false`, 表示已经成功取消 `Fixed`  

# 五、其他注意
1. 目录停靠默认没有指定`top`的偏移量，需要添加相应的样式；比如；加入顶部有`fixed`布局元素，且高度为`64px`,则需要添加样式
```css
.bitoc-fixed{
  top: 3.875rem;
}
```
2. 目录本身并有宽度限制停靠后，整个目录将会被内容撑开，所以需要限制停靠后的目录宽度，示例:
```css
 .bitoc-fixed {
    max-width: 27rem;
  }
```
使其支持响应式
```css
 @media screen and (min-width: 1024px) and (max-width: 1216px) {
    #toc-box.bitoc-fixed {
      max-width: 19rem;
    }
  }
```

3. 目录本身没有高度限制，停靠后目录可能会超出，需要添加高度限制，若目录达到该限制将自动滚动，无需添加其他样式，示例
```css
.bitoc-fixed {
  max-height: calc(100vh - 9rem);
}
```

# 六、开发
```bash
git clone https://github.com/itlangzi/toc-helper
cd toc-helper
```
## 开发环境
```bash
yarn dev --open
```

> 在浏览访问 http://localhost:3000/demo

## 构建生产版本  
```bash
yarn build
```
