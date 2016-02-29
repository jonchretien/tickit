'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global define */
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
    var isString = function isString(val) {
      return toString.call(val) === '[object String]';
    }; // underscore.js
    var isNumber = function isNumber(val) {
      return toString.call(val) === '[object Number]';
    }; // underscore.js
    var logError = function logError(type) {
      throw new Error('Expecting a ' + type);
    };
    var setTransform = function setTransform(position) {
      return 'translate3d(0, ' + position + 'px, 0)';
    };

    if (!Array.isArray(config.data)) logError('array');
    if (!isString(config.behavior) || !isString(config.selector)) logError('string');
    if (!isNumber(config.duration) || !isNumber(config.initialPos)) logError('number');

    var options = _extends({}, config);
    var data = options.data;
    var duration = options.duration;
    var behavior = options.behavior;
    var initialPos = options.initialPos;
    var selector = options.selector;

    var tickit = document.querySelector(selector);
    var tickitInner = tickit.querySelector('.js-tickit-inner');
    var transitionIn = 0;
    var transitionOut = -initialPos;
    var classNames = ['tickit-text', 'js-tickit-text'];

    var counter = 0;
    var isAnimating = false;
    var isClickActivated = false;
    var isTickitVisible = false;
    var tickitText = null;

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
      var timer = setTimeout(function () {
        if (!isClickActivated && isTickitVisible && behavior === 'click' || isTickitVisible && isClickActivated) {
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
