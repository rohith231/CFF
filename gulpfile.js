const gulp = require("gulp");
const gap = require("gulp-append-prepend");

gulp.task("licenses", async function() {
  // this is to add Technowell licenses in the production mode for the minified js
  gulp
    .src("build/static/js/*chunk.js", { base: "./" })
    .pipe(
      gap.prependText(`
      /**

      =========================================================
      * TProduct platform - v1.0.0
      =========================================================
      
      * Copyright 2021 TRC (https://www.trccompanies.com)
      * Coded by TRC
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      **/
      `)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Technowell licenses in the production mode for the minified html
  gulp
    .src("build/index.html", { base: "./" })
    .pipe(
      gap.prependText(`<!--

      =========================================================
      * Product platform - v1.0.0
      =========================================================
      
      * Copyright 2021 TRC (https://www.trccompanies.com)
      * Coded by Technowell
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      -->`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Technowell licenses in the production mode for the minified css
  gulp
    .src("build/static/css/*chunk.css", { base: "./" })
    .pipe(
      gap.prependText(`
      /*
      
      =========================================================
      * Product platform - v1.0.0
      =========================================================
      
      * Copyright 2021 TRC (https://www.trccompanies.com)
      * Coded by Technowell
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      */
      `)
    )
    .pipe(gulp.dest("./", { overwrite: true }));
  return;
});
