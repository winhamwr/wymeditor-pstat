function htmlEquals( wymeditor, expected ) {
	equals( jQuery.trim( wymeditor.xhtml() ), jQuery.trim( expected ) );
}

/**
* Move the selection to the start of the given element within the editor.
*/
function moveSelector( wymeditor, selectedElement ) {
	var sel = wymeditor._iframe.contentWindow.getSelection();

	var range = wymeditor._doc.createRange();
	range.setStart( selectedElement, 0 );
	range.setEnd( selectedElement, 0 );

	sel.removeAllRanges();
	sel.addRange( range );
}

/**
* Determine if this element is editable.
* Mimics https://developer.mozilla.org/en/DOM/element.isContentEditable
*/
function isContentEditable( element ) {
	if ( element.contentEditable == '' || element.contentEditable == null ) {
		return true;
	} else if ( element.contentEditable == true ) {
		return true;
	} else if ( element.contentEditable == false ) {
		return false;
	}else {
		return isContentEditable( element.parentNode );
	}
}