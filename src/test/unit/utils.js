function htmlEquals( wymeditor, expected ) {
	var trimmed = jQuery.trim( wymeditor.xhtml() );
	// This is a super-naive regex to turn things like:
	//    <html>   </html> => <html></html>
	// It fails for cases where white space is actually significant like:
	//    <strong>foo</strong> <em>bar</em>
	var minned = trimmed.replace(/\>\s+\</g, '><');
	equals( minned, jQuery.trim( expected ) );
}

/**
* Move the selection to the start of the given element within the editor.
*/
function moveSelector( wymeditor, selectedElement ) {
	var iframeWin = wymeditor._iframe.contentDocument ? wymeditor._iframe.contentDocument.defaultView : wymeditor._iframe.contentWindow;
	var sel = rangy.getSelection(iframeWin);

	var range = rangy.createRange(wymeditor._doc);
	range.setStart( selectedElement, 0 );
	range.setEnd( selectedElement, 0 );
	range.collapse(false);

	sel.setSingleRange( range );
	// IE selection hack
	if ( $.browser.msie ) {
		wymeditor.saveCaret();
	}

	equals( wymeditor.selected(), selectedElement );
}

/*
 * Simulate a keypress, firing off the keydown, keypress and keyup events.
 */
function simulateKey( keyCode, targetElement, options) {
	var defaults = {
		'metaKey': false,
		'ctrlKey': false,
		'shiftKey': false,
		'altKey': false
	};

	var options = $.extend(defaults, options);

	var keydown = $.Event('keydown');
	keydown.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	var keypress = $.Event('keypress');
	keypress.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	var keyup = $.Event('keyup');
	keyup.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	$(targetElement).trigger(keydown);
	$(targetElement).trigger(keypress);
	$(targetElement).trigger(keyup);
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