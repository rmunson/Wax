define(['text','./Wax'],function(text,Wax){
    var buildOutput = {};

    return {
        load : function(fileName, parentRequire, onLoad, config){
            text.get(parentRequire.toUrl(fileName), function(templateString){
                var tpl;
                // If we're in an rjs optimizer routine and you've
                // asked for template compilation - assuming hogan
                if(config.isBuild && config.compile){
                    tpl=buildOutput[fileName]=Wax.WaxMustache.compile(templateString,{asString:true});
                }else{
                    tpl=Wax.register(fileName,templateString);
                }
                onLoad(tpl);
            });
        },
        write : function(pluginName, fileName, write){
            var out = 'define("'+pluginName+'!"'+moduleName+',["Wax/Wax"],function(Wax){' +
                'return Wax.register("'+id+'",'+
                    buildOutput[fileName] +
                    ');' +
                '});'
            write(out);
        }
    }
})
