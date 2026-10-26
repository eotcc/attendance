import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5DlfgTwgbohbj4fpqQdXzuox63P6GJQA",
  authDomain: "saturdaychurchschool.firebaseapp.com",
  projectId: "saturdaychurchschool",
  storageBucket: "saturdaychurchschool.firebasestorage.app",
  messagingSenderId: "1098070001648",
  appId: "1:1098070001648:web:3c27a2115eab6337853f35",
  measurementId: "G-G86K42XCE4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentContainer = document.getElementById('studentContainer');
const studentCountBadge = document.getElementById('studentCount');

async function fetchStudents() {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    
    if (querySnapshot.empty) {
      studentContainer.innerHTML = '<div class="empty-state">No students registered yet.</div>';
      studentCountBadge.textContent = '0 Active';
      return;
    }

    studentContainer.innerHTML = '';
    let count = 0;

    querySnapshot.forEach((doc) => {
      count++;
      const student = doc.data();

      const name = student.name || 'Unknown Student';
      const grade = student.grade || 'N/A';
      const parentPhone = student.parentPhone || 'N/A';
      const startTime = student.startTime || '--:--';
      const endTime = student.endTime || '--:--';
      
      // Extract days properly
      const days = Array.isArray(student.days) ? student.days : [student[0], student[1]].filter(Boolean);
      const daysFormatted = days.length ? days.map(d => `<span class="day-tag">${d}</span>`).join(' ') : 'No Days';

      // Get first letter for avatar
      const initial = name.charAt(0) ? name.charAt(0) : 'S';

      // Registered Date
      let formattedDate = 'N/A';
      if (student.registeredAt && typeof student.registeredAt.toDate === 'function') {
        formattedDate = student.registeredAt.toDate().toLocaleDateString();
      }

      const studentItemHTML = `
        <div class="student-item">
          <div class="student-info">
            <div class="avatar-initial">${initial}</div>
            <div class="student-details">
              <span class="student-name-text">${name} &bull; <small style="color:var(--text-muted)">${grade}</small></span>
              <div class="student-meta">
                <span>🕒 ${startTime} - ${endTime}</span>
                <span>📞 ${parentPhone}</span>
                <span>📅 Reg: ${formattedDate}</span>
              </div>
              <div style="margin-top: 4px;">${daysFormatted}</div>
            </div>
          </div>
        </div>
      `;

      studentContainer.innerHTML += studentItemHTML;
    });

    studentCountBadge.textContent = `${count} Active`;

  } catch (error) {
    console.error("Error fetching students: ", error);
    studentContainer.innerHTML = `<div class="empty-state" style="color:var(--danger-color);">Error loading students from Firebase.</div>`;
  }
}

fetchStudents();
