'use client';
import { useState } from 'react';

export default function BookingPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    eventDate: '',
    selectedSlot: ''
  });
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timeToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const fetchAvailableSlots = async () => {
    if (!form.eventDate) {
      alert('Please select a date first!');
      return;
    }

    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/book?eventDate=${form.eventDate}`);
      const data = await res.json();

      const workingSlots = [
        { start: "09:00:00 AM", end: "10:00:00 AM", startMin: 540, endMin: 600 },
        { start: "10:00:00 AM", end: "11:00:00 AM", startMin: 600, endMin: 660 },
        { start: "11:00:00 AM", end: "12:00:00 PM", startMin: 660, endMin: 720 },
        { start: "12:00:00 PM", end: "01:00:00 PM", startMin: 720, endMin: 780 },
        { start: "01:00:00 PM", end: "02:00:00 PM", startMin: 780, endMin: 840 },
        { start: "02:00:00 PM", end: "03:00:00 PM", startMin: 840, endMin: 900 },
        { start: "03:00:00 PM", end: "04:00:00 PM", startMin: 900, endMin: 960 },
        { start: "04:00:00 PM", end: "05:00:00 PM", startMin: 960, endMin: 1020 }
      ];

      const busyEvents = Array.isArray(data) ? data : (data.start ? [data] : []);
      const available = workingSlots.filter(slot => {
        let isBusy = false;
        busyEvents.forEach(ev => {
          if (!ev.start || !ev.end) return;
          const evStartMin = timeToMinutes(ev.start.time);
          const evEndMin = timeToMinutes(ev.end.time);
          if (slot.startMin < evEndMin && slot.endMin > evStartMin) isBusy = true;
        });
        return !isBusy;
      });

      setSlots(available);
    } catch (err) {
      alert('Error fetching slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert('Appointment successfully booked and confirmation email sent!');
        setForm({ fullName: '', email: '', phone: '', age: '', eventDate: '', selectedSlot: '' });
        setSlots([]);
      } else {
        alert('There was an issue with your booking.');
      }
    } catch (err) {
      alert('Network connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', margin: 0, background: '#f4f4f9' }}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '360px', textAlign: 'center' }}>
        <h3>Book Appointment</h3>
        <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px', lineHeight: '1.4' }}>
          <strong>Dr. John Doe</strong><br />
          Consultation Timing: Monday to Friday<br />
          9:00 AM to 5:00 PM
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Full Name</div>
          <input type="text" placeholder="Enter your full name" required minLength={3} value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Email Address</div>
          <input type="email" placeholder="example@email.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Phone Number</div>
          <input type="tel" placeholder="03001234567" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Age</div>
          <input type="number" placeholder="Enter your age" min={10} max={100} required value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Pick a Date</div>
          <div style={{ display: 'flex', gap: '8px', margin: '10px 0', alignItems: 'center' }}>
            <input type="date" required value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="button" onClick={fetchAvailableSlots} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '9px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              {loadingSlots ? 'Loading...' : 'Available Slots'}
            </button>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', marginTop: '8px' }}>Select Time Slot</div>
          <select required value={form.selectedSlot} onChange={e => setForm({...form, selectedSlot: e.target.value})} style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>
            <option value="">-- Select Time Slot --</option>
            {slots.map((s, idx) => {
              const text = `${s.start} - ${s.end}`;
              return <option key={idx} value={text}>{text}</option>;
            })}
          </select>

          <button type="submit" disabled={submitting} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', marginTop: '12px' }}>
            {submitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}