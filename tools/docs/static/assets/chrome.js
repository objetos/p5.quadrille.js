/**
 * @file Site chrome — the theme picker and the collapsible navigation.
 * @license GPL-3.0-only
 *
 * Both preferences are per site and both are applied before the first paint by
 * the inline script in the page head: `docs-theme` (light, dark or system) and
 * `docs-rail` (expanded or collapsed). This file owns the controls only.
 *
 * `<html data-theme>` is the resolved theme, and `light-dark()` reads it
 * through `color-scheme`; `<html data-theme-choice>` is the stored choice,
 * which paints the button's icon. `<html data-rail>` is one state read two
 * ways: the whole rail on a wide screen, the navigation alone on a narrow one.
 *
 * The picker appears twice in the markup — the rail's foot and, on a narrow
 * screen, the header — so both copies are driven from the same state.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'docs-theme';
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  var narrow = window.matchMedia('(max-width: 900px)');

  /** The rail's state is per layout: a folded navigation is not a folded rail. */
  var railKey = function () { return narrow.matches ? 'docs-nav' : 'docs-rail'; };

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function store(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage may be closed */ }
  }

  // ── Theme ────────────────────────────────────────────────────────────────

  var switches = Array.prototype.slice.call(document.querySelectorAll('.theme-switch'));
  var choice = read(THEME_KEY);
  if (choice !== 'light' && choice !== 'dark') choice = 'system';

  function closeMenus() {
    switches.forEach(function (sw) {
      var toggle = sw.querySelector('.theme-toggle');
      var menu = sw.querySelector('.theme-menu');
      if (menu) menu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function paintTheme() {
    root.dataset.themeChoice = choice;
    root.dataset.theme = choice === 'system' ? (dark.matches ? 'dark' : 'light') : choice;
    switches.forEach(function (sw) {
      var label = sw.querySelector('.theme-label');
      var menu = sw.querySelector('.theme-menu');
      if (label) label.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
      if (!menu) return;
      var items = menu.querySelectorAll('[data-theme-choice]');
      for (var i = 0; i < items.length; i += 1) {
        items[i].setAttribute('aria-checked', String(items[i].dataset.themeChoice === choice));
      }
    });
  }

  function setTheme(value) {
    choice = value === 'light' || value === 'dark' ? value : 'system';
    store(THEME_KEY, choice);
    paintTheme();
  }

  switches.forEach(function (sw) {
    var toggle = sw.querySelector('.theme-toggle');
    var menu = sw.querySelector('.theme-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = menu.hidden;
      closeMenus();
      if (!open) return;
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      var first = menu.querySelector('[data-theme-choice]');
      if (first) first.focus();
    });

    menu.addEventListener('click', function (event) {
      var item = event.target.closest('[data-theme-choice]');
      if (!item) return;
      setTheme(item.dataset.themeChoice);
      closeMenus();
      toggle.focus();
    });

    menu.addEventListener('keydown', function (event) {
      var items = Array.prototype.slice.call(menu.querySelectorAll('[data-theme-choice]'));
      var at = items.indexOf(document.activeElement);
      var next = null;
      if (event.key === 'ArrowDown') next = items[(at + 1) % items.length];
      else if (event.key === 'ArrowUp') next = items[(at - 1 + items.length) % items.length];
      else if (event.key === 'Home') next = items[0];
      else if (event.key === 'End') next = items[items.length - 1];
      if (next) { event.preventDefault(); next.focus(); }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.theme-switch')) closeMenus();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = switches.find(function (sw) { return !sw.querySelector('.theme-menu').hidden; });
    if (!open) return;
    closeMenus();
    open.querySelector('.theme-toggle').focus();
  });

  paintTheme();
  dark.addEventListener('change', function () { if (choice === 'system') paintTheme(); });

  // ── Rail ─────────────────────────────────────────────────────────────────

  var railButtons = document.querySelectorAll('[data-rail-toggle]');

  /** Wide: the whole rail shows unless collapsed. Narrow: only when asked. */
  function railOpen() {
    return narrow.matches ? root.dataset.rail === 'expanded' : root.dataset.rail !== 'collapsed';
  }

  function syncRail() {
    var open = railOpen();
    for (var i = 0; i < railButtons.length; i += 1) {
      var button = railButtons[i];
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-controls', narrow.matches ? 'site-nav' : 'site-sidebar');
      if (button.classList.contains('rail-toggle')) {
        button.setAttribute('aria-label', open ? 'Hide the navigation' : 'Show the navigation');
      }
    }
  }

  function setRail(open, remember) {
    root.dataset.rail = open ? 'expanded' : 'collapsed';
    if (remember) store(railKey(), root.dataset.rail);
    syncRail();
  }

  function onRail() {
    var open = railOpen();
    setRail(!open, true);
    // The toggle itself can disappear with the rail; focus the one that remains.
    if (!narrow.matches) {
      var next = document.querySelector(open ? '.rail-reopen' : '.rail-toggle');
      if (next) next.focus();
    }
  }

  for (var i = 0; i < railButtons.length; i += 1) {
    railButtons[i].addEventListener('click', onRail);
  }
  syncRail();
  // Crossing the breakpoint applies the state stored for the layout entered.
  narrow.addEventListener('change', function () {
    var saved = read(railKey());
    if (saved === 'collapsed' || saved === 'expanded') root.dataset.rail = saved;
    else delete root.dataset.rail;
    syncRail();
  });
})();
