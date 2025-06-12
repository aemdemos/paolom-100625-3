/* global WebImporter */
export default function parse(element, { document }) {
  // The search block table should contain the header and a plain text URL, not a link
  let searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  // Optionally try to find a search form with an action attribute for future extensibility
  // but for this block, the canonical URL should be used
  const cells = [
    ['Search (search17)'],
    [searchIndexUrl], // plain string, not a link
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
