// Login
const apiUrl = "https://proxy.advietnam.vn";
const url135Years =
  "https://135yearsmentholatum.lipice.com.vn/app/api/sql/Public_Return_Json";

var bannedWords = {
  Drug: [
    "drug",
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
    "die",
    "kill",
    "torture",
    "war",
    "fight",
    "bullying",
    "beating",
    "suicide",
    "self - harm",
    "cursing",
    "extremism",
    "death",
  ],
  Weapons: [
    [
      "swords",
      "spears",
      "bayonets",
      "daggers",
      "crossbows",
      "machetes",
      "gun",
      "grenades",
      "artillery",
      "bombs",
      "mines",
      "enemy",
      "Army",
      "boomb",
    ],
  ],
  Illegal: [
    "transgress",
    "robbery",
    "jealousy",
    "prostitution",
    "gambling",
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

$(document).ready(function (blob) {
  var bearerToken = "";

  function Authorize(data) {
    bearerToken = data;
  }

  function checkKeyBanned(string) {
    var inputText = String(string).toLowerCase();
    var words = inputText.split(/\s+/);
    var found = false;

    if (!inputText) {
      $("#keyword-box").css({ border: "solid red 1px" });
      Toastify({
        text: "Không được để trống",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      found = true;
    }

    $.each(bannedWords, function (category, wordsArray) {
      $.each(wordsArray, function (index, word) {
        const regex = new RegExp(`\\b${word}\\b`, "i");
        if (regex.test(inputText)) {
          found = true;
          Toastify({
            text: "Vui lòng nhập lại",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
          $("#result").text("Có chứa từ cấm, vui lòng nhập lại");
          $("#keyword-box").css({ border: "solid red 1px" });
          setTimeout(() => {
            $("#keyword-box").css({ border: "solid gray 1px" });
          }, 2000);
        } else {
          found = true;
        }
      });
    });

    return found;
  }

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

  // check vietnamese
  $(document).ready(function () {
    var previousLength = 0;
    $("#keyword-box").on("input", function () {
      var text = $(this).val().toLowerCase();
      var textTrim = $(this).val().trim();
      var words = text.split(/\s+/);
      var wordCount = words[0] === "" ? 0 : words.length;
      var isComplete = false;
      // Cập nhật số từ
      if (text === "") {
        $("#create-image-ai").attr("disabled", "disabled");
        $("#result").text("Không được để trống");
      } else if (text.length < 2) {
        $("#create-image-ai").attr("disabled", "disabled");
        $("#result").text("Phải nhập ít nhất 6 từ");
      } else {
        if (wordCount < 6) {
          $("#result").text("Phải nhập ít nhất 6 từ");
          $("#create-image-ai").attr("disabled", "disabled");
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
            $("#result").text(
              "Vui lòng nhập đầy đủ dấu câu"
              // + wordsWithoutAccent.join(", ")
            );
            $("#create-image-ai").attr("disabled", "disabled");
          } else if (textTrim.length < previousLength) {
            $("#result").text(
              ""
              // + wordsWithoutAccent.join(", ")
            );
            $("#create-image-ai").attr("disabled", "disabled");
          } else {
            $("#result").text("Từ hợp lệ");
            $("#create-image-ai").removeAttr("disabled");
            $("#create-image-ai").css("cursor", "pointer");
            isComplete = true;
          }
          previousLength = currentLength;
        } else {
          $("#result").text("");
        }
      }
      previousLength = textTrim.length;
    });
  });

  //   Create AI Image Functions
  $("#create-image-ai").click(function () {
    if (!getArrayFromCookies("setLogin")) {
      $("#login-form").hide();
      $(".register-overlay").fadeIn();
      $("#register-form").show();
      $("#register-form").submit(function (event) {
        event.preventDefault();

        $(".error").text("");

        let name = $("#name").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        let dob = $("#dob").val();

        let isValid = true;

        let phoneRegex = /^(?:\d{10}|\d{11})$/;
        if (!phoneRegex.test(phone)) {
          $("#phoneError").text("Số điện thoại không hợp lệ.");
          isValid = false;
        }

        // Check Registration
        if (isValid) {
          $("#register-form").hide();
          $("#register-overlay .loading-container").show();
          let formRegister = new FormData();
          formRegister.append("Procedure", "Ai_Register");
          formRegister.append(
            "Parameters",
            JSON.stringify({
              UserName: name,
              UserBirthday: dob,
              UserPhone: phone,
              UserEmail: email,
            })
          );
          let user;
          let userId;

          //   Register Functions
          $.ajax({
            url: url135Years,
            crossDomain: true,
            type: "POST",
            processData: false,
            contentType: false,
            data: formRegister,
            success: function (data, textStatus, xhr) {
              setTimeout(function () {
                const user = JSON.parse(data);
                userId = user.Objects[0].UserId;
                Toastify({
                  text: "Đăng ký thành công!",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  stopOnFocus: true,
                  style: {
                    background: "green",
                  },
                }).showToast();
                $("#register-form")[0].reset();
                $("#register-overlay .loading-container").hide();
                $("#login-form").show();
              }, 500);
            },
            error: function (error) {
              console.error("error", error);
            },
          });
        }
      });
    } else {
      //Already registered
      $(".image-ai .loading-container").show();
      $("#create-image-ai").attr("disabled", "disabled");
      $("#create-image-ai").css("cursor", "wait");
      var txt = $("#keyword-box").val();

      let formTranslate = new FormData();
      let formValue = new FormData();

      $(".image-ai .loading-container img").show();
      $("#result").text("");
      $(".image-ai-img").hide();

      formValue.append("Procedure", "Ai_AuthenticationCheck");
      formValue.append(
        "Parameters",
        JSON.stringify({
          UserId: getArrayFromCookies("loginCookies").Objects[0].UserId,
        })
      );

      //   Check banned words
      if (checkForBannedWords(txt)) {
        formValue.append("ProcedureCallback", "Ai_AuthenticationCallback");
        $.ajax({
          url: `${apiUrl}/authorization`,
          crossDomain: true,
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
              crossDomain: true,
              type: "POST",
              processData: false,
              contentType: false,
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${bearerToken}`);
              },
              data: formTranslate,
              success: function (data, textStatus, xhr) {
                // Check banned words in translation
                if (checkKeyBanned(JSON.parse(data).Result)) {
                  let formImage = new FormData();

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
                    crossDomain: true,
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
                      if (
                        JSON.parse(data).Objects[0].UserAiResponse.includes(
                          "Error"
                        )
                      ) {
                        Toastify({
                          text: "Có chứa từ cấm, vui lòng nhập lại!",
                          duration: 2000,
                          close: true,
                          gravity: "top",
                          position: "center",
                          stopOnFocus: true,
                          style: {
                            background: "red",
                          },
                        }).showToast();
                        $(".image-ai .loading-container img").hide();
                        $("#create-image-ai").attr("disabled", "disabled");
                        $("#keyword-box").text("");
                        $("#create-image-ai").css("cursor", "not-allowed");
                        formTranslate = new FormData();
                        formValue = new FormData();
                        return false;
                      } else {
                        $(".image-ai .loading-container img").hide();
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
                          $("#keyword-box").attr("disabled", "disabled");
                        }, 500);
                      }
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
        formTranslate = new FormData();
        formValue = new FormData();
        return false;
      }
    }
  });

  //   Login Function
  $("#login-form").submit(function (event) {
    event.preventDefault();
    let formLogin = new FormData();

    $(".error").text("");

    let emailLogin = $("#email-login").val();
    let phoneLogin = $("#phone-login").val();
    let isValid = true;

    // Validate phone (simple regex for phone numbers)
    let phoneRegex = /^(?:\d{10}|\d{11})$/;
    if (!phoneRegex.test(phoneLogin)) {
      Toastify({
        text: "Số điện thoại không hợp lệ!",
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          color: "white",
          background: "red",
        },
      }).showToast();
      isValid = false;
    }

    if (isValid) {
      $("#login-form").hide();
      $("#register-overlay .loading-container").show();

      formLogin.append("Procedure", "Ai_LoginByPhoneAndEmail");
      formLogin.append(
        "Parameters",
        JSON.stringify({
          UserPhone: phoneLogin,
          UserEmail: emailLogin,
        })
      );

      //   Login Functions
      $.ajax({
        url: url135Years,
        crossDomain: true,
        type: "POST",
        cache: false,
        processData: false,
        contentType: false,
        data: formLogin,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        success: function (data, textStatus, xhr) {
          setTimeout(function () {
            if (JSON.parse(data).Objects[0].ResponseCode == "201") {
              Toastify({
                text: "Đăng nhập thất bại! Vui Lòng thử lại",
                duration: 6000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                  color: "white",
                  background: "red",
                },
              }).showToast();
              $("#login-form").show();
              $("#register-overlay .loading-container").hide();
              $("#login-form")[0].reset();
            } else if (JSON.parse(data).Objects[0].UserId) {
              setArrayToCookies("loginCookies", JSON.parse(data));
              setArrayToCookies("setLogin", true);
              Toastify({
                text: "Đăng nhập thành công!",
                duration: 6000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                  color: "white",
                  background: "green",
                },
              }).showToast();
              $("#register-overlay .loading-container").hide();
              $("#login-form")[0].reset();
              $("#register-overlay").fadeOut();
              setTimeout(function () {
                $("#register-form").show();
                $("#login-form").show();
              }, 2000);
            }
          }, 500);
        },
        error: function (error) {
          Toastify({
            text: "Đăng nhập thất bại! Vui Lòng thử lại",
            duration: 6000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              color: "white",
              background: "red",
            },
          }).showToast();
          console.error("error", error);
        },
      });
    }
  });
});
