/**
 * @file Video shortcodes — the poster plays, the player follows.
 * @license GPL-3.0-only
 *
 * A page that carries `{{< youtube ID "caption" >}}` gets this file beside it.
 * The renderer ships a poster and a link, not an embed: a frame in the HTML
 * makes the page's own `load` wait on YouTube (nine seconds on the first page
 * that carried one), and every reader pays a third party's cost before asking
 * for the video.
 *
 * So the poster is a link to the watch page, and this file upgrades the click:
 * it swaps in the privacy-enhanced player, autoplaying, so the reader still
 * lands inside the page. Without this file the link works — it simply leaves
 * the site, which is the right fallback.
 */
(function () {
  'use strict';

  var EMBED = 'https://www.youtube-nocookie.com/embed/';
  var ALLOW = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';

  document.addEventListener('click', function (event) {
    var play = event.target.closest && event.target.closest('.video .play');
    if (!play) return;
    var figure = play.closest('.video');
    var id = figure && figure.getAttribute('data-video');
    if (!id) return;                       // no id: let the link do its job

    event.preventDefault();
    var frame = document.createElement('iframe');
    frame.src = EMBED + encodeURIComponent(id) + '?autoplay=1';
    var caption = figure.querySelector('figcaption');
    frame.title = caption ? caption.textContent : 'YouTube video';
    frame.allow = ALLOW;
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    play.replaceWith(frame);
    frame.focus();
  });
}());
