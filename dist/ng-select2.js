'use strict';

angular.module('angular-select2', [
	'angular-select2.select',
	'angular-select2.typeahead'
]);
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
			
			this.$onChange = function (event) {
  		  console.log(this)
  			this.$render(event.val);
  		};
  		
  		this.$render = function (value) {
  			var ctrl = this;
  
  			this.$scope.$apply(function () {
  				ctrl.$ngModel.$setViewValue(value);
  				ctrl.$ngModel.$render();
  			});
  		};

			return $element;
		}

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
STSelect2Directive.$inject = ["$select2", "$parse"];

angular.module('angular-select2.select', [])
	.directive('stSelect2', STSelect2Directive)
	.provider('$select2', $Select2Provider);
'use strict';

var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

function STTypeaheadDirective ($select2, $parse) {
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			if(!ngModel) {
				return;
			}

			if(!attrs.ngOptions) {
				throw new Error('To use this directive, you must have the ngOptions directive.');
			}

			var options = {
				scope: scope,
				query: function (query) {
					var data = { results: [] }, match, promise;

					if (!(match = attrs.ngOptions.match(NG_OPTIONS_REGEXP))) {
					  throw new Error('Error while trying to pass the ngOptions expression.');
					}

					if(query.term !== ngModel.$viewValue) {
						ngModel.$setViewValue(query.term);
						ngModel.$render();
					}

					var displayFn = $parse(match[2] || match[1]),
					valueName = match[4] || match[6],
					selectAs = / as /.test(match[0]) && match[1],
					selectAsFn = selectAs ? $parse(selectAs) : null,
					keyName = match[5],
					groupByFn = $parse(match[3] || ''),
					valueFn = $parse(match[2] ? match[1] : valueName),
					valuesFn = $parse(match[7]),
					track = match[8],
					trackFn = track ? $parse(match[8]) : null;

					function iterateResults (values) {
						data.results = values.map(function (value, index) {
							var locals = {}, text, id;

							locals[valueName] = value;
							text = displayFn(scope, locals);
							id = valueFn(scope, locals);

							return {
								text: text,
								id: id
							};
						});

						query.callback(data);
					}

					promise = valuesFn(scope, ngModel);

					if(!promise) {
						throw new Error('Should return an array or promise but is undefined');
					}

					if(promise.then) {
						promise.then(iterateResults);
					}

					if(promise instanceof Array) {
						iterateResults(promise);
					}
				}
			};

			var select2 = $select2(element, options, ngModel);

			element.data('$select2Service', select2);
			
			attrs.$observe('disabled', function (disabled) {
				select2.select2('enable', !disabled);
			});
		}
	};
}
STTypeaheadDirective.$inject = ["$select2", "$parse"];

angular.module('angular-select2.typeahead', [])
	.directive('stTypeahead', STTypeaheadDirective);