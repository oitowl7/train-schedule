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
  checkWidth();
  // window resize event listener
  $(window).resize(checkWidth);
  //submit button listener
  $("#submit-button").on("click", function(){
    validateInput();
  })
});

var namesUsed = [];
var namesUsedBoolean = false;

//changes background image to more mobile friendly one if width gets too small 
var checkWidth = function() {
  var windowsize = $(window).width();
  if (windowsize < 1200) {
    $('.background-image').attr('src','assets/images/mobile-background.jpg');
  } else {
    $('.background-image').attr('src','assets/images/background.jpg');
  }
}

//Pulls info from the input boxes
//checks to see if all inputs have been entered and if the name has already been used
//pushes the new object to database
//clears input
var validateInput = function(){
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var time = $("#time-input").val();
  var frequency = $("#frequency-input").val().trim();
  for (var i = 0; i < namesUsed.length; i++){
    if (name.toLowerCase() === namesUsed[i].toLowerCase()){
      namesUsedBoolean = true;
    }
  }
  if (name === "" || destination === "" || time === "" || frequency === ""){
    alert("Please fill out all the boxes, not just the ones you feel like. KThxBai");
    return;
  } else if (namesUsedBoolean === true) {
    alert("That train already exists. See how that train has the same name as another train listed right here on this very page? No no I'll wait.....See it now? Ya pick a different name.");
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

//when child is added, pushes new name to the "usedNames" array for validation checks
//runs the time math function
database.ref().on("child_added", function(childSnapshot) {
  namesUsed.push(childSnapshot.val().name);
  timeMath(childSnapshot);
})


//gets firstTime, m(current time), and frequency and converts them to minutes
//computes next time minutes(instead of hours:minutes it returns hours*60+minutes)
//computes minutes til the next train and what time in hh:mm A the next train arrives at
//requires snapshot with an attribute called time(needs to be what time first train arrives)
//requires snapshot with attribute frequency(number of minutes between trains)
//This DOES NOT reset each day back to original time. If I had more "time" I would have made this a feature
//or I would have validated that the frequency and start time worked together.
var timeMath = function(snapshot){
  var firstTime = snapshot.val().time;
  var firstTimeMinutes = convertToMinutes(firstTime);

  var m = moment().format('HH:mm');
  var mMinutes = convertToMinutes(m);

  var frequency = parseInt(snapshot.val().frequency);

  var nextTimeMinutes = iterateMinutes(firstTimeMinutes, mMinutes, frequency);

  var minutesToNext = nextTimeMinutes - mMinutes;

  var nextArrival = convertToHours(nextTimeMinutes);

  $("#append-info").append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" +
  snapshot.val().frequency + "</td><td>" + nextArrival + "</td><td>" + minutesToNext + "</td></tr>");


}

//converts a time in format HH:mm to minutes
var convertToMinutes = function(time){
  var returnTime = moment.duration(time).minutes() + moment.duration(time).hours()*60;
  return(returnTime);
}

//converts a time in minutes to hh:mm A
var convertToHours = function(minutes){
  var h = Math.floor(minutes/60);
  var min = minutes - h*60;
  return(moment.utc().hours(h).minutes(min).format('hh:mm A'));
}

//adds frequency to the first train arrival time(in minutes) iteratively until that number is greater than the current time(in minutes)
//when it is done, it returns that time back to timeMath() to have more math done on it.
//requires firstTimeMinutes(in total minutes) mMinute (in total minutes), and frequency (in minutes)
var iterateMinutes = function(firstTimeMinutes, mMinutes, frequency){
  newMinutes = firstTimeMinutes;
  if(firstTimeMinutes < mMinutes){
    firstTimeMinutes = firstTimeMinutes + frequency;
    iterateMinutes(firstTimeMinutes, mMinutes, frequency);
  } 
  return(newMinutes);
  
}

//I realize that there are probably quicker ways to do this time math through moment.js but I don't really have time to fully understand it with the project and the fact 
//that it is now 12:30am on Thursday morning. If I could change anything on here it would be that I want to simplify the timemath stuff using moment.js and
//I would probably break these functions out a little more (like not have so many things being done by one function i.e.: validateInput() or putting the appends in a different function). 
//As it stands, it seems stable and I don't want to break it at this point and have to fix it.
//Further, I just remembered that I would probably like to add a "remove" button to remove specific trains but I'm not sure how to do that just yet but with some time 
//I'm sure I could figure out.
//Another thing! I would probably like to add a font-awesome icon for different types. User can select bus or subway or daily or commuter or something and depending on what they picked,
//you would add a font-awesome icon. Seems simple enough. Again, a little polish is needed on this and a few features to make it good, but it works for now.
//Just read the assignment. Turns out this a lot of this was bonus stuff...so ya. Muh bad