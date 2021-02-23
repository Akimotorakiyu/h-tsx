import "./app.css";
import {
  provide,
  inject,
  createProvideInject,
  onConnected,
  onResize,
  onDisonnected,
} from "h-tsx";
import { HappyIcon } from "./happyIcon";

const hhh = createProvideInject<string>();

function Greeting(
  props: { name: string },
  children: [],
  ctx: { tag: typeof Greeting; provide: Record<string, any> }
) {
  const msg = inject("hhh");
  const greeting = hhh.inject();

  let el: JSX.Element;

  function update() {
    const node = (
      <Greeting name={`"湫曗aaaaaaUpdated"${Date().valueOf()}`}></Greeting>
    );
    (el as ChildNode).replaceWith(node);
  }

  setTimeout(() => {
    update();
  }, 1000);

  return (el = (
    <div
      class={[
        {
          hello: false,
          world: true,
        },
        "px py bg-gray-300 rounded",
      ]}
      style={{ minWidth: "200px" }}
    >
      {props.name + "hello wrold" + msg + greeting}
    </div>
  ));
}

class User {
  el: JSX.Element[] = null as any;
  constructor(
    public props: { name: string },
    public children: [],
    public ctx: {
      tag: typeof User;
      provide: Record<string, any>;
    }
  ) {}
  render() {
    const greeting = hhh.inject();
    console.log(this.ctx, greeting);

    onConnected(function happy() {
      console.log("Greeting onConnected!");
    });
    onResize(function happy() {
      console.log("Greeting onResize!");
    });
    onDisonnected(function happy() {
      console.log("Greeting onDisonnected!");
    });

    setTimeout(() => {
      this.update();
    }, 1000);

    const node = (
      <>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
      </>
    );

    this.el = [...node.childNodes] as JSX.Element[];

    return node;
  }

  update() {
    const node = <User name={`${Date().valueOf()}`}></User>;

    this.el.forEach((el, index) => {
      if (index === this.el.length - 1) {
        (el as ChildNode).replaceWith(node);
      } else {
        (el as ChildNode).remove();
      }
    });
  }
}

export function Welcome(...args: unknown[]) {
  console.log("root", ...args);
  provide("hhh", "provide-inject");
  hhh.provide("你好啊");
  return (
    <>
      <Greeting name="臭哥哥"></Greeting>
      <User name="湫曗"></User>
      小朋友
      <HappyIcon></HappyIcon>
    </>
  );
}

const element = <Welcome />;

document.body.appendChild(element);
