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
$('#insertMovies').html(content);
displayMovies();

addMovie();

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td>' + movie.title + '</td>';
      content += '<td>' + movie.rating + '</td>';
      content += '<td><button id="delete">Delete</button></td>';
      content += '</tr>';
    });
    $('#insertMovies').html(content);
  })
}

function addMovie() {
  $('#add').click(function(e) {
    $.post(apiBase, {
      title : $("#title").val(),
      rating : $("#rating").val()
    }),
    content = 'Loading ...';
    $('#insertMovies').html(content);
    displayMovies();
  });
}
