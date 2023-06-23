let transactions = [];

let transaction = null;

let $modal, $closeButton, $registroButton, $formRegistro, $buttonRegistrar, $buttonEliminar;

function removeTransaction(id) {
  const confirmation = confirm("¿Estás seguro de eliminar esta transacción?");

  if (!confirmation) {
    return;
  }
  // Remover una transacción de la lista
  transactions = transactions.filter(function (transaction) {
    return transaction.id !== id;
  });

  // Eliminar la transacción
  const transactionElement = document.getElementById(id);
  if (transactionElement) {
    transactionElement.remove();
  }

  updateTotal();

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function editTransaction(id) {
  // Editar una transacción existente
  $modal = document.querySelector(".modal");
  nombreInput = document.getElementById("nombre");
  precioInput = document.getElementById("precio");
  entrada = document.getElementById("entrada");
  salida = document.getElementById("salida");
  categoriaInput = document.getElementById("categoria");
  $buttonRegistrar = document.getElementById("registrar");

  // Buscar la transacción por ID
  transaction = transactions.find(function (t) {
    return t.id === id;
  });
  if (transaction && transaction.nombre) {
    nombreInput.value = transaction.nombre;
  } else {
    nombreInput.value = "";
  }

  setTimeout(function() {
    nombreInput.focus(); // Establecer el enfoque en el campo de nombre después de un pequeño retraso
  }, 0);

  precioInput.value = transaction.precio;
  if (transaction.type === "entrada") {
    entrada.checked = true;
  } else {
    salida.checked = true;
  }
  categoriaInput.value = transaction.categoria;

  $buttonRegistrar.value = "Guardar";

  if ($buttonEliminar) {
    $buttonEliminar.remove();
  }
  // Crear un nuevo botón de eliminar
  $buttonEliminar = document.createElement("button");
  $buttonEliminar.textContent = "Eliminar";
  $buttonEliminar.classList.add("btn__delete"); // Agregar la clase "btn__delete"
  $buttonEliminar.addEventListener("click", function () {
    removeTransaction(id);
    closeModal();
  });

  $buttonRegistrar.parentNode.insertBefore($buttonEliminar, $buttonRegistrar.nextSibling);

  $modal.style.display = "block";
}

function openTransactionForm() {
  $modal.style.display = "block";
  if ($buttonEliminar) {
    $buttonEliminar.remove();
  }
  $modal.style.display = "block";
  $buttonRegistrar = document.getElementById("registrar"); // Asignar el elemento al botón "Registrar"
  $buttonRegistrar.value = "Registrar";
  setTimeout(function() {
    document.getElementById("nombre").focus(); // Establecer el enfoque en el campo de nombre después de un pequeño retraso
  }, 0);
}


function openTransactionForm() {
  $modal.style.display = "block";
  if ($buttonEliminar) {
    $buttonEliminar.remove();
  }
  $modal.style.display = "block";
  $buttonRegistrar = document.getElementById("registrar"); // Asignar el elemento al botón "Registrar"
  $buttonRegistrar.value = "Registrar";
  document.getElementById("nombre").focus(); // Establecer el enfoque en el campo de nombre
}


function openTransactionForm() {
  $modal.style.display = "block";
  if ($buttonEliminar) {
    $buttonEliminar.remove();
  }
  $modal.style.display = "block";
  $buttonRegistrar = document.getElementById("registrar"); // Asignar el elemento al botón "Registrar"
  $buttonRegistrar.value = "Registrar";
  document.getElementById("nombre").focus();
}

function saveTransaction(event) {
  // Guardar una transacción
  event.preventDefault();
  const formData = new FormData(event.target);

  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);

  const entrada = document.getElementById("entrada");
  const salida = document.getElementById("salida");
  const isEntrada = entrada.checked;
  const isOut = salida.checked;
  if (!isEntrada && !isOut) {
    alert("Selecciona un tipo de transacción");
    return;
  }

  const categoria = document.getElementById("categoria").value;

  if (transaction) {
    // MODIFICAR transacción existente
    transaction.nombre = nombre;
    transaction.precio = precio;
    transaction.type = isEntrada ? "entrada" : "salida";
    transaction.categoria = categoria;

    updateTransactionInDOM(transaction);
  } else {
    // CREAR una nueva transacción
    if (!nombre || !precio || !categoria) {
      alert("Por favor, rellena todos los campos");
      return;
    }

    const fecha = new Date();
    const newTransaction = {
      id: fecha.getTime(),
      nombre,
      precio,
      type: isEntrada ? "entrada" : "salida",
      categoria,
      fecha,
    };

    transactions.unshift(newTransaction); // Agregar al principio de la lista
    renderTransaction(newTransaction);
  }
  transaction = null;

  localStorage.setItem("transactions", JSON.stringify(transactions));
  closeModal();
}

function closeModal() {
  // Cerrar el modal
  $modal.style.display = "none";
  resetForm();
}

function updateTransactionInDOM(transaction) {
  // Actualizar una transacción
  const nameElement = document.getElementById(`name-${transaction.id}`);
  if (nameElement) {
    const priceElement = nameElement.nextElementSibling;
    const categoryElement = priceElement.nextElementSibling;

    nameElement.textContent = transaction.nombre;
    priceElement.textContent = `€ ${transaction.precio}`;
    categoryElement.textContent = transaction.categoria;

    if (transaction.type === "entrada") {
      priceElement.classList.add("isInbound");
      priceElement.classList.remove("isOut");
    } else {
      priceElement.classList.add("isOut");
      priceElement.classList.remove("isInbound");
    }
  }

  updateTotal();
}

function updateTotal() {
  const { totalIngreso, totalGasto } = transactions.reduce(
    function (acc, transaction) {
      if (transaction.type === "entrada") {
        acc.totalIngreso = acc.totalIngreso + transaction.precio;
      } else {
        acc.totalGasto = acc.totalGasto + transaction.precio;
      }

      return acc;
    },
    {
      totalIngreso: 0,
      totalGasto: 0,
    }
  );

  const totalEntradasElement = document.getElementById("totalEntradas");
  const totalSalidasElement = document.getElementById("totalSalidas");
  const totalElement = document.getElementById("total");

  totalEntradasElement.textContent = `${totalIngreso.toFixed(2)} €`;
  totalSalidasElement.textContent = `${totalGasto.toFixed(2)} €`;
  totalElement.textContent = `${(totalIngreso - totalGasto).toFixed(2)} €`;
}

function renderTransaction(transaction) {
  // Renderizar una transacción
  const newRow = document.createElement("tr");
  newRow.className = "list-item";
  newRow.id = transaction.id;

  const tdName = document.createElement("td");
  tdName.classList.add("isStrong");
  tdName.id = `name-${transaction.id}`;
  tdName.innerHTML = transaction.nombre;

  tdName.addEventListener("click", function () {
    editTransaction(transaction.id);
  });

  const tdPrice = document.createElement("td");
  if (transaction.type === "entrada") {
    tdPrice.classList.add("isInbound");
  } else {
    tdPrice.classList.add("isOut");
  }
  tdPrice.innerHTML = `€ ${transaction.precio}`;

  const tdCategory = document.createElement("td");
  tdCategory.innerHTML = transaction.categoria;

  const tdDate = document.createElement("td");
  const fecha = new Date(transaction.fecha);
  const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  tdDate.innerHTML = formattedDate;

  newRow.appendChild(tdName);
  newRow.appendChild(tdPrice);
  newRow.appendChild(tdCategory);
  newRow.appendChild(tdDate);

  const tableBody = document.querySelector("tbody");
  tableBody.insertBefore(newRow, tableBody.firstChild); // Insertar al principio de la lista

  updateTotal();
}

function loadTransactions() {
  if (localStorage.getItem("transactions")) {
    transactions = JSON.parse(localStorage.getItem("transactions"));
  }

  transactions.forEach(function (transaction) {
    renderTransaction(transaction);
  });
  updateTotal();
}

function resetForm() {
  const formRegistro = document.querySelector("#formRegistro");
  formRegistro.reset();
}

document.addEventListener("DOMContentLoaded", function () {
  $modal = document.querySelector(".modal");
  $closeButton = document.querySelector(".cerrar");
  $registroButton = document.querySelector("#registro");
  $formRegistro = document.querySelector("#formRegistro");

  loadTransactions();

  $registroButton.addEventListener("click", openTransactionForm);

  $closeButton.addEventListener("click", function () {
    $modal.style.display = "none";
    resetForm();
  });

  $formRegistro.addEventListener("submit", saveTransaction);
});
