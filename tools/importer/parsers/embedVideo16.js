/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first image and the corresponding external video link
  let videoImg = null;
  let videoUrl = null;

  // Try to find an <img> that is visually a video poster and its associated video URL
  // First, look for an <a> wrapping an <img> (common pattern for video posters)
  const anchorImages = Array.from(element.querySelectorAll('a'));
  for (const a of anchorImages) {
    const img = a.querySelector('img');
    // Accept any image for poster, but we want to pair it only with a true video link
    if (img && a.href && (a.href.includes('vimeo.com') || a.href.includes('youtube.com') || a.href.includes('youtu.be'))) {
      videoImg = img;
      videoUrl = a.href;
      break;
    }
  }

  // If not found, try to find a standalone video poster (img) and a separate link
  if (!videoImg) {
    // Heuristic: take the first large image that isn't a decoration
    const imgs = element.querySelectorAll('img');
    videoImg = imgs.length ? imgs[0] : null;
  }
  if (!videoUrl) {
    // Look for any <a> with vimeo/youtube
    for (const a of anchorImages) {
      if (a.href && (a.href.includes('vimeo.com') || a.href.includes('youtube.com') || a.href.includes('youtu.be'))) {
        videoUrl = a.href;
        break;
      }
    }
  }
  // If still not found, check for iframes
  if (!videoUrl) {
    const iframes = element.querySelectorAll('iframe');
    for (const iframe of iframes) {
      if (iframe.src && (iframe.src.includes('vimeo.com') || iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be'))) {
        videoUrl = iframe.src;
        break;
      }
    }
  }
  // As a fallback, find any plausible video file links
  if (!videoUrl) {
    for (const a of anchorImages) {
      if (/^https?:\/\/[^\s]+\.(mp4|webm|mov)(\?.*)?$/i.test(a.href)) {
        videoUrl = a.href;
        break;
      }
    }
  }

  // Compose the block table as required: first the image (if present), then the link (if present)
  const cellContent = [];
  if (videoImg) cellContent.push(videoImg);
  if (videoUrl) {
    if (videoImg) cellContent.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // Only create and replace if we have at least a videoUrl (image is optional as a poster)
  if (videoUrl) {
    const table = WebImporter.DOMUtils.createTable([
      ['Embed (embedVideo16)'],
      [cellContent]
    ], document);
    element.replaceWith(table);
  }
}