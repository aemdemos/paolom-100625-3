/* global WebImporter */
export default function parse(element, { document }) {
  // The AWS global header does not contain a query-index.json URL in the HTML, but the block expects a specific URL for the search index.
  // The example markdown and block description instructs to use the sample index URL, which is not present in the HTML but is the correct behavior per the example.
  // There is no Section Metadata block in the example markdown, so only one table is needed.
  // The header must be exactly 'Search (search6)'.
  const searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const cells = [
    ['Search (search6)'],
    [searchIndexUrl]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
