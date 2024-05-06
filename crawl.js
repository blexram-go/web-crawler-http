import { JSDOM } from 'jsdom';

function normalizeURL(baseURL) {
    const normalizedURL = new URL(baseURL);
    let fullPath = `${normalizedURL.hostname}${normalizedURL.pathname}`;

    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
}

function getURLsFromHTML(body, url) {
    const urls = [];
    const dom = new JSDOM(body);
    const anchors = dom.window.document.querySelectorAll('a');

    for (let anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href');

            try {
                href = new URL(href, url).href;
                urls.push(href);
            } catch (err) {
                console.log(`${err.message}: ${href}`);
            }
        }
    }
    return urls;

}

export { normalizeURL, getURLsFromHTML };