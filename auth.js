/* 共用登入關卡（純前端；帳號由管理端統一設定，使用者無法自行註冊或改密碼）
 * 同步載入於每頁 <head> 前段：未登入 → 隱藏整頁內容並顯示登入框；登入狀態存 localStorage 30 天。
 * 不存明碼：每個帳號只存 salt 與 SHA-256(帳號|密碼|salt) 再迭代 20000 次的雜湊。
 * 帳號清單由 /workspace/site-auth/manage_users.py 自動產生，請勿手改 USERS 這一行。 */
(function(){
'use strict';
var USERS=/*USERS_BEGIN*/{"fb95db20134269fc3835":{"s":"76d3869f239de0556abeb9cb","h":"a2a937c0aad9a66ff0a57090a8bb0b2b8fe9885856cc5acd9d4eae52d376078f"},"c456f933bafdc1e32e99":{"s":"52396af7fb25c4fff60d8d4e","h":"d1ae3b6addf7067752828247a8f5a086689233fadc76ad0f163ad7b3f6f732c4"},"8d1e1b560dc498add532":{"s":"80b253f3af1b6ec50c7a9343","h":"d9f8280a183900cc9b2fd4949b4a62bbf6d9dfa20f269a871482da078b681365"},"fa3ba7aa603af11f2d03":{"s":"d39cd770f2b3158b3895927f","h":"1f1986be94cbcad4dfebe0c8f03837431ebf13065b42ca7a9b1b048199cdfefe"},"bba224c80330a73a80ff":{"s":"27fd04a3d900d6f1cdc8f2e5","h":"edcac34b34839233927a53160b8772774c722b0baa325a1e349b4edbde880c4c"},"2f9fe067320d3cefa5c9":{"s":"59f5011cff049f2073fedce3","h":"b88a20cf1b8e7f3bb6603a1b8c7e8f54b51141ee2838a3895ffc326d58c451ee"},"1d3e4cd6b8620df6d3fe":{"s":"8208134e32c4f1af63b9a102","h":"312f3a23e8aa7d5080f4b35ced4f120fb60f52a80f305154abe480140cca9202"},"525a35d5de445c417472":{"s":"18ac61c2de94627dfa0b4756","h":"e7eba3a179e198b4f10f22cc003de8e87222f4323d14dd2badf79d85c778d9cb"},"1fda383666d347935e94":{"s":"0173c8fe50b1ad4ac4b5892b","h":"2633a57337b5b25ca5005c29fa8f423a52ca23b3dc9da651d3a1140abb876d73"},"0d19fb4b75d3fb391060":{"s":"a26f1ab5c27e2314284a9c07","h":"ff8f70a4408cecb1e485e9c643107d33f7ac49b543e210ddaf860c5f066c806b"},"2e773f74476a943761fd":{"s":"2d93c83a64e71ad0308f0185","h":"2ed5aa924ba5fa9b34ecfb0621f838108b6db522513bb8dc51aca5ce778cb527"},"d5d94565a06cfa4f674d":{"s":"00a3464104187bea122026fa","h":"29101d0268c44ef8b3877d5e8be0314dd29e8655440d5284dbb8c7e010b60fe4"},"9cff845284ae3350faeb":{"s":"d0f9b841d17f32c858bb84a8","h":"485fe39b37111f7b88cabadcbd31e488c6b2051fc72bbd3a8df056f0af7c8792"},"ea61b25912ebb6eaf563":{"s":"48d7e91d800985ea3a38583e","h":"04f7812417dde9df2a337e5ec89c7651b8b3174ff9c3d4dc6bf97a39b30ced68"},"e69c19432e9dda7a735e":{"s":"562854ae3ca20cd22c7296a4","h":"72d42060da24a912c2955cc97d9f9db7c018e3c6b6a0b005081480b72ad21218"},"8c99a4886921ec3f9304":{"s":"f6a05fe48f836d9fd68227bd","h":"0452788d1b1f07bb24da2b17976bea5eefb48e687b900895fae21aff87c9eda1"},"52a530d70044b511a01a":{"s":"6a428867603d5b30aa32944d","h":"daaf3813d39f0bee5574cd88b27e89c14c6d7994f466bce494a09efe794dbcc6"},"ba679eb9cbf476e8e43a":{"s":"9be8eb76ac90e56986b517f5","h":"a9107f8551599c43ff283a9ad02765c8ec563fc9cc73e0c65506bc87d918872c"},"7c6de942141244cd9616":{"s":"427996f30065371c5fda0103","h":"24409845202ec7ae2d36efe27a46e47725d8356b591b04c754bac6171e898148"},"318d758b4865749b66e9":{"s":"42c20187e542db07a7fc86fd","h":"2bae515ddde8df565176929240ad1fac8ebc19660b1e733931148f8f106335b3"},"68e04a2b5ad70f021a24":{"s":"60faa1b642bb75a5bc75bda9","h":"bf76f5fad1c70ec6a40a4ea3f87815741791a88f87002b6054f16ae2addcd1a3"},"c5196ae2da1080f02571":{"s":"96e1c42806ac6a28551108a7","h":"6de9b4da6d583b8a1675f42b26332bc54beb027a22df150cfba1dc15792aec89"},"f62f41a642ab6e56e0c0":{"s":"2175dd9c559b4113f15d31fe","h":"1d4afd4c9a9197ce0c6c6c0fba45297ed43ab97b46bedb3eaf092c8311c20718"},"bd2af26797c28f492b1d":{"s":"4e4dd27a3b365f71041152b8","h":"154eb262614b99af691b429e019fa7de1e78a4229d66cef7b29ce1e109d992a6"},"eb003b80718dd7859760":{"s":"e75be06e60390b42a078973d","h":"4dc30e07ae61d7a976b5d24f4efe21c8695b01cc21db53201a7fd87a7f9985e2"},"dce9230bcdeb887a33d0":{"s":"1454941a73c6372952c4b4ae","h":"83afd42363b5d1adfe9ff539fc34727bf16cac11d0fba7e44ab843dcf172e3b7"},"5608ca3f3f94d6746d5f":{"s":"8f1dfe3725b992c4cbabd05a","h":"4668376761c6a3209cebe096a8f003f39b75e71d524d20bfaa84c5032483f890"},"9d1e5e320a6582a68204":{"s":"9bdac039778417fbb5d03f52","h":"ce2d7bc165aa6b4f7b84d82a1b690591b7a16ef5f159cd17ec7477c6886c83c8"},"5023de6b5c2c0f91c297":{"s":"504408636d4e29f3d1277c84","h":"507eae5152ea4a0346a10791916a5c2f06f0bff459248519e74cee0ac432860f"},"02fd4cf6875d7124e357":{"s":"ca69ed5f0506432ecc5c9913","h":"ce92f7a0e4ff8399d441d6b9e398d0aecc5b2a14a3c0779a4f6056a47f77172d"},"6efb39367517900ac344":{"s":"406431f415ee51437bb7ac47","h":"af5af1a00594749274c72a4591ce736c689a4e7a15abfe9e4b44ba4766bb564a"},"39f7ae5d22b52718664a":{"s":"8ce1cde4cc7ac5cd7c830bf8","h":"7e3bd0230916158fb55074cd4309e25e152f186ea56846f0c231d13941603bbb"},"8931704d262a140d85e8":{"s":"232117e0a9377bcbd6948681","h":"6bb8fa082da621ed537a588531f17f0d8a99cefa9bd666aed8ea11432ab318b3"},"5aed4b6be428fbfa91eb":{"s":"90e514de3a02b1a88ad81614","h":"6540d9708adc08af9452b0b73fad029442808ed663043c186854c25ad30f881a"},"501887882f16071a49f4":{"s":"c2332139f6a81da51e7373af","h":"4577331ce7063c2bd09ef132c2c63ee62dbb4c05db85411fdad3657339998abd"},"6690735dfbdc9f5f98af":{"s":"04b84cceaa6a9d8cbedbe9fb","h":"6ea5f483e6c62490c27339d8ff6545073f96f036d10d022bb5b72f71a97c1952"},"80312a9a2c918f20ee83":{"s":"ff3a0cd2eb19badbe3cec566","h":"03fd3fe651bc5ad1749e00ac29f5c0b50ff632b1334b53c86cf750b468e8fb79"},"e88e245b94232bde1515":{"s":"9dbf84521eb5d1ebb208e284","h":"496786465ac343d826a0455eff5b7cc5028867ccc8375c9bac423d207b101f23"},"1531322fab4334c04fd2":{"s":"d9e0ff0488ad06b62a65fb37","h":"913c66fb00d5c78f98403db315f1b5fcf77c7bb32a0fbeddd6bf9a9b76aa271a"},"841f0d1d748732c838bc":{"s":"6e2a5bca3ed14f8978e62583","h":"4cba9c8d26636469e1cc33d7780d8a3c79f162c6e9036f8fcf24d6773902db1e"},"f72ce54ec99e5a51b028":{"s":"41ddc253963b220e8261189a","h":"2a0289422778dbd31de54dd7309c5ec1b2cc5776e20083d2034881df10cd1ada"},"bc2c6e878cb2421c38fe":{"s":"0d5a14b617f693f773a0af55","h":"601ce8cbc482e9882d30f2351adfe3d86cbae54d2ba5c5c7e83949b8b0c275ef"},"08738b454a9775fd06b3":{"s":"c9d36c3bb2dd26b22df776a1","h":"99d3193f070baf5f8eae386d0b69d519d39b8f6b577ae6b331b61fb68ba9b17a"},"18de2ebfe4a48bf74c8d":{"s":"49484bdff61ed227d4575ca6","h":"6d36c6c6dccb2cceecd9f44da5e79a6744973fc83c1b2c25bb7eb27a2111acb2"}}/*USERS_END*/;
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
function norm(u){u=String(u==null?'':u).replace(/\s+/g,'').toLowerCase();var i=u.indexOf('@');return i>0?u.slice(0,i):u}
function ukey(n){return sha256('u|'+n).slice(0,20)}
function derive(u,pw,salt){var h=sha256(u+'|'+pw+'|'+salt);for(var i=0;i<ITER;i++)h=sha256(h+salt);return h}
function tok(h){return sha256('sess|'+h)}
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function authed(){var o=read(),r=o&&USERS.hasOwnProperty(o.k)&&USERS[o.k];return !!(r&&o.t===tok(r.h)&&o.exp>Date.now())}
function login(user,pw){var n=norm(user),k=ukey(n),r=USERS.hasOwnProperty(k)&&USERS[k];if(!r||!pw||derive(n,pw,r.s)!==r.h)return false;
  try{localStorage.setItem(KEY,JSON.stringify({k:k,u:n,t:tok(r.h),exp:Date.now()+DAYS*864e5}))}catch(e){return false}return true}
function current(){var o=read();return authed()&&o.u!=='~'?(o.u||''):''}
/* ---- 登入使用紀錄（LOG_URL 空白就不送；送失敗不影響登入；絕不送密碼） ---- */
var LOG_URL=/*LOG_URL_BEGIN*/""/*LOG_URL_END*/,SITE=/*SITE_BEGIN*/"旅平險"/*SITE_END*/;
function logEvent(ev,user){
  if(!LOG_URL)return;
  try{
    var body=JSON.stringify({ev:ev,user:String(user||'').replace(/\s+/g,'').toLowerCase().slice(0,80),site:SITE,page:location.pathname,ua:navigator.userAgent.slice(0,300),ts:Date.now()});
    if(navigator.sendBeacon&&navigator.sendBeacon(LOG_URL,new Blob([body],{type:'text/plain;charset=UTF-8'})))return;
    fetch(LOG_URL,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=UTF-8'},body:body}).catch(function(){});
  }catch(e){}
}
function dailyVisit(){try{var o=read();if(!o)return;var day=new Date(Date.now()+8*3600e3).toISOString().slice(0,10),k='gb_visit_'+SITE+'_'+location.pathname;
  if(localStorage.getItem(k)===day)return;localStorage.setItem(k,day);logEvent('visit',o.u==='~'?'(舊共用帳號)':o.u)}catch(e){}}
/* 舊的單一共用帳號（本站原內建登入，格式 SHA-256(帳號:密碼)）：保留可用，之後不需要時由管理端移除 */
var LP=/*LP_BEGIN*/["e3467ad11993520bc0b7fa9418d6d45e5d4baca97aad29f5743e914867d54351"]/*LP_END*/;
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
      if(login(u.value,p.value)){logEvent('login_ok',read().u==='~'?'(舊共用帳號)':read().u);setTimeout(function(){location.reload()},150);return}
      logEvent('login_fail',u.value);
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
if(!authed())lock();else{onBody(addLogout);dailyVisit()}
window.addEventListener('pageshow',function(){if(!authed())lock()});
window.addEventListener('storage',function(e){if(e.key===KEY&&!authed())lock()});
})();
