'use strict';

var path = require('path');
var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
	scripts: ['src/**/*.js', '!src/**/*_test.js'],
	tests: ['src/**/*_test.js']
};

gulp.task('test', function (done) {
	karma.start({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done);
});

gulp.task('tdd', function (done) {
	karma.start({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: false
	}, done);
});

gulp.task('jshint', function () {
	gulp.src(paths.scripts)
		.pipe(jshint({ lookup: true }))
		.pipe(jshint.reporter());
});

gulp.task('scripts', ['jshint'], function () {
	gulp.src(paths.scripts)
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('ng-select2.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);