let currentFormId = null;
let questions = [];
let editMode = false;
let formatting = { bold: false, italic: false, underline: false };
let options = [];

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get("formId");

  if (formId) {
    editMode = true;
    currentFormId = formId;
    loadForm(formId);
  }

  document
    .getElementById("create-form-btn")
    .addEventListener("click", saveForm);
  document.getElementById("cancel-btn").addEventListener("click", cancelForm);
};

function loadForm(formId) {
  const forms = JSON.parse(localStorage.getItem("forms"));
  const form = forms.find((f) => f.formId == formId);

  document.getElementById("form-title-input").value = form.title;
  document.getElementById("form-description-input").value = form.description;
  document.getElementById("active-toggle").checked = form.status == "active";
  document.getElementById("create-form-btn").textContent = "Update Form";

  questions = form.questions;
  renderQuestions();
}

function createQuestionForm() {
  showQuestionDialog(null, -1);
}

function showQuestionDialog(question = null, index = -1) {
  const isEdit = question !== null;

  if (question) {
    formatting = { ...question.styling };
    options = question.options ? [...question.options] : [];
  } else {
    formatting = { bold: false, italic: false, underline: false };
    options = [];
  }

  Swal.fire({
    title: isEdit ? "Edit Question" : "Add New Question",
    html: `
      <div id="create-question-dialog">
        <div class="question-field">
          <label class="field-label">Question Text</label>
          <input type="text" id="question-text" class="field-input" placeholder="Enter the question" value="${
            question?.text || ""
          }">
        </div>

        <div class="right-controls">
          <div class="required-toggle">
            <label class="toggle-label">Required</label>
            <label class="switch">
              <input type="checkbox" id="required" ${
                question?.isRequired ? "checked" : ""
              }>
              <span class="slider"></span>
            </label>
          </div>

          <div class="font-dropdown">
            <label class="dropdown-label">Font Type</label>
            <select id="font" class="font-select">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div class="formatting-buttons">
            <button type="button" class="format-btn ${
              formatting.bold ? "active" : ""
            }" data-format="bold"><b>B</b></button>
            <button type="button" class="format-btn ${
              formatting.italic ? "active" : ""
            }" data-format="italic"><i>I</i></button>
            <button type="button" class="format-btn ${
              formatting.underline ? "active" : ""
            }" data-format="underline"><u>U</u></button>
          </div>
        </div>

        <div class="preview-section">
          <label class="field-label">Preview</label>
          <div id="preview" class="preview-box"></div>
        </div>

        <div class="type-marks-row">
          <div class="type-field">
            <label class="field-label">Type</label>
            <select id="type" class="field-select">
              <option value="text">Text</option>
              <option value="radio">Radio (MCQ)</option>
              <option value="select">Select (Multiple)</option>
            </select>
          </div>
          <div class="marks-field">
            <label class="field-label">Marks</label>
            <input type="number" id="mark" class="field-input" min="1" value="${
              question?.mark || 1
            }">
          </div>
        </div>

        <div id="text-section" style="display: none;">
          <label class="field-label">Correct Answer</label>
          <input type="text" id="correct-answer" class="field-input" placeholder="Enter the correct answer" value="${
            question?.correctAnswer || ""
          }">
        </div>

        <div id="options-section" style="display: none;">
          <label class="field-label" id="options-label">Options</label>
          <div id="options-list"></div>
          <div class="add-choice-row">
            <input type="text" id="new-option" class="field-input" placeholder="Enter option">
            <button type="button" class="add-choice-btn" id="add-btn">+ Add</button>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? "Update Question" : "Add Question",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
      popup: "swal-responsive-popup",
    },
    didOpen: () => {
      if (question) {
        document.getElementById("font").value = question.styling.font;
        document.getElementById("type").value = question.type;
      }

      showCorrectSection();
      updatePreview();

      document
        .getElementById("type")
        .addEventListener("change", showCorrectSection);
      document
        .getElementById("question-text")
        .addEventListener("input", updatePreview);
      document.getElementById("font").addEventListener("change", updatePreview);
      document.getElementById("add-btn").addEventListener("click", addOption);

      document.querySelectorAll(".format-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const format = btn.dataset.format;
          formatting[format] = !formatting[format];
          btn.classList.toggle("active");
          updatePreview();
        });
      });
    },
    preConfirm: () => {
      const text = document.getElementById("question-text").value.trim();
      const type = document.getElementById("type").value;
      const mark = document.getElementById("mark").value;
      const isRequired = document.getElementById("required").checked;
      const font = document.getElementById("font").value;

      if (!text) {
        Swal.showValidationMessage("Please enter question text");
        return false;
      }

      if (!mark || mark < 1) {
        Swal.showValidationMessage("Please enter valid marks");
        return false;
      }

      const newQuestion = {
        questionId: question?.questionId || `q${Date.now()}`,
        text: text,
        type: type,
        mark: parseInt(mark),
        isRequired: isRequired,
        styling: {
          bold: formatting.bold,
          italic: formatting.italic,
          underline: formatting.underline,
          font: font,
        },
      };

      if (type === "text") {
        const answer = document.getElementById("correct-answer").value.trim();
        if (!answer) {
          Swal.showValidationMessage("Please enter the correct answer");
          return false;
        }
        newQuestion.correctAnswer = answer;
      } else if (type === "radio") {
        if (options.length < 2) {
          Swal.showValidationMessage("Please add at least 2 options");
          return false;
        }
        const selected = document.querySelector(
          'input[name="correct"]:checked'
        );
        if (!selected) {
          Swal.showValidationMessage("Please select the correct answer");
          return false;
        }
        newQuestion.options = options;
        newQuestion.correctAnswerId = selected.value;
      } else if (type === "select") {
        if (options.length < 2) {
          Swal.showValidationMessage("Please add at least 2 options");
          return false;
        }
        const selected = Array.from(
          document.querySelectorAll('input[name="correct"]:checked')
        ).map((cb) => cb.value);
        if (selected.length === 0) {
          Swal.showValidationMessage(
            "Please select at least one correct answer"
          );
          return false;
        }
        newQuestion.options = options;
        newQuestion.correctAnswerIds = selected;
      }

      return newQuestion;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (index >= 0) {
        questions[index] = result.value;
      } else {
        questions.push(result.value);
      }
      renderQuestions();

      Swal.fire({
        icon: "success",
        title: isEdit ? "Question Updated!" : "Question Added!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function showCorrectSection() {
  const type = document.getElementById("type").value;
  const textSection = document.getElementById("text-section");
  const optionsSection = document.getElementById("options-section");
  const label = document.getElementById("options-label");

  if (type === "text") {
    textSection.style.display = "block";
    optionsSection.style.display = "none";
  } else {
    textSection.style.display = "none";
    optionsSection.style.display = "block";
    label.textContent =
      type === "radio"
        ? "Options (Select correct answer)"
        : "Options (Select correct answers)";
    renderOptions();
  }
}

function updatePreview() {
  const text = document.getElementById("question-text").value;
  const font = document.getElementById("font").value;
  const preview = document.getElementById("preview");

  let style = `font-family: ${font};`;
  if (formatting.bold) style += " font-weight: bold;";
  if (formatting.italic) style += " font-style: italic;";
  if (formatting.underline) style += " text-decoration: underline;";

  preview.innerHTML = `<span style="${style}">${
    text || "Preview will appear here..."
  }</span>`;
}

function addOption() {
  const input = document.getElementById("new-option");
  const text = input.value.trim();

  if (!text) return;

  options.push({
    id: `o${Date.now()}`,
    text: text,
  });

  input.value = "";
  renderOptions();
}

function removeOption(index) {
  options.splice(index, 1);
  renderOptions();
}

function renderOptions() {
  const type = document.getElementById("type").value;
  const list = document.getElementById("options-list");
  list.innerHTML = "";

  options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option-item";

    if (type === "radio") {
      div.innerHTML = `
        <div class="question-options-input"><label for="opt-${i}"><input type="radio" name="correct" value="${opt.id}" id="opt-${i}">${opt.text}</label>
        <button type="button" class="remove-btn" onclick="removeOption(${i})">remove</button></div>
      `;
    } else {
      div.innerHTML = `
        
        <div class = "question-options-input"><label for="opt-${i}"><input type="checkbox" name="correct" value="${opt.id}" id="opt-${i}"> ${opt.text}</label>
        <button type="button" class="remove-btn" onclick="removeOption(${i})">remove</button></div>
      `;
    }

    list.appendChild(div);
  });
}

function renderQuestions() {
  const container = document.getElementById("questions");
  const noQuestionLabel = document.getElementById("no-question-label");

  if (questions.length === 0) {
    noQuestionLabel.style.display = "flex";
    const oldQuestions = container.querySelectorAll(
      ".question-card, .form-results-card-title"
    );
    oldQuestions.forEach((el) => el.remove());
    return;
  }

  noQuestionLabel.style.display = "none";

  const oldQuestions = container.querySelectorAll(
    ".question-card, .form-results-card-title"
  );
  oldQuestions.forEach((el) => el.remove());

  const title = document.createElement("div");
  title.className = "form-results-card-title";
  title.textContent = "Questions";
  container.insertBefore(title, container.firstChild);

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    let style = `font-family: ${q.styling.font};`;
    if (q.styling.bold) style += " font-weight: bold;";
    if (q.styling.italic) style += " font-style: italic;";
    if (q.styling.underline) style += " text-decoration: underline;";

    let answerHTML = "";

    if (q.type === "text") {
      answerHTML = `
        <div id="question-choices">
          <input type="text" value="${q.correctAnswer}" disabled style="background: #f5f5f5;">
        </div>
      `;
    } else if (q.type === "radio") {
      const correctOpt = q.options.find((opt) => opt.id === q.correctAnswerId);
      answerHTML = '<div id="question-choices">';
      q.options.forEach((opt) => {
        const isCorrect = opt.id === q.correctAnswerId ? " ✓" : "";
        answerHTML += `<label><input type="radio" disabled>${opt.text}${isCorrect}</label>`;
      });
      answerHTML += "</div>";
    } else if (q.type === "select") {
      answerHTML = '<div id="question-choices"><select disabled>';
      q.options.forEach((opt) => {
        const isCorrect = q.correctAnswerIds.includes(opt.id) ? " ✓" : "";
        answerHTML += `<option>${opt.text}${isCorrect}</option>`;
      });
      answerHTML += "</select></div>";
    }

    card.innerHTML = `
      <div class="question-number">Question ${index + 1} ${
      q.isRequired ? '<span style="color: red;">*</span>' : ""
    } (${q.mark} mark${q.mark > 1 ? "s" : ""})</div>
      <div class="question-text" style="${style}">${q.text}</div>
      ${answerHTML}
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
        <button onclick="editQuestion(${index})" style="padding: 5px 15px; border-radius: 999px; background: #FFAF15; color: white; border: none; cursor: pointer;">Edit</button>
        <button onclick="deleteQuestion(${index})" style="padding: 5px 15px; border-radius: 999px; background: #FC0000; color: white; border: none; cursor: pointer;">Delete</button>
      </div>
    `;

    container.insertBefore(card, noQuestionLabel);
  });
}

function editQuestion(index) {
  showQuestionDialog(questions[index], index);
}

function deleteQuestion(index) {
  Swal.fire({
    title: "Delete Question?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FC0000",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      questions.splice(index, 1);
      renderQuestions();
      Swal.fire({
        icon: "success",
        title: "Question Deleted!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function saveForm(e) {
  e.preventDefault();

  const title = document.getElementById("form-title-input").value.trim();
  const description = document
    .getElementById("form-description-input")
    .value.trim();
  const status = document.getElementById("active-toggle").checked
    ? "active"
    : "inactive";

  if (!title) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please enter form title",
    });
    return;
  }

  if (questions.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please add at least one question",
    });
    return;
  }

  const forms = JSON.parse(localStorage.getItem("forms")) || [];

  if (editMode && currentFormId) {
    const formIndex = forms.findIndex((f) => f.formId === currentFormId);
    forms[formIndex] = {
      ...forms[formIndex],
      title,
      description,
      status,
      questions,
    };
  } else {
    forms.push({
      formId: forms.length + 1,
      title,
      description,
      status,
      questions,
      createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      maxScore: 0,
      average: 0,
    });
  }

  localStorage.setItem("forms", JSON.stringify(forms));

  Swal.fire({
    icon: "success",
    title: editMode ? "Form Updated!" : "Form Created!",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    window.location.href = "dashboard.html";
  });
}

function cancelForm(e) {
  e.preventDefault();
  window.location.href = "dashboard.html";
}

window.removeOption = removeOption;
