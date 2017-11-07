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
      this._setAttrs(attr, val);
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

  hide() {
    this.attr('style', 'display:none');
  }

  show() {
    this.attr('style', 'display:block');
  }

  _setHTML(arg) {
    this.elements.forEach(el => {
      el.innerHTML = arg;
    });
  }

  _setAttrs(attr, val) {
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
