/* global WebImporter */
export default function parse(element, { document }) {
  // There are two direct children divs: one for the button, one for the social links
  const children = Array.from(element.querySelectorAll(':scope > div'));
  let colSocial = null;
  let colButton = null;

  // Ensure correct order: social links in the left column, button in the right
  children.forEach((div) => {
    if (
      div.classList.contains('social-media') ||
      div.querySelector('ul')
    ) {
      colSocial = div;
    } else if (div.querySelector('a.button, a.btn-sign-up')) {
      colButton = div;
    }
  });

  // Fallbacks for resilience
  if (!colSocial && children.length > 0) colSocial = children[0];
  if (!colButton && children.length > 1) colButton = children[1];

  // Table: header row is a single cell; content row has 2 columns
  const headerRow = ['Columns (columns10)'];
  const contentRow = [colSocial, colButton];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
