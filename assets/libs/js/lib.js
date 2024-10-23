$(document).ready(function () {
    $("#fullpage").fullpage({
        licenseKey: "gplv3-license",
        autoScrolling: true,
        scrollHorizontally: true,
        menu: "#menu",
        anchors: [
            "banner",
            "rules",
            "instruction",
            "gameplay",
            "submissions",
            "product-informations",
            "brand-story",
        ],
        normalScrollElements: "#overlay",
        normalScrollElements: "#modal-result",
        scrollingSpeed: 1500,
        navigationPosition: "right",
        onLeave: function (origin, destination, direction) {
            var scrollPercentage =
                (destination.index / ($(".section").length - 1)) * 100;
            var translateYValue =
                scrollPercentage *
                (window.innerHeight / $("#background-video").height());
            $("#background-video").css(
                "transform",
                "translateY(-" + translateYValue + "%)"
            );
            if (origin.index === 2) {
                var video = $("#video-instruction").get(0);
                if (!video.paused) {
                    video.pause();
                }
            }
        },
        afterLoad: function (origin, destination, direction) {
            if (destination.index === 2) {
                var video = $("#video-instruction").get(0);
                if (video.paused) {
                    video.play();
                }
            }
        },

    });
    $.fn.fullpage.setAllowScrolling(true);

    $("#logo-home").click(function () {
        fullpage_api.moveTo("banner", 0);
    });
    $("#scroll-down").click(function () {
        if ($("#scroll-down").hasClass("scroll-up")) {
            fullpage_api.moveTo("banner", 0);
        } else {
            fullpage_api.moveSectionDown(2);
        }
    });
    $("#btn_join-now").click(function () {
        fullpage_api.moveTo("gameplay", 1);
    });

    $("#quick-control-left").click(function () {
        fullpage_api.moveTo("product-informations", 1);
    });

    $("#quick-control-right").click(function () {
        fullpage_api.moveTo("gameplay", 1);
    });
});

$(document).ready(function () {
    function updateTextBasedOnHash() {
        if (window.location.hash === "#brand-story") {
            $("#scroll-down p").text("⟵ Scroll up");
            $("#scroll-down").addClass("scroll-up");
        } else {
            $("#scroll-down p").text("Scroll Down ⟶");
            $("#scroll-down").removeClass("scroll-up");
        }
    }

    $(window).on("hashchange", function () {
        updateTextBasedOnHash();
    });
});

$(document).ready(function () {
    $(".section.purpose .slick-carousel").slick({
        arrows: true,
        dots: true,
        centerMode: true,
        centerPadding: "0",
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 1000,
        infinite: true,
        focusOnSelect: true,
        variableWidth: true,
        prevArrow:
            '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
        nextArrow:
            '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
    });

    // SUBMISSION
    $(".section.submissions .slick-carousel").slick({
        arrows: true,
        // dots: true,
        centerMode: true,
        centerPadding: "0",
        slidesToShow: 3,
        // autoplay: true,
        autoplaySpeed: 1000,
        infinite: true,
        focusOnSelect: true,
    });

    $(document).on("click", "#vote-btn", function () {
        var img = $(this);

        // Toggle between "Vote" and "Unvote" images
        if (
            img.attr("src") ===
            "https://cdn-icons-png.flaticon.com/512/2077/2077504.png"
        ) {
            img
                .attr(
                    "src",
                    "https://cdn-icons-png.flaticon.com/512/2077/2077422.png"
                )
                .attr("alt", "Unvote");
            // Perform any action for "Vote"
        } else {
            img
                .attr("src", "https://cdn-icons-png.flaticon.com/512/2077/2077504.png")
                .attr("alt", "Vote");
            // Perform any action for "Unvote"
        }
    });

    // INFORMATION PRODUCT
    $(".section.information .slick-carousel").slick({
        infinite: true, // Enables infinite scrolling
        slidesToShow: 5, // Show 5 slides at a time
        slidesToScroll: 1, // Scroll one slide at a time
        centerMode: true, // Enable center mode
        centerPadding: "1", // Padding around center slide
        arrows: true, // Enables navigation arrows
        autoplay: false, // Disable autoplay
        speed: 500,
    });

    $(".custom-pagination div").on("click", function () {
        var slideIndex = $(this).data("slide"); // Get the slide index from the clicked text
        $(".section.information .slick-carousel").slick("slickGoTo", slideIndex); // Move to the corresponding slide
    });

    // Update the active class on custom pagination based on the current slide
    $(".section.information .slick-carousel").on(
        "beforeChange",
        function (event, slick, currentSlide, nextSlide) {
            $(".custom-pagination div").removeClass("active"); // Remove active class from all
            $('.custom-pagination div[data-slide="' + nextSlide + '"]').addClass(
                "active"
            ); // Add active class to the current slide
        }
    );

    // Set the first slide as active on load
    $('.custom-pagination div[data-slide="0"]').addClass("active");

    $(".custom-prev").on("click", function () {
        $(".section.information .slick-carousel").slick("slickPrev");
    });

    $(".custom-next").on("click", function () {
        $(".section.information .slick-carousel").slick("slickNext");
    });
});
