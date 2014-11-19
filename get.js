define(['text','./Wax'],function(text,Wax){
    var MUSTACHE="mustache",
        buildOutput = {};

    return {
        load : function(module, parentRequire, onLoad, config){
            var file = text.parseName(module),
                fileName=file.moduleName + '.'+(file.ext||MUSTACHE);
            console.info('load',fileName,module);
            text.get(parentRequire.toUrl(fileName), function(templateString){
                var tpl;
                // If we're in an rjs optimizer routine, compile for Hogan, and
                // return the string for mustache
                if(config.isBuild){
                    tpl=buildOutput[module]=Wax.compile.isHogan ? 
                        Wax.WaxMustache.compile(templateString,{asString:true}) :
                        '"'+text.jsEscape(templateString) + '"';
                } else {
                    tpl=Wax.register(module,templateString);
                }
                onLoad(tpl);
            });
        },
        write : function(pluginName, module, write){
            var out = 'define("'+pluginName+'!"'+module+',["Wax/Wax"],function(Wax){' +
                'return Wax.register("'+module+'",'+
                        buildOutput[module] +
                    ');' +
                '});';
            console.info('write',module);
            write(out);
        }
    }
})
