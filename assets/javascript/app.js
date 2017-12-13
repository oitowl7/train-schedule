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
  if (name === "" || destination === "" || time === "" || frequency === ""){
    console.log("need more shit");
  }
  checkDB(name);
}

var checkDB = function(name){
  for (var i = 0; i < database.length; i++){
    if (name === database[i].name){
      alert("That train name already exists")
      return
    } else {
      pushNewTrain();
    }
  }
}

