const API = "http://127.0.0.1:5000/api/patients";

let editMode = false;
let editId = null;

// ✅ Load Patients
async function loadPatients() {
  try {
    const res = await fetch(API);
    const patients = await res.json();

    const list = document.getElementById("patientList");
    const total = document.getElementById("totalPatients");

    if (!list) return;

    list.innerHTML = "";
    total.innerText = patients.length;

    patients.forEach(p => {
      const li = document.createElement("li");

      li.innerHTML = `
        <b>${p.name}</b> | Age: ${p.age} | ${p.gender} | 📞 ${p.contact}

        <button onclick="editPatient('${p._id}', '${p.name}', '${p.age}', '${p.gender}', '${p.contact}')">
          ✏ Edit
        </button>

        <button onclick="deletePatient('${p._id}')">
          🗑 Delete
        </button>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    console.error("❌ Error loading patients:", err);
  }
}

// ✅ Submit (Add / Update)
async function submitPatient() {
  const patient = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    contact: document.getElementById("contact").value
  };

  if (!patient.name) {
    alert("Enter name");
    return;
  }

  try {
    if (editMode) {
      await fetch(`${API}/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
      });

      alert("✅ Patient Updated");

    } else {
      await fetch(`${API}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
      });

      alert("✅ Patient Added");
    }

    resetForm();
    loadPatients();

  } catch (err) {
    console.error("❌ Submit Error:", err);
  }
}

// ✅ Edit Patient
function editPatient(id, name, age, gender, contact) {
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  document.getElementById("gender").value = gender;
  document.getElementById("contact").value = contact;

  editMode = true;
  editId = id;

  document.getElementById("formTitle").innerText = "Edit Patient";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

// ✅ Delete Patient
async function deletePatient(id) {
  if (!confirm("Delete patient?")) return;

  try {
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    alert("🗑 Patient Deleted");
    loadPatients();

  } catch (err) {
    console.error("❌ Delete Error:", err);
  }
}

// ✅ Reset Form
function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("contact").value = "";

  editMode = false;
  editId = null;

  document.getElementById("formTitle").innerText = "Add Patient";
  document.getElementById("cancelBtn").style.display = "none";
}

// ✅ Auto Load when page loads
document.addEventListener("DOMContentLoaded", loadPatients);