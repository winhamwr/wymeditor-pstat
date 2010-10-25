/*
	* Copyright (c) 2010 PolicyStat LLC.
	* MIT licensed (MIT-license.txt)
	*
	* File Authors:
	*        Wes Winham (winhamwr@gmail.com)
	*/

// Fugue icons by Yusuke Kamiyamane http://p.yusukekamiyamane.com/
// and licensed under Creative Commons Attribution

WYMeditor.editor.prototype.table = function(options) {
	var tableEditor = new TableEditor(options, this);
	this.tableEditor = tableEditor;

	return(tableEditor);
};

function TableEditor(options, wym) {
	options = jQuery.extend({
		sAddRowButtonHtml:   "<li class='wym_tools_add_row'>"
			+ "<a name='add_row' href='#'"
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_insert_row.png)'>"
			+ "Add Table Row"
			+ "</a></li>",

		sAddRowButtonSelector: "li.wym_tools_add_row a",

		sRemoveRowButtonHtml:   "<li class='wym_tools_remove_row'>"
			+ "<a name='remove_row' href='#'"
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_delete_row.png)'>"
			+ "Remove Table Row"
			+ "</a></li>",

		sRemoveRowButtonSelector: "li.wym_tools_remove_row a",

		sAddColumnButtonHtml:   "<li class='wym_tools_add_column'>"
			+ "<a name='add_column' href='#'"
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_insert_column.png)'>"
			+ "Add Table Column"
			+ "</a></li>",

		sAddColumnButtonSelector: "li.wym_tools_add_column a",

		sRemoveColumnButtonHtml:   "<li class='wym_tools_remove_column'>"
			+ "<a name='remove_column' href='#'"
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_delete_column.png)'>"
			+ "Remove Table Column"
			+ "</a></li>",

		sRemoveColumnButtonSelector: "li.wym_tools_remove_column a"

	}, options);

	this._options = options;
	this._wym = wym;

	this.init();
};

TableEditor.prototype.init = function() {
	var wym = this._wym;
	var tableEditor = this;

	// Add the tool panel buttons
	var tools = $(wym._box).find(
		wym._options.toolsSelector + wym._options.toolsListSelector)

	tools.append(tableEditor._options.sAddRowButtonHtml);
	tools.append(tableEditor._options.sRemoveRowButtonHtml);
	tools.append(tableEditor._options.sAddColumnButtonHtml);
	tools.append(tableEditor._options.sRemoveColumnButtonHtml);

	tableEditor.bindEvents();
};

TableEditor.prototype.bindEvents = function() {
	var wym = this._wym;
	var tableEditor = this;

	// Handle tool button click
	$(wym._box).find(tableEditor._options.sAddRowButtonSelector).click(function() {
		return tableEditor.addRow(wym.selected());
	});
	$(wym._box).find(tableEditor._options.sRemoveRowButtonSelector).click(function() {
		return tableEditor.removeRow(wym.selected());
	});
	$(wym._box).find(tableEditor._options.sAddColumnButtonSelector).click(function() {
		return tableEditor.addColumn(wym.selected());
	});
	$(wym._box).find(tableEditor._options.sRemoveColumnButtonSelector).click(function() {
		return tableEditor.removeColumn(wym.selected());
	});

	// Handle tab clicks
	$(wym._doc).bind('keydown', tableEditor.keyDown);
}

/*
 * Get the number of columns in a given tr element, accounting for colspan and
 * rowspan.
 */
TableEditor.prototype.getNumColumns = function(tr) {
	var wym = this._wym;
	var numColumns = 0;

	var table = wym.findUp(tr, 'table');
	var firstTr = $(table).find('tr:eq(0)');

	// Count the tds and ths in the FIRST ROW of this table, accounting for colspan
	// We count the first td because it won't have any rowspan's before it to
	// complicate things
	$(firstTr).children('td,th').each( function(index, elmnt) {
		var colspan = $(elmnt).attr('colspan');
		if( colspan == null ) {
			colspan = 1;
		}
		numColumns += parseInt(colspan);
	});

	return numColumns;
}
/*
	* Add a row to the given elmnt (representing a <tr> or a child of a <tr>).
	*/
TableEditor.prototype.addRow = function(elmnt) {
	var wym = this._wym;
	var tr = wym.findUp(elmnt, 'tr');
	if ( tr == null ) {
		return false;
	}

	var numColumns = this.getNumColumns(tr);

	var td_html = '';
	for(i=0; i<numColumns; i++) {
		td_html += '<td>&nbsp;</td>';
	}
	$(tr).after('<tr>'+td_html+'</tr>');

	return false;
};

/*
	* Remove the row for the given element (representing a <tr> or a child
	* of a <tr>).
	*/
TableEditor.prototype.removeRow = function(elmnt) {
	var wym = this._wym;
	var tr = wym.findUp(elmnt, 'tr');
	if ( tr == null ) {
		return false;
	}
	$(tr).remove();

	return false;
};

/*
	* Add a column to the given elmnt (representing a <td> or a child of a <td>).
	*/
TableEditor.prototype.addColumn = function(elmnt) {
	var wym = this._wym;
	var td = wym.findUp(elmnt, ['td', 'th']);
	if ( td == null ) {
		return false;
	}
	var prevTds = $(td).prevAll();
	var tdIndex = prevTds.length;

	var newTd = '<td>&nbsp;</td>';
	var newTh = '<th>&nbsp;</th>';
	var tr = wym.findUp(td, 'tr');
	$(tr).siblings('tr').andSelf().each( function(index, element) {
		var insertionElement = newTd;
		if ( $(element).find('th').length > 0 ) {
			// The row has a TH, so insert a th
			insertionElement = newTh;
		}

		$(element).find('td,th').eq(tdIndex).after(insertionElement);
	});

	return false;
};

/*
	* Remove the column to the right of the given elmnt (representing a <td> or a
	* child of a <td>).
	*/
TableEditor.prototype.removeColumn = function(elmnt) {
	var wym = this._wym;
	var td = wym.findUp(elmnt, ['td', 'th']);
	if ( td == null ) {
		return false;
	}
	var prevTds = $(td).prevAll();
	var tdIndex = prevTds.length;

	var tr = wym.findUp(td, 'tr');
	$(tr).siblings('tr').each( function(index, element) {
		$(element).find('td,th').eq(tdIndex).remove();
	});
	$(td).remove();

	return false;
};

TableEditor.prototype.keyDown = function(evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];
	var tableEditor = wym.tableEditor;

	if( evt.keyCode == WYMeditor.KEY.TAB ) {
		return tableEditor.selectNextCell(wym.selected());
	}

	return null;
};

/*
 * Move the focus to the next cell.
 */
TableEditor.prototype.selectNextCell = function(elmnt) {
	var wym = this._wym;
	var tableEditor = this;

	var cell = wym.findUp(elmnt, ['td', 'th']);
	if ( cell == null ) {
		return null;
	}

	// Try moving to the next cell to the right
	var nextCells = $(cell).next('td,th').eq(0);
	if ( nextCells.length != 0 ) {
		tableEditor.selectElement(nextCells[0]);
		return false;
	}

	// There was no cell to the right, use the first in the next row

	// There is no next row. Do a normal tab
	return null;
};

TableEditor.prototype.selectElement = function(elmnt) {
	var sel = this._wym._iframe.contentWindow.getSelection();

	var range = this._wym._doc.createRange();
	range.setStart( elmnt, 0 );
	range.setEnd( elmnt, 0 );

	sel.removeAllRanges();
	sel.addRange( range );
}
