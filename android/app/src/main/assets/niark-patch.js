(function(){
try{
  MODELS.fast.id='Qwen2.5-1.5B-Instruct-q4f32_1-MLC';

  var origLoad=loadLocal;
  loadLocal=function(){
    var p=Promise.resolve(origLoad());
    p.then(function(){$('#modelStat').textContent=MODELS[localModelKey].label}).catch(function(){});
    return p;
  };

  var origStream=localStream;
  localStream=async function(c,list,onText){
    try{return await origStream(c,list,onText)}
    catch(e){
      if(/mapAsync|unmapped|lost/i.test(String(e&&e.message||e))){
        localEngine=null;localEngineId=null;
        return await origStream(c,list,onText);
      }
      throw e;
    }
  };

  if(localStorage.getItem('niark:preloading')!=='1'){
    localStorage.setItem('niark:preloading','1');
    $('#modelStat').textContent='loading…';
    var tries=0;
    (function go(){
      if(window.NiarkWebLLM){
        loadLocal().then(function(){localStorage.removeItem('niark:preloading')},function(e){
          localStorage.removeItem('niark:preloading');
          $('#modelStat').textContent='not loaded';
          $('#loadText').textContent=e.message;
        });
      }else if(++tries<40){setTimeout(go,1000)}
      else{localStorage.removeItem('niark:preloading');$('#modelStat').textContent='not loaded'}
    })();
  }else{localStorage.removeItem('niark:preloading')}
}catch(e){console.error('niark patch',e)}
})();
