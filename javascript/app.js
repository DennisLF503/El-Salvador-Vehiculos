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
 more:'More photos'
}:{
 close:'Cerrar',about:'Sobre el vehículo',use:'Uso en El Salvador',share:'Compartir por WhatsApp',
 wa:'Mira este vehículo en Autos SV: ',
 one:'vehículo',many:'vehículos',none:'No hay vehículos con ese filtro. Prueba con otra marca o borra la búsqueda.',
 moto:'Moto ',searchPh:'Buscar por marca o modelo',noModels:'No hay modelos con esa búsqueda. Prueba con otra marca.',
 toDark:'Cambiar a tema oscuro',toLight:'Cambiar a tema claro',top:'Volver arriba',
 choose:'Elige un vehículo',vA:'Vehículo A',vB:'Vehículo B',cat:'Categoría',
 more:'Más fotos'
};
/* Fotos adicionales por modelo: { 'Nombre del modelo': ['../img/archivo.jpg', ...] } */
var EXTRA_PHOTOS={};
function alt(k){return (/^(Honda|Bajaj|Yamaha|Suzuki)$/.test(k)?S.moto:'')+k}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function show(m){
 var photos=[F[m[0]]].concat(EXTRA_PHOTOS[m[0]]||[]);
 var thumbs=photos.length>1?'<div class="thumbs" role="group" aria-label="'+S.more+'">'+photos.map(function(p,i){return '<button type="button" class="th" data-src="'+p+'" aria-label="'+S.more+' '+(i+1)+'"><img src="'+p+'" alt=""></button>'}).join('')+'</div>':'';
 var wa='https://wa.me/?text='+encodeURIComponent(S.wa+m[0]+' - '+location.href.split('#')[0]);
 dg.innerHTML='<div class="dg"><div class="im"><img class="big" id="bigimg" alt="'+alt(m[0])+'" src="'+photos[0]+'"></div><div class="tx"><h3>'+m[0]+'</h3><span class="tag">'+m[1]+'</span>'+thumbs+'<h4>'+S.about+'</h4><p>'+m[2]+'</p><h4>'+S.use+'</h4><p>'+m[3]+'</p><div class="acts"><a class="wa" href="'+wa+'" target="_blank" rel="noopener">'+S.share+'</a><button type="button" class="ghost" id="x">'+S.close+'</button></div></div></div>';
 dg.showModal();
 $('#x').onclick=function(){dg.close()};
 document.querySelectorAll('.th').forEach(function(b){b.onclick=function(){$('#bigimg').src=b.getAttribute('data-src')}});
}
dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
if(P){document.querySelectorAll('.card.m[data-i]').forEach(function(b){b.onclick=function(){show(P.m[+b.getAttribute('data-i')])}})}

/* Buscador general (página Buscar) */
if(pg==='buscar'){
var nz=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
var ALL=EN?'All':'Todas',OTHER=EN?'Other':'Otros';
var BR={'La Tóxica 413':'Blue Bird','Volquetas':OTHER,'Trailers':OTHER,'Bicicletas':OTHER,'Cuadrimoto':OTHER,'Moto cruiser':OTHER};
var brand=function(n){return BR[n]||(/^Blue Bird/.test(n)?'Blue Bird':n.split(' ')[0])};
var L=[],q='',bf=ALL,res=$('#res'),ch=$('#chips'),inp=$('#q'),cnt=$('#cnt');
Object.keys(C).forEach(function(k){C[k].m.forEach(function(m){L.push({m:m,c:C[k].t,b:brand(m[0])})})});
var bs=[ALL];L.forEach(function(x){if(bs.indexOf(x.b)<0)bs.push(x.b)});bs=[ALL].concat(bs.slice(1).sort(function(p,q){return p===OTHER?1:q===OTHER?-1:p.localeCompare(q)}));
bs.forEach(function(b){var e=document.createElement('button');e.type='button';e.textContent=b;e.setAttribute('aria-pressed',b===bf);e.onclick=function(){bf=b;Array.prototype.forEach.call(ch.children,function(c){c.setAttribute('aria-pressed',c.textContent===bf)});draw()};ch.appendChild(e)});
function draw(){res.innerHTML='';var n=0;
L.forEach(function(x){if((bf===ALL||x.b===bf)&&nz(x.m[0]+' '+x.m[1]+' '+x.c).indexOf(q)>-1){n++;var e=document.createElement('button');e.type='button';e.className='card m';e.innerHTML='<div class="pw"><img class="ph'+(T[x.m[0]]?' ct':'')+'" alt="'+alt(x.m[0])+'" src="'+F[x.m[0]]+'"></div><h3>'+x.m[0]+'</h3><p>'+x.m[1]+'</p><span class="tag">'+x.c+'</span>';e.onclick=function(){show(x.m)};res.appendChild(e)}});
cnt.textContent=n?(n+' '+(n===1?S.one:S.many)):S.none}
inp.addEventListener('input',function(){q=nz(inp.value.trim());draw()});draw()}

/* Comparador de dos vehículos */
if(pg==='comparar'||pg==='compare'){
 var all=[];Object.keys(C).forEach(function(k){C[k].m.forEach(function(m,i){all.push({m:m,cat:C[k].t})})});
 var sa=$('#ca'),sb=$('#cb'),out=$('#cmp');
 all.forEach(function(x,idx){[sa,sb].forEach(function(s){var o=document.createElement('option');o.value=idx;o.textContent=x.m[0]+' ('+x.cat+')';s.appendChild(o)})});
 sa.value='0';sb.value='1';
 var card=function(x,label){return '<div class="card cmpc"><p class="lbl">'+label+'</p><div class="pw"><img class="ph'+(T[x.m[0]]?' ct':'')+'" alt="'+alt(x.m[0])+'" src="'+F[x.m[0]]+'"></div><h3>'+x.m[0]+'</h3><span class="tag">'+x.cat+'</span><h4>'+S.cat+'</h4><p>'+x.m[1]+'</p><h4>'+S.about+'</h4><p>'+x.m[2]+'</p><h4>'+S.use+'</h4><p>'+x.m[3]+'</p></div>'};
 var drawCmp=function(){out.innerHTML=card(all[+sa.value],S.vA)+card(all[+sb.value],S.vB)};
 sa.onchange=drawCmp;sb.onchange=drawCmp;drawCmp();
}

/* Tema claro / oscuro */
var root=document.documentElement,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var SUN='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
var tg=document.getElementById('tg');
function paintTheme(){var light=root.dataset.theme==='light';if(tg){tg.innerHTML=light?MOON:SUN;tg.setAttribute('aria-label',light?S.toDark:S.toLight)}}
if(tg){paintTheme();tg.addEventListener('click',function(){var light=root.dataset.theme!=='light';if(light)root.dataset.theme='light';else delete root.dataset.theme;try{localStorage.setItem('theme',light?'light':'dark')}catch(e){}paintTheme()})}

/* Volver arriba */
var btt=document.createElement('button');btt.type='button';btt.className='top';btt.setAttribute('aria-label',S.top);
btt.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
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
