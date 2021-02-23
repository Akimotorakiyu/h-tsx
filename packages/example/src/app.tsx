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

  return (
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
  );
}

class User {
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
    return (
      <>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
        <div>臭哥哥{this.props.name}</div>
      </>
    );
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
