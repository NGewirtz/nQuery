/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const listenerCallbacks = [];

const $n = function(arg) {
  if (typeof arg === 'string') {
    const els = Array.from(document.querySelectorAll(arg));
    return new DOMNodeCollection(els);
  } else if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  }else if (arg instanceof Function) {
    listenerCallbacks.push(arg);
  }
};

$n.extend = function(arg1,...args) {
  return Object.assign(arg1, ...args);
};

$n.ajax = function(options) {
  const params = getParams(options);
  return createPromise(params);
};

window.$n = $n;

document.addEventListener("DOMContentLoaded", function(){
  listenerCallbacks.forEach((el) => {
    el();
  });

  $n('#add-button').on('click', () => {
    $n('#todo-list').append(`<li>${$n('#new-todo').val()}</li>`);
    $n('#new-todo').clear();
  });

  $n('#header-button').on('click', () => {
    $n('h1').html($n('#new-header').val());
    $n('#new-header').clear();
  });

  $n('#empty-button').on('click', () => {
    $n('#todo-list').empty();
  });

  $n('#jacket-button').on('click', () => {
    $n.ajax({url: "http://api.openweathermap.org/data/2.5/weather?q=New%20York,us&units=imperial&appid=bcb83c4b54aee8418983c2aff3073b3b"})
    .then(data => {
      if (data.main.temp < 60) {
        $n('#todo-list').append(`<li>Bring A Jacket!</li>`);
      } else {
        alert("You Dont Need A Jacket");
      }
    });
  });

  $n('#background-button').on('click', () => {
    const images = ['under-the-sea', 'forest', 'mountains', 'desert', 'volcano', 'baseball'];
    const rand = Math.floor((Math.random() * images.length));
    $n('body').attr('class', " ");
    $n('body').addClass(images[rand]);
  });

  $n('ul').on('click', e => {
    $n(e.target).toggleClass("linethrough");
  });

});

const getParams = options => {
  const defaults = {
    url: window.location.href,
    method: "GET",
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {}
  };
  return $n.extend(defaults, options);
};

const createPromise = params => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(params.method, params.url);
    xhr.setRequestHeader('Content-Type', params.contentType);
    xhr.onload = function(data) {
      params.success(JSON.parse(data.currentTarget.response));
      resolve(JSON.parse(data.currentTarget.response));
    };
    xhr.onerror = () => {
      params.error();
      reject();
    };
    xhr.send(params.data);
  });
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {

  constructor(arr) {
    this.elements = arr;
    this.listeners = {};
  }

  html(arg) {
    if (arg) {
      this._setHTML(arg);
    } else {
      return this.elements[0].innerHTML;
    }
  }

  empty() {
    this.elements.forEach(el => {
      el.innerHTML = '';
    });
  }

  clear() {
    this.elements.forEach(el => {
      el.value = '';
    });
  }

  val() {
    return this.elements[0].value;
  }

  append(arg) {
    const toAppend = this._getElsToAppend(arg);
    this.elements.forEach(el => {
      toAppend.forEach(child => {
          el.innerHTML += child;
      });
    });
  }

  attr(attr, val) {
    if (val) {
      this._setAttr(attr, val);
    } else {
      return this.elements[0].getAttribute(attr);
    }
  }

  addClass(arg) {
    const newClasses = arg.split(" ");
    this.elements.forEach(el => {
      el.classList.add(...newClasses);
    });
  }

  removeClass(arg) {
    const newClasses = arg.split(" ");
    this.elements.forEach(el => {
      el.classList.remove(...newClasses);
    });
  }

  toggleClass(arg) {
    this.elements.forEach(el => {
      if (el.classList.contains(arg)) {
        el.classList.remove(arg);
      } else {
        el.classList.add(arg);
      }
    });
  }

  children() {
    const childElements = [];
    this.elements.forEach(el => {
      childElements.push(...el.children);
    });
    return new DOMNodeCollection(childElements);
  }

  parent() {
    const parentElements = [];
    this.elements.forEach(el => {
      parentElements.push(el.parentElement);
    });
    return new DOMNodeCollection(parentElements);
  }

  find(arg) {
    const foundElements = [];
    this.elements.forEach(el => {
      foundElements.push(...el.querySelectorAll(arg));
    });
    return new DOMNodeCollection(foundElements);
  }

  remove() {
    this.empty();
    this.elements = [];
  }

  on(listener, callback) {
    if (!this.listeners[listener]) this.listeners[listener] = [];
    this.listeners[listener].push(callback);
    this.elements.forEach(el => {
      el.addEventListener(listener, callback);
    });
  }

  off(listener, callback) {
    if (callback) {
      this._removeSingleListener(listener, callback).bind(this);
    } else {
      this._removeAllListeners(listener).bind(this);
    }
  }


  _setHTML(arg) {
    this.elements.forEach(el => {
      el.innerHTML = arg;
    });
  }

  _setAttr(attr, val) {
    this.elements.forEach(el => {
      el.setAttribute(attr, val);
    });
  }

  _getElsToAppend(arg) {
    const toAppend = [];
    if (arg instanceof DOMNodeCollection) {
      arg.elements.forEach(el => {
        toAppend.push(el.outerHTML);
      });
    } else if (arg instanceof HTMLElement) {
      toAppend.push(arg.outerHTML);
    } else {
      toAppend.push(arg);
    }
    return toAppend;
  }

  _removeSingleListener(listener, callback) {
    this.elements.forEach(el => {
      el.removeEventListener(listener, callback);
    });
    let cbIndex = this.listeners[listener].indexOf(callback);
    delete this.listeners[listener][cbIndex];
  }

  _removeAllListeners(listener) {
    this.elements.forEach(el => {
      this.listeners[listener].forEach(cb => {
        el.removeEventListener(listener, cb);
      });
    });
    this.listeners[listener] = [];
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);