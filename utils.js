var glob = require("glob"); 
exports = module.exports = function(env){
  return {
    getJSFiles:function(pattern){
      return glob.sync(pattern)
    },
    cdn:function(url){
      var cdnUrl="";
      if(env == "PRODUCTION"){
        cdnUrl+=url;
      }else{
        cdnUrl+=url;
      }
      return cdnUrl;
    }   
  }
}
