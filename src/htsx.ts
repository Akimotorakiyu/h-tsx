import { createElement } from "./h-createElement";

function isJSXClassComponent<P>(com: any): com is JSXClassComponent<P> {
  return typeof com?.prototype?.render === "function" ? true : false;
}

export type KeyType = number | symbol | string;
interface Ctx {
  provides: Record<KeyType, unknown>;
  tag: JsxFunctionComponent<unknown> | JSXClassComponent<unknown> | null;
}

let ctxStack: Ctx[] = [];
let currentCtx: Ctx | null = null;

export function getCurrentCtx() {
  if (!currentCtx) {
    currentCtx = {
      provides: Object.create(null),
      tag: null,
    };
  }
  return currentCtx;
}

export const htsx = <HTSX>{
  createElement<Tag extends keyof JSX.IntrinsicElements, P>(
    tag: Tag | JsxFunctionComponent<P> | JSXClassComponent<P>,
    props: JSX.IntrinsicElements[Tag] | P,
    ...children: JSX.Element[]
  ): JSX.Element {
    if (typeof tag === "function") {
      ctxStack.push(currentCtx!);
      currentCtx = {
        provides: Object.create(currentCtx?.provides || null),
        tag: tag as JsxFunctionComponent<unknown> | JSXClassComponent<unknown>,
      };
    }

    let element: JSX.Element;
    if (isJSXClassComponent<P>(tag)) {
      const com = new tag(props as P, children, {
        tag,
        provide: currentCtx!.provides,
      });
      element = com.render();
    } else if (typeof tag === "function") {
      element = tag(props as P, children, {
        tag,
        provide: currentCtx!.provides,
      });
    } else {
      element = (createElement(
        tag,
        (props as JSX.IntrinsicElements[Tag]) || {},
        children
      ) as unknown) as JSX.Element;
    }

    if (typeof tag === "function") {
      currentCtx = ctxStack.pop() || null;
    }

    return element;
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
