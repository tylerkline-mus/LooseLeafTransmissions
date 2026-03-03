var S = {
  who:null, orgNeed:null, audioType:null, format:null, episodes:null,
  presence:null, curationScope:null, seasonCount:null,
  artistNeed:null, identityDepth:null, workshopFormat:null, radioNeed:null,
  addons:{materials:false,transcript:false,rush:false}
};
var hist = [];
var lineItems = [];

function pick(btn, stepId) {
  var opts = btn.parentNode.querySelectorAll('.option-btn');
  for (var i=0; i<opts.length; i++) opts[i].classList.remove('selected');
  btn.classList.add('selected');
  var nextBtn = document.getElementById('next-'+stepId);
  if (nextBtn) nextBtn.classList.add('enabled');
  var v = btn.getAttribute('data-value');
  if (stepId==='1') S.who=v;
  else if (stepId==='2-org') S.orgNeed=v;
  else if (stepId==='3-audio') S.audioType=v;
  else if (stepId==='4-format') S.format=v;
  else if (stepId==='4-series') S.episodes=v;
  else if (stepId==='5-presence') S.presence=v;
  else if (stepId==='3-curation') S.curationScope=v;
  else if (stepId==='4-season') S.seasonCount=v;
  else if (stepId==='2-artist') S.artistNeed=v;
  else if (stepId==='3-identity') S.identityDepth=v;
  else if (stepId==='3-workshop') S.workshopFormat=v;
  else if (stepId==='2-radio') S.radioNeed=v;
}

function toggleAddon(e, name) {
  e.preventDefault();
  S.addons[name] = !S.addons[name];
  var el = document.getElementById('cb-'+name);
  if (el) el.classList.toggle('selected', S.addons[name]);
}

function showStep(id) {
  var steps = document.querySelectorAll('.step');
  for (var i=0; i<steps.length; i++) steps[i].classList.remove('active');
  var fs = document.getElementById('final-screen');
  if (fs) fs.classList.remove('active');
  var el = document.querySelector('[data-step="'+id+'"]');
  if (el) el.classList.add('active');
}

function advance(from) {
  hist.push(from);
  if (from==='1') {
    if (S.who==='org') showStep('2-org');
    else if (S.who==='artist') showStep('2-artist');
    else if (S.who==='radio') showStep('2-radio');
  } else if (from==='2-org') {
    if (S.orgNeed==='audio') showStep('3-audio');
    else if (S.orgNeed==='curation') showStep('3-curation');
    else showStep('3-audio');
  } else if (from==='3-audio') {
    if (S.audioType==='series') showStep('4-series');
    else showStep('4-format');
  } else if (from==='4-format') {
    showStep('5-presence');
  } else if (from==='4-series') {
    showStep('5-presence');
  } else if (from==='5-presence') {
    showStep('6-addons');
  } else if (from==='3-curation') {
    if (S.curationScope==='season') showStep('4-season');
    else showFinal();
  } else if (from==='2-artist') {
    if (S.artistNeed==='identity') showStep('3-identity');
    else if (S.artistNeed==='workshop') showStep('3-workshop');
    else showFinal();
  }
}

function back() {
  if (hist.length > 0) showStep(hist.pop());
}

function showFinal() {
  var steps = document.querySelectorAll('.step');
  for (var i=0; i<steps.length; i++) steps[i].classList.remove('active');
  var fs = document.getElementById('final-screen');
  if (fs) fs.classList.add('active');
  buildEstimate();
}

function fmtPrice(mn, mx) {
  if (mn===mx) return '$'+mn.toLocaleString();
  return '$'+mn.toLocaleString()+'\u2013$'+mx.toLocaleString();
}

function buildEstimate() {
  lineItems = [];
  var summary = '';

  if (S.who==='org' && (S.orgNeed==='audio' || S.orgNeed==='both')) {
    if (S.audioType==='series' || S.audioType==='unsure') {
      var mn=2200, mx=2800, lbl='3-episode series';
      if (S.episodes==='4-6ep'){mn=3500;mx=5000;lbl='4\u20136 episode series';}
      else if (S.episodes==='6ep+'){mn=5000;mx=7500;lbl='6+ episode series';}
      else if (S.episodes==='unsure-series'){mn=2200;mx=5000;lbl='series (scope TBD)';}
      lineItems.push({name:'The Series',detail:lbl+' \u00b7 concept, planning, production, hosting, and delivery',mn:mn,mx:mx,tbd:false,core:true});
      summary = lbl;
    } else {
      if (S.format==='interview'||S.format==='unsure-format'||!S.format) {
        lineItems.push({name:'The Interview',detail:'One conversation, edited and delivered',mn:750,mx:1000,tbd:false,core:true});
        summary = 'a single Interview';
      }
      if (S.format==='story') {
        lineItems.push({name:'The Story',detail:'One produced narrative piece',mn:900,mx:1200,tbd:false,core:true});
        summary = 'a single Story';
      }
      if (S.format==='both-formats') {
        lineItems.push({name:'The Interview',detail:'One conversation, edited and delivered',mn:750,mx:1000,tbd:false,core:true});
        lineItems.push({name:'The Story',detail:'Produced from the same conversation',mn:300,mx:500,tbd:false,core:true});
        summary = 'The Interview and The Story from the same conversation';
      }
    }
    if (S.presence==='inperson') {
      lineItems.push({name:'In Person \u2014 Live Event Presence',detail:'Pre-concert talks, emceeing, panel moderation, on-stage interviews \u00b7 travel billed separately',mn:750,mx:1500,tbd:false,core:false});
    }
    if (S.addons.materials) {
      lineItems.push({name:'Additional Materials',detail:'Social clips, trailer, pull quotes \u2014 scoped in consultation',mn:0,mx:0,tbd:true,core:false});
    }
    if (S.addons.transcript) {
      var ep = (S.audioType==='series') ? (S.episodes==='3ep'?3:S.episodes==='4-6ep'?5:7) : 1;
      lineItems.push({name:'Transcript'+(ep>1?'s':''),detail:ep+' episode'+(ep>1?'s':'')+' \u00b7 $75\u2013$150 each',mn:75*ep,mx:150*ep,tbd:false,core:false});
    }
    if (S.addons.rush) {
      lineItems.push({name:'Rush Turnaround',detail:'+20\u201330% to base rate',mn:0,mx:0,tbd:true,core:false});
    }
  }

  if (S.who==='org' && (S.orgNeed==='curation' || S.orgNeed==='both')) {
    var isAlso = S.orgNeed==='both';
    if (S.curationScope==='discovery') {
      lineItems.push({name:'Composer Discovery & Repertoire Consulting',detail:'Curated recommendations grounded in your artistic identity',mn:300,mx:500,tbd:false,core:!isAlso});
      summary = summary ? summary+' + repertoire consulting' : 'Composer Discovery & Repertoire Consulting';
    } else if (S.curationScope==='project') {
      lineItems.push({name:'Project-Based Curatorial Support',detail:'One concert built together from scratch \u00b7 up to 3 meetings included',mn:500,mx:750,tbd:false,core:!isAlso});
      summary = summary ? summary+' + project-based curation' : 'Project-Based Curatorial Support';
    } else if (S.curationScope==='season') {
      var smn=1500, smx=3000;
      if (S.seasonCount==='4-6c'){smn=2500;smx=5000;}
      else if (S.seasonCount==='6c+'){smn=4000;smx=7500;}
      lineItems.push({name:'Season Shaping & Artistic Direction',detail:'Full season partnership from the ground up',mn:smn,mx:smx,tbd:false,core:!isAlso});
      summary = summary ? summary+' + season shaping' : 'Season Shaping & Artistic Direction';
    }
  }

  if (S.who==='radio') {
    if (S.radioNeed==='radio-single') {
      lineItems.push({name:'Contemporary Music Integration Consultation',detail:'Repertoire recommendations, rotation strategy, 1\u20132 meetings',mn:250,mx:400,tbd:false,core:true});
      summary = 'a one-time radio programming consultation';
    } else {
      lineItems.push({name:'Ongoing Programming Retainer',detail:'Quarterly or annual support \u2014 scoped in consultation',mn:0,mx:0,tbd:true,core:true});
      summary = 'an ongoing radio programming retainer';
    }
  }

  if (S.who==='artist') {
    if (S.artistNeed==='office-hours') {
      lineItems.push({name:'Office Hours',detail:'One session \u00b7 sliding scale available',mn:75,mx:100,tbd:false,core:true});
      summary = 'a single Office Hours session';
    } else if (S.artistNeed==='identity') {
      if (S.identityDepth==='coaching-3') {
        lineItems.push({name:'Artistic Identity Coaching \u2014 3-Session Package',detail:'A focused series to help you articulate your work and story',mn:275,mx:275,tbd:false,core:true});
        summary = 'Artistic Identity Coaching, 3-session package';
      } else {
        lineItems.push({name:'Artistic Identity Coaching \u2014 Single Session',detail:'Begin with one session, assess from there',mn:100,mx:100,tbd:false,core:true});
        summary = 'Artistic Identity Coaching, one session to start';
      }
    } else if (S.artistNeed==='workshop') {
      if (S.workshopFormat==='talk') {
        lineItems.push({name:'Guest Lecture / Talk',detail:'45\u201390 minutes \u00b7 travel billed separately',mn:250,mx:500,tbd:false,core:true});
        summary = 'a guest lecture or talk';
      } else if (S.workshopFormat==='workshop-p') {
        lineItems.push({name:'Participatory Workshop',detail:'60\u201390 minutes \u00b7 travel billed separately',mn:500,mx:800,tbd:false,core:true});
        summary = 'a participatory workshop';
      } else if (S.workshopFormat==='halfday') {
        lineItems.push({name:'Half-Day Intensive',detail:'Multi-session deeper engagement \u00b7 travel billed separately',mn:1000,mx:1500,tbd:false,core:true});
        summary = 'a half-day intensive';
      }
    }
  }

  var summaryEl = document.getElementById('final-summary');
  if (summaryEl) summaryEl.textContent = summary
    ? 'Based on what you\'ve shared, here\'s what we\'d recommend: '+summary+'.'
    : 'Based on what you\'ve shared, here\'s a starting point for your project.';

  renderItems();
  calcTotal();
}

function renderItems() {
  var c = document.getElementById('line-items');
  if (!c) return;
  c.innerHTML = '';
  var coreCount = 0;
  for (var i=0; i<lineItems.length; i++) { if (lineItems[i].core) coreCount++; }

  for (var idx=0; idx<lineItems.length; idx++) {
    var item = lineItems[idx];
    var div = document.createElement('div');
    div.className = 'line-item';
    div.id = 'li-'+idx;
    var priceText = item.tbd ? 'scoped in consultation' : fmtPrice(item.mn, item.mx);
    var priceClass = item.tbd ? 'line-item-price tbd' : 'line-item-price';
    var lockToggle = (item.core && coreCount === 1) ? ' disabled' : '';
    div.innerHTML =
      '<div class="line-item-left">'+
        '<label class="toggle">'+
          '<input type="checkbox" checked data-idx="'+idx+'" data-core="'+(item.core?'1':'0')+'"'+lockToggle+' onchange="togItem(this)">'+
          '<div class="toggle-track"></div>'+
          '<div class="toggle-thumb"></div>'+
        '</label>'+
        '<div class="line-item-info">'+
          '<div class="line-item-name">'+item.name+'</div>'+
          '<div class="line-item-detail">'+item.detail+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="'+priceClass+'">'+priceText+'</div>';
    c.appendChild(div);
  }
}

function togItem(cb) {
  if (cb.getAttribute('data-core')==='1' && !cb.checked) {
    var coreCBs = document.querySelectorAll('#line-items input[data-core="1"]');
    var checked = 0;
    for (var i=0; i<coreCBs.length; i++) { if (coreCBs[i].checked) checked++; }
    if (checked === 0) { cb.checked = true; return; }
  }
  var li = document.getElementById('li-'+cb.getAttribute('data-idx'));
  if (li) li.classList.toggle('dimmed', !cb.checked);
  calcTotal();
}

function calcTotal() {
  var mn=0, mx=0, hasTBD=false;
  var lis = document.querySelectorAll('#line-items .line-item');
  for (var i=0; i<lis.length; i++) {
    var cb = lis[i].querySelector('input[type=checkbox]');
    if (!cb || !cb.checked) continue;
    var pe = lis[i].querySelector('.line-item-price');
    if (!pe) continue;
    if (pe.classList.contains('tbd')) { hasTBD=true; continue; }
    var t = pe.textContent.replace(/\$|,/g,'');
    var parts = t.split('\u2013');
    mn += parseInt(parts[0])||0;
    mx += parseInt(parts[parts.length-1])||0;
  }
  var el = document.getElementById('total-amount');
  if (!el) return;
  var suffix = hasTBD ? ' + TBD' : '';
  if (mn===0 && hasTBD) el.textContent = 'Scoped in consultation';
  else if (mn===mx) el.textContent = '$'+mn.toLocaleString()+suffix;
  else el.textContent = '$'+mn.toLocaleString()+'\u2013$'+mx.toLocaleString()+suffix;
}

function startOver() {
  S = {
    who:null,orgNeed:null,audioType:null,format:null,episodes:null,
    presence:null,curationScope:null,seasonCount:null,
    artistNeed:null,identityDepth:null,workshopFormat:null,radioNeed:null,
    addons:{materials:false,transcript:false,rush:false}
  };
  hist = [];
  lineItems = [];
  var optBtns = document.querySelectorAll('.option-btn');
  for (var i=0; i<optBtns.length; i++) optBtns[i].classList.remove('selected');
  var cbBtns = document.querySelectorAll('.checkbox-btn');
  for (var i=0; i<cbBtns.length; i++) cbBtns[i].classList.remove('selected');
  var nextBtns = document.querySelectorAll('.btn-next');
  for (var i=0; i<nextBtns.length; i++) {
    if (nextBtns[i].textContent.indexOf('estimate') === -1) nextBtns[i].classList.remove('enabled');
  }
  var fs = document.getElementById('final-screen');
  if (fs) fs.classList.remove('active');
  showStep('1');
}

// init
showStep('1');
