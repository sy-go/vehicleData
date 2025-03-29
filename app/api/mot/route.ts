import { NextResponse } from 'next/server';

let cachedToken: string | null = null;
let tokenExpiration = 0;

async function getAccessToken() {
  const tokenUrl = process.env.MOT_TOKEN_URL;
  const clientId = process.env.MOT_CLIENT_ID;
  const clientSecret = process.env.MOT_CLIENT_SECRET;
  const scopeUrl = process.env.MOT_SCOPE_URL;

  const now = Date.now();
  if (cachedToken && tokenExpiration > now) {
    return cachedToken;
  }


  if (!tokenUrl || !clientId || !clientSecret || !scopeUrl) {
    throw new Error('Missing required environment variables for token request');
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scopeUrl,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
   // console.log(data)
   
  cachedToken = data.access_token;
  tokenExpiration = now + (data.expires_in * 1000);
  return cachedToken;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registrationNumber = searchParams.get('registration');
  const motApiKey = process.env.MOT_API_KEY;
  
  if (!registrationNumber) {
    return NextResponse.json({ error: 'Registration number is required' }, { status: 400 });
  }

  if (!motApiKey) {
    return NextResponse.json({ error: 'MOT API key is not configured' }, { status: 500 });
  }

  try {
    const accessToken = await getAccessToken();
    const url = `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${registrationNumber}`;

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': motApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch MOT history: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching MOT history' }, { status: 500 });
  }
}