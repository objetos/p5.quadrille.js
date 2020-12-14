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

  /*
  <!DOCTYPE html>
<head>
  <title>embedded example</title>
  <script src="../../js/p5.min.js"></script>
  <!-- uncomment lines below to include extra p5 libraries -->
  <!--<script src="../addons/p5.sound.js"></script>-->
  <script src="sketch.js"></script>
  <!-- this line removes any default padding and style. you might only need one of these values set. -->
  <style> body {padding: 0; margin: 0;} </style>
</head>
<body>
</body>
</html>
*/

  /*
  <iframe src="http://p5js.org/assets/learn/tes-tutorial/embed.html" width="600" height="400">
  </iframe>
  */

  //<script src="/docs/sketches/board.js"></script>
  //http://localhost:3000/docs/sketches/board.js

  if (options.sketch) {
    let filename = options.sketch.split("/").pop();
    let name: string = filename!.substr(0, filename!.lastIndexOf("."));
    let p5Lib: string = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";
    let p5Loaded: boolean = isScriptLoaded(p5Lib);
    let p5Quadrille: string = "/docs/sketches/p5.quadrille.js";
    let p5QuadrilleLoaded: boolean = isScriptLoaded(p5Quadrille);
    let sketchLoaded: boolean = isScriptLoaded(options.sketch);
    let width: string = options.width ? options.width : '600';
    let height = options.height ? options.height : '600';
    //{`${name}`}
    // /*
    return (
      <div id={`${name}`} class={`${classes.p5} center`}>
        {p5Loaded ? 'p5 already loaded' : <script src={`${p5Lib}`}></script>}
        {p5QuadrilleLoaded ? 'p5 quadrille already loaded' : <script src={`${p5Quadrille}`}></script>}
        {sketchLoaded ? 'p5 sketch already loaded' : <script src={`${options.sketch}`}></script>}
      </div>
    );
    // <script src="/p5.quadrille.js/docs/sketches/p5.quadrille.js"></script>
    // */
   return (
    <iframe
      id={`${name}`} class={`${classes.p5} center`} width={`${width}`} height={`${height}`}
      srcdoc={`
      <!DOCTYPE html>
      <html>
        <head>
          <script src=https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js></script>
          <script src=${p5Quadrille}></script>
          <script src="/p5.quadrille.js/docs/sketches/board.js"></script>
        </head>
        <body>
        </body>
      </html>
    `}>
    </iframe>
  );
  } else {
    return (
      <div class={`${classes.p5} center`}>
        <script> {content} </script>
      </div>
    );
  }
}

// TODO debug this function is broken
function isScriptLoaded(src: string) {
  return document.querySelector('script[src="' + src + '"]') ? true : false;
}
