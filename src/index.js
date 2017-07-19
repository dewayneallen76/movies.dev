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
addMovie();

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td id="title">' + movie.title + '</td>';
      content += '<td id="rating">' + movie.rating + '</td>';
      content += '<td><button id="edit">Edit Movie</button></td>';
      content += '<td><button id="delete">Delete Movie</button></td>';
      content += '</tr>';
    });
    loadMovies();
  })
}

function addMovie() {
  $('#add').click(function(e) {
    $.post(apiBase, {
      title : $("#title").val(),
      rating : $("#rating").val()
    }),
    content = 'Loading ...';
    loadMovies();
    displayMovies();
  });
}

function editMovie() {
  $('#edit').click(function(e) {
    $.put(apiBase, {
      title : $("#title").val(),
      rating : $("#rating").val()
    }),
    content = 'Loading ...';
    $
  })
}
