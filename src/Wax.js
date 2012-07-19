/**
 * 	Wax : A template wrapper and manager for some 
 * 		popular JS implementations of the Mustache spec.
 * 	@version 0.1
 * 	
 * 	(c) 2012 Russell Munson
 *  http://github.com/fallenice/gesso
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
		/* Seriously ugly... so, rewrite soon */
	error = function(id){
		return _err(id) && _noop;
	}
	store = function(id,val){
		return ccache[id]=ccache[id]||val;
	},
	lookup = function(id){
		return ccache[id]|| error(id);
	},
	compile=(function(t,c){
		for(var key in t){
			if(t[key] && t.hasOwnProperty(key) && c.hasOwnProperty(key)){
				return c[key];
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
			tmlp=(doc.getElementById(id)||EMPTY).innerHTML;
			return compile(id,tmpl);
		}
		return error(id);
	},
	register = function(tmpl,id){
		return typeof tmpl==='function' ? store(id,tmpl) : compile(id,tmpl);
	},
	render = function(id,view,opts){
		return lookup(id)(view,opts);
	};

	ns.Wax={
		get 		: lookup,
		register 	: register,
		registerById: registerById,
		render 		: render
	}

})(this,document,{
	mustache 	: typeof Mustache!=='undefined' && Mustache,
	handlebars 	: typeof Handlebars!=='undefined' && Handlebars, 
	hogan 		: typeof Hogan!=='undefined' && Hogan
})