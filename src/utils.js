(function(){
  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  const rand = (a,b)=>Math.random()*(b-a)+a;
  const now = ()=>performance.now();

  window.SG_UTILS = { clamp, rand, now };
})();
