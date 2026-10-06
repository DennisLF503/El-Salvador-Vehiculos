var $=function(s){return document.querySelector(s)},dg=$('#dg');
var pg=document.body.getAttribute('data-page'),P=C[pg];
function alt(k){return (/^(Honda|Bajaj|Yamaha|Suzuki)$/.test(k)?'Moto ':'')+k}
function show(m){dg.innerHTML='<div class="dg"><div class="im"><img class="big" alt="'+alt(m[0])+'" src="'+F[m[0]]+'"></div><div class="tx"><h3>'+m[0]+'</h3><span class="tag">'+m[1]+'</span><h4>Sobre el vehículo</h4><p>'+m[2]+'</p><h4>Uso en El Salvador</h4><p>'+m[3]+'</p><button type="button" class="ghost" id="x">Cerrar</button></div></div>';dg.showModal();$('#x').onclick=function(){dg.close()}}
dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
if(P){document.querySelectorAll('.card.m[data-i]').forEach(function(b){b.onclick=function(){show(P.m[+b.getAttribute('data-i')])}})}
if(pg==='buscar'){
var nz=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
var brand=function(n){return /^Blue Bird/.test(n)?'Blue Bird':n.split(' ')[0]};
var L=[],q='',bf='Todas',res=$('#res'),ch=$('#chips'),inp=$('#q'),cnt=$('#cnt');
Object.keys(C).forEach(function(k){C[k].m.forEach(function(m){L.push({m:m,c:C[k].t,b:brand(m[0])})})});
var bs=['Todas'];L.forEach(function(x){if(bs.indexOf(x.b)<0)bs.push(x.b)});bs=['Todas'].concat(bs.slice(1).sort());
bs.forEach(function(b){var e=document.createElement('button');e.type='button';e.textContent=b;e.setAttribute('aria-pressed',b===bf);e.onclick=function(){bf=b;Array.prototype.forEach.call(ch.children,function(c){c.setAttribute('aria-pressed',c.textContent===bf)});draw()};ch.appendChild(e)});
function draw(){res.innerHTML='';var n=0;
L.forEach(function(x){if((bf==='Todas'||x.b===bf)&&nz(x.m[0]+' '+x.m[1]+' '+x.c).indexOf(q)>-1){n++;var e=document.createElement('button');e.type='button';e.className='card m';e.innerHTML='<div class="pw"><img class="ph" alt="'+alt(x.m[0])+'" src="'+F[x.m[0]]+'"></div><h3>'+x.m[0]+'</h3><p>'+x.m[1]+'</p><span class="tag">'+x.c+'</span>';e.onclick=function(){show(x.m)};res.appendChild(e)}});
cnt.textContent=n?(n+(n===1?' vehículo':' vehículos')):'No hay vehículos con ese filtro. Prueba con otra marca o borra la búsqueda.'}
inp.addEventListener('input',function(){q=nz(inp.value.trim());draw()});draw()}
