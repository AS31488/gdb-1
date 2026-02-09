import { NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export async function POST(request: Request) {
  // 1. Check if keys exist
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Missing Twitch API Keys in Environment Variables' },
      { status: 500 }
    );
  }

  try {
    const { query } = await request.json();

    // 2. Get Access Token
    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    );
    const accessToken = authResponse.data.access_token;

    // 3. Query IGDB
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

  } catch (error: any) {
    // This will print the REAL error to your Vercel logs
    console.error('API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}