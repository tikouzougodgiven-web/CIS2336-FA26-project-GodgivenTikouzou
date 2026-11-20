# UH Sugar Land Student Center Web App

**Developer:** Godgiven Tikouzou · CIS 2336 Web Application Development · Fall 2026

A website for a (fictional) new Student Center on the UH Sugar Land campus. Students can browse the five bookable rooms, check hours, read the FAQ, and request a room booking.

## Project structure

```text
CIS2336-FA26-project-GodgivenTikouzou/
├── frontend/
│   ├── index.html        Homepage: dynamic menu, rooms, live hours, map, Developer Contact
│   ├── FAQ.html          5 collapsible FAQ items (accordion)
│   ├── roombooking.html  Room booking form (5 rooms) with validation
│   ├── reference.html    Sources, media credits and AI prompts
│   ├── styles.css        Shared styles (responsive, mobile menu)
│   └── script.js         Shared JavaScript
├── backend/
│   └── app.js            Express server (Phase 2: serves the front-end only)
├── package.json
└── README.md
```

## How to run (first-time setup)

Requires [Node.js](https://nodejs.org/). In VS Code, open a terminal in the project root (the folder containing `frontend` and `backend`) and run:

```bash
npm install
npm start
```

Open http://localhost:8080 in a browser.

You can also open `frontend/index.html` directly in a browser. Everything on the front-end works without the server.

## Front-end features (Phase 2)

| Requirement | Where | How |
|---|---|---|
| Homepage + navigation menu | `index.html` | Menu is built by JavaScript from the `NAV_ITEMS` array (`buildNavigation()`). It highlights the current page and collapses into a toggle button on small screens. |
| Developer Contact section | `index.html#developer-contact` | Name and UH email |
| FAQ with 5 collapsible items | `FAQ.html` | Accessible accordion (`aria-expanded`), plus Expand all / Collapse all |
| Room booking form (5 rooms) | `roombooking.html` | Rooms come from the `ROOMS` array. Each field is validated when you leave it and again on submit. Errors appear inline and are announced to screen readers. |
| Availability check | `script.js` → `checkAvailability()` | Uses sample bookings for now. **Phase 3** will replace this with a `fetch()` call to the Express backend. |
| Reference page with AI prompts | `reference.html` | Every AI prompt is logged |
| Multimedia | `index.html` | Remote images (Lorem Picsum) and an embedded OpenStreetMap campus map |

### Booking validation rules
- Name: first and last name, letters only
- Email: must end in `@uh.edu` or `@cougarnet.uh.edu`
- Phone: optional, 10 digits
- Date: Monday–Saturday, from today up to 60 days ahead, not in the past
- Time: must fall within opening hours (Mon–Fri 8 AM–9 PM, Sat 9 AM–4 PM) and end by closing
- Attendees: 1 up to the selected room's capacity
- Purpose: 10–300 characters; the policy checkbox is required

## Testing the booking form
1. Click **Request booking** with an empty form. Every required field shows an error.
2. Choose *Media & Podcast Studio* and enter 5 attendees. You'll see a capacity error (the max is 3).
3. Choose *Riverbend Conference Room* tomorrow at 10:00 AM. It shows as already booked (sample data).
4. Fill in a valid booking. A confirmation message appears.
