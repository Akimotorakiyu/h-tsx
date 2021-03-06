declare type ClassType = string | { [key: string]: boolean };

type TagNameMap = HTMLElementTagNameMap &
  SVGElementTagNameMap & {
    path: { d: string; fill: string };
    // svg: { fill: string; width: string; height: string; viewBox: string };
  };

declare type JsxElementTagNameMap = {
  [tag in keyof TagNameMap]: Partial<
    {
      [key in keyof TagNameMap[tag]]: Partial<TagNameMap[tag][key]> | string;
    } & {
      class: ClassType | ClassType[];
      style: Partial<TagNameMap[tag]["style"]>;
    }
  >;
};

declare type JsxIntrinsicElements = JsxElementTagNameMap;

declare namespace JSX {
  type Element = HTMLElement | DocumentFragment | SVGElement;
  type IntrinsicElements = JsxIntrinsicElements;

  interface ElementClass {
    render(): Element;
  }
}

declare type JsxFunctionComponent<P> = (
  props: P,
  children: (JSX.Element | string)[],
  ctx: {
    tag: JsxFunctionComponent<P>;
    provide: Record<string, any>;
  }
) => JSX.Element;

declare interface JSXClassComponent<P> {
  new (
    props: P,
    children: (JSX.Element | string)[],
    ctx: {
      tag: JSXClassComponent<P>;
      provide: Record<string, any>;
    }
  ): JSXClassComponent<P>;
  render(): JSX.Element;
}

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
  Fragment(props: null, children: JSX.Element[]): DocumentFragment;
}

declare const htsx: HTSX;
