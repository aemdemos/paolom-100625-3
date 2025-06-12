/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the meta image for the hero image
  const metaImg = element.querySelector('meta[property="image"]');
  let heroImgEl = null;
  if (metaImg && metaImg.content) {
    heroImgEl = document.createElement('img');
    heroImgEl.src = metaImg.content;
    heroImgEl.alt = '';
  }

  // 2. Find the main heading (h1)
  const h1 = element.querySelector('h1.blog-post-title');

  // 3. Table rows must match the example:
  // Row 1: ['Hero']
  // Row 2: [image or empty string]
  // Row 3: [heading or empty string]
  const rows = [
    ['Hero'],
    [heroImgEl ? heroImgEl : ''],
    [h1 ? h1 : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}