// Animated background: drifting teal/red particles linked by thin lines, reacting to the cursor.
(function(){
  const c=document.getElementById("bg"),x=c.getContext("2d"),still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W,H,P=[],m={x:-999,y:-999},col={},run=false;
  const css=()=>{const s=getComputedStyle(document.documentElement);col.t=s.getPropertyValue("--teal").trim();col.r=s.getPropertyValue("--red").trim();if(still)draw()};
  function size(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    const n=Math.min(80,Math.round(W*H/20000));
    P=Array.from({length:n},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:1.4+Math.random()*1.6,red:i%8===0}));
    if(still)draw()}
  function draw(){
    x.clearRect(0,0,W,H);x.lineWidth=1;
    for(let i=0;i<P.length;i++){const a=P[i];
      for(let j=i+1;j<P.length;j++){const b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<140){x.globalAlpha=(1-d/140)*.28;x.strokeStyle=col.t;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
      const dm=Math.hypot(a.x-m.x,a.y-m.y);
      if(dm<180){x.globalAlpha=(1-dm/180)*.6;x.strokeStyle=a.red?col.r:col.t;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke()}
      x.globalAlpha=.75;x.fillStyle=a.red?col.r:col.t;x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill()}
  }
  function step(){
    if(!run)return;
    for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
    draw();requestAnimationFrame(step)}
  function go(){if(still||run||document.hidden)return;run=true;requestAnimationFrame(step)}
  addEventListener("resize",size);
  addEventListener("pointermove",e=>{m.x=e.clientX;m.y=e.clientY});
  document.addEventListener("pointerleave",()=>{m.x=m.y=-999});
  document.addEventListener("visibilitychange",()=>{run=false;go()});
  new MutationObserver(css).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  css();size();go();
})();
