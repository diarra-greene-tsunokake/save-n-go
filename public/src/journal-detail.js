document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("journalDetail");
  const entries = JSON.parse(localStorage.getItem("travelEntries")) || [];
  let entry = entries.find(e => e.id === id);

  if (!entry) {
    container.innerHTML = "<p class='text-red-500'>Entry not found.</p>";
    return;
  }

  function renderView() {
    const budgetRows = (entry.budget || [])
      .map(item => `
        <tr>
          <td class="border px-4 py-2">${item.name}</td>
          <td class="border px-4 py-2">$${item.amount.toFixed(2)}</td>
        </tr>
      `).join("");

    container.innerHTML = `
      <h2 class="text-3xl font-bold mb-2">${entry.destination}</h2>
      <p class="mb-2 text-gray-600">Date: ${entry.date}</p>
      <p class="mb-4 whitespace-pre-line">${entry.notes}</p>
      <img src="${entry.headerPhoto || 'images/image1.jpg'}" class="w-40 h-40 rounded-xl mb-6" alt="Header Photo" />

      <h3 class="text-xl font-semibold mb-2">Budget Planner</h3>
      <table class="w-full border border-gray-300 mb-6">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-4 py-2">Expense</th>
            <th class="border px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${budgetRows || `<tr><td class="px-4 py-2" colspan="2">No expenses added.</td></tr>`}
        </tbody>
      </table>

      <button id="editBtn" class="mr-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit</button>
      <button id="deleteBtn" class="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
    `;

    document.getElementById("editBtn").addEventListener("click", renderEditForm);
    document.getElementById("deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        const updatedEntries = entries.filter(e => e.id !== id);
        localStorage.setItem("travelEntries", JSON.stringify(updatedEntries));
        window.location.href = "planner.html";
      }
    });
  }

  function renderEditForm() {
    const budgetRows = (entry.budget || [])
      .map((item) => `
        <tr>
          <td><input type="text" name="expenseName" value="${item.name}" class="w-full border px-2 py-1" /></td>
          <td><input type="number" name="expenseAmount" value="${item.amount}" class="w-full border px-2 py-1" /></td>
          <td><button type="button" class="removeRowBtn text-red-600 hover:text-red-800">Remove</button></td>
        </tr>
      `).join("");

    container.innerHTML = `
      <form id="editForm" class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
        <h2 class="text-2xl font-semibold text-center">Edit Journal Entry</h2>

        <label class="block">Date
          <input type="date" name="selectedDate" value="${entry.date}" class="w-full border p-2 rounded" required />
        </label>

        <label class="block">Destination
          <input type="text" name="destination" value="${entry.destination}" class="w-full border p-2 rounded" required />
        </label>

        <label class="block">Notes
          <textarea name="notes" rows="4" class="w-full border p-2 rounded">${entry.notes}</textarea>
        </label>

        <fieldset>
          <legend class="text-lg font-medium mb-2">Budget Planner</legend>
          <table class="w-full border border-gray-300" id="budgetTable">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-2 py-1">Expense</th>
                <th class="border px-2 py-1">Amount</th>
                <th class="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>${budgetRows}</tbody>
          </table>
          <button type="button" id="addBudgetRow" class="mt-2 text-sm text-blue-600 hover:underline">+ Add row</button>
        </fieldset>

        <div class="flex justify-center gap-6">
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save</button>
          <button type="button" id="cancelBtn" class="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">Cancel</button>
        </div>
      </form>
    `;

    document.getElementById("addBudgetRow").addEventListener("click", () => {
      const tbody = document.querySelector("#budgetTable tbody");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" name="expenseName" class="w-full border px-2 py-1" placeholder="Expense name" /></td>
        <td><input type="number" name="expenseAmount" class="w-full border px-2 py-1" placeholder="Amount" min="0" step="0.01" /></td>
        <td><button type="button" class="removeRowBtn text-red-600 hover:text-red-800">Remove</button></td>
      `;
      tbody.appendChild(newRow);
      newRow.querySelector(".removeRowBtn").addEventListener("click", () => newRow.remove());
    });

    container.querySelectorAll(".removeRowBtn").forEach(btn =>
      btn.addEventListener("click", (e) => e.target.closest("tr").remove())
    );

    const editForm = document.getElementById("editForm");
    const cancelBtn = document.getElementById("cancelBtn");

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newDate = editForm.selectedDate.value;
      const newDestination = editForm.destination.value.trim();
      const newNotes = editForm.notes.value.trim();

      const expenseNames = [...editForm.querySelectorAll('input[name="expenseName"]')];
      const expenseAmounts = [...editForm.querySelectorAll('input[name="expenseAmount"]')];

      const budget = expenseNames.map((input, i) => ({
        name: input.value.trim(),
        amount: parseFloat(expenseAmounts[i].value) || 0,
      })).filter(item => item.name);

      if (!newDate || !newDestination) {
        alert("Please fill in both date and destination!");
        return;
      }

      entry.date = newDate;
      entry.destination = newDestination;
      entry.notes = newNotes;
      entry.budget = budget;

      const index = entries.findIndex(e => e.id === id);
      entries[index] = entry;
      localStorage.setItem("travelEntries", JSON.stringify(entries));

      alert("✅ Your journal entry has been updated!");
      renderView();
    });

    cancelBtn.addEventListener("click", renderView);
  }

  renderView();
});
