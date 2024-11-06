// const apiUrl = "https://proxy.advietnam.vn";
// const url135Years =
//   "http://135yearsmentholatum.lipice.com.vn/app/api/sql/Public_Return_Json";

import { croppedBlob } from "./cropper.js";

const maxHistory = 3;
let resetCount = 0;

var bannedWords = {
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
  Sanitary: ["bath", "shower", "pee", "poo", "poop", "shit", "toilet", "vomit"],
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

function checkForBannedWords(input) {
  const inputText = input;
  let containsBannedWord = false;

  $.each(bannedWords, function (category, wordsArray) {
    $.each(wordsArray, function (index, word) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(inputText)) {
        containsBannedWord = true;
        return false;
      }
    });
    if (containsBannedWord) return false;
  });

  if (containsBannedWord) {
    return false;
  } else {
    return true;
  }
}

//   Cookies Functions --------------------------------
function setArrayToCookies(cookieName, cookieString) {
  const arrayName = cookieName;
  const arrayValues = cookieString;
  const jsonArray = JSON.stringify(arrayValues);
  document.cookie = `${arrayName}=${jsonArray}; path=/`;
}

function getArrayFromCookies(cookieName) {
  const arrayName = cookieName;
  const cookies = document.cookie.split("; ");
  let arrayData = null;
  $.each(cookies, function (_, cookie) {
    const [name, value] = cookie.split("=");
    if (name === arrayName) {
      arrayData = JSON.parse(decodeURIComponent(value));
    }
  });

  const displayDiv = $("#displayArray");
  if (arrayData) {
    return arrayData;
  } else {
    return false;
  }
}

$(document).ready(function () {
  let checkText = false;

  $("#keyword-box-mobile").on("input", function () {
    var text = $(this).val().toLowerCase();
    var textTrim = $(this).val().trim();
    var words = text.split(/\s+/);
    var wordCount = words[0] === "" ? 0 : words.length;
    // Cập nhật số từ
    if (text === "") {
      $("#resultMobile").text("Không được để trống");
      $("#create-image-ai_mobile").attr("disabled", "disabled");
      checkText = false;
    } else if (text.length < 2) {
      $("#resultMobile").text("Phải nhập ít nhất 6 từ");
      $("#create-image-ai_mobile").attr("disabled", "disabled");
      checkText = false;
    } else {
      if (wordCount < 6) {
        $("#resultMobile").text("Phải nhập ít nhất 6 từ");
        $("#create-image-ai_mobile").attr("disabled", "disabled");
        checkText = false;
      } else if (wordCount >= 6) {
        var inputText = $(this).val();
        var currentText = $(this).val().trim();
        var currentLength = currentText.length;
        var words = inputText.split(/\s+/);
        var noAccentWordRegex = /^[a-zA-Z]*[aeiouy]+[a-zA-Z]*$/;
        var wordsWithoutAccent = [];
        words.forEach(function (word) {
          if (noAccentWordRegex.test(word)) {
            wordsWithoutAccent.push(word);
          }
        });

        if (
          wordsWithoutAccent.length >=
          (wordCount - (wordCount % 2)) / 2 + 1
        ) {
          $("#resultMobile").text(
            "Vui lòng nhập đầy đủ dấu câu"
            // + wordsWithoutAccent.join(", ")
          );
          checkText = false;
          $("#create-image-ai_mobile").attr("disabled", "disabled");
        } else if (textTrim.length < previousLength) {
          $("#resultMobile").text(
            ""
            // + wordsWithoutAccent.join(", ")
          );
          checkText = false;
          $("#create-image-ai_mobile").attr("disabled", "disabled");
        } else {
          $("#resultMobile").text("Từ hợp lệ");
          $("#create-image-ai_mobile").removeAttr("disabled");
          checkText = true;
        }
        previousLength = currentLength;
      } else {
        $("#resultMobile").text("");
      }
    }
    previousLength = textTrim.length;
    return checkText;
  });

  const steps = [
    {
      title: "Bước 1: Nhập nội dung hình nền.",
      description: "Nhập nội dung để tạo hình nền theo ý muốn của bạn.",
    },
    {
      title: "Bước 2: Tạo hình nền cây son.",
      description: "Vui lòng chờ đến khi tải xong ảnh.",
    },
    {
      title: "Bước 3: Tải lên ảnh đại diện",
      description: "Tải lên ảnh đại diện của bạn để tạo logo riêng.",
    },
    {
      title: "Bước 4: Tạo logo cây son",
      description: "Vui lòng chờ đến khi tải xong ảnh.",
    },
    {
      title: "Cây son của bạn",
      description:
        "Nhấn tải ảnh về để tải về cây son của bạn.\n  Hoặc nhấn hoàn tác để tạo lại cây son.",
    },
  ];

  let currentStep = 0;
  const $stepTitle = $("#stepTitle");
  const $stepDescription = $("#stepDescription");
  const $prevBtn = $("#stepPrevBtn");
  const $nextBtn = $("#stepNextBtn");
  const $circles = $(".gameplay-circle");
  const $lines = $(".gameplay-line");
  const $errorMessage = $("#errorMessage");
  const $successMessage = $("#successMessage");
  const $inputDisplay = $("#inputDisplay");

  const userInputs = Array(steps.length).fill(""); // Array to hold inputs

  function updateStep() {
    const step = steps[currentStep];
    $stepTitle.text(step.title);
    $stepDescription.text(step.description);
    $(".step-form").hide(); // Hide all forms
    $("#form" + (currentStep + 1)).show(); // Show the current step form

    // Reset input field for the current step
    const $currentInputField = $("#inputField" + (currentStep + 1));
    $currentInputField.val(userInputs[currentStep]); // Populate input field with current step's input
    $currentInputField.removeClass("error"); // Remove error class

    $circles.removeClass("active completed");
    $lines.removeClass("completed line-draw");
    $errorMessage.hide(); // Hide error message on step update

    $circles.each(function (index) {
      if (index < currentStep) {
        $(this).addClass("completed");
        $lines.eq(index).addClass("completed");
      } else if (index === currentStep) {
        $(this).addClass("active");
      }
    });

    // Animate the line to the current step
    if (currentStep > 0) {
      $lines.eq(currentStep - 1).addClass("line-draw");
    }

    $prevBtn.prop("disabled", currentStep === 0);
    $nextBtn.text(currentStep === steps.length - 1 ? "Finish" : "Next");
    checkStepButton();
  }

  var previousLength = 0;

  var checkImage = false;

  $("#create-image-ai_mobile").click(function () {
    if (!getArrayFromCookies("setLogin")) {
      $("#login-form").hide();
      $(".register-overlay").fadeIn();
      $("#register-form").show();
    } else {
      var txt = $("#keyword-box-mobile").val();

      let formTranslate = new FormData();
      let formValue = new FormData();
      let formImage = new FormData();
      $(".step-one_content").hide();
      $("#form1 .loading-container").show();

      $("#resultMobile").text("");

      formValue.append("Procedure", "Ai_AuthenticationCheck");
      formValue.append(
        "Parameters",
        JSON.stringify({
          UserId: getArrayFromCookies("loginCookies").Objects[0].UserId,
        })
      );

      if (checkForBannedWords(txt)) {
        formValue.append("ProcedureCallback", "Ai_AuthenticationCallback");
        $.ajax({
          url: `${apiUrl}/authorization`,
          type: "POST",
          processData: false,
          contentType: false,
          data: formValue,
          success: function (data, textStatus, xhr) {
            const authorize = JSON.parse(data);
            let bearerToken = authorize.Objects[0].UserAiTokenValue;
            setArrayToCookies("bearerToken", bearerToken);
            formTranslate.append("Procedure", "Ai_TokenCheck");
            formTranslate.append(
              "Parameters",
              JSON.stringify({
                UserId: getArrayFromCookies("loginCookies").Objects[0].UserId,
                UserAiTokenValue: bearerToken,
              })
            );
            formTranslate.append("ProcedureCallback", "Ai_TokenCallBack");
            formTranslate.append("Prompt", String(txt));

            $.ajax({
              url: `${apiUrl}/text-generate/translate-vi-en`,
              type: "POST",
              processData: false,
              contentType: false,
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${bearerToken}`);
              },
              data: formTranslate,
              success: function (data, textStatus, xhr) {
                // Check banned words in translation
                if (checkForBannedWords(JSON.parse(data).Result)) {
                  formImage.append("Procedure", "Ai_TokenCheck");
                  formImage.append(
                    "Parameters",
                    JSON.stringify({
                      UserId:
                        getArrayFromCookies("loginCookies").Objects[0].UserId,
                      UserAiTokenValue: bearerToken,
                    })
                  );
                  formImage.append("ProcedureCallback", "Ai_TokenCallBack");
                  formImage.append("Prompt", String(data));
                  formImage.append("Style", "anime");

                  //   Tạo ảnh AI
                  $.ajax({
                    url: `${apiUrl}/ai-generate/text-to-image`,
                    type: "POST",
                    processData: false,
                    contentType: false,
                    beforeSend: function (xhr) {
                      xhr.setRequestHeader(
                        "Authorization",
                        `Bearer ${bearerToken}`
                      );
                    },
                    data: formImage,
                    success: function (data, textStatus, xhr) {
                      $("#form1 .loading-container").hide();
                      const imageData = JSON.parse(data);
                      setTimeout(function () {
                        $(".image-ai .loading-container").hide();
                        $(".image-ai-img").attr(
                          "src",
                          `https://proxy.advietnam.vn/ai/${imageData.Objects[0].UserAiResponse}`
                        );
                        $(".image-ai-img").show();
                        $("#create-image-ai").css("cursor", "default");
                        setArrayToCookies("step", "1");
                        checkImage = true;
                        currentStep++;
                        updateStep();
                      }, 500);
                    },
                    error: function (error) {
                      console.error("Create Image AI Error", error);
                      Toastify({
                        text: "Tải ảnh thất bại, vui lòng thử lại!",
                        duration: 2000,
                        close: true,
                        gravity: "top",
                        position: "center",
                        stopOnFocus: true,
                        style: {
                          background: "red",
                        },
                      }).showToast();
                    },
                  });
                } else {
                  $(".image-ai .loading-container img").hide();
                  $("#create-image-ai").attr("disabled", "disabled");
                  return false;
                }
              },
              error: function (error) {
                console.error("Error translate: ", error);
              },
            });
          },
          error: function (error) {
            console.error("Error authorization: ", error);
            updateProgress(0);
            Toastify({
              text: "Xác minh tài khoản thất bại. Vui lòng thử lại!",
              duration: 2000,
              close: true,
              gravity: "top",
              position: "center",
              stopOnFocus: true,
              style: {
                background: "red",
              },
            }).showToast();
          },
        });
      } else {
        $(".image-ai .loading-container img").hide();
        $("#create-image-ai").attr("disabled", "disabled");
        $("#keyword-box").text("");
        $("#create-image-ai").css("cursor", "not-allowed");
        checkImage = false;
      }
    }
  });

  $("#upload-image-mobile").click(function () {
    if (!croppedBlob) {
      Toastify({
        text: "Vui lòng chọn ảnh để tạo!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "red",
        },
      }).showToast();
      return;
    } else {
      $("#form3 .loading-container img").show();
      $("#form3 .loading-container").show();
      $(".form3-wrapper").hide();
      $(".avatar-ai-img").attr("src", "");
      var formAvatar = new FormData();
      formAvatar.append("Procedure", "Ai_TokenCheck");
      formAvatar.append(
        "Parameters",
        JSON.stringify({
          UserId: getArrayFromCookies("loginCookies").Objects[0].UserId,
          UserAiTokenValue: getArrayFromCookies("bearerToken"),
        })
      );
      formAvatar.append("ProcedureCallback", "Ai_TokenCallBack");
      formAvatar.append("Image", croppedBlob);
      formAvatar.append("Prompt", "The face on center image");
      formAvatar.append("Style", "anime");
      $.ajax({
        url: `${apiUrl}/ai-generate/image-to-image`,
        type: "POST",
        data: formAvatar,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            `Bearer ${getArrayFromCookies("bearerToken")}`
          );
        },
        success: function (data, textStatus, xhr) {
          const imageData = JSON.parse(data);
          setTimeout(function () {
            $("#form3 .loading-container img").hide();
            $("#form3 .loading-container").hide();
            $(".avatar-ai-img").attr(
              "src",
              `https://proxy.advietnam.vn/ai/${imageData.Objects[0].UserAiResponse}`
            );
            $(".avatar-ai-img").show();
            $("#upload-image-mobile").css("bottom", "3.1%");
            $("#create-lipstick-mobile").css("bottom", "3.6%")
            currentStep++;
            updateStep();
            $(".form3-wrapper").show();
          }, 500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          alert("Image upload failed: " + textStatus);
        },
      });
    }
  });

  $("#create-lipstick-mobile").click(function () {
    Texture_Label_Update($(".image-ai-img").attr("src"));
    Texture_Avatar_Update($(".avatar-ai-img").attr("src"));
    $("#create-lipstick-mobile").attr("disabled", "disabled");
    $("#create-lipstick-mobile").css("bottom", "3.5%");
    currentStep++;
    updateStep();
  });

  $("#reset-mobile").click(function () {
    $(".reset-overlay").show();
  });

  $("#reset-yes-btn").click(function () {
    if (resetCount < maxHistory) {
      $("#download-img-mobile").show();
      $(".step-one_content").show();
      $("#keyword-box-mobile").val("");
      $("#result").text("");
      $(".image-ai-img").hide();
      $(".image-ai-img").attr("src", "");
      $("#croppedImageMobile").attr("src", "");
      $("#uploadImage").val("");
      $("#removeImageButton").hide();
      $("#openModalButton").hide();
      $("#file-name").text("No file chosen");
      $(".avatar-ai-img").css("display", "none");
      $(".avatar-ai-img").attr("src", "");
      $(".file-upload-label").show();
      $("#create-image-ai").attr("disabled", "disabled");
      $("#create-image-ai_mobile").attr("disabled", "disabled");
      $("#create-lipstick-mobile").show();
      $("#register-form").hide();
      $("#register-overlay .loading-container").hide();
      $("#register-overlay .loading-container img").hide();
      $("#create-lipstick-mobile").css("bottom", "6.3%");
      $("#create-lipstick-mobile").removeAttr("disabled");
      $("#upload-image-mobile").css("bottom", "5%");
      localStorage.removeItem("update");
      Texture_Label_Update("./assets/img/original.png");
      Texture_Avatar_Update("./assets/img/original.png");
      resetCount++;
      $("#reset-btn").text(`Hoàn tác (${resetCount}/3)`);
      if (resetCount >= maxHistory) {
        $(this).prop("disabled", true);
        $("#reset-btn").attr("disabled", "disabled");
        $("#reset-btn").attr("noHover");
        $("#create-image-ai").click(function () {
          return false;
        });
      }
      $(".reset-overlay").hide();
    }
    currentStep = 0;
    updateStep();
  });

  function stepOneFunction() {
    return true;
  }

  function stepTwoFunction() {
    return true;
  }

  function stepThreeFunction() {
    return true;
  }

  function stepFourFunction() {
    return true;
  }

  function checkStepButton() {
    switch (currentStep) {
      case 0:
        $prevBtn.hide();
        $nextBtn.hide();
        break;
      case 1:
        $nextBtn.show();
        $prevBtn.show();
        break;
      case 2:
        $nextBtn.show();
        break;
      case 3:
        $nextBtn.hide();
        break;
      case 4:
        $prevBtn.hide();
        $nextBtn.hide();
        break;
      default:
        break;
    }
  }

  function callStepFunction() {
    switch (currentStep) {
      case 0:
        return stepOneFunction();
      case 1:
        return stepTwoFunction();
      case 2:
        return stepThreeFunction();
      case 3:
        return stepFourFunction();
      default:
        return false;
    }
  }

  $nextBtn.click(function () {
    if (callStepFunction()) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        updateStep();
      } else {
        $nextBtn.prop("disabled", true); // Disable the next button
      }
    }
  });

  $prevBtn.click(function () {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  updateStep(); // Initialize the first step
});
