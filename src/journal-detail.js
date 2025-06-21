document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("journalDetail");
  const entries = JSON.parse(localStorage.getItem("travelEntries")) || [];

  const entry = entries.find(e => e.id === id);

  if (!entry) {
    container.innerHTML = "<p class='text-red-500'>Entry not found.</p>";
  } else {
    container.innerHTML = `
      <h2 class="text-3xl font-bold mb-2">${entry.destination}</h2>
      <p class="mb-2 text-gray-600">Date: ${entry.date}</p>
      <p class="mb-4 whitespace-pre-line">${entry.notes}</p>
      <img src="images/image1.jpg" class="w-40 h-40 rounded-xl" alt="Plan Icon" />
    `;
  }
});
