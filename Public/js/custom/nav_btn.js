$(document).ready(function(){
    // adding an event handler to all link to close the hotdogicon 
    $("#nav-toggler-open").click(function(event){
        $("#nav-toggler-open").toggleClass("hidden");
        $("#nav-toggler-close").toggleClass("hidden");
        // togggling #navigationlinks visible state
        $("#navlinks").toggleClass('hidden');
    });
    $("#nav-toggler-close").click(function(event){
        $("#nav-toggler-close").toggleClass("hidden");
        $("#nav-toggler-open").toggleClass("hidden");
        // togggling #navigationlinks visible state
        $("#navlinks").toggleClass('hidden');
    });
});