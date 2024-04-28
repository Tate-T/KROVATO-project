(() => {
  const refs = {
    openCatalogModalBtn: document.querySelector("[data-catalog-modal-open]"),
    closeCatalogModalBtn: document.querySelector("[data-catalog-modal-close]"),
    modal: document.querySelector("[data-catalog-modal]"),
  };

  refs.openCatalogModalBtn.addEventListener("click", toggleModal);
  refs.closeCatalogModalBtn.addEventListener("click", toggleModal);

  function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }
})();
