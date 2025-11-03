var modalOpenDuration = 500;
var modalHostInstance = null;
var modalOpenCount = 0;

function initModalHost() {
    if (modalHostInstance) return;

    var existingHost = $("body > .modal-host").first();
    if (existingHost.length) {
        modalHostInstance = existingHost;
        return;
    }

    modalHostInstance = $('<div class="modal-host"><div class="modal-backdrop" /></div>');
    $("body").append(modalHostInstance);
}

function showModalHost() {
    if (!modalHostInstance) {
        initModalHost();
    }

    modalBackdrop = modalHostInstance.children(".modal-backdrop").first();

    if (!iOSVersion || iOSVersion.major >= 6) animateClass(modalBackdrop, false, modalOpenDuration);
    else modalBackdrop.addClass("open");

    modalHostInstance.addClass("open");
}

function hideModalHost() {
    if (!modalHostInstance) return;

    modalBackdrop = modalHostInstance.children(".modal-backdrop").first();
    if (!iOSVersion || iOSVersion.major >= 6) animateClass(modalBackdrop, true, modalOpenDuration);

    setTimeout(function () {
        modalHostInstance.removeClass("open");
    }, modalOpenDuration);
}

function showModal(modal) {
    showModalHost();
    modal = $(modal);

    centerElement(modal);

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
