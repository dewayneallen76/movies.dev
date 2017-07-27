/**
 * es6 modules and imports
 */
import $ from 'jquery';
import getMovies from './getMovies';
import fullpage from 'fullpage.js'
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

$(document).on('click', '#scrollUp', function(){
  $('.curtains, .openingText').animate( {
    top: '-1000px'
  }, 1500)
  loadMovies();
});

$('.closeAlert').click(function() {
  $('.alert').hide();
})

function loadMovies() {
  $('.box').css('background-image', 'url("film2.gif")');
  displayMovies();
}

function displayMovies() {
  getMovies().then((movies) => {
    movies.forEach((movie) => {
      content += '<tr>';
      content += '<td class="id" style="display:none">' + movie.id + '</td>';
      content += '<td class="title"><input class="editTitle" value="' + movie.title + '"hidden><span class="movieTitle">' + movie.title + '</span></td>';
      content += '<td class="rating"><input type="number" min="1" max="5" class="editRating" value="' + movie.rating + '"hidden><span class="movieRating">' + movie.rating + '</span></td>';
      content += '<td><p class="edit">Edit</p></td>';
      content += '<td><p class="saveEdit" style="display:none">Save</p></td>';
      content += '<td><p class="delete" style="color:red">X</p></td>';
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
      $('#alertAdded').show();
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
  var self = $(this);
  $('.box').css({backgroundImage: 'url("film2.gif")', zIndex: '2'});
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
  $('.box').css('background-image', 'url("film2.gif")');

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
