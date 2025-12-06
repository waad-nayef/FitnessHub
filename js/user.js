const USERS_KEY = "users";
const FORMS_KEY = "forms";
const CURRENT_USER_KEY = "currentUser";
const SUBMISSIONS_KEY = "submissions";

// ===== GET CURRENT USER =====
function getCurrentUser() {
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  return users.find((u) => u.id === currentUserId);
}

// ===== USERPAGE FUNCTIONALITY =====
function loadUserPage() {
  const currentUser = getCurrentUser();
  const forms = JSON.parse(localStorage.getItem(FORMS_KEY)) || [];
  const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];

  const userSubmissions = submissions.filter(
    (sub) => sub.userId === currentUser.id
  );

  // Load Available Forms
  const availableFormsContainer = document.querySelector(
    ".available-forms-card"
  );
  if (availableFormsContainer) {
    availableFormsContainer.innerHTML = "";

    forms.forEach((form) => {
      const formCard = document.createElement("div");
      formCard.className = "card";
      formCard.style.cssText =
        "background-color: var(--color-card-bg-transparent) !important;";

      const formSubmissionsCount = userSubmissions.filter(
        (sub) => sub.formId === form.formId
      ).length;

      formCard.innerHTML = `
        <h5>${form.title || "Form Title"}</h5>
        <p>Date: ${form.createdAt || "N/A"}</p>
        <p>Number of submissions: ${formSubmissionsCount}</p>
        <p>Mark: ${form.maxScore || "0"}%</p>
        <input
          type="button"
          value="Start"
          class="btn-primary form-card-btn"
          data-form-id="${form.formId}"
        />
      `;

      availableFormsContainer.appendChild(formCard);
    });

    // Add event listeners
    document.querySelectorAll(".form-card-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const formId = e.target.getAttribute("data-form-id");
        localStorage.setItem("selectedFormId", formId);
        window.location.href = "formsubmission.html";
      });
    });
  }

  loadPreviousSubmissions(userSubmissions, forms);
}

function loadPreviousSubmissions(userSubmissions, forms) {
  const submittedFormsNumber = document.querySelector(
    ".submitted-forms-number"
  );
  const avrScorePercent = document.querySelector(".avr-score-percent");
  const formsScoreContainer = document.querySelector(".forms-score");

  if (submittedFormsNumber) {
    submittedFormsNumber.textContent = userSubmissions.length;
  }

  if (userSubmissions.length > 0 && avrScorePercent) {
    const totalScore = userSubmissions.reduce(
      (sum, sub) => sum + (sub.score || 0),
      0
    );
    const avgScore = Math.round(totalScore / userSubmissions.length);
    avrScorePercent.textContent = avgScore;
  }

  if (formsScoreContainer) {
    formsScoreContainer.innerHTML = "";

    userSubmissions.forEach((submission) => {
      const form = forms.find((f) => f.formId === submission.formId);
      const scoreDiv = document.createElement("div");
      scoreDiv.className = "form-score";
      scoreDiv.innerHTML = `
        <span>${form?.title || "Unknown Form"}</span>
        <span>Score: <span class="submitted-forms-score">${submission.score || 0
        }%</span></span>
      `;
      formsScoreContainer.appendChild(scoreDiv);
    });
  }
}

// ===== USERINFO FUNCTIONALITY =====
function loadUserInfo() {
  const currentUser = getCurrentUser();

  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const editForm = document.getElementById("editProfileForm");
  const cancelBtn = document.getElementById("cancelBtn");

  if (profileName) profileName.textContent = currentUser.fullName;
  if (profileEmail) profileEmail.textContent = currentUser.email;
  if (fullNameInput) fullNameInput.value = currentUser.fullName;
  if (emailInput) emailInput.value = currentUser.email;
  if (phoneInput) phoneInput.value = currentUser.phoneNumber || "";

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "userpage.html";
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!fullNameInput.value || !emailInput.value) {
        alert("Please fill in required fields");
        return;
      }

      if (
        passwordInput.value &&
        passwordInput.value !== confirmPasswordInput.value
      ) {
        alert("Passwords do not match");
        return;
      }

      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);

      if (userIndex !== -1) {
        users[userIndex].fullName = fullNameInput.value;
        users[userIndex].email = emailInput.value;
        users[userIndex].phoneNumber = phoneInput.value;

        if (passwordInput.value) {
          users[userIndex].password = passwordInput.value;
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "userpage.html";
        });
      }
    });
  }
}

// ===== FORM SUBMISSION FUNCTIONALITY =====
function loadFormSubmission() {
  const currentUser = getCurrentUser();
  const selectedFormId = localStorage.getItem("selectedFormId");
  const forms = JSON.parse(localStorage.getItem(FORMS_KEY)) || [];
  const selectedForm = forms.find((f) => f.formId === selectedFormId);

  if (!selectedForm) {
    alert("Form not found");
    window.location.href = "userpage.html";
    return;
  }

  const formTitle = document.querySelector(".user-submission h2");
  if (formTitle) {
    formTitle.textContent = selectedForm.title;
  }

  const submitBtn = document.querySelector(".submit-form-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const answers = collectFormAnswers();
      const score = Math.floor(Math.random() * 100) + 1;

      const submissions =
        JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];
      submissions.push({
        submissionId: "sub" + Date.now(),
        formId: selectedFormId,
        userId: currentUser.id,
        answers: answers,
        score: score,
        submittedAt: getTodayDate(),
      });

      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));

      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex].submittedForms =
          (users[userIndex].submittedForms || 0) + 1;
        users[userIndex].averageScore = score;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      Swal.fire({
        title: "Success!",
        text: `Form submitted! Score: ${score}%`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "userpage.html";
      });
    });
  }
}

function collectFormAnswers() {
  const answers = {};

  document.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
    answers[input.name] = input.value;
  });

  document.querySelectorAll('input[type="text"]').forEach((input) => {
    if (input.value) answers[input.id] = input.value;
  });

  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((input) => {
      answers[input.id] = true;
    });

  return answers;
}

// ===== GET TODAY DATE =====
function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("userpage.html")) {
    loadUserPage();
  } else if (window.location.pathname.includes("userinfo.html")) {
    loadUserInfo();
  } else if (window.location.pathname.includes("formsubmission.html")) {
    loadFormSubmission();
  }
});
// ===============================
// User - Edit Profile Logic
// Author: Mohammad Alqaisi
// Responsibilities:
// 1. Check authentication (currentUser must exist).
// 2. Load user data from localStorage.users.
// 3. Fill form fields with existing values.
// 4. Validate new values on submit.
// 5. Update the user inside the users array in localStorage.
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";

  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const form = document.getElementById("editProfileForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const logoutLink = document.getElementById("logoutLink");

  // ---------------------------
  // 1) Auth Guard
  // ---------------------------
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) {
    window.location.href = "../login.html";
    return;
  }

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (err) {
    console.error("Failed to parse users from localStorage", err);
    users = [];
  }

  let currentUser = users.find((u) => u.id === currentUserId);

  if (!currentUser) {
    window.location.href = "../login.html";
    return;
  }

  // ---------------------------
  // 2) Populate UI with current data
  // ---------------------------
  function fillFormWithCurrentUser() {
    profileNameEl.textContent = currentUser.fullName || "";
    profileEmailEl.textContent = currentUser.email || "";

    fullNameInput.value = currentUser.fullName || "";
    emailInput.value = currentUser.email || "";
    phoneInput.value = currentUser.phoneNumber || "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
  }

  fillFormWithCurrentUser();

  // ---------------------------
  // 3) Form submit (Save)
  // ---------------------------
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newFullName = fullNameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const newPhone = phoneInput.value.trim();
    const newPassword = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Basic validation
    if (!newFullName || !newEmail) {
      alert("Full name and email are required.");
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    // ---------------------------
    // 4) Update currentUser object
    // ---------------------------
    currentUser = {
      ...currentUser,
      fullName: newFullName,
      email: newEmail,
      phoneNumber: newPhone,
    };

    if (newPassword) {
      currentUser.password = newPassword;
    }

    // ---------------------------
    // 5) Update users array
    // ---------------------------
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? currentUser : user
    );

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      users = updatedUsers;
    } catch (err) {
      console.error("Failed to save updated users to localStorage", err);
      alert("Something went wrong while saving your profile.");
      return;
    }

    fillFormWithCurrentUser();
    alert("Profile updated successfully.");
  });

  // ---------------------------
  // 6) Cancel button
  // ---------------------------
  cancelBtn.addEventListener("click", () => {
    window.location.href = "userpage.html";
  });

  // ---------------------------
  // 7) Logout
  // ---------------------------
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "../login.html";
  });
});
// ---------------------------
// 7) Logout
// ---------------------------
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "../public-pages/login.html";
  });
}
