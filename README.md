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

	require(['./bower_components/Wax/Wax.js'],function(Wax){
		var myTpl = Wax.compile('Nice and {{difficulty}}!');

		console.info(myTpl({
			difficulty : 'easy'
		});

	});
```


