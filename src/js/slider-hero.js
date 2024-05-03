/**
 * URL of the CSS file to be loaded.
 */
let cssUrl = "hero.scss";
/**
 * Creating and added the <link> element
 */
let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = cssUrl;
/**
 * Adding the link element to the <head> element
 */
document.head.appendChild(link);
/**
 * Listen for the DOMContentLoaded event to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Convert NodeList of elements with class 'js-slider' to Array and initialize TouchSlide for each.
     */
    Array.prototype.slice.call(document.querySelectorAll('.js-slider'), 0).forEach(function (item) {
        var auto = item.getAttribute('auto') === 'true'; // Determine if auto attribute is true
        var arrow = item.getAttribute('arrow') === 'true'; // Determine if arrow attribute is true
        var dots = item.getAttribute('dots') === 'true'; // Determine if dots attribute is true

        new TouchSlide(item, {auto: auto, arrow: arrow, dots: dots}); // Initialize TouchSlide with options
    });
});

/**
 * Check if TouchSlide is already defined to avoid duplicates.
 */
if (TouchSlide) {
    throw new Error('TouchSlide: Duplicate!');
}

/**
 * Defines the TouchSlide class for creating a touch-enabled slider.
 * @param {HTMLElement} container - The container element of the slider.
 * @param {Object} options - Configuration options for the slider.
 */
var TouchSlide = function (container, options) {
    // Ensure that a container element is provided
    if (!container) {
        throw new Error('TouchSlide:No container');
    }

    // Initialize instance properties
    this.container = this._$(container);
    this.element = this.container.children[0];
    this.slides = this.element.children;
    this.slideLength = this.slides.length;
    this.index = 0;

    // Default settings
    this.interval = 250;
    this.slop = 20;
    this.duration = 200;

    // Slider options
    this.auto = options.auto !== undefined ? options.auto : false;
    this.arrow = options.arrow !== undefined ? options.arrow : false;
    this.dots = options.dots !== undefined ? options.dots : false;

    // Initialize the slider
    this.init();

    // Reference to the instance for use in event listeners
    var _this = this;

    // Add touch and mouse event listeners
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
        // Touch event listeners
        this.element.addEventListener('touchstart', function (e) {
            _this.touchstart(e);
        }, false);
        this.element.addEventListener('touchmove', function (e) {
            _this.touchmove(e);
        }, false);
        this.element.addEventListener('touchend', function (e) {
            _this.touchend(e);
        }, false);
    } else {
        // Mouse event listeners
        this.element.addEventListener('mousedown', function (e) {
            _this.mousedown(e);
        }, false);
        this.element.addEventListener('mousemove', function (e) {
            _this.mousemove(e);
        }, false);
        this.element.addEventListener('mouseup', function (e) {
            _this.mouseup(e);
        }, false);
    }

    // Resize event listener
    window.addEventListener('resize', function (e) {
        _this.init();
    }, false);
};

// Extend the prototype of TouchSlide with methods
TouchSlide.prototype = {
    constructor: TouchSlide,

    /**
     * Helper function to get the DOM element.
     * @param {string|HTMLElement} el - The element or the ID of the element.
     * @returns {HTMLElement} The DOM element.
     */
    _$: function (el) {
        return 'string' === typeof el ? document.getElementById(el) : el;
    },

    /**
     * Initializes or reinitializes the slider. Sets up dimensions, buttons, and dots.
     */
    init: function () {
        // Set dimensions of the slider and slides
        this.height = this.container.getBoundingClientRect().height;
        this.width = this.container.getBoundingClientRect().width;
        this.element.style.width = this.slideLength * this.width + 'px';
        this.element.style.height = this.height + 'px';

        // Loop through slides to set their dimensions
        var index = this.slideLength;
        while (index--) {
            this.slides[index].style.width = this.width + 'px';
            this.slides[index].style.height = this.height + 'px';
        }

        // Setup navigation buttons
        this.prevButton = this.container.querySelector('.prev');
        this.nextButton = this.container.querySelector('.next');

        if (this.arrow) {
            // Show navigation buttons if arrow option is true
            if (this.prevButton && this.nextButton) {
                this.prevButton.style.display = 'block';
                this.nextButton.style.display = 'block';
                this.prevButton.addEventListener('click', this.prevSlide.bind(this));
                this.nextButton.addEventListener('click', this.nextSlide.bind(this));
            } else {
                console.log("Buttons not found.");
            }
        } else {
            // Hide navigation buttons if arrow option is false
            if (this.prevButton && this.nextButton) {
                this.prevButton.style.display = 'none';
                this.nextButton.style.display = 'none';
            }
        }

        // Setup dots navigation
        if (this.dots) {
            this.addDots();
        } else {
            // Remove dots if dots option is false
            var dotsContainer = document.querySelector('.dots-container');
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
            }
        }

        // Auto slide setup
        if (this.auto) {
            this.startAutoSlide();
        } else {
            this.stopAutoSlide();
        }
    },

    /**
     * Starts the automatic sliding of the slides.
     */
    startAutoSlide: function () {
        this.autoSlideInterval = setInterval(this.nextSlide.bind(this), 3000);
    },

    /**
     * Stops the automatic sliding of the slides.
     */
    stopAutoSlide: function () {
        clearInterval(this.autoSlideInterval);
    },

    /**
     * Adds dot elements for navigation between slides.
     */
    addDots: function () {
        var dotsContainer = document.querySelector('.dots-container');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        for (var i = 0; i < this.slideLength; i++) {
            var dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', this.onDotClick.bind(this));
            dotsContainer.appendChild(dot);
        }
        this.updateActiveDot();
    },

    /**
     * Event handler for dot click. Navigates to the corresponding slide.
     * @param {Event} e - The event object.
     */
    onDotClick: function (e) {
        var dotIndex = parseInt(e.target.dataset.index);
        this.slideTo(dotIndex, this.duration);
        this.updateActiveDot(dotIndex);
    },

    /**
     * Updates the active state of the navigation dots.
     * @param {number} [index=this.index] - The index of the active slide.
     */
    updateActiveDot: function (index) {
        index = index !== undefined ? index : this.index;
        var dots = document.querySelectorAll('.dot');
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    },

    /**
     * Navigates to the previous slide.
     */
    prevSlide: function () {
        var newIndex = this.index - 1;
        if (newIndex < 0) {
            newIndex = this.slideLength - 1;
        }
        this.slideTo(newIndex, this.duration);
    },

    /**
     * Navigates to the next slide.
     */
    nextSlide: function () {
        var newIndex = this.index + 1;
        if (newIndex >= this.slideLength) {
            newIndex = 0;
        }
        this.slideTo(newIndex, this.duration);
    },

    /**
     * Performs the slide transition to the specified index.
     * @param {number} index - The index of the slide to navigate to.
     * @param {number} duration - The duration of the transition in milliseconds.
     */
    slideTo: function (index, duration) {
        this.move(0, index, duration);
        this.index = index;
        this.updateActiveDot();
    },

    /**
     * Moves the slider to the specified position.
     * @param {number} delta - The change in position.
     * @param {number} index - The index of the target slide.
     * @param {number} duration - The duration of the move in milliseconds.
     */
    move: function (delta, index, duration) {
        var style = this.element.style;
        style.webkitTransitionDuration = duration + 'ms';
        style.webkitTransform = 'translate3d(' + (delta - index * this.width) + 'px, 0, 0)';
    },

    /**
     * Checks if the slide move is valid based on time and distance constraints.
     * @returns {boolean} True if the slide move is valid, otherwise false.
     */
    isValidSlide: function () {
        return (Number(new Date()) - this.start.time < this.interval && Math.abs(this.deltaX) > this.slop) || (Math.abs(this.deltaX) > this.width / 2);
    },

    // Event handlers for touch and mouse events follow the same pattern:
    // They update the start position, delta, and apply the necessary transition.

    touchstart: function (e) {
        // Set the start position and time for touch events
        var touchEvent = e.touches[0];
        this.deltaX = 0;
        this.start = {
            x: touchEvent.pageX,
            time: Number(new Date())
        };
        this.element.style.webkitTransitionDuration = 0;
    },

    touchmove: function (e) {
        // Calculate and apply the delta for touch move events
        var touchPoint = e.touches[0];
        this.deltaX = touchPoint.pageX - this.start.x;
        // Half the delta if it's past the bounds to create resistance
        this.deltaX = this.deltaX / (this.isPastBounds() ? 2 : 1);
        e.preventDefault();
        this.move(this.deltaX, this.index, 0);
    },

    touchend: function (e) {
        // Finalize the slide position after a touch ends
        var offset = (this.deltaX < 0 ? 1 : -1);
        var newIndex = this.index + (this.isValidSlide() ? offset : 0);
        // Wrap around if the new index is out of bounds
        if (newIndex >= this.slideLength) {
            this.slideTo(0, this.duration);
        } else if (newIndex < 0) {
            this.slideTo(this.slideLength - 1, this.duration);
        } else {
            this.slideTo(newIndex, this.duration);
        }
    },

    mousedown: function (e) {
        // Set the start position and time for mouse events
        this.start = {
            x: e.pageX,
            time: Number(new Date())
        };
        this.element.style.webkitTransitionDuration = 0;
    },

    mousemove: function (e) {
        // Calculate and apply the delta for mouse move events
        if (this.start) {
            this.deltaX = e.pageX - this.start.x;
            // Half the delta if it's past the bounds to create resistance
            this.deltaX = this.deltaX / (this.isPastBounds() ? 2 : 1);
            e.preventDefault();
            this.move(this.deltaX, this.index, 0);
        }
    },

    mouseup: function (e) {
        // Finalize the slide position after a mouse up event
        if (this.start) {
            var offset = (this.deltaX < 0 ? 1 : -1);
            var newIndex = this.index + (this.isValidSlide() ? offset : 0);
            // Wrap around if the new index is out of bounds
            if (newIndex >= this.slideLength) {
                this.slideTo(0, this.duration);
            } else if (newIndex < 0) {
                this.slideTo(this.slideLength - 1, this.duration);
            } else {
                this.slideTo(newIndex, this.duration);
            }
        }
        this.start = null;
    },

    /**
     * Checks if the current slide position is past the beginning or end bounds.
     * @returns {boolean} True if the slider is past bounds, otherwise false.
     */
    isPastBounds: function () {
        return this.index === 0 && this.deltaX > 0 || this.index === this.slideLength - 1 && this.deltaX < 0;
    }
};
