/**
 * es6 modules and imports
 */
import $ from 'jquery';
import getMovies from './getMovies';
import fullpage from 'fullpage.js';
// variable for content so that content can be added with jQuery
var content = "";
// constant for json file containing the movies.
const apiBase = 'http://localhost:3000/movies';
/**
 * require style imports
 */
// var $ = require('jQuery');

// const getMovies = require('./getMovies.js');
//
/* Console log showing the movies from json-server */
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
fullpage.js, decided to got with a click event rather than scrolling for the effect that I was looking for. However removing this messes up the display of the movies page so I am leaving it.
*/
$('#fullpage').fullpage( {
  normalScrollElements: '.box',
  onLeave: function(index, nextIndex, direction) {
    var leavingSection = $(this);
    // runs the loadMovies function when scroll down from the curtains page.
    if(index == 1 && direction == 'down') {
      loadMovies();
    }
  }
});

// Function that shows the loading animation, and then runs the display movies function
function loadMovies() {
  $('.box').css('background-image', 'url("film2.gif")');
  displayMovies();
}

// Function that displays the movies in a table inside the box div
function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td class="id" style="display:none">' + movie.id + '</td>';
      content += '<td class="title"><input class="editTitle" value="' + movie.title + '"hidden><span class="movieTitle">' + movie.title + '</span></td>';
      content += '<td class="rating"><input type="number" min="1" max="5" class="editRating" value="' + movie.rating + '"hidden><span class="movieRating">' + movie.rating + '</span></td>';
      content += '<td><a class="edit">Edit</a></td>';
      content += '<td><a class="saveEdit save" style="display:none">Save</a></td>';
      content += '<td><a class="delete" style="color:red">X</a></td>';
      content += '</tr>';
    });
    $('#movies').css('display', 'block');
    $('#insertMovies').html(content);
    $('.box').css('background-image', 'none');
  })
}

// Click event for popcorn icon that starts the "curtain up" effect and runs the LoadMovies function so that the movies will be displayed.
$(document).on('click', '#scrollUp', function(){
  $('.curtains, .openingText').animate( {
    top: '-1000px'
  }, 1500)
  loadMovies();
});

// Click event for the alerts so that they can be closed after shown
$('.closeAlert').click(function() {
  $('.alert').hide();
})

// Click event to show the input to add movie and rating
$('.addMovie').click(function() {
  $('.showMovieInput').slideToggle();
})

// Function to add a new movie to the db.json file
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
      $('#alertAdded').show();
      $('#movies').css('display', 'none');
      $('.box').css('background-image', 'url(btf.gif)');
      displayMovies();
    }
    });
}
addMovie();

// Click event for edit
$('#insertMovies').on('click', '.edit', function() {


  $(this).parent().siblings('.title').children('.movieTitle').hide();
  $(this).parent().siblings('.title').children().first().show();

  $(this).parent().siblings('.rating').children('.movieRating').hide();
  $(this).parent().siblings('.rating').children().first().show();

  $(this).parent().siblings().children('.saveEdit').first().attr('style', 'display:block');
  $(this).first().attr('style', 'display:none');

})

// Click event for save to save the edits
$('#insertMovies').on('click', '.saveEdit', function() {
  var editId = $(this).parent().siblings('.id').text();
  var editTitle = $(this).parent().siblings('.title').children().first().val();
  var editRating = $(this).parent().siblings('.rating').children().first().val();
  var self = $(this);
  $('.box').css({backgroundImage: 'url("indy.gif")', zIndex: '2'});
  $('#movies').css('display', 'none');
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      if(movie.id == editId) {
        $.ajax({
          url: apiBase + '/' + editId,
          type: 'PUT',
          data: {
            'title' : editTitle,
            'rating' : editRating
          },
          success: function() {
            self.parent().siblings('.title').children('.movieTitle').show();
            self.parent().siblings('.title').children('.movieTitle').text(editTitle);
            self.parent().siblings('.title').children().first().hide();
            self.parent().siblings('.rating').children('.movieRating').show();
            self.parent().siblings('.rating').children('.movieRating').text(editRating);
            self.parent().siblings('.rating').children().first().hide();
            self.attr('style', 'display:none');
            self.parent().parent().find('.edit').attr('style', 'display:block');
          $('#alertEdit').show();
          $('.box').css('background-image', 'none');
          $('#movies').css('display', 'block');
          }
        });
      }
    })
  })
})

// Click event for delete button
$('#insertMovies').on('click', '.delete', function() {
  var deleteId = $(this).parent().siblings('.id').text();
  var deleteTitle = $(this).parent().siblings('.title').children().first().val();
  var deleteRating = $(this).parent().siblings('.rating').children().first().val();
  var self = $(this);

  $('#movies').css('display', 'none');
  $('.box').css('background-image', 'url("diehard.gif")');

  getMovies().then((movies) => {
    movies.forEach((movie) => {
      if(movie.id == deleteId) {
        $.ajax({
          url: apiBase + '/' + deleteId,
          type: 'DELETE',
          data: {
            'id': deleteId,
            'title': deleteTitle,
            'rating': deleteRating
          },
          success: function() {
            self.parent().parent().attr('style', 'display:none');
            $('#alertDelete').show();
            $('.box').css('background-image', 'none');
            $('#movies').css('display', 'block');
          }
        });
      }
    })
  });
})
