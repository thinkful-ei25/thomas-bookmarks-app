'use strict';
/* global bookmarks $ api */
// eslint-disable-next-line no-unused-vars

const bookmarkList = (function() {

  function generateBookmarkElement(bookmark) {
    let content = '';
    if (bookmark.expanded) {
      content = ` 
      <div class="bookmark-description-container js-bookmark-description-container">
        <div class="bookmark-user-description-input">${bookmark.desc}</div>
        <div class="bookmark-visit-site-delete-btns">
          <button type="button" class="bookmark-visit-site-btn js-bookmark-visit-site-btn" onclick=" window.open('${bookmark.url}','_blank')">Visit Site</button>
          <button type="button" class="bookmark-delete-btn js-bookmark-delete-btn">Delete</button>
          <button type="button" class="bookmark-edit-btn js-bookmark-edit-btn">Edit</button>
        </div>
      </div>`;
    }
    return `
      <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-container">
          <div class="bookmark-title-container"><span class="bookmark-title-vert-align">${bookmark.title}</span>
          <button type="button" class="bookmark-expand-details js-bookmark-expand-details">See Details</button>
            <div class=""><span>${bookmark.rating}/5 stars</span></div>
          </div>
          ${content}
        </div>
      </li>
    `;
  }

  function generateAddingBookmarkElement() {
    return `

        <h2>Add New Bookmark</h2>
        <input type="text" name="title" class="js-bookmark-title-entry bookmark-title-entry" placeholder="Bookmark Title">
        <input type="text" name="url" class="js-bookmark-url-entry bookmark-url-entry" placeholder="https://">
        
        <textarea rows="8" cols="50" maxlength="300" name="desc" form="bookmark-description-entry" class="js-bookmark-user-description-entry bookmark-user-description-entry" placeholder="Enter bookmark description here..."></textarea>
        
        <div class="select-rating-radio-btns">
          Select a rating:<br><br>
          <input type="radio" name="rating" class="five-stars-radio" value="5"> 5 stars &nbsp;<span>★★★★★</span><br>
          <input type="radio" name="rating" class="four-stars-radio" value="4"> 4 stars &nbsp;<span>★★★★☆</span><br>
          <input type="radio" name="rating" class="three-stars-radio" value="3"> 3 stars &nbsp;★★★☆☆</span><br>
          <input type="radio" name="rating" class="two-stars-radio" value="2"> 2 stars &nbsp;<span>★★☆☆☆</span><br>
          <input type="radio" name="rating" class="one-stars-radio" value="1"> 1 star &nbsp;&nbsp;&nbsp;<span>★☆☆☆☆</span><br>
        </div>  
        
        <div> 
          <button type="submit">Create New Bookmark</button>
        </div>

    `;
  }

  function generateBookmarkString(bookmarkList) {
    const bookmarkItemList = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarkItemList.join('');
  }

  function render() {
    let bookmark = bookmarks.items;

    if (bookmarks.adding === true) {
      const bookmarkAddingString = generateAddingBookmarkElement();
      $('.bookmark-title-url-entry-form').html(bookmarkAddingString);
    } else {
      $('.bookmark-title-url-entry-form').html('');
    }

    if (bookmarks.filterByValue <= 5) {
      bookmark = bookmarks.items.filter(bookmark => bookmark.rating >= bookmarks.filterByValue);
    }

    const bookmarkListString = generateBookmarkString(bookmark);
    $('.js-bookmark-list').html(bookmarkListString);
  }

  function handleAddBookmark() {
    $('.js-add-bookmark').on('click', '.js-add-bookmark-btn', event => {
      event.preventDefault();
      bookmarks.adding = true;
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-create-bookmark-form').submit(function(event) {
      event.preventDefault();

      // store user input values
      const newBookmarkName = $('.js-bookmark-title-entry').val();
      $('.js-bookmark-title-entry').val('');
      const newBookmarkURL = $('.js-bookmark-url-entry').val();
      $('.js-bookmark-url-entry').val('');
      const newBookmarkDescription = $('.js-bookmark-user-description-entry').val();
      $('.js-bookmark-user-description-entry').val('');
      const newStarRating = $('input[name=rating]:checked').val();
      $('input[name=rating]:checked').val('');

      // create and add to both API and DOM
      api.createBookmark(newBookmarkName, newBookmarkURL, newBookmarkDescription, newStarRating, (callback) => {
        bookmarks.addItem(callback);
        bookmarks.adding = false;
        render();
      });
    });
  }

  // NOTE: could not get this code to work with my <textarea> input.
  //
  // function handleNewBookmarkSubmit () {
  //   $('#js-create-bookmark-form').submit(function(event) {
  //     event.preventDefault();
  //     const jsonData = $(event.target).serializeJson();
  //     console.log('logging jsonData' + jsonData);
  //     api.createBookmark(jsonData, (callback) => {
  //       bookmarks.addItem(callback);
  //       bookmarks.adding = false;
  //       render();
  //     });
  //     console.log('logging bookmarks' + bookmarks);
  //   });
  // }

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete-btn', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        bookmarks.findAndDelete(id);
        render();
      });
    });
  }

  function handleBookmarkDescriptionToggle() {
    $('.js-bookmark-list').on('click', '.js-bookmark-expand-details', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = bookmarks.items.find((item) => id === item.id);
      const expandedStatus = !bookmark.expanded;
      bookmarks.findAndUpdate(id, {expanded: expandedStatus});
      render();
    });
  }

  function handleBookmarkRatingFilter() {
    $('.dropdown').on('click', 'a', function(event) {
      const filterByRating = $(event.target).data('value');
      bookmarks.filterByValue = filterByRating;
      render();
    });
  }

  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleDeleteBookmarkClicked();
    handleBookmarkDescriptionToggle();
    handleAddBookmark();
    handleBookmarkRatingFilter();
  }

  return {
    render,
    bindEventListeners,
  };

}());