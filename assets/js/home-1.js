(function(){
  var CONF = [
    { name:'ECCV 2026', abbr:'ECCV', type:'CV', color:'#059669',
      location:'Malmö, Sweden', conf:'Sep 8–13, 2026', url:'https://eccv.ecva.net/Conferences/2026',
      deadlines:[
        {label:'Paper Submission', date:'2026-03-05', passed:true},
        {label:'Supplemental',     date:'2026-03-12', passed:true},
        {label:'Rebuttal',         date:'2026-05-11', passed:true},
        {label:'Decisions',        date:'2026-06-17'},
      ]},
    { name:'ICML 2026', abbr:'ICML', type:'ML', color:'#2563eb',
      location:'Seoul, South Korea', conf:'Jul 6–11, 2026', url:'https://icml.cc/Conferences/2026',
      deadlines:[
        {label:'Abstract',         date:'2026-01-23', passed:true},
        {label:'Paper Submission', date:'2026-01-28', passed:true},
        {label:'Notification',     date:'2026-04-30', passed:true},
        {label:'Conference',       date:'2026-07-06'},
      ]},
    { name:'CVPR 2027', abbr:'CVPR', type:'CV', color:'#059669',
      location:'Nashville, TN, USA', conf:'Jun 2027', url:'https://cvpr.thecvf.com/',
      deadlines:[
        {label:'Abstract',         date:'2026-11-06'},
        {label:'Paper Submission', date:'2026-11-13'},
      ]},
    { name:'ICLR 2026', abbr:'ICLR', type:'ML', color:'#7c3aed',
      location:'Rio de Janeiro, Brazil', conf:'Apr 23–27, 2026', url:'https://iclr.cc/Conferences/2026',
      deadlines:[
        {label:'Submission',       date:'2025-09-24', passed:true},
        {label:'Notification',     date:'2026-01-25', passed:true},
        {label:'Conference',       date:'2026-04-23', passed:true},
      ]},
    { name:'NeurIPS 2026', abbr:'NeurIPS', type:'ML', color:'#2563eb',
      location:'San Diego, CA, USA', conf:'Dec 6–12, 2026', url:'https://neurips.cc/Conferences/2026',
      deadlines:[
        {label:'Abstract',         date:'2026-05-04', passed:true},
        {label:'Full Paper',       date:'2026-05-06', passed:true},
        {label:'Notification',     date:'2026-09-18'},
        {label:'Conference',       date:'2026-12-06'},
      ]},
    { name:'ICLR 2027', abbr:'ICLR', type:'ML', color:'#7c3aed',
      location:'TBA', conf:'TBA', url:'https://iclr.cc/',
      deadlines:[
        {label:'Abstract',         date:null},
        {label:'Paper Submission', date:null},
      ]},
  ];

  var grid = document.getElementById('conf-ddl-grid');
  if (!grid) return;
  var now = new Date();

  CONF.forEach(function(c) {
    var next = null;
    for (var i = 0; i < c.deadlines.length; i++) {
      var d = c.deadlines[i];
      if (!d.date) continue;
      if (d.passed) continue;
      var p = d.date.split('-');
      var dt = new Date(+p[0], +p[1]-1, +p[2], 23, 59, 59);
      if (dt >= now) { next = {label: d.label, dt: dt}; break; }
    }

    var chip = '';
    if (next) {
      var diff = Math.ceil((next.dt - now) / 86400000);
      var urgency = diff <= 2 ? '#dc2626' : diff <= 14 ? '#ea580c' : diff <= 60 ? '#d97706' : '#6b7280';
      chip = '<span class="ddl-chip" style="background:' + urgency + '20;color:' + urgency + ';border-color:' + urgency + '40">'
           + next.label + ' · ' + (diff <= 0 ? 'Today!' : diff + 'd') + '</span>';
    } else if (c.deadlines.length && c.deadlines[0].date === null) {
      var isDk = localStorage.getItem('darkMode')==='true';
      chip = '<span class="ddl-chip" style="background:'+(isDk?'#21262d':'#f1f5f9')+';color:'+(isDk?'#8b949e':'#6b7280')+';border-color:'+(isDk?'#30363d':'#e2e8f0')+'">Submission TBA</span>';
    } else {
      var isDk2 = localStorage.getItem('darkMode')==='true';
      chip = '<span class="ddl-chip" style="background:'+(isDk2?'#122117':'#f0fdf4')+';color:'+(isDk2?'#3fb950':'#16a34a')+';border-color:'+(isDk2?'#1a7f45':'#bbf7d0')+'">Done ✓</span>';
    }

    var card = document.createElement('div');
    card.className = 'ddl-card';
    card.style.borderLeftColor = c.color;
    card.innerHTML = '<div class="ddl-top">'
      + '<span class="ddl-abbr" style="color:' + c.color + '">' + c.abbr + '</span>'
      + '<span class="ddl-type" style="background:' + c.color + '15;color:' + c.color + '">' + c.type + '</span>'
      + '</div>'
      + '<div class="ddl-name"><a href="' + c.url + '" target="_blank" rel="noopener noreferrer">' + c.name + '</a></div>'
      + '<div class="ddl-meta">📍 ' + c.location + ' &nbsp;·&nbsp; 🗓 ' + c.conf + '</div>'
      + chip;
    grid.appendChild(card);
  });
})();
