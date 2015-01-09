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

angular.module('angular-select2.typeahead', [
	'angular-select2.select'
])
	.directive('stTypeahead', STTypeaheadDirective);