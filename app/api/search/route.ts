import { NextResponse } from 'next/server';
import axios from 'axios';

// Environment variables (store these in .env.local file)
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export async function POST(request: Request) {
  const { query } = await request.json();

  // 1. Get Access Token (Authentication)
  const authResponse = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`);
  const accessToken = authResponse.data.access_token;

  // 2. Query IGDB (The Search Engine Logic)
  // We search for games by name, and ask for: name, cover url, release date, and SIMILAR GAMES (related content)
  const igdbResponse = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${query}"; fields name, cover.url, first_release_date, summary, similar_games.name, similar_games.cover.url; limit 10;`,
    {
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return NextResponse.json(igdbResponse.data);
}