(() => {
  const catalogModalRefs = {
    openCatalogModalBtn: document.querySelector("[data-catalog-modal-open]"),
    closeCatalogModalBtn: document.querySelector("[data-catalog-modal-close]"),
    catalogModal: document.querySelector("[data-catalog-modal]"),
  };

  catalogModalRefs.openCatalogModalBtn.addEventListener(
    "click",
    toggleCatalogModal
  );
  catalogModalRefs.closeCatalogModalBtn.addEventListener(
    "click",
    toggleCatalogModal
  );

  function toggleCatalogModal() {
    catalogModalRefs.catalogModal.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }
})();
