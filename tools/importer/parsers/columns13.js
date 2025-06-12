/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content area
  const main = element.querySelector('main#aws-page-content-main');
  if (!main) return;
  const article = main.querySelector('article.blog-post');
  if (!article) return;

  // Find the main content section
  const blogContent = article.querySelector('section.blog-post-content');

  // === First Row, First Column: Intro (description), list and button ===
  // Find the first paragraph
  let firstText = null;
  let firstList = null;
  let firstButton = null;
  if (blogContent) {
    // Find paragraphs and lists
    const paragraphs = Array.from(blogContent.querySelectorAll('p'));
    const ulList = blogContent.querySelector('ul');
    // Find first paragraph with real content
    for (const p of paragraphs) {
      if (p.textContent.trim().length > 0) {
        firstText = p;
        break;
      }
    }
    // Grab the ul (list)
    if (ulList) {
      firstList = ulList;
    }
    // Find the first link styled as a button (or just the first link)
    const buttonLink = blogContent.querySelector('a');
    if (buttonLink) {
      // Wrap in a div with class 'button' if you want, but just use the link
      firstButton = buttonLink;
    }
  }
  const cell_1_1 = [];
  if (firstText) cell_1_1.push(firstText);
  if (firstList) cell_1_1.push(firstList);
  if (firstButton) cell_1_1.push(firstButton);

  // === First Row, Second Column: Top image ===
  // Find first image (could be inside a link)
  let topImage = null;
  if (blogContent) {
    const firstImgLink = blogContent.querySelector('a img');
    const firstImg = blogContent.querySelector('img');
    if (firstImgLink) {
      topImage = firstImgLink.closest('a'); // Include the anchor around the image
    } else if (firstImg) {
      topImage = firstImg;
    }
  }
  const cell_1_2 = [];
  if (topImage) cell_1_2.push(topImage);

  // === Second Row, First Column: 2nd image (below main content) ===
  let secondImage = null;
  if (blogContent) {
    // Get all images inside anchors, skip the first one
    const imgLinks = Array.from(blogContent.querySelectorAll('a img'));
    if (imgLinks.length > 1) {
      secondImage = imgLinks[1].closest('a');
    } else if (imgLinks.length === 1) {
      // See if there's another image (not the same as the first)
      const allImgs = Array.from(blogContent.querySelectorAll('img'));
      if (allImgs.length > 1) {
        secondImage = allImgs[1];
      }
    }
  }
  const cell_2_1 = [];
  if (secondImage) cell_2_1.push(secondImage);

  // === Second Row, Second Column: text + preview link/button ===
  // For the sake of structure, get a paragraph with text and the next link/button
  let previewText = null;
  let previewButton = null;
  if (blogContent) {
    const ps = Array.from(blogContent.querySelectorAll('p'));
    for (let i = 1; i < ps.length; i++) {
      const p = ps[i];
      if (p.textContent && p.textContent.toLowerCase().includes('preview')) {
        previewText = p;
        // Try to find a button or link (could be after the text, or a sibling)
        let nextLink = p.querySelector('a');
        if (!nextLink) {
          const next = p.nextElementSibling;
          if (next && next.tagName === 'A') nextLink = next;
        }
        previewButton = nextLink;
        break;
      }
    }
  }
  const cell_2_2 = [];
  if (previewText) cell_2_2.push(previewText);
  if (previewButton) cell_2_2.push(previewButton);

  // Build cells array for two rows of two columns
  const cells = [
    ['Columns block'],
    [cell_1_1, cell_1_2],
    [cell_2_1, cell_2_2]
  ];

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
