/**
 * es6 modules and imports
 */
import $ from 'jquery';
import getMovies from './getMovies';
import fullpage from 'fullpage.js'

var content = "";
// constant for json file containing the movies.
const apiBase = 'http://localhost:3000/movies';
/**
 * require style imports
 */
// var $ = require('jQuery');

// const getMovies = require('./getMovies.js');
//

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

/*
fullpage.js
*/
$('#fullpage').fullpage();


function loadMovies() {
  $('.box').css('background-image', 'url("film2.gif")');
  displayMovies();
}

loadMovies();

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td class="id" style="display:none">' + movie.id + '</td>';
      content += '<td class="title"><input class="editTitle" value="' + movie.title + '"hidden><span class="movieTitle">' + movie.title + '</span></td>';
      content += '<td class="rating"><input type="number" min="1" max="5" class="editRating" value="' + movie.rating + '"hidden><span class="movieRating">' + movie.rating + '</span></td>';
      content += '<td><input class="btn btn-primary edit" type="button" value="Edit Movie"></td>';
      content += '<td><input class="btn btn-success saveEdit" type="button" value="Save Edit" style="display:none"></td>';
      content += '<td><input class="btn btn-danger delete" type="button" value="Delete Movie" ></td>';
      content += '</tr>';
    });
    $('#movies').css('display', 'block');
    $('#insertMovies').html(content);
    $('.box').css('background-image', 'none');
  })
}

$('.addMovie').click(function() {
  $('.showMovieInput').slideToggle();
})

function addMovie() {
  $('#add').click(function(e) {
    if($('#title').val() === "") {
      $('#alertTitle').show();
    } else if($('#rating').val() === ""){
      $('#alertRating').show();
    }else if ($('#title').val() !== '') {
      $.post(apiBase, {
        title : $('#title').val(),
        rating : $('#rating').val()
      }),
      $('#title').val("");
      $('#rating').val("");
      $('.alert').hide();
      $('#movies').css('display', 'none');
      loadMovies();
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

})


$('#insertMovies').on('click', '.saveEdit', function() {
  var editId = $(this).parent().siblings('.id').text();
  var editTitle = $(this).parent().siblings('.title').children().first().val();
  var editRating = $(this).parent().siblings('.rating').children().first().val();

  alert(editId + " " + editTitle + " " + editRating);

  getMovies().then((movies) => {
    for(var i = 0; i < movies.length; i++) {
      if(movies[i].id == editId) {
        console.log(movies[i].title);
      }
    }
  })


})
// Click event for delete buttons
$('#insertMovies').on('click', '.delete', function() {
  alert('button clicked');
})
