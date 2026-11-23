/* 共用登入關卡（純前端；帳號由管理端統一設定，使用者無法自行註冊或改密碼）
 * 同步載入於每頁 <head> 前段：未登入 → 隱藏整頁內容並顯示登入框；登入狀態存 localStorage 30 天。
 * 不存明碼：每個帳號只存 salt 與 SHA-256(帳號|密碼|salt) 再迭代 20000 次的雜湊。
 * 帳號清單由 /workspace/site-auth/manage_users.py 自動產生，請勿手改 USERS 這一行。 */
(function(){
'use strict';
var USERS=/*USERS_BEGIN*/{"A":{"s":"e5483ccc2e42dd498fc42cf0","h":"621fd7e0665f9acd8c68d37a6d2fe4b6391812a1a6f36745c60bd77cfd0d1d29"},"B":{"s":"7a05c54c3d201da5ebcdf1dd","h":"cf6ba20b577558f120e4bd578b8486a6a616599af54d5d65a25bf678530cfa0b"},"C":{"s":"523a21c859abf2be1df7d6fc","h":"f04450daf40c7a664bf451550f464936b994b882b9ca81fec8e3c757379214d1"},"D":{"s":"d5c7ce1203ded2029abe98ef","h":"ebbca270f031755272211dc8f5f552bfd8053d29f0dba5eb1a4ed5fb2be20d10"}}/*USERS_END*/;
var ITER=20000,DAYS=30,KEY='gb_auth_v2';
var d=document,cs=d.currentScript;
/* ---- SHA-256（同步、無相依） ---- */
var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
function utf8(s){return unescape(encodeURIComponent(s))}
function sha256(str){
  var m=utf8(str),l=m.length,w=new Array(64),H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],i,j,b=[];
  for(i=0;i<l;i++)b[i>>2]|=m.charCodeAt(i)<<(24-(i%4)*8);
  b[l>>2]|=0x80<<(24-(l%4)*8);b[(((l+8)>>6)<<4)+15]=l*8;
  for(i=0;i<b.length;i+=16){
    var a=H.slice(0);
    for(j=0;j<64;j++){
      if(j<16)w[j]=b[i+j]|0;else{var x=w[j-15],y=w[j-2];
        w[j]=(((x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3))+w[j-7]+((y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10))+w[j-16])|0}
      var e=a[4],t1=(a[7]+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+((e&a[5])^(~e&a[6]))+K[j]+w[j])|0,
          f=a[0],t2=(((f>>>2|f<<30)^(f>>>13|f<<19)^(f>>>22|f<<10))+((f&a[1])^(f&a[2])^(a[1]&a[2])))|0;
      a=[(t1+t2)|0,a[0],a[1],a[2],(a[3]+t1)|0,a[4],a[5],a[6]];
    }
    for(j=0;j<8;j++)H[j]=(H[j]+a[j])|0;
  }
  var o='';for(i=0;i<8;i++)o+=('00000000'+(H[i]>>>0).toString(16)).slice(-8);return o;
}
function norm(u){return String(u==null?'':u).trim().toUpperCase()}
function derive(u,pw,salt){var h=sha256(u+'|'+pw+'|'+salt);for(var i=0;i<ITER;i++)h=sha256(h+salt);return h}
function tok(h){return sha256('sess|'+h)}
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function authed(){var o=read(),r=o&&USERS.hasOwnProperty(o.u)&&USERS[o.u];return !!(r&&o.t===tok(r.h)&&o.exp>Date.now())}
function login(user,pw){var n=norm(user),r=USERS.hasOwnProperty(n)&&USERS[n];if(!r||!pw||derive(n,pw,r.s)!==r.h)return false;
  try{localStorage.setItem(KEY,JSON.stringify({u:n,t:tok(r.h),exp:Date.now()+DAYS*864e5}))}catch(e){return false}return true}
function current(){var o=read();return authed()&&o.u!=='~'?o.u:''}
/* 舊的單一共用帳號（本站原內建登入，格式 SHA-256(帳號:密碼)）：保留可用，之後不需要時由管理端移除 */
var LP=/*LP_BEGIN*/[]/*LP_END*/;
function lpTok(h){return sha256('lp|'+h)}
var userAuthed=authed;authed=function(){if(userAuthed())return true;var o=read();if(!(o&&o.u==='~'&&o.exp>Date.now()))return false;for(var i=0;i<LP.length;i++)if(o.t===lpTok(LP[i]))return true;return false};
var userLogin=login;login=function(user,pw){if(userLogin(user,pw))return true;if(!LP.length||!pw)return false;var h=sha256(String(user).trim()+':'+pw);if(LP.indexOf(h)<0)return false;
  try{localStorage.setItem(KEY,JSON.stringify({u:'~',t:lpTok(h),exp:Date.now()+DAYS*864e5}))}catch(e){return false}return true};
var shareOk=cs&&cs.hasAttribute('data-share-ok')&&(/^#q=/.test(location.hash)||/[?&]src=/.test(location.search));
function logout(){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}
window.SiteAuth={login:login,logout:logout,isAuthed:authed,user:current};
if(shareOk)return; /* 客戶分享連結（報價資料在網址內）不擋 */

var CSS='html.ga-lock body>*:not(#ga-gate){display:none!important}html.ga-lock body{overflow:hidden!important;background:#eef4f9!important}'+
'#ga-gate{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:20px 16px;background:linear-gradient(160deg,#e8f2fa,#f6f9fc 55%,#eaf5ef);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#1d2b3a;overflow:auto}'+
'#ga-gate *{box-sizing:border-box}'+
'#ga-gate .ga-card{width:100%;max-width:380px;background:#fff;border-radius:20px;box-shadow:0 10px 34px rgba(20,60,100,.14);padding:28px 24px 22px}'+
'#ga-gate .ga-ic{width:52px;height:52px;margin:0 auto 10px;border-radius:50%;background:#e7f1fb;display:flex;align-items:center;justify-content:center}'+
'#ga-gate h1{margin:0 0 4px;font-size:21px;text-align:center;font-weight:700;color:#173a5e}'+
'#ga-gate .ga-hint{margin:0 0 18px;text-align:center;font-size:14px;color:#6a7b8c}'+
'#ga-gate label{display:block;margin-bottom:12px}#ga-gate .ga-lb{display:block;font-size:13px;font-weight:700;color:#173a5e;margin-bottom:4px}'+
'#ga-gate .ga-in{display:flex;align-items:center;border:1px solid #c9d7e4;border-radius:12px;background:#f8fbfd;padding:0 12px}'+
'#ga-gate .ga-in:focus-within{border-color:#1a73b0;box-shadow:0 0 0 3px rgba(26,115,176,.15);background:#fff}'+
'#ga-gate input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:16px;color:#1d2b3a;padding:12px 0;margin:0}'+
'#ga-gate .ga-eye{border:0;background:none;color:#1a73b0;font:inherit;font-size:13px;font-weight:700;padding:6px 0 6px 8px;cursor:pointer}'+
'#ga-gate .ga-err{min-height:22px;margin:0 0 8px;text-align:center;font-size:14px;font-weight:700;color:#c8372d}'+
'#ga-gate .ga-btn{width:100%;border:0;border-radius:12px;padding:13px 0;background:#1a73b0;color:#fff;font:inherit;font-size:17px;font-weight:700;letter-spacing:4px;cursor:pointer}'+
'#ga-gate .ga-btn:disabled{opacity:.55}'+
'#ga-gate .ga-foot{margin:14px 0 0;text-align:center;font-size:12.5px;color:#8293a3}'+
'.ga-logout{position:fixed;left:10px;bottom:10px;z-index:2147483000;border:1px solid #c9d7e4;border-radius:999px;background:rgba(255,255,255,.92);color:#1a73b0;font:700 13px/1.5 -apple-system,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;padding:4px 14px;cursor:pointer;box-shadow:0 2px 8px rgba(20,60,100,.15)}'+
'@media print{.ga-logout,#ga-gate{display:none!important}}';
var st=d.createElement('style');st.id='ga-style';st.textContent=CSS;(d.head||d.documentElement).appendChild(st);

function lock(){d.documentElement.classList.add('ga-lock');onBody(showGate)}
function onBody(fn){if(d.body)fn();else d.addEventListener('DOMContentLoaded',fn)}
function showGate(){
  if(d.getElementById('ga-gate'))return;
  var g=d.createElement('div');g.id='ga-gate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');
  g.innerHTML='<form class="ga-card" novalidate autocomplete="on">'+
   '<div class="ga-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a73b0" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div>'+
   '<h1>請先登入</h1><p class="ga-hint">本頁限授權使用者使用</p>'+
   '<label><span class="ga-lb">帳號</span><span class="ga-in"><input id="ga-u" name="username" type="text" autocomplete="username" autocapitalize="characters" spellcheck="false" placeholder="請輸入帳號"></span></label>'+
   '<label><span class="ga-lb">密碼</span><span class="ga-in"><input id="ga-p" name="password" type="password" autocomplete="current-password" spellcheck="false" placeholder="請輸入密碼"><button type="button" class="ga-eye" id="ga-eye">顯示</button></span></label>'+
   '<div class="ga-err" id="ga-err" role="alert" aria-live="assertive"></div>'+
   '<button class="ga-btn" id="ga-btn" type="submit">登　入</button>'+
   '<p class="ga-foot">登入後此裝置 30 天內免重新登入<br>帳號密碼由管理者統一設定，請勿外流</p></form>';
  d.body.appendChild(g);
  var f=g.querySelector('form'),u=d.getElementById('ga-u'),p=d.getElementById('ga-p'),err=d.getElementById('ga-err'),btn=d.getElementById('ga-btn'),fails=0,until=0;
  d.getElementById('ga-eye').addEventListener('click',function(){var s=p.type==='password';p.type=s?'text':'password';this.textContent=s?'隱藏':'顯示'});
  f.addEventListener('submit',function(e){
    e.preventDefault();err.textContent='';var now=Date.now();
    if(now<until){err.textContent='錯誤次數過多，請 '+Math.ceil((until-now)/1000)+' 秒後再試';return}
    if(!u.value.trim()){err.textContent='請輸入帳號';u.focus();return}
    if(!p.value){err.textContent='請輸入密碼';p.focus();return}
    btn.disabled=true;
    setTimeout(function(){
      if(login(u.value,p.value)){location.reload();return}
      btn.disabled=false;fails++;p.value='';p.focus();
      if(fails>=5){until=Date.now()+30000;fails=0;err.textContent='帳號或密碼錯誤，已暫時鎖定 30 秒'}else err.textContent='帳號或密碼錯誤，請重新輸入';
    },30);
  });
  setTimeout(function(){try{u.focus()}catch(e){}},50);
}
function addLogout(){
  if(d.querySelector('.ga-logout,[data-site-logout]'))return;
  var b=d.createElement('button');b.type='button';b.className='ga-logout';b.textContent='登出';b.title='登出 '+current();
  b.addEventListener('click',function(){if(confirm('確定要登出嗎？'))logout()});d.body.appendChild(b);
}
if(!authed())lock();else onBody(addLogout);
window.addEventListener('pageshow',function(){if(!authed())lock()});
window.addEventListener('storage',function(e){if(e.key===KEY&&!authed())lock()});
})();
