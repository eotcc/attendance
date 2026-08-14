document.addEventListener("DOMContentLoaded", () => {
  const recordsList = document.getElementById("recordsList");
  const attendanceData = JSON.parse(localStorage.getItem("studentAttendance") || "{}");

  const studentIds = Object.keys(attendanceData);

  if (studentIds.length === 0) {
    recordsList.innerHTML = `<div class="empty-state">No student sign-in entries recorded yet.</div>`;
    return;
  }

  recordsList.innerHTML = "";

  studentIds.forEach((id) => {
    const card = document.createElement("div");
    card.className = "student-card";

    const months = attendanceData[id];
    let monthsHtml = "";

    for (const [monthKey, daysArray] of Object.entries(months)) {
      const [year, monthNum] = monthKey.split("-");
      const monthName = new Date(year, monthNum - 1).toLocaleString("default", {
        month: "long",
        year: "numeric"
      });

      const dateTags = daysArray
        .map((date) => `<span class="date-tag">${date}</span>`)
        .join("");

      monthsHtml += `
        <div class="month-block">
          <div class="month-header">
            <span class="month-name">${monthName}</span>
            <span class="total-badge">${daysArray.length} Day(s) Total</span>
          </div>
          <div class="dates-grid">
            ${dateTags}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="student-id">Student Code: ${id}</div>
      ${monthsHtml}
    `;

    recordsList.appendChild(card);
  });
});
