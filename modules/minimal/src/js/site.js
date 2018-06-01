jQuery.noConflict();

(function($) {
  'use strict';

  function makeIdString(str) {
    return str.toLowerCase().replace(/ /g, '-');
  }

  function populateTitle(e) {
    $('[id^=name]').text(e.name);
    $('[id^=title]').text(e.title);
  }

  function populateAbout(about) {
    $('#about').append(about.title);

    about.paragraphs.forEach(function(paragraph) {
      $('#about\\.paragraphs').append('<p>' + paragraph + '</p>');
    });
  }

  function populateSkills(skills) {
    $('#skills').append(skills.title);

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

  function populateHistoryCompanyDescription(description, $page) {
    $page.append(
      $('<div>')
        .addClass('col-12')
        .append(
          $('<p>')
            .addClass('text-muted')
            .text(description)
        )
    );
  }

  function populateHistoryCompanyContact(contact, $page) {
    $page.append(
      $('<div>')
        .addClass('col-12')
        .append(
          $('<small>')
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
        )
        .append($('<hr>'))
    );
  }

  function populatePositionAccomplishments(accomplishments, $page) {
    var $statements = $('<ul>');

    accomplishments.forEach(function(accomplishment) {
      if (accomplishment.statement) {
        $statements.append($('<li>').text(accomplishment.statement));
      }
    });

    $page.append(
      $('<div>')
        .addClass('col-12')
        .append($statements)
    );
  }

  function populateHistoryContent(history) {
    var $page = $('<div>').addClass('row');

    populateHistoryCompanyDescription(history.description, $page);
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

      if (position.accomplishments) {
        populatePositionAccomplishments(position.accomplishments, $page);
      }
    });

    return $page;
  }

  function populateExperience(experience) {
    $('#experience').append(experience.title);

    var first = true;
    experience.history.forEach(function(history) {
      $('#experience\\.tabs').append(
        buildNavigationTab(
          makeIdString(history.company),
          history.company,
          first
        )
      );

      $('#experience\\.content').append(
        buildNavigationContent(
          makeIdString(history.company),
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
      buildNavigationTab(
        makeIdString(undergraduate.title),
        undergraduate.title,
        true
      )
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
      buildNavigationContent(makeIdString(undergraduate.title), true, $page)
    );
  }

  function populatePluralsight(pluralsight) {
    $('#education\\.tabs').append(
      buildNavigationTab(
        makeIdString(pluralsight.title),
        pluralsight.title,
        false
      )
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
      buildNavigationContent(makeIdString(pluralsight.title), false, $page)
    );
  }

  function populateEducation(education) {
    $('#education').append(education.title);

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

    $('#github-link').attr('href', data.github);
    $('#linkedin-link').attr('href', data.linkedin);
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
      url: '/i18n/data.' + lang + '.json',
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
