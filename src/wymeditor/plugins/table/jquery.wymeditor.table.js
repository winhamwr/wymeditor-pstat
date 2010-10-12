/*
	* Copyright (c) 2010 PolicyStat LLC.
	* MIT licensed (MIT-license.txt)
	*
	* File Authors:
	*        Wes Winham (winhamwr@gmail.com)
	*/

WYMeditor.editor.prototype.table = function(options) {
	var table_editor = new TableEditor(options, this);

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
	alert('keyup');
};