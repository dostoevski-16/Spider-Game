(function(){
  const { clamp, rand } = SG_UTILS;

  function circleCollide(ax,ay,ar, bx,by,br){
    const dx=ax-bx, dy=ay-by, r=ar+br;
    return dx*dx+dy*dy <= r*r;
  }

  class Spider {
    constructor(w,h){
      this.x = w*0.5; this.y = h*0.5;
      this.r = 18;
      this.vx = 0; this.vy = 0;
      this.speed = 220;
      this.webCooldown = 0;
      this.invuln = 0;
    }
    update(dt,input,w,h){
      const ax = (input.right - input.left);
      const ay = (input.down - input.up);
      const len = Math.hypot(ax,ay)||1;
      this.vx = (ax/len) * this.speed;
      this.vy = (ay/len) * this.speed;
      this.x = clamp(this.x + this.vx*dt, this.r, w-this.r);
      this.y = clamp(this.y + this.vy*dt, this.r, h-this.r);
      if(this.webCooldown>0) this.webCooldown-=dt;
      if(this.invuln>0) this.invuln-=dt;
    }
    canWeb(){ return this.webCooldown<=0; }
    fireWeb(){ this.webCooldown = 0.25; }
    draw(g){
      // body
      g.save();
      g.translate(this.x,this.y);
      g.fillStyle = this.invuln>0 ? "rgba(255,255,255,0.9)" : "rgba(240,240,255,0.9)";
      g.beginPath(); g.arc(0,0,this.r,0,Math.PI*2); g.fill();
      // legs
      g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3;
      for(let i=0;i<4;i++){
        g.beginPath(); g.moveTo(-this.r+2, -8+i*5); g.lineTo(-this.r-12, -14+i*8); g.stroke();
        g.beginPath(); g.moveTo(this.r-2, -8+i*5);  g.lineTo(this.r+12, -14+i*8);  g.stroke();
      }
      // eyes
      g.fillStyle = "#0b0f1a";
      g.beginPath(); g.arc(-6,-3,3,0,Math.PI*2); g.arc(6,-3,3,0,Math.PI*2); g.fill();
      g.restore();
    }
  }

  class Fly {
    constructor(w,h){
      this.x = rand(24,w-24);
      this.y = rand(24,h-24);
      this.r = 10;
      this.dir = rand(0,Math.PI*2);
      this.speed = rand(40,90);
      this.t = 0;
    }
    update(dt,w,h){
      this.t += dt;
      // noisy wandering
      this.dir += (Math.sin(this.t*3)+Math.cos(this.t*2))*0.2*dt;
      this.x += Math.cos(this.dir)*this.speed*dt;
      this.y += Math.sin(this.dir)*this.speed*dt;
      if(this.x<this.r||this.x>w-this.r) this.dir = Math.PI - this.dir;
      if(this.y<this.r||this.y>h-this.r) this.dir = -this.dir;
      this.x = clamp(this.x,this.r,w-this.r);
      this.y = clamp(this.y,this.r,h-this.r);
    }
    draw(g){
      g.save(); g.translate(this.x,this.y);
      g.fillStyle = "rgba(180,255,180,0.9)";
      g.beginPath(); g.arc(0,0,this.r,0,Math.PI*2); g.fill();
      g.fillStyle = "rgba(255,255,255,0.8)";
      g.beginPath(); g.ellipse(-6,-6,6,3,0,0,Math.PI*2); g.fill();
      g.beginPath(); g.ellipse(6,-6,6,3,0,0,Math.PI*2); g.fill();
      g.restore();
    }
  }

  class WebShot {
    constructor(x,y,tx,ty){
      this.x=x; this.y=y;
      const d = Math.hypot(tx-x,ty-y)||1;
      const s = 560;
      this.vx = (tx-x)/d*s;
      this.vy = (ty-y)/d*s;
      this.r = 5;
      this.alive = true;
      this.life = 0.8;
    }
    update(dt){
      this.life -= dt;
      if(this.life<=0) this.alive=false;
      this.x += this.vx*dt;
      this.y += this.vy*dt;
    }
    draw(g){
      g.save(); g.translate(this.x,this.y);
      g.fillStyle="rgba(220,220,255,0.95)";
      g.beginPath(); g.arc(0,0,this.r,0,Math.PI*2); g.fill();
      g.restore();
    }
  }

  class Beetle {
    constructor(w,h){
      this.x = Math.random()<0.5 ? (Math.random()<0.5? -20: w+20) : Math.random()*w;
      this.y = Math.random()<0.5 ? (Math.random()<0.5? -20: h+20) : Math.random()*h;
      this.r = 16;
      this.speed = 70;
      this.alive = true;
    }
    update(dt,w,h,spider){
      const dx = spider.x - this.x;
      const dy = spider.y - this.y;
      const d = Math.hypot(dx,dy)||1;
      const ax = dx/d, ay=dy/d;
      this.x += ax*this.speed*dt;
      this.y += ay*this.speed*dt;
    }
    draw(g){
      g.save(); g.translate(this.x,this.y);
      g.fillStyle="rgba(255,120,120,0.9)";
      g.beginPath(); g.arc(0,0,this.r,0,Math.PI*2); g.fill();
      g.restore();
    }
  }

  window.SG_ENT = { Spider, Fly, WebShot, Beetle, circleCollide };
})();
