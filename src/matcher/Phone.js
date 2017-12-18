/*global Autolinker */
/**
 * @class Autolinker.matcher.Phone
 * @extends Autolinker.matcher.Matcher
 *
 * Matcher to find Phone number matches in an input string.
 *
 * See this class's superclass ({@link Autolinker.matcher.Matcher}) for more
 * details.
 */
Autolinker.matcher.Phone = Autolinker.Util.extend( Autolinker.matcher.Matcher, {

	/**
	 * The regular expression to match Phone numbers.
	 *
	 * This regular expression has the following capturing groups:
	 *
	 * 1. helper symbols to properly divide phone number from the rest of the text. group is used to calculate index offset
	 * 2. phone
	 * 3. The prefixed '+' sign, if there is one.
	 *
	 * @private
	 * @property {RegExp} matcherRegex
	 */
    matcherRegex : /(\s|^|[^\d][,.])(\(?(\+)?(?:[\/\-() ]?\d){4,}(?:\))?)(?=[,.][^\d]|\.$|\s|$)/g,
    
	/**
	 * @inheritdoc
	 */
	parseMatches: function(text) {
		var matcherRegex = this.matcherRegex,
			tagBuilder = this.tagBuilder,
			matches = [],
			match;

		while ((match = matcherRegex.exec(text)) !== null) {
			// Remove non-numeric values from phone number string
			var indexOffset = match[1] ? match[1].length : 0,
				matchedText = match[2],
				cleanNumber = matchedText.replace(/[^0-9]/g, ''), // strip out non-digit characters
				plusSign = !!match[3]; // match[ 1 ] is the prefixed plus sign, if there is one

			matches.push(new Autolinker.match.Phone({
				tagBuilder: tagBuilder,
				matchedText: matchedText,
				offset: match.index + indexOffset,
				number: cleanNumber,
				plusSign: plusSign
			}));
		}

		return matches;
	},

} );
