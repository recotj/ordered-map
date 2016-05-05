const path = require('path');
const gulp = require('gulp');

const workflow = require('gulp-workflow');
const build = workflow.build;

gulp.task('clean', workflow.clean);
gulp.task('modules', build.modules);

gulp.task('build', ['modules']);
gulp.task('release', ['build']);
gulp.task('default', ['build']);
