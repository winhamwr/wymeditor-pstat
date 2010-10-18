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
	var table_editor = new TableEditor(options, this);
	this.table_editor = table_editor;

	return(table_editor);
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
};

TableEditor.prototype.init = function() {
	var wym = this._wym;
	var table_editor = this;

	// Add the tool panel buttons
	var tools = $(wym._box).find(
		wym._options.toolsSelector + wym._options.toolsListSelector)

	tools.append(table_editor._options.sAddRowButtonHtml);
	tools.append(table_editor._options.sRemoveRowButtonHtml);
	tools.append(table_editor._options.sAddColumnButtonHtml);
	tools.append(table_editor._options.sRemoveColumnButtonHtml);

	// Handle tool button click
	$(wym._box).find(table_editor._options.sAddRowButtonSelector).click(function() {
		return table_editor.addRow(wym.selected());
	});
	$(wym._box).find(table_editor._options.sRemoveRowButtonSelector).click(function() {
		return table_editor.removeRow(wym.selected());
	});
	$(wym._box).find(table_editor._options.sAddColumnButtonSelector).click(function() {
		return table_editor.addColumn(wym.selected());
	});
	$(wym._box).find(table_editor._options.sRemoveColumnButtonSelector).click(function() {
		return table_editor.removeColumn(wym.selected());
	});
};

/*
 * Get the number of columns in a given tr element, accounting for colspan and
 * rowspan.
 */
TableEditor.prototype.getNumColumns = function(tr) {
	var wym = this._wym;
	var numColumns = 0;

	var table = wym.findUp(tr, 'table');
	var firstTr = $(table).find('tr:eq(0)');

	// Count the tds in the FIRST ROW of this table, accounting for colspan
	// We count the first td because it won't have any rowspan's before it to
	// complicate things
	$(firstTr).children('td').each( function(index, elmnt) {
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
	var td = wym.findUp(elmnt, 'td');
	if ( td == null ) {
		return false;
	}
	var prevTds = $(td).prevAll();
	var tdIndex = prevTds.length;

	var tr = wym.findUp(td, 'tr');
	$(tr).siblings('tr').each( function(index, element) {
		$(element).find('td:eq('+tdIndex+')').after('<td>&nbsp;</td>');
	});
	$(td).after('<td>&nbsp;</td>');

	return false;
};

/*
	* Remove the column to the right of the given elmnt (representing a <td> or a
	* child of a <td>).
	*/
TableEditor.prototype.removeColumn = function(elmnt) {
	var wym = this._wym;
	var td = wym.findUp(elmnt, 'td');
	if ( td == null ) {
		return false;
	}
	var prevTds = $(td).prevAll();
	var tdIndex = prevTds.length;

	var tr = wym.findUp(td, 'tr');
	$(tr).siblings('tr').each( function(index, element) {
		$(element).find('td:eq('+tdIndex+')').remove();
	});
	$(td).remove();

	return false;
};

