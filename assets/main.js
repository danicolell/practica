const registroButton = document.getElementById("registro");
const modalForm = document.getElementById("modalForm");
const closeButton = document.querySelector(".close-button");

registroButton.addEventListener("click", () => {
  modalForm.style.display = "block";
});

closeButton.addEventListener("click", () => {
  modalForm.style.display = "none";
});
