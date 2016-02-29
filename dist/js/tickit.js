'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * @name tickit
 * @overview A basic ticker that uses CSS animations & vanilla JavaScript.
 * @version 0.0.0
 * @author Jon Chretien
 * @license MIT
 */
(function () {
  /**
   * @param {Object} config - Tickit configuration values.
   * @param {array} config.data - The text to display.
   * @param {string} config.selector - The id for the container element.
   * @param {number} config.duration - The animation duration.
   * @param {number} config.initialPos - The initial offset position.
   * @param {string} config.behavior - The user interaction behavior.
   */
  var Tickit = function Tickit(config) {
    var data = config.data;
    var duration = config.duration;
    var behavior = config.behavior;
    var initialPos = config.initialPos;
    var selector = config.selector;

    var tickit = document.querySelector(selector);
    var tickitInner = tickit.querySelector('.js-tickit-inner');
    var transitionIn = 0;
    var transitionOut = -initialPos;
    var classNames = ['tickit-text', 'js-tickit-text'];

    var counter = 0;
    var hasStarted = false;
    var isAnimating = false;
    var isClickActivated = false;
    var isTickitVisible = false;
    var tickitText = null;

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

    /**
     * Attaches event handlers.
     *
     * @api private
     */
    function attachEvents() {
      if (config.behavior === 'click') {
        tickitInner.addEventListener('click', handleClickEvent, false);
      }
      tickitInner.addEventListener('transitionend', handleTransitionEndEvent, false);
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
        return false;
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
     * Adds text element.
     */
    function addText() {
      var el = document.createElement('div');
      el.className = classNames.join(' ');
      el.style.transform = setTransform(initialPos);
      tickitInner.appendChild(el);
      tickitText = tickitInner.querySelector('.' + classNames[1]);
    }

    /**
     * Removes text element.
     */
    function removeText() {
      tickitInner.removeChild(tickitText);
    }

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
     * Sets 3D transform value on text.
     *
     * @param {Number} position - Position
     */
    function setTransform(position) {
      return 'translate3d(0, ' + position + 'px, 0)';
    }

    /**
     * Handles animation frame based on behavior.
     */
    function draw() {
      var timer = setTimeout(function () {
        if (!isClickActivated && isTickitVisible && config.behavior === 'click' || isTickitVisible && isClickActivated) {
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

    return { init: init };
  };

  /**
   * Expose `Tickit`.
   */
  if (typeof define === 'function' && define.amd) {
    define(Tickit);
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = Tickit;
  } else {
    window.Tickit = Tickit;
  }
})();
