import { isSVGTag } from "./tagMap";

type Attrs<K extends keyof JsxElementTagNameMap> = JsxElementTagNameMap[K];

type Children = (Node | string)[];

export function h<K extends keyof JsxElementTagNameMap>(
  tag: K
): JsxElementTagNameMap[K];

export function h<K extends keyof JsxElementTagNameMap>(
  tag: K,
  attrs: JsxElementTagNameMap[K]
): JsxElementTagNameMap[K];

export function h<K extends keyof JsxElementTagNameMap>(
  tag: K,
  childNodes: Children
): JsxElementTagNameMap[K];

export function h<K extends keyof JsxElementTagNameMap>(
  tag: K,
  attrs: JsxElementTagNameMap[K],
  childNodes: Children
): JsxElementTagNameMap[K];

export function h<K extends keyof JsxElementTagNameMap>(
  tag: K,
  p1?: JsxElementTagNameMap[K] | Children,
  p2?: Children
) {
  if (p1 && p2) {
    return h(tag, p1 as Attrs<K>, p2);
  } else if (Array.isArray(p1)) {
    return h(tag, {}, p1 as Children);
  } else if (p1) {
    return h(tag, p1 as Attrs<K>);
  } else {
    return h(tag);
  }
}

// todo: need more safe impl
function kebabCase(str: string) {
  return str.replace(/([A-Z])/g, function ($1) {
    return "-" + $1.toLocaleLowerCase();
  });
}

function convertObjectToAttrStringArray(o: Object) {
  return Object.entries(o)
    .filter(([v, should]) => {
      return Boolean(should);
    })
    .map(([v]) => {
      return v;
    });
}

export function createElement<K extends keyof JsxElementTagNameMap>(
  tag: K,
  attrs: JsxElementTagNameMap[K] = {},
  childNodes: Children = []
): JsxElementTagNameMap[K] {
  const element = isSVGTag(tag)
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    // 添加事件监听器
    // 支持事件数组
    if (key.startsWith("on")) {
      if (typeof value === "function") {
        element.addEventListener(
          key.slice(2).toLocaleLowerCase(),
          value as () => void
        );
      } else {
        console.error("incorrect event listener", tag, key, value);
        throw new Error("incorrect event listener");
      }
    }

    // 防止修改原生的函数
    else if (
      typeof element[key as keyof (HTMLElement | SVGAElement)] === "function"
    ) {
      console.error("incorrect key", tag);
      throw new Error("incorrect key");
    }

    // 设置普通属性
    else {
      const tempValue: any = value;
      let realValue: string;

      // 处理 class
      if (key === "class" || key === "className") {
        realValue = [tempValue]
          .flat()
          .map((item: ClassType) => {
            return typeof item === "object"
              ? convertObjectToAttrStringArray(item)
              : item;
          })
          .flat()
          // .map(kebabCase)
          .join(" ");
      }
      // 处理 style
      else if (key === "style" && typeof tempValue === "object") {
        realValue = Object.entries(tempValue)
          .map(([key, value]) => {
            return `${kebabCase(key)}:${value}`;
          })
          .join(";");
      } else {
        realValue = tempValue;
      }

      element.setAttribute(key, realValue);
    }
  });

  // 添加子元素
  childNodes
    .flat()
    .map((child) => {
      return typeof child === "string" ? document.createTextNode(child) : child;
    })
    .forEach((child) => {
      element.appendChild(child);
    });

  return (element as unknown) as JsxElementTagNameMap[K];
}
