declare type JsxHTMLElementTagNameMap = {
  [tag in keyof HTMLElementTagNameMap]: Partial<
    {
      [key in keyof HTMLElementTagNameMap[tag]]: Partial<
        HTMLElementTagNameMap[tag][key]
      >;
    } & {
      class:
        | string
        | string[]
        | { [key: string]: boolean }
        | { [key: string]: boolean }[];
    }
  >;
};

declare type JsxIntrinsicElements = JsxHTMLElementTagNameMap;

declare namespace JSX {
  type Element = HTMLElement;
  type IntrinsicElements = JsxIntrinsicElements;
}

declare type JsxFunctionComponent<P> = (
  props: P,
  children: (JSX.Element | string)[]
) => JSX.Element;

declare interface HTSX {
  createElement<P>(
    tag: JsxFunctionComponent<P>,
    props: P,
    ...children: (JSX.Element | string)[]
  ): JSX.Element;
  createElement<Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    props: JSX.IntrinsicElements[Tag],
    ...children: (JSX.Element | string)[]
  ): JSX.Element;
}

declare const htsx: HTSX;
