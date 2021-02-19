import "../src/htsx";
function Greeting(props: { name: string }) {
  return <div> {props.name + "hello wrold"}</div>;
}

export function Welcome() {
  return (
    <>
      <Greeting name="小朋友">aaaa</Greeting>
      小朋友
    </>
  );
}
