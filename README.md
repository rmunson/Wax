Wax.js 
===
#####Keep your Mustache nice and neat.

A template wrapper and manager for some popular JS implementations of the Mustache spec

### Why might Wax be useful in your project?
The goal of this project is to create a unified and implementation agnostic API for loading, compiling, rendering and caching mustache templates.  Providing a stable API and feature-set will add a layer of abstraction between your view, view model, and templating engine.  
This should help to promote easier cross-platform/project code sharing and allow users to choose the "best fit" Mustache implementation for whatever scenario. 

If you, for example, would like to use Hogan.js on the server, and Mustache.js on the client?   Wax will detect and handle interfacing with Hogan/Mustache for you. (See note below for use with Requirejs)




_The current scope includes support for Mustache.js (0.5.2-0.8.x) and Hogan.js (2.0.0-3.0.x).  Also verified compatibility with requirejs-hogan-plugin (0.3.x)._

### Using with Requirejs
Wax comes amd ready out of the box.  However, you will need to point it at your Mustache implementation of choice.

Just add a path definition for 'WaxMustache' to your require config:

```
	require.config({
		paths : {
			"WaxMustache" : "./bower_components/hogan/web/builds/3.0.2/hogan-3.0.2.amd"
		}
	});

	require(['./bower_components/Wax/Wax'],function(Wax){
		var myTpl = Wax.compile('Nice and {{difficulty}}!');

		console.info(myTpl({
			difficulty : 'easy'
		});

	});
```
### Using as a Requirejs Loader plugin
Wax comes packed with a built-in Requirejs loader plugin to streamline your template inclusion.  Wax will compile and return the template object for rendering (just is if you called Wax.compile on a local string).

Just add a path definition for 'WaxMustache' to your require config, as shown above.  Since the loader is build on-top of requirejs-text, you will also need to add a path for "text" if it is not living on you're baseUrl.  See https://github.com/requirejs/text#usage for more info.

Your config should look something like : 

```
	require.config({
		paths : {
			"WaxMustache" : "./bower_components/hogan/web/builds/3.0.2/hogan-3.0.2.amd",
			"text" 		  : "./bower_comonents/text/text"
		}
	});
```
You can then simply call Wax/get using the loader syntax.

```
	require(['./bower_components/Wax/Wax/get!mytemplate-path'],function(template){
		var myTpl = template('Nice and {{difficulty}}!');

		console.info(myTpl({
			difficulty : 'easy'
		});

	});
```

