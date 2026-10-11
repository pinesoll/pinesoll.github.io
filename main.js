(function () {
  "use strict";

  // Author name to highlight in bold (prefix match, so "Yoonsol Jung*" also works).
  const MY_NAME = "Yoonsol Jung";
  const LINK_LABELS = { paper: "Paper", arxiv: "arXiv", code: "Code", poster: "Poster" };
  const TYPE_LABELS = { conference: "Conference", workshop: "Workshop", journal: "Journal", preprint: "Preprint" };

  const state = { view: "selected", area: null, pubs: [] };

  const listEl = document.getElementById("pub-list");
  const tagEl = document.querySelector(".tag-filter");
  const toggleButtons = document.querySelectorAll(".view-toggle button");

  document.getElementById("year").textContent = new Date().getFullYear();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function renderAuthors(authors) {
    return (authors || []).map((a) => {
      const name = escapeHtml(a);
      return a.startsWith(MY_NAME) ? `<span class="me">${name}</span>` : name;
    }).join(", ");
  }

  function renderLinks(links) {
    if (!links) return "";
    const items = Object.keys(LINK_LABELS)
      .filter((k) => links[k])
      .map((k) => `<a href="${escapeHtml(links[k])}">${LINK_LABELS[k]}</a>`);
    return items.length ? `<span class="pub-links">${items.join("")}</span>` : "";
  }

  function renderPub(p) {
    const note = p.note ? ` <span class="pub-note">· ${escapeHtml(p.note)}</span>` : "";
    const type = TYPE_LABELS[p.type] ? `<span class="chip">${TYPE_LABELS[p.type]}</span>` : "";
    const areas = (p.area || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
    return `
      <li>
        <div class="pub-title">${escapeHtml(p.title)}</div>
        <div class="pub-authors">${renderAuthors(p.authors)}</div>
        <div class="pub-venue">${escapeHtml(p.venue || "")}${note}</div>
        <div class="pub-meta">${renderLinks(p.links)}${type}${areas}</div>
      </li>`;
  }

  function renderTags() {
    const areas = [...new Set(state.pubs.flatMap((p) => p.area || []))].sort();
    if (areas.length === 0) { tagEl.innerHTML = ""; return; }
    tagEl.innerHTML = [null, ...areas].map((a) =>
      `<button type="button" data-area="${a === null ? "" : escapeHtml(a)}" aria-pressed="${state.area === a}">${a === null ? "All areas" : escapeHtml(a)}</button>`
    ).join("");
  }

  function renderList() {
    const shown = state.pubs.filter((p) =>
      (state.view === "all" || p.selected) &&
      (state.area === null || (p.area || []).includes(state.area))
    );

    if (shown.length === 0) {
      listEl.innerHTML = `<p class="muted">No publications match this filter.</p>`;
      return;
    }

    // Group by year, newest first; keep JSON order within a year.
    const years = [...new Set(shown.map((p) => p.year))].sort((a, b) => b - a);
    listEl.innerHTML = years.map((y) => `
      <h3 class="pub-year">${escapeHtml(y)}</h3>
      <ul class="pub">${shown.filter((p) => p.year === y).map(renderPub).join("")}</ul>
    `).join("");
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      toggleButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderList();
    });
  });

  tagEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    state.area = btn.dataset.area || null;
    renderTags();
    renderList();
  });

  fetch("publications.json", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((data) => {
      state.pubs = Array.isArray(data) ? data : [];
      // Fall back to "All" if nothing is marked selected yet.
      if (!state.pubs.some((p) => p.selected)) {
        state.view = "all";
        toggleButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === "all")));
      }
      renderTags();
      renderList();
    })
    .catch(() => {
      listEl.innerHTML = `<p class="muted">Could not load publications.json. If you opened this file directly, run a local server instead (see README).</p>`;
    });
})();
