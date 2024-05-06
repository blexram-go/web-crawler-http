import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
    if (process.argv.length < 3) {
        console.log("Error! Missing the website argument.");
    } else if (process.argv.length > 3) {
        console.log("Error! Too many arguments.");
    }

    const baseURL = process.argv[2];
    console.log(`starting crawl of ${baseURL}`);
    const pages = await crawlPage(baseURL);
    printReport(pages);
};

main();