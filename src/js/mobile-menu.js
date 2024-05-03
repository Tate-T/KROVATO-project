(() => {
  const mobileMenuRefs = {
    openMobileMenuBtn: document.querySelector("[data-mobile-menu-open]"),
    closeMobileMenuBtn: document.querySelector("[data-mobile-menu-close]"),
    mobileMenu: document.querySelector("[data-mobile-menu]"),
  };

  mobileMenuRefs.openMobileMenuBtn.addEventListener("click", toggleMobileMenu);
  mobileMenuRefs.closeMobileMenuBtn.addEventListener("click", toggleMobileMenu);

  function toggleMobileMenu() {
    mobileMenuRefs.mobileMenu.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }
})();
