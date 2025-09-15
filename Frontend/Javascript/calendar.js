document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".calendar-grid");
  if (!grid) return;

  // Initialize Calendar Grid and Event Handling
  generateCalendar(); // Ensure the calendar is generated first
  renderEvents(); // Render events based on user role
  loadAdminCalendar(); // Show admin event form if user is admin
});

// ========================
// Calendar.js
// ========================

// Fetch events based on user role and code
async function fetchEvents() {
  const user = JSON.parse(localStorage.getItem("user")) || { role: "student", code: "guest" };

  try {
    const res = await fetch(`http://localhost:5000/api/calendar/events?role=${user.role}&code=${user.code}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}

// Render events on calendar
async function renderEvents() {
  // Remove old events if any
  document.querySelectorAll('[data-date] .event').forEach(e => e.remove());

  // Fetch events for the current user
  const events = await fetchEvents();
  events.forEach(ev => {
    const date = new Date(ev.start_time).toISOString().split('T')[0]; // Format date
    const cell = document.querySelector(`[data-date="${date}"]`);
    if (cell) {
      const div = document.createElement('div');
      div.className = 'event';
      div.textContent = ev.title;
      cell.appendChild(div); // Append event to the cell
    }
  });
}

// Add event (Admin only can create public events)
async function addEvent() {
  const text = document.getElementById('eventText').value.trim();
  const date = document.getElementById('eventDate').value;
  if (!text || !date) return alert("Enter event title and date");

  const user = JSON.parse(localStorage.getItem("user")) || { role: "student", code: "guest" };

  // Only allow admins to create events
  if (user.role !== "admin") {
    alert("You do not have permission to add events.");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: text,
        start_time: date,
        created_by: user.code,
        role: "admin" // Event created by admin
      })
    });

    // Clear input fields after adding the event
    document.getElementById('eventText').value = '';
    document.getElementById('eventDate').value = '';

    // Re-render events after adding
    renderEvents();
  } catch (err) {
    console.error("Failed to add event:", err);
  }
}

// Calendar Generation Logic
function generateCalendar() {
  const body = document.getElementById('calendar-body');
  if (!body) return;

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      if ((i === 0 && j < firstDay) || date > daysInMonth) {
        row.appendChild(cell);
        continue;
      }
      const iso = currentYear + "-" + String(currentMonth + 1).padStart(2, '0') + "-" + String(date).padStart(2, '0');
      cell.setAttribute('data-date', iso);
      cell.innerHTML = "<strong>" + date + "</strong>";
      row.appendChild(cell);
      date++;
    }
    body.appendChild(row);
    if (date > daysInMonth) break;
  }
}

// Load Admin Calendar Logic (Show admin's event form)
function loadAdminCalendar() {
  const user = JSON.parse(localStorage.getItem("user")) || { role: "guest" };

  // If user is admin, show the event creation form
  if (user.role === "admin") {
    document.getElementById('admin-event-form').style.display = 'block';  // Show admin event form
  } else {
    document.getElementById('admin-event-form').style.display = 'none';   // Hide for students
  }
}
