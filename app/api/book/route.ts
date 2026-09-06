import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventDate = searchParams.get('eventDate');
  const slotsWebhook = process.env.N8N_SLOTS_WEBHOOK;

  if (!slotsWebhook) {
    return NextResponse.json({ error: 'Slots webhook not configured' }, { status: 500 });
  }

  // Define standard working hours slots (9 AM to 5 PM)
  const allDaySlots = [
    "09:00:00 AM - 10:00:00 AM",
    "10:00:00 AM - 11:00:00 AM",
    "11:00:00 AM - 12:00:00 PM",
    "12:00:00 PM - 01:00:00 PM",
    "01:00:00 PM - 02:00:00 PM",
    "02:00:00 PM - 03:00:00 PM",
    "03:00:00 PM - 04:00:00 PM",
    "04:00:00 PM - 05:00:00 PM"
  ];

  try {
    // Fetch booked events from n8n / Google Calendar webhook
    const response = await fetch(`${slotsWebhook}?eventDate=${eventDate}`);
    const data = await response.json();

    let bookedSlots: string[] = [];

    // Extract booked slots/events from n8n response safely
    if (Array.isArray(data)) {
      bookedSlots = data.map(item => 
        typeof item === 'string' ? item : (item.slot || item.time || item.summary || JSON.stringify(item))
      );
    } else if (data && typeof data === 'object') {
      const possibleList = data.slots || data.data || data.result;
      if (Array.isArray(possibleList)) {
        bookedSlots = possibleList.map(item => 
          typeof item === 'string' ? item : (item.slot || item.time || item.summary || JSON.stringify(item))
        );
      }
    }

    // Filter out booked slots from total 9-to-5 slots
    const availableSlots = allDaySlots.filter(slot => {
      // Check if any booked slot overlaps or matches this timing string
      const isBooked = bookedSlots.some(booked => 
        booked.toLowerCase().includes(slot.toLowerCase().substring(0, 8)) // checks time match like "09:00:00"
      );
      return !isBooked;
    });

    return NextResponse.json(availableSlots.length > 0 ? availableSlots : ["No slots available for this date"]);
  } catch (error) {
    // Fallback to all slots if webhook fails
    return NextResponse.json(allDaySlots);
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