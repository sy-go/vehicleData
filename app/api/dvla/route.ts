import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { registrationNumber } = await request.json();
  

    if (!registrationNumber) {
        return NextResponse.json({ error: 'Registration number is required' }, { status: 400 });
      }

  const url = process.env.DVLA_API_URL;
  const apiKey = process.env.DVLA_API_KEY;

  if (!url || !apiKey) {
    console.error('Missing DVLA API configuration');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ registrationNumber }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch vehicle details: ${response.status} ${errorText}`);
    }

    const data = await response.json();
        return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching vehicle details' }, { status: 500 });
  }
}