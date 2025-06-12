/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main video poster image (img that is not an icon or decorative)
  // and the source video link (a URL to video provider)
  let posterImg = null;
  let videoUrl = null;

  // Try to find a prominent image (likely poster)
  posterImg = element.querySelector('img');

  // Try to find a link to an external video (YouTube, Vimeo, etc.) or direct .mp4/.webm
  const links = element.querySelectorAll('a,iframe');
  for (const link of links) {
    let href = link.getAttribute('href') || link.getAttribute('src');
    if (!href) continue;
    if (/vimeo|youtube|wistia|dailymotion|\.(mp4|webm|mov)(\?|$)/i.test(href)) {
      videoUrl = href;
      break;
    }
  }
  // If not found, fallback: use any visible link
  if (!videoUrl && links.length > 0) {
    let href = links[0].getAttribute('href') || links[0].getAttribute('src');
    if (href) videoUrl = href;
  }
  // As a last fallback, try to find a data attribute
  if (!videoUrl) {
    const dataVideo = element.querySelector('[data-video-url]');
    if (dataVideo) videoUrl = dataVideo.getAttribute('data-video-url');
  }

  // Compose the cell contents: poster image (if any), then link (if any)
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoUrl) {
    // Use a real <a> referencing the document instead of cloning
    const videoAnchor = document.createElement('a');
    videoAnchor.href = videoUrl;
    videoAnchor.textContent = videoUrl;
    cellContent.push(document.createElement('br'));
    cellContent.push(videoAnchor);
  }
  if (cellContent.length === 0) {
    cellContent.push(document.createTextNode('No embed video found.'));
  }

  // Build the Embed block table
  const table = WebImporter.DOMUtils.createTable([
    ['Embed (embedVideo4)'],
    [cellContent]
  ], document);

  element.replaceWith(table);
}
