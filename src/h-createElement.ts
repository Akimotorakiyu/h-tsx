type Attrs<K extends keyof HTMLElementTagNameMap> = JsxHTMLElementTagNameMap[K];

type Children = (Node | string)[];

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K
): HTMLElementTagNameMap[K];

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs<K>
): HTMLElementTagNameMap[K];

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  childNodes: Children
): HTMLElementTagNameMap[K];

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs<K>,
  childNodes: Children
): HTMLElementTagNameMap[K];

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  p1?: Attrs<K> | Children,
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

function convertObjectToAttrStringArray(o: Object) {
  return Object.entries(o)
    .filter(([v, should]) => {
      return Boolean(should);
    })
    .map(([v]) => {
      return `${v.replace(/([A-Z])/g, function ($1) {
        return "-" + $1.toLocaleLowerCase();
      })}`;
    });
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs<K> = {},
  childNodes: Children = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

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
      typeof element[key as keyof HTMLElementTagNameMap[K]] === "function"
    ) {
      console.error("incorrect key", tag);
      throw new Error("incorrect key");
    }

    // 设置普通属性
    else {
      const tempValue: any = typeof value === "function" ? value() : value;
      let realValue: string;

      // 处理 class
      if (key === "class" || key === "className") {
        realValue = [tempValue]
          .flat()
          .map((item) => {
            return typeof tempValue === "object"
              ? convertObjectToAttrStringArray(item)
              : item;
          })
          .flat()
          .join(" ");
      }
      // 处理 style
      else if (key === "style" && typeof tempValue === "object") {
        realValue = Object.entries(tempValue)
          .map(([key, value]) => {
            return `${key.replace(/([A-Z])/g, function ($1) {
              return "-" + $1.toLocaleLowerCase();
            })}:${value}`;
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
  return element;
}
