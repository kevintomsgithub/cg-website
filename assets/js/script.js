// Collapse Nav bar on click
$('.navbar-nav>a').on('click', function() {
    $('.navbar-collapse').collapse('hide');
});

var firstNResults = 10;
var resultsId = 0

function flushSuggestions() {
    $('#suggestions').empty()
        // $('#results').empty()
        // $('#suggestions').hide()

}

function flushResults() {
    $('#results').empty()
    $('#accordion').hide()
        // $('#suggestions').hide()
}

$('body').click(function(event) {
    flushSuggestions()
});

function createSearchResults(documentReferences, completeKeywords) {

    $('#suggestions').height(0)

    documentReferences.forEach(index => {

        question = docIndex[index]['question']
        answer = docIndex[index]['answer']

        completeKeywords.forEach(query => {
            question = question.replaceAll(' ' + query + ' ', ' ' + '<span class=\"highlighted\">' + query + '</span>' + ' ')
            answer = answer.replaceAll(' ' + query + ' ', ' ' + '<span class=\"highlighted\">' + query + '</span>' + ' ')
        });

        var result_pair = " \
                <div class=\"card\"> \
                    <div class=\"card-header\" id=\"headingOne\"> \
                        <h2 class=\"mb-0\">  \
                            <button class=\"btn btn-link btn-block text-left\" id=\"qstId-" + resultsId + "\" type=\"button\" data-toggle=\"collapse\" data-target=\"#result-" + resultsId + "\" aria-expanded=\"true\" aria-controls=\"collapseOne\"></button> \
                        </h2> \
                    </div> \
                    <div id=\"result-" + resultsId + "\" class=\"collapse\" aria-labelledby=\"headingOne\" data-parent=\"#results\"> \
                        <div id=\"ansId-" + resultsId + "\" class=\"card-body\"></div> \
                </div> \
                "
        $('#results').append(result_pair)
        $('#qstId-' + resultsId).html(question)
        $('#ansId-' + resultsId).html(answer)
        resultsId += 1
    });
}

function populateSuggestions(incompleteQuery, lastKeyword, completeKeywords) {
    results = data[lastKeyword].slice(0, firstNResults)
    results.forEach(result => {
        var suggestionString = ('<b>' + incompleteQuery + '</b>' + ' ' + result.replace(lastKeyword, '<b>' + lastKeyword + '</b>'))
        var args = completeKeywords.concat(result)
        $('#suggestions').append("<li class='list-group-item' onclick=\"fillSearchWithSuggestion('" + args + "')\">" + suggestionString + "</li>")
    });
}

function fillSearchWithSuggestion(completeKeywords) {

    completeKeywords = completeKeywords.split(',')
    var completeQuery = completeKeywords.join(' ')

    var documentResultSet = []

    $('#search-query').val(completeQuery)
    flushSuggestions()
    flushResults()

    var resultsFlag = false;

    completeKeywords.forEach(query => {
        if (invertedIndex.hasOwnProperty(query)) {
            documentResultSet = documentResultSet.concat(invertedIndex[query].doc)
            resultsFlag = true
        }
    });

    let documentResultArray = Array.from(new Set(documentResultSet));

    createSearchResults(documentResultArray, completeKeywords)

    if (resultsFlag == false) {
        flushResults()
        $('#results').append("<p id='no-results'> No results found :( </p>")
    }
}

$('#search-query').keyup(function(e) {
    if (e.keyCode != 40 && e.keyCode != 38) {

        var query = $('#search-query').val().toLowerCase()
        query = query.replace(/\s+/g, ' ').trim()
        var completeKeywords = query.split(' ').slice(0, -1)

        // Enter code
        if (e.keyCode == 13) {

            var queryText = $('#search-query').val()

            if ($('li').length == 1) {
                queryText = $('li').text()
                $('#search-query').val(queryText)
                $('li').click()
                return
            }
            if ($('li.selection').length != 0) {
                queryText = $('li.selection').text()
                $('#search-query').val(queryText)
                $('li.selection').click()
                return
            }
            fillSearchWithSuggestion(query.split(' ').join(','))
        } else {
            // Tab code
            if (e.keyCode == 9) {
                e.preventDefault();
                return
            }
            // Flush the elements in the results
            flushSuggestions()

            var lastKeyword = query.split(' ').slice(-1)[0]
            var incompleteQuery = query.split(' ').slice(0, -1).join(' ')

            // Space code
            if (e.keyCode == 32) {
                populateSuggestions(query, 'a', completeKeywords)
                return
            }
            // Populate the results if key found
            if (data.hasOwnProperty(lastKeyword)) {
                populateSuggestions(incompleteQuery, lastKeyword, completeKeywords)
                    // $('#suggestions').fadeIn(100)
            } else if (query) {
                // flushResults()
                // $('#suggestions').append("<p id='no-results'> No results found :( </p>")
                // $('#results').append("<p id='no-results'> No results found :( </p>")
                // $('#suggestions').fadeIn(100)
            }
        }
    }
});

// Arrow keys heighlight
$(document).keydown(function(e) {
    var $hlight = $('li.selection'),
        $div = $('li');
    if (e.keyCode == 40) {
        // Move Down
        $hlight.removeClass('selection').next().addClass('selection');
        if ($hlight.next().length == 0) {
            $div.eq(0).addClass('selection')
        }
        $('#search-query').val($('li.selection').text() + ' ')
    } else if (e.keyCode === 38) {
        // Move Up
        $hlight.removeClass('selection').prev().addClass('selection');
        if ($hlight.prev().length == 0) {
            $div.eq(-1).addClass('selection')
        }
        $('#search-query').val($('li.selection').text() + ' ')
    }
    // Tab code
    if (e.keyCode == 9) {
        e.preventDefault();
        var query = $('#search-query').val()
        var completeKeywords = query.split(' ').slice(0, -1)

        var firstSuggestion = $('li').first().text() + ' '
        $('#search-query').val(firstSuggestion)
        flushSuggestions()
        populateSuggestions(firstSuggestion, 'a', completeKeywords)
        return
    }
})