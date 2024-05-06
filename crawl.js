import { JSDOM } from 'jsdom';

function normalizeURL(baseURL) {
    const normalizedURL = new URL(baseURL);
    let fullPath = `${normalizedURL.host}${normalizedURL.pathname}`;

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

async function fetchHTML(currentURL) {
    let response;
    try {
        response = await fetch(currentURL);
    } catch (err) {
        throw new Error(`Got Network Error: ${err.message}`);
    }

    if (response.status > 399) {
        throw new Error(`Got HTTP Error: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes("text/html")) {
        throw new Error(`Got non-HTML response: ${contentType}`);
    }
    return response.text();
}

async function crawlPage(baseURL, currentURL=baseURL, pages={}) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeURL(currentURL);
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }
    pages[normalizedURL] = 1;

    console.log(`crawling ${currentURL}`);
    let html = '';
    try {
        html = await fetchHTML(currentURL);
    } catch (err) {
        console.log(`${err.message}`);
        return pages;
    }

    const nextURLs = getURLsFromHTML(html, baseURL);
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages);
    }
    return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };