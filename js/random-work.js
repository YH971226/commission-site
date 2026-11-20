(() => {
  const link = document.querySelector("[data-random-work]");
  if (!link) return;

  let loading = false;
  link.addEventListener("click", async event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (loading) return;

    loading = true;
    let destination = link.href;
    try {
      const response = await fetch(link.href);
      if (response.ok) {
        const archive = document.createElement("template");
        archive.innerHTML = await response.text();
        const works = [...archive.content.querySelectorAll(".work-card > a[href]")]
          .map(item => new URL(item.getAttribute("href"), response.url))
          .filter(url => url.pathname !== window.location.pathname);
        if (works.length) destination = works[Math.floor(Math.random() * works.length)].href;
      }
    } catch {
      // Open the archive if its list cannot be read.
    } finally {
      loading = false;
    }
    window.location.assign(destination);
  });
})();
