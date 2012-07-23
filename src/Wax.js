/**
 * 	Wax : A template wrapper and manager for some 
 * 		popular JS implementations of the Mustache spec.
 * 	@version 0.1beta
 */

(function(ns,doc,T){

	var EMPTY='',
		FN 	='function',
		ccache={},
		rcache={},
		_noop=function(){},
		_err=function(id){
			throw new Error('Wax error : attempting to call unregistered template '+id);
			return true;
		},

	/**
	 * Generate an error and return a no-operation function def to avoid
	 * additional errors.
	 * @param  {string} id ID associated with the failed operation
	 * @return {function}    Empty function
	 */
	error = function(id){
		return _err(id) && _noop;
	},

	/**
	 * Add a compiled template to the compile cache ccache.
	 * @param  {string} id  Key used for storage/retrieval of a compiled template
	 * @param  {function} tmpl Compiled template
	 * @return {function}     Compiled template stored during the operation
	 */
	store = function(id,tmpl){
		return ccache[id]=ccache[id]||tmpl;
	},

	/**
	 * Retrieve a registered template from the cache
	 * @param  {string} id Named template key to retrieve
	 * @return {function}    Compiled template or a no-operation function
	 */
	lookup = function(id){
		return get(id)|| error(id);
	},

	/**
	 * More aggressive retrieve. Pull a registered template from the cache or 
	 * attempt to find it in the current document.
	 * @param  {string} id Named template key to retrieve
	 * @return {function}    Compiled template or a no-operation function
	 */
	get = function(id){
		return ccache[id] || registerById(id) || error(id);
	},

	getRawPartials = function(pars){
		var key,
			ret={},
			par;
		for(key in pars){
			par=pars[key];
			ret[key] = typeof par===FN && par.__nowax__ || par;
		}
		return ret;
	},
	compile=(function(t,co){
		var c;
		for(var key in t){
			if(t[key] && t.hasOwnProperty(key) && co.hasOwnProperty(key)){
				c=co[key];
				return function(id,tmpl){
					return ccache[id||tmpl] || c(id,tmpl);
				}
			}
		}
	})(T,{
		mustache : function(_id,tmpl){
			return store(_id||tmpl,Mustache.compile(tmpl));
		},

		handlebars : function(_id,tmpl){
			var tmp=Handlebars.compile(tmpl),
				fn=function(ctx,partials){
					var opts;
					if(partials){
						opts={ partials:getRawPartials(partials)};
					}
					return tmp(ctx,opts);
				};
			fn.__nowax__=tmpl;
			return store(_id||tmpl,fn);
		},

		hogan : function(_id,tmpl){
			var tmp=Hogan.compile(tmpl),
			fn=function(ctx,partials){
				var opts;
				if(partials){
					opts=getRawPartials(partials);
				}
				return tmp.render(ctx,opts);
			};
			fn.__nowax__=tmp;
			return store(_id||tmpl,fn);
		}
	}),

	registerById = function(id){
		var tmpl;
		if(typeof id==="string"){
			tmpl=(doc.getElementById(id)||EMPTY).innerHTML;
			return tmpl && compile(id,tmpl);
		}
		return error(id);
	},
	register = function(tmpl,id){
		return typeof tmpl==='function' ? store(id,tmpl) : compile(id,tmpl);
	},
	render = function(id,view,opts){
		return get(id)(view,opts);
	};

	ns.Wax={
		get 			: get,
		lookup 			: lookup,
		register 		: register,
		registerById	: registerById,
		render 			: render
	}

})(this,document,{
	mustache 	: typeof Mustache!=='undefined' && Mustache,
	handlebars 	: typeof Handlebars!=='undefined' && Handlebars, 
	hogan 		: typeof Hogan!=='undefined' && Hogan
})