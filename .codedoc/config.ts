import { configuration, DefaultMarkdownCustomComponents } from '@codedoc/core'; // --> make sure to import the default components
import { formulaPlugin } from '@codedoc/core/components';
import { theme } from './theme';
import { P5 } from './components/p5';      // --> import the card component itself

export const config = configuration({
  theme,
  src: {                           // @see /docs/config/entry
    base: 'docs/md',               // --> the base folder for all markdowns
    not_found: '404.md',           // --> markdown file for 404 page, relative to `base`
    toc: '_toc.md',                // --> markdown file for toc, relative to `base`
    pick: /\.md$/,                 // --> which files to pick (default: .md files)
    drop: /(^_)|(\/_)/,            // --> which files to drop (default: _something.md files)
  },
  dest: {                          // @see /docs/config/output
    html: 'dist',                  // --> the base folder for HTML files
    assets: 'dist',                // --> the base folder for assets
    namespace: '/p5.quadrille.js', // --> project namespace
  },
  page: {
    title: {
      base: 'p5.quadrille.js'      // --> the base title of your doc pages
    }
  },
  misc: {
    github: {
      user: 'objetos',             // --> name of the user on GitHub owning the repo
      repo: 'p5.quadrille.js',     // --> name of the repo on GitHub
      action: 'Star',              // --> action of the GitHub button
      count: false,                // --> whether to show the `count` on the GitHub button
      large: true,                 // --> whether to show a `large` GitHub button
      standardIcon: false,         // --> whether to use the GitHub icon on the GitHub button or use an action specific icon
    }
  },
  markdown: {                                  // --> update markdown config
    customComponents: {                        // --> add to custom components
      ...DefaultMarkdownCustomComponents,      // --> make sure to add default markdown components. otherwise the default components will not work!
      P5,                                      // --> add our own p5 component
    }
  },
  plugins: [
    formulaPlugin
  ],
});