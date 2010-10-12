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


function runPostInitTests() {
	module("Post Init");

	test("Add Column)", function() {
		expect(2);
		var testText1 = '<p>This is some text with which to test.<\/p>';
		jQuery.wymeditors(0).html( testText1 );
		equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 );

		var testText2 = 'Some <strong>other text<\/strong> with which to test.';
		jQuery.wymeditors(0)._doc.body.focus();
		jQuery.wymeditors(0).paste( testText2 );
		equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 + '<p>' + testText2 + '<\/p>' );
	});

	test("Add Row", function () {
		expect(1);

		var doc = jQuery.wymeditors(0)._doc,
		styles = doc.styleSheets[0];

		jQuery.wymeditors(0).addCssRule(styles, {name:'p,h1,h2', css:'font-style:italic'});
		equals( jQuery('p', doc).css('fontStyle'), 'italic', 'Font-style' );
	});
};