import { exec } from "child_process";
import { join, resolve } from "path";
import { src, dest, watch, parallel, series } from "gulp4";
import del from "del";
import flatten from "gulp-flatten";
import gulpif from "gulp-if";
import packageImporter from "node-sass-package-importer";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sass from "gulp-sass";
import sourcemap from "gulp-sourcemaps";
import webpack from "webpack-stream";
import compiler from "webpack";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const PATHS = {
    root: join(__dirname, ".."),
    django: join(__dirname, "../calabria"),
    ui: resolve(__dirname),
    static: join(__dirname, "../calabria/apps/core/static"),
};

const cleanDir = () => del(join(PATHS.static, "assets"), { force: true });

const copyImages = () => {
    const sourcePath = join(PATHS.ui, "src/images/**/*");
    const destPath = join(PATHS.static, "assets/images");
    return src(sourcePath).pipe(flatten()).pipe(dest(destPath));
};

const copyAssets = () => {
    const sourcePath = [
        join(
            PATHS.ui,
            "node_modules/@fortawesome/fontawesome-free/webfonts/**/*"
        ),
    ];
    const destPath = join(PATHS.static, "assets/fonts");
    return src(sourcePath).pipe(dest(destPath));
};

const buildStyles = () => {
    const sourcePath = join(PATHS.ui, "src/scss/shell.scss");
    const destPath = join(PATHS.static, "assets/styles");
    return src(sourcePath)
        .pipe(plumber())
        .pipe(gulpif(!IS_PRODUCTION, sourcemap.init()))
        .pipe(
            sass.sync({
                importer: packageImporter(),
                outputStyle: IS_PRODUCTION ? "compressed" : "nested",
            })
        )
        .pipe(rename("styles.min.css"))
        .pipe(gulpif(!IS_PRODUCTION, sourcemap.write(".")))
        .pipe(dest(destPath));
};

const buildJavascript = () => {
    const sourcePath = join(PATHS.ui, "src/js/shell.js");
    const destPath = join(PATHS.static, "assets/scripts");
    return src(sourcePath)
        .pipe(plumber())
        .pipe(
            webpack(
                {
                    mode: IS_PRODUCTION ? "production" : "development",
                    performance: {
                        hints: IS_PRODUCTION ? "warning" : false,
                    },
                    devtool: IS_PRODUCTION ? false : "cheap-eval-source-map",
                    entry: IS_PRODUCTION
                        ? sourcePath
                        : ["@babel/polyfill", sourcePath],
                    output: {
                        filename: "bundle.min.js",
                    },
                    module: IS_PRODUCTION
                        ? {
                              rules: [
                                  {
                                      test: /\.js$/,
                                      exclude: /node_modules\/(?!(lit-html))/,
                                      use: {
                                          loader: "babel-loader",
                                      },
                                  },
                              ],
                          }
                        : {},
                },
                compiler
            )
        )
        .pipe(dest(destPath));
};

const symlink = () =>
    exec(
        `python ${PATHS.root}/manage.py collectstatic -l --no-input`
    );

const watchChanges = () => {
    const jsPath = join(PATHS.ui, "src/js/**/*");
    const stylesPath = join(PATHS.ui, "src/scss/**/*");
    watch(jsPath, buildJavascript);
    watch(stylesPath, buildStyles);
};

const production = series(
    cleanDir,
    parallel(copyImages, copyAssets, buildStyles, buildJavascript),
    symlink
);

const development = series(
    cleanDir,
    parallel(copyImages, copyAssets, buildStyles, buildJavascript),
    symlink,
    watchChanges
);

export { production, development };

export default production;
