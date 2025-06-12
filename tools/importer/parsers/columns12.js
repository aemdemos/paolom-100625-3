/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper for columns
  const wrapper = element.querySelector(':scope > .wrapper.row');
  if (!wrapper) return;

  // Get main content column (left)
  const mainSection = wrapper.querySelector('.nine.columns.content-right-rail main section');
  // Get sidebar column (right)
  const sidebar = wrapper.querySelector('.three.columns.leftnavcontainer > .leftnav');

  // Defensive: create empty div if missing, but try to get as much content as possible
  const mainContent = mainSection ? mainSection : document.createElement('div');
  const sidebarContent = sidebar ? sidebar : document.createElement('div');

  // Table structure: header row must be one column, followed by a two-column row
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns12)'],
    [mainContent, sidebarContent]
  ], document);

  element.replaceWith(table);
}
