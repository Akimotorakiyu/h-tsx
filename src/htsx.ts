import { createElement } from "./h-createElement";
export const htsx = <HTSX>{
  createElement<Tag extends keyof JSX.IntrinsicElements, P>(
    tag: Tag | JsxFunctionComponent<P>,
    props: JSX.IntrinsicElements[Tag] | P,
    ...children: JSX.Element[]
  ): JSX.Element {
    if (typeof tag === "function") {
      return tag(props as P, children);
    } else {
      return createElement(
        tag,
        (props as JSX.IntrinsicElements[Tag]) || {},
        children
      );
    }
  },
};

Reflect.set(window, "htsx", htsx);
