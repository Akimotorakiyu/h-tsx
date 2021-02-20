import { createElement } from "./h-createElement";

function isJSXClassComponent<P>(com: any): com is JSXClassComponent<P> {
  return typeof com?.prototype?.render === "function" ? true : false;
}

export const htsx = <HTSX>{
  createElement<Tag extends keyof JSX.IntrinsicElements, P>(
    tag: Tag | JsxFunctionComponent<P> | JSXClassComponent<P>,
    props: JSX.IntrinsicElements[Tag] | P,
    ...children: JSX.Element[]
  ): JSX.Element {
    if (isJSXClassComponent<P>(tag)) {
      const com = new tag(props as P, children);
      return com.render();
    } else if (typeof tag === "function") {
      return tag(props as P, children);
    } else {
      return (createElement(
        tag,
        (props as JSX.IntrinsicElements[Tag]) || {},
        children
      ) as unknown) as JSX.Element;
    }
  },
  Fragment: function Fragment(props: null, children: JSX.Element[]) {
    const fragment = new DocumentFragment();
    children
      .map((child) => {
        return typeof child === "string"
          ? document.createTextNode(child)
          : child;
      })
      .forEach((child) => {
        if (child instanceof Node) {
          fragment.appendChild(child);
        } else {
          console.log("Fragment error ", child, props, children);
        }
      });
    return fragment;
  },
};

Reflect.set(window, "htsx", htsx);
