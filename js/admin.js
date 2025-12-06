function coachesPage() {
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";

  const tableBody = document.getElementById("coachesTableBody");
  const showAllBtn = document.getElementById("showAllBtn");

  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) {
    window.location.href = "../public-pages/index.html";
    return;
  }

  let users = [];
  users = JSON.parse(localStorage.getItem(USERS_KEY));

  const currentUser = users.find((u) => u.id == currentUserId);

  if (!currentUser || !currentUser.isAdmin) {
    window.location.href = "../public-pages/index.html";
    return;
  }

  const coaches = users.filter((user) => !user.isAdmin);

  const INITIAL_LIMIT = 7;
  let showingAll = false;

  function renderCoaches(limit = INITIAL_LIMIT) {
    tableBody.innerHTML = "";

    const slice = showingAll ? coaches : coaches.slice(0, limit);

    slice.forEach((coach, index) => {
      const tr = document.createElement("tr");

      const avg =
        typeof coach.averageScore === "number"
          ? `${coach.averageScore}%`
          : "-";

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${coach.fullName || "-"}</td>
        <td>${coach.email || "-"}</td>
        <td>${coach.phoneNumber || "-"}</td>
        <td class="text-end">${avg}</td>
      `;

      tableBody.appendChild(tr);
    });
  }

  renderCoaches();

  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      showingAll = !showingAll;
      renderCoaches();
      showAllBtn.textContent = showingAll ? "Show Less" : "Show All";
    });
  }
}

function dashboard() {
  const FORMS_KEY = "forms";
  const USERS_KEY = "users";

  const tableBody = document.getElementById("formsTableBody");

  let forms = JSON.parse(localStorage.getItem(FORMS_KEY));
  let coaches = JSON.parse(localStorage.getItem(USERS_KEY));

  function calculateWeeklyStats(items) {
    let thisWeek = 0;
    let lastWeek = 0;
    const today = new Date();

    items.forEach(item => {
      if (!item.createdAt) return;
      const [d, m, y] = item.createdAt.split("-");
      const itemDate = new Date(y, m - 1, d);
      const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) {
        thisWeek++;
      } else if (diffDays > 7 && diffDays <= 14) {
        lastWeek++;
      }
    });

    let percentage = 0;
    if (lastWeek > 0) {
      percentage = ((thisWeek - lastWeek) / lastWeek) * 100;
    } else if (thisWeek > 0) {
      percentage = 100;
    }

    return Math.round(percentage);
  }

  function updateCard(cardId, indicatorId, count, percentage) {
    let trendIcon = '';
    let color = '';

    if (percentage === 0) {
      color = "#D9D9D9";
      trendIcon = '';
    } else if (percentage > 0) {
      color = "#89EBAD";
      trendIcon = '<i class="fa-solid fa-arrow-trend-up"></i>';
    } else {
      color = "#F9A4A4";
      trendIcon = '<i class="fa-solid fa-arrow-trend-down"></i>';
    }

    const percentageAbs = Math.abs(percentage);

    const card = document.getElementById(cardId);

    const indicatorEl = card.querySelector(`#${indicatorId}`);

    card.querySelector(".card-counter").textContent = count;

    indicatorEl.innerHTML = `${trendIcon} ${percentageAbs}%`;
    indicatorEl.style.backgroundColor = color;


  }

  function updateSimpleCard(cardId, value) {
    const card = document.getElementById(cardId);
    if (card) {
      const counterEl = card.querySelector(".card-counter");
      if (counterEl) counterEl.textContent = value;
    }
  }

  function renderStatistics() {
    const formsPercentage = calculateWeeklyStats(forms);
    updateCard("total-forms", "forms-indicator", forms.length, formsPercentage);

    const coachesPercentage = calculateWeeklyStats(coaches);
    const coachCount = coaches.filter(c => !c.isAdmin).length;
    updateCard("total-coaches", "coaches-indicator", coachCount, coachesPercentage);

    let totalAvg = 0;
    forms.forEach(form => {
      totalAvg += form.average || 0;
    });
    totalAvg = forms.length > 0 ? Math.round(totalAvg / forms.length) : 0;

    updateSimpleCard("total-avg", totalAvg + '%');

    let inactiveForms = 0;
    forms.forEach(form => {
      if (form.status == "inactive")
        inactiveForms++;
    });
    updateSimpleCard("inactive-forms", inactiveForms);
  }

  function toggleFormStatus(formId) {
    const forms = JSON.parse(localStorage.getItem(FORMS_KEY));
    const formIndex = forms.findIndex(f => f.formId == formId);

    if (formIndex != -1) {
      forms[formIndex].status = forms[formIndex].status == 'active' ? 'inactive' : 'active';
      localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
      location.reload();
    }
  }

  function editForm(formId) {
    window.location.href = `createform.html?formId=${formId}`;
 
  }

  function deleteForm(formId) {
    Swal.fire({
      title: 'Delete Form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FC0000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let forms = JSON.parse(localStorage.getItem(FORMS_KEY));
        forms = forms.filter(f => f.formId !== formId);
        localStorage.setItem(FORMS_KEY, JSON.stringify(forms));

        let submissions = JSON.parse(localStorage.getItem('submissions'));
        submissions = submissions.filter(s => s.formId !== formId);
        localStorage.setItem('submissions', JSON.stringify(submissions));

        Swal.fire({
          icon: 'success',
          title: 'Form Deleted',
          showConfirmButton: false,
        }).then(() => {
          location.reload();
        });
      }
    });
  }

  function viewFormResults(formId) {
    window.location.href = `formresults.html?formId=${formId}`;
  }

  function renderForms() {
    tableBody.innerHTML = "";

    forms.forEach((form, idx) => {
      const tr = document.createElement("tr");

      const avg = `${form.average}%`;
      const changeStatusColor = form.status == "active" ? "#4E535A" : "#00ADB5";
      const statusIndicatorColor = form.status == "active" ? "#2CA910" : "#D51A1A";
      const toggleStatus = form.status == "active" ? "Deactivate" : "Activate";

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><u style="cursor: pointer;" onclick="viewFormResults('${form.formId}')">${form.title}</u></td>
        <td>${form.questions.length}</td>
        <td style="color:${statusIndicatorColor}; font-weight: 600;">${form.status.toUpperCase()}</td>
        <td>${form.createdAt}</td>
        <td>${form.maxScore}%</td>
        <td>${avg}</td>
        <td>
          <div class="form-actions">
            <div class="action-btn btn-edit" onclick="editForm('${form.formId}')">Edit</div>
            <div class="action-btn btn-delete" onclick="deleteForm('${form.formId}')">Delete</div>
            <div class="action-btn btn-toggle" style="background-color:${changeStatusColor}" onclick="toggleFormStatus('${form.formId}')">${toggleStatus}</div>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  window.toggleFormStatus = toggleFormStatus;
  window.editForm = editForm;
  window.deleteForm = deleteForm;
  window.viewFormResults = viewFormResults;

  renderForms();
  renderStatistics();
}

function formResults() {
  const SUBMISSIONS_KEY = "submissions";
  const USERS_KEY = "users";
  const FORMS_KEY = "forms";

  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get('formId');

  let forms = JSON.parse(localStorage.getItem(FORMS_KEY));
  let form = forms.find(f => f.formId == formId);

  document.querySelector('.form-title-text').textContent = form.title;
  document.querySelector('.form-description-text').textContent = form.description || 'No description';

  let toggle = document.getElementById('active-toggle');
  toggle.checked = form.status == 'active';

  toggle.addEventListener('change', () => {
    let forms = JSON.parse(localStorage.getItem(FORMS_KEY));
    let targetForm = forms.find(f => f.formId == formId);
    targetForm.status = toggle.checked ? 'active' : 'inactive';
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  });

  const editBtn = document.getElementById('form-overview-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      window.location.href = `createform.html?formId=${formId}`;
    });
  }

  let submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];
  submissions = submissions.filter(s => s.formId == formId);

  let coaches = JSON.parse(localStorage.getItem(USERS_KEY));


  document.querySelectorAll('#total-questions .card-count').textContent = form.questions.length;

  let totalScore = 0;
  let highestScore = 0;
  submissions.forEach(sub => {
    const score = sub.score;
    totalScore += score;
    if (score > highestScore) {
      highestScore = score;
    }
  });

  const avgScore = submissions.length > 0 ? Math.round(totalScore / submissions.length) : 0;

  const avgCards = document.querySelectorAll('.dashboard-card .card-count');
  if (avgCards[1]) avgCards[1].textContent = avgScore + '%';

  const submissionsCard = document.querySelector('#total-submissions .card-count');
  if (submissionsCard) submissionsCard.textContent = submissions.length;

  const highestCard = document.querySelector('#highest-score .card-count');
  if (highestCard) highestCard.textContent = highestScore + '%';

  const tableBody = document.getElementById("submissionsTableBody");

  function viewSubmission(userId, submissionFormId) {
    window.location.href = `../admin/viewFormSubmission.html?userId=${userId}&formId=${submissionFormId}`;
  }

  function renderSubmissions() {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    submissions.forEach((submission) => {
      const tr = document.createElement("tr");
      const coach = coaches.find(c => c.id == submission.userId);

      tr.innerHTML = `
        <td>${submission.userId}</td>
        <td><u style="cursor: pointer;" onclick="viewSubmission('${submission.userId}', '${submission.formId}')">${coach.fullName}</u></td>
        <td>${coach.email}</td>
        <td>${coach.phoneNumber}</td>
        <td>${submission.score}%</td>
      `;

      tableBody.appendChild(tr);
    });
  }

  window.viewSubmission = viewSubmission;

  renderSubmissions();
}