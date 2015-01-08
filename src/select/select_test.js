'use strict';

describe('select', function () {
	var $compile, scope, div, select;

	beforeEach(module('angular-select2.select'))

	beforeEach(inject(function ($injector) {
		$compile = $injector.get('$compile')
	}))

	beforeEach(inject(function ($rootScope) {
		scope = $rootScope.$new()
		scope.rows = [];

		for(var i=0;i<10;i++) {
			scope.rows.push({
				id: i,
				name: 'row_' + i
			})
		}

		select = angular.element('<select>')
		select.attr('ng-model', 'model.myValue_');
		select.attr('ng-options', 'row.name as row.id for row in rows');
		select.attr('st-select2', '');

		div = angular.element('<div>');
		div.append(select);

		// $compile(div)(scope);
	}))

	it('should update the ngModel', inject(function () {
	}))
})