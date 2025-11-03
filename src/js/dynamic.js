var contexts = {};
var currentContext = null;

function registerContext(element) {
    element = $(element);
    if (!element || !element.attr("id")) return;

    var contextId = element.attr("id");
    contexts[contextId] = {
        element: element,
        currentPage: null
    };

    if (!currentContext) {
        currentContext = contextId;
    }
}

function loadPage(contextId, url) {
    var context = contexts[contextId];
    if (!context) return;

    context.currentPage = url;

    var tempContext = $("<div class='temp-context'></div>").load(url, "", function (response, status, xhr) {
        if (status === "success") {
            var page = tempContext.find(".page").first();
            if (page.length) {
                page.attr("data-page", url);
                context.element.append(page);
            } else {
                console.error("No page found in the loaded content.");
            }
        } else {
            console.error("Failed to load page:", xhr.status, xhr.statusText);
        }
    });

    // console.log(tempContext);
    // context.element.load(url);
}

function handleNavigate(event) {
    var target = $(event.target);

    var contextId = target.closest(".context").attr("id");
    var pageUrl = target.attr("data-page");
}
