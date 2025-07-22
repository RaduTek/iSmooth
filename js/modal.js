var modalOpenDuration = 500;
var modalHostInstance = null;
var modalOpenCount = 0;

function showModalHost() {
    if (!modalHostInstance) {
        modalHostInstance = $('<div class="modal-host"><div class="modal-backdrop" /></div>');
        $("body").append(modalHostInstance);
    }

    modalBackdrop = modalHostInstance.children(".modal-backdrop").first();
    animateClass(modalBackdrop, false, modalOpenDuration);
    modalHostInstance.addClass("open");
}

function hideModalHost() {
    if (!modalHostInstance) return;

    modalBackdrop = modalHostInstance.children(".modal-backdrop").first();
    animateClass(modalBackdrop, true, modalOpenDuration);

    setTimeout(function () {
        modalHostInstance.removeClass("open");
    }, modalOpenDuration);
}

function getModalSize(modal) {
    modal = $(modal);
    return {
        width: modal.outerWidth(),
        height: modal.outerHeight()
    };
}

function centerModal(modal) {
    modal = $(modal);
    var size = getModalSize(modal);
    var winWidth = $(window).width();
    var winHeight = $(window).height();

    var left = (winWidth - size.width) / 2;
    var top = (winHeight - size.height) / 2;

    modal.css({
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

function showModal(modal) {
    showModalHost();
    modal = $(modal);

    centerModal(modal);

    animateClass(modal, false, modalOpenDuration);

    modalOpenCount++;
    pageInit(modal);
}

function hideModal(modal) {
    modal = $(modal);

    animateClass(modal, true, modalOpenDuration);

    modalOpenCount--;
    if (modalOpenCount === 0) {
        hideModalHost();
    }
}
