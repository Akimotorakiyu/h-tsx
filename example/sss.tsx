import "../src/htsx";
function Greeting(props: { name: string }) {
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
      {props.name + "hello wrold"}
    </div>
  );
}

export function Welcome() {
  return (
    <>
      <Greeting name="小朋友">aaaa</Greeting>
      小朋友
    </>
  );
}
