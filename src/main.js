import './add-plan.js';
import './style.css';

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();
let tempYear = currentDate.getFullYear();
let selectingYear = true;

const updateCalendar = () => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthYearString = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  monthYearElement.textContent = monthYearString;

  let datesHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay() || 7;

  for (let i = firstDayOfWeek - 1; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, -i + 1);
    datesHTML += `<div class="date inactive text-center">${prevDate.getDate()}</div>`;
  }

  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isToday = date.toDateString() === new Date().toDateString();
    const todayClass = isToday ? 'today' : '';
    datesHTML += `<div class="date ${todayClass} text-center">${i}</div>`;
  }

  const visibleCount = (datesHTML.match(/<div class="date/g) || []).length;
  const remainingDays = 42 - visibleCount;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(currentYear, currentMonth + 1, i);
    datesHTML += `<div class="date inactive text-center">${nextDate.getDate()}</div>`;

  }

  datesElement.innerHTML = datesHTML;
};

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

updateCalendar();


// Month & Year Grid Popup
const createGridPopup = () => {
  const existing = document.getElementById('monthYearPopup');
  if (existing) {
    existing.remove();
    return;
  }

  const popup = document.createElement('div');
  popup.id = 'monthYearPopup';
  popup.className = 'popup-grid';

  const rect = monthYearElement.getBoundingClientRect();
  popup.style.left = `${rect.left}px`;
  popup.style.top = `${rect.bottom + window.scrollY}px`;

  if (selectingYear) {
    const startYear = tempYear - 18;
    for (let i = 0; i < 36; i++) {
      const year = startYear + i;
      const btn = document.createElement('button');
      btn.textContent = year;
      btn.className = 'grid-btn';
      btn.onclick = () => {
        tempYear = year;
        selectingYear = false;
        popup.remove();
        createGridPopup(); // Re-open for month selection
      };
      popup.appendChild(btn);
    }
  } else {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'short' })
    );
    months.forEach((name, index) => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.className = 'grid-btn';
      btn.onclick = () => {
        currentDate.setFullYear(tempYear);
        currentDate.setMonth(index);
        updateCalendar();
        popup.remove();
        selectingYear = true;
      };
      popup.appendChild(btn);
    });
  }

  document.body.appendChild(popup);
};

monthYearElement.addEventListener('click', () => {
  createGridPopup();
});



  function addPlan() {
    const container = document.getElementById('plan-container');
    
    // Create new card
    const newCard = document.createElement('a');
    newCard.href = "your-destination-page.html";
    newCard.className = "block";

    newCard.innerHTML = `
      <div class="w-100 h-50 relative bg-[#93C896] rounded-3xl p-5 hover:cursor-pointer mb-6">
        <img src="images/image1.jpg" alt="Plan Icon" class="w-40 h-40 mb-3 rounded-2xl">
        <h2 class="text-2xl font-bold text-[#26313E] absolute left-1/2 top-10 transform -translate-x-1/2">Plan Your Trip</h2>
      </div>
    `;

    // Append the new card to the container
    container.appendChild(newCard);
  }




  