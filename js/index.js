document.createElement("titlebar");
document.createElement("tabbar");
document.createElement("tb-label");
document.createElement("page");

// $(function () {
//     $("button").on("touchstart mousedown", function () {
//         $(this).addClass("active");
//         $("#test").text("Button pressed: " + $(this).text());
//     });
//     $("button").on("touchend touchcancel mouseup", function () {
//         $(this).removeClass("active");
//         $("#test").text("Button released: " + $(this).text());
//     });

//     $("#test").text("Ready to test button interactions.");
// });

// Prevent default touch actions on the document to avoid unwanted scrolling
// $(document).on("touchmove", function (e) {
//     if ($(e.target).closest(".content").length === 0) {
//         e.preventDefault(); // Prevent scrolling if not inside .content
//     }
// });

// $(document).on("touchmove", function (e) {
//     // var $el = $(e.target).closest(".content");

//     // if ($el.length === 0) {
//     //     // Not inside .content → block scroll
//     //     e.preventDefault();
//     // } else {
//     // Check if element is actually scrollable
//     var el = $el[0];
//     var isScrollable = el.scrollHeight > el.clientHeight;

//     if (!isScrollable) {
//         e.preventDefault(); // In .content but it's not scrollable
//     }
//     // Else: allow native scrolling
//     // }
// });
