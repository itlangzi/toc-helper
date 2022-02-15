import TocHelper from "../src/index";
new TocHelper("#toc", {
  contentSelector: "#scroll",
  scrollSelector: "#scroll-content",
  collapsedLevel: 2,
  fixedOffset: 320 - 84,
  fixedSelector: "#toc-wrap",
  scrollOffset: 84,
  afterFixed: function (isFxied) {
    console.log(isFxied);
  },
});
