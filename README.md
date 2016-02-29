# tickit

_A basic ticker that uses CSS animations & vanilla JavaScript. It supports vertical scrolling and runs either on an infinite timed loop or when the user clicks the container._

## Install

### Download

#### CSS

+ [tickit.css](https://github.com/jonchretien/tickit/raw/master/dist/tickit.css)

#### JavaScript

+ [tickit.js](https://github.com/jonchretien/tickit/raw/master/dist/tickit.js) 

### Markup

**tickit** works with a base element and an inner container. Child elements are dynamically added.

``` html
<div id="tickit" class="tickit">
  <div class="tickit-inner js-tickit-inner"></div>
</div>
```

### JavaScript

``` js
/**
 * @param {Object} config - Tickit configuration values.
 * @param {array} config.data - The text to display.
 * @param {string} config.selector - The id for the container element.
 * @param {number} config.duration - The animation duration.
 * @param {number} config.initialPos - The initial offset position.
 * @param {string} config.behavior - The user interaction behavior.
 */
var config = {
  data: ['item 1', 'item 2', 'item 3'],
  selector: '#tickit',
  duration: 1000,
  initialPos: -15,
  behavior: 'scroll'
};

var ticker = Ticker(config).init();
```

## Browser Support

Still need to test in IE, iOS, and Android, but otherwise most modern browsers

## License

**tickit** is released under the [MIT license](https://github.com/jonchretien/tickit/blob/master/LICENSE.txt).

## To Do

+ Demos
+ Tests
+ Tweak config options
+ Add error checks
+ account for longest txt in arr (for box width)
+ Test in IE, iOS, and Android browsers
+ Add ESLint
+ Minify files.
