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
	* Add a row to the given elmnt (representing a <tr> or a child of a <tr>).
	*/
TableEditor.prototype.addRow = function(elmnt) {
	var wym = this._wym;
	var tr = wym.findUp(elmnt, 'tr');
	if ( tr == null ) {
		return false;
	}

	// Find out how many td elements are in this tr
	var td_children = $(tr).children('td');

	var td_html = '';
	for(i=0;i<td_children.length;i++) {
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

