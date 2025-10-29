(function(){
  const canvas = document.getElementById("game");
  const $score = document.getElementById("score");
  const $time = document.getElementById("time");
  const $hiscore = document.getElementById("hiscore");
  const btnStart = document.getElementById("btn-start");
  const btnPause = document.getElementById("btn-pause");
  const btnReset = document.getElementById("btn-reset");
  const btnWeb = document.getElementById("btn-web");
  const joystick = document.getElementById("joystick");

  const input = {up:0,down:0,left:0,right:0};
  const keys = {
    "ArrowUp":"up","KeyW":"up",
    "ArrowDown":"down","KeyS":"down",
    "ArrowLeft":"left","KeyA":"left",
    "ArrowRight":"right","KeyD":"right"
  };
  function setKey(e,val){
    const k = keys[e.code];
    if(k){ input[k]=val; e.preventDefault(); }
    if(e.code==="Space" && val===1){ game.fireWeb(); e.preventDefault(); }
  }
  window.addEventListener("keydown", e=>setKey(e,1));
  window.addEventListener("keyup", e=>setKey(e,0));

  // joystick (mobile)
  (function(){
    if(!joystick) return;
    let dragging=false, cx=0, cy=0, r=50;
    const stick = joystick.querySelector(".stick");
    const getPos = (e)=>{
      const t = e.touches? e.touches[0]: e;
      const rect = joystick.getBoundingClientRect();
      return { x: t.clientX-rect.left, y: t.clientY-rect.top, w:rect.width, h:rect.height };
    };
    const onDown = (e)=>{ dragging=true; const p=getPos(e); cx=p.x; cy=p.y; update(p); };
    const onMove = (e)=>{ if(!dragging) return; const p=getPos(e); update(p); };
    const onUp = ()=>{ dragging=false; input.up=input.down=input.left=input.right=0; stick.style.transform="translate(-50%,-50%)"; };
    const update = (p)=>{
      const dx = p.x - p.w/2;
      const dy = p.y - p.h/2;
      const len = Math.hypot(dx,dy)||1;
      const nx = dx/len, ny = dy/len;
      input.left = nx<-0.2?1:0;
      input.right = nx>0.2?1:0;
      input.up = ny<-0.2?1:0;
      input.down = ny>0.2?1:0;
      const mag = Math.min(1, len/(r));
      stick.style.transform = `translate(calc(-50% + ${dx*0.6}px), calc(-50% + ${dy*0.6}px))`;
    };
    joystick.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    joystick.addEventListener("touchstart", onDown, {passive:false});
    window.addEventListener("touchmove", onMove, {passive:false});
    window.addEventListener("touchend", onUp, {passive:false});
  })();

  const ui = {
    input,
    updateHUD(score, time){
      $score.textContent = score;
      $time.textContent = time.toFixed(1);
    },
    onGameOver(score){
      const hi = Number(localStorage.getItem("spider_hi")||"0");
      if(score>hi){ localStorage.setItem("spider_hi", String(score)); }
      $hiscore.textContent = String(Math.max(score, hi));
      alert(`Hết giờ! Điểm của bạn: ${score}`);
    },
    play(name){
      // resume audio ctx on first interaction (browser policy)
      if(SG_AUDIO.ctx && SG_AUDIO.ctx.state==="suspended"){
        SG_AUDIO.ctx.resume().catch(()=>{});
      }
      SG_AUDIO.play(name);
    }
  };

  const game = new SG_ENGINE.Engine(canvas, ui);
  $hiscore.textContent = localStorage.getItem("spider_hi") || "0";

  btnStart.addEventListener("click", ()=>game.start());
  btnPause.addEventListener("click", ()=>game.pause());
  btnReset.addEventListener("click", ()=>{ game.pause(); game.reset(); game.start(); });
  btnWeb.addEventListener("click", ()=>game.fireWeb());

  // auto start
  game.start();
})();
