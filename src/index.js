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
      content += '<td id="title">' + movie.title + '</td>';
      content += '<td id="rating">' + movie.rating + '</td>';
      content += '<td><input class="btn btn-primary edit" type="button" value="Edit Movie"></td>';
      content += '<td><input class="btn btn-danger delete" type="button" value="Delete Movie" ></td>';
      content += '</tr>';
    });
    $('#insertMovies').html(content);
  })
}


function addMovie() {
  $('#add').click(function(e) {
    if($('#title').val() === "") {
      $('.alert').show();
    } else if($('#rating').val() === ""){
      $('#alertRating').show();
    }else if ($('#title').val() !== '') {
      $.post(apiBase, {
        title : $('#title').val(),
        rating : $('#rating').val()
      }),
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
  alert('button clicked');
})

// Click event for delete buttons
$('#insertMovies').on('click', '.delete', function() {
  alert('button clicked');
})
