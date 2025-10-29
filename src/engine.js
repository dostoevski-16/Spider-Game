(function(){
  const { circleCollide } = SG_ENT;
  const { now, clamp, rand } = SG_UTILS;

  class Engine {
    constructor(canvas, ui){
      this.g = canvas.getContext("2d");
      this.canvas = canvas;
      this.ui = ui;
      this.reset();
      this._raf = null;
      this._last = 0;
      this._running = false;
      this._pointer = {x:canvas.width/2, y:canvas.height/2};
      this._bind();
    }
    _bind(){
      const c=this.canvas;
      c.addEventListener("mousemove",(e)=>{
        const rect=c.getBoundingClientRect();
        this._pointer.x = (e.clientX-rect.left) * (c.width/rect.width);
        this._pointer.y = (e.clientY-rect.top) * (c.height/rect.height);
      });
      c.addEventListener("click",()=>this.fireWeb());
      window.addEventListener("resize",()=>this._fit());
      this._fit();
    }
    _fit(){
      // keep 16:9, scale via CSS only (canvas buffer stays fixed for crispness)
      // No action needed here for buffer; CSS handles scaling.
    }
    reset(){
      const { Spider, Fly, Beetle } = SG_ENT;
      this.w = this.canvas.width; this.h = this.canvas.height;
      this.spider = new Spider(this.w,this.h);
      this.flies = Array.from({length:8}, _=> new Fly(this.w,this.h));
      this.beetles = [];
      this.webs = [];
      this.time = 60;
      this.score = 0;
      this.spawnTimer = 0;
      this.gameOver = false;
    }
    start(){
      if(this._running) return;
      this._running = true;
      this._last = now();
      const loop = ()=>{
        if(!this._running) return;
        const t = now();
        const dt = Math.min(0.033,(t-this._last)/1000);
        this._last = t;
        this.update(dt);
        this.render();
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    pause(){
      this._running = false;
      if(this._raf) cancelAnimationFrame(this._raf);
    }
    update(dt){
      if(this.gameOver) return;
      const { input } = this.ui;
      this.time -= dt;
      if(this.time<=0){
        this.time = 0;
        this.gameOver = true;
        this.ui.onGameOver(this.score);
      }
      this.spider.update(dt,input,this.w,this.h);
      // spawn beetles slowly
      this.spawnTimer -= dt;
      if(this.spawnTimer<=0){
        this.beetles.push(new SG_ENT.Beetle(this.w,this.h));
        this.spawnTimer = clamp(4 - Math.min(3, Math.floor(this.score/10)*0.5), 1.2, 4);
      }
      // update flies
      for(const f of this.flies) f.update(dt,this.w,this.h);
      // update beetles
      for(const b of this.beetles) b.update(dt,this.w,this.h,this.spider);
      // webs
      for(const w of this.webs) w.update(dt);
      this.webs = this.webs.filter(w=>w.alive);

      // collisions: web vs fly
      for(const w of this.webs){
        for(const f of this.flies){
          if(f && circleCollide(w.x,w.y, w.r, f.x,f.y, f.r)){
            f.x = -9999; f.y = -9999; // mark caught
            this.score += 1;
            this.ui.play("catch");
          }
        }
      }
      // respawn flies that are caught (off-screen)
      for(let i=0;i<this.flies.length;i++){
        const f=this.flies[i];
        if(f.x<-1000){
          this.flies[i]=new SG_ENT.Fly(this.w,this.h);
        }
      }
      // beetle hits spider
      if(this.spider.invuln<=0){
        for(const b of this.beetles){
          if(circleCollide(b.x,b.y,b.r, this.spider.x,this.spider.y,this.spider.r)){
            this.time = Math.max(0, this.time - 5);
            this.spider.invuln = 1.5;
            this.ui.play("hit");
            break;
          }
        }
      }

      this.ui.updateHUD(this.score, this.time);
    }
    render(){
      const g=this.g, w=this.w, h=this.h;
      g.clearRect(0,0,w,h);
      // subtle grid
      g.globalAlpha = 0.25;
      g.lineWidth = 1;
      g.beginPath();
      for(let x=0;x<w;x+=48){ g.moveTo(x,0); g.lineTo(x,h); }
      for(let y=0;y<h;y+=48){ g.moveTo(0,y); g.lineTo(w,y); }
      g.strokeStyle = "rgba(255,255,255,0.08)";
      g.stroke();
      g.globalAlpha = 1;

      // draw entities
      for(const f of this.flies) f.draw(g);
      for(const w of this.webs) w.draw(g);
      for(const b of this.beetles) b.draw(g);
      this.spider.draw(g);

      // aim line
      g.globalAlpha=0.4;
      g.beginPath();
      g.moveTo(this.spider.x,this.spider.y);
      g.lineTo(this._pointer.x,this._pointer.y);
      g.strokeStyle="rgba(255,255,255,0.5)"; g.stroke();
      g.globalAlpha=1;
    }
    fireWeb(){
      if(this.gameOver) return;
      if(this.spider.canWeb()){
        this.spider.fireWeb();
        this.ui.play("web");
        this.webs.push(new SG_ENT.WebShot(
          this.spider.x,this.spider.y,
          this._pointer.x,this._pointer.y
        ));
      }
    }
  }

  window.SG_ENGINE = { Engine };
})();
