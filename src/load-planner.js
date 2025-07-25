document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("plannerEntries");
  const entries = JSON.parse(localStorage.getItem("travelEntries")) || [];

  if (!container) return;

  if (entries.length === 0) {
    container.innerHTML = "<p class='text-gray-500'>No plans yet. Add one!</p>";
    return;
  }

  // Sort entries from newest to oldest by date
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Detect if we're on dashboard (index.html) to limit entries shown
  const isDashboard =
    window.location.pathname.includes("index.html") ||
    document.body.dataset.page === "dashboard";

  // Show only 2 entries on dashboard, all entries on planner
  const entriesToRender = isDashboard ? entries.slice(0, 4) : entries;

  // Clear container before rendering
  container.innerHTML = "";

  entriesToRender.forEach((entry) => {
    const card = document.createElement("a");
    card.href = `journal-detail.html?id=${entry.id}`;
    card.className = "block w-100 flex justify-center";

    // Use uploaded photo if exists; otherwise, fallback to default image
    const photoSrc = entry.headerPhoto ? entry.headerPhoto : "images/image1.jpg";

    card.innerHTML = `
      <div class="flex items-center bg-[#93C896] rounded-3xl p-6 w-full max-w-5xl h-48 mb-6 shadow-md gap-8">
        <img src="${photoSrc}" alt="Plan Icon" class="w-40 h-40 object-cover rounded-2xl" />
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-[#26313E] mb-2">${entry.destination}</h2>
          <p class="text-lg text-[#26313E]">${entry.date}</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
});
