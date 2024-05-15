let customers = [
    { id: 1, name: "1. John Doe", email: "john@example.com", balance: 1000, history: [] },
    { id: 2, name: "2. Jane Smith", email: "jane@example.com", balance: 1500, history: [] },
    { id: 3, name: "3. Michael Johnson", email: "michael@example.com", balance: 2000, history: [] },
    { id: 4, name: "4. Emily Brown", email: "emily@example.com", balance: 1200, history: [] },
    { id: 5, name: "5. David Wilson", email: "david@example.com", balance: 1800, history: [] },
    { id: 6, name: "6. Sarah Martinez", email: "sarah@example.com", balance: 2500, history: [] },
    { id: 7, name: "7. Christopher Lee", email: "chris@example.com", balance: 1600, history: [] },
    { id: 8, name: "8. Amanda Taylor", email: "amanda@example.com", balance: 2200, history: [] },
    { id: 9, name: "9. Matthew Anderson", email: "matthew@example.com", balance: 1900, history: [] },
    { id: 10, name: "10. Jessica Thomas", email: "jessica@example.com", balance: 2800, history: [] }
];

document.addEventListener("DOMContentLoaded", function() {
    populateSenderRecipientDropdowns();
});

function populateSenderRecipientDropdowns() {
    let senderDropdown = document.getElementById("sender");
    let recipientDropdown = document.getElementById("recipient");

    customers.forEach(customer => {
        let option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        senderDropdown.appendChild(option.cloneNode(true));
        recipientDropdown.appendChild(option.cloneNode(true));
    });
}

function transfer() {
    let senderId = parseInt(document.getElementById("sender").value);
    let recipientId = parseInt(document.getElementById("recipient").value);
    let amount = parseFloat(document.getElementById("amount").value);

    if (senderId === 0 || recipientId === 0) {
        alert("Please select sender and recipient.");
        return;
    }

    let sender = customers.find(customer => customer.id === senderId);
    let recipient = customers.find(customer => customer.id === recipientId);

    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid amount.");
        return;
    }

    if (amount > sender.balance) {
        alert("Insufficient balance.");
        return;
    }

    sender.balance -= amount;
    recipient.balance += amount;

    updateTransactionHistory(sender, recipient, amount);
    updateBalancesInUI();
    clearAmountInput();
}

function updateTransactionHistory(sender, recipient, amount) {
    let transaction = {
        from: sender.name,
        to: recipient.name,
        amount: amount
    };
    let existingTransaction = sender.history.find(entry => entry.to === recipient.name);
    if (!existingTransaction) {
        sender.history.push(transaction);
        if (sender !== recipient) {
            recipient.history.push(transaction);
        }
    } else {
        existingTransaction.amount += amount;
    }
    displayTransactionHistory();
}

function updateBalancesInUI() {
    let senderBalanceElement = document.getElementById("sender-balance");
    let recipientBalanceElement = document.getElementById("recipient-balance");

    senderBalanceElement.textContent = customers.find(customer => customer.id === parseInt(document.getElementById("sender").value)).balance.toFixed(2);
    recipientBalanceElement.textContent = customers.find(customer => customer.id === parseInt(document.getElementById("recipient").value)).balance.toFixed(2);
}

function clearAmountInput() {
    document.getElementById("amount").value = '';
}

function viewAllCustomers() {
    let allCustomersList = customers.map(customer => `${customer.name}: $${customer.balance.toFixed(2)}`).join("\n");
    alert("All Customers:\n" + allCustomersList);
}

function displayTransactionHistory() {
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = '';

    let uniqueTransactions = [];

    customers.forEach(customer => {
        customer.history.forEach(transaction => {
            let exists = uniqueTransactions.some(t => (
                t.from === transaction.from &&
                t.to === transaction.to
            ));

            if (!exists) {
                uniqueTransactions.push(transaction);
            }
        });
    });

    uniqueTransactions.forEach(transaction => {
        let item = document.createElement("li");
        if (transaction.from === transaction.to) {
            item.textContent = `${transaction.from} performed a self-transaction of $${transaction.amount.toFixed(2)}`;
        } else {
            item.textContent = `${transaction.from} sent $${transaction.amount.toFixed(2)} to ${transaction.to}`;
        }
        historyList.appendChild(item);
    });
}
