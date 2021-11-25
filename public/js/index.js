//added service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then((reg) => {
      console.log("Service worker registered.", reg);
    });
  });
}

let transactions = [];
let myChart;
const transactionForm = createTransactionForm();
const transactionApi = createTransactionApi();

initTransactions();

document.querySelector("#add-btn").onclick = function () {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  sendTransaction(false);
};

function createTransactionForm() {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".form .error");

  const showError = (message) => {
    errorEl.textContent = message;
  };

  const validate = () => {
    if (nameEl.value === "" || amountEl.value === "") {
      showError("Missing Information");
      return false;
    }
    showError("");
    return true;
  };

  const transaction = () => {
    return {
      name: nameEl.value,
      value: amountEl.value,
      date: new Date().toISOString()
    };
  };

  // clears inputs
  const clear = () => {
    nameEl.value = "";
    amountEl.value = "";
    showError("");
  };

  return Object.freeze({ transaction, validate, clear, showError });
}

function createTransactionApi() {
  const create = (transaction) => {
    return fetch("/api/transaction", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    }).then((response) => {
      return response.json();
    });
  };

  const fetchAll = () => {
    return fetch("/api/transaction").then((response) => {
      return response.json();
    });
  };
  return Object.freeze({ create, fetchAll });
}

function initTransactions() {
  transactionApi.fetchAll().then((data) => {
    // save db data on global variable
    transactions = data;

    renderTransactionsChart();
  });
}

function sendTransaction(isAdding) {
  if (!transactionForm.validate()) {
    return;
  }

  const transaction = transactionForm.transaction();

  // Converts to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }
  
  transactions.unshift(transaction);

  // populates ui with new record
  populateChart();
  populateTable();
  populateTotal();

  //send to server
  transactionApi
    .create(transaction)
    .then((data) => {
      if (data.errors) {
        transactionForm.showError("Missing Information");
      } else {
        transactionForm.clear();
      }
    })
    .catch(() => {
  // fetch failed
      saveRecord(transaction);
      transactionForm.clear();
    });
}

function renderTransactionsChart() {
  populateTotal();
  populateTable();
  populateChart();
}

function populateTotal() {
  // reduce to a single value
  const total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  const totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach((transaction) => {
    // create and populate a row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}
  
  transactions.unshift(transaction);

  //populate ui with new record
  populateChart();
  populateTable();
  populateTotal();

  // send to server
  transactionApi
    .create(transaction)
    .then((data) => {
      if (data.errors) {
        transactionForm.showError("Missing Information");
      } else {
        transactionForm.clear();
      }
    })
    .catch(() => {
      // fetch failed
      saveRecord(transaction);
      transactionForm.clear();
    });
}

function renderTransactionsChart() {
  populateTotal();
  populateTable();
  populateChart();
}

function populateTotal() {
  // reduce to a single value
  const total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  const totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach((transaction) => {
    // create and populate a row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}