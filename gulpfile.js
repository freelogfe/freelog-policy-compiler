var gulp = require('gulp');

gulp.task('default', function() {
  console.log("what do you want to run?")
});

gulp.task('build-parser', function(cb) {
  var exec = require('child_process').exec;
  console.log('in build parser');
  exec('antlr4 -Dlanguage=JavaScript policy.g4 -o gen', function (err, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
