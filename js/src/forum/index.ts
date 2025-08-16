import app from 'flarum/forum/app';
import { extend } from 'flarum/extend';
import TagsPage from 'flarum/tags/components/TagsPage';

function applyTagBackgrounds(root: Element | null) {
  if (!root) return;

  // Handle original TagTiles (if they exist)
  const originalTiles = root.querySelectorAll('li.TagTile');
  originalTiles.forEach((tile) => {
    applyBackgroundToTagTile(tile as HTMLElement);
  });

  // Handle splide-based layout from client1-header-adv extension
  const splideSlides = root.querySelectorAll('.splide__slide-tag');
  splideSlides.forEach((slide) => {
    applyBackgroundToSplideSlide(slide as HTMLElement);
  });
}

function applyBackgroundToTagTile(li: HTMLElement) {
  const link = li.querySelector('a.TagTile-info') as HTMLAnchorElement | null;
  const nameEl = li.querySelector('.TagTile-name') as HTMLElement | null;

  if (!link) return;

  const slug = extractSlugFromUrl(link.href);
  if (!slug) return;

  const bgUrl = getTagBackgroundUrl(slug);

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
}

function applyBackgroundToSplideSlide(slide: HTMLElement) {
  const link = slide.querySelector('a') as HTMLAnchorElement | null;
  const innerDiv = slide.querySelector('.splide__slide-tag-inner, .splide__slide-tag-inner-mobile') as HTMLElement | null;

  if (!link || !innerDiv) return;

  const slug = extractSlugFromUrl(link.href);
  if (!slug) return;

  const bgUrl = getTagBackgroundUrl(slug);

  if (bgUrl) {
    // Apply background to the inner div
    innerDiv.style.background = `url(${bgUrl})`;
    innerDiv.style.backgroundSize = 'cover';
    innerDiv.style.backgroundPosition = 'center';
    innerDiv.style.backgroundRepeat = 'no-repeat';

    // Hide text content when background image is present
    const textContent = innerDiv.querySelector('div');
    if (textContent) {
      textContent.style.display = 'none';
    }
  } else {
    // Reset to default behavior
    const textContent = innerDiv.querySelector('div');
    if (textContent) {
      textContent.style.display = '';
    }
  }
}

function extractSlugFromUrl(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    // Flarum tags routes are typically /t/:slug or /tags/:slug
    const parts = url.pathname.split('/').filter(Boolean);
    const tIndex = parts.indexOf('t');
    const tagsIndex = parts.indexOf('tags');

    if (tIndex !== -1 && parts[tIndex + 1]) return parts[tIndex + 1];
    if (tagsIndex !== -1 && parts[tagsIndex + 1]) return parts[tagsIndex + 1];
    if (parts.length > 0) return parts[parts.length - 1];

    return null;
  } catch {
    return null;
  }
}

function getTagBackgroundUrl(slug: string): string | null {
  try {
    // Find tag by slug in the store
    // @ts-ignore types provided by flarum/tags
    const tags = app.store.all('tags') as any[];
    const model = tags.find((t) => (typeof t.slug === 'function' ? t.slug() : t.attribute && t.attribute('slug')) === slug);

    if (!model) return null;

    return model.attribute ? model.attribute('wusong8899BackgroundURL') : null;
  } catch {
    return null;
  }
}

app.initializers.add('wusong8899-tag-background', () => {
  extend(TagsPage.prototype, 'oncreate', function (this: any, vnode?: any) {
    // Add delay to ensure DOM is fully rendered and other extensions have processed
    setTimeout(() => {
      const rootElement = vnode?.dom || document.querySelector('.TagsPage-content');
      applyTagBackgrounds(rootElement);
    }, 150); // Increased delay to ensure client1-header-adv has processed first
  });

  extend(TagsPage.prototype, 'onupdate', function (this: any, vnode?: any) {
    // Add delay to ensure DOM is fully updated and other extensions have processed
    setTimeout(() => {
      const rootElement = vnode?.dom || document.querySelector('.TagsPage-content');
      applyTagBackgrounds(rootElement);
    }, 150); // Increased delay to ensure client1-header-adv has processed first
  });

  // Also listen for custom events that might be triggered by other extensions
  document.addEventListener('tagsLayoutChanged', () => {
    setTimeout(() => {
      const rootElement = document.querySelector('.TagsPage-content');
      applyTagBackgrounds(rootElement);
    }, 50);
  });
});

