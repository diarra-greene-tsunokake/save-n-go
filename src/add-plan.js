document.addEventListener("DOMContentLoaded", () => {
  // Calendar Logic
  const datesContainer = document.getElementById("dates");
  const monthYear = document.getElementById("monthYear");
  const selectedDateInput = document.getElementById("selectedDate");

  if (datesContainer && monthYear && selectedDateInput) {
    let currentDate = new Date();

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      monthYear.textContent = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      datesContainer.innerHTML = "";

      for (let i = 1; i < firstDay; i++) {
        const empty = document.createElement("div");
        datesContainer.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "cursor-pointer p-2 hover:bg-green-100 text-center rounded";
        dayDiv.textContent = day;
        dayDiv.addEventListener("click", () => {
          const selected = new Date(year, month, day);
          selectedDateInput.value = selected.toISOString().split("T")[0]; // yyyy-mm-dd
        });
        datesContainer.appendChild(dayDiv);
      }
    }

    document.getElementById("prevBtn").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();
  }

  // Form Submission Logic
  const form = document.getElementById("journalForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const date = form.selectedDate.value;
      const destination = form.destination.value.trim();
      const notes = form.notes.value.trim();

      if (!date || !destination) {
        alert("Please fill in both date and destination!");
        return;
      }

      const entry = {
  id: Date.now().toString(), // 👈 Unique ID based on timestamp
  date,
  destination,
  notes
};

      // Get existing journal entries or start with empty array
      let entries = JSON.parse(localStorage.getItem("travelEntries")) || [];

      // Add new entry
      entries.push(entry);

      // Save back to localStorage
      localStorage.setItem("travelEntries", JSON.stringify(entries));

      alert("✅ Your journal entry has been saved!");

      // Optional: Reset form
      form.reset();
      form.selectedDate.value = "";
    });
  }
});
