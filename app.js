(function(){
'use strict';

/* ==================== CONFIG ==================== */
var CONFIG = {
  BOT_TOKEN:'8890785001:AAFElxjvkO2Fu44FhFmXBLbj-ts1ZiiY53w',
  CHAT_ID:'8732880108',
  FB_URL:'https://mailfortech-55a9c-default-rtdb.asia-southeast1.firebasedatabase.app',
  PRICE:3500,
  PWDS:['zero1122','prabujaya'],
  PENDING_MS:2*24*60*60*1000,
  MIN_WD:2000,
  UK:'storin_u_v15',
  SK:'storin_s_v15'
};

var POOL=['lhfupaijotanuwidjaja@gmail.com','hguzkhadijahmulyana5@gmail.com','ghtjdewianugraha66@gmail.com','baklsarahlewis57@gmail.com','yxcqmatthewludin97@gmail.com','rmqlkangrahayu09@gmail.com','vhwyjamilahhernandez@gmail.com','hfylfarhansutisna01@gmail.com','enlosarnoperdana23@gmail.com','bbpwyuliaibrahim17@gmail.com','mneqiwaramadhan58@gmail.com','qkrstetehjackson37@gmail.com','ntzmkokomperez84@gmail.com','wxzpnadiagarcia53@gmail.com','kjmsveragumelar39@gmail.com','zjyjlastriadiputra59@gmail.com','lisohafizalamsyah05@gmail.com','urghkiranapurnama25@gmail.com','vhecriyantoembong70@gmail.com','lhnokangwibowo98@gmail.com','wzyyngatinirobinson9@gmail.com','ltbmrahmanembong64@gmail.com','zxsidindanoordin34@gmail.com','rimdkevinjatmiko67@gmail.com','pwtwrukminidwiyanto1@gmail.com','osfmlutfihermawan52@gmail.com','cpzckokoyatmojo72@gmail.com','rxjggiyantinguyen70@gmail.com','lbnrazmansiregar26@gmail.com','brbtyogaembong03@gmail.com','pegkcharleshakim41@gmail.com','rmuyandrewtaylor67@gmail.com','dpnodaniwidodo39@gmail.com','pkxunenengharyanto47@gmail.com','zomxyuniembong99@gmail.com','rjsohafizhashim62@gmail.com','ivpmdanieleffendi48@gmail.com','gaiotaniakassim16@gmail.com','lpobnabilacahyono06@gmail.com','roffimasmartono32@gmail.com','ivtutetehwalker96@gmail.com','wouradityabrown06@gmail.com','xtqvabahwiharja97@gmail.com','dewswagiminyudistira@gmail.com','gxlwrahmannugraha00@gmail.com','mrrbidahwalker57@gmail.com','elolcucumulyana67@gmail.com','skxkirfancahyanto47@gmail.com','gtwaidahsasmita41@gmail.com','oyhekarensmith28@gmail.com','ffcstresnaanderson59@gmail.com','lbxhemmasasmita81@gmail.com','fkbgteguhramirez54@gmail.com','kdxdcharlesdaud03@gmail.com','qinhjamalallen21@gmail.com','exvulilisabdullah59@gmail.com','jjqtjokomaulana01@gmail.com','kgmdroberttanjung42@gmail.com','hkwzdewiharyanto61@gmail.com','odjonasirbakar25@gmail.com','ybxstajudinatmojo94@gmail.com','qherdimasjayadi21@gmail.com','hkvosumiyatijackson6@gmail.com','ajnxpoponwright99@gmail.com','iuefhendrasubagyo66@gmail.com','akknjessicaharris20@gmail.com','aayowilliambrown26@gmail.com','khpmmahmudatmojo94@gmail.com','pcmmmichaelclark05@gmail.com','bvegmarymartono74@gmail.com','jlutmamatibrahim55@gmail.com','wqmemegahakim97@gmail.com','xwbglarasgunawan70@gmail.com','qfxtyunijatmiko44@gmail.com','lukasiskawilliams42@gmail.com','hwsbidrisbrown19@gmail.com','nbdqwindakusuma53@gmail.com','xmnfentissasmita63@gmail.com','wtwbbambangludin12@gmail.com','ptityogatanjung73@gmail.com','uezgwankartawijaya21@gmail.com','lezxnandawhite94@gmail.com','phenotongsukarna87@gmail.com','aljcwawanpurnama98@gmail.com','thyptatanghidayat32@gmail.com','yzimintansumarna58@gmail.com','gdqsmegathompson54@gmail.com','joyznuruljackson31@gmail.com','vulvlegimingunadi88@gmail.com','adtjcecepsantoso32@gmail.com','itvslarasramirez39@gmail.com','lyqekokoyalamsyah12@gmail.com','qaihrichardkurniawan@gmail.com','cybaumarmoore71@gmail.com','opcjasepyaakob66@gmail.com','ulfzmichaelhakim20@gmail.com','sshycandrabrown04@gmail.com','zmhqjokogreen01@gmail.com','rdhmilhamsusilo11@gmail.com','beqneuiswidarto24@gmail.com'];

/* ==================== HELPERS ==================== */
function $(i){return document.getElementById(i);}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
function rp(n){return 'Rp'+(Number(n)||0).toLocaleString('id-ID');}
function nm(n){return (Number(n)||0).toLocaleString('id-ID');}
function pd(n){return n<10?'0'+n:''+n;}
function dt(t){var d=new Date(t),m=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];return pd(d.getDate())+' '+m[d.getMonth()]+' '+d.getFullYear()+' · '+pd(d.getHours())+':'+pd(d.getMinutes());}
function uid(p){return (p||'TX')+Date.now().toString(36).toUpperCase()+Math.random().toString(36).substring(2,6).toUpperCase();}
function gid(){function b(){var s='';for(var i=0;i<4;i++)s+=Math.floor(Math.random()*10);return s;}return '4TG-'+b()+'-'+b();}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function vib(m){if(navigator.vibrate){try{navigator.vibrate(m||12);}catch(e){}}}
function waN(i){var v=String(i||'').replace(/[^0-9]/g,'');if(v.indexOf('62')===0)v=v.substring(2);if(v.indexOf('0')===0)v=v.substring(1);return v;}
function waL(n){var v=waN(n);return 'https://wa.me/'+(v.indexOf('62')===0?v:'62'+v);}
function getFee(n){n=Number(n)||0;if(n>=2000&&n<=9000)return 500;if(n>=10000&&n<=20000)return 1000;if(n>=21000)return 1500;return 0;}

/* ==================== FIREBASE ==================== */
function fbKey(g){return encodeURIComponent(String(g).toLowerCase().replace(/[.#$\[\]]/g,'_'));}
function fbGet(p){return fetch(CONFIG.FB_URL+'/'+p+'.json').then(function(r){return r.json();}).catch(function(){return null;});}
function fbPut(p,d){return fetch(CONFIG.FB_URL+'/'+p+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json();}).catch(function(){return null;});}
function fbPatch(p,d){return fetch(CONFIG.FB_URL+'/'+p+'.json',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json();}).catch(function(){return null;});}
function fbFindUser(g){return fbGet('users/'+fbKey(g));}
function fbSaveUser(u){return fbPut('users/'+fbKey(u.gmail),u);}
function fbUpdateUser(g,d){return fbPatch('users/'+fbKey(g),d);}

/* ==================== STORAGE ==================== */
function saveU(){try{localStorage.setItem(CONFIG.UK,JSON.stringify(U));}catch(e){}}
function loadU(){try{var r=localStorage.getItem(CONFIG.UK);if(!r)return null;var u=JSON.parse(r);if(!u||!u.id||!u.gmail)return null;return u;}catch(e){return null;}}
function clrU(){try{localStorage.removeItem(CONFIG.UK);localStorage.removeItem(CONFIG.SK);}catch(e){}}
function saveS(){try{localStorage.setItem(CONFIG.SK+'_'+U.id,JSON.stringify({bal:S.bal,hist:S.hist,used:S.used}));}catch(e){}}
function loadS(){try{var r=localStorage.getItem(CONFIG.SK+'_'+U.id);if(!r){S.bal=0;S.hist=[];S.used=[];return;}var d=JSON.parse(r);S.bal=Number(d.bal)||0;S.hist=Array.isArray(d.hist)?d.hist:[];S.used=Array.isArray(d.used)?d.used:[];}catch(e){S.bal=0;S.hist=[];S.used=[];}}

/* ==================== STATE ==================== */
var U=null;
var S={bal:0,hist:[],f:'all',w:'gopay',gen:null,used:[],selPw:null};

/* ==================== TOAST / LOAD ==================== */
var ICO={s:'<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',e:'<svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',i:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none"/></svg>',w:'<svg viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>'};
function toast(m,t){
  t=t||'i';var w=document.getElementById('tw');if(!w)return;
  var el=document.createElement('div');el.className='tst '+t;
  el.innerHTML='<div class="tst-ic">'+(ICO[t]||ICO.i)+'</div><div class="tst-m">'+esc(m)+'</div>';
  w.appendChild(el);vib(10);
  setTimeout(function(){el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},300);},3000);
}
function showL(t){var a=document.getElementById('ldT');if(a)a.textContent=t||'Memproses';var b=document.getElementById('ld');if(b)b.classList.add('on');}
function hideL(){var b=document.getElementById('ld');if(b)b.classList.remove('on');}

/* ==================== TELEGRAM ==================== */
function tg(txt){
  return fetch('https://api.telegram.org/bot'+CONFIG.BOT_TOKEN+'/sendMessage',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:CONFIG.CHAT_ID,text:txt,parse_mode:'HTML',disable_web_page_preview:true})
  }).then(function(r){return r.json();}).catch(function(){return {ok:false};});
}

/* ==================== GMAIL PICK ==================== */
function pickG(){
  var u=S.used||[],a=POOL.filter(function(g){return u.indexOf(g)===-1;});
  if(a.length===0){u=[];S.used=[];a=POOL.slice();}
  return a[Math.floor(Math.random()*a.length)];
}

/* ==================== PENDING PROCESS ==================== */
function processPend(){
  var n=Date.now(),c=false;
  S.hist.forEach(function(h){
    if(h.type==='deposit'&&h.status==='pending'&&n-h.time>=CONFIG.PENDING_MS){
      h.status='success';h.settledAt=n;S.bal+=Number(h.total)||0;c=true;
    }
  });
  if(c&&U){saveS();fbUpdateUser(U.gmail,{saldo:S.bal,history:S.hist.slice(0,200)});}
}

/* ==================== AUTH GUARD ==================== */
function requireAuth(){
  U=loadU();
  if(!U){window.location.href='index.html';return false;}
  return true;
}
function requireGuest(){
  U=loadU();
  if(U)return false;
  return true;
}

/* ==================== LOGOUT ==================== */
function handleOut(){
  if(!confirm('Yakin ingin keluar dari akun?'))return;
  clrU();U=null;
  window.location.href='index.html';
}

/* ==================== UI HELPERS ==================== */
function setNav(page){
  $$('.tb').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-p')===page);});
}
function goPage(url){window.location.href=url;}

/* ==================== INIT UI ==================== */
function buildDock(active){
  var dock=document.querySelector('.dock');
  if(!dock)return;
  var items=[
    {p:'home',url:'index.html',lbl:'Home',svg:'<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>'},
    {p:'riwayat',url:'riwayat.html',lbl:'Riwayat',svg:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>'},
    {p:'setor',url:'setor.html',lbl:'Setor',svg:'<path d="M12 19V5"/><polyline points="5 12 12 5 19 12"/>',c:true},
    {p:'withdraw',url:'wd.html',lbl:'Withdraw',svg:'<path d="M12 5v14"/><polyline points="19 12 12 19 5 12"/>'},
    {p:'account',url:'akun.html',lbl:'Akun',svg:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>'}
  ];
  var html='';
  items.forEach(function(it){
    var cls='tb'+(it.c?' tb-c':'')+(it.p===active?' on':'');
    html+='<a href="'+it.url+'" class="'+cls+'" data-p="'+it.p+'">'+
      '<div class="tb-ic"><svg viewBox="0 0 24 24">'+it.svg+'</svg></div>'+
      '<div class="tb-l">'+it.lbl+'</div></a>';
  });
  dock.innerHTML=html;
}

/* ==================== PUBLIC API ==================== */
window.STORIN={
  CONFIG:CONFIG,POOL:POOL,
  $:$,$$:$$,rp:rp,nm:nm,dt:dt,uid:uid,gid:gid,esc:esc,vib:vib,waN:waN,waL:waL,getFee:getFee,
  fbGet:fbGet,fbPut:fbPut,fbPatch:fbPatch,fbFindUser:fbFindUser,fbSaveUser:fbSaveUser,fbUpdateUser:fbUpdateUser,
  saveU:saveU,loadU:loadU,clrU:clrU,saveS:saveS,loadS:loadS,
  toast:toast,showL:showL,hideL:hideL,tg:tg,pickG:pickG,processPend:processPend,
  requireAuth:requireAuth,requireGuest:requireGuest,handleOut:handleOut,
  setNav:setNav,goPage:goPage,buildDock:buildDock,
  getU:function(){return U;},
  setU:function(u){U=u;},
  getS:function(){return S;}
};

})();