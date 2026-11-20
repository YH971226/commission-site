(async () => {
  const counter = document.querySelector(".home-visitors[data-counter-url]");
  if (!counter) return;

  try {
    const response = await fetch(counter.dataset.counterUrl, { credentials: "omit" });
    if (!response.ok) return;
    const { count } = await response.json();
    if (typeof count !== "string" || !/^[0-9][0-9,\s]*$/.test(count)) return;
    counter.querySelector("span").textContent = count;
    counter.hidden = false;
  } catch {
    // A disabled or unavailable counter leaves the line hidden.
  }
})();
