
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
// =========================================
// 7. LIGHT / DARK THEME TOGGLE
// =========================================

// Initialize theme based on saved preference or system setting
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        const isDark = theme === 'dark';
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        const icon = toggle.querySelector('span');
        const text = toggle.querySelector('.theme-toggle-text');
        if (icon) icon.textContent = isDark ? '☀' : '☾';
        if (text) text.textContent = isDark ? 'Light mode' : 'Dark mode';
    }
}
initTheme();

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');
if (navToggle && navUl) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navUl.classList.toggle('active');
    });
}


if (themeToggle) {

    const themeIcon = themeToggle.querySelector("span");
    const themeText = themeToggle.querySelector(".theme-toggle-text");

    themeToggle.addEventListener("click", function () {

        const isDark = document.documentElement.dataset.theme !== "dark";

        document.documentElement.dataset.theme =
            isDark ? "dark" : "light";

        themeToggle.setAttribute("aria-pressed", String(isDark));

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        themeIcon.textContent = isDark ? "☀" : "☾";
        themeText.textContent = isDark ? "Light mode" : "Dark mode";

    });

}
