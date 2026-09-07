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

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    boxSizing: 'border-box' as const,
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    outline: 'none'
  };

  const labelStyle = {
    textAlign: 'left' as const,
    marginBottom: '6px',
    fontSize: '11px',
    fontWeight: '700' as const,
    color: '#334155',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', margin: 0, background: '#0b132b', padding: '20px' }}>
      <div style={{ background: '#ffffff', padding: '35px 40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.8px', marginBottom: '12px', textTransform: 'uppercase' }}>
          Patient Portal
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
          Clinic Appointment
        </h2>
        
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 28px 0', lineHeight: '1.4' }}>
          Fill in your information to reserve a consultation slot
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={labelStyle}>Full Name</div>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              required 
              minLength={3} 
              value={form.fullName} 
              onChange={e => setForm({...form, fullName: e.target.value})} 
              style={inputStyle} 
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={labelStyle}>Email Address</div>
            <input 
              type="email" 
              placeholder="john.doe@example.com" 
              required 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={labelStyle}>Phone Number</div>
              <input 
                type="tel" 
                placeholder="+1 (555) 019-2834" 
                required 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                style={inputStyle} 
              />
            </div>
            <div>
              <div style={labelStyle}>Age</div>
              <input 
                type="number" 
                placeholder="30" 
                min={10} 
                max={100} 
                required 
                value={form.age} 
                onChange={e => setForm({...form, age: e.target.value})} 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <div style={labelStyle}>Consultation Date</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="date" 
                required 
                value={form.eventDate} 
                onChange={e => setForm({...form, eventDate: e.target.value})} 
                style={{ ...inputStyle, flex: 1 }} 
              />
              <button 
                type="button" 
                onClick={fetchAvailableSlots} 
                style={{ background: '#0284c7', color: 'white', border: 'none', padding: '11px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)' }}
              >
                {loadingSlots ? 'Loading...' : '↓ Load Available Slots'}
              </button>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>
            👉 Click "Load Available Slots" to fetch and populate the time options below.
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Select Time Slot</div>
            <select 
              required 
              value={form.selectedSlot} 
              onChange={e => setForm({...form, selectedSlot: e.target.value})} 
              style={{ ...inputStyle, background: '#f8fafc', cursor: 'pointer' }}
            >
              <option value="">-- Choose from loaded slots above --</option>
              {slots.map((s, idx) => {
                const text = `${s.start} - ${s.end}`;
                return <option key={idx} value={text}>{text}</option>;
              })}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            style={{ background: '#059669', color: 'white', border: 'none', padding: '14px', width: '100%', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '650', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', transition: 'background 0.2s' }}
          >
            {submitting ? 'Submitting...' : 'Confirm & Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}