/**
 * This file is the application's main JavaScript file. It is listed as a dependency in index.html and will
 * automatically load when index.html loads.
 *
 * Because this file has the special filename `main.js`, and because we've registered the `app` package in run.js,
 * whatever object this module returns can be loaded by other files simply by requiring `app` (instead of `app/main`).
 *
 * Our first dependency, `./Dialog`, uses a relative module identifier; you should use this type of notation for
 * dependencies *within* a package in order to ensure the package is fully portable. It works like a path, where `./`
 * refers to the current directory and `../` refers to the parent directory. If you are referring to a module in a
 * *different* package (like `dojo` or `dijit`), you should *not* use a relative module identifier.
 *
 * The second dependency is a plugin dependency; in this case, it is a dependency on the special functionality of the
 * `dojo/domReady` plugin, which simply waits until the DOM is ready before resolving. The `!` after the module name
 * indicates you want to use special plugin functionality; if you were to require just `dojo/domReady`, it would load
 * that module just like any other module, without the special plugin functionality. Note that this is just an example
 * to show how plugins work; because our scripts are loaded before `</body>` in index.html, we don’t need to wait for
 * DOM ready; it will already be ready.
 *
 * In all cases, whatever function is passed to define() is only invoked once, and the returned value is cached.
 *
 * More information about everything described about the loader throughout this file can be found at
 * <http://dojotoolkit.org/reference-guide/loader/amd.html>.
 */
define([
  './App',
  'dbootstrap',
  'dojo/domReady!'
], function (
  App
) {
	document.body.className += ' loaded';

  return new App({
    container: document.getElementById('appLayout')
  }).startup();


});