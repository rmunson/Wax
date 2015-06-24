
var rjs     = require('requirejs'),
    expect  = require('chai').expect,
    path    = require('path');


var hoganTest='\ndefine("get!test/loader",["Wax/Wax"],function(Wax){return Wax.register("test/loader",{code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("RJS loaded ");t.b(t.v(t.f("yesOrNo",c,p,0)));t.b("\\n");return t.fl(); },partials: {}, subs: {  }});});',
    mustacheTest='\ndefine("get!test/loader",["Wax/Wax"],function(Wax){return Wax.register("test/loader","RJS loaded {{yesOrNo}}\\n");});';

describe('Using requirejs to optimize Wax/get loaded template', function () {
    this.timeout(5000);
    it('WaxMustache is Hogan', function (done) {
        rjs.optimize({
            name     : "buildy-testy-hogan",
            optimize : 'none',
            // normalizeDirDefines : "skip",
            out     : function(data,err){
                done();
            },
            onBuildWrite : function(moduleName, path, contents){
                if(path === "get!test/loader"){
                    expect(contents).to.equal(hoganTest);
                }
                return contents;
            },
            paths       : {
                "text" : "./bower_components/text/text",
                "WaxMustache" : "./bower_components/hogan/web/builds/3.0.2/hogan-3.0.2.amd"
            },
            rawText     : {
                "buildy-testy-hogan" : "define(function(require,module,exports){  return require('./get!./test/loader'); })"
            }
        });
    });

    it('WaxMustache is Mustache', function (done) {

        rjs.optimize({
            name     : "buildy-testy-mustache",
            optimize : 'none',
            out     : function(data,err){
                done();
            },
            onBuildWrite : function(moduleName, path, contents){
                if(path === "get!test/loader"){
                    expect(contents).to.equal(mustacheTest);
                    // done();
                }
                return contents;
            },
            paths       : {
                "text" : "./bower_components/text/text",
                "WaxMustache" : "./bower_components/mustache.js/mustache"
            },
            rawText     : {
                "buildy-testy-mustache" : "define(function(require,module,exports){  return require('./get!./test/loader'); })"
            }
        })


    });
});
