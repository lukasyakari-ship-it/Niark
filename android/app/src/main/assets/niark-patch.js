(function(){
try{
  MODELS.fast.id='Qwen2.5-1.5B-Instruct-q4f32_1-MLC';
  var oldWorker=null;

  loadLocal=function(){
    var m=MODELS[localModelKey];
    if(localEngine&&localEngineId===m.id)return Promise.resolve(localEngine);
    if(loading)return loading;
    loading=(async function(){
      if(!window.NiarkWebLLM)throw Error('WebLLM is still loading. Connect once and try again.');
      $('#loadText').textContent='Downloading/loading '+m.label+'…';
      $('#modelLoad').disabled=true;
      $('#prog').style.width='0%';
      if(oldWorker){try{oldWorker.terminate()}catch(x){}}
      localEngine=null;localEngineId=null;
      oldWorker=new Worker(new URL('niark-worker.js',location.href),{type:'module'});
      var eng=await window.NiarkWebLLM.CreateWebWorkerMLCEngine(oldWorker,m.id,{initProgressCallback:function(r){
        var x=Math.max(0,Math.min(1,Number(r&&r.progress)||0));
        $('#prog').style.width=(x*100)+'%';
        $('#loadText').textContent=((r&&r.text)||'Loading model…')+' '+Math.round(x*100)+'%';
      }});
      localEngine=eng;localEngineId=m.id;
      $('#prog').style.width='100%';
      $('#loadText').textContent='Model loaded — running locally.';
      $('#modelStat').textContent=m.label+' (worker)';
      return eng;
    })().finally(function(){$('#modelLoad').disabled=false;loading=null});
    return loading;
  };

  localStream=async function(c,list,onText){
    var e=await loadLocal(),st=STYLES[chatStyle],start=performance.now(),first=0,full='';
    ctrl={abort:function(){try{e.interruptGenerate()}catch(x){}}};
    var chunks=await e.chat.completions.create({messages:buildLocal(c,list),temperature:st.temp,max_tokens:st.max,stream:true});
    for await(var ch of chunks){
      var t=(ch.choices&&ch.choices[0]&&ch.choices[0].delta&&ch.choices[0].delta.content)||'';
      if(t){if(!first)first=performance.now();full+=t;onText(full)}
    }
    var end=performance.now(),tokens=Math.max(1,Math.ceil(full.length/4));
    $('#ttft').textContent=Math.round((first||end)-start)+' ms';
    $('#tps').textContent=(tokens/Math.max(.001,(end-(first||start))/1000)).toFixed(1)+' tok/s';
    return full;
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
