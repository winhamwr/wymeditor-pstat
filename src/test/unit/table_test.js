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

function testGetCellXIndex( startHtml, cellSelector, expectedIndex ) {
	var wymeditor = jQuery.wymeditors(0);
	wymeditor.html( startHtml );

	var $body = $(wymeditor._doc).find('body.wym_iframe');
	var cell = $body.find(cellSelector)[0];

	var actual = wymeditor.tableEditor.getCellXIndex(cell);
	equals( actual, expectedIndex );
}

/**
* Determine if attempting to select a cell with a non-text inner node (a span)
* actually selects the inner node or selects the cell itself. FF for example,
* selects the cell while webkit selects the inner.
*/
function browserSelectsInnerContent() {
	var startHtml = '' +
		'<table>' +
			'<tbody>' +
				'<tr>' +
					'<td id="td_1_1"><span id="span_1_1">span_1_1</span></td>' +
				'</tr>' +
			'</tbody>' +
		'</table>';
	var spanSelector = '#span_1_1';
	var tdSelector = '#td_1_1';

	var wymeditor = jQuery.wymeditors(0);
	wymeditor.html( startHtml );

	var $body = $(wymeditor._doc).find('body.wym_iframe');

	var td = $body.find(tdSelector)[0];
	var span = $body.find(spanSelector)[0];
	wymeditor.tableEditor.selectElement($body.find(tdSelector)[0]);

	if ( wymeditor.selected() == span ) {
		return true;
	}
	return false;
}

function runTableTests() {
	var isInnerSelector = browserSelectsInnerContent();

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

	var removedRow3Html = '' +
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
		'</tbody>' +
	'</table>';

	var removedRow2And3Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
				'<td id="td_1_3">1_3</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var removedColumn3Html= '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
				'<td id="td_1_2">1_2</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var removedColumn3And2Html= '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<td id="td_1_1">1_1</td>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
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

		testTable( '#td_3_2', 'add', 'row', basicTableHtml, addRowTd32Html );
		testTable( '#tr_3 + tr td:eq(1)', 'remove', 'row', addRowTd32Html, basicTableHtml );
	});

	test("Row from span", function() {
		expect(2);

		testTable( '#span_2_1', 'add', 'row', basicTableHtml, addRowSpan21Html );
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowSpan21Html, basicTableHtml );
	});

	test("Deleting all rows removes table", function() {
		expect(3);

		testTable( '#td_3_1', 'remove', 'row', basicTableHtml, removedRow3Html );
		testTable( '#td_2_1', 'remove', 'row', removedRow3Html, removedRow2And3Html);
		testTable( '#td_1_1', 'remove', 'row', removedRow2And3Html, '');
	});

	test("Deleting all columns removes table", function() {
		expect(3);

		testTable( '#td_3_3', 'remove', 'column', basicTableHtml, removedColumn3Html );
		testTable( '#td_2_2', 'remove', 'column', removedColumn3Html, removedColumn3And2Html );
		testTable( '#span_2_1', 'remove', 'column', removedColumn3And2Html, '');
	});

	module("table- colspan/rowspan add/remove");
	test("Row", function() {
		expect(2);

		testTable( '#td_3_2', 'add', 'row', fancyTableHtml, addRowFancyTd32);
		testTable( '#tr_3 + tr td:eq(0)', 'remove', 'row', addRowFancyTd32, fancyTableHtml);
	});

	test("Row in colspan", function() {
		expect(2);

		testTable( '#td_1_2', 'add', 'row', fancyTableHtml, addRowFancyTd12);
		testTable( '#tr_1 + tr td:eq(0)', 'remove', 'row', addRowFancyTd12, fancyTableHtml);
	});

	test("Row in rowspan", function() {
		expect(2);

		testTable( '#td_2_2', 'add', 'row', fancyTableHtml, addRowFancyTd22);
		testTable( '#tr_2 + tr td:eq(0)', 'remove', 'row', addRowFancyTd22, fancyTableHtml);
	});

	test("Column in colspan", function() {
		expect(2);

		testTable( '#td_1_2', 'add', 'column', fancyTableHtml, addColumnFancyTd12);
		testTable( '#td_1_2 + td', 'remove', 'column', addColumnFancyTd12, fancyTableHtml);
	});

	test("Column in rowspan", function() {
		expect(2);

		testTable( '#td_2_3', 'add', 'column', fancyTableHtml, addColumnFancyTd23);
		testTable( '#td_2_3 + td', 'remove', 'column', addColumnFancyTd23, fancyTableHtml);
	});

	test("Column before rowspan", function() {
		expect(2);

		testTable( '#td_3_2', 'add', 'column', fancyTableHtml, addColumnFancyTd32);
		testTable( '#td_3_2 + td', 'remove', 'column', addColumnFancyTd32, fancyTableHtml);
	});

	test("Column before colspan", function() {
		expect(2);

		testTable( '#td_1_1', 'add', 'column', fancyTableHtml, addColumnFancyTd11);
		testTable( '#td_1_1 + td', 'remove', 'column', addColumnFancyTd11, fancyTableHtml);
	});

	test("Column in span", function() {
		expect(2);

		testTable( '#span_2_1', 'add', 'column', fancyTableHtml, addColumnFancyTd21);
		testTable( '#td_2_1 + td', 'remove', 'column', addColumnFancyTd21, fancyTableHtml);
	});

	test("Column affecting colspan", function() {
		expect(2);

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

		testTable( '#td_3_2', 'add', 'row', thTableHtml, addRowThTd32Html );
		testTable( '#tr_3 + tr td:eq(1)', 'remove', 'row', addRowThTd32Html, thTableHtml );
	});

	test("Row with TH first th row", function() {
		expect(2);

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
		var expectedSelector = '#td_2_1';
		if ( isInnerSelector ) {
			var expectedSelector = '#span_2_1';
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

	var mergeTableHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
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

	var mergeTableLongRowspanHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="3">2_3</td>' +
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
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd41Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
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
				'<td colspan="2" id="td_4_1">4_14_2</td>' +
				'<td id="td_4_3">4_3</td>' +
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd41To44Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
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
				'<td colspan="4" id="td_4_1">4_14_24_34_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTh12Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="3" id="th_1_2">1_21_4</th>' +
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

	var mergeTh11To12Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th colspan="3" id="th_1_1">1_11_2</th>' +
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

	var mergeTh11To14Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th colspan="4" id="th_1_1">1_11_21_4</th>' +
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

	var mergeSpan21Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td colspan="2" id="td_2_1"><span id="span_2_1">2_1</span>2_2</td>' +
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

	// Rowspan merges
	var mergeTd23Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" colspan="2">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>2_3</td>' +
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

	var mergeTd22Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2" colspan="2">2_2</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td>2_3</td>' +
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

	var mergeTd31Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="2">2_3</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1" colspan="2">3_13_2</td>' +
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

	var mergeTd31Td23Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1" colspan="3">3_13_2</td>' +
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

	var mergeTd23Td34Html = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3">2_3</td>' +
				'<td id="td_2_4">2_4</td>' +
			'</tr>' +
			'<tr id="tr_3">' +
				'<td id="td_3_1">3_1</td>' +
				'<td id="td_3_2">3_2</td>' +
				'<td colspan="2">3_4</td>' +
			'</tr>' +
			'<tr id="tr_4">' +
				'<td id="td_4_1">4_1</td>' +
				'<td id="td_4_2">4_2</td>' +
				'<td id="td_4_3">4_3</td>' +
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd42Td23LongRowspanHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
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
				'<td id="td_4_2" colspan="2">4_2</td>' +
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd23Td44LongRowspanHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
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
				'<td colspan="2">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var mergeTd32Td23LongRowspanHtml = '' +
	'<table>' +
		'<tbody>' +
			'<tr id="tr_1">' +
				'<th id="th_1_1">1_1</th>' +
				'<th colspan="2" id="th_1_2">1_2</th>' +
				'<th id="th_1_4">1_4</th>' +
			'</tr>' +
			'<tr id="tr_2">' +
				'<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
				'<td id="td_2_2">2_2</td>' +
				'<td id="td_2_3" rowspan="3">2_3</td>' +
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
				'<td id="td_4_4">4_4</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	test("Merge simple first cell", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd41Html, '#td_4_1', '#td_4_2', '#td_4_1' );
	});

	test("Merge simple multiple cells", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd41To44Html, '#td_4_1', '#td_4_4', '#td_4_1' );
	});

	test("Expand existing colspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTh12Html, '#th_1_2', '#th_1_4', '#th_1_2' );
	});

	test("Expand into existing colspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTh11To12Html, '#th_1_1', '#th_1_2', '#th_1_1' );
	});

	test("Surround existing colspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTh11To14Html, '#th_1_1', '#th_1_4', '#th_1_1' );
	});

	test("With span", function() {
		expect(4);

		var endSelection = '#td_2_1';
		if ( isInnerSelector ) {
			var endSelection = '#span_2_1';
		}
		testRowMerge(
			mergeTableHtml, mergeSpan21Html, '#span_2_1', '#td_2_2', endSelection );
	});

	module("table-row_merge_rowspan");
	test("Across rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd23Html, '#td_2_3', '#td_2_4', '#td_2_3' );
	});

	test("Into rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd22Html, '#td_2_2', '#td_2_3', '#td_2_2' );
	});

	test("Below and beside rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd31Html, '#td_3_1', '#td_3_2', '#td_3_1' );
	});

	test("Below and including rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd31Td23Html, '#td_3_1', '#td_2_3', '#td_3_1' );
	});

	test("From rowspan to below", function() {
		expect(4);

		testRowMerge(
			mergeTableHtml, mergeTd23Td34Html, '#td_2_3', '#td_3_4', '#td_3_2 + td' );
	});

	test("Below and bottom of long rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableLongRowspanHtml, mergeTd42Td23LongRowspanHtml, '#td_4_2', '#td_2_3', '#td_4_2' );
	});

	test("Below and after bottom of long rowspan", function() {
		expect(4);

		testRowMerge(
			mergeTableLongRowspanHtml, mergeTd23Td44LongRowspanHtml, '#td_2_3', '#td_4_4', '#td_4_2 + td' );
	});

	test("Middle of rowspan doesn't merge", function() {
		expect(4);

		testRowMerge(
			mergeTableLongRowspanHtml, mergeTd32Td23LongRowspanHtml, '#td_3_2', '#td_2_3', '#td_3_2' );
	});

	test("getCellXIndex test", function() {
		expect(5);

		testGetCellXIndex(mergeTableHtml, '#th_1_1', 0);
		testGetCellXIndex(mergeTableHtml, '#th_1_4', 3);
		testGetCellXIndex(mergeTableHtml, '#td_2_3', 2);
		testGetCellXIndex(mergeTableHtml, '#td_3_4', 3);
		testGetCellXIndex(mergeTableLongRowspanHtml, '#td_4_4', 3);
	});

	module("utils");
	function testNormalize( testHtml ) {
		var normed = normalizeHtml( $(testHtml)[0] );
		equals( normed, testHtml );
	}

	test("Test Normalize", function() {
		expect(2);

		testNormalize( mergeTableHtml );
		testNormalize( mergeTd41Html );
	});

};