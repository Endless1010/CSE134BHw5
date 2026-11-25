// Enhances form-with-js.html: specific validation messages, a character counter,
// and an error history. The form still works with plain HTML if this file fails.
const form = document.querySelector("form.contact-form");
const fields = [
  document.querySelector("#name"),
  document.querySelector("#email"),
  document.querySelector("#comments")
];
const fieldLabels = { name: "Name", email: "Email", comments: "Comments" };
const comments = document.querySelector("#comments");
const errorHeading = document.querySelector("#error-heading");
const charCount = document.querySelector("#char-count");
const lengthWarning = document.querySelector("#length-warning");
const warningThreshold = 100;

// Field name and error type only: never the user's name, email, or message text.
const form_errors = [];
// Messages currently shown, keyed by field id.
const shownErrors = {};
// Fields the user has typed in, so we only judge fields they have edited.
const edited = {};

function getErrorType(field) {
    if (field.validity.valueMissing) {
        return "valueMissing";
    }
    if (field.validity.typeMismatch) {
        return "typeMismatch";
    }
    // tooShort is only set by the browser after user edits, so also check by hand.
    if (field.validity.tooShort ||
        (field.minLength > 0 && field.value.length > 0 && field.value.length < field.minLength)) {
        return "tooShort";
    }
    return null;
}

function getMessage(field, type) {
    const label = fieldLabels[field.id];
    if (type === "valueMissing") {
        return label + ": this field is required. Enter your " + (field.id === "email" ? "email address." : field.id === "name" ? "name." : "comments.");
    }
    if (type === "typeMismatch") {
        return label + ": this is not a valid email address. Use the format name@example.com.";
    }
    if (type === "tooShort") {
        return label + ": write at least " + field.minLength + " characters. You have typed " + field.value.length + ".";
    }
    return label + ": " + field.validationMessage;
}

function renderErrors() {
    let count = 0;
    fields.forEach(function (field) {
        const item = document.querySelector("#error-" + field.id);
        const message = shownErrors[field.id];
        item.textContent = message || "";
        item.hidden = !message;
        field.setAttribute("aria-invalid", message ? "true" : "false");
        if (message) {
            count++;
        }
    });
    errorHeading.hidden = count === 0;
}

// Re-evaluate one field. Clears the old custom message first so a corrected
// field can submit, then sets a specific one if it is still invalid.
function checkField(field, show) {
    field.setCustomValidity("");
    const type = getErrorType(field);
    if (type) {
        const message = getMessage(field, type);
        field.setCustomValidity(message);
        if (show) {
            shownErrors[field.id] = message;
        }
    } else {
        delete shownErrors[field.id];
    }
    renderErrors();
    return type;
}

function updateCharCount() {
    const limit = comments.maxLength;
    const remaining = limit - comments.value.length;
    charCount.textContent = "Comments: " + remaining.toLocaleString() + " characters remaining.";
    lengthWarning.classList.remove("is-warning", "is-limit");
    if (remaining <= 0) {
        lengthWarning.textContent = "Character limit reached. You can't add more text.";
        lengthWarning.classList.add("is-limit");
    } else if (remaining <= warningThreshold) {
        lengthWarning.textContent = "Approaching the limit: only " + remaining + " characters left.";
        lengthWarning.classList.add("is-warning");
    } else {
        lengthWarning.textContent = "";
    }
}

fields.forEach(function (field) {
    field.addEventListener("input", function () {
        edited[field.id] = true;
        // Update an error already on screen; otherwise just keep the message current.
        checkField(field, field.id in shownErrors);
    });
    field.addEventListener("blur", function () {
        if (edited[field.id]) {
            checkField(field, true);
        }
    });
});

comments.addEventListener("input", updateCharCount);

// "invalid" does not bubble, so listen in the capture phase. It fires once per
// invalid field on each failed submission, which is exactly one history entry.
// We never call checkValidity() or reportValidity(), so nothing else triggers it.
form.addEventListener("invalid", function (event) {
    const field = event.target;
    const type = checkField(field, true);
    if (!type) {
        return;
    }
    form_errors.push({
        field: field.id,
        error: type,
        message: getMessage(field, type),
        time: new Date().toISOString()
    });
}, true);

// Only runs when the form is valid: attach the history to the request.
form.addEventListener("submit", function () {
    let history = form.querySelector('input[name="form-errors"]');
    if (!history) {
        history = document.createElement("input");
        history.type = "hidden";
        history.name = "form-errors";
        form.appendChild(history);
    }
    history.value = JSON.stringify(form_errors);
});

// Everything is wired up: reveal the JavaScript-only parts.
document.documentElement.classList.add("js");
document.querySelectorAll("[data-js-only]").forEach(function (element) {
    element.hidden = false;
});
updateCharCount();
