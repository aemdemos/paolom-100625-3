/* global WebImporter */
export default function parse(element, { document }) {
  // Array to hold each column cell's content
  const columnCells = [];

  // 1. Get the four .three.columns blocks from the nav-wrapper's .row
  const navWrapper = element.querySelector('.nav-wrapper');
  if (navWrapper) {
    const navRow = navWrapper.querySelector('.row');
    if (navRow) {
      // Only immediate children (not descendants)
      const navCols = Array.from(navRow.children).filter(div =>
        div.classList.contains('three') && div.classList.contains('columns')
      );
      columnCells.push(...navCols);
    }
  }

  // 2. Get the hiring block (rightmost column)
  const hiringDiv = Array.from(element.children).find(div => div.classList.contains('hiring'));
  if (hiringDiv) {
    columnCells.push(hiringDiv);
  }

  // Build the table: first row is single header cell, second row is the columns
  const cells = [['Columns (columns15)'], columnCells];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
