module("Core");

test("Instantiate", function() {
	expect(2);
	jQuery('.wymeditor').wymeditor({
		stylesheet: 'styles.css',
		postInit: function(wym) {
			var table_editor = wym.table();
			table_editor.init();
			runPostInitTests();
		}
	});
	equals( WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length" );
	equals( typeof(jQuery.wymeditors(0)), 'object', "Type of first WYMeditor instance, using jQuery.wymeditors(0)" );
});

/**
* Run a table modification and verify the results.
*
* @param selector jQuery selector for the element to modify (the first match is used)
* @param action A string with either 'add' or 'remove'
* @param type A string with either 'row' or 'column'
* @param startHtml The starting HTML
* @param expectedHtml The expected HTML result.
*/
function testTable( selector, action, type, startHtml, expectedHtml ) {
	var wymeditor = jQuery.wymeditors(0);
	wymeditor.html( startHtml );

	var $body = $(wymeditor._doc).find('body.wym_iframe');
	var actionElmnt = $body.find(selector)[0];

	if ( action === 'add' ) {
		if ( type === 'row' ) {
			wymeditor.table_editor.addRow(actionElmnt);
		} else {
			wymeditor.table_editor.addColumn(actionElmnt);
		}
	} else if ( action === 'remove' ) {
		if ( type === 'row' ) {
			wymeditor.table_editor.removeRow(actionElmnt);
		} else {
			wymeditor.table_editor.removeColumn(actionElmnt);
		}
	}

	htmlEquals( wymeditor, expectedHtml )
}

function runPostInitTests() {
	module("Table Modification");

	var basicTableHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_3">3_3</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var basicWithPHtml = '<p id="p1">1</p>' + basicTableHtml;

	var addRowTd32Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_3">3_3</td>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnTd32Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td>&#160;</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td>&#160;</td>' +
				'<td id="td_2_3">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>&#160;</td>' +
				'<td id="td_3_3">3_3</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addRowSpan21Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_3">3_3</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnSpan21Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td>&#160;</td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_3">3_3</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	test("Add/Remove does nothing on non-table elements", function() {
		expect(4);

		testTable( '#p_1', 'add', 'column', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'remove', 'column', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'add', 'row', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'remove', 'row', basicWithPHtml, basicWithPHtml );
	});

	test("Add/Remove Column mid column", function() {
		expect(2);

		testTable( '#td_3_2', 'add', 'column', basicTableHtml, addColumnTd32Html );
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnTd32Html, basicTableHtml );
	});

	test("Add/Remove Column from span", function() {
		expect(2);

		testTable( '#span_2_1', 'add', 'column', basicTableHtml, addColumnSpan21Html );
		testTable( '#td_2_1 + td', 'remove', 'column', addColumnSpan21Html, basicTableHtml );
	});

	test("Add/Remove Row end row", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'row', basicTableHtml, addRowTd32Html );
		testTable( '#tr_3 + tr td:eq(1)', 'remove', 'row', addRowTd32Html, basicTableHtml );
	});

	test("Add/Remove Row from span", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#span_2_1', 'add', 'row', basicTableHtml, addRowSpan21Html );
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowSpan21Html, basicTableHtml );
	});
};