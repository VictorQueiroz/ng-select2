'use strict';

function $Select2Provider () {
	var defaults = {};

	Object.keys($.fn.select2.defaults).forEach(function (key) {
		if(key === 'id') {
			return;
		}

		defaults[key] = $.fn.select2.defaults[key];
	});

	this.$get = function ($rootScope) {
		function $Select2Factory (element, options, ngModel) {
			this.$ngModel = ngModel;
			var $element = this.$element = element;
			var tagName = $element[0].tagName;
			var $options = this.$options = angular.extend({}, defaults, options);
			var $scope = this.$scope = this.$options.scope;

			if($options.tags && tagName === 'SELECT') {
				throw new Error('You can use the \'tags\' option in a select input.');
			}

			if(!$element.select2) {
				throw new Error('We cannot find the select2 key at $.fn(...)');
			}

			$element.select2($options);

			$element.on('change', this.$onChange);

			return $element;
		}

		$Select2Factory.prototype = function () {};
		$Select2Factory.prototype.$render = function (value) {
			var ctrl = this;

			this.$scope.$apply(function () {
				ctrl.$ngModel.$setViewValue(value);
				ctrl.$ngModel.$render();
			});
		};
		$Select2Factory.prototype.$onChange = function (event) {
			this.$render(event.val);
		};

		return function () {
			return $Select2Factory.apply($Select2Factory.prototype, arguments);
		};
	};
}

function STSelect2Directive($select2, $parse) {
	return {
		require: '?ngModel',
		restrict: 'A',
		link: function (scope, element, attrs, ngModel) {
			if(!ngModel) {
				return;
			}

			var defaults = $.fn.select2.defaults;

			defaults.tags = [];

			var options = {
				scope: scope
			};

			Object.keys(defaults).forEach(function (key) {
				if(!(angular.isUndefined(attrs[key]))) {
					options[key] = scope.$eval(attrs[key]);
				}
			});

			var select2 = $select2(element, options, ngModel);
		}
	};
}

angular.module('angular-select2.select', [])
	.directive('stSelect2', STSelect2Directive)
	.provider('$select2', $Select2Provider);