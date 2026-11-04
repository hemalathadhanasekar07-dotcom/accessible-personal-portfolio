
"use strict";

// =========================================
// 1. SELECT CONTACT FORM ELEMENTS
// =========================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const formStatus = document.getElementById("form-status");

    // =========================================
    // 2. DISPLAY FIELD ERROR
    // =========================================

    function showError(input, message) {

        const errorElement = document.getElementById(
            input.id + "-error"
        );

        errorElement.textContent = message;

        input.setAttribute("aria-invalid", "true");
    }

    // =========================================
    // 3. CLEAR FIELD ERROR
    // =========================================

    function clearError(input) {

        const errorElement = document.getElementById(
            input.id + "-error"
        );

        errorElement.textContent = "";

        input.removeAttribute("aria-invalid");
    }

    // =========================================
    // 4. VALIDATE FORM
    // =========================================

    function validateForm() {

        const fields = [
            nameInput,
            emailInput,
            subjectInput,
            messageInput
        ];

        let firstInvalidField = null;

        fields.forEach(input => {

            clearError(input);

            const value = input.value.trim();

            if (value === "") {

                showError(
                    input,
                    "This field is required."
                );

                if (!firstInvalidField) {
                    firstInvalidField = input;
                }

            } else if (
                input.type === "email" &&
                !input.validity.valid
            ) {

                showError(
                    input,
                    "Please enter a valid email address."
                );

                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }

        });

        if (firstInvalidField) {

            firstInvalidField.focus();

            return false;
        }

        return true;
    }

    // =========================================
    // 5. CLEAR ERRORS WHEN USER EDITS
    // =========================================

    contactForm.addEventListener("input", function(event) {

        const input = event.target;

        if (input.matches("input, textarea")) {

            clearError(input);

            formStatus.textContent = "";
        }

    });

    // =========================================
    // 6. HANDLE FORM SUBMISSION
    // =========================================

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        formStatus.textContent = "";

        if (validateForm()) {

            formStatus.textContent =
                "Validation successful! Your details are ready. " +
                "This demonstration form is not connected to a " +
                "message service, so your message has not been sent.";

            contactForm.reset();

        }

    });

}
