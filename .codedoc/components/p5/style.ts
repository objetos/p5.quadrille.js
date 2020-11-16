import { themedStyle } from '@connectv/jss-theme';  // @see [Connective JSS Theme](https://github.com/CONNECT-platform/connective-jss-theme)
import { CodedocTheme } from '@codedoc/core';

export const P5Style = themedStyle<CodedocTheme>(theme => ({
p5: {
   display: 'inline-block',
   verticalAlign: 'middle',
   borderRadius: 8,
   padding: 8,
   maxWidth: 320,
   margin: 16,
   overflow: 'hidden',
   cursor: 'pointer',
   transition: 'box-shadow .3s, transform .3s',

   '&.raised-0': { boxShadow: '0 1px 3px rgba(0, 0, 0, .12)' },  // --> different styles for different raise-levels
   '&.raised-1': { boxShadow: '0 3px 6px rgba(0, 0, 0, .18)' },
   '&.raised-2': { boxShadow: '0 6px 18px rgba(0, 0, 0, .25)' },
   '&:hover': {
     boxShadow: '0 6px 18px rgba(0, 0, 0, .25)',
     transform: 'translateY(-8px)'
   },

   '& img': {
     margin: -8,
     marginTop: -24,
     width: 'calc(100% + 16px)',
     maxWidth: 'none',
   },

   '& strong': {
     fontSize: 18,
     display: 'block',
     color: theme.light.primary,                               // --> so lets make the title's of the primary color
     'body.dark &': { color: theme.dark.primary },             // --> but also do respect dark-mode settings
     '@media (prefers-color-scheme: dark)': {                  // --> this is to ensure proper dark-mode colors even before the scripts are loaded and user overrides are fetched
       'body:not(.dark-mode-animate) &': {
         color: theme.dark.primary,
       },
     },
   },
 }
}));