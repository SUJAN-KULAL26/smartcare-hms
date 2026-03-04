let appointments = [];

function bookAppointment() {
  const appt = {
    patient: aPatient.value,
    doctor: aDoctor.value,
    date: aDate.value
  };

  if (!appt.patient || !appt.doctor) return alert("Fill all fields");

  appointments.push(appt);
  renderAppointments();
}

function renderAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";

  appointments.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.patient} → Dr. ${a.doctor} on ${a.date}`;
    list.appendChild(li);
  });
}