// Select DOM elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

// Load expenses from localStorage or initialize empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to display expenses
function displayExpenses() {
  expenseList.innerHTML = '';
  let total = 0;

  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${expense.name} - $${expense.amount}
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(li);
    total += parseFloat(expense.amount);
  });

  totalDisplay.textContent = total.toFixed(2);
}

// Function to add expense
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('expense-name').value;
  const amount = document.getElementById('expense-amount').value;

  expenses.push({ name, amount });
  localStorage.setItem('expenses', JSON.stringify(expenses));

  form.reset();
  displayExpenses();
});

// Function to delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}

// Initial display
displayExpenses();
