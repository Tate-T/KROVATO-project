(() => {
  const refs = {
    openCatalogModalBtn: document.querySelector("[data-mobile-search-open]"),
    closeCatalogModalBtn: document.querySelector("[data-mobile-search-close]"),
    modal: document.querySelector("[data-mobile-search]"),
  };

  refs.openCatalogModalBtn.addEventListener("click", toggleModal);
  refs.closeCatalogModalBtn.addEventListener("click", toggleModal);

  function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }
})();