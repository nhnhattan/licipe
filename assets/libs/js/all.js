$(document).ready(function () {
  localStorage.removeItem("update");
  $("#menu-button").click(function () {
    $(".overlay").toggleClass("active");
  });

  $(".btn-menu_close").click(function () {
    $(".overlay").toggleClass("active");
  });

  $(".hidebar-item").click(function () {
    $(".overlay").toggleClass("active");
  });

  var $slides = $(".rules .wrapper");
  var slideWidth = $(".rules-slide").outerWidth();
  var slideCount = $(".rules-slide").length;
  var currentIndex = 0;

  $(".rules-button_right").click(function () {
    if (currentIndex < slideCount - 1) {
      $(".rules-button_left").removeAttr("disabled");
      currentIndex++;
      $slides.css(
        "transform",
        "translateX(-" + currentIndex * slideWidth * 1.26 + "px)"
      );
      if (currentIndex == 2) {
        $(".rules-button_right").attr("disabled", "disabled");
      } else if (currentIndex < 2) {
        $(".rules-button_right").removeAttr("disabled");
      }
    }
  });

  $(".rules-button_left").click(function () {
    if (currentIndex > 0) {
      $(".rules-button_right").removeAttr("disabled");
      currentIndex--;
      $slides.css(
        "transform",
        "translateX(-" + currentIndex * slideWidth * 1.26 + "px)"
      );
      if (currentIndex == 0) {
        $(".rules-button_left").attr("disabled", "disabled");
      } else {
        $(".rules-button_left").removeAttr("disabled");
      }
    }
  });

  var keywords = {
    Drug: [
      "drug",
      "ma túy",
      "thuốc phiện",
      "dope",
      "drugs",
      "cigarette",
      "alcohol",
      "contraband",
      "ecstasy",
      "cigar",
    ],
    Violence: [
      "threatening",
      "terrorizing",
      "denouncing crimes",
      "blood",
      "máu",
      "die",
      "chết",
      "kill",
      "giết",
      "torture",
      "war",
      "chiến tranh",
      "fight",
      "tấn công",
      "bullying",
      "beating",
      "suicide",
      "tự sát",
      "tự tử",
      "self - harm",
      "cursing",
      "extremism",
      "death",
      "cái chết",
      "chết chóc",
    ],
    Weapons: [
      "swords",
      "cây kiếm",
      "thanh kiếm",
      "spears",
      "ngọn giáo",
      "cây giáo",
      "cây thương",
      "bayonets",
      "lưỡi lê",
      "daggers",
      "dao găm",
      "crossbows",
      "cung",
      "cung tên",
      "machetes",
      "dao rựa",
      "gun",
      "súng",
      "grenades",
      "lựu đạn",
      "artillery",
      "pháo binh",
      "đại bác",
      "bombs",
      "bom",
      "mines",
      "mìn",
      "enemy",
      "kẻ thù",
      "Army",
      "quân đội",
      "lính",
      "boomb",
      "bùm",
    ],
    Illegal: [
      "transgress",
      "phạm tội",
      "vi phạm",
      "robbery",
      "cướp",
      "trộm",
      "ăn cắp",
      "đánh cắp",
      "jealousy",
      "ghen tị",
      "ganh ghét",
      "ghen",
      "ghen ghét",
      "prostitution",
      "mại dâm",
      "điếm",
      "đĩ",
      "dâm",
      "gambling",
      "cờ bạc",
      "cá độ",
      "bitch",
    ],
    Famous_Brand: [
      "Dior",
      "Chanel",
      "Apple",
      "Samsung",
      "Gucci",
      "Zara",
      "Prada",
      "Adidas",
      "Nike",
      "Hermes",
      "Louis",
      "Vuitton",
      "Burberry",
      "Versace",
      "Céline",
    ],
    App: [
      "Facebook",
      "Zalo",
      "Instagram",
      "Shopee",
      "Lazada",
      "Amazon",
      "Google",
      "Telegram",
      "SnapChat",
    ],
    BodyandSex: [
      "sex",
      "nude",
      "naked",
      "body",
      "dick",
      "cunt",
      "bitch",
      "sextoy",
      "kiss",
      "fuck",
      "chest",
      "sexy",
      "blowjob",
      "masturbation",
      "jerk off",
      "hand job",
      "orgasm",
      "condom",
      "sperm",
      "dildo",
      "buttocks",
      "ass",
      "clitoris",
      "hickey",
      "semen",
      "raped",
      "penis",
      "cock",
      "dick",
      "anus",
      "boobs",
      "tits",
      "pussy",
      "tounge",
      "vulva",
      "vagina",
      "clitoris",
      "threesome",
    ],
    People: ["kid", "teenager", "hybrid", "crime"],
    Decry: [
      "trash",
      "rubbish",
      "dirty",
      "ugly",
      "silly",
      "fat",
      "stupid",
      "crazy",
      "disgusting",
    ],
    Sanitary: [
      "bath",
      "shower",
      "pee",
      "poo",
      "poop",
      "shit",
      "toilet",
      "vomit",
    ],
    Ecology: [
      "Snake",
      "ants",
      "bacteria",
      "insects",
      "centipede",
      "lizards",
      "insects",
    ],
    Scary: [
      "ghost",
      "monster",
      "creepy",
      "terrifying",
      "horror",
      "graveyard",
      "suicidal",
      "devil",
      "zombie",
      "blood",
    ],
    Sensitive: [
      "religion",
      "politics",
      "nation",
      "nation",
      "ethnicity",
      "territory",
      "money",
      "maternity",
      "reactionary",
      "parties",
      "communism",
      "socialism",
      "god",
      "buddha",
      "coffin",
      "bone",
    ],
    Offensive: [
      "skull",
      "middle finger",
      "three stripes",
      "cross",
      "thumb down",
      "cross finger",
    ],
    Illness: [
      "HIV",
      "Virus",
      "corona",
      "hospital",
      "scabies",
      "bleeding",
      "cancer",
      "chickenpox",
      "ulcer",
      "acne",
      "eczema",
    ],
  };

  // $("#keyword-box").on("input", function () {
  //   // Get the value from the textarea
  //   var text = $(this).val().toLowerCase();
  //
  //   // Array to store found keywords
  //   var foundKeywords = [];
  //   $("#keyword-box").css({border: "1px solid black !important" });
  //
  //   // Iterate through the keyword object
  //   $("#keyword-box").on("input", function () {
  //     // Get the current value from the textarea
  //     var text = $(this).val().toLowerCase();
  //
  //     // Array to store found keywords
  //     var foundKeywords = [];
  //
  //     // Iterate through the keyword object
  //     $.each(keywords, function (group, words) {
  //       // Iterate through each array of keywords
  //       for (var i = 0; i < words.length; i++) {
  //         if (
  //           text.includes(words[i]) &&
  //           !foundKeywords.includes(words[i])
  //         ) {
  //           foundKeywords.push(`(${words[i]})`); // Add found keyword to array
  //         } else if (
  //           !text.includes(words[i]) &&
  //           foundKeywords.includes(words[i])
  //         ) {
  //           // Remove the keyword from the array if it has been deleted
  //           foundKeywords = foundKeywords.filter(function (keyword) {
  //             return keyword !== words[i];
  //           });
  //         }
  //       }
  //     });
  //
  //     // Update the result based on whether any keywords were found
  //     if (foundKeywords.length > 0) {
  //       $("#result").html("Keywords found: " + foundKeywords.join(", ")).show();
  //       $("#create-image-ai").attr("disabled", true);
  //     } else {
  //       $("#result").hide();
  //       $("#create-image-ai").removeAttr("disabled");
  //     }
  //   });
  // });

  $("#download-img").on("click", function () {
    var $div = $("#finish-img-wrapper");
    var originalBorder = $div.css("border");
    $div.css("border", "none");
    // Capture the div
    html2canvas(document.getElementById("finish-img-wrapper"), {
      scale: 5, // Increase the scale for higher resolution (2x, can be 3x or more if needed)
      backgroundColor: null,
    }).then(function (canvas) {
      $div.css("border", originalBorder);
      var imgData = canvas.toDataURL("image/png");

      // Create a temporary link element for download
      var link = document.createElement("a");
      link.href = imgData;
      link.download = "captured-image-highres.png"; // The name of the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  $("#close-finish-btn").on("click", function () {
    $(".modal-result").hide();
  });

  $("#register_back-btn").on("click", function () {
    $("#name").prop("required", false);
    $("#dob").prop("required", false);
    $("#phone").prop("required", false);
    $("#email").prop("required", false);
    $("#register-form").hide();
    $("#login-form").show();
  });

  $(window).click(function (event) {
    if ($(event.target).is("#register-overlay")) {
      $("#register-overlay").hide();
      if (!localStorage.getItem("user")) {
        $("#name").prop("required", true);
        $("#dob").prop("required", true);
        $("#phone").prop("required", true);
        $("#email").prop("required", true);
        $("#phone-login").prop("required", false);
        $("#email-login").prop("required", false);
        $("#login-form").hide();
      } else {
        $("#name").prop("required", false);
        $("#dob").prop("required", false);
        $("#phone").prop("required", false);
        $("#email").prop("required", false);
        $("#phone-login").prop("required", true);
        $("#email-login").prop("required", true);
        $("#register-form").hide();
      }
    }
  });

  // rules slide rules
  $(".collapsible").click(function () {
    $(".content").not($(this).next()).slideUp();
    $(".collapsible").not($(this)).removeClass("active");
    $(this).next(".content").slideToggle();
    $(this).toggleClass("active");
    $(".icon i").removeClass("fa-minus").addClass("fa-plus"); // Reset all icons to plus
    if ($(this).hasClass("active")) {
      $(this).find(".icon i").removeClass("fa-plus").addClass("fa-minus");
    }
  });
});
