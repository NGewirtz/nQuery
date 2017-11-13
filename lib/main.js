const DOMNodeCollection = require('./dom_node_collection.js');

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

  $n('.list-count').hide();

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
    $n.ajax({url: "https://api.openweathermap.org/data/2.5/weather?q=New%20York,us&units=imperial&appid=bcb83c4b54aee8418983c2aff3073b3b"})
    .then(data => {
      if (data.main.temp < 60) {
        $n('#todo-list').append(`<li>Bring A Jacket!</li>`);
      } else {
        alert("You Don't Need A Jacket");
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

  $n('h1').on('mouseenter', () => {
    $n('.header').hide();
    $n('.list-count').show();
    const s = $n('ul').children().elements.length === 1 ? "" : "s";
    $n('.list-count').html(`${$n('ul').children().elements.length} Item${s}`);
  });

  $n('h1').on('mouseleave', () => {
    $n('.header').show();
    $n('.list-count').hide();
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
