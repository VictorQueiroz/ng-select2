describe('select', function () {
	var $rootScope, scope, select, div;

	beforeEach(module('angular-select2.select'));

	beforeEach(inject(function ($injector, $compile) {
		$rootScope = $injector.get('$rootScope');

		scope = $rootScope.$new();

		scope.items = [];

		for(var i=0;i<30;++i) {
			scope.items.push({
				name: 'item_' + i,
				id: i
			});
		}

		div = angular.element('<div>');

		var form = angular.element('<form>');

		div.append(form);

		select = angular.element('<select>');
		select.attr('ng-options', 'item.id as item.name for item in items');
		select.attr('ng-model', 'my_model.key');
		select.attr('st-select2', '');

		form.append(select);

		$compile(div)(scope);
	}));

	it('should render the dropdown', function () {
		expect(angular.element(div[0].querySelector('.select2-container')).length).toBe(1);
	});
});