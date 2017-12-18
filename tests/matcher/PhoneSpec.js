/*global Autolinker, _, describe, beforeEach, afterEach, it, expect, jasmine */
describe("Autolinker.matcher.Phone", function () {
	var MatchChecker = Autolinker.match.MatchChecker,
		matcher;

	beforeEach(function () {
		matcher = new Autolinker.matcher.Phone({
			tagBuilder: new Autolinker.AnchorTagBuilder()
		});
	});


	describe('parseMatches()', function () {

		it('should return an empty array if there are no matches for phone numbers', function () {
			expect(matcher.parseMatches('')).toEqual([]);
			expect(matcher.parseMatches('asdf')).toEqual([]);
			expect(matcher.parseMatches('123')).toEqual([]);
		});


		it('should return an array of a single phone number match when the string is the phone number itself', function () {
			var matches = matcher.parseMatches('(123)456-7890');

			expect(matches.length).toBe(1);
			MatchChecker.expectPhoneMatch(matches[0], '1234567890', 0);
		});


		it('should return an array of a single phone number match when the phone number is in the middle of the string', function () {
			var matches = matcher.parseMatches('Hello (123)456-7890 my good friend');

			expect(matches.length).toBe(1);
			MatchChecker.expectPhoneMatch(matches[0], '1234567890', 6);
		});


		it('should return an array of a single phone number match when the phone number is at the end of the string', function () {
			var matches = matcher.parseMatches('Hello (123)456-7890');

			expect(matches.length).toBe(1);
			MatchChecker.expectPhoneMatch(matches[0], '1234567890', 6);
		});

		it('Phone symbols count Range = 4 - inf', function () {
			var tooShort = matcher.parseMatches('123');
			var matched = matcher.parseMatches('1234');
			var matchedLong = matcher.parseMatches('1234123412341234123412341234123412341234123412341234123412341234123123123123312333123131231231231232131');

			expect(tooShort.length).toBe(0);
			MatchChecker.expectPhoneMatch(matched[0], '1234', 0);
			MatchChecker.expectPhoneMatch(matchedLong[0], '1234123412341234123412341234123412341234123412341234123412341234123123123123312333123131231231231232131', 0);
		});

		it('Dot is not allowed inside number', function () {
			var matched = matcher.parseMatches('12345.12345 1.2345 1234.5');
			expect(matched.length).toBe(0);
		});

		it('Dot is allowed on the edges', function () {
			var matched = matcher.parseMatches('Phrase.12345 and 67890.');
			expect(matched.length).toBe(2);
			MatchChecker.expectPhoneMatch(matched[0], '12345', 7);
			MatchChecker.expectPhoneMatch(matched[1], '67890', 17);
		});

		it('Comma is not allowed inside number', function () {
			var matched = matcher.parseMatches('12345,12345 1,2345 1234,5');
			expect(matched.length).toBe(0);
		});

		it('Comma is allowed on the edges', function () {
			var matched = matcher.parseMatches('phrase,12345 and 67890, rest of phrase');
			expect(matched.length).toBe(2);
			MatchChecker.expectPhoneMatch(matched[0], '12345', 7);
			MatchChecker.expectPhoneMatch(matched[1], '67890', 17);
		});

		it(' ( ) / - space are allowed in the number', function () {
			var matched = matcher.parseMatches('(+375)2/3-4(5)6/7-8-9 0');
			expect(matched.length).toBe(1);
			expect(matched[0].plusSign).toBe(true);
			MatchChecker.expectPhoneMatch(matched[0], '375234567890', 0);
		});

		it('Nothing else is allowed in the number', function () {
			var matched = matcher.parseMatches('a1234 1234a 12a34 ;1234 1234; 12;34 #1234 1234# 12#34 12+34 1234+');
			expect(matched.length).toBe(0);
		});

		it('should return an array of multiple phone numbers when there are more than one within the string', function () {
			var matches = matcher.parseMatches('123456 +37529572638 +123125\n' +
				'asdsa asdas: 1231/1231\n' +
				'12312,123 12312.123 a13213 12312 +555555  1111 11 11');

			expect(matches.length).toBe(7);
			MatchChecker.expectPhoneMatch(matches[0], '123456', 0);
			MatchChecker.expectPhoneMatch(matches[1], '37529572638', 7);
			MatchChecker.expectPhoneMatch(matches[2], '123125', 20);
			MatchChecker.expectPhoneMatch(matches[3], '12311231', 41);
			MatchChecker.expectPhoneMatch(matches[4], '12312', 78);
			MatchChecker.expectPhoneMatch(matches[5], '555555', 84);
			MatchChecker.expectPhoneMatch(matches[6], '11111111', 92);
			expect(matches[0].plusSign).toBe(false);
			expect(matches[1].plusSign).toBe(true);
			expect(matches[2].plusSign).toBe(true);
			expect(matches[3].plusSign).toBe(false);
			expect(matches[4].plusSign).toBe(false);
			expect(matches[5].plusSign).toBe(true);
			expect(matches[6].plusSign).toBe(false);
		});
	});

});