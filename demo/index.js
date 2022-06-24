import TocHelper from "../src/index";
import MarkdownIt from "markdown-it";
import Prismjs from 'prismjs'

import doc from '../README.md?raw'

const md = new MarkdownIt({
  highlight: function (code, lang) {
    if (Prismjs.languages[lang]) {
      code = Prismjs.highlight(code, Prismjs.languages[lang], lang);
    } else {
      code = md.utils.escapeHtml(code);
    }
    return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`;
  }
})
const html = md.render(doc)
document.getElementById('toc-helper-content').innerHTML = html


var toc = new TocHelper("#toc", {
  contentSelector: "#scroll",
  scrollSelector: "#scroll-content",
  collapsedLevel: 2,
  fixedOffset: 320 - 84,
  fixedSelector: "#toc-wrap",
  scrollOffset: 84,
  afterFixed: function (isFxied) {
    // console.log(isFxied);
  },
});

const toggerBtn = document.getElementById('toggerBtn')
if (toggerBtn) {
  toggerBtn.addEventListener('click', function () {
    const tocDiv = document.getElementById("toc");
    if (tocDiv.style.display == "none") {
      tocDiv.style.display = "block";
      toc.syncScroll()
    } else {
      tocDiv.style.display = "none";
    }
  })
}