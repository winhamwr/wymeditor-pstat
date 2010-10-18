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

	test("Add/Remove Row (fancy)", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'row', fancyTableHtml, addRowFancyTd32);
		testTable( '#tr_3 + tr td:eq(0)', 'remove', 'row', addRowFancyTd32, fancyTableHtml);
	});

	test("Add/Remove Row (fancy) in colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_2', 'add', 'row', fancyTableHtml, addRowFancyTd12);
		testTable( '#tr_1 + tr td:eq(0)', 'remove', 'row', addRowFancyTd12, fancyTableHtml);
	});

	test("Add/Remove Row (fancy) in rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_2', 'add', 'row', fancyTableHtml, addRowFancyTd22);
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowFancyTd22, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) in colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_2', 'add', 'column', fancyTableHtml, addColumnFancyTd12);
		testTable( '#td_1_2 + td', 'remove', 'column', addColumnFancyTd12, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) in rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_3', 'add', 'column', fancyTableHtml, addColumnFancyTd23);
		testTable( '#td_2_3 + td', 'remove', 'column', addColumnFancyTd23, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) before rowspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_3_2', 'add', 'column', fancyTableHtml, addColumnFancyTd32);
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnFancyTd32, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) before colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_1_1', 'add', 'column', fancyTableHtml, addColumnFancyTd11);
		testTable( '#td_1_1 + td', 'remove', 'column', addColumnFancyTd11, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) in span", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#span_2_1', 'add', 'column', fancyTableHtml, addColumnFancyTd21);
		testTable( '#td_2_1 + td', 'remove', 'column', addColumnFancyTd21, fancyTableHtml);
	});

	test("Add/Remove Column (fancy) affecting colspan", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);
		var $body = $(wymeditor._doc).find('body.wym_iframe');

		testTable( '#td_2_2', 'add', 'column', fancyTableHtml, addColumnFancyTd22);
		testTable( '#td_2_2 + td', 'remove', 'column', addColumnFancyTd22, fancyTableHtml);
	});

};