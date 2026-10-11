# pinesoll.github.io

Personal academic homepage. Plain HTML/CSS/JS with no build step; GitHub Pages serves it as-is (`.nojekyll` disables Jekyll).

```
index.html          profile, news, publications section
style.css           styles (light/dark follows the OS setting)
main.js             renders publications.json (Selected/All toggle, area filter)
publications.json   publication list
assets/             profile.jpg, cv.pdf (TODO: add both)
```

## Local preview

`fetch()` doesn't work over `file://`, so run a local server instead of opening the file directly:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Adding a publication

Add an object to the array in `publications.json`. Within a year, entries show in the order they appear in the file, so put new ones at the top.

```json
{
  "title": "Paper Title",
  "authors": ["Yoonsol Jung", "Coauthor One", "Coauthor Two"],
  "venue": "ICLR 2027",
  "year": 2027,
  "type": "conference",
  "area": ["Agent Safety"],
  "selected": true,
  "links": {
    "paper": "https://...",
    "arxiv": "https://arxiv.org/abs/...",
    "code": "https://github.com/...",
    "poster": "assets/poster.pdf"
  },
  "note": "Oral"
}
```

- `type`: one of `conference`, `workshop`, `journal`, `preprint`
- `area`: tags; the filter buttons are built from these automatically
- `selected`: `true` shows the paper in the default "Selected" view
- `links`: include only the keys you have; missing ones are hidden
- `note`: awards or presentation info (optional)
- Any author starting with `Yoonsol Jung` (e.g. `Yoonsol Jung*`) is shown in bold.

News items are edited directly in `index.html` (newest first).
