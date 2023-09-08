function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var draggedElement = document.getElementById(data);
  var target = ev.target;

  while (target.classList && !target.classList.contains("droppable")) {
    target = target.parentNode;
  }

  if (target.classList && target.classList.contains("droppable")) {
    target.innerText = draggedElement.innerText;
    checkGameResults();
  }
}

function checkGameResults() {
  var gameResults = document.getElementById("game-results");
  var div2Content = document.getElementById("div2").innerText;

  if (div2Content) {
    gameResults.innerText = " "+ div2Content + " games by Diabolical Studios";
    showGameCards(div2Content);
  } else {
    gameResults.innerText = "";
    showGameCards("");
  }
}

document.querySelectorAll(".draggable").forEach(function (draggable) {
  draggable.addEventListener("dragstart", drag);
});

document.querySelectorAll(".droppable").forEach(function (droppable) {
  droppable.addEventListener("drop", drop);
  droppable.addEventListener("dragover", allowDrop);
});

function showGameCards(selectedGameTypes) {
  var cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    var gameTypes = card.getAttribute("data-game-type");
    var display = "none";

    if (gameTypes) {
      var gameTypeArr = gameTypes.split(" ");
      if (gameTypeArr.some(function (type) { return selectedGameTypes.includes(type); })) {
        display = "block";
      }
    }

    card.style.display = display;
  });
}
