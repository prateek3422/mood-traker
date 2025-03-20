const days = document.getElementById("calendarGrid");
const mood = document.getElementsByClassName("mood");
const moodBtn = document.getElementById("submitMood");
const currentMonth = document.getElementById("currentMonth");
const nextPrevIcon = document.querySelectorAll(".icon");

//get date and year infromation
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let currDate = date.getDate();

// Helper for storage keys - use YYYY-MM-DD format
const getStorageKey = (year, month, day) => `mood-${year}-${month}-${day}`;
const currentDateKey = getStorageKey(currYear, currMonth, currDate);

let selectedMood;
// set mood selection
const moods = Array.from(mood).map((item) => {
  // handle mood selection
  item.addEventListener("click", () => {
    // Remove highlight from all moods
    Array.from(mood).forEach((m) => {
      m.querySelector("img").className = "w-16 h-16";
    });

    // Add highlight to selected mood

    let text = item.querySelector("p").textContent.trim();

    const moodMap = {
      happy: "😊",
      sad: "😢",
      love: "😍",
      surprise: "😲",
      fear: "😨",
      angry: "😡",
    };

    if (moodMap[text]) {
      item.querySelector("img").className = "invert-30 w-16 h-16";
      selectedMood = JSON.stringify({
        emoji: moodMap[text],
        date: currDate,
      });
    }
  });

  moodBtn.addEventListener("click", () => {
    if (selectedMood) {
      localStorage.setItem(currentDateKey, selectedMood);
      window.location.reload();
      displayCalendar(); // Refresh calendar to show the new mood
    }
  });
});

//current month

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const updateMonthDisplay = () => {
  currentMonth.innerText = `${months[currMonth]} ${currYear}`;
};

updateMonthDisplay();
// display calander function
const displayCalander = () => {
  // find first day of month
  const firstDay = new Date(currYear, currMonth, 1).getDay();
  // find last date of month
  const lastDate = new Date(currYear, currMonth + 1, 0).getDate();
  // find last day of month
  const lastDay = new Date(currYear, currMonth, lastDate).getDay();
  // find last date of last month
  const LastDateOfPreviousMoth = new Date(currYear, currMonth, 0).getDate();

  let calendarHTML = "";

  // Previous month days
  for (let i = firstDay; i > 0; i--) {
    const prevDate = LastDateOfPreviousMoth - i + 1;
    const prevMonthKey = getStorageKey(currYear, currMonth - 1, prevDate);
    const prevMoodData = localStorage.getItem(prevMonthKey);
    const emoji = prevMoodData ? JSON.parse(prevMoodData).emoji : "";
    calendarHTML += `
    <div class="day-cell prev-month">
      <div class="day">${prevDate}</div>
      <div class="emoji">${emoji}</div>
    </div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";
    const dayKey = getStorageKey(currYear, currMonth, i);
    const moodData = localStorage.getItem(dayKey);
    const emoji = moodData ? JSON.parse(moodData).emoji : "";

    calendarHTML += `
        <div class="day-cell ${isToday}">
          <div class="day">${i}</div>
          <div class="emoji">${emoji}</div>
        </div>`;
  }

  // Next month days

  for (let i = lastDay; i < 6; i++) {
    const nextDate = i - lastDay + 1;
    const nextMonthKey = getStorageKey(currYear, currMonth + 1, nextDate);
    const nextMoodData = localStorage.getItem(nextMonthKey);
    const emoji = nextMoodData ? JSON.parse(nextMoodData).emoji : "";

    calendarHTML += `
      <div class="day-cell next-month">
        <div class="day">${nextDate}</div>
        <div class="emoji">${emoji}</div>
      </div>`;
  }

  days.innerHTML = calendarHTML;
};

const currentMood = localStorage.getItem(currentDateKey);
if (currentMood) {
  const moodData = JSON.parse(currentMood);
  const emoji = moodData.emoji;

  // Find and highlight the corresponding mood button
  Array.from(mood).forEach((item) => {
    const text = item.querySelector("p").textContent.trim().toLowerCase();
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😡",
      love: "😍",
      surprise: "😲",
      fear: "😨",
    };

    if (emojiMap[text] === emoji) {
      item.querySelector("img").className = "invert-30 w-16 h-16";
    }
  });
}

displayCalander();

// next button

// next and previous month
nextPrevIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    // If clicked icon is previous icon then decrement current month by 1 else increment it by 1
    currMonth = icon.id === "prevMonthBtn" ? currMonth - 1 : currMonth + 1;

    // Handle year change
    if (currMonth < 0) {
      currMonth = 11; // December
      currYear--;
    } else if (currMonth > 11) {
      currMonth = 0; // January
      currYear++;
    }

    // Update the display
    updateMonthDisplay();
    displayCalander();
  });
});
