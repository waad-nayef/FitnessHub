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
        (sub) => sub.formId == form.formId
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
      const form = forms.find((f) => f.formId == submission.formId); // ← Changed === to ==
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
  const selectedForm = forms.find((f) => f.formId == selectedFormId);

  if (!selectedForm) {
    Swal.fire({
      title: "Error!",
      text: "Form not found. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "userpage.html";
    });
    return;
  }

  if (!selectedForm.questions || selectedForm.questions.length === 0) {
    Swal.fire({
      title: "Error!",
      text: "This form has no questions yet.",
      icon: "warning",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "userpage.html";
    });
    return;
  }

  const formTitleHeading = document.querySelector(".form-title-heading");
  const formDescriptionText = document.querySelector(".form-description-text");

  if (formTitleHeading) formTitleHeading.textContent = selectedForm.title;
  if (formDescriptionText) {
    formDescriptionText.textContent =
      selectedForm.description || "No description provided";
  }

  const questionsContainer = document.getElementById("questionsContainer");
  if (questionsContainer && selectedForm.questions) {
    questionsContainer.innerHTML = "";

    selectedForm.questions.forEach((question, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "card mb-4 shadow-sm form-sub-question";
      questionDiv.style.borderRadius = "15px";

      let questionHTML = `
        <div class="card-body">
          <h5 class="fw-bold text-danger mb-2">* Question ${index + 1} (${question.mark || 1
        } marks)</h5>
          <p class="mb-3">${question.text}</p>
      `;

      // Handle different question types
      if (question.type === "radio") {
        if (question.options && question.options.length > 0) {
          question.options.forEach((option, optIndex) => {
            const optionId = `q${index}o${optIndex}`;
            // Get option text (handle both string and object formats)
            const optionText =
              typeof option === "object" ? option.text : option;
            const optionId_val =
              typeof option === "object" ? option.id : optionText;

            questionHTML += `
              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="question_${index}"
                  id="${optionId}"
                  value="${optionId_val}"
                />
                <label class="form-check-label" for="${optionId}">${optionText}</label>
              </div>
            `;
          });
        }
      } else if (question.type === "select" || question.type === "checkbox") {
        if (question.options && question.options.length > 0) {
          question.options.forEach((option, optIndex) => {
            const optionId = `q${index}o${optIndex}`;
            const optionText =
              typeof option === "object" ? option.text : option;
            const optionId_val =
              typeof option === "object" ? option.id : optionText;

            questionHTML += `
              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="${optionId}"
                  name="question_${index}"
                  value="${optionId_val}"
                />
                <label class="form-check-label" for="${optionId}">${optionText}</label>
              </div>
            `;
          });
        }
      } else if (question.type === "text") {
        questionHTML += `
          <input
            type="text"
            class="form-control mt-3"
            id="question_${index}"
            placeholder="Type your answer"
          />
        `;
      }

      questionHTML += `</div>`;
      questionDiv.innerHTML = questionHTML;
      questionsContainer.appendChild(questionDiv);
    });
  }

  // Handle form submission
  const submitBtn = document.querySelector(".submit-form-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const answers = collectFormAnswers();

      // Calculate score based on correct answers
      const score = calculateScore(selectedForm, answers);

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

        // Calculate average score
        const allSubmissions = submissions.filter(
          (s) => s.userId === currentUser.id
        );
        const avgScore = Math.round(
          allSubmissions.reduce((sum, s) => sum + s.score, 0) /
          allSubmissions.length
        );
        users[userIndex].averageScore = avgScore;

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      // Update form average
      const forms = JSON.parse(localStorage.getItem(FORMS_KEY)) || [];
      const formIndex = forms.findIndex((f) => f.formId == selectedFormId);
      if (formIndex !== -1) {
        const formSubmissions = submissions.filter(
          (s) => s.formId == selectedFormId
        );
        forms[formIndex].average = Math.round(
          formSubmissions.reduce((sum, s) => sum + s.score, 0) /
          formSubmissions.length
        );
        localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
      }

      Swal.fire({
        title: "Success!",
        text: `Form submitted! Score: ${score}%`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("selectedFormId");
        window.location.href = "userpage.html";
      });
    });
  }
}

function calculateScore(form, answers) {
  let correctAnswers = 0;
  let totalMarks = 0;

  form.questions.forEach((question, index) => {
    const questionKey = `question_${index}`;
    totalMarks += question.mark || 1;

    if (question.type === "radio") {
      const userAnswer = answers[`question_${index}`];
      if (userAnswer === question.correctAnswerId) {
        correctAnswers += question.mark || 1;
      }
    } else if (question.type === "select") {
      const userAnswers = answers[`question_${index}`] || [];
      const correctIds = question.correctAnswerIds || [];

      if (
        Array.isArray(userAnswers) &&
        userAnswers.length === correctIds.length
      ) {
        const allCorrect = userAnswers.every((ans) => correctIds.includes(ans));
        if (allCorrect) {
          correctAnswers += question.mark || 1;
        }
      }
    } else if (question.type === "text") {
      const userAnswer = answers[questionKey];
      if (
        userAnswer &&
        userAnswer.toLowerCase().trim() ===
        (question.correctAnswer || "").toLowerCase().trim()
      ) {
        correctAnswers += question.mark || 1;
      }
    }
  });

  return Math.round((correctAnswers / totalMarks) * 100);
}

function collectFormAnswers() {
  const answers = {};

  document.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
    answers[input.name] = input.value;
  });

  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((input) => {
      if (!answers[input.name]) {
        answers[input.name] = [];
      }
      answers[input.name].push(input.value);
    });

  document.querySelectorAll('input[type="text"]').forEach((input) => {
    if (input.id && input.value) {
      answers[input.id] = input.value;
    }
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

  fetch('https://zenquotes.io/api/random')
  .then(res => res.json())
  .then(data => {
    const card = document.getElementById('public-api');

    card.innerHTML = `
      <p class="quote">"${data[0].q}"</p>
      <span class="author">— ${data[0].a}</span>
    `;
  })
  .catch(() => {
    document.getElementById('public-api').innerHTML = `
      <p class="quote">Stay consistent. Results will come.</p>
      <span class="author"></span>
    `;
  });


});
