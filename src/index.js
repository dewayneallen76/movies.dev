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

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td>' + movie.id + '</td>';
      content += '<td>' + movie.title + '</td>';
      content += '<td>' + movie.rating + '</td>';
      content += '</tr>';
    });
    $('#insertMovies').html(content);
  })
}

$('#add').submit(function(e) {
  var content = 'Loading ...';
  $('#insertMovies').html(content);
  displayMovies();
})
