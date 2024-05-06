import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('normalizeURL slash', () => {
    const input = 'http://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('normalizeURL capitals', () => {
    const input = 'https://blog.BOOT.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML absolute and relative', () => {
    const inputURL = 'https://blog.boot.dev';
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>';
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ['https://blog.boot.dev/path/one', 'https://other.com/path/one'];
    expect(actual).toEqual(expected);
});