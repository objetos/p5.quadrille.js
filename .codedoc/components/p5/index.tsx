import { ThemedComponentThis } from "@connectv/jss-theme"; // @see [CONNECTIVE JSS Theme](https://github.com/CONNECT-platform/connective-jss-theme)
import { RendererLike } from "@connectv/html"; // @see [CONNECTIVE HTML](https://github.com/CONNECT-platform/connective-html)
import { CodedocTheme } from "@codedoc/core"; // --> Type helper for theme object

import { P5Style } from "./style"; // @see tab:style.ts
import { content } from "../../content";

export interface P5Options {
  // --> a nice interface for possible props
  sketch: string; // --> sketch location. Note that all props MUST be of type `string`
  width: string;
  height: string;
}

export function P5(
  this: ThemedComponentThis, // --> keep typescript strict typing happy
  options: P5Options, // --> the component props (attributes)
  renderer: RendererLike<any, any>, // --> our beloved renderer
  content: any // --> the content of the component
) {
  const classes = this.theme.classes(P5Style); // --> fetch the theme-based classes
  // custom vars
  let filename = options.sketch.split("/").pop();
  let name: string = filename!.substr(0, filename!.lastIndexOf("."));
  let p5Lib: string = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";
  let p5Quadrille: string = "/docs/sketches/p5.quadrille.js";
  let w: string = options.width ? options.width : '200';
  let h: string = options.height ? options.height : '400';
  if (options.sketch) {
   return (
    <iframe
      id={`${name}`} class={`${classes.p5} center`} width={`${w}`} height={`${h}`}
      srcdoc={`
      <!DOCTYPE html>
      <html>
        <head>
          <script src=${p5Lib}></script>
          <script src=${"/p5.quadrille.js".concat(p5Quadrille)}></script>
          <script src=${"/p5.quadrille.js".concat(options.sketch)}></script>
        </head>
        <body>
        </body>
      </html>
    `}>
    </iframe>
  );
  } else {
    return (
      <iframe
      id={`${name}`} class={`${classes.p5} center`} width={`${w}`} height={`${h}`}
      srcdoc={`
      <!DOCTYPE html>
      <html>
        <head>
          <script src=${p5Lib}></script>
          <script src=${"/p5.quadrille.js".concat(p5Quadrille)}></script>
          <script> ${content} </script>
        </head>
        <body>
        </body>
      </html>
    `}>
    </iframe>
    );
  }
}