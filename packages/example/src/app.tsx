import "./app.css";
import {
  provide,
  inject,
  createProvideInject,
  onConnected,
  onResize,
  onDisonnected,
  createElementWithUpdater,
} from "h-tsx";
import { HappyIcon } from "./happyIcon";
import happy from "./happy.svg";

console.log("happy", happy);

const _divContainer = document.createElement("div");
function ConvertStringToDom(props: { domString: string }) {
  _divContainer.innerHTML = props.domString;
  const fragment = document.createDocumentFragment();
  fragment.append(..._divContainer.childNodes);
  return fragment;
}

const hhh = createProvideInject<string>();

function Greeting(
  props: { name: string },
  children: [],
  ctx: { tag: typeof Greeting; provide: Record<string, any> }
) {
  const msg = inject("hhh");
  const greeting = hhh.inject();

  const { updater, element, getElement } = createElementWithUpdater(() => {
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
        {props.name + "hello wrold" + msg + greeting + `${Date().valueOf()}`}
        <ConvertStringToDom domString={happy}></ConvertStringToDom>
      </div>
    );
  });

  setInterval(() => {
    updater();
  }, 1000);

  return element;
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

    const { updater, element, getElement } = createElementWithUpdater(() => {
      return (
        <>
          <div>臭哥哥{this.props.name + `${Date().valueOf()}`}</div>
          <div>臭哥哥{this.props.name + `${Date().valueOf()}`}</div>
          <div>臭哥哥{this.props.name + `${Date().valueOf()}`}</div>
          <div>臭哥哥{this.props.name + `${Date().valueOf()}`}</div>
        </>
      );
    });

    setInterval(() => {
      updater();
    }, 1000);

    return element;
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
