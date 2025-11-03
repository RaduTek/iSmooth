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

function animateViewSwitch(viewGroup, fromView, toView, direction) {
    direction = direction || "from-right";
    viewGroup = $(viewGroup);
    fromView = $(fromView);
    toView = $(toView);

    viewGroup.removeClass("animate from-view to-view");

    fromView.removeClass("current to-view from-view");
    fromView.addClass("from-view");

    toView.addClass("to-view current");
    toView.removeClass("from-view");

    viewGroup.children(".view").each(function () {
        var v = $(this);
        if (!v.is(fromView) && !v.is(toView)) {
            v.removeClass("current from-view to-view");
        }
    });

    viewGroup.addClass("animate " + direction);

    setTimeout(function () {
        viewGroup.removeClass("animate " + direction);
    }, 500);
}
