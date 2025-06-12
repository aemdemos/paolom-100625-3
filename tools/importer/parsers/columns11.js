/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell spanning both columns (colspan=2)
  // WebImporter.DOMUtils.createTable does not support colspan in the header directly, so we must do it manually

  // Gather main and sidebar content as left and right columns
  // Left column: main article/content
  let leftCell = [];
  const main = element.querySelector('main#aws-page-content-main');
  if (main) {
    const article = main.querySelector('article');
    if (article) {
      leftCell.push(article);
    } else {
      leftCell.push(...main.children);
    }
  }
  // Right column: sidebar
  let rightCell = [];
  const sidebar = element.querySelector('.blog-sidebar');
  if (sidebar) {
    rightCell.push(sidebar);
  }

  // Build the table with two columns in content row, but only ONE header cell spanning both columns
  const table = document.createElement('table');
  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns11)';
  th.colSpan = 2;
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Content row
  const trContent = document.createElement('tr');
  const tdLeft = document.createElement('td');
  if (leftCell.length) tdLeft.append(...leftCell);
  const tdRight = document.createElement('td');
  if (rightCell.length) tdRight.append(...rightCell);
  trContent.appendChild(tdLeft);
  trContent.appendChild(tdRight);
  table.appendChild(trContent);
  // Replace the original element
  element.replaceWith(table);
}
