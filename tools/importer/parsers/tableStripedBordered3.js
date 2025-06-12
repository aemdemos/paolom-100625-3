/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function: recursively flatten all td/th in a row, but only return the innermost ones
  function flattenCells(nodes) {
    const result = [];
    nodes.forEach(node => {
      if (node.tagName === 'TD' || node.tagName === 'TH') {
        // If this cell contains any td/th as children, ignore this outer cell and only include the inner ones
        const innerCells = Array.from(node.children).filter(
          el => el.tagName === 'TD' || el.tagName === 'TH'
        );
        if (innerCells.length > 0) {
          result.push(...flattenCells(innerCells));
        } else {
          result.push(node);
        }
      }
    });
    return result;
  }
  // Process all tables in the element
  const tables = element.querySelectorAll('table');
  if (!tables.length) return;

  tables.forEach((dataTable) => {
    const cells = [['Table (striped, bordered, tableStripedBordered3)']];
    const trEls = dataTable.querySelectorAll('tr');
    for (const tr of trEls) {
      // Flatten the row to include only innermost td/th
      const flatRow = flattenCells(Array.from(tr.children));
      if (flatRow.length > 0) {
        cells.push(flatRow);
      }
    }
    // Create and replace
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    dataTable.replaceWith(blockTable);
  });
}
