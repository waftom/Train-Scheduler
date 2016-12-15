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
var moment = moment();

function call_firebase() {
    database.ref().on("child_added", function(snapshot) {
        var newRow = snapshot.val();

        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();

        var date = newRow.firstDate.split(":");
        moment.hour(parseInt(date[0]));
        moment.minute(parseInt(date[1]));
        while(true) {
            if((moment.hour() >= h && moment.minute() > m) || moment.hour() > h) {
                break;
            } else {
              moment.add(40, 'm');
            }
            console.log('ok');
        }
        var next = moment.hour() + ":" + moment.minute();
        moment.subtract(h, 'h');
        moment.subtract(m, 'm');
        var away = moment.minute();

        $('#table').append("<tr class='remove'><td>" + newRow.trainName + "</td><td>" + newRow.destination + "</td><td>" + newRow.frequency + "</td><td>" + next + "</td><td>" + away + "</td></tr>");
    });
}
call_firebase();
setInterval(function() {
    $(".remove").remove();
    call_firebase();
}, 60000);

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
