var dialogHost = null;
var dialogBackdrop = null;
var dialogElement = null;

function dialogHostHandleScroll(event) {
    event.preventDefault();
    event.stopPropagation();
}

function showDialogHost() {
    if (!dialogHost) {
        dialogHost = $('<div class="dialog-host"></div>');
        dialogBackdrop = $('<div class="dialog-backdrop" />').appendTo(dialogHost);
        $("body").append(dialogHost);
    }

    if (!iOSVersion || iOSVersion.major >= 6) animateClass(dialogBackdrop, false, 700);
    else dialogBackdrop.addClass("open");

    dialogHost.addClass("open");

    $(document).on("touchmove", dialogHostHandleScroll);
    $(document).on("scroll", dialogHostHandleScroll);
}

function hideDialogHost() {
    if (!dialogHost) return;

    animateClass(dialogBackdrop, true, 400);
    setTimeout(function () {
        if (!dialogElement) {
            $(document).off("touchmove", dialogHostHandleScroll);
            $(document).off("scroll", dialogHostHandleScroll);
            dialogHost.removeClass("open");
        } else {
            dialogHost.addClass("open");
        }
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
    if (typeof props === "string") {
        props = { content: props };
    }

    var dialog = $('<div class="dialog-box"></div>');
    dialogElement = dialog;

    var dismissed = false;
    function dismiss(value) {
        if (dismissed) return;
        dismissed = true;
        dialogElement = null;

        var fields = {};
        if (props.fields) {
            $.each(props.fields, function (index, field) {
                var input = $("#dialog-field-" + (field.key || index));
                fields[field.key || index] = input.val();
            });
        }

        if (props.callback) {
            if (props.callback(value, fields)) {
                dialog.remove();
                return;
            }
        }

        hideDialogHost();
        animateClass(dialog, true, 300);
        setTimeout(function () {
            dialog.remove();
        }, 300);
    }

    function centerDialog() {
        centerElement(dialog);
    }

    var title = null;
    if (props.title) {
        title = $('<div class="dialog-title"></div>').text(props.title);
        dialog.append(title);
    }
    var content = null;
    if (props.content) {
        content = $('<div class="dialog-content"></div>').html(props.content);
        dialog.append(content);
    }

    if (props.fields) {
        var fieldsContainer = $('<div class="dialog-fields"></div>');
        $.each(props.fields, function (index, field) {
            var fieldElement = $('<div class="dialog-field"></div>');
            var input = $('<input type="' + (field.type || "text") + '" />')
                .attr("id", "dialog-field-" + (field.key || index))
                .attr("placeholder", field.placeholder || "")
                .addClass(field.class || "")
                .val(field.value || "");

            fieldsContainer.append(fieldElement.append(input));
        });
        dialog.append(fieldsContainer);
    }

    props.buttons = presetDialogButtons(props.buttons || "ok");

    var buttonElements = [];
    $.each(props.buttons, function (index, button) {
        var btn = $('<button class="dialog-button"></button>')
            .attr("id", "dialog-button-" + (button.key || index))
            .text(button.text || "Button")
            .addClass(button.class || "")
            .on("touchend mouseup", function () {
                if (button.onClick) {
                    button.onClick();
                }
                dismiss(button.key || index);
            });
        buttonElements.push(btn);
    });

    dialog.append(dialogButtonContainer(buttonElements, props.buttonsVertical || false));

    showDialogHost();
    dialogHost.append(dialog);
    centerDialog();

    $(document).on("resize", centerDialog);

    animateClass(dialog, false, 600);

    return {
        props: props,
        dismiss: dismiss,
        title: title,
        content: content,
        center: centerDialog
    };
}
