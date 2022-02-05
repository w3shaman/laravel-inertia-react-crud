const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]);

/**
 * Copy TinyMCE to public folder
 */
mix.copy('node_modules/tinymce/tinymce.min.js', 'public/assets/tinymce');
mix.copy('node_modules/tinymce/icons', 'public/assets/tinymce/icons');
mix.copy('node_modules/tinymce/plugins', 'public/assets/tinymce/plugins');
mix.copy('node_modules/tinymce/skins', 'public/assets/tinymce/skins');
mix.copy('node_modules/tinymce/themes', 'public/assets/tinymce/themes');
