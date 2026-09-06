import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventDate = searchParams.get('eventDate');
  const slotsWebhook = process.env.N8N_SLOTS_WEBHOOK;

  if (!slotsWebhook) {
    return NextResponse.json({ error: 'Slots webhook not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${slotsWebhook}?eventDate=${eventDate}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const submitWebhook = process.env.N8N_SUBMIT_WEBHOOK;

  if (!submitWebhook) {
    return NextResponse.json({ error: 'Submit webhook not configured' }, { status: 500 });
  }

  try {
    const queryParams = new URLSearchParams(body);
    const response = await fetch(`${submitWebhook}?${queryParams.toString()}`);
    
    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}