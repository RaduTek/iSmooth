$(function () {
    $.getScript("js/index.js");
    $.getScript("js/dynamic.js");
    $.getScript("js/animate.js");
    $.getScript("js/dialog.js");
    $.getScript("js/modal.js", function () {
        initModalHost();
    });
});
