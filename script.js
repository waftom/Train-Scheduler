var data;
var config = {
  apiKey: "AIzaSyBVcay0dH34jzmUtKH7BjmW0kWUgsIBFec",
  authDomain: "project-8f190.firebaseapp.com",
  databaseURL: "https://project-8f190.firebaseio.com",
  storageBucket: "project-8f190.appspot.com",
  messagingSenderId: "38665346293"
};
firebase.initializeApp(config);
database = firebase.database();

// Start moment()
var moment = moment();

// Function to be triggered every 1 minute
function call_firebase() {
    database.ref().on("child_added", function(snapshot) {
        var newRow = snapshot.val();

        // Get the current hour and minute
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();

        // Separate the military hour
        var date = newRow.firstDate.split(":");

        // Add the start train time to moment()
        moment.hour(parseInt(date[0]));
        moment.minute(parseInt(date[1]));

        while(true) {
            // Compare the current hour/minute to the start train ones
            if((moment.hour() >= h && moment.minute() > m) || moment.hour() > h) {
                // Break if time is greater
                break;
            } else {
                // Increment the frequency when time is not greater
                moment.add(newRow.frequency, 'm');
            }
        }
        var next;
        var minu = '';
        if(moment.minute() < 10) {
            minu = '0';
        }
        if(moment.hour() > 12) {
            next = (moment.hour() - 12) + ":" + minu + moment.minute() + " PM";
        } else {
            next = moment.hour() + ":" + minu + moment.minute() + " AM";
        }

        // Get the minutes away
        moment.subtract(h, 'h');
        moment.subtract(m, 'm');
        var away = (moment.hour() * 60) + moment.minute();

        // Append all data to the table
        $('#table').append("<tr class='remove'><td>" + newRow.trainName + "</td><td>" + newRow.destination + "</td><td>" + newRow.frequency + "</td><td>" + next + "</td><td>" + away + "</td></tr>");
    });
}

// Initially call the function to load the initial data
call_firebase();

// Call the function every 1 minute
setInterval(function() {
    // Remove the elements by class before add the updated ones
    $(".remove").remove();
    call_firebase();
}, 60000);

// Add the data to firebase
$("#submitButton").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstDate = $("#firstDate").val().trim();
    var frequency = $("#frequency").val().trim();
    database.ref().push( {
        trainName: trainName,
        destination: destination,
        firstDate: firstDate,
        frequency: frequency
    });
});
