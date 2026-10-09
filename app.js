(function(){
'use strict';

var CONFIG = {
  BOT_TOKEN:'8890785001:AAFElxjvkO2Fu44FhFmXBLbj-ts1ZiiY53w',
  CHAT_ID:'8732880108',
  FB_URL:'https://mailfortech-55a9c-default-rtdb.asia-southeast1.firebasedatabase.app',
  PRICE:4000,
  PWDS:['zero1122','prabujaya'],
  MIN_WD:2000,
  RESERVE_MS:30*60*1000,
  POOL_FILE:'gmail-pool.txt',
  UK:'storin_u_v16',
  SK:'storin_s_v16'
};

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

function fbKey(g){return encodeURIComponent(String(g).toLowerCase().replace(/[.#$\[\]@]/g,'_'));}
function fbGet(p){return fetch(CONFIG.FB_URL+'/'+p+'.json').then(function(r){return r.json();}).catch(function(){return null;});}
function fbPut(p,d){return fetch(CONFIG.FB_URL+'/'+p+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json();}).catch(function(){return null;});}
function fbPatch(p,d){return fetch(CONFIG.FB_URL+'/'+p+'.json',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json();}).catch(function(){return null;});}
function fbDelete(p){return fetch(CONFIG.FB_URL+'/'+p+'.json',{method:'DELETE'}).then(function(r){return r.json();}).catch(function(){return null;});}
function fbFindUser(g){return fbGet('users/'+fbKey(g));}
function fbSaveUser(u){return fbPut('users/'+fbKey(u.gmail),u);}
function fbUpdateUser(g,d){return fbPatch('users/'+fbKey(g),d);}

var _poolCache=null;
function loadPool(){
  if(_poolCache) return Promise.resolve(_poolCache);
  return fetch(CONFIG.POOL_FILE+'?t='+Date.now())
    .then(function(r){return r.text();})
    .then(function(txt){
      var list=txt.split(/\r?\n/).map(function(l){return l.trim();})
        .filter(function(l){return l && l.indexOf('@')>-1;});
      _poolCache=list;return list;
    }).catch(function(){return [];});
}
function getUsedList(){return fbGet('gmail_used').then(function(d){return d||{};});}
function getReservedList(){return fbGet('gmail_reserved').then(function(d){return d||{};});}
function reserveGmail(gmail,userId,userGmail){return fbPut('gmail_reserved/'+fbKey(gmail),{gmail:gmail,userId:userId,userGmail:userGmail,time:Date.now()});}
function releaseGmail(gmail){return fbDelete('gmail_reserved/'+fbKey(gmail));}
function markGmailUsed(gmail,userId){return fbPut('gmail_used/'+fbKey(gmail),{gmail:gmail,userId:userId,approvedAt:Date.now()});}
function pickAvailableGmail(){
  return loadPool().then(function(pool){
    if(!pool.length) return null;
    return Promise.all([getUsedList(),getReservedList()]).then(function(r){
      var used=r[0],reserved=r[1],now=Date.now(),reservedActive={};
      Object.keys(reserved).forEach(function(k){
        var it=reserved[k];
        if(it&&it.time&&(now-it.time)<CONFIG.RESERVE_MS) reservedActive[k]=true;
      });
      var avail=pool.filter(function(g){var k=fbKey(g);return !used[k] && !reservedActive[k];});
      if(!avail.length) return null;
      return avail[Math.floor(Math.random()*avail.length)];
    });
  });
}
function addPending(tx){return fbPut('pending/'+tx.id,tx);}
function getPending(){return fbGet('pending').then(function(d){return d||{};});}
function approvePending(txId){
  return fbGet('pending/'+txId).then(function(tx){
    if(!tx) throw new Error('Tx tidak ditemukan');
    var gKey=fbKey(tx.gmail),uKey=fbKey(tx.userGmail);
    return markGmailUsed(tx.gmail,tx.userId).then(function(){
      return fbDelete('gmail_reserved/'+gKey);
    }).then(function(){
      return fbDelete('pending/'+txId);
    }).then(function(){
      return fbGet('users/'+uKey).then(function(u){
        if(!u) return;
        var hist=Array.isArray(u.history)?u.history:[];
        hist=hist.map(function(h){if(h.id===txId){h.status='success';h.settledAt=Date.now();}return h;});
        return fbPatch('users/'+uKey,{saldo:(Number(u.saldo)||0)+CONFIG.PRICE,history:hist});
      });
    });
  });
}
function rejectPending(txId){
  return fbGet('pending/'+txId).then(function(tx){
    if(!tx) throw new Error('Tx tidak ditemukan');
    var gKey=fbKey(tx.gmail),uKey=fbKey(tx.userGmail);
    return fbDelete('gmail_reserved/'+gKey).then(function(){
      return fbDelete('pending/'+txId);
    }).then(function(){
      return fbGet('users/'+uKey).then(function(u){
        if(!u) return;
        var hist=Array.isArray(u.history)?u.history:[];
        hist=hist.map(function(h){if(h.id===txId){h.status='fail';h.settledAt=Date.now();}return h;});
        return fbPatch('users/'+uKey,{history:hist});
      });
    });
  });
}

function saveU(){try{localStorage.setItem(CONFIG.UK,JSON.stringify(U));}catch(e){}}
function loadU(){try{var r=localStorage.getItem(CONFIG.UK);if(!r)return null;var u=JSON.parse(r);if(!u||!u.id||!u.gmail)return null;return u;}catch(e){return null;}}
function clrU(){try{localStorage.removeItem(CONFIG.UK);localStorage.removeItem(CONFIG.SK);}catch(e){}}
function saveS(){try{localStorage.setItem(CONFIG.SK+'_'+U.id,JSON.stringify({bal:S.bal,hist:S.hist,used:S.used}));}catch(e){}}
function loadS(){try{var r=localStorage.getItem(CONFIG.SK+'_'+U.id);if(!r){S.bal=0;S.hist=[];S.used=[];return;}var d=JSON.parse(r);S.bal=Number(d.bal)||0;S.hist=Array.isArray(d.hist)?d.hist:[];S.used=Array.isArray(d.used)?d.used:[];}catch(e){S.bal=0;S.hist=[];S.used=[];}}

var U=null;
var S={bal:0,hist:[],f:'all',w:'gopay',gen:null,reserved:null,selPw:null,used:[]};

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
function tg(txt){
  return fetch('https://api.telegram.org/bot'+CONFIG.BOT_TOKEN+'/sendMessage',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:CONFIG.CHAT_ID,text:txt,parse_mode:'HTML',disable_web_page_preview:true})
  }).then(function(r){return r.json();}).catch(function(){return {ok:false};});
}
function requireAuth(){U=loadU();if(!U){window.location.href='index.html';return false;}return true;}
function requireGuest(){U=loadU();return !U;}
function handleOut(){if(!confirm('Yakin ingin keluar dari akun?'))return;clrU();U=null;window.location.href='index.html';}

function buildDock(active){
  var dock=document.querySelector('.dock');if(!dock)return;
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
    html+='<a href="'+it.url+'" class="'+cls+'"><div class="tb-ic"><svg viewBox="0 0 24 24">'+it.svg+'</svg></div><div class="tb-l">'+it.lbl+'</div></a>';
  });
  dock.innerHTML=html;
}

window.STORIN={
  CONFIG:CONFIG,
  $:$,$$:$$,rp:rp,nm:nm,dt:dt,uid:uid,gid:gid,esc:esc,vib:vib,waN:waN,waL:waL,getFee:getFee,
  fbKey:fbKey,fbGet:fbGet,fbPut:fbPut,fbPatch:fbPatch,fbDelete:fbDelete,
  fbFindUser:fbFindUser,fbSaveUser:fbSaveUser,fbUpdateUser:fbUpdateUser,
  loadPool:loadPool,getUsedList:getUsedList,getReservedList:getReservedList,
  reserveGmail:reserveGmail,releaseGmail:releaseGmail,markGmailUsed:markGmailUsed,
  pickAvailableGmail:pickAvailableGmail,
  addPending:addPending,getPending:getPending,approvePending:approvePending,rejectPending:rejectPending,
  saveU:saveU,loadU:loadU,clrU:clrU,saveS:saveS,loadS:loadS,
  toast:toast,showL:showL,hideL:hideL,tg:tg,
  requireAuth:requireAuth,requireGuest:requireGuest,handleOut:handleOut,
  buildDock:buildDock,
  getU:function(){return U;},setU:function(u){U=u;},getS:function(){return S;}
};
})();