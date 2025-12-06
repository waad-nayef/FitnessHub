function coachesPage() {
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";

  const tableBody = document.getElementById("coachesTableBody");
  const showAllBtn = document.getElementById("showAllBtn");
  const logoutLink = document.getElementById("logoutLink");

  // ---------------------------
  // 1) Auth Guard
  // ---------------------------
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) {
    // No logged-in user -> redirect to login
    window.location.href = "../public-pages/login.html";
    return;
  }

  // Parse users array
  let users = [];
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (err) {
    console.error("Failed to parse users from localStorage", err);
    users = [];
  }

  const currentUser = users.find((u) => u.id === currentUserId);

  // If user not found or not admin -> redirect to login
  if (!currentUser || !currentUser.isAdmin) {
    window.location.href = "../public-pages/login.html";
    return;
  }

  // ---------------------------
  // 2) Prepare coaches list
  // ---------------------------
  const coaches = users.filter((user) => !user.isAdmin);

  // Control how many rows to show initially
  const INITIAL_LIMIT = 7;
  let showingAll = false;

  // ---------------------------
  // 3) Render function
  // ---------------------------
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

  // Initial render
  renderCoaches();

  // ---------------------------
  // 4) Show All toggle
  // ---------------------------
  showAllBtn.addEventListener("click", () => {
    showingAll = !showingAll;
    renderCoaches();
    showAllBtn.textContent = showingAll ? "Show Less" : "Show All";
  });

  // ---------------------------
  // 5) Logout
  // ---------------------------
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear only currentUser so dummy data remains
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "../login.html";
  });
};


//////////////////////////////

function dashboard() {
  const FORMS_KEY = "forms";
  const USERS_KEY = "users";

  const tableBody = document.getElementById("formsTableBody");

  let forms = [];
  forms = JSON.parse(localStorage.getItem(FORMS_KEY));

  let coaches = [];
  coaches = JSON.parse(localStorage.getItem(USERS_KEY));

  function calculateWeeklyStats(items) {
    let thisWeek = 0;
    let lastWeek = 0;
    const today = new Date();

    items.forEach(item => {
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
    card.querySelector(".card-counter").textContent = count;
    card.querySelector(`#${indicatorId}`).innerHTML = `${trendIcon} ${percentageAbs}%`;
    document.getElementById(indicatorId).style.backgroundColor = color;
  }

  function updateSimpleCard(cardId, value) {
    const card = document.getElementById(cardId);
    card.querySelector(".card-counter").textContent = value;
  }

  function renderStatistics() {
    const formsPercentage = calculateWeeklyStats(forms);
    updateCard("total-forms", "forms-indicator", forms.length, formsPercentage);

    const coachesPercentage = calculateWeeklyStats(coaches);
    updateCard("total-coaches", "coaches-indicator", coaches.length - 1, coachesPercentage);

    let totalAvg = 0;
    forms.forEach(form => {
      totalAvg += form.average;
    });
    totalAvg = totalAvg / forms.length;

    updateSimpleCard("total-avg", totalAvg);

    let inactiveForms = 0;
    forms.forEach(form => {
      if (form.status == "inactive")
        inactiveForms++;
    });
    updateSimpleCard("inactive-forms", inactiveForms);

  }

  function renderForms() {
    tableBody.innerHTML = "";

    forms.forEach((form) => {
      const tr = document.createElement("tr");

      const avg =
        typeof form.average === "number"
          ? `${form.average}%`
          : "-";
      const changeStatusColor = form.status == "active" ? "#4E535A" : "#00ADB5";
      const statusIndicatorColor = form.status == "active" ? "#2CA910" : "#D51A1A";
      const toggleStatus = form.status == "active" ? "Deactivate" : "Activate";
      tr.innerHTML = `
        <td>${form.formId}</td>
        <td><u>${form.title}</u></td>
        <td style="color:${statusIndicatorColor}">${form.status}</td>
        <td>${form.questions.length}</td>
        <td>${form.createdAt}</td>
        <td>${form.maxScore}%</td>
        <td>${avg}</td>
        <td>
        <div class="form-actions">
          <div id="form-delete">Delete</div>
          <div id="form-edit">Edit</div>
          <div id="form-change-status" style = "background-color:${changeStatusColor}">${toggleStatus}</div>
        </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }
  renderForms();
  renderStatistics();
}

///////////////////////////////////

function formResults(form) {
  // let formxyz = JSON.parse(localStorage.getItem("forms"))[0];
  // let toggle = document.querySelector("input[type=checkbox]");
  // toggle.checked = formxyz.status == "active";

  // toggle.addEventListener("change", () => {
  //   let forms = [];
  //   forms = JSON.parse(localStorage.getItem("forms"));
  //   let targetForm = form
  // })

}