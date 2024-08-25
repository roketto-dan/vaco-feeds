import Parser from "rss-parser";

const parser = new Parser();

const responses = await Promise.allSettled(['https://www.jaaack.dev/rss.xml', 'https://v2.velog.io/rss/@yukimiau', 'https://odd.voyage/rss.xml'].map(async(url) => {
    const data = await parser.parseURL(url);
    const items = data.items;
    return items;
}));

const feeds = responses.reduce((feeds, response) => {
    if (response.status === 'fulfilled') {
        feeds.push(...response.value);
        return feeds;
    }
}, []);

console.log(feeds.length);