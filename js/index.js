function getiOSVersion() {
    var agent = navigator.userAgent;
    if (!/iP(hone|od|ad)/.test(agent)) return null;

    var match = agent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (!match) return null;

    var major = parseInt(match[1], 10);
    var minor = parseInt(match[2], 10);
    var patch = match[3] ? parseInt(match[3], 10) : 0;

    return {
        major: major,
        minor: minor,
        patch: patch
    };
}

iOSVersion = getiOSVersion();

function pageInit(page) {
    var buttons = $(page).find("button");

    buttons.each(function () {
        var btn = $(this);

        if (btn.data("active-event")) {
            return;
        }

        btn.on("touchstart mousedown", function () {
            btn.addClass("active");
        });

        btn.on("touchend touchcancel mouseup mouseleave", function () {
            btn.removeClass("active");
        });

        $(this).data("active-event", true);
    });
}

$(function () {
    $(".page").each(function () {
        pageInit(this);
    });
});

var loadingOverlayInstance = null;

function showLoading(message) {
    message = message || "Loading";

    if (loadingOverlayInstance) {
        $("#loadingOverlayText").text(message);
        return;
    }

    loadingOverlayInstance = $(
        '<div class="loading-overlay">' +
            '<div class="loading-box">' +
            '<div class="spinner"></div>' +
            '<div id="loadingOverlayText">' +
            message +
            "</div></div></div>"
    );

    $("body").append(loadingOverlayInstance);
}

function hideLoading() {
    if (!loadingOverlayInstance) return;
    loadingOverlayInstance.remove();
    loadingOverlayInstance = null;
}

function reloadWindow() {
    showLoading("Reloading Window");
    setTimeout(function () {
        location.reload();
    }, 500);
}

function animateClass(target, closing, duration) {
    target = $(target);
    var className = closing ? "close-anim" : "open-anim";

    if (!closing) {
        target.removeClass("open open-anim close-anim");
    }

    target.addClass(className);

    setTimeout(function () {
        if (!closing) {
            target.addClass("open");
        } else {
            target.removeClass("open");
        }
        target.removeClass(className);
    }, duration);
}
