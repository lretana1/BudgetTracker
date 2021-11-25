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