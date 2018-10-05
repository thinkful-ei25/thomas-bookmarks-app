'use strict';
/* global bookmarks $ api bookmarkList */
// eslint-disable-next-line no-unused-vars

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();
});

api.getItems((items) => {
  items.forEach((item) => bookmarks.addItem(item));
  bookmarkList.render();
  // console.log(bookmarks);
});

$.fn.extend({
  serializeJson: function() {
    if (!this.is('form')) throw new TypeError('Not a form type');
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});