document.addEventListener("DOMContentLoaded", (event) => {
  let consoleDiv = document.getElementById("app");
  // Your code here

  $(function () {
    var waitingForMatrixAnswer = false;
    var startTime = new Date();
    var endTime = new Date();
    endTime.setMinutes(startTime.getMinutes() + 15);
    var endDateStr =
      endTime.getFullYear() +
      "-" +
      endTime.getMonth() +
      "-" +
      endTime.getDate();
    var endTimeStr =
      endTime.getHours() +
      ":" +
      endTime.getMinutes() +
      ":" +
      endTime.getMilliseconds();
    const hint_ = "#hint";
    const backstory_ = "#backstory";
    const container_ = "#container";
    const dialogue_ = "#dialogue";
    //create command objects with help text as param and command as another.
    const CMDS_ = [
      "hireus",
      "open",
      "download",
      "clear",
      "clock",
      "date",
      "help",
      "uname",
      "whoami",
      "su",
    ];
    //create file objects, file name and file contents.IN THE FUTURE LOGS????
    const FILES_ = [
      "logfile_" + endDateStr + ".txt",
      "report1.doc",
      "web.config",
      "password.txt",
    ];
    const USERS = ["admin", "report", "logviewer", "guest"];
    const HACKERHISTORY_ =
      `<div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="duality logfile_` +
      endDateStr +
      `.txt" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="cp logfile_` +
      endDateStr +
      `.txt /media" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="empty!" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="delete logfile_` +
      endDateStr +
      `.txt" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="unknown command : delete" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="rm logfile_` +
      endDateStr +
      `.txt" readonly=""></div></div>
        <div><div class="input-line line"><div class="prompt">admin@svr-d14b0l1c:/# </div>
        <div><input class="cmdline" value="logout" readonly=""></div></div>`;

    var currentDateYear = 2;
    var fs_ = null;
    var cwd_ = null;
    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    var beenLS = false;
    var beenHelp = false;
    var beenCat = false;
    var beenWhoami = false;
    var beenDate = false;

    var currentUser = "guest";
    var currentSystem = "@svr-d14b0l1c:/# ";
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem =
      window.requestFileSystem || window.webkitRequestFileSystem;
    window.addEventListener(
      "click",
      function (e) {
        cmdLine_.focus();
      },
      false
    );

    $(container_).hide();
    $(dialogue_).hide();
    $(hint_).hide();

    $("#input-line .prompt").html(currentUser + currentSystem);
    var cmdLine_ = document.querySelector("#input-line .cmdline");
    var output_ = document.querySelector("#container output");

    //cmdLine_.addEventListener('click', inputTextClick_, false);
    //cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener("keydown", processInput, false);
    generateHackerHistory();

    var riddles = [
      {
        question: "I am the silent whisper in the heart, leading even the wise astray, an insatiable desire that can never be quenched. What am I?",
        answer: "lust"
      },
      {
        question: "I consume without satisfaction, always hungry, never full. I turn nourishment into a vice. What am I?",
        answer: "gluttony"
      },
      {
        question: "I am the never-ending hunger for what is not yours. I am the desire that impoverishes, as it accumulates. What am I?",
        answer: "greed"
      },
      {
        question: "In stillness I flourish, a thief of time and potential. I am the chain that holds you down. What am I?",
        answer: "sloth"
      },
      {
        question: "I am the flame that consumes reason, turning love into violence, justice into revenge. What am I?",
        answer: "wrath"
      },
      {
        question: "In the success of others, I find my voice, souring joy with discontent. I am the shadow on every achievement. What am I?",
        answer: "envy"
      },
      {
        question: "I am the crown of self, blinding you to your own faults, lifting you above all others in your own mind. What am I?",
        answer: "pride"
      }
    ];


    var askedRiddles = [];
    var correctRiddleAnswers = 0;
    var waitingForContinueAnswer = false;

    function processInput(e) {
      // manage history
      if (e.keyCode == 9) {
        // tab
        e.preventDefault();
        var args = this.value.split(" ");
        var incomplete = args[1];
        var result = isInArray(incomplete, FILES_);
        this.value = args[0] + " " + result;
      } else if (e.keyCode == 38) {
        // up
        this.value = history_[history_.length - histpos_];
        histpos_--;
      } else if (e.keyCode == 40) {
        // down
        this.value = history_[history_.length - histpos_];
        histpos_++;
      } else if (e.keyCode == 13) {
        // enter
        if (this.value) {
          history_[history_.length] = this.value;
          histpos_ = history_.length;
        }
        var line = this.parentNode.parentNode.cloneNode(true);
        line.removeAttribute("id");
        line.classList.add("line");
        var input = line.querySelector("input.cmdline");
        input.autofocus = false;
        input.readOnly = true;
        output_.appendChild(line);

        var args = this.value.split(" ");
        // Convert the command to lower case
        args[0] = args[0].toLowerCase();
        var cmd = args[0];
        var fullCmd = args.join(" ");

        switch (cmd) {
          case "su":
            if (!args[2]) {
              output("Usage: " + cmd + " username password");
            } else {
              validateLogin(args[1], args[2]);
            }
            break;

          case "ls":
            output('<div class="ls-files">' + FILES_.join("<br>") + "</div>");
            if (beenLS) {
              hideHint();
            } else {
              showDialogue("You", "You just had to poke around right!?", 5000);
              beenLS = true;
            }
            break;

          case "run":
            if (args[1] === "riddle.exe") {
              startRiddleGame();
            } else if (args[1] === "matrix.exe") {
              // The previous matrix command.
              output("A bunch of green symbols are falling on your screen...");
            } else {
              output("Unknown command: " + args[1]);
            }
            break;

          case "whoami":
            output("<p>" + currentUser + "</p>");
            break;

          case "help":
            output('<div class="ls-files">' + CMDS_.join("<br>") + "</div>");
            break;

          case "hireus":
            window.open("https://www.fiverr.com/diabolical_", "_blank"); // replace with your link
            break;

          case "date":
            var date = new Date();
            date.setFullYear(date.getFullYear() + currentDateYear);
            if (!beenDate) {
              showDialogue("You", "Well, I guess this isn't too bad...", 5000);
            }
            output("<p>" + date + "</p>");
            break;

          case "download":
            if (!args[1]) {
              output("Usage: " + cmd + " game-name");
            } else if (args[1] === "potato") {
              downloadPotato();
            } else if (args[1] === "internal") {
              downloadInternal();
            } else if (args[1] === "hothell") {
              downloadHotHell();
            } else if (args[1] === "apeascent") {
              downloadApeAscent();
            } else output("unknown command : " + args);
            output('game names: "potato", "apeascent", "hothell", "internal"');
            break;

          case "open":
            if (!args[1]) {
              output("Usage: " + cmd + " password.txt");
            } else {
              openFile(args[1]);
              showDialogue(
                "You",
                "No... NOOOO! You better forget that right now!",
                5000
              );
            }
            if (beenCat) {
              hideHint();
            } else {
              showHint(
                "Pressing TAB key will complete the file name if it is unique."
              );
              beenCat = true;
            }
            break;

          case "yes":
            if (waitingForContinueAnswer) {
              startRiddleGame();
            } else {
              output("Unknown command: " + cmd);
            }
            break;

          case "no":
            if (waitingForContinueAnswer) {
              output("Alright. You have won " + correctRiddleAnswers + " points.");
              correctRiddleAnswers = 0;
              waitingForContinueAnswer = false;
              askedRiddles = [];
            } else {
              output("Unknown command: " + cmd);
            }
            break;

          default:
            if (waitingForMatrixAnswer) {
              // If the user is answering a riddle, check if the answer is correct.
              if (cmd === correctMatrixAnswer) {
                output("Riddle Solved");
                correctRiddleAnswers++;
                if (correctRiddleAnswers >= 3) {
                  // Delay the redirect by 5 seconds (5000 milliseconds)
                  output("Encryption cracked. Redirecting...");
                  setTimeout(redirectToDemoPage, 3000);
                } else {
                  output("Continue? (yes/no)");
                }
                waitingForContinueAnswer = true;
              } else {
                output("That's not correct. Try again!");
              }
              waitingForMatrixAnswer = false;
            } else {
              output("Unknown command: " + cmd);
            }
            break;
        }
        window.scrollTo(0, getDocHeight_());
        this.value = ""; // clear the input
      }
    }

    function startRiddleGame() {
      if (riddles.length === 0) {
        output("No more riddles left. You've solved them all!");
      }

      // Pick a random riddle from the list.
      var riddleIndex = Math.floor(Math.random() * riddles.length);
      var riddle = riddles[riddleIndex];

      // Remove the chosen riddle from the list.
      riddles.splice(riddleIndex, 1);

      // Output the riddle question and wait for the answer.
      output(riddle.question);
      waitingForMatrixAnswer = true;
      correctMatrixAnswer = riddle.answer;
    }

    function redirectToDemoPage() {
      window.location.href = 'https://demo-url.com'; // replace with your URL
    }


    function downloadPotato() {
      var link = document.createElement("a");
      link.href =
        "https://cdn.discordapp.com/attachments/768414936514428969/1120083400716472460/POTATO.zip"; // replace this with the URL of your zip file
      link.download = "POTATO.zip";
      document.body.appendChild(link); // append the link to body (required for Firefox)
      link.click();
      document.body.removeChild(link); // remove the link from the body
    }

    function downloadInternal() {
      var link = document.createElement("a");
      link.href =
        "https://cdn.discordapp.com/attachments/768414936514428969/1120101144073613423/Intern_All_Conflict_Final.zip"; // replace this with the URL of your zip file
      link.download = "Intern: All Conflict.zip";
      document.body.appendChild(link); // append the link to body (required for Firefox)
      link.click();
      document.body.removeChild(link); // remove the link from the body
    }

    function downloadApeAscent() {
      var link = document.createElement("a");
      link.href =
        "https://cdn.discordapp.com/attachments/768414936514428969/1120101143712899082/BUILDS.zip"; // replace this with the URL of your zip file
      link.download = "ApeAscent.zip";
      document.body.appendChild(link); // append the link to body (required for Firefox)
      link.click();
      document.body.removeChild(link); // remove the link from the body
    }

    function downloadHotHell() {
      var link = document.createElement("a");
      link.href =
        "https://cdn.discordapp.com/attachments/768414936514428969/1120101144476262511/HotHell.zip"; // replace this with the URL of your zip file
      link.download = "HotHell.zip";
      document.body.appendChild(link); // append the link to body (required for Firefox)
      link.click();
      document.body.removeChild(link); // remove the link from the body
    }

    function validateLogin(uname, pword) {
      if (uname == "admin" && pword == "diabolical") {
        setCurrentUser(uname);
      } else {
        output("Invalid credentials");
      }
    }

    function getLoginPrompt() {
      return currentUser + currentSystem;
    }

    function openFile(e) {
      switch (e) {
        case "logfile_" + endDateStr + ".txt":
          output(printLogFile1());
          break;
        case "password.txt":
          output("username: admin | password: diabolical"); // Replace this with the open content from the file
          break;
      }
    }

    function doesFileExist(fileName) {
      return true;
    }

    function printLogFile1(fileName) {
      switch (fileName) {
        case "":
          //todays date on the logs
          break;
      }
      return (
        "<div>" +
        endDateStr +
        ':11:04:34| invalid password for user "admin"</div><div>' +
        endDateStr +
        ':11:04:34| unknown command "Password1"</div>'
      );
    }

    function output(e) {
      output_.insertAdjacentHTML("beforeEnd", "<p>" + e + "</p>");
      let paragraphs = output_.querySelectorAll('p');
      let lastParagraph = paragraphs[paragraphs.length - 1];
      applyTypewriterEffect(lastParagraph);
    }

    function applyTypewriterEffect(p) {
      let text = p.textContent;
      p.textContent = '';
      let i = 0;
      let intervalId = setInterval(function () {
        p.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, 30); // Speed of typewriter in milliseconds
    }


    function getDocHeight_() {
      var d = document;
      return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
      );
    }

    function setCurrentUser(user) {
      currentUser = user;
      $("#input-line .prompt").html(currentUser + currentSystem);
    }

    showDialogue("Diabolical", "What the?")
      .then(() => showDialogue("Diabolical", "How did you get here??"))

    showHint(
      'If you want to use the functions you can type "help" to gain access'
    )

      .then(() =>
        showDialogue(
          "Diabolical",
          "Looks like you've been looking at the server logs."
        )
      )
      .then(() =>
        showDialogue(
          "Diabolical",
          "Well then since you're already here, I might aswell allow you to use the console for a short time."
        )
      )
      .then(() => showDialogue("Diabolical", "C'mon give it a try. Just dont type 'run riddle.exe'"))
      .then(() => showHint('Note to self: Do NOT let anyone type "run riddle.exe" in the console.'))
      .catch(console.error);

    function showDialogue(characterName, text) {
      return new Promise((resolve, reject) => {
        var index = 0;

        // Append the character name
        $("#dialogue-text").text(characterName + ": ");

        var timer = setInterval(function () {
          $("#dialogue-text").append(text.charAt(index));
          index++;
          if (index > text.length) {
            clearInterval(timer);
            setTimeout(() => {
              resolve();
            }, 2000); // Increase this delay if needed
          }
        }, 40);
        $(dialogue_).show();
      });
    }

    function showHint(text) {
      return new Promise((resolve, reject) => {
        $(hint_).text(text);
        $(hint_).show();
        setTimeout(() => {
          resolve();
        }, 4000); // 3 seconds to show the hint, and 1 second delay after it
      });
    }

    function hideBlurb() {
      $(backstory_).hide();
      $("#container").show();
    }

    function isInArray(s, array) {
      var returnIndex = 0;
      var results = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i].startsWith(s)) {
          returnIndex = i;
          results++;
        }
      }
      if (results == 1) {
        return array[returnIndex];
      } else {
        return "password.txt"; // return an empty string if no match or multiple matches are found
      }
    }

    function generateHackerHistory() {
      output(HACKERHISTORY_);
    }

    hideBlurb();
  });
});
