define(['text','./Wax'],function(text,Wax){
    var buildOutput = {};

    return {
        load : function(fileName, parentRequire, onLoad, config){
            text.get(parentRequire.toUrl(fileName), function(templateString){
                var tpl;
                // If we're in an rjs optimizer routine, compile for Hogan, and
                // return the string for mustache
                if(config.isBuild){
                    tpl=buildOutput[fileName]=Wax.compile.isHogan ? 
                        Wax.WaxMustache.compile(templateString,{asString:true}) :
                        '"'+text.jsEscape(templateString) + '"';
                }else{
                    tpl=Wax.register(fileName,templateString);
                }
                onLoad(tpl);
            });
        },
        write : function(pluginName, fileName, write){
            var out = 'define("'+pluginName+'!"'+fileName+',["Wax/Wax"],function(Wax){' +
                'return Wax.register("'+fileName+'",'+
                    buildOutput[fileName] +
                    ');' +
                '});'
            write(out);
        }
    }
})
