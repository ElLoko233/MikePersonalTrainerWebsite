// list of the months of the wek
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();


// TODO:: add an event listener to the modal-header so that when its clicked it well reset the current date and year to today's one

// html element that displays the current month
const currentMonthElement = document.querySelector("#session-modal-date-picker #model-header #current-month");

// html element that displays the selected date
const selectedDateElement = document.querySelector("#session-modal-date-picker #model-header #selected-date");

// html element that containes the days that are displayed
const daysListElement = document.querySelector("#session-modal-date-picker #modal-week-days #modal-days");

// getting the prevmonth button
const prevMonthIconElement = document.querySelector("#session-modal-date-picker #model-header #session-previouse-month");
// adding a click event listener
prevMonthIconElement.addEventListener("click", (event) => {
    // decrementing the current month
    currentMonth--;

    // checking whether we have entered a prev year
    if(currentMonth < 0 ){
        let newdate = new Date(currentYear, currentMonth);
        currentMonth = newdate.getMonth();
        currentYear = newdate.getFullYear();
    }

    // re-rendering the calander
    renderCalander();
});
// TODO adding an event listener for when the left arrow key is pushed


// getting the nextmonth button
const nextMonthIconElement = document.querySelector("#session-modal-date-picker #model-header #session-next-month");
// adding an event listener
nextMonthIconElement.addEventListener("click", (event) => {
    // incrementing the current month
    currentMonth++;

    // checking whether we have entered a next year
    if(currentMonth > 11 ){
        let newdate = new Date(currentYear, currentMonth);
        currentMonth = newdate.getMonth();
        currentYear = newdate.getFullYear();
    }

    // re-rendering the calander
    renderCalander();
});
// TODO adding an event listener for when the right arrow key is pushed

const renderCalander = () =>{
    // getting the first day of the month
    let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // getting the last date of the month (if you dont add +1 it will get the previouse month's last day)
    let lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // getting the last date of the last month
    let lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // getting the last day of the month
    let lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay();

    // adding the days to the days list element
    let dates = "";
    for(let i = firstDayofMonth; i > 0; i--){
        // adding the prevoiuse month's trailing days
        dates += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        // TODO:: add an event listen such that when its clicked it will increment/decrement the current month
    }    
    for(let i = 1; i <= lastDateofMonth; i++){
        // adding the current month's days

        // checking if the day is today
        let isToday = ((i === date.getDate()) && (currentMonth === date.getMonth()) && (currentYear === date.getFullYear())) ? "today" : "";
        dates += `<li class="${isToday}">${i}</li>`;
        // TODO:: add event so when its clicked they acheive the "selected" class and update the slected date element
    }
    for (let i = lastDayofMonth; i < 6; i++) {
        // adding the next month's trailing days
        dates += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        // TODO:: add an event listen such that when its clicked it will increment/decrement the current month
        
    }
    daysListElement.innerHTML = dates;

    // updating the current month element
    currentMonthElement.innerText = `${months[currentMonth]} ${currentYear}`;

    // updating the selected date element
    selectedDateElement.innerText = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

renderCalander();
