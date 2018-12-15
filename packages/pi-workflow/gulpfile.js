const path = require('path');
const gulp = require('gulp');
const {setConfig} = require('@hopin/wbt-config');
const tsNode = require('@hopin/wbt-ts-node'); 
const fs = require('fs-extra');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', gulp.parallel(
  () => fs.remove('build'),
));

gulp.task('build',
  gulp.series(
    'clean',
    tsNode.gulpBuild()
  )
);