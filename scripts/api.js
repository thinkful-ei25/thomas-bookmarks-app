'use strict';
/* global bookmarks $ api */

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/thomas';
  function getItems(callback){
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  // could not get this method to work just yet. leaving here for future updates.
  // function createBookmark(newBookmark, callback){
  // const newBookmark = JSON.stringify(jsonData);
  function createBookmark(newTitle, newUrl, description, stars, callback){
    const newBookmark = JSON.stringify({title: newTitle, url: newUrl, desc: description, rating: stars});
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      success: callback,
      error: (err) => {
        bookmarks.error = err.responseJSON.message;
        alert(bookmarks.error);
      },
    });
  }
  
  function updateBookmark(id, updateData, callback){
    updateData = JSON.stringify(updateData);
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: updateData,
      success: callback,
      error: (err) => {
        bookmarks.error = err.responseJSON.message;
        alert(bookmarks.error);
      },
    });
  }

  function deleteBookmark(id, callback){
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      success: callback,
    });
  }
  
  return {
    getItems,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
}());
