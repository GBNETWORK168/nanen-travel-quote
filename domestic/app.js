(function () {
  const $ = function (id) { return document.getElementById(id); };
  const state = {
    mode: 'days',          // days | dates
    calendar: 'roc',       // roc | ad
    days: '',
    start: { y: 115, m: '', d: '', t: '' },
    end: { y: 115, m: '', d: '', t: '' },
    people: [{ id: 1, name: '', plan: 'p4', age: '' }]
  };
  let nextId = 2;

  function todayRocYear() {
    return new Date().getFullYear() - 1911;
  }
  state.start.y = todayRocYear();
  state.end.y = todayRocYear();

  function pad2(n) { return String(n).padStart(2, '0'); }
  function setIfChanged(el, val) {
    const v = val == null ? '' : String(val);
    if (el && el.value !== v) el.value = v;
  }

  function fieldYear(which) {
    const v = state[which].y;
    if (state.calendar === 'roc') return v;
    return (v === '' || v == null) ? '' : Number(v) + 1911;
  }

  function setYearFromInput(which, raw) {
    const n = parseInt(raw, 10);
    if (!n) { state[which].y = ''; return; }
    state[which].y = state.calendar === 'roc' ? n : n - 1911;
  }

  function toYMD(which) {
    const yRoc = state[which].y;
    const m = parseInt(state[which].m, 10);
    const d = parseInt(state[which].d, 10);
    if (!yRoc || !m || !d) return '';
    const y = yRoc + 1911;
    return y + '-' + pad2(m) + '-' + pad2(d);
  }

  function formatPeriodLabel(info) {
    if (state.mode === 'days') {
      return '投保天數 ' + info.days + ' 天';
    }
    const fmt = function (which) {
      const y = state[which].y;
      const m = pad2(state[which].m);
      const d = pad2(state[which].d);
      const t = state[which].t;
      const date = state.calendar === 'roc'
        ? (y + '/' + m + '/' + d)
        : ((y + 1911) + '/' + m + '/' + d);
      return t ? (date + ' ' + t) : date;
    };
    return fmt('start') + '～' + fmt('end') + '（' + info.days + '天）';
  }

  function computeDays() {
    if (state.mode === 'days') {
      const n = parseInt(state.days, 10);
      if (!state.days && state.days !== 0) return { error: '請輸入天數，或改用起迄日期' };
      if (!Number.isInteger(n) || n < 1) return { error: '天數請填 1 以上的整數' };
      return { days: n, mode: 'days', label: '直接輸入天數' };
    }
    const s = toYMD('start');
    const e = toYMD('end');
    const st = state.start.t;
    const et = state.end.t;
    if (!s || !e) return { error: '請完整填寫起迄年月日' };
    if ((st && !et) || (!st && et)) return { error: '時刻請起迄都填，或都留空（留空則日期頭尾都算）' };
    if (st && et) return guoluDaysByHours(s, st, e, et);
    return guoluDaysInclusive(s, e);
  }

  function coverageLines(plan) {
    const g = window.GUOLU.coverage_merged;
    const idx = plan.id === 'child' || plan.id === 'p1' || plan.id === 'p2' ? 0
      : (plan.id === 'p3' || plan.id === 'p4' ? 1 : 2);
    const lines = [
      '身故及失能 ' + plan.death,
      '傷害醫療（保期內最高）' + plan.medical
    ];
    g.forEach(function (item) {
      const val = item[idx + 2];
      if (val && val !== '—') lines.push(item[0] + ' ' + val);
    });
    return lines;
  }

  function personPremium(p, daysInfo) {
    const plan = guoluPlan(p.plan);
    if (!plan) return { plan: null, error: '找不到計畫' };
    const age = guoluAgeOk(plan, p.age === '' ? null : Number(p.age));
    let prem = { error: '尚無天數' };
    if (daysInfo && !daysInfo.error) prem = guoluPremium(p.plan, daysInfo.days);
    return { plan: plan, age: age, prem: prem, lines: coverageLines(plan) };
  }

  function renderPeople(daysInfo, force) {
    const box = $('people');
    const ids = state.people.map(function (p) { return String(p.id); }).join(',');
    if (!force && box.dataset.ids === ids && box.childElementCount === state.people.length) {
      // 只更新保費與保障，不重建輸入框，避免打字時失焦
      state.people.forEach(function (p, i) {
        const r = personPremium(p, daysInfo);
        const node = box.children[i];
        if (!node) return;
        const prem = node.querySelector('.prem');
        if (prem) prem.textContent = r.prem.premium != null ? ('NT$ ' + r.prem.premium.toLocaleString('zh-Hant-TW')) : '—';
        const mini = node.querySelector('.cov-head');
        if (mini && r.plan) mini.textContent = r.plan.age + ' ｜ 身故 ' + r.plan.death + ' ｜ 醫療 ' + r.plan.medical;
        const lines = node.querySelector('.cov-mini-lines');
        if (lines) lines.innerHTML = r.lines.map(function (l) { return '· ' + l; }).join('<br>');
        let err = node.querySelector('.js-errs');
        if (!err) {
          err = document.createElement('div');
          err.className = 'js-errs';
          const head = node.querySelector('.person-head.meta');
          if (head) head.after(err); else node.appendChild(err);
        }
        let html = '';
        if (r.age && r.age.error) html += '<div class="err">' + r.age.error + '</div>';
        if (r.prem.error && daysInfo && !daysInfo.error) html += '<div class="err">' + r.prem.error + '</div>';
        err.innerHTML = html;
      });
      return;
    }
    box.dataset.ids = ids;
    box.innerHTML = '';
    state.people.forEach(function (p, i) {
      const r = personPremium(p, daysInfo);
      const div = document.createElement('div');
      div.className = 'person';
      const premText = r.prem.premium != null
        ? ('NT$ ' + r.prem.premium.toLocaleString('zh-Hant-TW'))
        : '—';
      div.innerHTML =
        '<div class="person-head"><b>被保險人 ' + (i + 1) + '</b>' +
        (state.people.length > 1 ? '<button type="button" class="btn btn-ghost" data-del="' + p.id + '">刪除</button>' : '') +
        '</div>' +
        '<div class="row">' +
          '<div class="field grow"><label>姓名（選填）</label><input data-k="name" data-id="' + p.id + '" value="' + escapeAttr(p.name) + '" placeholder="例如：謝敏隆"></div>' +
          '<div class="field grow"><label>計畫／保額</label><select data-k="plan" data-id="' + p.id + '">' + planOptions(p.plan) + '</select></div>' +
          '<div class="field"><label>足歲（選填）</label><input data-k="age" data-id="' + p.id + '" inputmode="numeric" value="' + escapeAttr(p.age) + '" placeholder="例 52" style="width:5.5em"></div>' +
        '</div>' +
        '<div class="person-head meta" style="margin-top:8px"><span class="cov-mini cov-head">' + (r.plan ? (r.plan.age + ' ｜ 身故 ' + r.plan.death + ' ｜ 醫療 ' + r.plan.medical) : '') + '</span>' +
        '<span class="prem">' + premText + '</span></div>' +
        '<div class="js-errs">' + (r.age && r.age.error ? '<div class="err">' + r.age.error + '</div>' : '') + (r.prem.error && daysInfo && !daysInfo.error ? '<div class="err">' + r.prem.error + '</div>' : '') + '</div>' +
        '<div class="cov-mini cov-mini-lines">' + r.lines.map(function (l) { return '· ' + l; }).join('<br>') + '</div>';
      box.appendChild(div);
    });
  }

  function planOptions(sel) {
    return window.GUOLU.plans.map(function (pl) {
      const rent = (pl.id === 'p5' || pl.id === 'p6') ? '、含租車自駕' : '';
      const death = pl.death === '—' ? '無身故失能保額' : ('身故' + pl.death);
      return '<option value="' + pl.id + '"' + (pl.id === sel ? ' selected' : '') + '>' +
        pl.name + '（' + death + '，' + pl.age + rent + '）</option>';
    }).join('');
  }

  function escapeAttr(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function buildQuoteText(daysInfo) {
    const lines = [];
    lines.push('【國旅報價】新快樂旅綜＋國旅限定版 115.10');
    if (daysInfo && !daysInfo.error) {
      lines.push('保障期間：' + formatPeriodLabel(daysInfo));
      if (daysInfo.label && state.mode === 'dates') lines.push('天數算法：' + daysInfo.label);
    } else {
      lines.push('保障期間：尚未計算');
    }
    let total = 0;
    let ok = true;
    state.people.forEach(function (p, i) {
      const r = personPremium(p, daysInfo);
      const name = p.name || ('被保險人' + (i + 1));
      const prem = r.prem.premium != null ? (r.prem.premium.toLocaleString('zh-Hant-TW') + '元') : '（無法計價）';
      if (r.prem.premium != null) total += r.prem.premium; else ok = false;
      let age = p.age !== '' ? ('，' + p.age + '足歲') : '';
      lines.push((i + 1) + '. ' + name + '／' + r.plan.name + '（身故失能 ' + r.plan.death + '、傷害醫療 ' + r.plan.medical + age + '）／' + prem);
      if (r.age && r.age.error) lines.push('   ※' + r.age.error);
    });
    lines.push(ok ? ('合計保費：' + total.toLocaleString('zh-Hant-TW') + '元') : '合計保費：尚有人無法計價');
    lines.push('※保費依富邦產險國旅DM 115.10版刊印費率，實際以公司系統為準。DM僅列1～20日。');
    return { text: lines.join('\n'), total: ok ? total : null, ok: ok };
  }

  function renderRateTable(days) {
    const tb = $('rateBody');
    if (!tb) return;
    const ids = ['child', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    let html = '';
    for (let d = 1; d <= 20; d++) {
      const hi = d === days ? ' class="hi"' : '';
      html += '<tr' + hi + '><td>' + d + '</td>';
      ids.forEach(function (id) {
        html += '<td>' + window.GUOLU.rates[id][d - 1].toLocaleString('zh-Hant-TW') + '</td>';
      });
      html += '</tr>';
    }
    tb.innerHTML = html;
  }

  function render() {
    const daysInfo = computeDays();
    $('modeDays').classList.toggle('on', state.mode === 'days');
    $('modeDates').classList.toggle('on', state.mode === 'dates');
    $('calRoc').classList.toggle('on', state.calendar === 'roc');
    $('calAd').classList.toggle('on', state.calendar === 'ad');
    $('paneDays').style.display = state.mode === 'days' ? '' : 'none';
    $('paneDates').style.display = state.mode === 'dates' ? '' : 'none';
    $('yearLabelStart').textContent = state.calendar === 'roc' ? '年（民國）' : '年（西元）';
    $('yearLabelEnd').textContent = state.calendar === 'roc' ? '年（民國）' : '年（西元）';
    setIfChanged($('yStart'), fieldYear('start'));
    setIfChanged($('mStart'), state.start.m);
    setIfChanged($('dStart'), state.start.d);
    setIfChanged($('tStart'), state.start.t);
    setIfChanged($('yEnd'), fieldYear('end'));
    setIfChanged($('mEnd'), state.end.m);
    setIfChanged($('dEnd'), state.end.d);
    setIfChanged($('tEnd'), state.end.t);
    setIfChanged($('daysInput'), state.days);

    const hint = $('dayHint');
    if (daysInfo.error) {
      hint.innerHTML = '<div class="err">' + daysInfo.error + '</div>';
    } else {
      hint.innerHTML = '<p class="hint">投保天數：<strong>' + daysInfo.days + ' 天</strong>' +
        (daysInfo.label ? '（' + daysInfo.label + '）' : '') + '</p>';
    }

    renderPeople(daysInfo, window.__guoluForcePeople);
    window.__guoluForcePeople = false;
    const q = buildQuoteText(daysInfo);
    $('quotePreview').value = q.text;
    $('sumText').textContent = q.total != null ? ('NT$ ' + q.total.toLocaleString('zh-Hant-TW')) : '—';
    $('btnCopy').disabled = !daysInfo || !!daysInfo.error;
    renderRateTable(daysInfo && !daysInfo.error ? daysInfo.days : 0);
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  function copyText() {
    const text = $('quotePreview').value;
    const done = function () { toast('已複製報價文字'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    $('quotePreview').select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('請手動複製下方文字'); }
  }

  function findPerson(id) {
    return state.people.find(function (p) { return String(p.id) === String(id); });
  }

  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest('button');
    if (!btn) return;
    if (btn.id === 'modeDays') { state.mode = 'days'; render(); }
    if (btn.id === 'modeDates') { state.mode = 'dates'; render(); }
    if (btn.id === 'calRoc') {
      state.calendar = 'roc';
      render();
    }
    if (btn.id === 'calAd') {
      state.calendar = 'ad';
      render();
    }
    if (btn.id === 'btnAdd') {
      state.people.push({ id: nextId++, name: '', plan: 'p4', age: '' });
      window.__guoluForcePeople = true;
      render();
    }
    if (btn.id === 'btnCopy' || btn.id === 'btnCopy2') copyText();
    if (btn.dataset.del) {
      state.people = state.people.filter(function (p) { return String(p.id) !== btn.dataset.del; });
      window.__guoluForcePeople = true;
      render();
    }
  });

  document.addEventListener('input', function (ev) {
    const el = ev.target;
    if (el.id === 'daysInput') { state.days = el.value.trim(); render(); return; }
    if (el.id === 'yStart') { setYearFromInput('start', el.value); render(); return; }
    if (el.id === 'mStart') { state.start.m = el.value; render(); return; }
    if (el.id === 'dStart') { state.start.d = el.value; render(); return; }
    if (el.id === 'tStart') { state.start.t = el.value; render(); return; }
    if (el.id === 'yEnd') { setYearFromInput('end', el.value); render(); return; }
    if (el.id === 'mEnd') { state.end.m = el.value; render(); return; }
    if (el.id === 'dEnd') { state.end.d = el.value; render(); return; }
    if (el.id === 'tEnd') { state.end.t = el.value; render(); return; }
    if (el.dataset.k && el.dataset.id) {
      const p = findPerson(el.dataset.id);
      if (p) p[el.dataset.k] = el.value;
      render();
    }
  });

  window.addEventListener('DOMContentLoaded', render);
})();
