// Initialize Firebase
var config = {
  apiKey: "AIzaSyA6JnkRNUNuWUdvMIkJgM6zRHnZCaqwey8",
  authDomain: "train-schedule-eadde.firebaseapp.com",
  databaseURL: "https://train-schedule-eadde.firebaseio.com",
  projectId: "train-schedule-eadde",
  storageBucket: "",
  messagingSenderId: "345841653917"
};
firebase.initializeApp(config);

database = firebase.database();
$(document).ready(function() {
  // Execute on load
  checkWidth();
  // Bind event listener
  $(window).resize(checkWidth);
  //submit button listener
  $("#submit-button").on("click", function(){
    validateInput();
  })
});

var namesUsed = [];
var namesUsedBoolean = false;

var checkWidth = function() {
  var windowsize = $(window).width();
  if (windowsize < 1200) {
    $('.background-image').attr('src','assets/images/mobile-background.jpg');
  } else {
    $('.background-image').attr('src','assets/images/background.jpg');
  }
}

var validateInput = function(){
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var time = $("#time-input").val();
  var frequency = $("#frequency-input").val().trim();
  for (var i = 0; i < namesUsed.length; i++){
    if (name === namesUsed[i]){
      namesUsedBoolean = true;
    }
  }
  if (name === "" || destination === "" || time === "" || frequency === ""){
    console.log("need more shit");
    return;
  } else if (namesUsedBoolean === true) {
    console.log("that name's already used");
    namesUsedBoolean = false;
    return;
  } else {
      var newTrain = {
        name: name,
        destination: destination,
        time: time,
        frequency: frequency
      };
      database.ref().push(newTrain);
      clearInput();
  }

}

var clearInput = function(){
  $("#user-entry-form")[0].reset();
}

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val().name);
  var i = 0;
  for (var key in childSnapshot.val().name[0]){
    namesUsed.push(childSnapshot.val().name);
    i++
    console.log(namesUsed);
  }


  $("#append-info").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
  childSnapshot.val().frequency + "</td><td>" + "placeholder next" + "</td><td>" + "placeholder away" + "</td></tr>");



})