function truncateToLastChars(text, endCharsLength) {
    if (text.length > endCharsLength) {
        const endChars = text.slice(-endCharsLength);
        return "..." + endChars;
    }
    return text;
}

$(document).ready(function () {
    var $inputImage = $("#uploadImage");
    var $image = $("#image");
    var $cropButton = $("#cropButton");
    var $croppedImage = $("#croppedImage");
    var $croppedContainer = $("#croppedContainer");
    var $openModalButton = $("#openModalButton");
    var $cropperModal = $("#overlay");
    var $removeImageButton = $("#removeImageButton");
    var $uploadImageButton = $("#uploadImageButton");
    var $filename = $("#file-name");
    var cropper;
    var croppedBlob;

    let progressBar = $(".progress");
    let percentageText = $(".percentage");
    let postsContainer = $(".posts-container");
    let percentage = 0;

    function updateProgress(progress) {
        percentage = progress;
        progressBar.css("width", percentage + "%");
        percentageText.text(percentage + "%");
    }

    $inputImage.change(function (event) {
        var files = event.target.files;
        var reader;

        if (files && files.length > 0) {
            reader = new FileReader();
            reader.onload = function (e) {
                $image.attr("src", e.target.result);
                const tempImage = new Image();
                tempImage.src = e.target.result;
                $(tempImage).on("load", function () {
                    const imgWidth = tempImage.naturalWidth;
                    const imgHeight = tempImage.naturalHeight;
                    if (imgWidth > 800 || imgHeight > 800) {
                        $cropperModal.show();
                        $(".navbar-wrapper").css("z-index", 0);
                        $(".quick-control-left").css("z-index", 0);
                        $(".quick-control-right").css("z-index", 0);
                        if (cropper) {
                            cropper.destroy();
                        }

                        cropper = new Cropper($image[0], {
                            viewMode: 1,
                            autoCropArea: 1,
                            dragMode: "move",
                            cropBoxResizable: false, // Disable resizing
                            cropBoxMovable: false, // Disable moving the crop box
                            aspectRatio: 1, // Maintain square aspect ratio
                            data: {
                                // Set fixed crop box size
                                width: 1024,
                                height: 1024,
                            },
                            minCropBoxWidth: 1024, // Minimum crop box width
                            minCropBoxHeight: 1024, // Minimum crop box height
                        });
                    } else {
                        alert(
                            "Image size must be larger than 500px in either width or height."
                        );

                        $cropButton.prop("disabled", true);
                        $cropArea.hide();

                        if (cropper) {
                            cropper.destroy();
                            cropper = null;
                        }
                    }
                });
            };
            reader.readAsDataURL(files[0]);
        }
    });

    $("#cropButton").click(function () {
        if (cropper) {
            var canvas = cropper.getCroppedCanvas({
                width: 1024,
                height: 1024,
            });

            canvas.toBlob(function (blob) {
                croppedBlob = blob;
                var croppedImageURL = URL.createObjectURL(blob);
                $croppedImage.attr("src", croppedImageURL);
                $croppedContainer.show();
                $cropperModal.hide();
                $openModalButton.show();
                $removeImageButton.show();
                var inputText = $inputImage.val();
                var position = 12;
                var substring = inputText.substring(position);
                const endCharsLength = 10;
                const truncatedText = truncateToLastChars(substring, endCharsLength);

                $("#file-name").html(truncatedText);
                $(".quick-control-left").css("z-index", "");
                $(".quick-control-right").css("z-index", "");
                $(".navbar-wrapper").css("z-index", 70);
                $uploadImageButton.removeAttr("disabled");
                $(".file-upload-label").hide();
            });
        }
    });

    // Handle the reset button click
    $("#resetButton").click(function () {
        if (cropper) {
            cropper.reset();
        }
    });

    // Close the modal when the close button is clicked
    $("#closeButton").click(function () {
        $cropperModal.hide();
        $inputImage.val("");
        $(".navbar-wrapper").css("z-index", 70);
    });

    // Reopen the modal to crop again
    $openModalButton.click(function () {
        $cropperModal.show();
    });

    $removeImageButton.click(function () {
        $croppedImage.attr("src", "");
        $croppedContainer.hide();
        $openModalButton.hide();
        $inputImage.val("");
        cropper.destroy();
        $removeImageButton.hide();
        $("#file-name").text("No file chosen");
        $(".file-upload-label").show();
    });

    let formValue = new FormData();
    formValue.append("Procedure", "Ai_AuthenticationCheck");
    formValue.append(
        "Parameters",
        JSON.stringify({
            UserId: localStorage.getItem("user"),
        })
    );
    formValue.append("ProcedureCallback", "Ai_AuthenticationCallback");

    // Handle the upload image button click
    $uploadImageButton.click(function () {
        if (!croppedBlob) {
            Toastify({
                text: "Vui lòng tải lên file",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();
            $uploadImageButton.removeAttr("disabled");
            $uploadImageButton.css("cursor", "pointer");
        } else {
            $(".avatar-ai .loading-container").show();
            $(".avatar-ai-img").hide();
            const userCkeck = localStorage.getItem("update")
            if (!userCkeck) {
                Toastify({
                    text: "Vui lòng thực hiện bước 1",
                    duration: 3000, // 3 seconds
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, red, red)",
                    },
                }).showToast();
                $(".avatar-ai .loading-container").hide();
            } else {
                if (croppedBlob) {
                    updateProgress(0);
                    $uploadImageButton.attr("disabled", "disabled");
                    $uploadImageButton.css("cursor", "wait");
                    var formData = new FormData();
                    formData.append("Procedure", "Ai_TokenCheck")
                    formData.append(
                        "Parameters",
                        JSON.stringify({
                            UserId: localStorage.getItem("user"),
                            UserAiTokenValue: localStorage.getItem("bearer"),
                        })
                    );
                    formData.append("ProcedureCallback", "Ai_TokenCallBack")
                    formData.append("Image", croppedBlob);
                    formData.append("Prompt", "The face on center image")
                    formData.append("Style", "anime")
                    $.ajax({
                        url: `https://proxy.advietnam.vn/ai-generate/image-to-image`,
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("bearer")}`);
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

                            updateProgress(25);
                            setTimeout(function () {
                                updateProgress(50);
                            }, 2000);
                            setTimeout(function () {
                                updateProgress(75);
                            }, 3000);

                            return xhr;
                        },
                        success: function (data, textStatus, xhr) {
                            updateProgress(100);
                            const imageData = JSON.parse(data)
                            setTimeout(function () {
                                $(".avatar-ai .loading-container").hide();
                                $(".avatar-ai-img").attr(
                                    "src",
                                    `https://proxy.advietnam.vn/ai/${imageData.Objects[0].UserAiResponse}`
                                );
                                $(".avatar-ai-img").show();
                                $uploadImageButton.attr("disabled", "disabled");
                                $uploadImageButton.css("cursor", "not-allowed");
                                $("#create-lipstick").removeAttr("disabled");
                            }, 500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert("Image upload failed: " + textStatus);
                        },
                    });
                }
            }
        }
    });
});
