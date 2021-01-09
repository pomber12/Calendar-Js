// Get calendar
const calendarElements = document.querySelectorAll('[data-calendar]');
// Create month names array
const monthNames = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];
// Get todays date
const today = new Date();
// Get todays date in a day-month-year format
const todayFormatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
// Set today as selected date
let selected = today;

// Check if calendars exist
if(calendarElements.length > 0) {
  // Loop through calendars
  calendarElements.forEach(calendarEl => {
    // Create calendar header
    createCalendarHeader(calendarEl);
    // Create calendar days
    createCalendarDaysOfWeek(calendarEl);
    // Create calendar body
    createCalendarBody(calendarEl);
    // Create calendar
    createCalendar(calendarEl);
    // Add event listeners for prev month and next month buttons
    const prevMonthBtn = calendarEl.querySelector('.prev-month');
    const nextMonthBtn = calendarEl.querySelector('.next-month');
    prevMonthBtn.addEventListener('click', getPrevMonth.bind(calendarEl));
    nextMonthBtn.addEventListener('click', getNextMonth.bind(calendarEl));
  });
  
}


// Create calendar header
function createCalendarHeader(calendarEl) {
  // Create calendar header element
  const calendarHeader = document.createElement('div');
  calendarHeader.classList.add('calendar__header');
  // Create calendar header top element
  const calendarHeaderTop = document.createElement('div');
  calendarHeaderTop.classList.add('calendar__header_top');
  calendarHeaderTop.innerHTML = `
    <button class="btn prev-month"><span>&larr;</span></button>
    <h2 class="current-month">${selected.getMonth() + 1} - ${selected.getFullYear()}</h2>
    <button class="btn next-month"><span>&rarr;</span></button>
  `;
  // Append calendar header top to calendar header
  calendarHeader.appendChild(calendarHeaderTop);
  // Append calendar header to calendar
  calendarEl.appendChild(calendarHeader);
}

// Create calendar days
function createCalendarDaysOfWeek(calendarEl) {
  // Create calendar days element
  const calendarDays = document.createElement('div');
  calendarDays.classList.add('calendar__header_days', 'row');
  calendarDays.innerHTML = `
    <div class="column">Mon</div>
    <div class="column">Tue</div>
    <div class="column">Wed</div>
    <div class="column">Thu</div>
    <div class="column">Fri</div>
    <div class="column">Sat</div>
    <div class="column">Sun</div>
  `;
  // Append days to calendar header
  calendarEl.querySelector('.calendar__header').appendChild(calendarDays);
}

// Create calendar body
function createCalendarBody(calendarEl) {
  // Create calendar body element
  const calendarBody = document.createElement('div');
  calendarBody.classList.add('calendar__body');
  // Append calendar body to calendar
  calendarEl.appendChild(calendarBody);
}

// Create calendar
function createCalendar(calendarEl) {
  // Get calendar body element
  // Remove all content from calendar body
  const calendarBody = calendarEl.querySelector('.calendar__body');
  calendarBody.innerHTML = '';

  // Get the last date of the month
  // Get the previous month last date
  const date = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
  const prevDate = new Date(selected.getFullYear(), selected.getMonth(), 0);

  // Get calendar header element
  // Change the current month in the header based on the selected date
  const calendarHeader = calendarEl.querySelector('.calendar__header');
  calendarHeader.querySelector('.current-month').innerHTML = `${monthNames[selected.getMonth()]} - ${selected.getFullYear()}`;

  // Get number of days in selected month
  // Get the first days of the month - Mon, Tue... 
  // Set days of the week in order - 0 is Sunday
  const daysInMonth = date.getDate();
  const firstDayInMonth = new Date(selected.getFullYear(), selected.getMonth(), 1).getDay();
  const daysInWeek = [1, 2, 3, 4, 5, 6, 0];

  // Set the number of rows and columns
  const rows = 6; // there can be max 6 weeks in month, if month has 31 days and 1st day is on Sunday then the last 2 days are in 6th week
  const columns = 7; // because there are 7 days per week

  // Get starting point - from which day should current month start in the row(in which column)
  // Get previous month starting point - if current month start on Wednesday and prev month has 30 days then this should be 29
  let startingPoint = daysInWeek.indexOf(firstDayInMonth) + 1;
  let prevStartingDay = prevDate.getDate() - daysInWeek.indexOf(firstDayInMonth) + 1;

  // Set the counter for the current month
  // Set the counter for the next month
  let x = 1;
  let nextMonthStart = 1;

  // Loop through rows
  for(let i = 1; i < rows + 1; i++) {
    // Create row element
    const row = document.createElement('div');
    row.classList.add('row');

    // Loop through columns
    for(let j = 1; j < columns + 1; j++) {
      // Create column element
      const column = document.createElement('div');
      column.classList.add('box');

      // Create element for number
      // Append number element to column
      const numberEl = document.createElement('span');
      column.appendChild(numberEl);

      // Check if inside first row
      if( i === 1 ) {
        // Check if current column is less than current month starting point
        if( j < startingPoint ) { // in this case populate last month days
          // Add class in-prev-month, set date to data-date attribute
          // Insert the day inside column number element
          // increase prevStartingDay by 1
          column.classList.add('in-prev-month');
          column.setAttribute('data-date', `${prevStartingDay}-${selected.getMonth() === 0 ? 12 : selected.getMonth()}-${selected.getMonth() === 0 ? selected.getFullYear() - 1 : selected.getFullYear()}`);
          numberEl.innerHTML = prevStartingDay;
          prevStartingDay++;
        } else { // if inside current month
          // Set date to data-date attribute
          // Insert the day inside column number element
          // Increase current month counter by 1
          column.setAttribute('data-date', `${x}-${selected.getMonth() + 1}-${selected.getFullYear()}`);
          numberEl.innerHTML = x;
          x++;
        }
      }else if( i > 1 && x < daysInMonth + 1 ) { // check if in current month range after first row
        // Set date to data-date attribute
        // Insert the day inside column number element
        // Increase current month counter by 1
        column.setAttribute('data-date', `${x}-${selected.getMonth() + 1}-${selected.getFullYear()}`);
        numberEl.innerHTML = x;
        x++;
      }else { // in next month
        // Add class in-next-month, insert the day inside column number element
        // Set date to data-date attribute
        // Increase next month counter by 1
        column.classList.add('in-next-month');
        numberEl.innerHTML = nextMonthStart;
        column.setAttribute('data-date', `${nextMonthStart}-${selected.getMonth() + 2 === 13 ? 1 : selected.getMonth() + 2}-${selected.getMonth() + 2 === 13 ? selected.getFullYear() + 1 : selected.getFullYear()}`);
        nextMonthStart++;
      }

      // Check if today's date and add today class to column
      if(column.dataset.date === todayFormatted) {
        column.classList.add('today');
      }

      // And click event type to column
      column.addEventListener('click', (e) => {
        console.log(column.dataset.date);
      });

      // Append column to row
      row.appendChild(column);
    }

    // Append row to calendar body
    calendarBody.appendChild(row);
  }
}

const calendarBody = calendarEl.querySelector('.calendar__body');
calendarBody.innerHTML = '';

const date = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
const prevDate = new Date(selected.getFullYear(), selected.getMonth(), 0);

const calendarHeader = calendarEl.querySelector('.calendar__header');
  calendarHeader.querySelector('.current-month').innerHTML = `${monthNames[selected.getMonth()]} - ${selected.getFullYear()}`;

const daysInMonth = date.getDate();
const firstDayInMonth = new Date(selected.getFullYear(), selected.getMonth(),1).getDay();
const daysInWeek = [1, 2, 3, 4, 5, 6, 0];

const rows = 6;
const columns = 7;

let startingPoint = daysInWeek.indexOf(firstDayInMonth) + 1;
let prevStartingDay = prevDate.getDate() - daysInWeek.indexOf(firstDayInMonth) + 1;

let x = 1;
let nextMonthStart = 1;

for(let i = 1; i < rows + 1; i++) {

}

const row = document.createElement('div');
row.classList.add('row');

for(let j = 1; j < columns + 1; j++) {

}

const column = document.createElement('div');
column.classList.add('box');
const numberEl = document.createElement('span');
column.appendChild(numberEl);

if( i === 1 ) {
        if( j < startingPoint ) { 
          column.classList.add('in-prev-month');
          column.setAttribute('data-date', `${prevStartingDay}-${selected.getMonth() === 0 ? 12 : selected.getMonth()}-${selected.getMonth() === 0 ? selected.getFullYear() - 1 : selected.getFullYear()}`);
          numberEl.innerHTML = prevStartingDay;
          prevStartingDay++;
        } else { 
          column.setAttribute('data-date', `${x}-${selected.getMonth() + 1}-${selected.getFullYear()}`);
          numberEl.innerHTML = x;
          x++;
        }
      }


      else if( i > 1 && x < daysInMonth + 1 ) { 
        column.setAttribute('data-date', `${x}-${selected.getMonth() + 1}-${selected.getFullYear()}`);
        numberEl.innerHTML = x;
        x++;
      }


      else { 
        column.classList.add('in-next-month');
        numberEl.innerHTML = nextMonthStart;
        column.setAttribute('data-date', `${nextMonthStart}-${selected.getMonth() + 2 === 13 ? 1 : selected.getMonth() + 2}-${selected.getMonth() + 2 === 13 ? selected.getFullYear() + 1 : selected.getFullYear()}`);
        nextMonthStart++;
      }

      if(column.dataset.date === todayFormatted) {
     column.classList.add('today');
     }

     column.addEventListener('click', (e) => {
     console.log(column.dataset.date);
    });

    row.appendChild(column);
    calendarBody.appendChild(row);

    // Get prev month
function getPrevMonth(e) {
  e.preventDefault();
  selected = new Date(selected.getFullYear(), selected.getMonth() - 1, 1);
  createCalendar(this);
}

// Get next month
function getNextMonth(e) {
  e.preventDefault();
  selected = new Date(selected.getFullYear(), selected.getMonth() + 1, 1);
  createCalendar(this);
}