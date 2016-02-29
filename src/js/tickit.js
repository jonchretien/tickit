/* global define */
/**
 * @name tickit
 * @overview A basic ticker that uses CSS animations & vanilla JavaScript.
 * @version 0.0.0
 * @author Jon Chretien
 * @license MIT
 */
(() => {
  /**
   * @param {Object} config - Tickit configuration values.
   * @param {array} config.data - The text to display.
   * @param {string} config.selector - The id for the container element.
   * @param {number} config.duration - The animation duration.
   * @param {number} config.initialPos - The initial offset position.
   * @param {string} config.behavior - The user interaction behavior.
   */
  const Tickit = (config) => {
    const isString = (val) => toString.call(val) === '[object String]'; // underscore.js
    const isNumber = (val) => toString.call(val) === '[object Number]'; // underscore.js
    const logError = (type) => { throw new Error(`Expecting a ${type}`); };
    const setTransform = (position) => `translate3d(0, ${position}px, 0)`;

    if (!Array.isArray(config.data)) logError('array');
    if (!isString(config.behavior) || !isString(config.selector)) logError('string');
    if (!isNumber(config.duration) || !isNumber(config.initialPos)) logError('number');

    const options = Object.assign({}, config);
    const { data, duration, behavior, initialPos, selector } = options;
    const tickit = document.querySelector(selector);
    const tickitInner = tickit.querySelector('.js-tickit-inner');
    const transitionIn = 0;
    const transitionOut = -initialPos;
    const classNames = ['tickit-text', 'js-tickit-text'];

    let counter = 0;
    let isAnimating = false;
    let isClickActivated = false;
    let isTickitVisible = false;
    let tickitText = null;

    /**
     * Hides text container.
     */
    function hideTickit() {
      isAnimating = true;
      isTickitVisible = false;
      tickitText.style.transform = setTransform(transitionOut);
    }

    /**
     * Reveals text container.
     */
    function showTickit() {
      isAnimating = true;
      isTickitVisible = true;
      tickitText.style.transform = setTransform(transitionIn);
    }

    /**
     * Handles animation frame based on behavior.
     */
    function draw() {
      const timer = setTimeout(() => {
        if (!isClickActivated && isTickitVisible && behavior === 'click' ||
          isTickitVisible && isClickActivated) {
          isAnimating = false;
          clearTimeout(timer);
          return;
        }

        if (!isTickitVisible) {
          tickitText.textContent = data[counter++ % data.length];
          showTickit();
          return;
        }

        if (isTickitVisible) {
          hideTickit();
        }
      }, duration);
    }

    /**
     * Adds text element.
     */
    function addText() {
      const el = document.createElement('div');
      el.className = classNames.join(' ');
      el.style.transform = setTransform(initialPos);
      tickitInner.appendChild(el);
      tickitText = tickitInner.querySelector(`.${classNames[1]}`);
    }

    /**
     * Removes text element.
     */
    function removeText() {
      tickitInner.removeChild(tickitText);
    }

    /**
     * Handles click events.
     *
     * @param {Object} event - The event triggered.
     */
    function handleClickEvent(event) {
      if (!isAnimating && event.target && event.target.nodeName.toLowerCase() === 'div') {
        isClickActivated = true;
        hideTickit();
        return;
      }
    }

    /**
     * Handles transition end events.
     *
     * @param {Object} event - The event triggered.
     */
    function handleTransitionEndEvent(event) {
      if (event.target && event.target.nodeName.toLowerCase() === 'div') {
        if (!isTickitVisible) {
          removeText();
          addText();
        }

        requestAnimationFrame(draw);
      }
    }

    /**
     * Attaches event handlers.
     *
     * @api private
     */
    function attachEvents() {
      if (behavior === 'click') {
        tickitInner.addEventListener('click', handleClickEvent, false);
      }
      tickitInner.addEventListener('transitionend', handleTransitionEndEvent, false);
    }

    /**
     * Initialize logic.
     *
     * @api private
     */
    function init() {
      attachEvents();
      addText();
      draw();
    }

    return { init };
  };

  /**
   * Expose `Tickit`.
   */
  if (typeof define === 'function' && define.amd) {
    define(Tickit);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = Tickit;
  } else {
    window.Tickit = Tickit;
  }
})();
