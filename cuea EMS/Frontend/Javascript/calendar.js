document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".calendar-grid");
  if (!grid) return;

  generateCalendar(); // only runs if the calendar exists
});

// Rest of your calendar code here...
