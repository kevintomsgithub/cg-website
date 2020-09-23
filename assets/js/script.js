// Scroll to div on click
$("#faq").click(function() {
    $('html, body').animate({
        scrollTop: $("#faq-section").offset().top
    }, 2000);
});