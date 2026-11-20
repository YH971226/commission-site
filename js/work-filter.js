(() => {
  const filter = document.querySelector("#work-tag-filter");
  const cards = [...document.querySelectorAll(".works-content .work-card")].map(element => ({
    element,
    tags: JSON.parse(element.dataset.tags),
  }));
  const available = new Set(cards.flatMap(card => card.tags));
  const initialTag = new URL(window.location.href).searchParams.get("tag");
  if (initialTag) available.add(initialTag);
  if (!available.size) return;

  const presets = window.SiteTagPresets?.groups ?? [];
  const presetTags = new Set(presets.flat());
  const groups = [
    ...presets.map(group => group.filter(tag => available.has(tag))),
    [...available].filter(tag => !presetTags.has(tag)),
  ];
  const controls = new Map();
  for (const tags of groups.filter(group => group.length)) {
    const group = document.createElement("div");
    group.className = "work-tag-group";
    for (const tag of tags) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = tag;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectTag(selected === tag ? "" : tag));
      controls.set(tag, button);
      group.append(button);
    }
    filter.append(group);
  }

  const tocEntries = new Map([...document.querySelectorAll(".works-toc .toc a")].map(link => [
    link.hash.slice(1),
    link.parentElement,
  ]));
  const years = [...document.querySelectorAll(".works-content .year-block")];
  const months = [...document.querySelectorAll(".works-content .month-block")];
  const total = document.querySelector("#work-count");
  const empty = document.createElement("p");
  empty.textContent = "暂无符合该标签的作品。";
  empty.hidden = true;
  document.querySelector(".works-content").append(empty);
  let selected = "";

  function selectTag(tag) {
    selected = tag;
    let visible = 0;
    for (const [value, button] of controls) {
      button.setAttribute("aria-pressed", String(value === tag));
    }
    for (const card of cards) {
      card.element.hidden = Boolean(tag && !card.tags.includes(tag));
      if (!card.element.hidden) visible += 1;
    }
    for (const month of months) {
      const count = month.querySelectorAll(".work-card:not([hidden])").length;
      month.querySelector(".count").textContent = `${count} 件`;
      month.hidden = count === 0;
      tocEntries.get(month.id).hidden = month.hidden;
    }
    for (const year of years) {
      year.hidden = !year.querySelector(".month-block:not([hidden])");
      tocEntries.get(year.id).hidden = year.hidden;
    }
    total.textContent = visible;
    empty.hidden = visible !== 0;
  }
  if (controls.has(initialTag)) selectTag(initialTag);
})();
