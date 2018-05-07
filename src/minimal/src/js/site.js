// MIT License

// Copyright (c) 2018 Jim Reid

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

jQuery.noConflict();

(function($) {
  'use strict';

  function populateTitle(e) {
    $('[id^=name]').text(e.name);
    $('[id^=title]').text(e.title);
  }

  function populateAbout(about) {
    $('#about').text(about.title);

    about.paragraphs.forEach(function(paragraph) {
      $('#about\\.paragraphs').append('<p>' + paragraph + '</p>');
    });
  }

  function populateSkills(skills) {
    $('#skills').text(skills.title);

    skills.sections.forEach(function(section) {
      var $sections = $('#skills\\.content');

      $sections.append(
        $('<div>')
          .addClass('col-12 pt-2')
          .append($('<strong>').text(section.title))
      );

      var $values = $('<div>').addClass(
        'd-flex flex-wrap mt-2 justify-content-center justify-content-lg-start'
      );

      section.values.forEach(function(value) {
        $values.append(
          $('<div>')
            .addClass('flex-fill shadow-sm rounded bg-light')
            .addClass('px-2 py-1 mx-2 my-1 text-center')
            .text(value)
        );
      });

      $sections.append(
        $('<div>')
          .addClass('col-12')
          .append($values)
      );
    });
  }

  function buildNavigationTab(id, title, active) {
    return $('<li>')
      .addClass('nav-item')
      .append(
        $('<a>')
          .attr('id', id + '-tab')
          .attr('href', '#' + id)
          .attr('data-toggle', 'tab')
          .attr('aria-controls', id)
          .attr('aria-selected', active)
          .addClass(active ? 'nav-link active' : 'nav-link')
          .text(title)
      );
  }

  function buildNavigationContent(id, active, content) {
    return $('<div>')
      .attr('id', id)
      .attr('role', 'tabpanel')
      .attr('aria-labelledby', id + '-tab')
      .addClass('tab-pane fade')
      .addClass(active ? 'show active' : '')
      .append(content);
  }

  function populateHistoryCompanyContact(contact, $page) {
    $page.append(
      $('<div>')
        .addClass('col-12')
        .text(
          contact.address.street +
            ' ' +
            contact.address.city +
            ', ' +
            contact.address.state +
            ' ' +
            contact.address.zip +
            ' | ' +
            contact.phone +
            ' | '
        )
        .append(
          $('<a>')
            .attr('href', contact.website.link)
            .text(contact.website.title)
        )
        .append($('<hr>'))
    );
  }

  function populatePositionSections(sections, $page) {
    var first = true;

    var $wrapper = $('<div>').addClass('');

    sections.forEach(function(section) {
      var $section = $('<p>').text(section.title);

      if (!first) {
        $section.addClass('mt-3');
      }

      if (section.values) {
        var $values = $('<ul>');

        section.values.forEach(function(value) {
          $values.append($('<li>').text(value));
        });

        $section.append($values);
      }

      $wrapper.append($section);
      first = false;
    });

    $page.append(
      $('<div>')
        .addClass('col-12')
        .append($wrapper)
    );
  }

  function populateHistoryContent(history) {
    var $page = $('<div>').addClass('row');

    populateHistoryCompanyContact(history.contact, $page);

    history.positions.forEach(function(position) {
      $page.append(
        $('<div>')
          .addClass('col-12 pb-3')
          .append($('<strong>').text(position.title))
          .append(
            $('<small>')
              .addClass('pl-1')
              .text(position.duration)
          )
      );

      if (position.sections) {
        populatePositionSections(position.sections, $page);
      }
    });

    return $page;
  }

  function populateExperience(experience) {
    $('#experience').text(experience.title);

    var first = true;
    experience.history.forEach(function(history) {
      $('#experience\\.tabs').append(
        buildNavigationTab(history.id, history.company, first)
      );

      $('#experience\\.content').append(
        buildNavigationContent(
          history.id,
          first,
          populateHistoryContent(history)
        )
      );

      if (first) {
        first = false;
      }
    });
  }

  function populateUndergraduate(undergraduate) {
    $('#education\\.tabs').append(
      buildNavigationTab(undergraduate.id, undergraduate.title, true)
    );

    var $page = $('<div>').addClass('row justify-content-start');

    undergraduate.programs.forEach(function(program) {
      $page
        .append(
          $('<div>')
            .addClass('col-12 col-lg-4')
            .append(
              $('<address>')
                .append($('<strong>').text(program.title))
                .append($('<br>'))
                .append(program.contact.address.street)
                .append($('<br>'))
                .append(
                  program.contact.address.city +
                    ', ' +
                    program.contact.address.state +
                    ' ' +
                    program.contact.address.zip
                )
                .append($('<br>'))
                .append(
                  $('<abbr>')
                    .attr('title', 'Phone')
                    .text('P:')
                )
                .append(' ' + program.contact.phone)
            )
        )
        .append(
          $('<div>')
            .addClass('col-12 col-lg-2')
            .append($('<strong>').text(program.degree.title))
            .append(
              $('<p>')
                .addClass('mb-1')
                .text(program.degree.value)
            )
        )
        .append(
          $('<div>')
            .addClass('col-12 col-lg-2')
            .append($('<strong>').text(program.major.title))
            .append(
              $('<p>')
                .addClass('mb-1')
                .text(program.major.value)
            )
        )
        .append(
          $('<div>')
            .addClass('col-12 col-lg-2')
            .append($('<strong>').text(program.class.title))
            .append(
              $('<p>')
                .addClass('mb-1')
                .text(program.class.value)
            )
        );
    });

    $('#education\\.content').append(
      buildNavigationContent(undergraduate.id, true, $page)
    );
  }

  function populatePluralsight(pluralsight) {
    $('#education\\.tabs').append(
      buildNavigationTab(pluralsight.id, pluralsight.title, false)
    );

    var $page = $('<div>').addClass('row');

    pluralsight.courses.forEach(function(course) {
      $page.append(
        $('<div>')
          .addClass('col-12 col-lg-6 col-xl-4')
          .append(
            $('<blockquote>')
              .addClass('blockquote')
              .append(
                $('<p>')
                  .addClass('mb-0')
                  .text(course.title)
              )
              .append(
                $('<footer>')
                  .addClass('blockquote-footer')
                  .text(course.author)
                  .append(
                    $('<a>')
                      .attr('href', course.link)
                      .attr('target', '_blank')
                      .addClass('text-secondary')
                      .append(
                        $('<i>').addClass('fas fa-external-link-alt fa-sm ml-1')
                      )
                  )
              )
          )
      );
    });

    $('#education\\.content').append(
      buildNavigationContent(pluralsight.id, false, $page)
    );
  }

  function populateEducation(education) {
    $('#education').text(education.title);

    if (education.undergraduate) {
      populateUndergraduate(education.undergraduate);
    }

    if (education.pluralsight) {
      populatePluralsight(education.pluralsight);
    }
  }

  function populateDocument(data) {
    populateTitle(data);
    populateAbout(data.about);
    populateSkills(data.skills);
    populateExperience(data.experience);
    populateEducation(data.education);
  }

  function getQueryParameterByName(name, url) {
    url = url || window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);

    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  $(function() {
    var lang = getQueryParameterByName('lang') || 'en';

    $.ajax({
      type: 'GET',
      url: 'i18n/data.' + lang + '.json',
      success: function(data) {
        populateDocument(data);

        anchors.add();

        $('#content')
          .hide()
          .removeClass('d-none');

        $('#spinner').fadeOut(500, function() {
          $('#content').fadeIn(500);
        });
      }
    });
  });
})(jQuery);
