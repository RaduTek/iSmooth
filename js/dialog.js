var dialogHost = null;
var dialogBackdrop = null;
var dialogElement = null;

function showDialogHost() {
    if (!dialogHost) {
        dialogHost = $('<div class="dialog-host"></div>');
        dialogBackdrop = $('<div class="dialog-backdrop" />').appendTo(dialogHost);
        $("body").append(dialogHost);
    }

    if (!iOSVersion || iOSVersion.major >= 6) animateClass(dialogBackdrop, false, 400);
    else dialogBackdrop.addClass("open");

    dialogHost.addClass("open");
}

function hideDialogHost() {
    if (!dialogHost) return;

    animateClass(dialogBackdrop, true, 400);
    setTimeout(function () {
        dialogHost.removeClass("open");
    }, 400);
}

function presetDialogButtons(buttons) {
    if (typeof buttons === "string") {
        var newButtons = [];
        switch (buttons) {
            case "ok":
                newButtons.push({
                    key: "ok",
                    text: "OK",
                    class: "primary"
                });
                break;
            case "okcancel":
                newButtons.push({
                    key: "cancel",
                    text: "Cancel",
                    class: "secondary"
                });
                newButtons.push({
                    key: "ok",
                    text: "OK",
                    class: "primary"
                });
                break;
            case "yesno":
                newButtons.push({
                    key: "no",
                    text: "No",
                    class: "secondary"
                });
                newButtons.push({
                    key: "yes",
                    text: "Yes",
                    class: "primary"
                });
                break;
        }
        return newButtons;
    }
    return buttons;
}

function dialogButtonContainer(buttonElements, vertical) {
    var container = $('<div class="dialog-buttons"></div>');
    if (vertical) {
        buttonElements.reverse();
        $.each(buttonElements, function (index, button) {
            var row = $("<div class='dialog-buttons-row'></div>").appendTo(container);
            var cell = $("<div class='dialog-buttons-item'></div>").appendTo(row);
            cell.append(button);
        });
    } else {
        var row = $("<div class='dialog-buttons-row'></div>").appendTo(container);
        $.each(buttonElements, function (index, button) {
            var cell = $("<div class='dialog-buttons-item'></div>").appendTo(row);
            cell.append(button);
        });
    }
    return container;
}

function showDialog(props) {
    if (dialogElement || !props) return;

    var dialog = $('<div class="dialog-box"></div>');
    dialogElement = dialog;

    function dismiss(value) {
        dialogElement = null;

        if (props.callback) {
            props.callback(value);
        }

        animateClass(dialog, true, 100);
        if (!dialogElement) {
            hideDialogHost();
        }
        setTimeout(function () {
            dialog.remove();
        }, 100);
    }

    if (props.title) {
        var title = $('<div class="dialog-title"></div>').text(props.title);
        dialog.append(title);
    }
    if (props.content) {
        var content = $('<div class="dialog-content"></div>').html(props.content);
        dialog.append(content);
    }

    props.buttons = presetDialogButtons(props.buttons || "ok");
    console.log(props.buttons);

    var buttonElements = [];
    $.each(props.buttons, function (index, button) {
        var btn = $('<button class="dialog-button"></button>')
            .attr("id", "dialog-button-" + (button.key || index))
            .text(button.text || "Button")
            .addClass(button.class || "")
            .on("click", function () {
                if (button.onClick) {
                    button.onClick();
                }
                dismiss(button.key);
            });
        buttonElements.push(btn);
    });

    dialog.append(dialogButtonContainer(buttonElements, props.buttonsVertical || false));

    showDialogHost();
    dialogHost.append(dialog);
    pageInit(dialog);

    animateClass(dialog, false, 600);

    return {
        props: props,
        dismiss: dismiss
    };
}
