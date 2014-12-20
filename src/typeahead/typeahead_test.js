'use strict';

describe('typeahead', function () {
	var scope, $rootScope, $compile, typeahead, select2;

	beforeEach(module('angular-select2.select'));
	beforeEach(module('angular-select2.typeahead'));

	angular.module('angular-select2.typeahead').controller('TypeaheadController', function ($scope) {

	});

	beforeEach(inject(function ($injector) {
		$rootScope = $injector.get('$rootScope');
		$compile = $injector.get('$compile');
	}));

	beforeEach(inject(function ($controller) {
		scope = $rootScope.$new();

		scope.typeaheadCtrl = $controller('TypeaheadController', {
			'$scope': scope
		});

		scope.query = {
			term: ''
		};

		scope.typeaheadCtrl.getResults = function (viewValue) {
			return [{
				id: 1,
				name: 'Something'
			}]
		};
	}));

	it('should compile a typeahead', function () {
		var form;

		form = angular.element('<form>');
		form.attr('name', 'form');

		typeahead = angular.element('<input>');
		typeahead.attr('ng-model', 'query.term');
		typeahead.attr('st-typeahead', '');
		typeahead.attr('ng-options', 'result.id as result.name for result in typeaheadCtrl.getResults($viewValue)');

		form.append(typeahead);

		angular.element(document.body).append(form);

		$compile(form)(scope);

		$rootScope.$digest();

		select2 = typeahead.data('$select2Service');
	});

	it('should open the typeahead', function () {
		select2.select2('open');

		var isOpened = document.body.querySelector('.select2-dropdown-open') ? true : false;

		expect(isOpened).toBe(true);
	});

	it('should search for something', function () {
		var select2Input = angular.element(document.body.querySelector('.select2-input')).first();

		select2Input.val('Search for this!').trigger('keyup-change');

		expect(select2.select2('val')).toBe('Search for this!');
	});
});