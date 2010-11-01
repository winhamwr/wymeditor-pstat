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
		sMergeRowButtonHtml:   "<li class='wym_tools_merge_row'>"
			+ "<a name='merge_row' href='#'"
			+ " title='Merge Cells' "
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_join_row.png)'>"
			+ "Merge Table Row"
			+ "</a></li>",

		sMergeRowButtonSelector: "li.wym_tools_merge_row a",

		sAddRowButtonHtml:   "<li class='wym_tools_add_row'>"
			+ "<a name='add_row' href='#'"
			+ " title='Add Row' "
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_insert_row.png)'>"
			+ "Add Table Row"
			+ "</a></li>",

		sAddRowButtonSelector: "li.wym_tools_add_row a",

		sRemoveRowButtonHtml:   "<li class='wym_tools_remove_row'>"
			+ "<a name='remove_row' href='#'"
			+ " title='Remove Row' "
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_delete_row.png)'>"
			+ "Remove Table Row"
			+ "</a></li>",

		sRemoveRowButtonSelector: "li.wym_tools_remove_row a",

		sAddColumnButtonHtml:   "<li class='wym_tools_add_column'>"
			+ "<a name='add_column' href='#'"
			+ " title='Add Column' "
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_insert_column.png)'>"
			+ "Add Table Column"
			+ "</a></li>",

		sAddColumnButtonSelector: "li.wym_tools_add_column a",

		sRemoveColumnButtonHtml:   "<li class='wym_tools_remove_column'>"
			+ "<a name='remove_column' href='#'"
			+ " title='Remove Column' "
			+ " style='background-image:"
			+ " url(" + wym._options.basePath + "plugins/table/table_delete_column.png)'>"
			+ "Remove Table Column"
			+ "</a></li>",

		sRemoveColumnButtonSelector: "li.wym_tools_remove_column a",

		enableCellTabbing: true

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

	tools.append(tableEditor._options.sMergeRowButtonHtml);
	tools.append(tableEditor._options.sAddRowButtonHtml);
	tools.append(tableEditor._options.sRemoveRowButtonHtml);
	tools.append(tableEditor._options.sAddColumnButtonHtml);
	tools.append(tableEditor._options.sRemoveColumnButtonHtml);

	tableEditor.bindEvents();
	rangy.init();
};

TableEditor.prototype.bindEvents = function() {
	var wym = this._wym;
	var tableEditor = this;

	// Handle tool button click
	$(wym._box).find(tableEditor._options.sMergeRowButtonSelector).click(function() {
		var iframeWin = wym._iframe.contentDocument ? wym._iframe.contentDocument.defaultView : wym._iframe.contentWindow;
		var sel = rangy.getSelection(iframeWin);
		return tableEditor.mergeRow(sel);
	});
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
	if( tableEditor._options.enableCellTabbing ) {
		$(wym._doc).bind('keydown', tableEditor.keyDown);
	}
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

TableEditor.prototype.getCellXIndex = function(cell) {
	var tableEditor = this;
	var parentTr = $(cell).parent('tr')[0];

	var baseRowColumns = this.getNumColumns(parentTr);

	// Figure out how many explicit cells are missing which is how many rowspans
	// we're affected by
	var rowColCount = 0;
	$(parentTr).children('td,th').each( function(index, elmnt) {
		var colspan = $(elmnt).attr('colspan');
		if( colspan == null ) {
			colspan = 1;
		}
		rowColCount += parseInt(colspan);
	});

	var missingCells = baseRowColumns - rowColCount;
	var rowspanIndexes = [];
	var checkTr = parentTr;
	var rowOffset = 1;
	while ( missingCells > 0 ) {
		checkTr = $(checkTr).prev('tr');
		rowOffset += 1;
		$(checkTr).children('td,th').each( function(index, elmnt) {
			if ( $(elmnt).attr('rowspan') && $(elmnt).attr('rowspan') >= rowOffset ) {
				// Actually affects our source row
				missingCells -= 1;
				var colspan = $(elmnt).attr('colspan');
				if( colspan == null ) {
					colspan = 1;
				}
				rowspanIndexes[tableEditor.getCellXIndex(elmnt)] = colspan;
			}
		});
	}

	var indexCounter = 0;
	var cellIndex = null;
	$(parentTr).children('td,th').each( function(index, elmnt) {
		if ( cellIndex != null ) {
			return;
		}
		while ( typeof(rowspanIndexes[indexCounter]) != 'undefined' ) {
			indexCounter += parseInt(rowspanIndexes[indexCounter]);
		}
		if ( elmnt == cell ) {
			cellIndex = indexCounter;
			return;
		}
		var colspan = $(elmnt).attr('colspan');
		if( colspan == null ) {
			colspan = 1;
		}
		indexCounter += parseInt(colspan);
	});

	if ( cellIndex == null ) {
		throw "Cell index not found";
	}
	return cellIndex;
}

/**
* Get the number of columns represented by the given array of contiguous cell
* (td/th) nodes.
* Accounts for colspan and rowspan attributes.
*/
TableEditor.prototype.getTotalColumns = function(cells) {
	var tableEditor = this;
	var baseRowColumns = 0; // Number of columns in a uniform table row

	var rootTr = this.getCommonParentTr(cells);
	if ( rootTr == null ) {
		// Non-contiguous columns
		throw "getTotalColumns only allowed for contiguous cells";
	}

	var baseRowColumns = this.getNumColumns(rootTr);

	// Count the number of simple columns, not accounting for rowspans
	var colspanCount = 0;
	$(cells).each( function(index, elmnt) {
		var colspan = $(elmnt).attr('colspan');
		if( colspan == null ) {
			colspan = 1;
		}
		colspanCount += parseInt(colspan);
	});

	// Determine if we're affected by rowspans. If the number of simple columns
	// in the row equals the number of columns in the first row, we don't have
	// any rowspans
	var rowColCount = 0;
	$(rootTr).children('td,th').each( function(index, elmnt) {
		var colspan = $(elmnt).attr('colspan');
		if( colspan == null ) {
			colspan = 1;
		}
		rowColCount += parseInt(colspan);
	});

	if ( rowColCount == baseRowColumns ) {
		// Easy case. No rowspans to deal with
		return colspanCount;
	} else {
		if ( cells.length == 1 ) {
			// Easy. Just the colspan
			var colspan = $(cells[0]).attr('colspan');
			if( colspan == null ) {
				colspan = 1;
			}
			return colspan;
		} else {
			return 1 + tableEditor.getCellXIndex($(cells).eq(-1)) - tableEditor.getCellXIndex($(cells).eq(0));
		}
	}
}

/**
* Merge the table cells in the given selection using a colspan.
*/
TableEditor.prototype.mergeRow = function(sel) {
	var wym = this._wym;
	var tableEditor = this;

	if ( sel.rangeCount == 0 ) {
		return false;
	}

	var range = sel.getRangeAt(0);

	var nodes = range.getNodes(false);
	var cells = $(nodes).filter('td,th');
	if ( cells.length == 0 ) {
		return false;
	}
	var mergeCell = cells[0];

	var rootTr = this.getCommonParentTr(cells);
	if ( rootTr == null ) {
		return false;
	}

	// If any of the cells have a rowspan, create the inferred cells
	$(cells).each( function(index, elmnt) {
		var $elmnt = $(elmnt);
		if ( $elmnt.attr('rowspan') != null && $elmnt.attr('rowspan') > 1 ) {
			// Figure out the x index for this cell in the table grid
			var prevCells = $elmnt.prevAll('td,th');
			var index = tableEditor.getCellXIndex(elmnt);

			// Create the previously-inferred cell in the appropriate index
			// with one less rowspan
			var newRowspan = $elmnt.attr('rowspan') - 1
			if ( newRowspan == 1 ) {
				var newTd = '<td>' + $elmnt.html() + '</td>';
			} else {
				var newTd = '' +
					'<td rowspan="' + newRowspan + '">' +
						$elmnt.html() +
					'</td>';
			}
			// TODO: account for colspan/rowspan with insertion
			if ( index == 0 ) {
				$elmnt.parent('tr')
					.next('tr')
					.prepend(newTd);
			} else {
				var insertionIndex = index - 1; // Appending to the prev node
				$elmnt.parent('tr')
					.next('tr')
					.find('td:eq('+insertionIndex+')')
					.append(newTd);
			}

			// Clear the cell's html, since we just moved it down
			$elmnt.html('');
		}
	});

	// Remove any rowspan from the mergecell now that we've shifted rowspans
	// down
	$(mergeCell).removeAttr('rowspan');

	// Build the content of the new combined cell from all of the included cells
	var newContent = '';
	$(cells).each( function(index, elmnt) {
		newContent += $(elmnt).html();
	});

	// Add a colspan to the farthest-left cell
	var combinedColspan = this.getTotalColumns(cells);
	$(mergeCell).attr('colspan', combinedColspan);

	// Delete the rest of the cells
	$(cells).each( function(index, elmnt) {
		if ( index != 0 ) {
			$(elmnt).remove();
		}
	});

	// Change the content in our newly-merged cell
	$(mergeCell).html(newContent);

	this.selectElement(mergeCell);

	return false;
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
	var nextCells = $(cell).next('td,th');
	if ( nextCells.length > 0 ) {
		tableEditor.selectElement(nextCells[0]);
		return false;
	}

	// There was no cell to the right, use the first cell in the next row
	var tr = wym.findUp(cell, 'tr');
	var nextRows = $(tr).next('tr');
	if ( nextRows.length != 0 ) {
		var nextCells = $(nextRows).children('td,th');
		if ( nextCells.length > 0 ) {
			tableEditor.selectElement(nextCells[0]);
			return false;
		}
	}

	// There is no next row. Do a normal tab
	return null;
};

TableEditor.prototype.selectElement = function(elmnt) {
	var iframeWin = this._wym._iframe.contentDocument ? this._wym._iframe.contentDocument.defaultView : this._wym._iframe.contentWindow;
	var sel = rangy.getSelection(iframeWin);

	var range = rangy.createRange(this._wym._doc);
	range.setStart( elmnt, 0 );
	range.setEnd( elmnt, 0 );
	range.collapse(false);

	sel.setSingleRange( range );
	// IE selection hack
	if ( $.browser.msie ) {
		this._wym.saveCaret();
	}
}

/**
* Get the common parent tr for the given table cell nodes. If the closest parent
* tr for each cell isn't the same, returns null.
*/
TableEditor.prototype.getCommonParentTr = function(cells) {
	var cells = $(cells).filter('td,th');
	if ( cells.length == 0 ) {
		return null;
	}
	var firstCell = cells[0];

	var parentTrList = $(firstCell).parent('tr');
	if ( parentTrList.length == 0 ) {
		return null;
	}
	var rootTr = parentTrList[0];

	// Ensure that all of the cells have the same parent tr
	$(cells).each( function(index, elmnt) {
		var parentTrList = $(elmnt).parent('tr');
		if ( parentTrList.length == 0 || parentTrList[0] != rootTr ) {
			return null;
		}
	});

	return rootTr;
}
