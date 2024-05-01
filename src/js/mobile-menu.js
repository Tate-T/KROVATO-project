(() => {
  const refs = {
    openCatalogModalBtn: document.querySelector("[data-mobile-menu-open]"),
    closeCatalogModalBtn: document.querySelector("[data-mobile-menu-close]"),
    modal: document.querySelector("[data-mobile-menu]"),
  };

  refs.openCatalogModalBtn.addEventListener("click", toggleModal);
  refs.closeCatalogModalBtn.addEventListener("click", toggleModal);

  function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }
})();