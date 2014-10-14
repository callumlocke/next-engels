var gulp = require('gulp');
var watch = require('gulp-watch');
var obt = require('origami-build-tools');

gulp.task('default', function () {
	obt.build(gulp, {
		sass: './src/scss/styles.scss',
		js: './src/js/main.js',
		buildFolder: './static/'
	});
});

gulp.task('watch', function() {
	gulp.watch('./src/**/*', ['default']);
});
