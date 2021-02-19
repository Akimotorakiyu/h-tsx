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
  Fragment(props: null, children: JSX.Element[]) {
    const fragment = new DocumentFragment();
    children
      .map((child) => {
        return typeof child === "string"
          ? document.createTextNode(child)
          : child;
      })
      .forEach((child) => {
        fragment.appendChild(child);
      });
    return fragment;
  },
};

Reflect.set(window, "htsx", htsx);
