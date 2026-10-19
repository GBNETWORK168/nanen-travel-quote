/* 三方案總表報價圖：在編輯器產生可下載 PNG（適合 LINE） */
(function (global) {
  'use strict';

  function buildSummaryHtml(quote, opts) {
    opts = opts || {};
    var only = (opts.only === 0 || opts.only) ? Number(opts.only) : null;
    var single = only != null;
    var mode = quote.dateFormat === 'ad' ? 'ad' : 'roc';
    var dates = '';
    if (quote.startDate || quote.endDate) {
      dates = TQ.tripDates(quote, mode);
    }
    var a = quote.agent || {};
    var h = '';
    h += '<div class="sum-root' + (single ? ' sum-single' : '') + '" id="summaryCapture">';
    if (quote.sample) h += '<div class="sum-sample">⚠ 範例資料・非正式報價</div>';
    h += '<header class="sum-hero">';
    h += TQ.renderBrand('sum-brand');
    h += '<div class="sum-kicker">旅平險 ' + (single ? TQ.esc((quote.plans[only] && quote.plans[only].name) || ('方案' + (only + 1))) + ' 報價' : '三方案總表') + (quote.schengen ? '　<span class="hero-schengen">' + TQ.schengenBadge(quote) + '</span>' : '') + '</div>';
    h += '<div class="sum-title"><span class="dest">' + TQ.esc(quote.destination || '—') + '</span>';
    h += '<span class="days">' + TQ.esc(quote.days || '—') + '<small> 天</small></span></div>';
    if (dates) h += '<div class="sum-dates">' + TQ.esc(dates) + '</div>';
    h += '</header>';
    h += '<div class="sum-plans">';
    (quote.plans || []).forEach(function (plan, idx) {
      if (single && idx !== only) return;
      var c = TQ.computePlan(plan, quote);
      var L = c.life, P = c.prop, on = L.enabled, pOn = P.enabled;
      h += '<section class="sum-card' + (plan.recommended ? ' reco' : '') + '">';
      h += '<div class="sum-card-h"><span class="sum-name">' + TQ.esc(plan.name || ('方案' + (idx + 1))) + '</span>';
      if (plan.recommended) h += '<span class="sum-badge">推薦</span>';
      h += '</div>';
      h += '<div class="sum-tag">' + TQ.esc(TQ.displayTagline(plan)) + '</div>';
      if (c.child) {
        h += '<div class="sum-death"><div class="lab">' + (on ? '人壽兒童主約 MRC' : '意外身故・失能') + '</div><div class="val">' + (on ? TQ.esc(TQ.fmtYuan(L.mrc)) : '—') + '</div>';
        h += '<div class="br">' + TQ.niceText(on ? '兒童傷害醫療旅平險（未滿15足歲無 AT1）' : '未滿15足歲：產險兒童方案無身故・失能') + '</div></div>';
      } else {
        h += '<div class="sum-death"><div class="lab">意外身故・失能</div><div class="val">' + TQ.esc(TQ.fmtYuan(c.death)) + '</div>';
        h += '<div class="br">' + TQ.niceText(TQ.covSource(on, TQ.fmtShort(L.at1), pOn, TQ.fmtShort(P.death))) + '</div></div>';
      }
      h += '<ul class="sum-cov">';
      function covLi(label, total, lifeTxt, propTxt) {
        if (!total) return ''; // 兩邊都沒有此項保障 → 不顯示
        var src = TQ.covSource(on, lifeTxt, pOn, propTxt);
        return '<li><span class="sum-lab">' + TQ.niceText(label) + '</span><span class="sum-amtcol"><b>' + TQ.esc(TQ.fmtYuan(total)) + '</b>' + (src ? '<small class="sum-br">' + TQ.niceText('（' + src + '）') + '</small>' : '') + '</span></li>';
      }
      h += covLi('海外突發 住院', c.hospital, (L.child ? 'OH1 ' : '') + TQ.fmtShort(L.hospital), TQ.fmtShort(P.hospital));
      h += covLi('海外突發 門診', c.outpatient, '每日最高 ' + TQ.fmtShort(L.outpatient), TQ.fmtShort(P.outpatient));
      h += covLi('海外突發 急診', c.er, '每日最高 ' + TQ.fmtShort(L.er), TQ.fmtShort(P.er));
      h += covLi('意外醫療', c.accidentMedical, L.child ? 'MRC ' + TQ.fmtShort(L.mrc) : TQ.fmtShort(L.mr), TQ.fmtShort(P.accidentMedical));
      h += '</ul>';
      // 不便險：全部列出（產險不投保 → 不顯示）；三欄用 subgrid 讓各區塊（不便險／保費列）水平對齊
      function itemLi(it) {
        return '<li><span class="sum-iname">' + TQ.niceText(it.name) + '</span><span class="sum-iamt">' + (TQ.niceText(it.amount) || '—') + '</span></li>';
      }
      var items = pOn ? (plan.inconvenience || []) : [];
      h += '<div class="sum-blk sum-blk-inconv">';
      if (items.length) {
        h += '<div class="sum-sec">不便險</div><ul class="sum-items">';
        items.forEach(function (it) { h += itemLi(it); });
        h += '</ul>';
      }
      h += '</div>';
      if (single && pOn && (plan.others || []).length) {
        h += '<div class="sum-blk"><div class="sum-sec">其他產險保障</div><ul class="sum-items">';
        plan.others.forEach(function (it) { h += itemLi(it); });
        h += '</ul></div>';
      }
      var pp = TQ.premiumParts(c);
      h += pp.missing
        ? '<div class="sum-prem">壽 ' + pp.life + ' ＋ 產 ' + pp.prop + '（人壽另計）</div>'
        : '<div class="sum-prem">壽 ' + pp.life + ' ＋ 產 ' + pp.prop + ' ＝ <b>' + pp.total + '</b> 元</div>';
      h += '</section>';
    });
    h += '</div>';
    if (single && TQ.renderNotes) {
      var q1 = JSON.parse(JSON.stringify(quote)); q1.plans = [quote.plans[only]];
      h += '<section class="sum-notes">' + TQ.renderNotes(q1) + '</section>';
    }
    h += '<footer class="sum-foot">';
    h += '<div class="u">富邦人壽 ' + TQ.esc(a.unit || '南恩通訊處') + '</div>';
    h += '<div class="p">' + TQ.esc(a.title || '業務經理') + ' <b>' + TQ.esc(a.name || '陳銘旭') + '</b></div>';
    if (TQ.isCardQuote && TQ.isCardQuote(quote)) {
      var cardParts = [];
      (quote.plans || []).forEach(function (p, i) {
        if (single && i !== only) return;
        if (p.property && p.property.enabled === false) return;
        var pre = TQ.resolvePropertyPreset(p.property || {}, quote);
        if (pre) cardParts.push((p.name || ('方案' + (i + 1))) + '：' + pre.plan + ' 組合' + pre.combo);
      });
      var adq = TQ.cardAddonQuote(quote, quote.days);
      h += '<div class="note">產險＝富邦產險 新快樂旅平卡（專案）' + TQ.esc(cardParts.join('／')) +
        (adq.items.length ? '｜加價購：' + TQ.esc(adq.items.map(function (x) { return x.name + ' ' + TQ.comma(x.premium) + '元'; }).join('、')) + '（已含於產險）' : '') +
        '｜費率：' + TQ.esc(TQ.CARD_SOURCE) + '</div>';
    }
    h += '<div class="note">實際以保單條款及核保為準</div>';
    h += '</footer></div>';
    return h;
  }

  function ensureHost() {
    var host = document.getElementById('summaryExportHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'summaryExportHost';
      host.setAttribute('aria-hidden', 'true');
      document.body.appendChild(host);
    }
    return host;
  }

  function downloadSummaryPng(quote, opts) {
    opts = opts || {};
    var only = (opts.only === 0 || opts.only) ? Number(opts.only) : null;
    if (!global.html2canvas) {
      alert('缺少 html2canvas，無法產生圖片');
      return Promise.reject(new Error('no html2canvas'));
    }
    var host = ensureHost();
    host.innerHTML = buildSummaryHtml(quote, opts);
    var el = host.querySelector('#summaryCapture');
    // 等 logo（及所有圖片）載入完成再截圖，避免第一次下載 logo 空白
    var imgs = Array.prototype.slice.call(el.querySelectorAll('img'));
    var ready = Promise.all([TQ.brandLogoReady ? TQ.brandLogoReady() : Promise.resolve()].concat(imgs.map(function (img) {
      if (img.complete && img.naturalWidth) return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      return new Promise(function (res) { img.onload = img.onerror = function () { res(); }; });
    })));
    return ready.then(function () { return global.html2canvas(el, {
      scale: 2,
      backgroundColor: '#f4f6f9',
      useCORS: true,
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight
    }); }).then(function (canvas) {
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          var name = (quote.sample ? '範例_' : '') + (quote.destination || '旅平險') +
            (quote.days || '') + '天_' + (only != null ? ((quote.plans[only] && quote.plans[only].name) || ('方案' + (only + 1))) : '三方案總表') + '.png';
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
          host.innerHTML = '';
          resolve(name);
        }, 'image/png');
      });
    }).catch(function (err) {
      host.innerHTML = '';
      throw err;
    });
  }

  global.TQ_SUMMARY = { downloadSummaryPng: downloadSummaryPng, buildSummaryHtml: buildSummaryHtml };
})(window);
