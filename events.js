document.addEventListener("DOMContentLoaded", async () => {
  const eventList = document.getElementById("eventList");
  const searchInput = document.getElementById("searchInput");

  // ✅ Fetch Events from MongoDB (through backend)
  async function fetchEvents() {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const events = await response.json();

      if (events.length === 0) {
        eventList.innerHTML = `<p class="text-center text-muted">No upcoming events found.</p>`;
        return;
      }

      renderEvents(events);

      // 🔍 Search functionality
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = events.filter(e =>
          e.title.toLowerCase().includes(query) ||
          (e.location && e.location.toLowerCase().includes(query))
        );
        renderEvents(filtered);
      });

    } catch (err) {
      console.error("❌ Error fetching events:", err);
      eventList.innerHTML = `<p class="text-center text-danger">Server error! Please try again later.</p>`;
    }
  }

  // ✅ Display Events Dynamically
  function renderEvents(events) {
    eventList.innerHTML = events.map(e => `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm border-0 h-100">
          <img src="${e.imageUrl || 'https://via.placeholder.com/400x200?text=Donation+Event'}" class="card-img-top" alt="Event image">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">${e.title}</h5>
            <p class="card-text text-muted">${e.description || 'No description available.'}</p>
            <p><i class="bi bi-calendar-event text-danger"></i> <strong>${e.date || 'TBA'}</strong></p>
            <p><i class="bi bi-geo-alt-fill text-success"></i> ${e.location || 'Location not specified'}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load events when page opens
  fetchEvents();
});
