  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA6zdV2KL8DPCqyMc9P8dENMaTnkpcb-p8",
    authDomain: "trainscheduler-73b7d.firebaseapp.com",
    databaseURL: "https://trainscheduler-73b7d.firebaseio.com",
    projectId: "trainscheduler-73b7d",
    storageBucket: "",
    messagingSenderId: "794443080981"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //button for adding trains
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      //grab user input
      var trainName = $("#train-name-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var trainFrequency = $("#frequency-input").val().trim();
      var trainFirst =$("#first-train-input").val().trim();


      //object to hold train info
      var newTrain = {
          name: trainName,
          destination: trainDestination,
          frequency: trainFrequency,
          firstTrain: trainFirst,

      };

      //push to database
      database.ref().push(newTrain);

      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.frequency);
      console.log(newTrain.firstTrain);

      //firebase event for adding train to database and row in html on submiting train
      database.ref().on("child_added", function(childSnapshot) {
          console.log(childSnapshot.val());

          var trainName = childSnapshot.val().name;
          var trainDestination = childSnapshot.val().destination;
          var trainFrequency = childSnapshot.val().frequency;
          var trainFirst = childSnapshot.val().firstTrain;

          console.log(trainName);
          console.log(trainDestination);
          console.log(trainFrequency);
          console.log(trainFirst);

          //Calculate minutes till next train and time of arrival

          //format first train time and push back 1 year so it comes before current time
          var trainFirstFormat = moment(trainFirst, "HH:mm").subtract(1, "years");
          console.log(trainFirstFormat);

          //current time
          var currentTime = moment().format("hh:mm");
          console.log(currentTime);
          
          //difference between times
          var diffTime = moment().diff(moment(trainFirstFormat), "minutes");
          console.log(diffTime);

          //time apart
          var tApart = diffTime % trainFrequency;
          console.log(tApart);

          //minutes until next train
          var minutesTillNext = trainFrequency - tApart;
          console.log(minutesTillNext);

          //next train
          var nextTrain = moment().add(minutesTillNext, "minutes");
          console.log(nextTrain);

          //create new row for table
          var newRow = $("<tr>").append(
              $("<td>").text(trainName),
              $("<td>").text(trainDestination),
              $("<td>").text(trainFrequency),
              $("<td>").text(nextTrain),
              $("<td>").text(minutesTillNext)
          );

          //append row to table
          $("#train-table > tbody").append(newRow);

      });
  });
