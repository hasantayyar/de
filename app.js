Array.prototype.unique = function() {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
};

// taken from http://codepen.io/bscherer/pen/ONYaQL
var filtr = "";

function startCode() {
  var $container = $('#container').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows', 
    getSortData: {
      name: '[data-isotope-sort-name]'
    }
  });

  filterItemHandler();
  searchItemHandler();
};

function filterItemHandler() {
  var $container = $('#container').isotope();

  $('#filters').on('click', 'button', function() {
    filtr = $(this).attr('data-filter');

    $container.isotope({
      filter: filtr
    });
    console.info('FILTER: ', filtr);
  });
}


function searchItemHandler() {
  var $container = $('#container').isotope();
  var qsRegex;

  var $quicksearch = $('#quicksearch').keyup(debounce(function() {
    qsRegex = new RegExp($quicksearch.val(), 'gi');
    $container.isotope({
      filter: function() {
        var $this = $(this);
        var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
        var buttonResult = filtr ? $this.is(filtr) : true;
        return searchResult && buttonResult;
      }
    });
  }, 200));
}

function debounce(fn, threshold) {
  var timeout;
  return function debounced() {
    if (timeout) {
      clearTimeout(timeout);
    }

    function delayed() {
      fn();
      timeout = null;
    }
    timeout = setTimeout(delayed, threshold || 100);
  }
}


$(document).ready(function() {

  var tags = [];

  $.getJSON('data.json?v2', function(data) {
    for (var i = 0; i < data.length; i++) {
      console.log(i)
      tags = tags.concat(data[i].tags).unique();
      $('#container').append('<div class="element-item ' + data[i].color + ' ' + data[i].tags.join(' ') + '" data-isotope-sort-name="s' + i + '"><span>' + i + '</span>' + data[i].question + '</div>');
    }


    // Append Buttons
    // ----------------------------
    for (var t = 0; t < tags.length; t++) {
      $('#filters').append('<button class="button" data-filter=".' + tags[t] + '">' + tags[t] + '</button>');
    }

    startCode();

  });


});


var itemReveal = Isotope.Item.prototype.reveal;
Isotope.Item.prototype.reveal = function() {
  itemReveal.apply(this, arguments);
  $(this.element).removeClass('isotope-hidden');
};

var itemHide = Isotope.Item.prototype.hide;
Isotope.Item.prototype.hide = function() {
  itemHide.apply(this, arguments);
  $(this.element).addClass('isotope-hidden');
};

$('.button-group').each(function(i, buttonGroup) {
  var $buttonGroup = $(buttonGroup);
  $buttonGroup.on('click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
    $('#quicksearch').val('');
  });
});
