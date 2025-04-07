var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var highScore = 0;

// Initially hide control buttons
$(".controls").hide();

// Handle both click and touch events
$(document).on('click touchstart', function(event) {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    $(".subtitle").fadeOut();
    $(".controls").fadeIn();
  }
});

$(".btn").on('click touchstart', function(event) {
  event.preventDefault();
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length-1);
});

// Handle restart button
$("#restart").on('click touchstart', function(event) {
  event.preventDefault();
  if (started) {
    startOver();
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    $(".subtitle").fadeOut();
  }
});

// Handle end game button
$("#end").on('click touchstart', function(event) {
  event.preventDefault();
  if (started) {
    if (level > highScore) {
      highScore = level;
    }
    $("#level-title").text("Game Over! Score: " + level);
    $(".subtitle").text("Click or Tap to Play Again").fadeIn();
    $(".controls").fadeOut();
    startOver();
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    
    if (level > highScore) {
      highScore = level;
    }
    
    $("#level-title").text("Game Over! Score: " + level);
    $(".subtitle").text("Click or Tap to Play Again").fadeIn();
    $(".controls").fadeOut();
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  
  // Enhanced animation with stronger visual feedback
  $("#" + randomChosenColour)
    .fadeOut(100)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100)
    .addClass("sequence-active");
  
  setTimeout(function() {
    $("#" + randomChosenColour).removeClass("sequence-active");
  }, 400);
  
  playSound(randomChosenColour);
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play().catch(function(error) {
    console.log("Audio playback failed:", error);
  });
}

function startOver() {
  level = 0;
  started = false;
  gamePattern = [];
  userClickedPattern = [];
}
