import { ThemedComponentThis } from '@connectv/jss-theme';  // @see [CONNECTIVE JSS Theme](https://github.com/CONNECT-platform/connective-jss-theme)
import { RendererLike } from '@connectv/html';              // @see [CONNECTIVE HTML](https://github.com/CONNECT-platform/connective-html)
import { CodedocTheme } from '@codedoc/core';               // --> Type helper for theme object

import { P5Style } from './style';                          // @see tab:style.ts

export interface P5Options {                                // --> a nice interface for possible props
  sketch: string;                                            // --> sketche location. Note that all props MUST be of type `string`
}

export function P5(
  this: ThemedComponentThis,                                // --> keep typescript strict typing happy
  options: P5Options,                                       // --> the component props (attributes)
  renderer: RendererLike<any, any>,                         // --> our beloved renderer
  content: any,                                             // --> the content of the component
) {
  const classes = this.theme.classes(P5Style);              // --> fetch the theme-based classes
  let center = 'center';

  return <div class={`${classes.p5} ${center}`}>
    <script src={`${options.sketch}`}></script>
  </div>;
}