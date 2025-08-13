import app from 'flarum/forum/app';
import { extend } from 'flarum/extend';
import TagsPage from 'flarum/tags/components/TagsPage';

function applyTagBackgrounds(root: Element | null) {
  if (!root) return;

  const tiles = root.querySelectorAll('li.TagTile');
  tiles.forEach((tile) => {
    const li = tile as HTMLElement;
    const link = li.querySelector('a.TagTile-info') as HTMLAnchorElement | null;
    const nameEl = li.querySelector('.TagTile-name') as HTMLElement | null;

    if (!link) return;

    let slug: string | null = null;

    const url = new URL(link.href, window.location.origin);
    // Flarum tags routes are typically /t/:slug or /tags/:slug
    const parts = url.pathname.split('/').filter(Boolean);
    const tIndex = parts.indexOf('t');
    const tagsIndex = parts.indexOf('tags');
    if (tIndex !== -1 && parts[tIndex + 1]) slug = parts[tIndex + 1];
    else if (tagsIndex !== -1 && parts[tagsIndex + 1]) slug = parts[tagsIndex + 1];
    else if (parts.length > 0) slug = parts[parts.length - 1];

    if (!slug) return;

    // Find tag by slug in the store
    // @ts-ignore types provided by flarum/tags
    const tags = app.store.all('tags') as any[];
    const model = tags.find((t) => (typeof t.slug === 'function' ? t.slug() : t.attribute && t.attribute('slug')) === slug);

    if (!model) return;

    const bgUrl = model.attribute ? model.attribute('wusong8899BackgroundURL') : null;

    if (bgUrl) {
      li.style.background = `url(${bgUrl})`;
      li.style.backgroundSize = 'cover';
      li.style.backgroundPosition = 'center';
      li.style.backgroundRepeat = 'no-repeat';
      if (nameEl) {
        // Maintain existing behavior: hide name when a background image is set
        nameEl.style.display = 'none';
      }
    } else {
      // Reset to default behavior that uses --tag-bg (set by Flarum core)
      li.style.background = '';
      li.style.backgroundSize = '';
      li.style.backgroundPosition = '';
      li.style.backgroundRepeat = '';
      if (nameEl) {
        nameEl.style.display = '';
      }
    }
  });
}

app.initializers.add('wusong8899-tag-background', () => {
  extend(TagsPage.prototype, 'oncreate', function (this: any, vnode: any) {
    applyTagBackgrounds(vnode.dom as Element);
  });

  extend(TagsPage.prototype, 'onupdate', function (this: any, vnode: any) {
    applyTagBackgrounds(vnode.dom as Element);
  });
});

