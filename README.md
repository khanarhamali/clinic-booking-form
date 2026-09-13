# Clinic Appointment Booking Portal

A modern, full-stack patient appointment booking system built with **Next.js** and **TypeScript**, powered by **n8n workflows**, **Google Sheets**, and **Google Calendar**.

---

## Target Audience & Value Proposition

* **Audience:** Beneficial for doctors, clinics, and healthcare providers.
* **Core Value Proposition:** A fully automated, low-cost system that operates **24/7** (even on off days) without requiring any manual staff intervention. It can be seamlessly integrated into both your website and WhatsApp channels.

---

## Tech Stack

* **Frontend:** Next.js (React / App Router), TypeScript, Custom CSS
* **Backend Integration:** Next.js API Routes / n8n Webhooks
* **Automation & Storage:** n8n, Google Sheets, Google Calendar API, Gmail API
* **Deployment & Hosting:** Docker, Ubuntu Linux (DigitalOcean)

---

## Key Features & Workflow

* **Centralized Dashboard:** View all patient bookings at a glance in a single, organized Google Sheet.
* **Dynamic Slot Management:** Fetches events live from Google Calendar to display accurate, real-time available slots. Once a time slot is successfully booked, it automatically becomes unavailable to subsequent patients, preventing double bookings.
* **Conditional UI Flow:** Time slot selection and confirmation controls remain hidden until the user queries available dates via the "Get Slots" button.
* **Automated Confirmations:** When a patient submits details, an event is automatically created in Google Calendar, details are logged in Google Sheets, and a professional HTML confirmation email is dispatched to the patient via Gmail (with a copy sent for your reference).
* **AI & Scalability Ready:** Easily extendable with advanced workflows, such as AI agents, to power interactive question-and-answer systems.

---

## Key Benefits

* Completely automated operations with zero manual coordination.
* Reduced patient no-shows and eliminated scheduling conflicts.
* A budget-friendly, highly reliable setup running 24/7.

---

## Local Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/khanarhamali/clinic-booking.git
cd clinic-booking

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env.local` file in the root directory and map your development webhook endpoints:
```env
NEXT_PUBLIC_SLOTS_WEBHOOK=your_development_slots_webhook
NEXT_PUBLIC_BOOK_WEBHOOK=your_development_booking_webhook

```


4. **Run the development server:**
```bash
npm run dev

```


Open [http://localhost:3000](http://localhost:3000) in your browser to test the client interface.


## Backend Workflow Architecture

This frontend acts as the user interface layer. It communicates via API routes or direct webhooks to an automated **n8n** server instance, which handles Google Calendar event creation and automated patient confirmation emails.
