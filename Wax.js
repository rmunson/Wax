/**
 *  Wax : A template wrapper and manager for some 
 *      popular JS implementations of the Mustache spec.
 *  @version 0.2
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function(require,exports,module){
            var mustachelib=require('WaxMustache');
            return factory(mustachelib);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var jQuery = require('jquery');
        module.exports = factory( jQuery );
    } else{
        root.Wax = factory(typeof Mustache!=='undefined' && Mustache || typeof Hogan!=='undefined' && Hogan);
    }
}(this,function(YourMustache){
    if(YourMustache===undefined){
        _err(ERROR+"Template engine not found");
    }
    var primary,
        EMPTY   = '',
        FN      = 'function',
        STRING  = 'STRING',
        ERROR   = 'Wax error : ',
        ERROR_TEMPLATE  = ERROR + 'attempting to call unregistered template ',
        ERROR_HELPER    = ERROR + 'attempting to register helper with an existing id ',
        MUSTACHENAME    = "mustache.js",
        ccache  = {},
        hcache  = {},
        doc = document,

    _noop   = function(){},
    _err    = function(ERR,id){
        throw new Error(ERR+id);
        return false;
    },
    isFunc  = function(nf){
        return typeof nf===FN;
    },

    isString = function(gnirts){
        return typeof gnirts === STRING;
    },
    /**
     * Generate an error and return a no-operation function def to avoid
     * additional errors.
     * @param  {string} id ID associated with the failed operation
     * @return {function}    Empty function
     */
    error = function(id){
        return _err(ERROR_TEMPLATE,id) || _noop;
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
        return ccache[id] || error(id);
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

    attachHelpers = function(ctx){
        var key;
        for(key in hcache){
            ctx[key]=ctx[key]||hcache[key];
        }
    },
    register = function(id,tmpl){
        return compile(tmpl,id);
    },
    registerById = function(id){
        var tmpl;
        if(typeof id==="string"){
            tmpl=(doc.getElementById(id)||EMPTY).innerHTML;
            return tmpl && compile(id,tmpl);
        }
        return error(id);
    },
    registerHelper=function(id,fn){
        return hcache[id] && _err(ERROR_HELPER,id) || !!(hcache[id]=fn);
    },
    render = function(id,view,opts){
        return get(id)(view,opts);
    },
        // Detect the compiler
    compile=(function(_compile){
        return function(tmpl,id){
            return ccache[id||tmpl] || _compile(tmpl,id);
        }
    })(YourMustache.name && YourMustache.name===MUSTACHENAME ? 
        // Mustache.js detected
        (YourMustache.compile ? function(tmpl,id){
            var tmp=isFunc(tmpl) && tmpl || YourMustache.compile(tmpl);

            function fn(ctx,partials){
                attachHelpers(ctx);
                return tmp(ctx,partials)
            };
            fn.__nowax__=tmp;
            return store(id||tmpl,fn);
        } : function(tmpl,id){
            YourMustache.parse(tmpl);

            function fn(ctx,partials){
                attachHelpers(ctx);
                return YourMustache.render(tmpl,ctx,partials);
            }
            fn.__nowax__=tmpl;
            return store(id||tmpl,fn);
        }) : 
        // Not Mustache.js - Betting on Hogan
        function(tmpl,id){
            var tmp=isString(tmpl) && YourMustache.compile(tmpl) || new YourMustache.Template(tmpl);
            // console.log(tmpl());
            function fn(ctx,partials){
                var opts;
                if(partials){
                    opts=getRawPartials(partials);
                }
                attachHelpers(ctx);
                return tmp.render(ctx,opts);
            };
            fn.__nowax__=tmp;
            return store(id||tmpl,fn);
        }
    );

    return {
        get             : get,
        lookup          : lookup,
        compile         : compile,
        register        : register,
        registerById    : registerById,
        registerHelper  : registerHelper,
        render          : render,
        list            : function(){
            return ccache;
        }
    }
}));
