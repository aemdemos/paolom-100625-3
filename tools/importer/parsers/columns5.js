/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the promo tile grid: only use if it matches the columns block pattern
  const mainGrids = element.querySelectorAll('.lb-xb-grid.lb-row-max-large.lb-xb-equal-height');
  let grid = null;
  for (const g of mainGrids) {
    const cols = g.querySelectorAll(':scope > .lb-xbcol');
    // Heuristic: only blocks with 3 columns that are promo tiles
    if (cols.length >= 3 && g.querySelector('img')) {
      grid = g;
      break;
    }
  }
  if (!grid) return;
  // For each column in grid, use the <a> (with image and text)
  const cols = Array.from(grid.querySelectorAll(':scope > .lb-xbcol'));
  // Only support up to 3 columns (for columns5 style block)
  const columnEls = cols.slice(0, 3).map(col => {
    // Get the <a> as the main tile
    const a = col.querySelector('a');
    return a ? a : '';
  });
  // Construct the Columns (columns5) block
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns5)'],
    columnEls
  ], document);
  // Replace the outermost .lb-xb-grid.lb-row-max-large.lb-xb-equal-height with the table
  grid.parentNode.replaceChild(table, grid);
}