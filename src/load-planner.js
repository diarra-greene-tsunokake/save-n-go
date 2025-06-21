document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("plannerEntries");
  const entries = JSON.parse(localStorage.getItem("travelEntries")) || [];

  if (entries.length === 0) {
    container.innerHTML = "<p class='text-gray-500'>No plans yet. Add one!</p>";
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("a");
    card.href = `journal-detail.html?id=${entry.id}`; // Or make it dynamic later
    card.className = "block";

    card.innerHTML = `
  <div class="w-full h-50 relative bg-[#93C896] rounded-3xl p-5 hover:cursor-pointer mb-6">
    <img src="images/image1.jpg" alt="Plan Icon" class="w-40 h-40 mb-3 rounded-2xl">
    <h2 class="text-2xl font-bold text-[#26313E] absolute left-1/2 top-10 transform -translate-x-1/2">
      ${entry.destination}
    </h2>
    <p class="absolute left-1/2 top-24 transform -translate-x-1/2 text-sm text-[#26313E] max-w-xs text-center">
      ${entry.date}
    </p>
  </div>
`;

    container.appendChild(card);
  });
});
//   entries.push(entry);