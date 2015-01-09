'use strict';

describe('typeahead', function () {
	var scope, $rootScope, $compile, typeahead, select2, form;

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

		scope.getResults = function (viewValue) {
			return [{
				id: 1,
				name: 'Something'
			}]
		};

		form = angular.element('<form>');
		form.attr('name', 'form');

		typeahead = angular.element('<input>');
		typeahead.attr('ng-model', 'query.term');
		typeahead.attr('st-typeahead', '');
		typeahead.attr('ng-options', 'result.id as result.name for result in getResults($viewValue)');

		form.append(typeahead);

		$compile(form)(scope);
	}));

	it('should ', function () {
		
		console.log(angular.element(form[0].querySelector('.select2-container')).data('select2'))
	})
});