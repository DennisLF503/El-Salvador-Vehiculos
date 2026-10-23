var $=function(s){return document.querySelector(s)},dg=$('#dg');
var pg=document.body.getAttribute('data-page'),P=C[pg];
function alt(k){return (/^(Honda|Bajaj|Yamaha|Suzuki)$/.test(k)?'Moto ':'')+k}
function show(m){dg.innerHTML='<div class="dg"><div class="im"><img class="big" alt="'+alt(m[0])+'" src="'+F[m[0]]+'"></div><div class="tx"><h3>'+m[0]+'</h3><span class="tag">'+m[1]+'</span><h4>Sobre el vehículo</h4><p>'+m[2]+'</p><h4>Uso en El Salvador</h4><p>'+m[3]+'</p><button type="button" class="ghost" id="x">Cerrar</button></div></div>';dg.showModal();$('#x').onclick=function(){dg.close()}}
dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
if(P){document.querySelectorAll('.card.m[data-i]').forEach(function(b){b.onclick=function(){show(P.m[+b.getAttribute('data-i')])}})}
if(pg==='buscar'){
var nz=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
var BR={'La Tóxica 413':'Blue Bird','Volquetas':'Otros','Trailers':'Otros','Bicicletas':'Otros','Cuadrimoto':'Otros','Moto cruiser':'Otros'};var brand=function(n){return BR[n]||(/^Blue Bird/.test(n)?'Blue Bird':n.split(' ')[0])};
var L=[],q='',bf='Todas',res=$('#res'),ch=$('#chips'),inp=$('#q'),cnt=$('#cnt');
Object.keys(C).forEach(function(k){C[k].m.forEach(function(m){L.push({m:m,c:C[k].t,b:brand(m[0])})})});
var bs=['Todas'];L.forEach(function(x){if(bs.indexOf(x.b)<0)bs.push(x.b)});bs=['Todas'].concat(bs.slice(1).sort(function(p,q){return p==='Otros'?1:q==='Otros'?-1:p.localeCompare(q)}));
bs.forEach(function(b){var e=document.createElement('button');e.type='button';e.textContent=b;e.setAttribute('aria-pressed',b===bf);e.onclick=function(){bf=b;Array.prototype.forEach.call(ch.children,function(c){c.setAttribute('aria-pressed',c.textContent===bf)});draw()};ch.appendChild(e)});
function draw(){res.innerHTML='';var n=0;
L.forEach(function(x){if((bf==='Todas'||x.b===bf)&&nz(x.m[0]+' '+x.m[1]+' '+x.c).indexOf(q)>-1){n++;var e=document.createElement('button');e.type='button';e.className='card m';e.innerHTML='<div class="pw"><img class="ph'+(T[x.m[0]]?' ct':'')+'" alt="'+alt(x.m[0])+'" src="'+F[x.m[0]]+'"></div><h3>'+x.m[0]+'</h3><p>'+x.m[1]+'</p><span class="tag">'+x.c+'</span>';e.onclick=function(){show(x.m)};res.appendChild(e)}});
cnt.textContent=n?(n+(n===1?' vehículo':' vehículos')):'No hay vehículos con ese filtro. Prueba con otra marca o borra la búsqueda.'}
inp.addEventListener('input',function(){q=nz(inp.value.trim());draw()});draw()}

(function(){
var root=document.documentElement,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var SUN='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
/* Tema claro / oscuro */
var tg=document.getElementById('tg');
function paintTheme(){var light=root.dataset.theme==='light';if(tg){tg.innerHTML=light?MOON:SUN;tg.setAttribute('aria-label',light?'Cambiar a tema oscuro':'Cambiar a tema claro')}}
if(tg){paintTheme();tg.addEventListener('click',function(){var light=root.dataset.theme!=='light';if(light)root.dataset.theme='light';else delete root.dataset.theme;try{localStorage.setItem('theme',light?'light':'dark')}catch(e){}paintTheme()})}
/* Volver arriba */
var btt=document.createElement('button');btt.type='button';btt.className='top';btt.setAttribute('aria-label','Volver arriba');
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
var catPage=document.body.getAttribute('data-page');
var grid=document.querySelector('.page .grid');
if(C[catPage]&&grid){
 var nzc=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
 var sf=document.createElement('input');sf.type='search';sf.className='search';sf.placeholder='Buscar por marca o modelo';sf.setAttribute('aria-label','Buscar por marca o modelo');
 var empty=document.createElement('p');empty.className='lead';empty.textContent='No hay modelos con esa búsqueda. Prueba con otra marca.';empty.style.display='none';
 grid.parentNode.insertBefore(sf,grid);grid.parentNode.insertBefore(empty,grid.nextSibling);
 sf.addEventListener('input',function(){var q=nzc(sf.value.trim()),n=0;
  grid.querySelectorAll('.card.m').forEach(function(c){var ok=!q||nzc(c.textContent).indexOf(q)>-1;c.style.display=ok?'':'none';if(ok)n++});
  empty.style.display=n?'none':'';});
}
})();
