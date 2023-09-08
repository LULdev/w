$(function () {
  // This is the code for the menu links
  $(".menu-link").click(function () {
    $(".menu-link").removeClass("is-active");
    $(this).addClass("is-active");
  });

  // This is the code for the header links
  $(".main-header-link").click(function () {
    $(".main-header-link").removeClass("is-active");
    $(this).addClass("is-active");
  });

  // Fetch API code
  $(function () {
    function handleLinkClick(e) {
      e.preventDefault();

      let page = this.getAttribute("data-page");

      // Fetch the new content only for local links (those with a `data-page` attribute)
      if (page) {
        fetch(page)
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error("Error: " + response.statusText);
            }
          })
          .then(
            (data) =>
              (document.querySelector(".content-wrapper").innerHTML = data)
          )
          .catch((error) => console.error("Error:", error));
      }
    }

    function handleMainMenuClick(e) {
      let page = this.getAttribute("data-page");
      let leftSide = document.querySelector(".left-side");

      if (page.includes("home")) {
        leftSide.classList.remove("hide-left-side");
      } else {
        leftSide.classList.add("hide-left-side");
      }

      handleLinkClick.call(this, e);
    }

    document
      .querySelector(".dark-light")
      .addEventListener("click", function () {
        var leftSide = document.querySelector(".left-side");

        if (leftSide.classList.contains("hide-left-side")) {
          leftSide.classList.remove("hide-left-side");
        } else {
          leftSide.classList.add("hide-left-side");
        }
      });

    $(".menu-link").click(function () {
      $(".menu-link").removeClass("is-active");
      $(this).addClass("is-active");
    });

    // Fetch API code for main menu links
    document.querySelectorAll(".menu-link").forEach((link) => {
      link.addEventListener("click", handleMainMenuClick);
    });

    // Fetch API code for side menu links
    document.querySelectorAll(".side-menu-link").forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    // Fetch API code for card links
    document.querySelectorAll(".card-link").forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });
  });

  // Dropdown code
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdowns.forEach((c) => c.classList.remove("is-active"));
      dropdown.classList.add("is-active");
    });
  });

  window.addEventListener("load", (event) => {
    let dragged;

    document.querySelectorAll(".draggable").forEach((item) => {
      item.addEventListener("dragstart", (event) => {
        dragged = event.target;
      });
    });

    document.querySelectorAll(".dropzone").forEach((item) => {
      item.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      item.addEventListener("drop", (event) => {
        event.preventDefault();
        if (event.target.innerHTML === "") {
          event.target.append(dragged.cloneNode(true));
        }
      });
    });
  });

  // Search bar code
  $(".search-bar input")
    .focus(function () {
      $(".header").addClass("wide");
    })
    .blur(function () {
      $(".header").removeClass("wide");
    });

  // Dropdown removal code
  $(document).click(function (e) {
    var container = $(".status-button");
    var dd = $(".dropdown");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      dd.removeClass("is-active");
    }
  });

  $('.card').on('click', function() {
    var $socialIcons = $(this).find('.social-icons');
    $socialIcons.toggle();  // This will show the icons if they're hidden, and hide them if they're shown
  });
  

  // Overlay code
  $(function () {
    $(".dropdown").on("click", function (e) {
      $(".content-wrapper").addClass("overlay");
      e.stopPropagation();
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".dropdown") === false) {
        $(".content-wrapper").removeClass("overlay");
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".expand-btn");
    if (buttons.length > 0) {
      buttons.forEach(function (btn) {
        console.log("Button found");
        btn.addEventListener("click", function () {
          console.log("Button clicked");
          var card = this.parentElement.parentElement;
          var expandedContent = card.querySelector(".expanded-content");
          console.log("Expanded content found: ", expandedContent);
          if (
            expandedContent.style.display === "none" ||
            expandedContent.style.display === ""
          ) {
            expandedContent.style.display = "block";
            card.classList.add("expanded");
            console.log("Content is expanded");
          } else {
            expandedContent.style.display = "none";
            card.classList.remove("expanded");
            console.log("Content is collapsed");
          }
        });
      });
    } else {
      console.log("No expandable buttons found");
    }
  });

  const cursor = document.querySelector(".custom-cursor");
  const links = document.querySelectorAll("a");
  let isCursorInited = false;

  const initCursor = () => {
    cursor.classList.add("custom-cursor--init");
    isCursorInited = true;
  };

  const destroyCursor = () => {
    cursor.classList.remove("custom-cursor--init");
    isCursorInited = false;
  };

  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      cursor.classList.add("custom-cursor--link");
    });

    link.addEventListener("mouseout", () => {
      cursor.classList.remove("custom-cursor--link");
    });
  });

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (!isCursorInited) {
      initCursor();
    }

    cursor.style = `translate: ${mouseX}px ${mouseY}px`;
  });

  document.addEventListener("mouseout", destroyCursor);

  // Get all items
  var items = document.querySelectorAll(".left-side .side-menu-link");

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      var leftSide = document.querySelector(".left-side");

      if (window.innerWidth <= 945) {
        // Check if the device width is less than or equal to 945px
        leftSide.classList.add("hide-left-side");
      }
    });
  });

  // Initialize left-side visibility on page load
  window.addEventListener("load", function () {
    var leftSide = document.querySelector(".left-side");

    if (window.innerWidth <= 945) {
      // Check if the device width is less than or equal to 945px
      leftSide.classList.add("hide-left-side");
    } else {
      leftSide.classList.remove("hide-left-side");
    }
  });

  // Update left-side visibility on window resize
  window.addEventListener("resize", function () {
    var leftSide = document.querySelector(".left-side");

    if (window.innerWidth <= 945) {
      // Check if the device width is less than or equal to 945px
      leftSide.classList.add("hide-left-side");
    } else {
      leftSide.classList.remove("hide-left-side");
    }
  });
});
