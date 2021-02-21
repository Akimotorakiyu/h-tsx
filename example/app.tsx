import "../src/htsx";
import { provide, inject, createProvideInject } from "../src/provide-inject";
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
        "xxxSssssss",
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
    console.log(this.ctx);
    return (
      <>
        <div>臭哥哥{this.props.name}</div>
      </>
    );
  }
}

export function Welcome() {
  provide("hhh", "provide-inject");
  hhh.provide("你好啊");
  return (
    <>
      <User name="湫曗"></User>
      <Greeting name="小朋友">aaaa</Greeting>
      小朋友
      <HappyIcon></HappyIcon>
    </>
  );
}
