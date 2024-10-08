// Login
const apiUrl = "https://proxy.advietnam.vn";
const url135Years = "http://135yearsmentholatum.lipice.com.vn/app/api/sql/Public_Return_Json"

var keywords = {
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
    let formValue = new FormData();
    let formLogin = new FormData();
    let formImage = new FormData();

    var bearerToken = "";

    function Authorize(data) {
        bearerToken = data;
    }

    let progressBar = $(".progress");
    let percentageText = $(".percentage");
    let postsContainer = $(".posts-container");
    let percentage = 0;

    function updateProgress(progress) {
        percentage = progress;
        progressBar.css("width", percentage + "%");
        percentageText.text(percentage + "%");
    }

    function setCookie(name, value, minutes) {
        var expires = "";
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + minutes * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function checkKeyBanned(string) {
        var inputText = String(string).toLowerCase();
        var words = inputText.split(/\s+/);
        var found = false;
        if (!inputText) {
            $("#keyword-box").css({border: "solid red 1px"});
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
        $.each(keywords, function (name, key) {
            // Check if any keyword matches the input text
            key.forEach(function (keyword) {
                if (inputText.includes(String(keyword).toLowerCase())) {
                    $("#result").text(
                        "Có chứa từ cấm: " + keyword + " trong nhóm " + name
                    );
                    $("#keyword-box").css({border: "solid red 1px"});
                    setTimeout(() => {
                        $("#keyword-box").css({border: "solid gray 1px"});
                    }, 2000);
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
                    found = true;
                }
            });
        });
        return found;
    }

    function checkCookieAndReset() {
        if (!getCookie("bearerToken")) {
            alert("Vui lòng đăng nhập lại");
            // location.reload(); // Reload the page if the cookie is not found
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

    $("#create-image-ai").click(function () {
        if (localStorage.getItem("user")) {
            $("#login-form").show()
            $(".register-overlay").fadeIn()
        } else {
            $("#register-form").show()
            $(".register-overlay").fadeIn()
            $("#register-form").submit(function (event) {
                    event.preventDefault();

                    $(".error").text("");

                    let name = $("#name").val();
                    let email = $("#email").val();
                    let phone = $("#phone").val();
                    let dob = $("#dob").val();

                    let isValid = true;

                    let phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(phone)) {
                        $("#phoneError").text(
                            "Please enter a valid 10-digit phone number."
                        );
                        isValid = false;
                    }

                    let dobDate = new Date(dob);
                    let today = new Date();
                    let age = today.getFullYear() - dobDate.getFullYear();
                    let monthDiff = today.getMonth() - dobDate.getMonth();
                    if (
                        monthDiff < 0 ||
                        (monthDiff === 0 && today.getDate() < dobDate.getDate())
                    ) {
                        age--;
                    }

                    if (isValid) {
                        $("#register-form").hide()
                        $("#register-overlay .loading-container").show()
                        updateProgress(0);
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
                        let user
                        let userId
                        $.ajax({
                            url: url135Years,
                            type: "POST",
                            processData: false,
                            contentType: false,
                            xhr: function () {
                                let xhr = new window.XMLHttpRequest();

                                xhr.addEventListener(
                                    "progress",
                                    function (evt) {
                                        if (evt.lengthComputable) {
                                            let percentComplete = Math.round(
                                                (evt.loaded / evt.total) * 100
                                            );
                                            updateProgress(percentComplete);
                                        }
                                    },
                                    false
                                );

                                return xhr;
                            },
                            data: formRegister,
                            success: function (data, textStatus, xhr) {
                                updateProgress(100);
                                setTimeout(function () {
                                    const user = JSON.parse(data);
                                    userId = user.Objects[0].UserId
                                    Toastify({
                                        text: "Đăng ký thành công!",
                                        duration: 3000, // 3 seconds
                                        close: true,
                                        gravity: "top",
                                        position: "center",
                                        stopOnFocus: true,
                                        style: {
                                            background: "green",
                                        },
                                    }).showToast();
                                    $("#register-form")[0].reset();
                                    $("#register-overlay .loading-container").hide()
                                    // $("#register-overlay").fadeOut();
                                    $("#login-form").show()
                                    localStorage.setItem("user", userId)
                                }, 500);
                            },
                            error: function (error) {
                                console.error("error", error);
                            },
                        })
                    }
                }
            )
        }

    });

    // Function to get a cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    $("#login-form").submit(function (event) {
        event.preventDefault();

        $(".error").text("");

        let emailLogin = $("#email-login").val();
        let phoneLogin = $("#phone-login").val();
        let isValid = true;


        // Validate phone (simple regex for phone numbers)
        let phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneLogin)) {
            $("#phoneError").text(
                "Please enter a valid 10-digit phone number."
            );
            isValid = false;
        }

        if (isValid) {
            $("#login-form").hide()
            $("#register-overlay .loading-container").show()
            updateProgress(0);

            formLogin.append("Procedure", "Ai_LoginByPhoneAndEmail");
            formLogin.append(
                "Parameters",
                JSON.stringify({
                    UserPhone: phoneLogin,
                    UserEmail: emailLogin,
                })
            );
            $.ajax({
                url: url135Years,
                type: "POST",
                processData: false,
                contentType: false,
                xhr: function () {
                    let xhr = new window.XMLHttpRequest();

                    xhr.addEventListener(
                        "progress",
                        function (evt) {
                            if (evt.lengthComputable) {
                                let percentComplete = Math.round(
                                    (evt.loaded / evt.total) * 100
                                );
                                updateProgress(percentComplete);
                            }
                        },
                        false
                    );

                    return xhr;
                },
                data: formLogin,
                success: function (data, textStatus, xhr) {
                    updateProgress(100);
                    setTimeout(function () {
                        console.log(data)
                        const login = JSON.parse(data)

                        Toastify({
                            text: "Đang đăng nhập!",
                            duration: 6000,
                            close: false,
                            gravity: "top",
                            position: "center",
                            stopOnFocus: true,
                            style: {
                                color: "black",
                                background: "Yellow",
                            },
                        }).showToast();
                        $("#login-form")[0].reset();
                        $("#register-overlay").fadeOut();
                        setTimeout(function () {
                            $("#register-form").show()
                            $("#login-form").show()
                            localStorage.setItem("userName", login.Objects[0].UserName)
                            localStorage.setItem("user", login.Objects[0].UserId)
                        }, 2000)

                        setTimeout(function () {
                            updateProgress(100);
                            setTimeout(function () {
                                setTimeout(function () {
                                    $(".image-ai .loading-container").hide();
                                    $("#create-image-ai").attr("disabled", "disabled");
                                    $("#create-image-ai").css("cursor", "wait");
                                    var txt = $("#keyword-box").val();

                                    formTranslate = new FormData();

                                    $(".image-ai .loading-container").show();
                                    updateProgress(0);
                                    $("#result").text("");
                                    $(".image-ai-img").hide();
                                    formValue.append("Procedure", "Ai_AuthenticationCheck");
                                    formValue.append(
                                        "Parameters",
                                        JSON.stringify({
                                            UserId: localStorage.getItem("user"),
                                        })
                                    );
                                    if (!checkKeyBanned(txt)) {
                                        formValue.append("ProcedureCallback", "Ai_AuthenticationCallback");
                                        $.ajax({
                                            url: `${apiUrl}/authorization`,
                                            type: "POST",
                                            processData: false,
                                            contentType: false,
                                            data: formValue,
                                            success: function (data, textStatus, xhr) {
                                                const authorize = JSON.parse(data)
                                                let bearerToken = authorize.Objects[0].UserAiTokenValue
                                                setCookie("bearerToken", bearerToken, 30);
                                                console.log(bearerToken)

                                                formTranslate.append("Procedure", "Ai_TokenCheck")
                                                formTranslate.append(
                                                    "Parameters",
                                                    JSON.stringify({
                                                        UserId: localStorage.getItem("user"),
                                                        UserAiTokenValue: bearerToken,
                                                    })
                                                );
                                                formTranslate.append("ProcedureCallback", "Ai_TokenCallBack")
                                                formTranslate.append("Prompt", String(txt));
                                                localStorage.setItem("bearer", bearerToken)
                                                Toastify({
                                                    text: "Đăng nhập thành công!",
                                                    duration: 2000,
                                                    close: true,
                                                    gravity: "top",
                                                    position: "center",
                                                    stopOnFocus: true,
                                                    style: {
                                                        background: "green",
                                                    },
                                                }).showToast();

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
                                                        var found = checkKeyBanned(data);
                                                        if (!found) {
                                                            updateProgress(25);
                                                            setTimeout(function () {
                                                                updateProgress(50);
                                                            }, 1500);
                                                            setTimeout(function () {
                                                                updateProgress(75);
                                                            }, 3000);
                                                            formImage.append("Procedure", "Ai_TokenCheck")
                                                            formImage.append(
                                                                "Parameters",
                                                                JSON.stringify({
                                                                    UserId: localStorage.getItem("user"),
                                                                    UserAiTokenValue: bearerToken,
                                                                })
                                                            );
                                                            formImage.append("ProcedureCallback", "Ai_TokenCallBack")
                                                            formImage.append("Prompt", String(data));
                                                            formImage.append("Style", "anime")
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
                                                                xhr: function () {
                                                                    let xhr = new window.XMLHttpRequest();

                                                                    xhr.addEventListener(
                                                                        "progress",
                                                                        function (evt) {
                                                                            if (evt.lengthComputable) {
                                                                                let percentComplete = Math.round(
                                                                                    (evt.loaded / evt.total) * 100
                                                                                );
                                                                                updateProgress(percentComplete);
                                                                            }
                                                                        },
                                                                        false
                                                                    );

                                                                    return xhr;
                                                                },
                                                                data: formImage,
                                                                success: function (data, textStatus, xhr) {
                                                                    updateProgress(100);
                                                                    console.log(data)
                                                                    const imageData = JSON.parse(data)
                                                                    setTimeout(function () {
                                                                        $(".image-ai .loading-container").hide();
                                                                        $(".image-ai-img").attr(
                                                                            "src",
                                                                            `https://proxy.advietnam.vn/ai/${imageData.Objects[0].UserAiResponse}`
                                                                        );
                                                                        $(".image-ai-img").show();
                                                                        // $("#create-image-ai").removeAttr("disabled");
                                                                        $("#create-image-ai").css("cursor", "not-allowed");
                                                                        localStorage.setItem("update", "1")
                                                                    }, 500);
                                                                },
                                                                error: function (error) {
                                                                    console.error("error", error);
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
                                                            $(".image-ai .loading-container").hide();
                                                            $("#create-image-ai").attr("disabled", "disabled");
                                                            return false;
                                                        }
                                                    },
                                                    error: function (error) {
                                                        console.error("error", error);
                                                        updateProgress(0);
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
                                            },
                                            error: function (error) {
                                                console.error("error", error);
                                                updateProgress(0);
                                                Toastify({
                                                    text: "Đăng nhập thất bại!",
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
                                    }
                                }, 3000)
                            })
                        })


                    }, 500);
                },
                error: function (error) {
                    console.error("error", error);
                },
            })
        }
    })

    $(document).ready(function () {
        // Click event to save token to cookies
        // $("#save-token").click(function () {
        //   var token = $("#token-input").val();
        //   if (token) {
        //     setCookie("bearerToken", token, 10); // Save token with a 10-second expiration
        //     alert("Token saved for 10 seconds!");

        //     // Set a timeout to check cookie after 10 seconds
        //     setTimeout(checkCookieAndReset, 10000); // 10,000 milliseconds = 10 seconds
        //   } else {
        //     alert("Please enter a token.");
        //   }
        // });

        // Click event to display the token from cookies
        $("#display-token").click(function () {
            var token = getCookie("bearerToken");
            if (token) {
                $("#token-display").text(token);
            } else {
                $("#token-display").text("No token found or token expired.");
            }
        });
    });
});

$(document).ready(function () {
    var cookieName = "bearerToken"; // Fixed cookie name
    function setCookie(name, value, seconds) {
        var expires = "";
        if (seconds) {
            var date = new Date();
            date.setTime(date.getTime() + seconds * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Set Bearer token as a cookie when button is clicked
    $("#setTokenBtn").click(function () {
        var token = $("#bearerToken").val();
        // Set the token as a cookie with a 30-minute expiration
        setCookie("bearerToken", token, 30);
        alert("Bearer token has been set!");
    });

    // Get Bearer token from the cookie when button is clicked
    $("#getTokenBtn").click(function () {
        var token = getCookie("bearerToken");
        if (token) {
            $("#tokenResult").text("Bearer Token: " + token);
        } else {
            $("#tokenResult").text("No Bearer token found.");
        }
    });
});
