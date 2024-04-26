const scrollToTopButton = document.getElementById('scrollToTop');

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.onscroll = function() {
    const pageOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const scrollToTopButton = document.getElementById('scrollToTop');

    if (pageOffset >= 1000) {
        scrollToTopButton.style.visibility = 'visible';
    } else {
        scrollToTopButton.style.visibility = 'hidden';
    }
};