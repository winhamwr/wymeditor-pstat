/*
	* Copyright (c) 2010 PolicyStat LLC.
	* MIT licensed (MIT-license.txt)
	*
	* File Authors:
	*        Wes Winham (winhamwr@gmail.com)
	*/

WYMeditor.editor.prototype.table = function(options) {
	var table_editor = new TableEditor(options, this);
	this.table_editor = table_editor;

	return(table_editor);
};

function TableEditor(options, wym) {
	options = jQuery.extend({}, options);

	this._options = options;
	this._wym = wym;
};

TableEditor.prototype.init = function() {
	var table_editor = this;

	$(this._wym._doc).bind('keyup', table_editor.keyup);
};

TableEditor.prototype.keyup = function(evt) {
	//'this' is the doc
	var wym = WYMeditor.INSTANCES[this.title];
	var table_editor = wym.table_editor;

	if( evt.altKey && evt.keyCode == WYMeditor.KEY.R ) {
		alert('alt + r pressed');
		table_editor.addRow(wym.selected());
	}
};

/*
 * Add a row to the given elmnt (representing a <tr> or a child of a <tr>).
 */
TableEditor.prototype.addRow = function(elmnt) {
	var wym = this._wym;
	var tr = wym.findUp(elmnt, 'tr');

	// Find out how many td elements in this tr
	var td_children = $(tr).children('td');

	var td_html = '';
	for(i=0;i<td_children.length;i++) {
		td_html += '<td>&nbsp;</td>';
	}
	$(tr).after('<tr>'+td_html+'</tr>');
};