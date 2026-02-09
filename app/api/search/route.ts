import { NextResponse } from 'next/server';
import axios from 'axios';

// 1. Securely get keys from Vercel Environment Variables
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export async function POST(request: Request) {
  // Check if keys are missing immediately
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Server Error: Missing Twitch API Keys in Vercel Settings.' },
      { status: 500 }
    );
  }

  try {
    const { query } = await request.json();

    // 2. Get Access Token (Auth)
    // We must ask Twitch for a token before we can search
    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    );

    const accessToken = authResponse.data.access_token;

    // 3. Query IGDB (Search)
    // specific query syntax for IGDB
    const igdbResponse = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${query}"; fields name, cover.url, first_release_date, summary, similar_games.name, similar_games.cover.url; limit 12;`,
      {
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`, // Pass the fresh token
        },
      }
    );

    return NextResponse.json(igdbResponse.data);

  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    
    // Return a real error message to the frontend
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch game data.' },
      { status: 500 }
    );
  }
}