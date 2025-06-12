/* global WebImporter */
export default function parse(element, { document }) {
  const content = element.querySelector('section.blog-post-content');
  if (!content) return;

  // Find the first YouTube iframe in the content
  const iframe = content.querySelector('iframe');
  if (!iframe) return;
  const src = iframe.getAttribute('src') || '';
  let videoUrl = '';
  if (src.includes('youtube.com/embed/') || src.includes('youtube-nocookie.com/embed/')) {
    const match = src.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    videoUrl = match ? `https://www.youtube.com/watch?v=${match[1]}` : src;
  } else {
    return;
  }

  // Find poster image: previous <p> with <img>, or sibling <img> in same <p>
  let posterImg = null;
  const parentP = iframe.closest('p');
  if (parentP) {
    // Look for poster in previous <p>
    let prev = parentP.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'P') {
        const img = prev.querySelector('img');
        if (img) {
          posterImg = img;
          break;
        }
      }
      prev = prev.previousElementSibling;
    }
    // If still not found, check same <p>
    if (!posterImg) {
      const img = parentP.querySelector('img');
      if (img) posterImg = img;
    }
  }

  // Compose the embed table cell: image (if present) then the video link
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  cellContent.push(link);

  const cells = [
    ['Embed (embedVideo9)'],
    [cellContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the <p> containing the <iframe> with the block table
  if (parentP) {
    parentP.replaceWith(block);
    // Remove previous <p> if it only contained the poster image (to avoid duplicate)
    if (posterImg && posterImg.closest('p') && posterImg.closest('p').parentElement === content) {
      const imgP = posterImg.closest('p');
      if (imgP.childNodes.length === 1 && imgP.firstElementChild === posterImg) {
        imgP.remove();
      }
    }
  } else {
    iframe.replaceWith(block);
  }
}
