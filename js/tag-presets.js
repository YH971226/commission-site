/* 后台候选按标签库的分组顺序排列，未分组放在最后。 */
(function () {
  'use strict';

  window.SiteTagPresets = {
    grouped(catalog) {
      const groups = new Map(catalog.groups.map(name => [name, []]));
      groups.set('', []);
      for (const tag of catalog.tags) groups.get(tag.group).push(tag);
      return [...groups].filter(([, tags]) => tags.length);
    },
  };
})();
