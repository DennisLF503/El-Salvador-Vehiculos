var $=function(s){return document.querySelector(s)},dg=$('#dg');
var pg=document.body.getAttribute('data-page'),P=C[pg];
var EN=document.documentElement.lang==='en';
var S=EN?{
 close:'Close',about:'About the vehicle',use:'Use in El Salvador',share:'Share on WhatsApp',
 wa:'Check out this vehicle on Autos SV: ',
 one:'vehicle',many:'vehicles',none:'No vehicles match this filter. Try another brand or clear the search.',
 moto:'Motorcycle ',searchPh:'Search by brand or model',noModels:'No models match your search. Try another brand.',
 toDark:'Switch to dark theme',toLight:'Switch to light theme',top:'Back to top',
 choose:'Choose a vehicle',vA:'Vehicle A',vB:'Vehicle B',cat:'Category',
 more:'More photos',pros:'Strengths',check:'What to check before buying',favOn:'Remove from favorites',favOff:'Save to favorites',print:'Print',favChip:'Favorites',favNone:'You have no favorites yet. Open a vehicle and tap \"Save to favorites\".',
 copyLink:'Copy link',copied:'Link copied',copyPrompt:'Copy this link:',
 notes:'My notes',notesPh:'Write what you think about this vehicle. It is saved only in this browser.',
 recent:'Recently viewed',
 asstRes:'Models that may suit you',asstIntro:'These are general suggestions based on your answers. Compare versions and read each vehicle page before deciding.',
 asstMix:'If you will drive on mixed roads, check on the vehicle page whether the version you want has 4x4 or AWD.',
 asstTierra:'For dirt roads, check 4x4 traction and ground clearance on the vehicle page, and ask a mechanic before deciding.',
 icsSummary:'Vehicle maintenance check',icsDesc:'Checklist: ',
 toastFavOn:'Saved to favorites',toastFavOff:'Removed from favorites',toastNote:'Note saved',toastIcs:'Reminder downloaded',
 statModels:'models in the catalog',statCats:'categories'
}:{
 close:'Cerrar',about:'Sobre el vehículo',use:'Uso en El Salvador',share:'Compartir por WhatsApp',
 wa:'Mira este vehículo en Autos SV: ',
 one:'vehículo',many:'vehículos',none:'No hay vehículos con ese filtro. Prueba con otra marca o borra la búsqueda.',
 moto:'Moto ',searchPh:'Buscar por marca o modelo',noModels:'No hay modelos con esa búsqueda. Prueba con otra marca.',
 toDark:'Cambiar a tema oscuro',toLight:'Cambiar a tema claro',top:'Volver arriba',
 choose:'Elige un vehículo',vA:'Vehículo A',vB:'Vehículo B',cat:'Categoría',
 more:'Más fotos',pros:'Ventajas',check:'Qué revisar antes de comprar',favOn:'Quitar de favoritos',favOff:'Guardar en favoritos',print:'Imprimir',favChip:'Favoritos',favNone:'Aún no tienes favoritos. Abre una ficha y toca \"Guardar en favoritos\".',
 copyLink:'Copiar enlace',copied:'Enlace copiado',copyPrompt:'Copia este enlace:',
 notes:'Mis notas',notesPh:'Escribe tu opinión sobre este vehículo. Se guarda solo en este navegador.',
 recent:'Vistos recientemente',
 asstRes:'Modelos que te pueden servir',asstIntro:'Son sugerencias generales según tus respuestas. Compara versiones y lee la ficha de cada vehículo antes de decidir.',
 asstMix:'Si vas a usar caminos mixtos, revisa en la ficha si la versión que te interesa tiene tracción 4x4 o AWD.',
 asstTierra:'Para caminos de tierra, revisa en la ficha la tracción 4x4 y la altura libre al suelo, y consulta con un mecánico antes de decidir.',
 icsSummary:'Revisión de mantenimiento del vehículo',icsDesc:'Revisar: ',
 toastFavOn:'Guardado en favoritos',toastFavOff:'Quitado de favoritos',toastNote:'Nota guardada',toastIcs:'Recordatorio descargado',
 statModels:'vehículos en el catálogo',statCats:'categorías'
};
/* Fotos adicionales por modelo: { 'Nombre del modelo': ['../img/archivo.jpg', ...] } */
var EXTRA_PHOTOS={};
/* Modelos recomendados por el asistente, según el uso principal */
var REC={
 ciudad:['Toyota Yaris','Kia Rio','Hyundai Accent','Nissan Sentra','Toyota Corolla'],
 familia:['Honda CR-V','Toyota RAV4','Hyundai Tucson','Kia Sportage','Toyota Corolla'],
 carga:['Toyota Hilux','Nissan Frontier','Isuzu D-Max','Mitsubishi L200','Hyundai H-100'],
 campo:['Toyota Hilux','Mitsubishi L200','Nissan Frontier','Suzuki Grand Vitara'],
 moto:['Honda','Yamaha','Bajaj','Hero Hunk 150'],
 grupo:['Toyota Hiace','Toyota Coaster','Blue Bird All American A3']
};
function alt(k){return (/^(Honda|Bajaj|Yamaha|Suzuki)$/.test(k)?S.moto:'')+k}
function detailHTML(m){
 var d=(typeof DET!=='undefined'?DET:{})[m[0]];
 if(!d)return '<h4>'+S.about+'</h4><p>'+m[2]+'</p><h4>'+S.use+'</h4><p>'+m[3]+'</p>';
 var li=function(t){return '<li>'+esc(t)+'</li>'};
 return '<h4>'+S.about+'</h4><p>'+d.a+'</p><h4>'+S.use+'</h4><p>'+d.u+'</p>'+
  '<h4>'+S.pros+'</h4><ul>'+d.v.map(li).join('')+'</ul>'+
  '<h4>'+S.check+'</h4><ul>'+d.r.map(li).join('')+'</ul>';
}
function getJSON(k,def){try{var v=JSON.parse(localStorage.getItem(k));return v===null?def:v}catch(e){return def}}
function saveJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function getFavs(){return getJSON('favs',[])}
function isFav(n){return getFavs().indexOf(n)>-1}
function toggleFav(n){var f=getFavs(),i=f.indexOf(n);if(i>-1)f.splice(i,1);else f.push(n);saveJSON('favs',f)}
function addRecent(n){var r=getJSON('vistos',[]).filter(function(x){return x!==n});r.unshift(n);saveJSON('vistos',r.slice(0,8))}
function getNotes(){return getJSON('notas',{})}
function findEntry(n){var f=null;Object.keys(C).forEach(function(k){C[k].m.forEach(function(m){if(!f&&m[0]===n)f={m:m,c:C[k].t}})});return f}
function shareUrl(n){return location.href.split('?')[0].split('#')[0]+'?m='+encodeURIComponent(n)}
function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})}
function show(m){
 var photos=[F[m[0]]].concat(EXTRA_PHOTOS[m[0]]||[]);
 var thumbs=photos.length>1?'<div class=\"thumbs\" role=\"group\" aria-label=\"'+S.more+'\">'+photos.map(function(p,i){return '<button type=\"button\" class=\"th\" data-src=\"'+p+'\" aria-label=\"'+S.more+' '+(i+1)+'\"><img src=\"'+p+'\" alt=\"\"></button>'}).join('')+'</div>':'';
 var wa='https://wa.me/?text='+encodeURIComponent(S.wa+m[0]+' - '+location.href.split('#')[0]);
 addRecent(m[0]);
 dg.innerHTML='<div class=\"dg\"><div class=\"im\"><img class=\"big\" id=\"bigimg\" alt=\"'+alt(m[0])+'\" src=\"'+photos[0]+'\"></div><div class=\"tx\"><h3>'+m[0]+'</h3><span class=\"tag\">'+m[1]+'</span>'+thumbs+''+detailHTML(m)+
  '<h4><label for=\"nt\">'+S.notes+'</label></h4><textarea id=\"nt\" class=\"notes\" rows=\"4\" placeholder=\"'+S.notesPh+'\"></textarea>'+
  '<div class=\"acts\"><a class=\"wa\" href=\"'+wa+'\" target=\"_blank\" rel=\"noopener\">'+S.share+'</a><button type=\"button\" class=\"ghost\" id=\"cl\">'+S.copyLink+'</button><button type=\"button\" class=\"ghost\" id=\"fv\" aria-pressed=\"false\"></button><button type=\"button\" class=\"ghost\" id=\"pr\">'+S.print+'</button><button type=\"button\" class=\"ghost\" id=\"x\">'+S.close+'</button></div></div></div>';
 dg.showModal();
 $('#x').onclick=function(){dg.close()};
 var fv=$('#fv');
 var paintFav=function(){var on=isFav(m[0]);fv.textContent=on?S.favOn:S.favOff;fv.setAttribute('aria-pressed',on?'true':'false')};
 fv.onclick=function(){toggleFav(m[0]);paintFav();toast(isFav(m[0])?S.toastFavOn:S.toastFavOff);if(pg==='buscar')draw()};
 paintFav();
 $('#pr').onclick=function(){window.print()};
 $('#cl').onclick=function(){
  var b=this,u=shareUrl(m[0]);
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){b.textContent=S.copied;toast(S.copied)},function(){window.prompt(S.copyPrompt,u)})}
  else window.prompt(S.copyPrompt,u);
 };
 var nt=$('#nt');
 nt.value=getNotes()[m[0]]||'';
 nt.oninput=function(){var o=getNotes();if(nt.value.trim())o[m[0]]=nt.value;else delete o[m[0]];saveJSON('notas',o)};
 nt.onchange=function(){toast(S.toastNote)};
 document.querySelectorAll('.th').forEach(function(b){b.onclick=function(){$('#bigimg').src=b.getAttribute('data-src')}});
 var im=dg.querySelector('.im'),tx0=null;
 im.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});
 im.addEventListener('touchend',function(e){if(tx0===null)return;var dx=e.changedTouches[0].clientX-tx0;tx0=null;if(Math.abs(dx)>50)cycle(dx<0?1:-1)},{passive:true});
}
function cycle(step){var ths=dg.querySelectorAll('.th');if(ths.length<2)return;var cur=$('#bigimg').getAttribute('src'),i=0;ths.forEach(function(b,k){if(b.getAttribute('data-src')===cur)i=k});ths[(i+step+ths.length)%ths.length].click()}
dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
document.addEventListener('keydown',function(e){if(!dg.hasAttribute('open'))return;if(e.key==='ArrowRight')cycle(1);if(e.key==='ArrowLeft')cycle(-1)});
dg.addEventListener('close',function(){if(pg==='buscar')renderRecent()});
if(P){document.querySelectorAll('.card.m[data-i]').forEach(function(b){b.onclick=function(){show(P.m[+b.getAttribute('data-i')])}})}

/* Vistos recientemente (página Buscar) */
function renderRecent(){
 var box=$('#vistos');if(!box)return;
 var names=getJSON('vistos',[]).filter(function(n){return findEntry(n)});
 box.innerHTML='';
 if(!names.length){box.hidden=true;return}
 box.hidden=false;
 var h=document.createElement('h3');h.textContent=S.recent;box.appendChild(h);
 var row=document.createElement('div');row.className='recrow';
 names.forEach(function(n){var f=findEntry(n);var b=document.createElement('button');b.type='button';b.className='rec';b.innerHTML='<img src=\"'+F[n]+'\" alt=\"\"><span>'+alt(n)+'</span>';b.onclick=function(){show(f.m)};row.appendChild(b)});
 box.appendChild(row);
}

/* Buscador general (página Buscar) */
if(pg==='buscar'){
var nz=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
var ALL=EN?'All':'Todas',OTHER=EN?'Other':'Otros';
var BR={'La Tóxica 413':'Blue Bird','Volquetas':OTHER,'Trailers':OTHER,'Bicicletas':OTHER,'Cuadrimoto':OTHER,'Moto cruiser':OTHER};
var brand=function(n){return BR[n]||(/^Blue Bird/.test(n)?'Blue Bird':n.split(' ')[0])};
function hl(text,q){
 if(!q)return esc(text);
 var map=[],norm='';
 for(var i=0;i<text.length;i++){var n=text[i].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');for(var j=0;j<n.length;j++){norm+=n[j];map.push(i)}}
 var at=norm.indexOf(q);
 if(at<0)return esc(text);
 var a=map[at],b=map[at+q.length-1]+1;
 return esc(text.slice(0,a))+'<mark>'+esc(text.slice(a,b))+'</mark>'+esc(text.slice(b));
}
var L=[],q='',bf=ALL,res=$('#res'),ch=$('#chips'),inp=$('#q'),cnt=$('#cnt'),so=$('#so');
Object.keys(C).forEach(function(k){C[k].m.forEach(function(m){L.push({m:m,c:C[k].t,b:brand(m[0])})})});
var bs=[ALL];L.forEach(function(x){if(bs.indexOf(x.b)<0)bs.push(x.b)});bs=[ALL].concat(bs.slice(1).sort(function(p,q){return p===OTHER?1:q===OTHER?-1:p.localeCompare(q)}));
bs.splice(1,0,S.favChip);
bs.forEach(function(b){var e=document.createElement('button');e.type='button';e.textContent=b;e.setAttribute('aria-pressed',b===bf);e.onclick=function(){bf=b;Array.prototype.forEach.call(ch.children,function(c){c.setAttribute('aria-pressed',c.textContent===bf)});draw()};ch.appendChild(e)});
function ordered(list){
 var v=so?so.value:'def';
 if(v==='az')return list.slice().sort(function(p,q){return p.m[0].localeCompare(q.m[0])});
 if(v==='brand')return list.slice().sort(function(p,q){return p.b.localeCompare(q.b)||p.m[0].localeCompare(q.m[0])});
 return list;
}
function draw(){res.innerHTML='';var n=0;
ordered(L).forEach(function(x){if((bf===ALL||(bf===S.favChip?isFav(x.m[0]):x.b===bf))&&nz(x.m[0]+' '+x.m[1]+' '+x.c).indexOf(q)>-1){n++;var e=document.createElement('button');e.type='button';e.className='card m';e.innerHTML='<div class=\"pw\"><img class=\"ph'+(T[x.m[0]]?' ct':'')+'\" alt=\"'+alt(x.m[0])+'\" src=\"'+F[x.m[0]]+'\"></div><h3>'+hl(x.m[0],q)+'</h3><p>'+x.m[1]+'</p><span class=\"tag\">'+x.c+'</span>';e.onclick=function(){show(x.m)};res.appendChild(e)}});
cnt.textContent=n?(n+' '+(n===1?S.one:S.many)):(bf===S.favChip?S.favNone:S.none)}
inp.addEventListener('input',function(){q=nz(inp.value.trim());draw()});
if(so)so.addEventListener('change',draw);
renderRecent();
draw();
}

/* Comparador de dos vehículos */
if(pg==='comparar'||pg==='compare'){
 var all=[];Object.keys(C).forEach(function(k){C[k].m.forEach(function(m,i){all.push({m:m,cat:C[k].t})})});
 var sa=$('#ca'),sb=$('#cb'),out=$('#cmp');
 all.forEach(function(x,idx){[sa,sb].forEach(function(s){var o=document.createElement('option');o.value=idx;o.textContent=x.m[0]+' ('+x.cat+')';s.appendChild(o)})});
 sa.value='0';sb.value='1';
 var card=function(x,label){return '<div class=\"card cmpc\"><p class=\"lbl\">'+label+'</p><div class=\"pw\"><img class=\"ph'+(T[x.m[0]]?' ct':'')+'\" alt=\"'+alt(x.m[0])+'\" src=\"'+F[x.m[0]]+'\"></div><h3>'+x.m[0]+'</h3><span class=\"tag\">'+x.cat+'</span><h4>'+S.cat+'</h4><p>'+x.m[1]+'</p>'+detailHTML(x.m)+'</div>'};
 var drawCmp=function(){out.innerHTML=card(all[+sa.value],S.vA)+card(all[+sb.value],S.vB)};
 sa.onchange=drawCmp;sb.onchange=drawCmp;drawCmp();
}

/* Asistente: ¿Qué auto me conviene? */
if(pg==='asistente'||pg==='assistant'){
 var asf=$('#asf'),asr=$('#asr');
 asf.addEventListener('submit',function(e){
  e.preventDefault();
  var uso=asf.elements.uso.value,terreno=asf.elements.terreno.value;
  var items=(REC[uso]||[]).map(findEntry).filter(Boolean);
  var h='<h2>'+S.asstRes+'</h2><p class=\"lead\">'+S.asstIntro+'</p>';
  var auto=['ciudad','familia','carga','campo'].indexOf(uso)>-1;
  if(auto&&terreno==='mixto')h+='<p class=\"note\">'+S.asstMix+'</p>';
  if(auto&&terreno==='tierra')h+='<p class=\"note\">'+S.asstTierra+'</p>';
  h+='<div class=\"grid\">'+items.map(function(x){return '<button type=\"button\" class=\"card m\" data-n=\"'+esc(x.m[0])+'\"><div class=\"pw\"><img class=\"ph'+(T[x.m[0]]?' ct':'')+'\" alt=\"'+alt(x.m[0])+'\" src=\"'+F[x.m[0]]+'\"></div><h3>'+x.m[0]+'</h3><p>'+x.m[1]+'</p><span class=\"tag\">'+x.c+'</span></button>'}).join('')+'</div>';
  asr.innerHTML=h;asr.hidden=false;
  asr.querySelectorAll('.card.m').forEach(function(c,k){c.style.setProperty('--i',k)});
  asr.querySelectorAll('.card.m').forEach(function(b){b.onclick=function(){var f=findEntry(b.getAttribute('data-n'));if(f)show(f.m)}});
  asr.scrollIntoView({behavior:'smooth',block:'start'});
 });
}

/* Recordatorio de mantenimiento (archivo de calendario .ics) */
if(pg==='mantenimiento'||pg==='maintenance'){
 var fd=$('#fd'),fi=$('#fi'),ics=$('#ics');
 var t=new Date(),pad=function(n){return (n<10?'0':'')+n};
 fd.value=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
 var esc2=function(s){return s.replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;')};
 ics.addEventListener('click',function(){
  if(!fd.value)return;
  var d=fd.value.replace(/-/g,''),n=+fi.value||6;
  var items=[].map.call(document.querySelectorAll('#chk li'),function(li){return li.textContent.trim()});
  var stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Autos SV//Mantenimiento//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT',
   'UID:autos-sv-'+stamp+'@dennislf503.github.io','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d,'RRULE:FREQ=MONTHLY;INTERVAL='+n,
   'SUMMARY:'+esc2(S.icsSummary),'DESCRIPTION:'+esc2(S.icsDesc+items.join('. ')+'.'),'END:VEVENT','END:VCALENDAR'];
  var blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=EN?'vehicle-maintenance.ics':'mantenimiento-autos-sv.ics';
  document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  toast(S.toastIcs);
 });
}

/* Tema claro / oscuro */
var root=document.documentElement,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var SUN='<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg>';
var MOON='<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z\"/></svg>';
var tg=document.getElementById('tg');
function paintTheme(){var light=root.dataset.theme==='light';if(tg){tg.innerHTML=light?MOON:SUN;tg.setAttribute('aria-label',light?S.toDark:S.toLight)}}
if(tg){paintTheme();tg.addEventListener('click',function(){var light=root.dataset.theme!=='light';if(light)root.dataset.theme='light';else delete root.dataset.theme;try{localStorage.setItem('theme',light?'light':'dark')}catch(e){}paintTheme()})}

/* Volver arriba */
var btt=document.createElement('button');btt.type='button';btt.className='top';btt.setAttribute('aria-label',S.top);
btt.innerHTML='<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 19V5M5 12l7-7 7 7\"/></svg>';
document.body.appendChild(btt);
btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
window.addEventListener('scroll',function(){btt.classList.toggle('on',window.scrollY>400)},{passive:true});

/* Animación de tarjetas al hacer scroll */
if(!reduce&&'IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
 document.querySelectorAll('.card').forEach(function(c){if(c.closest('dialog'))return;c.classList.add('rv');io.observe(c)});
}

/* Búsqueda por marca o modelo en las categorías */
var grid=document.querySelector('.page .grid');
if(P&&grid){
 var nzc=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
 var sf=document.createElement('input');sf.type='search';sf.className='search';sf.placeholder=S.searchPh;sf.setAttribute('aria-label',S.searchPh);
 var empty=document.createElement('p');empty.className='lead';empty.textContent=S.noModels;empty.style.display='none';
 grid.parentNode.insertBefore(sf,grid);grid.parentNode.insertBefore(empty,grid.nextSibling);
 sf.addEventListener('input',function(){var q=nzc(sf.value.trim()),n=0;
  grid.querySelectorAll('.card.m').forEach(function(c){var ok=!q||nzc(c.textContent).indexOf(q)>-1;c.style.display=ok?'':'none';if(ok)n++});
  empty.style.display=n?'none':'';});
}

/* Enlace directo: ?m=Nombre abre la ficha de ese vehículo */
(function(){
 var n=new URLSearchParams(location.search).get('m');
 if(!n)return;
 var f=findEntry(n);
 if(f)show(f.m);
})();

/* ===== Interfaz dinámica ===== */

/* Aviso breve que confirma acciones (favoritos, enlace copiado, nota guardada) */
var toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');
document.body.appendChild(toastEl);
var toastT=null;
function toast(msg){
 toastEl.textContent=msg;toastEl.classList.add('on');
 clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('on')},2200);
}

/* Barra de progreso de lectura */
var prog=document.createElement('div');prog.className='prog';prog.setAttribute('aria-hidden','true');
document.body.appendChild(prog);
var progRaf=0;
function paintProg(){
 var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
 prog.style.transform='scaleX('+(max>0?Math.min(1,window.scrollY/max):0)+')';
 progRaf=0;
}
window.addEventListener('scroll',function(){if(!progRaf)progRaf=requestAnimationFrame(paintProg)},{passive:true});
paintProg();

/* Inclinación 3D y luz que sigue el cursor en las tarjetas (solo con mouse y sin animaciones reducidas) */
var fine=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches;
if(fine&&!reduce){
 document.addEventListener('pointermove',function(e){
  var c=e.target.closest&&e.target.closest('.card.m');
  if(!c||c.closest('dialog'))return;
  var r=c.getBoundingClientRect();
  var x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  c.style.setProperty('--mx',(x*100)+'%');
  c.style.setProperty('--my',(y*100)+'%');
  c.style.setProperty('--ry',((x-.5)*10)+'deg');
  c.style.setProperty('--rx',((.5-y)*8)+'deg');
 });
 document.addEventListener('pointerout',function(e){
  var c=e.target.closest&&e.target.closest('.card.m');
  if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}
 });
}

/* Contadores animados en la portada */
var stats=document.querySelectorAll('[data-stat]');
if(stats.length){
 var total=0,cats=Object.keys(C).length;
 Object.keys(C).forEach(function(k){total+=C[k].m.length});
 var target={models:total,cats:cats};
 var countUp=function(el){
  var end=target[el.getAttribute('data-stat')]||0;
  if(reduce){el.textContent=end;return}
  var t0=null;
  var step=function(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1100);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
 };
 if('IntersectionObserver' in window){
  var so2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);so2.unobserve(e.target)}})},{threshold:.5});
  stats.forEach(function(el){so2.observe(el)});
 }else{stats.forEach(countUp)}
}

/* Fondo de la portada: fotos de vehículos que se alternan */
var heroSl=document.querySelector('.hero .slides');
if(heroSl){
 var HERO=['Toyota Hilux','Honda CR-V','Toyota Hiace','Kia Rio'];
 HERO.forEach(function(n,k){
  var im=document.createElement('img');im.src=F[n];im.alt='';im.setAttribute('aria-hidden','true');
  if(k===0)im.className='on';
  heroSl.appendChild(im);
 });
 if(!reduce){
  var slides=heroSl.querySelectorAll('img'),cur=0,timer=null;
  var go=function(){slides[cur].classList.remove('on');cur=(cur+1)%slides.length;slides[cur].classList.add('on')};
  var start=function(){if(!timer)timer=setInterval(go,4200)};
  var stop=function(){clearInterval(timer);timer=null};
  start();
  var hero=document.querySelector('.hero');
  hero.addEventListener('mouseenter',stop);
  hero.addEventListener('mouseleave',start);
 }
}

/* Atajo: la tecla / enfoca el buscador */
document.addEventListener('keydown',function(e){
 if(e.key!=='/'||e.ctrlKey||e.metaKey||e.altKey)return;
 var t=e.target,tag=t&&t.tagName;
 if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||(t&&t.isContentEditable)||dg.hasAttribute('open'))return;
 var s=document.querySelector('input[type=search]');
 if(!s)return;
 e.preventDefault();s.focus();
});
