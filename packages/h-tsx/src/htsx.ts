import { createElement } from "./h-createElement";

function isJSXClassComponent<P>(com: any): com is JSXClassComponent<P> {
  return typeof com?.prototype?.render === "function" ? true : false;
}

export type KeyType = number | symbol | string;
export interface Ctx {
  provides: Record<KeyType, unknown>;
  tag: JsxFunctionComponent<unknown> | JSXClassComponent<unknown> | null;
  onResize: ((target: Element[]) => void)[];
  isConnected: boolean;
  onConnected: ((target: Element[]) => void)[];
  onDisonnected: ((target: Element[]) => void)[];
}

let ctxStack: Ctx[] = [];
let currentCtx: Ctx | null = null;

export function getCurrentCtx() {
  if (!currentCtx) {
    currentCtx = {
      provides: Object.create(null),
      tag: null,
      onResize: [],
      isConnected: false,
      onConnected: [],
      onDisonnected: [],
    };
  }
  return currentCtx;
}

function createLifecycleHandler(targetList: Element[], ctx: Ctx) {
  const observer = new ResizeObserver((resizeObserverEntryList) => {
    // console.log(
    //   "ResizeObserverEntry",
    //   (ctx.tag as any).name,
    //   resizeObserverEntryList
    // );

    const isConnected = targetList.some((target) => {
      return target.isConnected;
    });

    if (isConnected !== ctx.isConnected) {
      if (isConnected) {
        ctx.isConnected = isConnected;
        ctx.onConnected.forEach((fn) => {
          fn(targetList);
        });
        ctx.onResize.forEach((fn) => {
          fn(targetList);
        });
      } else {
        ctx.onResize.forEach((fn) => {
          fn(targetList);
        });
        ctx.isConnected = isConnected;
        ctx.onDisonnected.forEach((fn) => {
          fn(targetList);
        });
      }
    } else {
      ctx.onResize.forEach((fn) => {
        fn(targetList);
      });
    }
  });

  targetList.forEach((target) => {
    observer.observe(target, {
      box: "border-box",
    });
  });
}

export const htsx = <HTSX>{
  createElement<Tag extends keyof JSX.IntrinsicElements, P>(
    tag: Tag | JsxFunctionComponent<P> | JSXClassComponent<P>,
    props: JSX.IntrinsicElements[Tag] | P,
    ...children: (JSX.Element | string)[]
  ): JSX.Element {
    if (typeof tag === "function") {
      ctxStack.push(currentCtx!);
      currentCtx = {
        provides: Object.create(currentCtx?.provides || null),
        tag: tag as JsxFunctionComponent<unknown> | JSXClassComponent<unknown>,
        onResize: [],
        isConnected: false,
        onConnected: [],
        onDisonnected: [],
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
      // not nesscessary
      // Reflect.set(element, "ctx", currentCtx);
      if (element instanceof DocumentFragment) {
        createLifecycleHandler(
          [...element.childNodes]
            .filter((cn) => {
              return cn instanceof Element;
            })
            .map((ce) => {
              return ce as Element;
            }),
          currentCtx!
        );
      } else {
        createLifecycleHandler([element], currentCtx!);
      }
      currentCtx = ctxStack.pop() || null;
    }

    return element;
  },
  Fragment: function Fragment(props: null, children: (JSX.Element | string)[]) {
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
