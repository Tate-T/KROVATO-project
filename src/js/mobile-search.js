(() => {
  const mobileSearchRefs = {
    openMobileSearchBtn: document.querySelector("[data-mobile-search-open]"),
    closeMobileSearchBtn: document.querySelector("[data-mobile-search-close]"),
    mobileSearch: document.querySelector("[data-mobile-search]"),
  };

  mobileSearchRefs.openMobileSearchBtn.addEventListener("click", toggleMobileSearch);
  mobileSearchRefs.closeMobileSearchBtn.addEventListener(
    "click",
    toggleMobileSearch
  );

  function toggleMobileSearch() {
    mobileSearchRefs.mobileSearch.classList.toggle("is-hidden");
    
    document.body.classList.toggle("no-scroll");
  }
})();
