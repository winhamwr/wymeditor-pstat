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
			wymeditor.tableEditor.addRow(actionElmnt);
		} else {
			wymeditor.tableEditor.addColumn(actionElmnt);
		}
	} else if ( action === 'remove' ) {
		if ( type === 'row' ) {
			wymeditor.tableEditor.removeRow(actionElmnt);
		} else {
			wymeditor.tableEditor.removeColumn(actionElmnt);
		}
	}

	htmlEquals( wymeditor, expectedHtml );
}

function testTableTab( startHtml, startSelector, endSelector ) {
	var wymeditor = jQuery.wymeditors(0);
	wymeditor.html( startHtml );

	var $body = $(wymeditor._doc).find('body.wym_iframe');
	var startElmnt = $body.find(startSelector)[0];
	ok( startElmnt != null, "Selection start element exists");
	moveSelector(wymeditor, startElmnt);

	simulateKey( WYMeditor.KEY.TAB, startElmnt );

	var actualSelection = wymeditor.selected();
	if ( endSelector == null ) {
		equals( actualSelection, null );
	} else {
		var expectedSelection = $body.find(endSelector);
		if ( expectedSelection.length != 0 ) {
			expectedSelection = expectedSelection[0];
		}

		equals( actualSelection, expectedSelection );
	}
}

function testRowMerge( startHtml, endHtml, startSelector, endSelector, finalSelector ) {
	var wymeditor = jQuery.wymeditors(0);
	wymeditor.html( startHtml );

	var $body = $(wymeditor._doc).find('body.wym_iframe');
	var startElmnt = $body.find(startSelector)[0];
	ok( startElmnt != null, "Selection start element exists");
	var endElmnt = $body.find(endSelector)[0];
	ok( endElmnt != null, "Selection end element exists");
	makeSelection( wymeditor, startElmnt, endElmnt );

	var iframeWin = wymeditor._iframe.contentDocument ? wymeditor._iframe.contentDocument.defaultView : wymeditor._iframe.contentWindow;
	var sel = rangy.getSelection(iframeWin);
	wymeditor.tableEditor.mergeRow(sel);

	htmlEquals( wymeditor, endHtml );

	var actualSelection = wymeditor.selected();
	if ( finalSelector == null ) {
		equals( actualSelection, null );
	} else {
		var expectedSelection = $body.find(finalSelector);
		if ( expectedSelection.length != 0 ) {
			expectedSelection = expectedSelection[0];
		}

		equals( actualSelection, expectedSelection );
	}
}

function runTableTests() {
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

	// Table with colspan and rowspan
	var fancyTableHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	// Table with th elements
	var thTableHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2">1_2</th>' +
				'<th id="th_1_3">1_3</th>' +
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

	var addRowFancyTd12 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addRowFancyTd22 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="3">2_3</td>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addRowFancyTd32 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd12 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd23 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd32 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd11 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td>&#160;</td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd21 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_1_2" colspan="2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td>&#160;</td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td>&#160;</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnFancyTd22 = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2" colspan="3">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td>&#160;</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addRowThTh13Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2">1_2</th>' +
				'<th id="th_1_3">1_3</th>' +
			'</tr>' +
			'<tr>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
				'<td>&#160;</td>' +
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

	var addRowThTd32Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2">1_2</th>' +
				'<th id="th_1_3">1_3</th>' +
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

	var addColumnThTh13Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2">1_2</th>' +
				'<th id="th_1_3">1_3</th>' +
				'<th>&#160;</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_3">3_3</td>' +
				'<td>&#160;</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var addColumnThTd32Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2">1_2</th>' +
				'<th>&#160;</th>' +
				'<th id="th_1_3">1_3</th>' +
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

	module("table- add/remove");
	test("no-op on non-table elements", function() {
		expect(4);

		testTable( '#p_1', 'add', 'column', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'remove', 'column', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'add', 'row', basicWithPHtml, basicWithPHtml );
		testTable( '#p_1', 'remove', 'row', basicWithPHtml, basicWithPHtml );
	});

	test("Column mid column", function() {
		expect(2);

		testTable( '#td_3_2', 'add', 'column', basicTableHtml, addColumnTd32Html );
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnTd32Html, basicTableHtml );
	});

	test("Column from span", function() {
		expect(2);

		testTable( '#span_2_1', 'add', 'column', basicTableHtml, addColumnSpan21Html );
		testTable( '#td_2_1 + td', 'remove', 'column', addColumnSpan21Html, basicTableHtml );
	});

	test("Row end row", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'row', basicTableHtml, addRowTd32Html );
		testTable( '#tr_3 + tr td:eq(1)', 'remove', 'row', addRowTd32Html, basicTableHtml );
	});

	test("Row from span", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#span_2_1', 'add', 'row', basicTableHtml, addRowSpan21Html );
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowSpan21Html, basicTableHtml );
	});

	module("table- colspan/rowspan add/remove");
	test("Row", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'row', fancyTableHtml, addRowFancyTd32);
		testTable( '#tr_3 + tr td:eq(0)', 'remove', 'row', addRowFancyTd32, fancyTableHtml);
	});

	test("Row in colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_2', 'add', 'row', fancyTableHtml, addRowFancyTd12);
		testTable( '#tr_1 + tr td:eq(0)', 'remove', 'row', addRowFancyTd12, fancyTableHtml);
	});

	test("Row in rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_2', 'add', 'row', fancyTableHtml, addRowFancyTd22);
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowFancyTd22, fancyTableHtml);
	});

	test("Column in colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_2', 'add', 'column', fancyTableHtml, addColumnFancyTd12);
		testTable( '#td_1_2 + td', 'remove', 'column', addColumnFancyTd12, fancyTableHtml);
	});

	test("Column in rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_3', 'add', 'column', fancyTableHtml, addColumnFancyTd23);
		testTable( '#td_2_3 + td', 'remove', 'column', addColumnFancyTd23, fancyTableHtml);
	});

	test("Column before rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'column', fancyTableHtml, addColumnFancyTd32);
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnFancyTd32, fancyTableHtml);
	});

	test("Column before colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_1', 'add', 'column', fancyTableHtml, addColumnFancyTd11);
		testTable( '#td_1_1 + td', 'remove', 'column', addColumnFancyTd11, fancyTableHtml);
	});

	test("Column in span", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#span_2_1', 'add', 'column', fancyTableHtml, addColumnFancyTd21);
		testTable( '#td_2_1 + td', 'remove', 'column', addColumnFancyTd21, fancyTableHtml);
	});

	test("Column affecting colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_2', 'add', 'column', fancyTableHtml, addColumnFancyTd22);
		testTable( '#td_2_2 + td', 'remove', 'column', addColumnFancyTd22, fancyTableHtml);
	});

	test("Column with TH mid column", function() {
		expect(2);

		testTable( '#td_3_2', 'add', 'column', thTableHtml, addColumnThTd32Html );
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnThTd32Html, thTableHtml );
	});

	test("Column with TH in th", function() {
		expect(2);

		testTable( '#th_1_3', 'add', 'column', thTableHtml, addColumnThTh13Html );
		testTable( '#th_1_3 + th', 'remove', 'column', addColumnThTh13Html, thTableHtml );
	});

	test("Row with TH end row", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'row', thTableHtml, addRowThTd32Html );
		testTable( '#tr_3 + tr td:eq(1)', 'remove', 'row', addRowThTd32Html, thTableHtml );
	});

	test("Row with TH first th row", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#th_1_3', 'add', 'row', thTableHtml, addRowThTh13Html );
		testTable( '#tr_1 + tr td:eq(2)', 'remove', 'row', addRowThTh13Html, thTableHtml );
	});

	module("table- tab movement");
	test("Tab to cell right", function() {
		expect(3);
		testTableTab( basicTableHtml, '#td_1_1', '#td_1_2' );
	});

	test("Tab from th to cell right", function() {
		expect(3);
		testTableTab( thTableHtml, '#th_1_1', '#th_1_2' );
	});

	test("Tab to next row", function() {
		expect(3);
		var expectedSelector = '#span_2_1';
		if ( $.browser.mozilla ) {
			expectedSelector = '#td_2_1';
		}
		testTableTab( basicTableHtml, '#td_1_3', expectedSelector );
	});

	test("Tab from th to next row", function() {
		expect(3);
		var expectedSelector = '#span_2_1';
		if ( $.browser.mozilla ) {
			expectedSelector = '#td_2_1';
		}
		testTableTab( thTableHtml, '#th_1_3', expectedSelector );
	});

	test("Tab end of table", function() {
		// The real tab action doesn't trigger. Just make sure we're not moving
		// around
		expect(3);
		testTableTab( basicTableHtml, '#td_3_3', '#td_3_3' );
	});

	test("Tab nested inside table", function() {
		expect(3);
		testTableTab( basicTableHtml, '#span_2_1', '#td_2_2' );
	});

	test("Tab outside of table", function() {
		// The real tab action doesn't trigger. Just make sure we're not moving
		// around
		expect(3);
		testTableTab( basicTableHtml+'<p id="p_1">p1</p>', '#p_1', '#p_1' );
	});

	module("table-row_merge");

	function isColspanFirst() {
		var startHtml = '<table><tr><td id="td_1"></td></tr></table>';
		var colspanFirst = '<table><tr><td colspan="2" id="td_1"></td></tr></table>';

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html( startHtml );

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		$body.find('#td_1').attr('colspan', 2);

		if ( trimHtml(wymeditor.xhtml()) == colspanFirst ) {
			return true;
		}

		return false;
	}

	var isColspanFirstBrowser = isColspanFirst();

	var mergeTableHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2" colspan="2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_4">3_4</td>' +
			'</tr>' +
			'<tr id="tr_4">' +
				'<td id="td_4_1">4_1</td>' +
				'<td id="td_4_2">4_2</td>' +
				'<td id="td_4_3">4_3</td>' +
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd41Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th id="th_1_2" colspan="2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td id="td_3_4">3_4</td>' +
			'</tr>' +
			'<tr id="tr_4">';
		if ( isColspanFirstBrowser ) {
			mergeTd41Html += '' +
				'<td colspan="2" id="td_4_1">4_14_2</td>';
		} else {
			mergeTd41Html += '' +
				'<td id="td_4_1" colspan="2">4_14_2</td>';
		}
	mergeTd41Html += '' +
				'<td id="td_4_3">4_3</td>' +
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	test("Merge simple first cell", function() {
		expect(4);

		testRowMerge( mergeTableHtml, mergeTd41Html, '#td_4_1', '#td_4_2', '#td_4_1' );
	});


};