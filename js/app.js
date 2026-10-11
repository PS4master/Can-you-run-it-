const $=s=>document.querySelector(s);
const TC=["r","a","a","g","g","g"];
const RN=["1280×720 (HD)","1366×768","1600×900 (HD+)","1920×1080 (Full HD)","2560×1080 (Ultrawide)","2560×1440 (2K / QHD)","3440×1440 (Ultrawide QHD)","3840×2160 (4K)","7680×4320 (8K)"];
const I={
fa:{title:"سیستمت بازی رو می‌کشه؟",sub:"سخت‌افزار، بازی و رزولوشن رو انتخاب کن تا ببینی اجرا میشه یا نه و چند فریم میده.",specs:"مشخصات سیستم",gpu:"کارت گرافیک",cpu:"پردازنده",ram:"رم",gs:"بازی و تنظیمات",game:"بازی",res:"رزولوشن",qual:"کیفیت گرافیک",go:"ببینیم اجرا میشه یا نه",hint:"می‌تونی کلید Enter رو هم بزنی.",foot:"نتایج تخمینی هستن و ممکنه روی سیستم واقعی کمی فرق کنن.",
 q:["پایین","متوسط","بالا","اولترا"],lang:"EN",
 st:["در حال بررسی کارت گرافیک…","در حال بررسی پردازنده…","در حال بررسی رم و حافظه گرافیکی…","در حال محاسبه فریم‌ریت…"],
 tx:["اجرا نمیشه","اجرا میشه ولی ضعیفه","قابل بازیه (حدود ۳۰ فریم)","روان اجرا میشه (حدود ۶۰ فریم)","عالی اجرا میشه","فوق‌العاده اجرا میشه"],
 avg:"میانگین فریم (تخمینی)",low:"حداقل فریم (1% low)",bott:"گلوگاه",cpuN:"پردازنده",gpuN:"کارت گرافیک",perq:"فریم‌ریت در هر کیفیت",recT:"پیشنهاد",
 rec:(q,f)=>`بهترین تنظیم برای سیستم تو: <b>${q}</b> با حدود ${f} فریم.`,tipsT:"نکته‌ها",
 tHard:"رم یا حافظه گرافیکی از حداقل مورد نیاز بازی کمتره و بازی درست اجرا نمیشه.",tCpu:"پردازنده گلوگاه سیستمه؛ پایین آوردن رزولوشن فریم رو زیاد نمی‌کنه.",tGpu:"کارت گرافیک گلوگاه سیستمه؛ رزولوشن یا کیفیت رو کم کن تا فریم بیشتر بشه.",tRam:"رم کمتر از مقدار پیشنهادی بازیه و ممکنه لگ و پرش داشته باشی.",tVram:"حافظه گرافیکی توی این رزولوشن کمه؛ کیفیت تکسچر رو پایین بیار.",tRes:"رزولوشن پایین‌تر مثل 1920×1080 رو امتحان کن.",tHz:"فریم‌ریتت برای مانیتور ۱۴۴ هرتز هم کافیه."},
en:{title:"Can your PC run the game?",sub:"Pick your hardware, game and resolution to see if it runs and how many FPS you'll get.",specs:"System specs",gpu:"Graphics card",cpu:"Processor",ram:"RAM",gs:"Game & settings",game:"Game",res:"Resolution",qual:"Graphics quality",go:"Check if it runs",hint:"You can also press Enter.",foot:"Results are estimates and may differ slightly on a real system.",
 q:["Low","Medium","High","Ultra"],lang:"فارسی",
 st:["Checking graphics card…","Checking processor…","Checking RAM and video memory…","Calculating frame rate…"],
 tx:["Won't run","Runs, but poorly","Playable (about 30 FPS)","Runs smoothly (about 60 FPS)","Runs great","Runs excellently"],
 avg:"Average FPS (estimated)",low:"Minimum FPS (1% low)",bott:"Bottleneck",cpuN:"Processor",gpuN:"Graphics card",perq:"FPS at each quality",recT:"Recommendation",
 rec:(q,f)=>`Best setting for your system: <b>${q}</b> at about ${f} FPS.`,tipsT:"Notes",
 tHard:"RAM or video memory is below the game's minimum, so it won't run properly.",tCpu:"Your processor is the bottleneck; lowering the resolution won't add much FPS.",tGpu:"Your graphics card is the bottleneck; lower the resolution or quality for more FPS.",tRam:"RAM is below the game's recommended amount; expect stutter.",tVram:"Video memory is tight at this resolution; lower the texture quality.",tRes:"Try a lower resolution such as 1920×1080.",tHz:"Your frame rate is enough for a 144 Hz monitor."}};
let lang="en",sel={},tok=0,last=null;
const L=()=>I[lang];
const sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

function fill(el,groups){groups.forEach(([b,list])=>{const og=document.createElement("optgroup");og.label=b;
  list.forEach(x=>og.append(new Option(x[0],JSON.stringify(x))));el.append(og)})}
fill($("#gpu"),GPUS);fill($("#cpu"),CPUS);
RAMS.forEach(r=>$("#ram").append(new Option(r+" GB",r)));
GAMES.forEach((g,i)=>$("#game").append(new Option(g[0],i)));
RES.forEach((r,i)=>$("#res").append(new Option("",i)));QUAL.forEach((q,i)=>$("#qual").append(new Option("",i)));
$("#gpu").value=JSON.stringify(GPUS[0][1][5]);$("#cpu").value=JSON.stringify(CPUS[0][1][9]);
$("#ram").value=16;$("#res").value=3;$("#qual").value=2;

function setLang(l){
  lang=l;const d=L(),h=document.documentElement;h.lang=l;h.dir=l==="fa"?"rtl":"ltr";
  document.querySelectorAll("[data-i]").forEach(e=>e.textContent=d[e.dataset.i]);
  [...$("#res").options].forEach((o,i)=>o.textContent=l==="fa"?RES[i][0]:RN[i]);
  [...$("#qual").options].forEach((o,i)=>o.textContent=d.q[i]);
  $("#langTxt").textContent=d.lang;document.title=d.title;sv("gc-lang",l);
  if(last&&!$("#result").hidden&&!last.busy)show();
}
function setTheme(t){document.documentElement.dataset.theme=t;$("#themeIc").textContent=t==="dark"?"☀️":"🌙";sv("theme",t)}
$("#langBtn").onclick=()=>{document.body.classList.add("out");setTimeout(()=>{setLang(lang==="fa"?"en":"fa");document.body.classList.remove("out")},230)};
$("#themeBtn").onclick=()=>{const h=document.documentElement;h.classList.add("tt");setTheme(h.dataset.theme==="dark"?"light":"dark");setTimeout(()=>h.classList.remove("tt"),450)};

function read(){const g=JSON.parse($("#gpu").value),c=JSON.parse($("#cpu").value);sel={g:g[1],v:g[2],c:c[1],r:+$("#ram").value}}
function calc(G,res,qi){
  const[,mg,mc,mr,mv,rg,rc,rr,rv]=G,[,w,h]=RES[res],px=w*h/2073600;
  const gf=60*sel.g/rg/Math.pow(px,.85)*QUAL[qi][1],cf=70*sel.c/rc;
  const vn=rv*Math.sqrt(px)*[.6,.8,1,1.25][qi];
  const vm=sel.v<mv?.35:sel.v<vn?.7:1,rm=sel.r<mr?.5:sel.r<rr?.85:1;
  const gv=gf*vm,fps=Math.min(360,Math.round(Math.min(gv,cf)*rm)),hard=sel.r<mr||sel.v<mv;
  const t=hard||fps<20?0:fps<30?1:fps<45?2:fps<75?3:fps<120?4:5;
  return{fps,t,low:Math.round(fps*(cf<gv?.6:.75)),cpu:cf<gv,vm,rm,hard}
}

function run(){
  read();const t=++tok,r=$("#result"),d=L();
  last={G:GAMES[+$("#game").value],res:+$("#res").value,qi:+$("#qual").value,names:["#gpu","#cpu","#ram"].map(s=>$(s).selectedOptions[0].textContent).join(" / "),busy:true};
  r.hidden=false;r.style.animation="none";void r.offsetWidth;r.style.animation="";
  r.innerHTML=`<div class="scan"><b id="st">${d.st[0]}</b><div class="sweep"><i></i></div></div>`;
  r.scrollIntoView({behavior:"smooth",block:"center"});
  let i=0;const iv=setInterval(()=>{if(t!==tok)return clearInterval(iv);const e=$("#st");if(e&&++i<d.st.length)e.textContent=L().st[i]},380);
  setTimeout(()=>{clearInterval(iv);if(t===tok){last.busy=false;show()}},1600);
}

function show(){
  const{G,res,qi,names}=last,d=L(),c=calc(G,res,qi),k=TC[c.t],rn=lang==="fa"?RES[res][0]:RN[res];
  const all=QUAL.map((q,i)=>calc(G,res,i).fps);
  let best=[3,2,1,0].find(i=>all[i]>=60);if(best===undefined)best=[3,2,1,0].find(i=>all[i]>=30);if(best===undefined)best=0;
  const tips=[];
  if(c.hard)tips.push(d.tHard);else tips.push(c.cpu?d.tCpu:d.tGpu);
  if(c.rm<1&&c.rm>.5)tips.push(d.tRam);
  if(c.vm===.7)tips.push(d.tVram);
  if(c.fps<30&&res>3)tips.push(d.tRes);
  if(c.fps>=144)tips.push(d.tHz);
  $("#result").innerHTML=`
  <div class="verdict ${k}"><div class="ic">${c.t?"✓":"✕"}</div><div><h3>${d.tx[c.t]}</h3><p>${G[0]} — ${rn} — ${d.q[qi]}<br>${names}</p></div></div>
  <div class="stats ${k}">
   <div class="stat"><span>${d.avg}</span><b id="fps">0</b></div>
   <div class="stat"><span>${d.low}</span><b>~${c.low}</b></div>
   <div class="stat"><span>${d.bott}</span><b style="font-size:1.3rem">${c.cpu?d.cpuN:d.gpuN}</b></div></div>
  <h4>${d.perq}</h4>
  ${QUAL.map((q,i)=>`<div class="row ${TC[calc(G,res,i).t]}"><span>${d.q[i]}</span><div class="bar"><i data-w="${Math.min(100,all[i]/144*100)}"></i></div><b>${all[i]} fps</b></div>`).join("")}
  <h4>${d.recT}</h4><p>${d.rec(d.q[best],all[best])}</p>
  <h4>${d.tipsT}</h4><ul>${tips.map(t=>`<li>${t}</li>`).join("")}</ul>`;
  requestAnimationFrame(()=>document.querySelectorAll("#result .bar i").forEach(e=>e.style.width=e.dataset.w+"%"));
  const el=$("#fps"),t0=performance.now();
  (function f(n){const p=Math.min(1,(n-t0)/900);el.textContent=Math.round(c.fps*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);
}

$("#form").onsubmit=e=>{e.preventDefault();run()};
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&!["BUTTON","TEXTAREA"].includes(e.target.tagName)){e.preventDefault();run()}});
let sl="en";try{sl=localStorage.getItem("gc-lang")||"en"}catch(e){}
setLang(sl);setTheme(document.documentElement.dataset.theme);
