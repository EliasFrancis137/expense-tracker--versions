// Select DOM elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const categorySummary = document.getElementById('category-summary');
const filterCategory = document.getElementById('filter-category');
const filterMonth = document.getElementById('filter-month');
const clearFilters = document.getElementById('clear-filters');

// Load expenses
let expenses = JSON.parse(localStorage.getItem('expenses-v2')) || [];

// Display expenses
function displayExpenses(filteredExpenses = expenses) {
  expenseList.innerHTML = '';
  let total = 0;
  const categoryTotals = {};

  filteredExpenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${expense.name} - $${expense.amount} 
      <span class="category">(${expense.category})</span> 
      [${expense.date}]</span>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(li);

    total += parseFloat(expense.amount);

    // Track category totals
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
  });

  totalDisplay.textContent = total.toFixed(2);

  // Show category summary
  categorySummary.innerHTML = Object.keys(categoryTotals)
    .map(cat => `<p>${cat}: $${categoryTotals[cat].toFixed(2)}</p>`)
    .join('');
}

// Add expense
form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('expense-name').value;
  const amount = document.getElementById('expense-amount').value;
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;

  expenses.push({ name, amount, category, date });
  localStorage.setItem('expenses-v2', JSON.stringify(expenses));

  form.reset();
  displayExpenses();
});

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses-v2', JSON.stringify(expenses));
  displayExpenses();
}

// Filter logic
function applyFilters() {
  let filtered = [...expenses];

  const selectedCategory = filterCategory.value;
  const selectedMonth = filterMonth.value;

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(e => e.category === selectedCategory);
  }

  if (selectedMonth) {
    const [year, month] = selectedMonth.split('-');
    filtered = filtered.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() == year && (expenseDate.getMonth() + 1) == month;
    });
  }

  displayExpenses(filtered);
}

filterCategory.addEventListener('change', applyFilters);
filterMonth.addEventListener('change', applyFilters);
clearFilters.addEventListener('click', () => {
  filterCategory.value = 'all';
  filterMonth.value = '';
  displayExpenses();
});

// Initial render
displayExpenses();
