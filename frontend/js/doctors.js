let doctors = [];

function addDoctor() {
  const doctor = {
    name: dName.value,
    spec: dSpec.value
  };

  if (!doctor.name) return alert("Enter doctor name");

  doctors.push(doctor);
  renderDoctors();
}

function renderDoctors() {
  document.getElementById("totalDoctors").innerText = doctors.length;

  const list = document.getElementById("doctorList");
  list.innerHTML = "";

  doctors.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.name} | ${d.spec}`;
    list.appendChild(li);
  });
}