/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure 'element' is not null
  if (!element) return;

  // Find the main article element
  let article = element.querySelector && element.querySelector('article.blog-post');
  // If not found, fallback to check if element itself is the article
  if (!article && element.matches && element.matches('article.blog-post')) {
    article = element;
  }

  // Prefer meta image in <meta property="image" ...>, fallback to first <img> in article
  let heroImgUrl = '';
  let heroImgEl = null;
  if (article) {
    const metaImg = article.querySelector('meta[property="image"]');
    if (metaImg && metaImg.content) {
      heroImgUrl = metaImg.content.startsWith('http') ? metaImg.content : 'https:' + metaImg.content;
    }
    if (!heroImgUrl) {
      const img = article.querySelector('img');
      if (img && img.src) {
        heroImgUrl = img.src.startsWith('http') ? img.src : 'https:' + img.src;
      }
    }
    if (heroImgUrl) {
      heroImgEl = document.createElement('img');
      heroImgEl.src = heroImgUrl;
      heroImgEl.alt = '';
    }
  }

  // Find main heading (h1)
  let mainHeading = null;
  if (article) {
    mainHeading = article.querySelector('h1');
  }

  // Compose the content row with the heading if it exists
  const contentRow = mainHeading ? [mainHeading] : [''];

  // Build the block table as per the example: header, image, heading
  const cells = [
    ['Hero'],
    [heroImgEl ? heroImgEl : ''],
    [contentRow],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
