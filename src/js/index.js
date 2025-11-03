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

function reloadWindow() {
    showLoading("Reloading Window");
    setTimeout(function () {
        location.reload();
    }, 500);
}

function getElementSize(element) {
    element = $(element);
    return {
        width: element.outerWidth(),
        height: element.outerHeight()
    };
}

function centerElement(element) {
    element = $(element);
    var size = getElementSize(element);
    var winWidth = $(window).width();
    var winHeight = $(window).height();

    var left = (winWidth - size.width) / 2;
    var top = (winHeight - size.height) / 2;

    element.css({
        position: "fixed",
        left: left + "px",
        top: top + "px"
    });

    return {
        left: left,
        top: top,
        width: size.width,
        height: size.height
    };
}

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

/*! iNoBounce - v0.2.0
 * https://github.com/lazd/iNoBounce/
 * Copyright (c) 2013 Larry Davis <lazdnet@gmail.com>; Licensed BSD */
(function (global) {
    // Stores the Y position where the touch started
    var startY = 0;

    // Store enabled status
    var enabled = false;

    var supportsPassiveOption = false;
    try {
        var opts = Object.defineProperty({}, "passive", {
            get: function () {
                supportsPassiveOption = true;
            }
        });
        window.addEventListener("test", null, opts);
    } catch (e) {}

    var handleTouchmove = function (evt) {
        // Get the element that was scrolled upon
        var el = evt.target;

        // Allow zooming
        var zoom = window.innerWidth / window.document.documentElement.clientWidth;
        if (evt.touches.length > 1 || zoom !== 1) {
            return;
        }

        // Check all parent elements for scrollability
        while (el !== document.body && el !== document) {
            // Get some style properties
            var style = window.getComputedStyle(el);

            if (!style) {
                // If we've encountered an element we can't compute the style for, get out
                break;
            }

            // Ignore range input element
            if (el.nodeName === "INPUT" && el.getAttribute("type") === "range") {
                return;
            }

            var scrolling = style.getPropertyValue("-webkit-overflow-scrolling");
            var overflowY = style.getPropertyValue("overflow-y");
            var height = parseInt(style.getPropertyValue("height"), 10);

            // Determine if the element should scroll
            var isScrollable = scrolling === "touch" && (overflowY === "auto" || overflowY === "scroll");
            var canScroll = el.scrollHeight > el.offsetHeight;

            if (isScrollable && canScroll) {
                // Get the current Y position of the touch
                var curY = evt.touches ? evt.touches[0].screenY : evt.screenY;

                // Determine if the user is trying to scroll past the top or bottom
                // In this case, the window will bounce, so we have to prevent scrolling completely
                var isAtTop = startY <= curY && el.scrollTop === 0;
                var isAtBottom = startY >= curY && el.scrollHeight - el.scrollTop === height;

                // Stop a bounce bug when at the bottom or top of the scrollable element
                if (isAtTop || isAtBottom) {
                    evt.preventDefault();
                }

                // No need to continue up the DOM, we've done our job
                return;
            }

            // Test the next parent
            el = el.parentNode;
        }

        // Stop the bouncing -- no parents are scrollable
        evt.preventDefault();
    };

    var handleTouchstart = function (evt) {
        // Store the first Y position of the touch
        startY = evt.touches ? evt.touches[0].screenY : evt.screenY;
    };

    var enable = function () {
        // Listen to a couple key touch events
        window.addEventListener("touchstart", handleTouchstart, supportsPassiveOption ? { passive: false } : false);
        window.addEventListener("touchmove", handleTouchmove, supportsPassiveOption ? { passive: false } : false);
        enabled = true;
    };

    var disable = function () {
        // Stop listening
        window.removeEventListener("touchstart", handleTouchstart, false);
        window.removeEventListener("touchmove", handleTouchmove, false);
        enabled = false;
    };

    var isEnabled = function () {
        return enabled;
    };

    // Enable by default if the browser supports -webkit-overflow-scrolling
    // Test this by setting the property with JavaScript on an element that exists in the DOM
    // Then, see if the property is reflected in the computed style
    var testDiv = document.createElement("div");
    document.documentElement.appendChild(testDiv);
    testDiv.style.WebkitOverflowScrolling = "touch";
    var isScrollSupported =
        "getComputedStyle" in window && window.getComputedStyle(testDiv)["-webkit-overflow-scrolling"] === "touch";
    document.documentElement.removeChild(testDiv);

    if (isScrollSupported) {
        enable();
    }

    // A module to support enabling/disabling iNoBounce
    var iNoBounce = {
        enable: enable,
        disable: disable,
        isEnabled: isEnabled,
        isScrollSupported: isScrollSupported
    };

    if (typeof module !== "undefined" && module.exports) {
        // Node.js Support
        module.exports = iNoBounce;
    }
    if (typeof global.define === "function") {
        // AMD Support
        (function (define) {
            define("iNoBounce", [], function () {
                return iNoBounce;
            });
        })(global.define);
    } else {
        // Browser support
        global.iNoBounce = iNoBounce;
    }
})(this);

var scrollStartPoint = null;

function scrollStart(event) {
    if (event.touches && event.touches.length > 0) {
        scrollStartPoint = {
            x: event.touches[0].pageX,
            y: event.touches[0].pageY
        };
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        scrollStartPoint = {
            x: event.changedTouches[0].pageX,
            y: event.changedTouches[0].pageY
        };
    } else {
        scrollStartPoint = null;
    }
}

function scrollMove(event) {}

$(function () {
    $(document).on("touchstart", function () {});
    // $(document).on("touchmove", function (event) {
    //     event.preventDefault();
    // });

    // new ScrollFix(".page");
    // $(".content").on("touchmove", function (event) {
    //     var el = this;
    //     var isOverflowing = el.scrollHeight > el.clientHeight;

    //     if (!isOverflowing) {
    //         event.preventDefault();
    //     } else {
    //         event.stopPropagation();
    //     }
    // });
});
