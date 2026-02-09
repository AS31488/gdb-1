import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();
  
  // We pull from a reliable source like GameSpot or IGN RSS
  const feed = await parser.parseURL('https://www.gamespot.com/feeds/news/');
  
  // We map it to a clean format for our frontend
  const newsItems = feed.items.slice(0, 6).map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    snippet: item.contentSnippet,
  }));

  return NextResponse.json(newsItems);
}