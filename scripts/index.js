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
