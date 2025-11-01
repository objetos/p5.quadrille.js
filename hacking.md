## `hacking.md`

### p5.quadrille.js visual api (Hugo + Book Theme + API Submodules)

This branch (`pages`) contains the documentation website built with:

* **Hugo** — [https://gohugo.io/](https://gohugo.io/)
* **Hugo Book Theme** — [https://github.com/alex-shpak/hugo-book](https://github.com/alex-shpak/hugo-book)
* **Multiple git submodules** (theme + API sections under `content/docs/`)

Use the steps below to fetch everything and preview locally.

---

### Get the `pages` Branch

```sh
git clone https://github.com/objetos/p5.quadrille.js
cd p5.quadrille.js
git checkout pages
# (or clone this branch directly)
# git clone --branch pages --single-branch https://github.com/objetos/p5.quadrille.js pages
# cd pages
```

---

### Initialize/Update **All** Submodules

```sh
git submodule update --init --recursive
# Update all submodules occasionally:
# git submodule update --remote --merge
```

---

### Run Local Preview

```sh
hugo server --disableFastRender
```

Open: [http://localhost:1313/](http://localhost:1313/)
