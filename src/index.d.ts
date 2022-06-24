type Selector = String | HTMLElement;

interface Options {
  contentSelector?: Selector;
  scrollSelector?: Selector;
  fixedSelector?: Selector;
  headingSelector?: String;
  collapsedLevel?: Number;
  idPrefix?: String;
  levelClassPrefix?: String;
  scrollDuration?: Number;
  scrollOffset?: Number;
  fixedOffset?: Number;
  fixedClassName?: String;
  beforeFixed?: (isFixed: boolean) => false | void;
  afterFixed?: (isFixed: boolean) => void;
}
export default class TocHelper {
  constructor(el: Selector, options?: Options);
  reset(): void;
  syncScroll(): void;
  isEmpty(): Boolean;
}
