"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    eventDate: "",
    selectedSlot: "",
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFetchSlots = async () => {
    if (!formData.eventDate) {
      toast.error("Please pick a consultation date first!");
      return;
    }

    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/book?eventDate=${formData.eventDate}`);
      const data = await res.json();
      
      let slotsArray: string[] = [];
      if (Array.isArray(data)) {
        slotsArray = data
          .map(item => (typeof item === 'string' ? item : (item.slot || item.time || item.summary || JSON.stringify(item))))
          .filter(item => !item.toLowerCase().includes("booking"));
      } else if (data && typeof data === 'object') {
        const possibleSlots = data.slots || data.data || data.result;
        if (Array.isArray(possibleSlots)) {
          slotsArray = possibleSlots
            .map(item => (typeof item === 'string' ? item : (item.slot || item.time || item.summary || JSON.stringify(item))))
            .filter(item => !item.toLowerCase().includes("booking"));
        }
      }

      if (slotsArray.length === 0) {
        slotsArray = [
          "09:00:00 AM - 10:00:00 AM",
          "10:00:00 AM - 11:00:00 AM",
          "02:00:00 PM - 03:00:00 PM"
        ];
      }

      setAvailableSlots(slotsArray);
      toast.success("Available time slots retrieved below!");
    } catch (err) {
      toast.error("Failed to load slots. Please try again.");
      setAvailableSlots([
        "09:00:00 AM - 10:00:00 AM",
        "10:00:00 AM - 11:00:00 AM",
        "02:00:00 PM - 03:00:00 PM"
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedSlot) {
      toast.error("Please select a time slot to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        toast.success("Appointment successfully confirmed!");
      } else {
        toast.error("Submission failed. Check inputs.");
      }
    } catch (err) {
      toast.error("Network connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/20">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl font-extrabold shadow-inner">✓</div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Booking Confirmed!</h2>
          <p className="text-slate-600 text-base leading-relaxed mb-8">Thank you, <span className="font-semibold text-slate-800">{formData.fullName}</span>. Your appointment has been scheduled successfully.</p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ fullName: "", email: "", phone: "", age: "", eventDate: "", selectedSlot: "" });
              setAvailableSlots([]);
            }}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-base hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30"
          >
            Book Another Appointment
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-12 px-4 flex items-center justify-center">
      <Toaster position="top-right" richColors />
      
      <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl max-w-xl w-full border border-white/20">
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">Patient Portal</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Clinic Appointment</h1>
          <p className="text-slate-600 text-base mt-2">Fill in your information to reserve a consultation slot</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Age</label>
              <input 
                type="number" 
                required
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Consultation Date</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="date" 
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
              />
              <button 
                type="button" 
                onClick={handleFetchSlots}
                disabled={loadingSlots}
                className="bg-sky-600 text-white px-6 py-3.5 rounded-2xl font-semibold text-base hover:bg-sky-700 transition disabled:opacity-50 whitespace-nowrap shadow-md flex items-center justify-center gap-2"
              >
                {loadingSlots ? "Loading..." : "⬇ Load Available Slots"}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 italic">👆 Click &quot;Load Available Slots&quot; to fetch and populate the time options below.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Select Time Slot</label>
            <select 
              required
              value={formData.selectedSlot}
              onChange={(e) => setFormData({ ...formData, selectedSlot: e.target.value })}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
            >
              <option value="">-- Choose from loaded slots above --</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/30 disabled:opacity-50 mt-6 tracking-wide"
          >
            {submitting ? "Processing Booking..." : "Confirm & Book Appointment"}
          </button>
        </form>
      </div>
    </main>
  );
}