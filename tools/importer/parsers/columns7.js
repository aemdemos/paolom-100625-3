/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector(
    '.lb-xb-grid.lb-row-max-large.lb-snap.lb-tiny-xb-1.lb-small-xb-3.lb-large-xb-5'
  );
  // If not found, fallback to a first .lb-xb-grid
  const mainGrid = grid || element.querySelector('.lb-xb-grid');
  // Get all immediate child columns
  const columns = mainGrid ? Array.from(mainGrid.children) : [];
  // If there aren't any columns, fallback: treat the whole element as a single cell
  const cells = [];
  // Header row: must match exactly as described
  cells.push(['Columns (columns7)']);
  if (columns.length > 0) {
    // Each cell is a reference to the existing column node
    cells.push(columns);
  } else {
    // Fallback: just drop the entire content in one column
    cells.push([element]);
  }
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element in the DOM
  element.replaceWith(table);
}
