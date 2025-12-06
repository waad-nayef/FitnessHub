let users = JSON.parse(localStorage.getItem("users")) || [];

//(Regex)
const nameRegex = /^[A-Za-z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const phoneRegex = /^07\d{8}$/;

// git date
function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

//Show error
function showError(input, message) {
  input.style.border = "2px solid red";

  let errorMsg = input.nextElementSibling;
  if (!errorMsg || !errorMsg.classList.contains("error-text")) {
    errorMsg = document.createElement("p");
    errorMsg.classList.add("error-text");
    errorMsg.style.color = "red";
    errorMsg.style.margin = "0";
    errorMsg.style.fontSize = "12px";
    input.insertAdjacentElement("afterend", errorMsg);
  }

  errorMsg.textContent = message;
}

// clear the error
function clearError(input) {
  input.style.border = "1px solid black";
  let errorMsg = input.nextElementSibling;
  if (errorMsg && errorMsg.classList.contains("error-text")) {
    errorMsg.remove();
  }
}

if (window.location.pathname.includes("sign-up.html")) {
  const form = document.querySelector(".sign-up");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("number");
  const passInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");

  // validation
  nameInput.addEventListener("input", () => {
    if (!nameRegex.test(nameInput.value)) {
      showError(nameInput, "Name must be at least 3 letters and only letters.");
    } else clearError(nameInput);
  });

  emailInput.addEventListener("input", () => {
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, "Invalid email format.");
    } else clearError(emailInput);
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneRegex.test(phoneInput.value)) {
      showError(phoneInput, "Phone must start with 07 and be 10 digits.");
    } else clearError(phoneInput);
  });

  passInput.addEventListener("input", () => {
    if (!passwordRegex.test(passInput.value)) {
      showError(
        passInput,
        "Password must include uppercase, numbers, symbol, 8+ chars."
      );
    } else clearError(passInput);
  });

  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passInput.value) {
      showError(confirmInput, "Passwords do not match.");
    } else clearError(confirmInput);
  });

  // Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Check all fields again
    if (!nameRegex.test(nameInput.value)) {
      showError(nameInput, "Name must be at least 3 letters.");
      valid = false;
    }
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, "Invalid email.");
      valid = false;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some((u) => u.email === email.value.trim());

    if (!phoneRegex.test(phoneInput.value)) {
      showError(phoneInput, "Phone must start with 07 and be numbers only.");
      valid = false;
    }
    if (!passwordRegex.test(passInput.value)) {
      showError(passInput, "Weak password.");
      valid = false;
    }
    if (confirmInput.value !== passInput.value) {
      showError(confirmInput, "Password does not match.");
      valid = false;
    }

    if (!valid) return;

    // Store user
    const newUser = {
      id: "u" + Date.now(),
      fullName: nameInput.value,
      email: emailInput.value,
      phoneNumber: phoneInput.value,
      password: passInput.value,
      isAdmin: false,
      createdAt: getTodayDate(),
      submittedForms: 0,
      averageScore: 0,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      title: "Success!",
      text: "Account created successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
  });
}

// Log in page
if (window.location.pathname.includes("login.html")) {
  const form = document.querySelector(".sign-up");

  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");

  emailInput.addEventListener("input", () => clearError(emailInput));
  passInput.addEventListener("input", () => clearError(passInput));

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let user = users.find(
      (u) => u.email === emailInput.value && u.password === passInput.value
    );

    if (!user) {
      showError(passInput, "Incorrect email or password.");
      return;
    }

    Swal.fire({
      title: "Welcome!",
      text: "Login successful!",
      icon: "success",
      confirmButtonText: "Continue",
    }).then(() => {
      if (user.isAdmin) {
        window.location.href = "../admin/dashboard.html";
      } else {
        window.location.href = "../user/userhome.html";
      }
    });
  });
}
