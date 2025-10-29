(function(){
  const ctx = window.AudioContext ? new AudioContext() : null;

  function beep(freq=880, time=0.07, type="sine", gain=0.05){
    if(!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(ctx.destination);
    const t = ctx.currentTime;
    osc.start(t);
    osc.stop(t+time);
  }

  const sounds = {
    web(){ beep(1500, 0.05, "triangle", 0.04); },
    catch(){ beep(900, 0.06, "square", 0.06); beep(1200, 0.08, "square", 0.04); },
    hit(){ beep(200, 0.12, "sawtooth", 0.06); }
  };

  window.SG_AUDIO = { play:(name)=>{ const fn=sounds[name]; if(fn){ try{ fn(); }catch{} } }, ctx };
})();
