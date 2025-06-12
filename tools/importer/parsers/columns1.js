/* global WebImporter */
export default function parse(element, { document }) {
  // Get main content
  const main = element.querySelector('main');
  if (!main) return;
  const blogContent = main.querySelector('.blog-post-content');
  if (!blogContent) return;

  // Find all immediate children (for robust splitting)
  const children = Array.from(blogContent.childNodes).filter((n) => {
    // skip empty text nodes
    return n.nodeType !== 3 || n.textContent.trim();
  });

  // Find all tables with images: these are used for the 'image' column in each row
  const tables = children.filter(n => n.nodeType === 1 && n.tagName === 'TABLE');

  // Get first and second image tables if they exist
  const firstTable = tables[0] || null;
  const secondTable = tables[1] || null;

  // Partition content:
  // 1. All items before the first table: intro/lead text
  // 2. All items after the first table up to the second table
  // 3. All items after the second table
  let beforeFirst = [], afterFirst = [], afterSecond = [];
  let state = 'before';
  for (const node of children) {
    if (node === firstTable) {
      state = 'afterFirst';
      continue;
    }
    if (node === secondTable) {
      state = 'afterSecond';
      continue;
    }
    if (state === 'before') beforeFirst.push(node);
    else if (state === 'afterFirst') afterFirst.push(node);
    else afterSecond.push(node);
  }

  // Get image element from table (right column row 1)
  let rightImage1 = '';
  if (firstTable) {
    const img = firstTable.querySelector('img');
    rightImage1 = img ? img : firstTable;
  }

  // Get image element from table (left column row 2)
  let leftImage2 = '';
  if (secondTable) {
    const img = secondTable.querySelector('img');
    leftImage2 = img ? img : secondTable;
  }

  // Compose structure as in the markdown example
  const headerRow = ['Columns (columns1)'];
  const cells = [
    headerRow,
    [beforeFirst, rightImage1],
    [leftImage2, afterSecond]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
