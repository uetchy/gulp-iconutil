const gulp = require("gulp");
const iconutil = require("..");

gulp.task("default", () => {
  gulp
    .src("../test/fixtures/app.iconset/icon_*.png")
    .pipe(iconutil("app.icns"))
    .pipe(gulp.dest("./"));
});
