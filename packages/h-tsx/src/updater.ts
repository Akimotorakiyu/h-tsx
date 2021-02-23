export function createElementWithUpdater(fn: () => JSX.Element) {
  const tempElement = fn();

  const ref = {
    _element: tempElement,
    _elementList:
      tempElement instanceof DocumentFragment
        ? [...tempElement.childNodes]
        : tempElement,
    get element() {
      return ref._element;
    },
    getElement() {
      return ref._elementList;
    },
    updater() {
      const newNode = fn();
      const newNodeList =
        newNode instanceof DocumentFragment ? [...newNode.childNodes] : newNode;
      if (Array.isArray(ref._elementList)) {
        // const parentNode = ref._elementList[0].parentNode;

        // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/replaceChildren
        // replaceChildren 在 safari <13.1 不支持

        const num = ref._elementList.length;

        ref._elementList.forEach((el, index) => {
          if (index === num - 1) {
            el.replaceWith(newNode);
          } else {
            el.remove();
          }
        });
      } else {
        ref._element.parentNode?.replaceChild(newNode, ref._element);
      }

      ref._element = newNode;
      ref._elementList = newNodeList;

      return ref.element;
    },
  };

  return ref;
}
