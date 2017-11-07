const DOMNodeCollection = require('./dom_node_collection.js');

const listenerCallbacks = [];

const $l = function(arg) {
  if (typeof arg === 'string') {
    const els = Array.from(document.querySelectorAll(arg));
    return new DOMNodeCollection(els);
  } else if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  }else if (arg instanceof Function) {
    listenerCallbacks.push(arg);
  }
};

$l.extend = function(arg1,...args) {
  return Object.assign(arg1, ...args);
};

$l.ajax = function(options) {
  const params = getParams(options);
  return createPromise(params);
};

window.$l = $l;

document.addEventListener("DOMContentLoaded", function(){
  listenerCallbacks.forEach((el) => {
    el();
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
  return $l.extend(defaults, options);
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
