// declare module "*.svg"{
//     const SvgComponent :()=>Element
//     export default SvgComponent
// }

declare module "*.svg" {
  const content: string;
  export default content;
}
