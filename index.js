const form = document.querySelector(".contact-form");
const successModal = document.getElementById("success");
const progressFill = successModal.querySelector(".progress-fill");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let hasError = false;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // --- TEXT + TEXTAREA ---
  const fields = form.querySelectorAll(
    "input[type='text'], input[type='email'], textarea",
  );

  fields.forEach((field) => {
    const error = getErrorEl(field);
    if (field.value.trim() === "") {
      showError(field, error);
      hasError = true;
    } else {
      hideError(field, error);
    }
  });

  // --- EMAIL ---
  const emailField = form.querySelector("#email");
  if (data.email && !validateEmail(data.email)) {
    showError(emailField, getErrorEl(emailField));
    hasError = true;
  }

  // --- RADIO (QUERY) ---
  const radios = form.querySelectorAll('input[name="query"]');
  const queryError = document.getElementById("query-error");

  if (!data.query) {
    queryError.classList.add("show");
    radios.forEach((r) => r.setAttribute("aria-invalid", "true"));
    hasError = true;
  } else {
    queryError.classList.remove("show");
    radios.forEach((r) => r.setAttribute("aria-invalid", "false"));
  }

  // --- CHECKBOX ---
  const checkbox = form.querySelector("#consent");
  if (!data.consent) {
    showError(checkbox, getErrorEl(checkbox));
    hasError = true;
  } else {
    hideError(checkbox, getErrorEl(checkbox));
  }

  // --- SUCCESS ---
  if (!hasError) {
    openModal();
    form.reset();
  }
});

// --- HELPERS ---
function getErrorEl(field) {
  return document.getElementById(field.getAttribute("aria-describedby"));
}

function showError(field, errorEl) {
  if (!errorEl) return;

  errorEl.classList.add("show");
  field.setAttribute("aria-invalid", "true");
  field.classList.add("invalid");
}

function hideError(field, errorEl) {
  if (!errorEl) return;

  errorEl.classList.remove("show");
  field.setAttribute("aria-invalid", "false");
  field.classList.remove("invalid");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

function openModal() {
  successModal.showModal();

  // Reset progress
  progressFill.style.width = "0%";

  // Animate progress bar
  requestAnimationFrame(() => {
    progressFill.style.width = "100%";
  });

  // Close after 3 second
  const timer = setTimeout(() => {
    closeModal();
  }, 3000);

  // Close on click outside modal content
  successModal.addEventListener(
    "click",
    (e) => {
      if (e.target === successModal) {
        clearTimeout(timer);
        closeModal();
      }
    },
    { once: true },
  );
}

function closeModal() {
  successModal.close();
}
