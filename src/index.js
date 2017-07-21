/**
 * es6 modules and imports
 */
import $ from 'jquery';
import getMovies from './getMovies';

/**
 * require style imports
 */
// var $ = require('jQuery');

// const getMovies = require('./getMovies.js');
//
// constant for json file containing the movies.
const apiBase = 'http://localhost:3000/movies';

// ajax request to get the movies, and console log the data
$.ajax(apiBase)
    .done(data => console.log(data))
    .fail(error => console.log(error));

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});


var content = 'Loading ...';

function loadMovies() {
  $('#insertMovies').html(content);
  displayMovies();
}

loadMovies();

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      // // test for using x-editable
      // content += '<td><a href="#" id="title">MovieTitle</a>'
      content += '<td class="title"><input class="editTitle" value="' + movie.title + '"hidden><span class="movieTitle">' + movie.title + '</span></td>';
      content += '<td class="rating"><input type="number" min="1" max="5" class="editRating" value="' + movie.rating + '"hidden><span class="movieRating">' + movie.rating + '</span></td>';
      content += '<td><input class="btn btn-primary edit" type="button" value="Edit Movie"></td>';
      content += '<td><input class="btn btn-success saveEdit" type="button" value="Save Edit" style="display:none"></td>';
      content += '<td><input class="btn btn-danger delete" type="button" value="Delete Movie" ></td>';
      content += '</tr>';
    });
    $('#insertMovies').html(content);
  })
}

// test for x-editable, cannot get it to work
// $('#title').editable({
//     type: 'text',
//     pk: 1,
//     title: 'Enter username'
// });


function addMovie() {
  $('#add').click(function(e) {
    if($('.title').val() === "") {
      $('.alert').show();
    } else if($('.rating').val() === ""){
      $('#alertRating').show();
    }else if ($('.title').val() !== '') {
      $.post(apiBase, {
        title : $('.title').val(),
        rating : $('.rating').val()
      }),
      $('.title').val("");
      $('.rating').val("");
      content = 'Loading ...';
      $('.alert').hide();
      loadMovies();
      displayMovies();
    }
    });
}
addMovie();

// Click event for edit buttons
$('#insertMovies').on('click', '.edit', function() {


  $(this).parent().siblings('.title').children('.movieTitle').hide();
  $(this).parent().siblings('.title').children().first().show();

  $(this).parent().siblings('.rating').children('.movieRating').hide();
  $(this).parent().siblings('.rating').children().first().show();

  $(this).parent().siblings().children('.saveEdit').first().attr('style', 'display:block');
  $(this).first().attr('style', 'display:none');
  // Trying to hide the edit button when the save button appears

})

$('#insertMovies').on('click', '.saveEdit', function() {
  alert($(this).parent().siblings('.title').children().first().val() + " " + $(this).parent().siblings('.rating').children().first().val());
})
// Click event for delete buttons
$('#insertMovies').on('click', '.delete', function() {
  alert('button clicked');
})
