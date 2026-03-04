let bills = [];

function generateBill() {
  const bill = {
    patient: bPatient.value,
    amount: bAmount.value
  };

  if (!bill.patient || !bill.amount) return alert("Enter details");

  bills.push(bill);
  renderBills();
}

function renderBills() {
  const list = document.getElementById("billingList");
  list.innerHTML = "";

  bills.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.patient} | ₹ ${b.amount}`;
    list.appendChild(li);
  });
}