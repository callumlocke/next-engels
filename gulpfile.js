var gulp = require('gulp');
var watch = require('gulp-watch');
var obt = require('origami-build-tools');

gulp.task('build', function () {
	obt.build(gulp, {
        sass: './client/main.scss',
        js: './client/main.js',
        buildFolder: './public',
        transforms: [require('swigify')()],
        env: process.env.ENVIRONMENT || 'production'
	});
});

require('next-wrapper/gulp')(gulp);

gulp.task('watch', function() {
	gulp.watch('./client/**/*', ['default']);
});

gulp.task('default', ['copy_templates', 'build']);