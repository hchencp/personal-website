// form.mjs

function isValidEmail(stringToTest) {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
  // Regex from https://colinhacks.com/essays/reasonable-email-regex
  return emailRegex.test(stringToTest);
}

function clearEmailError(emailInput) {
  emailInput.removeAttribute("aria-invalid");
  const describedBy = emailInput.getAttribute("aria-describedby");
  if (describedBy) {
    const el = document.getElementById(describedBy);
    if (el) el.remove();
    emailInput.removeAttribute("aria-describedby");
  }
}

function clearCheckboxError(checkboxes) {
  for (const cb of checkboxes) {
    cb.removeAttribute("aria-invalid");
    cb.removeAttribute("aria-describedby");
  }
  const old = document.getElementById("role-error");
  if (old) old.remove();
}

function showEmailError(emailInput) {
  const errorId = "email-error";

  // remove old error if any
  const old = document.getElementById(errorId);
  if (old) old.remove();

  const p = document.createElement("p");
  p.id = errorId;
  p.className = "form-error";
  p.textContent = "Please enter a valid email address.";

  emailInput.setAttribute("aria-invalid", "true");
  emailInput.setAttribute("aria-describedby", errorId);

  emailInput.insertAdjacentElement("afterend", p);
}

function showCheckboxError(fieldset, checkboxes) {
  const errorId = "role-error";

  const p = document.createElement("p");
  p.id = errorId;
  p.className = "form-error";
  p.textContent = "Please select at least one option.";

  fieldset.insertAdjacentElement("afterend", p);

  for (const cb of checkboxes) {
    cb.setAttribute("aria-invalid", "true");
    cb.setAttribute("aria-describedby", errorId);
  }
}

const form = document.getElementById("contact-form");
if (form) {
  const emailInput = form.querySelector("#contact-email");
  const roleCheckboxes = form.querySelectorAll(
    'input[type="checkbox"][name="role"]',
  );
  const roleFieldset = form.querySelector("fieldset");

  form.addEventListener("submit", (e) => {
    // Clear previous errors each submit (good practice)
    clearEmailError(emailInput);
    clearCheckboxError(roleCheckboxes);

    let valid = true;

    // Email validation
    const emailValue = emailInput.value.trim();
    const emailOk = emailValue.length > 0 && isValidEmail(emailValue);
    if (!emailOk) {
      valid = false;
      showEmailError(emailInput);
    }

    // Checkbox group validation
    let anyChecked = false;
    for (const cb of roleCheckboxes) {
      if (cb.checked) {
        anyChecked = true;
        break;
      }
    }
    if (!anyChecked) {
      valid = false;
      showCheckboxError(roleFieldset, roleCheckboxes);
    }

    if (!valid) {
      e.preventDefault();
      if (!emailOk) emailInput.focus();
      else roleCheckboxes[0].focus();
    }
    // if valid: do NOT preventDefault() -> page reload (submission)
  });
}
