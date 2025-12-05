document.addEventListener("DOMContentLoaded", () => {
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
    window.location.href = "../login.html";
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
    window.location.href = "../login.html";
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
});
//////////////////////////////
