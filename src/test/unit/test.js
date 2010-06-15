function htmlEquals(wymeditor, expected){
    equals( jQuery.trim( wymeditor.xhtml() ), jQuery.trim( expected ) );
}

/**
 * Move the selection to the start of the given element within the editor.
 */
function moveSelector(wymeditor, selectedElement){
    var sel = wymeditor._iframe.contentWindow.getSelection();

    var range = wymeditor._doc.createRange();
    range.setStart(selectedElement, 0);
    range.setEnd(selectedElement, 0);

    sel.removeAllRanges();
    sel.addRange(range);
}

/**
 * Determine if this element is editable.
 * Mimics https://developer.mozilla.org/en/DOM/element.isContentEditable
 */
function isContentEditable(element) {
    if(element.contentEditable == '' || element.contentEditable == null){
        return true;
    }else if(element.contentEditable == true) {
        return true;
    }else if(element.contentEditable == false) {
        return false;
    }else {
        return isContentEditable(element.parentNode);
    }
}

module("Core");

test("Instantiate", function() {
    expect(2);
    jQuery('.wymeditor').wymeditor({
        stylesheet: 'styles.css',
        postInit: function() { runPostInitTests() }
    });
    equals( WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length" );
    equals( typeof(jQuery.wymeditors(0)), 'object', "Type of first WYMeditor instance, using jQuery.wymeditors(0)" );
});

module("API");

test("Commands", function() {
    expect(2);
    jQuery.wymeditors(0).toggleHtml();
    equals( jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 1 );
    jQuery.wymeditors(0).toggleHtml();
    equals( jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 0 );
});

module("CssParser");

test("Configure classes items using CSS", function() {
    expect(2);
    ok( jQuery('div.wym_classes ul', jQuery.wymeditors(0)._box).length > 0, "Classes loaded" );
    equals( jQuery('div.wym_classes a:first-child', jQuery.wymeditors(0)._box).attr('name'), 'date', "First loaded class name" );
});

module("XmlHelper");

test("Should escape URL's only once #69.1", function() {
    expect(2);
    var original = "index.php?module=x&func=view&id=1";
    var expected = "index.php?module=x&amp;func=view&amp;id=1";
    equals( jQuery.wymeditors(0).helper.escapeOnce( original ), expected, "Escape entities");
    equals( jQuery.wymeditors(0).helper.escapeOnce( expected ), expected, "Avoids double entity escaping");
});

module("XmlParser");

test("Should correct invalid lists", function() {
    expect(2);
    var expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<\/li><\/ul>";
    // FF
    var design_mode_pseudo_html = "<ul><li>a<\/li><ul><li>a.1<\/li><\/ul><li>b<br><\/li><\/ul>";
    equals( jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected, "on Firefox");
    // IE
    var design_mode_pseudo_html = "<UL>\r\n<LI>a<\/LI>\r\n<UL>\r\n<LI>a.1<\/LI><\/UL>\r\n<LI>b<\/LI><\/UL>";
    equals( jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected, "on IE");
});

test("Shouldn't remove empty td elements", function() {
    expect(1);
    var expected = '<table><tr><td>Cell1</td><td></td></tr></table>';
    var empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
    equals( jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function() {
    expect(1);
    var original = "<pre>One<br>Two<br>Three</pre><p>Test</p><pre>Three<br>Four<br>Five</pre>";
    var expected = "<pre>One\r\nTwo\r\nThree</pre><p>Test</p><pre>Three\r\nFour\r\nFive</pre>";
    equals( jQuery.wymeditors(0).parser.parse(original), expected, "Remove BR in PRE" );
});



function runPostInitTests() {
    module("Post Init");

    test("Commands: html(), paste()", function() {
        expect(2);
        var testText1 = '<p>This is some text with which to test.<\/p>';
        jQuery.wymeditors(0).html( testText1 );
        equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 );

        var testText2 = 'Some <strong>other text<\/strong> with which to test.';
        jQuery.wymeditors(0)._doc.body.focus();
        jQuery.wymeditors(0).paste( testText2 );
        equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 + '<p>' + testText2 + '<\/p>' );
    });

    test("Adding combined CSS selectors", function () {
        expect(1);

        var doc = jQuery.wymeditors(0)._doc,
        styles = doc.styleSheets[0];

        jQuery.wymeditors(0).addCssRule(styles, {name:'p,h1,h2', css:'font-style:italic'});
        equals(jQuery('p', doc).css('fontStyle'), 'italic', 'Font-style');
    });

    module("List Manipulation");

    var nestedListHtml = '' +
    '<ol>' +
        '<li>one</li>' +
        '<li>two' +
            '<ol>' +
                '<li>two- one</li>' +
                '<li>two- two</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

    test("Top-level list indent", function() {
        expect(1);

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html(nestedListHtml);

        var $body = $(wymeditor._doc).find('body.wym_iframe');
        var $ol = $body.find('ol:first');

        // Set the selector to the secondLi
        var secondLi = $ol.find('li')[0];
        moveSelector(wymeditor, secondLi);

        // Click the indent button
        var indent_button = jQuery(wymeditor._box)
            .find(wymeditor._options.toolsSelector)
            .find('.wym_tools_indent a');
        indent_button.click();

        //Make sure the second item was indented
        var expectedListHtml = '' +
        '<ol>' +
            '<li>one' +
                '<ol>' +
                    '<li>two</li>' +
                    '<li>two- one</li>' +
                    '<li>two- two</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

        htmlEquals(wymeditor, expectedListHtml)
    });

    test("Second-level list indent", function() {
        expect(1);

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html(nestedListHtml);

        var $body = $(wymeditor._doc).find('body.wym_iframe');
        var $ol = $body.find('ol:first');

        // Set the selector to the twoTwoLi
        var twoTwoLi = $ol.find('ol li')[1];
        moveSelector(wymeditor, twoTwoLi);

        // Click the indent button
        var indent_button = jQuery(wymeditor._box)
            .find(wymeditor._options.toolsSelector)
            .find('.wym_tools_indent a');
        indent_button.click();

        //Make sure the 4th item was indented
        var expectedListHtml = '' +
        '<ol>' +
            '<li>one</li>' +
            '<li>two' +
                '<ol>' +
                    '<li>two- one' +
                        '<ol>' +
                            '<li>two- two</li>' +
                        '</ol>' +
                    '</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

        htmlEquals(wymeditor, expectedListHtml)
    });

    module("Table Insertion");

    test("Table is editable after insertion", function() {
        expect(7);

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html('');

        var $body = $(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function(index, td) {
            equals( isContentEditable(td), true);
        });

        var dm = wymeditor._doc.designMode
        ok(dm == 'on' || dm == 'On');
    });

    // Only FF > 3.5 seems to require content in <td> for them to be editable
    if($.browser.mozilla) {
        test("Table cells have content in FF > 3.5", function() {
            expect(6);

            var wymeditor = jQuery.wymeditors(0);
            wymeditor.html('');

            var $body = $(wymeditor._doc).find('body.wym_iframe');
            wymeditor.insertTable(3, 2, '', '');

            $body.find('td').each(function(index, td) {
                if($.browser.version >= '1.9.2') {
                    equals( td.childNodes.length, 1);
                } else {
                    equals( td.childNodes.length, 0);
                }
            });
        });
    }

    // If there is no element in front of a table in FF or ie, it's not possible
    // to put content in front of that table.
    test("Tables at ends have <br> placeholder in front/back", function() {
        expect(2);

        var is_double_br_browser = $.browser.mozilla || $.browser.webkit || $.browser.safari;

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html('');

        var $body = $(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        var children = $body.children()
        if(is_double_br_browser){
            equals( children.length, 3 );
        } else{
            equals( children.length, 2 );
        }

        var first_child = children[0];
        var last_child = children[children.length - 1];

        if(is_double_br_browser){
            expect(3);
            // Should have a br as the first child of the body
            ok($(first_child).is('br'), 'First child is a br' );

            // In FF, need a br at the end
            ok( $(last_child).is('br'), "Last child is a br");
        }
        if($.browser.msie){
            expect(2);
            // Should have a br as the first child of the body
            ok($(first_child).is('br'), 'First child is a br' );
        }
    });

    test("Consecutive tables have a <br> placeholder between them", function() {
        expect(1);

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html('<p>first</p><p>last</p>');

        var $body = $(wymeditor._doc).find('body.wym_iframe');

        // Move the selector to the first paragraph
        var first_p = $body.find('p')[0];
        moveSelector(wymeditor, first_p);

        // Insert two tables between the two <p> tags
        wymeditor.insertTable(3, 2, '', '');
        wymeditor.insertTable(3, 2, '', '');

        var children = $body.children()

        // Ensure there is a br with a table both before and after it
        var table_after_spacing = $body.find('table + br').next('table');
        equals( table_after_spacing.length, 1);
    });

    test("Tables should only have <br> placeholders if they're ends", function() {
        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html('<p>first</p><p>middle</p><p>last</p>');

        var $body = $(wymeditor._doc).find('body.wym_iframe');

        // Set the selectors in the middle paragraph
        var middle_p = $body.find('p')[1];
        moveSelector(wymeditor, middle_p);

        // Should insert the table after the middle paragraph but before last
        wymeditor.insertTable(1, 1, 'cap', '');

        var expected_html = '' +
        '<p>first</p>' +
        '<p>middle</p>' +
        '<table>' +
            '<caption>cap</caption>' +
            '<tbody>' +
                '<tr><td></td></tr>' +
            '</tbody>' +
        '</table>' +
        '<p>last</p>';
        htmlEquals(wymeditor, expected_html);

        // Shouldn't be any <br>'s floating around
        $body.children().each(function (index, element) {
            ok( $(element).is('br') == false, "Child index:" + index + " is NOT br");
        });

        expect(1 + $body.children().length);
    });
};