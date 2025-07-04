document.addEventListener("DOMContentLoaded", () => {
  // Calendar Setup
  const datesContainer = document.getElementById("dates");
  const monthYear = document.getElementById("monthYear");
  const selectedDateInput = document.getElementById("selectedDate");
  const headerPhotoInput = document.getElementById("headerPhoto");
  const photoPreview = document.getElementById("photoPreview");
  const form = document.getElementById("journalForm");

  const budgetTableBody = document.querySelector("#budgetTable tbody");
  const addExpenseBtn = document.getElementById("addExpenseBtn");
  const expenseNameInput = document.getElementById("expenseName");
  const expenseAmountInput = document.getElementById("expenseAmount");

  // --- Calendar ---
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

      // Offset for Monday as first day
      const offset = firstDay === 0 ? 7 : firstDay;
      for (let i = 1; i < offset; i++) {
        const empty = document.createElement("div");
        datesContainer.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "cursor-pointer p-2 hover:bg-green-100 text-center rounded";
        dayDiv.textContent = day;

        dayDiv.addEventListener("click", () => {
          const selected = new Date(year, month, day);
          selectedDateInput.value = selected.toISOString().split("T")[0];
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

  // --- Photo Preview ---
  headerPhotoInput.addEventListener("change", () => {
    const file = headerPhotoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="w-full rounded-md max-h-40 object-cover" />`;
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.innerHTML = "";
    }
  });

  // --- Add expense row to budget table ---
  addExpenseBtn.addEventListener("click", () => {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (!name || isNaN(amount)) {
      alert("Please enter a valid expense name and amount");
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${name}</td>
      <td class="border px-4 py-2">$${amount.toFixed(2)}</td>
      <td class="border px-4 py-2">
        <button type="button" class="text-red-500 hover:text-red-700 removeBtn">Remove</button>
      </td>
    `;

    budgetTableBody.appendChild(row);

    // Remove button handler
    row.querySelector(".removeBtn").addEventListener("click", () => row.remove());

    expenseNameInput.value = "";
    expenseAmountInput.value = "";
  });

  // --- Form submit ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = form.selectedDate.value;
    const destination = form.destination.value.trim();
    const notes = form.notes.value.trim();
    const file = headerPhotoInput.files[0];

    if (!date || !destination) {
      alert("Please select a date and enter a destination");
      return;
    }

    // Collect budget from table rows
    const budgetRows = Array.from(budgetTableBody.querySelectorAll("tr"));
    const budget = budgetRows.map(row => {
      const expenseName = row.children[0].textContent.trim();
      const amountText = row.children[1].textContent.trim();
      // Remove dollar sign and parse float
      const amount = parseFloat(amountText.replace("$", ""));
      return { name: expenseName, amount };
    });

    function saveEntry(base64Image) {
      const entry = {
        id: Date.now().toString(),
        date,
        destination,
        notes,
        headerPhoto: base64Image || null,
        budget,
      };

      let entries = JSON.parse(localStorage.getItem("travelEntries")) || [];
      entries.push(entry);
      localStorage.setItem("travelEntries", JSON.stringify(entries));

      alert("✅ Your journal entry has been saved!");

      form.reset();
      selectedDateInput.value = "";
      photoPreview.innerHTML = "";
      budgetTableBody.innerHTML = ""; // clear budget rows
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => saveEntry(event.target.result);
      reader.readAsDataURL(file);
    } else {
      saveEntry(null);
    }
  });
});
