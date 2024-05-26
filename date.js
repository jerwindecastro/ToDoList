module.exports = getDate;
function getDate(){
    var dateToday = new Date();
    var day = "";
    var options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' };
    
    day = dateToday.toLocaleDateString("en-US", options);
    return day;
}
