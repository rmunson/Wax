/**
 * 	Wax : A template wrapper and manager for some 
 * 		popular JS implementations of the Mustache spec.
 * 	@version 0.1beta
 */

(function(ns,doc,T){

	var EMPTY='',
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
			var tmp=Handlebars.compile(tmpl);
			return store(_id||tmpl,function(){
				var opts;
				if(arguments.length>1){
					opts={ partials:arguments[1]};
				}
				return tmp.call(tmp,arguments[0],opts);
			});
		},

		hogan : function(_id,tmpl){
			var tmp=Hogan.compile(tmpl);
			return store(_id||tmpl,function(){
					return tmp.render.apply(tmp,arguments);
			})
		}
	}),

	registerById = function(id){
		var tmpl;
		if(typeof id==="string"){
			tmpl=(doc.getElementById(id)||EMPTY).innerHTML;
			return compile(id,tmpl);
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