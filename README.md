ng-select2
==========

jQuery Select2 plugin adapted to AngularJS way

## Installation
```
bower install --save ng-select2
```

## Typeahead
```js
function UserController ($scope, User) {
  this.getResults = function (viewValue, modelValue) {
    // Could return, a promise:
    return User.query({ name: viewValue || modelValue }).$promise;
    // Or:
    // return [{ name, 'Victor Queiroz', id: 3 }, { name: 'Addy Osmani', id: 2 }, { name: 'Taylor Otwell', id: 1 }];
  };
}
```

```html
<input st-typeahead ng-options="result.id for result.name as result in userCtrl.getResults($viewValue, $modelValue)" ng-model="model.user">
```

## Default select (Example 1)
```
<select st-select2 ng-options="country.id as country.name for country in countries" ng-model="query.country"></select>
```

## Default select (Example 2)
```js
function LanguageController ($scope) {
  this.languages = ['php', 'javascript', 'c++', 'c', 'html'];
}
```

```html
<input st-select2 ng-model="languageCtrl.selectedLanguage" data-tags="languageCtrl.languages" data-tokenizer="[',', ' ']">
```
