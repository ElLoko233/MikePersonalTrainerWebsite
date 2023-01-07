
class SessionCalendar{
    /*
        This class is responsible for providing the Calendar with functionality
        and aid it in displaying dunamic information.
    */
    
    constructor(sessionRulesdb){

        // storing the firebase object that has the important data for the Calendar
        this.sessionRulesdb = sessionRulesdb;

        // getting the HTML elements that display Calendar's current state
        
        // getting the element that encloses the entire session booking modal
        this.sessionBokingScreenElement = document.querySelector("body #session-booking-screen");
        
        // getting the element that displays the current month and year of the Calendar
        this.currentMonthYearElement = document.querySelector("#session-modal-date-picker #modal-header #current-monthYear");
        // adding a 'click' event to currentMonthYearElement that will take the Calendar to todays month
        this.currentMonthYearElement.addEventListener('click', (event) => {
            // preventing default behavior
            event.preventDefault();

            // setting the calander to todays month
            this.__goTo(this.getDateObject().getFullYear(), this.getDateObject().getMonth());

            // rendering the calendar
            this.renderCalendar();
        });
        
        // getting the element that contains and displays the dates displayed
        this.modalDaysElement = document.querySelector("#session-modal-date-picker #modal-week-days #modal-days");

        // getting the element that displays the selected date
        this.selectedDateElement = document.querySelector("#session-modal-time-picker #selected-date");

        // getting the element that displays the available hours for a selected date to book a session
        this.sessionAvailableTimeOptionsElement = document.querySelector('#session-modal-time-picker #session-available-time-picker #available-session-time-options');

        // getting the element that closes the session booking modal
        this.cancelSessionBtnBooking = document.querySelector("#session-available-time-picker #cancel-session-booking");
        // adding a 'click' event to close the session booking modal
        this.cancelSessionBtnBooking.addEventListener('click', (event) => {
            // preventing default behavior
            event.preventDefault();

            // closing the session booking modal
            this.closeSessionBookingModal();

            // removing the 'hiiden' class from the session manager
            let sessionMangerElement = document.querySelector("#session-manager");
            sessionMangerElement.classList.remove("hidden");
        });
        
        // getting the element that submits the form to the database
        this.submitSessionBtnElement = document.querySelector("#session-modal-time-picker #session-available-time-picker #submit-session-booking");
        // TODO:: adding a 'click' event to submit the form 

        // getting the element that change the current month to the next month
        this.sessionNextMonthBtnElement = document.querySelector("#session-modal-date-picker #modal-header #session-next-month");
        // adding a 'click' event to change the current month to the next month
        this.sessionNextMonthBtnElement.addEventListener('click', (event) => {
            // prevent default
            event.preventDefault();

            // changing the the next month
            this.changeToNextMonth();

            // rendering the Calendar
            this.renderCalendar();
        }); 

        // getting the element that change the current month to the previouse month
        this.sessionPrevMonthBtnElement = document.querySelector("#session-modal-date-picker #modal-header #session-previouse-month");
        // adding a 'click' event to change the current month to the previouse month
        this.sessionPrevMonthBtnElement.addEventListener('click', (event) => {
            // prevent default
            event.preventDefault();

            // changing the the previouse month
            this.changeToPrevMonth();

            // rendering the Calendar
            this.renderCalendar();
        });

        // variable that will store the date that the user selected
        // ( Default to todays date )
        this.selectedDate = this.getDateObject().getDate();

        // variable that will store the month that the user selected a date in
        // ( Defaults to todays month )
        this.selectedMonthIndex = this.getDateObject().getMonth();

        // variable that will store the year that the user selected a date in
        // ( Default to todays year )
        this.selectedYear = this.getDateObject().getFullYear();

        // variable that will store the data displayed by the month part 
        // of the currentMonthYearElement ( Defaults to todays month )
        this.currentMonthIndex = this.getDateObject().getMonth();

        // variable that will store the data displayed by the year part of
        // currentMonthYearElement ( Defaults to todays year )
        this.currentYear = this.getDateObject().getFullYear();

        // an object containing the start and finish hours of the sessions
        // booked in the current month displayed by the Calendar
        // (keys) date:(value) object => (key) start/finish Time:(value) time
        this.currentMonthsBookedSessions = new Object;

        // an array containg the objects that indicate the start and 
        // finish hours that cannot be booked for
        this.noBookingHours = new Array();

        // an array containg the full string dates that won't have booking
        this.noBookingDates = new Array();

        // an array containing the week days that booking won't occur
        this.noBookingWeekDays = new Array();

        // the variable that contains the duration that a session will last for
        this.sessionDuration = null;

        // the variable that contains the duration that each break between
        // sessions lasts for
        this.sessionTimeOutDuration = null;

        // the variable that contains the time of the day that the session
        // may begin
        this.sessionClockInTime = null;

        // the variable that contains the time of the day that the session
        // will end
        this.sessionClockOutTime = null;

        // the variable that contains the number that indiactes how far from
        // the current month can users book sessions
        this.bookableMonthRange = 3; // TODO:: remove this value and set it to null
    }

    load = () => {
        /**
         * this function will initialize the calander
         */

        // loading the db related attributes
        this.reloadAttributes();

        // rendering the calendar
        this.renderCalendar();
    }

    getDateObject = () => {
        /**
         * this function returns a Date object 
         */

        return new Date();
    }

    selectDate = (date, month, year) =>{
        /**
         * this function updates the selected* variables to the data
         * that matches what the user selectedand ensures that the 
         * corresponding date gets special attributes.
         */
    
        // setting the selected date
        this.selectedDate = date;
    
        // setting the selected month
        this.selectedMonthIndex = month;
    
        // setting the selected year
        this.selectedYear = year;
    }

    _getFullMonth = (monthIndex) => {
        /*
         * returns the name of the month using the (int) monthIndex
         */

        // an array containing the name of the month
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[monthIndex];
    }

    _getFullDay = (dayIndex) => {
        /**
         * returns the name of the day using the (int) dayIndex
         */

        // creating an array containing the days of the week
        let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];

        return weekDays[dayIndex];
    }

    __muteSubmitSessionBtn = () =>{
        /*
            Responsible for ensuring that the session submit btn is only clickable when the options are selected
        */
        
        // temp variable to track if a checked box was found
        let checked = false;
        
        // getting the check boxes in the session available time form
        const checkBoxes = document.querySelectorAll("#session-modal-time-picker #session-available-time-picker input[type=checkbox]");
        
        // looping through the checkboxes
        checkBoxes.forEach((checkBox) => {
            // checking if the checkbox is selected
            if(checkBox.checked){
                // setting the checked temp variable
                checked = true;
                return;
            }
        });
    
        // editing the diabaled attribute of the submit session button according to the checked variable
        if(checked){
            // removing the 'disabled' attribute from the submit session button   
            this.submitSessionBtnElement.removeAttribute("disabled");
        }else{
            // if none has been found we add the 'diabled' attribute on the submit session button
            this.submitSessionBtnElement.setAttribute("disabled", "true");
        }
    }

    _getMonthIndexandYear = (monthIndex, year) => {
        /**
         * this function takes in the monthIndex and year
         * and returns an appropriate monthIndex and year in
         * an array when the monthIndex goes out of the range of 0 to 11
         */

        // creating a new Date object to correct the monthIndex
        let date = new Date(year, monthIndex);

        // returning the correcting monthIndex and year
        return [date.getMonth(), date.getFullYear()];
    }

    closeSessionBookingModal = () => {
        /**
         * this function closes the session booking modal and
         *  resets the Calendar
         */

        // reetting the Calendar using
        this.resetCalendar();

        // make the session modal hidden
        this.sessionBokingScreenElement.classList.add("hidden");
    }

    openSessionBookingModal = () => {
        /**
         * this function reveals the session booking
         * modal and reloads the appropriate attributes
         */

        // loading the calander
        this.load();

        // making the session booking modal visible by
        // removing the hiiden class
        this.sessionBokingScreenElement.classList.remove("hidden");
    }
    
    reloadAttributes = () => {
        /**
         * this function wil reload the appropriate
         * attributes with their proper data from their
         * repective sources
        */
       
       // use this.sessionRulesdb to get the data for the attributes
       this.currentMonthsBookedSession = new Object();
       this.noBookingHours = new Array();
       this.noBookingDays = new Array();
       this.noBookingWeekDays = new Array();
       this.sessionDuration = null;
       this.sessionTimeOutDuration = null;
       this.sessionClockInTime = null;
       this.sessionClockOutTime = null;
       this.bookableMonthRange = 3;
    }
    
    // TODO:: create a firebase function of this function as well to enable internal testing
    isWithinMonthlyRange = (monthIndex, year) => {
        /**
         * this function checks if the given monthIndex
         * is within the range, relative to the current monthIndex
         * (param):
         *      (int) monthIndex: the monthIndex that is being tested
        */

        // getting a date object of todays date
        let todayDateObj = new Date(this.getDateObject().getFullYear(), this.getDateObject().getMonth());
       
        // getting a date object of the given monthIndex and year
        let currentDateObj = new Date(year, monthIndex);

        // testing the given monthIndex
        return ( Math.round( ((Math.abs(todayDateObj - currentDateObj)) / Math.pow(10, 3)) / 2592000) < this.bookableMonthRange );
    }
    // TODO:: create a firebase function of this function as well to enable internal testing
    isSessionColliding = (date, monthIndex, year, startTime, finishTime) => {
        /**
         * this function checks if the booked session does not
         * collide with any of the occupied hours of the day
        */
    }
    
    changeToNextMonth = () => {
        /**
         * this function changes the current month of 
         * the Calendar to the next one
         * 
         * it will throw a RangeError if the next month is outside
         * of the booking range
        */
       
       // Testing of the next month is within the range
       if(this.isWithinMonthlyRange( ...this._getMonthIndexandYear(this.currentMonthIndex +1, this.currentYear) )){           
           // increment the current month index by 1
           this.currentMonthIndex++;
           
           // getting the proper month index and year
           [this.currentMonthIndex, this.currentYear] = this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear);

           // removing the 'disabled' attribute from the prevMonth btn
           this.sessionPrevMonthBtnElement.removeAttribute('disabled');
           
        }else{
            // adding a disabled attribute to the nextMonth btn
            this.sessionNextMonthBtnElement.setAttribute('disabled', 'true');

            // removing the 'disabled' attribute from the prevMonth btn
            this.sessionPrevMonthBtnElement.removeAttribute('disabled');
            
            // throwing am error
            throw RangeError("the month is not within the booking range");
        }
    }
    
    changeToPrevMonth = () => {
        /**
         * this function changes the current month of 
         * the Calendar to the prev one
         * 
         * it will throw a RangeError if the prev month is outside
         * of the booking range
        */
       
       // Testing if the prev month is within the range
       if(this.isWithinMonthlyRange(...this._getMonthIndexandYear(this.currentMonthIndex -1, this.currentYear))){            
           // decrement the current month index by 1
           this.currentMonthIndex--;
           
           // getting the proper month index and year
           [this.currentMonthIndex, this.currentYear] = this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear);

           // removing the 'disabled' attribute from the prevMonth btn
           this.sessionNextMonthBtnElement.removeAttribute('disabled');
           
        }else{
            // adding a disabled attribute to the nextMonth btn
            this.sessionPrevMonthBtnElement.setAttribute('disabled', 'true');

            // removing the 'disabled' attribute from the prevMonth btn
            this.sessionNextMonthBtnElement.removeAttribute('disabled');
            
            // throwing am error
            throw RangeError("the month is not within the booking range");
        }
    }

    resetCalendar = () => {
        /**
         * this function sets the appropriate attributes
         * to 'null' and sets other attributes to their 
         * default values
         */
    
        // setting api dependent attributes to null
        this.currentMonthsBookedSession = null;
        this.noBookingHours = null;
        this.noBookingDays = null;
        this.noBookingWeekDays = null;
        this.sessionDuration = null;
        this.sessionTimeOutDuration = null;
        this.sessionClockInTime = null;
        this.sessionClockOutTime = null;
        this.bookableMonthRange = 5;
    
        // setting the current* attributes to the default
        this.currentMonthIndex = this.getDateObject().getMonth();
        this.currentYear = this.getDateObject().getFullYear();
    
        // setting the selected+ attributes to the defualt
        this.selectedDate = this.getDateObject().getDate();
        this.selectedMonthIndex = this.getDateObject().getMonth();
        this.selectedYear = this.getDateObject().getFullYear();
    }

    renderCalendar = () => {
        /**
         * this function updates the calendars
         * current display
         */

        // getting the first day of the month
        let firstDayofMonth = new Date(this.currentYear, this.currentMonthIndex, 1).getDay();
    
        // getting the last date of the month (if you dont add +1 it will get the previouse month's last day)
        let lastDateofMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    
        // getting the last date of the last month
        let lastDateofLastMonth = new Date(this.currentYear, this.currentMonthIndex, 0).getDate();
    
        // getting the last day of the month
        let lastDayofMonth = new Date(this.currentYear, this.currentMonthIndex, lastDateofMonth).getDay();

        // clearing the current dates displayed on the calendar
        this.modalDaysElement.innerText = "";

        // adding the previouse months leaking dates
        for(let i = firstDayofMonth; i > 0; i--){
            
            // creating a new list element
            let list_item = document.createElement("li");
            
            // adding data to the list item
            list_item.innerText = lastDateofLastMonth -i +1;
            
            // adding 'inactive' class to indicate its a trailing day
            list_item.classList.add("leaking-date");
            
            // adding a data 'date' tag to the list item
            list_item.setAttribute('data-date', `${lastDateofLastMonth - i + 1}`);
            // adding a data 'month' tag to the list item
            list_item.setAttribute('data-month', `${this._getMonthIndexandYear(this.currentMonthIndex -1, this.currentYear)[0]}`);
            // adding a data 'year' tag to the list item
            list_item.setAttribute('data-year', `${this._getMonthIndexandYear(this.currentMonthIndex -1, this.currentYear)[1]}`);
            
            // adding a 'click' event to display the previouse month
            list_item.addEventListener('click', (event) =>{
                // preventing default behavior
                event.preventDefault();
            
                // changing current month to previouse month
                this.changeToPrevMonth();

                // rendering the calendar
                this.renderCalendar();
            })
            
            // adding the element to the dayslist
            this.modalDaysElement.appendChild(list_item);
        }

        // adding the current displayed months dates
        for(let i = 1; i <= lastDateofMonth; i++){
            // creating a new list element
            let list_item = document.createElement("li");
                    
            // adding data to the list item
            list_item.innerText = i;
            
            // adding a data 'date' tag to the list item
            list_item.setAttribute('data-date', `${i}`);
            // adding a data 'month' tag to the list item
            list_item.setAttribute('data-month', `${this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear)[0]}`);
            // adding a data 'year' tag to the list item
            list_item.setAttribute('data-year', `${this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear)[1]}`);

            // variable that checks if the list_item should get a 'click' event
            let isClickable = true;
            
            // checking if the date is not in the 'noBookingWeekDays' array
            if( this.__isInBookingWeekDays( ...this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear).reverse(), i) ){
                // setting the clickability to false
                isClickable = false;

                // adding the inactive class to the date
                list_item.classList.add("inactive");
            }

            // checking if the date is not in the 'noBookingDays' array
            if( this.__isInNoBookingDates( ...this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear).reverse(), i) ){
                // setting the clickability to false
                isClickable = false;
                
                // adding the inactive class to the date
                list_item.classList.add("inactive");
            }
            // TODO:: remove this testing purposes
            if((i-2) <= ((Math.random()*i)%i)){
                list_item.classList.add("inactive");

                // setting the clickability to false
                isClickable = false;
                
            }

            // checking if the date is fully booked
            if( this.__isFullyBooked( ...this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear).reverse(), i) ){
                // setting the clickability to false
                isClickable = false;

                // adding the 'fully-booked' class to the date
                list_item.classList.add("fully-booked");
            }
            // TODO:: remove this testing purposes
            if((i-1) <= ((Math.random()*i)%i)){
                list_item.classList.add("fully-booked");

                // setting the clickability to false
                isClickable = false;
            }

            // checking if the date is today
            if( (i === this.getDateObject().getDate()) &&
                (this.currentMonthIndex === this.getDateObject().getMonth()) &&
                (this.currentYear === this.getDateObject().getFullYear()) ){
                // adding 'today' class if the date is today
                list_item.classList.add("today");
            }
            
            // checking if the date is the selected date
            if ( (i == this.selectedDate) &&
                (this.currentMonthIndex == this.selectedMonthIndex) &&
                (this.currentYear == this.selectedYear) ) {
                // adding a 'selected' class
                list_item.classList.add('selected');
            }

            // adding a 'click' event to select the date
            if( isClickable ){
                list_item.addEventListener('click', (event) =>{
                    // preventing default behavior
                    event.preventDefault();
                
                    // selecting the date
                    this.selectDate(Number(event.target.getAttribute('data-date')), Number(event.target.getAttribute('data-month')), Number(event.target.getAttribute('data-year')));
    
                    // rendering the calendar
                    this.renderCalendar();
                });
            }

            // adding the element to the dayslist
            this.modalDaysElement.appendChild(list_item);
        }

        // adding the next months leaking dates
        for (let i = lastDayofMonth; i < 6; i++) {          
            // creating a new list element
            let list_item = document.createElement("li");
            
            // adding data to the list item
            list_item.innerText = i - lastDayofMonth + 1;
            
            // adding 'leaking-date' class to indicate its a trailing day
            list_item.classList.add("leaking-date");
            
            // adding a data 'date' tag to the list item
            list_item.setAttribute('data-date', `${i - lastDayofMonth + 1}`);
            // adding a data 'month' tag to the list item
            list_item.setAttribute('data-month', `${this._getMonthIndexandYear(this.currentMonthIndex +1, this.currentYear)[0]}`);
            // adding a data 'year' tag to the list item
            list_item.setAttribute('data-year', `${this._getMonthIndexandYear(this.currentMonthIndex +1, this.currentYear)[1]}`);
            
            // adding a 'click' event to change the month to the next month
            list_item.addEventListener('click', (event) =>{
                // preventing default behavior
                event.preventDefault();
            
                // changing current month to next month
                this.changeToNextMonth();

                // rendering the calendar
                this.renderCalendar();
            });
            
            // adding the element to the dayslist
            this.modalDaysElement.appendChild(list_item);        
        }
            
        // updating the current month element
        this.currentMonthYearElement.innerText = `${this._getFullMonth(this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear)[0])} ${this._getMonthIndexandYear(this.currentMonthIndex, this.currentYear)[1]}`;
            
        // updating the selected date element
        this.selectedDateElement.innerText = `${this.selectedDate} ${this._getFullMonth(this.selectedMonthIndex)} ${this.selectedYear}`;
    }

    // TODO:: create this function as a firebase function
    _getDaysMaxBooking = (year, monthIndex, date) => {
        /**
         * this function gets the maximum number
         * of bookings for a specific date
         */
    }

    __isInBookingWeekDays = (year, monthIndex, date) => {
        /**
         * this function checks whether the given date
         * is part of the no booking week days
         */

        // creating a date object for the given data
        let dateObj = new Date(year, monthIndex, date);

        // checking if the date is not in the 'noBookingWeekDays' array
        this.noBookingWeekDays.forEach( (noBookingDay) => {
            if( this._getFullDay(dateObj.getDay()) === noBookingDay ){
                return true;
            }
        });

        // if the date is not in the 'noBookingWeekDays' array
        return false;

    }

    __isInNoBookingDates = (year, monthIndex, date) => {
        /**
         * this function checks whether the given date
         * is part of the no booking dates
         */

        // creating a date object for the given data
        let dateObj = new Date(year, monthIndex, date);

        this.noBookingDates.forEach( (noBookingDateString) => {
            // creating a date object for the no booking date
            let nobookingDate = new Date(noBookingDateString);

            if( (dateObj.getDate() === nobookingDate.getDate()) &&
                (dateObj.getMonth() === nobookingDate.getMonth()) &&
                (dateObj.getFullYear() === nobookingDate.getFullYear()) ){                    
                    return true;
            }
        });

        // if the date is not part of the 'noBookingDates' array
        return false;
    }

    __isFullyBooked = (year, monthIndex, date) => {
        /**
         * this function checks whether the given date
         * is fully booked
         */

        // creating a date object for the given data
        let dateObj = new Date(year, monthIndex, date);

        // counter for how many times the date occurs in the currentMonthBookedSessions
        let numClaimedTimeSlots = 0;
        Object.keys(this.currentMonthsBookedSessions).forEach( (stringDate) => {
            // creating a booked Date object
            let bookedDate = new Date(stringDate);

            // counting number of times the date appears
            if( (dateObj.getDate() === bookedDate.getDate()) &&
                (dateObj.getMonth() === bookedDate.getMonth()) &&
                (dateObj.getFullYear() === bookedDate.getFullYear()) ){
                // incrementing the counter
                 numClaimedTimeSlots++;
            }
        });
        if(numClaimedTimeSlots >= this._getDaysMaxBooking(year, monthIndex, date)){
            return true;
        }

        // if the date is not fully booked
        return false;
    }

    __goTo = (year, monthIndex) => {
        /**
         * this function sets the calendar to a specified
         * month and year
         */

        // checking if the given date is within the range
        if( this.isWithinMonthlyRange(monthIndex, year) ){
            // setting the current month index and year
            [this.currentMonthIndex, this.currentYear] = [...this._getMonthIndexandYear(monthIndex, year)];

            // enable both month changing buttons
            this.sessionNextMonthBtnElement.removeAttribute("disabled");
            this.sessionPrevMonthBtnElement.removeAttribute("disabled");
        }else{
            // throwing a range error if its out of range
            throw RangeError("the month is out of range");
        }
    }
    
};
