// Interactive background: magnetic dot grid + eased cursor glow + purple click shockwaves.
(function(){
  const c=document.getElementById("bg"),x=c.getContext("2d"),root=document.documentElement;
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LV=[{gap:38},{gap:62}],R=230,ptr={x:-9999,y:-9999,on:false,t:0},cur={x:0,y:0};
  let W,H,D,G=[],rip=[],col={t:"0,0,0",p:"0,0,0"},dark=true,run=false,last=0,lvl=0,off=false,ready=false,prev=0,acc=0,cnt=0;
  const rgb=h=>{h=h.trim().replace("#","");if(h.length===3)h=h.replace(/./g,"$&$&");const n=parseInt(h,16);return(n>>16&255)+","+(n>>8&255)+","+(n&255)};
  function css(){const s=getComputedStyle(root);col.t=rgb(s.getPropertyValue("--teal"));col.p=rgb(s.getPropertyValue("--purple"));dark=root.dataset.theme!=="light";if(ready&&!off&&(still||!run))frame(0)}
  function size(){
    D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);
    const q=LV[Math.min(lvl,1)],GAP=q.gap;G=[];for(let gy=GAP/2;gy<H+GAP;gy+=GAP)for(let gx=GAP/2;gx<W+GAP;gx+=GAP)G.push(gx,gy);
    cur.x=W/2;cur.y=H/2;if(ready&&!off&&(still||lvl===2))frame(0)}
  function frame(t){
    const dt=Math.max(1,Math.min(40,t-last||16.7)),k=dt/16.7;last=t;
    let tx=ptr.x,ty=ptr.y,idle=!ptr.on||t-ptr.t>4000;
    if(idle){tx=W/2+Math.sin(t*.0004)*W*.32;ty=H/2+Math.cos(t*.00031)*H*.25}
    cur.x+=(tx-cur.x)*Math.min(1,.14*k);cur.y+=(ty-cur.y)*Math.min(1,.14*k);
    const mx=cur.x,my=cur.y;
    x.clearRect(0,0,W,H);
    const g=x.createRadialGradient(mx,my,0,mx,my,R*1.3);
    g.addColorStop(0,`rgba(${col.t},${dark?.2:.17})`);g.addColorStop(1,`rgba(${col.t},0)`);
    x.fillStyle=g;x.fillRect(mx-R*1.4,my-R*1.4,R*2.8,R*2.8);
    rip=rip.filter(r=>t-r.t0<1400);
    // dot grid: bulges away from cursor, lights up near it and along shockwaves
    x.fillStyle=`rgba(${col.t},${dark?.17:.24})`;x.beginPath();
    const near=[];
    for(let i=0;i<G.length;i+=2){
      const gx=G[i],gy=G[i+1],dx=gx-mx,dy=gy-my,d=Math.hypot(dx,dy),f=d<R?1-d/R:0;let ox=0,oy=0,b=0;
      if(f){const q=f*f*26/(d||1);ox=dx*q;oy=dy*q}
      for(const r of rip){const rr=(t-r.t0)*.55,ex=gx-r.x,ey=gy-r.y,ed=Math.hypot(ex,ey),band=1-Math.abs(ed-rr)/70;
        if(band>0){const life=1-(t-r.t0)/1400,q=band*band*22*life/(ed||1);ox+=ex*q;oy+=ey*q;b=Math.max(b,band*life)}}
      if(f>0||b>0)near.push(gx+ox,gy+oy,Math.max(f,b),b>f?1:0);else x.rect(gx-1,gy-1,2,2)}
    x.fill();
    for(let i=0;i<near.length;i+=4){const f=near[i+2];x.globalAlpha=.25+f*.75;x.fillStyle=`rgb(${near[i+3]?col.p:col.t})`;x.beginPath();x.arc(near[i],near[i+1],1+f*2.4,0,7);x.fill()}
    x.globalAlpha=1;
    // cursor ring + dot
    if(!idle){x.strokeStyle=`rgba(${col.t},.75)`;x.lineWidth=1.5;x.beginPath();x.arc(mx,my,18,0,7);x.stroke();
      x.fillStyle=`rgb(${col.t})`;x.beginPath();x.arc(ptr.x,ptr.y,2.5,0,7);x.fill()}
  }
  // adaptive quality: if the average frame takes >26ms (~<40fps), lighten the effect; if still slow, freeze to a static image
  function step(t){
    if(!run)return;frame(t);
    if(prev){cnt++;if(cnt>30)acc+=t-prev}
    prev=t;
    if(cnt>=90){const avg=acc/60;cnt=0;acc=0;
      if(avg>26){if(lvl<1){lvl=1;size()}else{lvl=2;run=false;x.clearRect(0,0,W,H);frame(0);return}}}
    requestAnimationFrame(step)}
  function go(){if(still||off||run||document.hidden||lvl===2)return;run=true;last=0;prev=0;cnt=0;acc=0;requestAnimationFrame(step)}
  const mv=e=>{ptr.x=e.clientX;ptr.y=e.clientY;ptr.on=true;ptr.t=performance.now()};
  addEventListener("resize",size);
  addEventListener("pointermove",mv);
  addEventListener("pointerdown",e=>{mv(e);if(!still){rip.push({x:e.clientX,y:e.clientY,t0:performance.now()});if(rip.length>6)rip.shift()}});
  root.addEventListener("mouseleave",()=>{ptr.on=false});
  document.addEventListener("visibilitychange",()=>{run=false;go()});
  new MutationObserver(()=>requestAnimationFrame(css)).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  const btn=document.getElementById("fxBtn");
  try{off=localStorage.getItem("gc-fx")==="off"}catch(e){}
  if(btn){btn.checked=!off;
    btn.onchange=()=>{off=!btn.checked;try{localStorage.setItem("gc-fx",off?"off":"on")}catch(e){}
      if(off){run=false;x.clearRect(0,0,W,H)}else{lvl=0;size();still?frame(0):go()}}}
  css();size();ready=true;
  if(off)x.clearRect(0,0,W,H);else if(still)frame(0);else go();
})();
