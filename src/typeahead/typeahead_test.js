'use strict';

describe('typeahead', function () {
	var scope, $rootScope, $compile, typeahead, select2, container, form, input;

	beforeEach(module('angular-select2.typeahead'));

	beforeEach(inject(function ($injector) {
		$rootScope = $injector.get('$rootScope');
		$compile = $injector.get('$compile');
	}));

	beforeEach(inject(function () {
		scope = $rootScope.$new();

		scope.query = {
			term: ''
		};

		var results = [];

		for(var i=0;i<10;i++) {
			results.unshift({
				id: i,
				name: 'item_' + i
			})
		}

		scope.getResults = function (viewValue) {
			return results;
		};

		form = angular.element('<form>');
		form.attr('name', 'form');

		typeahead = angular.element('<input>');
		typeahead.attr('ng-model', 'query.term');
		typeahead.attr('st-typeahead', '');
		typeahead.attr('ng-options', 'result.id as result.name for result in getResults($viewValue)');

		form.append(typeahead);

		$compile(form)(scope);

		$rootScope.$digest();

		container = angular.element(form[0].querySelector('.select2-container'))
		input = angular.element(container[0].querySelector('input'));
	}));

	it('should render the typeahead', function () {
		expect(container.length).toBe(1);
		container.select2('open');
		input.val('5');
	});
});