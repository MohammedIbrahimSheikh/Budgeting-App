var budgetInput = 0;
var expenses = 0;
var balance = 0;
var expenseArray = [];
var selectedExpenseIndex = -1; // Track the selected expense index for update

// for first form (taking budget as input)
document.getElementById("budget-form").addEventListener("submit", function(event) {
    event.preventDefault(); // preventing default behavior
    var input = Number(document.getElementById("budget-input").value);
    if (input <= 0) {
        alert("Budget should be greater than zero!");
    } else {
        budgetInput = input;
        document.getElementById("budget-amount").innerText = budgetInput;
        balance = (budgetInput - expenses);
        document.getElementById("balance-amount").innerText = balance;
    }
});

// for second form (taking date, amount, title as input)
document.getElementById("expense-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var expenseObject = new UI();
    if (selectedExpenseIndex !== -1) {
        // If there is a selected expense index, update the expense
        expenseArray[selectedExpenseIndex] = expenseObject;
        selectedExpenseIndex = -1; // Reset the selected expense index
    } else {
        expenseArray.push(expenseObject);
    }
    
    if ((expenses + expenseObject.amount) > budgetInput) {
        alert("Expenses have exceeded the budget!");
        if (selectedExpenseIndex === -1) {
            expenseArray.pop();
        }
    } else {
        expenses += expenseObject.amount;
        document.getElementById("expense-amount").innerText = expenses;
        balance -= expenseObject.amount;
        document.getElementById("balance-amount").innerText = balance;
        
        if (selectedExpenseIndex !== -1) {
            // If there is a selected expense index, update the row
            var rowToUpdate = document.querySelector("#expense-table tr:nth-child(" + (selectedExpenseIndex + 1) + ")");
            rowToUpdate.innerHTML = "<td>" + expenseObject.expense + "</td><td>" + expenseObject.amount + "</td><td>" + expenseObject.date + "</td><td><i class='fa-solid fa-pen-to-square mx-3'></i><i class='fa-solid fa-xmark mx-3 delete-button'></i></td>";
        } else {
            // If there is no selected expense index, add a new row
            var newRow = document.createElement("tr");
            newRow.innerHTML = "<td>" + expenseObject.expense + "</td><td>" + expenseObject.amount + "</td><td>" + expenseObject.date + "</td><td><i class='fa-solid fa-pen-to-square mx-3'></i><i class='fa-solid fa-xmark mx-3 delete-button'></i></td>";
            document.querySelector("#expense-table").appendChild(newRow);
        }

        var deleteButton = newRow.querySelector(".delete-button");
        deleteButton.addEventListener("click", function() {
            deleteExpenseRow(this);
        });
        
        var updateButton = newRow.querySelector(".fa-pen-to-square");
        updateButton.addEventListener("click", function() {
            updateExpenseRow(this);
        });
    }

    // Resetting input fields
    document.getElementById("date-input").value = "";
    document.getElementById("expense-input").value = "";
    document.getElementById("amount-input").value = "";
});

// Delete an expense row and update the expenses and balance
function deleteExpenseRow(button) {
    var rowToDelete = button.closest("tr");
    console.log('the row to delete',rowToDelete);
    var index = Array.from(rowToDelete.parentNode.children).indexOf(rowToDelete);
    var deletedExpense = expenseArray[index];
    expenseArray.splice(index, 1);

    // Remove the row from the table
    rowToDelete.remove();

    // Recalculate expenses and balance
    expenses -= deletedExpense.amount;
    balance += deletedExpense.amount;
    document.getElementById("expense-amount").innerText = expenses;
    document.getElementById("balance-amount").innerText = balance;
}

// Update an expense row and fill the input fields for editing
// Update an expense row and delete the corresponding element from the expenseArray
function updateExpenseRow(button) {
    var rowToUpdate = button.closest("tr");
    selectedExpenseIndex = Array.from(rowToUpdate.parentNode.children).indexOf(rowToUpdate);
    var selectedExpense = expenseArray[selectedExpenseIndex];

    // Delete the selected expense from the expenseArray
    expenseArray.splice(selectedExpenseIndex, 1);

    // Remove the row from the table
    rowToUpdate.remove();

    // Recalculate expenses and balance
    expenses -= selectedExpense.amount;
    balance += selectedExpense.amount;
    document.getElementById("expense-amount").innerText = expenses;
    document.getElementById("balance-amount").innerText = balance;

    // Fill the input fields with the selected expense values
    document.getElementById("date-input").value = selectedExpense.date;
    document.getElementById("expense-input").value = selectedExpense.expense;
    document.getElementById("amount-input").value = selectedExpense.amount;

}

// creating class for Expense Object
class UI {
    constructor() {
        this.date = document.getElementById("date-input").value;
        this.expense = document.getElementById("expense-input").value;
        this.amount = Number(document.getElementById("amount-input").value);
    }
}