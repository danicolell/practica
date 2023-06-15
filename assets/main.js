document.addEventListener("DOMContentLoaded", function() {
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".cerrar");
  const registroButton = document.querySelector("#registro");

  registroButton.addEventListener("click", function() {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", function() {
    modal.style.display = "none";
  });
});