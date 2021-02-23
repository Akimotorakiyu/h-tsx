import { Ctx } from "./htsx";

interface ClassCom<P extends {} = {}> {
  render(): P;
  props: P;
}

interface ClassComConstructor<P extends {} = {}> {
  new (): ClassCom<P>;
  prototype: ClassCom<P>;
}

abstract class AbstractClassCom<P extends {} = {}> {
  constructor(
    public props?: P,
    public children?: (JSX.Element | string)[],
    public ctx?: Ctx
  ) {}
  render(): JSX.Element {
    return undefined as any;
  }
}

export function defineComponent<P extends {} = {}>(
  Com: ClassComConstructor<P>
): ClassComConstructor<P>;

export function defineComponent<P extends {}>(
  Com: (props: P, children: (JSX.Element | string)[], ctx: Ctx) => JSX.Element
): (props: P, children: (JSX.Element | string)[], ctx: Ctx) => JSX.Element;

export function defineComponent(Com: any): any {
  return Com;
}
