
/* FORMA 2.0 — deterministic, offline SVG illustration engine.
 * No external images, fonts, APIs or libraries. Recipes are data, never executable code.
 */
(() => {
'use strict';
// 1. Configuration and native SVG primitives.
const VERSION='2.0.0', SCHEMA='forma.asset-catalog/2.0';
const NS='http://www.w3.org/2000/svg';
const DEFAULT_PALETTE={ink:'#383349',rust:'#F5A6A0',gold:'#F9D98C',teal:'#87CEC5',paper:'#FFF9F5',sage:'#BCD5A4',skin:'#E7B595',blue:'#B9A9DF'};
const PALETTES={
 editorial:DEFAULT_PALETTE,
 aurora:{ink:'#39324F',rust:'#ECAECC',gold:'#F4D59B',teal:'#A0D7CE',paper:'#FCF6FF',sage:'#C7D8B3',skin:'#E7B595',blue:'#B2ACEE'},
 jardin:{ink:'#344D49',rust:'#EEB9A5',gold:'#F3DCA0',teal:'#86CBB3',paper:'#F5FCF5',sage:'#C4D997',skin:'#E7B595',blue:'#B1C5DC'},
 melocoton:{ink:'#59404F',rust:'#F3A693',gold:'#F4CB87',teal:'#A9D6CF',paper:'#FFF8F1',sage:'#CAD6AA',skin:'#E7B595',blue:'#CDB7DF'},
 oceano:{ink:'#35475F',rust:'#F0B4B5',gold:'#F1DBA6',teal:'#99D2D3',paper:'#F7FBFF',sage:'#BFDDCD',skin:'#E7B595',blue:'#A7BDEC'},
 caramelo:{ink:'#513753',rust:'#EF98B0',gold:'#F7D58D',teal:'#8ED4CE',paper:'#FFF6FB',sage:'#C1DFA5',skin:'#E7B595',blue:'#BAA3E5'}
};
const categories=[
 {key:'paisajes',label:'Paisajes',expected:500,code:'PA',subtitle:'Territorios y naturaleza'},
 {key:'objetos',label:'Objetos',expected:1200,code:'OB',subtitle:'Lo cotidiano, dibujado'},
 {key:'personas',label:'Personas y personajes',expected:650,code:'PE',subtitle:'Gestos que cuentan historias'},
 {key:'escenarios',label:'Escenarios y ambientes',expected:500,code:'ES',subtitle:'Lugares para tus historias'},
 {key:'animales',label:'Animales',expected:550,code:'AN',subtitle:'Un mundo de criaturas'},
 {key:'simbolos',label:'Símbolos e iconografía',expected:700,code:'SI',subtitle:'Ideas en una imagen'},
 {key:'bocadillos',label:'Bocadillos de diálogo',expected:250,code:'DI',subtitle:'Conversación con carácter'},
 {key:'animaciones',label:'Animaciones',expected:300,code:'AM',subtitle:'Acciones, no diapositivas'},
 {key:'efectos',label:'Efectos visuales',expected:350,code:'FX',subtitle:'Atmósfera y movimiento'},
 {key:'interfaz',label:'Elementos de interfaz',expected:250,code:'UI',subtitle:'Controles ilustrados'},
 {key:'decoracion',label:'Decoración y gráficos',expected:250,code:'DE',subtitle:'El detalle que lo une todo'}
];
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const slug=s=>normalize(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const n=x=>Number(Number(x).toFixed(3));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let x=seed>>>0;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};}
const attrs=o=>Object.entries(o).filter(([,v])=>v!==null&&v!==undefined).map(([k,v])=>' '+k+'="'+esc(v)+'"').join('');
const tag=(k,o={},c='')=>'<'+k+attrs(o)+'>'+c+'</'+k+'>';
const R=(x,y,w,h,f,rx=0,more={})=>tag('rect',{x:n(x),y:n(y),width:n(w),height:n(h),rx:n(rx),fill:f,...more});
const C=(x,y,r,f,more={})=>tag('circle',{cx:n(x),cy:n(y),r:n(r),fill:f,...more});
const E=(x,y,rx,ry,f,more={})=>tag('ellipse',{cx:n(x),cy:n(y),rx:n(rx),ry:n(ry),fill:f,...more});
const P=(d,f='none',s=null,sw=2,more={})=>tag('path',{d,fill:f,stroke:s,'stroke-width':s?sw:null,'stroke-linecap':s?'round':null,'stroke-linejoin':s?'round':null,...more});
const L=(x1,y1,x2,y2,s,sw=2,more={})=>tag('line',{x1:n(x1),y1:n(y1),x2:n(x2),y2:n(y2),stroke:s,'stroke-width':sw,'stroke-linecap':'round',...more});
const Poly=(pts,f,s=null,sw=2)=>tag('polygon',{points:pts.map(q=>q.map(n).join(',')).join(' '),fill:f,stroke:s,'stroke-width':s?sw:null,'stroke-linejoin':'round'});
const G=(s,t='',more={})=>tag('g',{transform:t||null,...more},s);
const T=(s,x,y,size=14,f=DEFAULT_PALETTE.ink,more={})=>tag('text',{x,y,fill:f,'font-family':'Arial, Helvetica, sans-serif','font-size':size,...more},esc(s));
function star(x,y,r,points=4,ratio=.35,f=DEFAULT_PALETTE.gold,rot=-Math.PI/2){let p=[];for(let i=0;i<points*2;i++){let a=rot+i*Math.PI/points,rr=i%2?r*ratio:r;p.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}return Poly(p,f);}
function arc(x,y,rx,ry,a,b){return 'M'+n(x+rx*Math.cos(a))+' '+n(y+ry*Math.sin(a))+' A'+rx+' '+ry+' 0 '+(b-a>Math.PI?1:0)+' 1 '+n(x+rx*Math.cos(b))+' '+n(y+ry*Math.sin(b));}
function leaf(x,y,s,p,angle=0,type=0){const d=type%3===0?'M0 0 Q-22 -27 0 -65 Q22 -25 0 0':type%3===1?'M0 0 L-17 -32 L0 -70 L20 -32 Z':'M0 0 C-45 -12 -24 -57 0 -66 C30 -45 32 -11 0 0';return G(P(d,p)+L(0,0,0,-52,DEFAULT_PALETTE.ink,1),`translate(${n(x)} ${n(y)}) rotate(${angle}) scale(${s})`);}
function plant(x,y,s,p,kind=0){let a='';if(kind===0){a=R(-13,0,26,27,p.rust,2)+P('M-13 2 L13 2 L9 27 L-9 27 Z',p.rust);for(let i=0;i<5;i++)a+=leaf(0,1,0.8,p.sage,(i-2)*27,i);}else if(kind===1){a=P('M0 20 L0 -30 M0 -8 L-18 -8 L-18 -35 M0 -1 L18 -1 L18 -20','none',p.teal,11)+R(-17,19,34,24,p.gold);}else{a=P('M0 20 Q-3 -14 8 -62','none',p.ink,2);for(let i=0;i<5;i++)a+=leaf(i%2?4:0,12-i*12,.5,i%2?p.teal:p.sage,i%2?65:-65,2);a=R(-12,16,25,23,p.gold)+a;}return G(a,`translate(${x} ${y}) scale(${s})`);}
function tree(x,y,s,p,type=0){let a='';if(type%5===0){a=R(-3,-70,6,75,p.ink)+Poly([[-34,-20],[0,-117],[34,-20]],p.teal)+Poly([[-28,-49],[0,-132],[28,-49]],p.sage);}else if(type%5===1){a=R(-3,-78,6,81,p.ink)+E(0,-79,35,54,p.sage)+P('M0 0 L0 -110 M0 -43 L-18 -60 M0 -63 L17 -78','none',p.ink,2);}else if(type%5===2){a=P('M-5 4 Q1 -64 15 -102 L20 -100 Q9 -39 5 4Z',p.ink);for(let i=0;i<6;i++)a+=leaf(17,-100,.85,p.teal,-115+i*45,2);}else if(type%5===3){a=P('M-4 3 L-1 -81 L4 -81 L4 3 Z',p.ink)+C(-20,-77,26,p.rust)+C(10,-95,31,p.gold)+C(24,-60,25,p.rust)+P('M0 -15 L0 -95 M0 -39 L-18 -67 M0 -62 L20 -78','none',p.ink,2);}else{a=P('M-5 3 L1 -92 L6 -92 L6 3Z',p.ink)+E(0,-98,18,33,p.teal)+E(-22,-73,22,18,p.sage)+E(20,-63,23,18,p.teal)+P('M0 -25 L-20 -60 M0 -37 L23 -59','none',p.ink,3);}return G(a,`translate(${n(x)} ${n(y)}) scale(${n(s)})`);}
function cloud(x,y,s,p,variant=0){let d=variant%2?'M-40 8 Q-53 -12 -28 -20 Q-30 -46 -5 -41 Q10 -57 27 -34 Q58 -35 55 -10 Q74 4 50 13Z':'M-43 12 Q-60 -4 -36 -21 Q-38 -41 -14 -34 Q-4 -57 20 -35 Q51 -41 48 -14 Q78 -7 60 12Z';return G(P(d,p),`translate(${x} ${y}) scale(${s})`);}
function wheel(x,y,r,p,spokes=4){let a=C(x,y,r,p.ink)+C(x,y,r*.65,p.paper);for(let i=0;i<spokes;i++){let t=i*2*Math.PI/spokes;a+=L(x,y,x+Math.cos(t)*r*.59,y+Math.sin(t)*r*.59,p.ink,1.7);}return a+C(x,y,2.3,p.rust);}
function paper(x,y,w,h,p,fold=false){let a=fold?P(`M${x} ${y} H${x+w-12} L${x+w} ${y+12} V${y+h} H${x}Z`,p.paper,p.ink,1.4):R(x,y,w,h,p.paper,1,{stroke:p.ink,'stroke-width':1.2});if(fold)a+=P(`M${x+w-12} ${y} V${y+12} H${x+w}`,p.gold,p.ink,1);for(let i=0;i<3;i++)a+=L(x+7,y+17+i*8,x+w-8-(i===2?9:0),y+17+i*8,p.teal,1.4);return a;}
// SMIL is fully embedded in exported SVGs. A static poster is generated independently.
function animTag(attribute,values,o,dur=4,more={}){return o.animate?tag('animate',{attributeName:attribute,values:values.join(';'),dur:dur+'s',repeatCount:'indefinite',...more}):'';}
function sampleValues(values,t,more={}){
 const times=more.keyTimes?more.keyTimes.split(';').map(Number):values.map((_,i)=>i/(values.length-1));
 const tt=clamp(t,0,.99999);let at=0;while(at<times.length-2 && tt>times[at+1])at++;
 const u=(tt-times[at])/Math.max(.00001,times[at+1]-times[at]);
 const a=String(values[at]).trim().split(/[ ,]+/).map(Number),b=String(values[at+1]??values[at]).trim().split(/[ ,]+/).map(Number);
 if(a.length!==b.length||a.some(x=>!Number.isFinite(x))||b.some(x=>!Number.isFinite(x)))return values[at];
 return a.map((x,i)=>n(x+(b[i]-x)*u)).join(' ');
}
function motion(content,values,o,type='translate',dur=4,more={}){
 const start=o.animate?values[0]:sampleValues(values,o.poster??.42,more);
 return tag('g',{transform:type+'('+start+')'},content+(o.animate?tag('animateTransform',{attributeName:'transform',type,values:values.join(';'),dur:dur+'s',repeatCount:'indefinite',...more}):''));
}
function fade(content,values,o,dur=4,more={}){
 return tag('g',{opacity:o.animate?values[0]:sampleValues(values,o.poster??.42,more)},content+animTag('opacity',values,o,dur,more));
}

// 2. Taxonomy. Each family has a specialized structural recipe, not a recolor series.
const OBJECT_GROUPS=[
 ['Hogar y cocina','taza:Taza|tetera:Tetera|cafetera:Cafetera|tostadora:Tostadora|licuadora:Licuadora|olla:Olla|sarten:Sartén|horno:Horno|nevera:Frigorífico|tarro:Tarro|botella:Botella|cubiertos:Cubiertos|platos:Vajilla|tabla:Tabla de cocina|batidor:Batidor|exprimidor:Exprimidor|mortero:Mortero|cesta:Cesta|lampara:Lámpara|reloj:Reloj de mesa'],
 ['Oficina y tecnología','libro:Libro|cuaderno:Cuaderno|periodico:Periódico|sobre:Sobre postal|pluma:Pluma estilográfica|lapices:Organizador de lápices|maquina:Máquina de escribir|archivador:Archivador|escritorio:Escritorio|silla:Silla|ordenador:Ordenador de escritorio|portatil:Ordenador portátil|telefono:Teléfono|camara:Cámara|radio:Radio|televisor:Televisor|auriculares:Auriculares|microfono:Micrófono|altavoz:Altavoz|proyector:Proyector'],
 ['Transporte','bicicleta:Bicicleta|automovil:Automóvil|autobus:Autobús|camion:Camión|tren:Tren|tranvia:Tranvía|barco:Barco|velero:Velero|avion:Avión|helicoptero:Helicóptero'],
 ['Instrumentos musicales','guitarra:Guitarra|piano:Piano|trompeta:Trompeta|contrabajo:Contrabajo|violin:Violín|bateria:Batería|saxofon:Saxofón|flauta:Flauta|acordeon:Acordeón|maracas:Maracas'],
 ['Herramientas','martillo:Martillo|destornillador:Destornillador|llave:Llave de taller|alicates:Alicates|sierra:Sierra|taladro:Taladro|herramientas:Caja de herramientas|carretilla:Carretilla|escalera:Escalera|pala:Pala'],
 ['Ciencia','microscopio:Microscopio|telescopio:Telescopio|matraz:Matraz|tubos:Tubos de ensayo|balanza:Balanza|globo:Globo terráqueo|brujula:Brújula|iman:Imán|molecula:Modelo molecular|satelite:Satélite'],
 ['Alimentos','manzana:Manzana|pera:Pera|pan:Pan|queso:Queso|pastel:Pastel|helado:Helado|verduras:Verduras|cereal:Caja de cereal|bocadillo:Bocadillo|frutero:Frutero'],
 ['Ropa y accesorios','sombrero:Sombrero|gafas:Gafas|mochila:Mochila|maleta:Maleta|paraguas:Paraguas|abrigo:Abrigo|zapatos:Zapatos|bufanda:Bufanda|pulsera:Reloj de pulsera|bolsa:Bolsa'],
 ['Muebles y exteriores','sofa:Sofá|sillon:Sillón|cama:Cama|estanteria:Estantería|banco:Banco|maceta:Maceta|regadera:Regadera|farola:Farola|buzon:Buzón|quiosco:Quiosco'],
 ['Deporte y aventura','balon:Balón|raqueta:Raqueta|patines:Patines|patinete:Patinete|cometa:Cometa|tienda:Tienda de campaña|cofre:Cofre fantástico|llave-ornamental:Llave ornamental|linterna:Linterna|pergamino:Pergamino']
];
const OBJECTS=OBJECT_GROUPS.flatMap(([group,list])=>list.split('|').map(t=>{const [key,label]=t.split(':');return {key,label,group};}));
const LANDS=[
 ['alpino','Cordillera alpina','Montaña',0],['pinar','Valle de pinos','Bosque',0],['abedules','Bosque de abedules','Bosque',4],['costa','Costa rocosa','Costa',1],['playa','Playa de dunas','Costa',2],['desierto','Desierto de arcos','Desierto',1],['oasis','Oasis','Desierto',2],['lago','Lago entre montañas','Agua',0],['rio','Río en meandros','Agua',1],['cascada','Cascada escalonada','Agua',2],['isla','Isla tropical','Costa',3],['pantano','Pantano de juncos','Humedal',0],['glaciar','Fiordo glaciar','Polar',0],['volcan','Entorno volcánico','Volcánico',0],['campos','Colinas agrícolas','Rural',0],['sabana','Sabana','Pradera',0],['jungla','Selva tropical','Bosque',2],['canon','Cañón de estratos','Desierto',3],['tundra','Tundra','Polar',1],['acantilado','Acantilados','Costa',4],['otono','Bosque otoñal','Bosque',3],['manglar','Manglar','Humedal',1],['archipielago','Archipiélago','Costa',5],['lunar','Paisaje lunar','Fantástico',0],['flotante','Islas flotantes','Fantástico',1]
].map(([key,label,group,type])=>({key,label,group,type}));
const PEOPLE=[
 ['narrador','Narrador','Comunicación','microfono',0],['investigadora','Investigadora','Ciencia','libro',1],['periodista','Periodista','Comunicación','cuaderno',0],['cocinera','Cocinera','Oficios','sarten',1],['docente','Docente','Educación','libro',1],['medico','Profesional de medicina','Salud','maleta',0],['ingeniera','Ingeniera','Ciencia','pluma',1],['panadera','Panadera','Oficios','pan',1],['agricultor','Agricultor','Oficios','pala',0],['carpintera','Carpintera','Oficios','martillo',1],['musico','Músico','Cultura','guitarra',0],['bibliotecaria','Bibliotecaria','Cultura','libro',1],['bombero','Bombero','Oficios','linterna',0],['astronauta','Astronauta','Ciencia','satelite',1],['cartero','Cartero','Oficios','sobre',0],['fotografa','Fotógrafa','Cultura','camara',1],['abuela','Abuela','Comunidad','bolsa',1],['abuelo','Abuelo','Comunidad','periodico',0],['adolescente','Adolescente','Comunidad','mochila',1],['nina','Niña','Infancia','cometa',1],['nino','Niño','Infancia','balon',0],['cientifica','Científica','Ciencia','matraz',1],['viajero','Viajero','Comunidad','maleta',0],['deportista','Deportista','Deporte','raqueta',1],['vendedora','Vendedora','Oficios','cereal',1],['vecino','Vecino','Comunidad','taza',0]
].map(([key,label,group,prop,hair],i)=>({key,label,group,prop,hair,body:i%5,age:['nina','nino'].includes(key)?'infancia':['abuela','abuelo'].includes(key)?'mayor':'adulta'}));
const POSES=[
 ['saludando','Saludo abierto',[67,143,60,95],[158,151,164,120],[96,238,91,290],[132,242,150,290]],
 ['explicando','Explicación con palma',[67,159,44,138],[160,149,185,131],[97,244,85,290],[138,240,151,290]],
 ['senalando','Señalando un hallazgo',[74,172,83,193],[167,125,197,106],[99,245,96,290],[135,240,149,290]],
 ['leyendo','Lectura atenta',[73,159,105,169],[157,160,131,169],[99,240,99,290],[135,240,145,290]],
 ['escribiendo','Anotando una idea',[70,172,102,181],[158,160,124,177],[94,240,84,290],[135,247,143,290]],
 ['caminando','Paso hacia adelante',[73,152,70,184],[164,161,182,179],[84,244,65,286],[143,242,165,285]],
 ['agachado','Explorando a baja altura',[66,177,72,203],[163,177,169,205],[73,216,53,269],[155,220,163,270]],
 ['corriendo','Carrera en movimiento',[70,135,57,110],[163,152,147,173],[77,233,48,253],[155,231,178,211]],
 ['sentado','Conversación sentada',[76,157,78,191],[161,147,182,159],[75,224,81,283],[151,225,156,282]],
 ['escuchando','Escucha activa',[76,170,101,183],[157,155,143,117],[100,242,89,290],[138,244,153,290]],
 ['pensando','Reflexión',[72,168,114,177],[157,153,135,109],[95,244,92,290],[133,245,150,289]],
 ['celebrando','Celebración',[70,108,62,77],[159,106,166, 74],[98,241,82,290],[137,242,155,290]],
 ['transportando','Transporte de materiales',[64,168,69,196],[169,169,174,199],[91,240,84,290],[144,238,154,290]],
 ['presentando','Presentación a dos manos',[69,137,44,116],[165,139,193,116],[100,242,91,290],[136,243,151,290]],
 ['alcanzando','Alcanzando un objeto',[70,167,67,191],[145,103,151,61],[101,244,99,290],[136,243,148,290]],
 ['brazos-cruzados','Postura reflexiva',[72,157,140,174],[159,161,90,171],[99,246,97,290],[133,244,145,290]],
 ['telefono','Llamada',[70,164,66,191],[160,122,142,98],[95,245,91,290],[140,244,155,290]],
 ['trabajando','Trabajo manual',[73,161,112,195],[155,155,135,187],[95,236,77,287],[145,236,163,287]],
 ['inclinado','Observación cercana',[66,165,57,195],[163,164,177,191],[91,241,80,290],[143,241,158,290]],
 ['ofreciendo','Ofreciendo ayuda',[70,173,78,195],[165,153,194,159],[101,242,92,290],[135,242,149,290]],
 ['hora','Consultando la hora',[75,158,130,168],[157,157,135,168],[100,244,87,290],[136,244,148,290]],
 ['aplaudiendo','Aplauso',[80,140,115,129],[151,143,122,130],[98,242,91,290],[136,242,150,290]],
 ['gafas','Ajustando las gafas',[70,162,69,191],[160,124,139,95],[96,242,88,290],[135,241,149,290]],
 ['arrodillado','Tarea de precisión',[69,164,75,191],[161,164,178,178],[78,222,78,277],[151,250,178,256]],
 ['bienvenida','Dando la bienvenida',[59,141,36,135],[177,141,202,135],[97,242,81,290],[140,242,157,290]]
];
const SCENES=[
 ['estudio','Estudio de narración','Comunicación',['microfono','sillon','lampara','radio']],['investigacion','Mesa de investigación','Trabajo',['escritorio','libro','portatil','lampara']],['mercado','Supermercado','Comercio',['cereal','cesta','botella','frutero']],['cocina','Cocina','Hogar',['horno','nevera','olla','tetera']],['comedor','Comedor','Hogar',['escritorio','silla','platos','lampara']],['salon','Sala de estar','Hogar',['sofa','sillon','lampara','libro']],['dormitorio','Dormitorio','Hogar',['cama','lampara','reloj','cuaderno']],['oficina','Oficina','Trabajo',['escritorio','silla','ordenador','archivador']],['aula','Aula','Educación',['escritorio','libro','globo','mochila']],['biblioteca','Biblioteca','Educación',['estanteria','libro','silla','lampara']],['laboratorio','Laboratorio','Ciencia',['matraz','microscopio','tubos','balanza']],['taller','Taller','Trabajo',['herramientas','escalera','taladro','sierra']],['cafeteria','Cafetería','Comercio',['cafetera','taza','silla','escritorio']],['restaurante','Restaurante','Comercio',['platos','botella','silla','escritorio']],['libreria','Librería','Comercio',['estanteria','libro','banco','lampara']],['estacion','Andén ferroviario','Ciudad',['tren','reloj','banco','maleta']],['calle','Calle de barrio','Ciudad',['farola','bicicleta','buzon','maceta']],['plaza','Plaza pública','Ciudad',['banco','farola','quiosco','bicicleta']],['granja','Granja','Rural',['carretilla','pala','cesta','regadera']],['invernadero','Invernadero','Rural',['maceta','regadera','pala','cesta']],['museo','Museo','Cultura',['globo','pergamino','banco','lampara']],['auditorio','Auditorio','Cultura',['microfono','silla','piano','contrabajo']],['planetario','Planetario','Ciencia',['telescopio','globo','satelite','silla']],['espacial','Cabina espacial ficticia','Ciencia ficción',['ordenador','satelite','radio','silla']],['castillo','Salón de castillo ficticio','Fantasía',['cofre','llave-ornamental','pergamino','lampara']]
].map(([key,label,group,props])=>({key,label,group,props}));
const ANIMALS=[
 ['gato','Gato','Mamíferos','cat'],['perro','Perro','Mamíferos','dog'],['zorro','Zorro','Mamíferos','fox'],['lobo','Lobo','Mamíferos','wolf'],['oso','Oso','Mamíferos','bear'],['conejo','Conejo','Mamíferos','rabbit'],['ciervo','Ciervo','Mamíferos','deer'],['alce','Alce','Mamíferos','moose'],['caballo','Caballo','Mamíferos','horse'],['cebra','Cebra','Mamíferos','zebra'],['vaca','Vaca','Mamíferos','cow'],['oveja','Oveja','Mamíferos','sheep'],['cabra','Cabra','Mamíferos','goat'],['cerdo','Cerdo','Mamíferos','pig'],['elefante','Elefante','Mamíferos','elephant'],['jirafa','Jirafa','Mamíferos','giraffe'],['leon','León','Mamíferos','lion'],['tigre','Tigre','Mamíferos','tiger'],['rinoceronte','Rinoceronte','Mamíferos','rhino'],['hipopotamo','Hipopótamo','Mamíferos','hippo'],['camello','Camello','Mamíferos','camel'],['canguro','Canguro','Mamíferos','kangaroo'],['koala','Koala','Mamíferos','koala'],['mono','Mono','Mamíferos','monkey'],['ardilla','Ardilla','Mamíferos','squirrel'],['erizo','Erizo','Mamíferos','hedgehog'],['mapache','Mapache','Mamíferos','raccoon'],['panda','Panda','Mamíferos','panda'],['nutria','Nutria','Mamíferos','otter'],['foca','Foca','Marinos','seal'],['ballena','Ballena','Marinos','whale'],['delfin','Delfín','Marinos','dolphin'],['tiburon','Tiburón','Peces','shark'],['pez','Pez de arrecife','Peces','fish'],['tortuga','Tortuga','Reptiles','turtle'],['cocodrilo','Cocodrilo','Reptiles','crocodile'],['serpiente','Serpiente','Reptiles','snake'],['lagarto','Lagarto','Reptiles','lizard'],['rana','Rana','Anfibios','frog'],['sapo','Sapo','Anfibios','toad'],['pinguino','Pingüino','Aves','penguin'],['buho','Búho','Aves','owl'],['aguila','Águila','Aves','eagle'],['paloma','Paloma','Aves','pigeon'],['pato','Pato','Aves','duck'],['flamenco','Flamenco','Aves','flamingo'],['loro','Loro','Aves','parrot'],['mariposa','Mariposa','Insectos','butterfly'],['abeja','Abeja','Insectos','bee'],['hormiga','Hormiga','Insectos','ant'],['escarabajo','Escarabajo','Insectos','beetle'],['arana','Araña','Arácnidos','spider'],['pulpo','Pulpo','Marinos','octopus'],['cangrejo','Cangrejo','Marinos','crab'],['caballito','Caballito de mar','Peces','seahorse']
].map(([key,label,group,morph])=>({key,label,group,morph}));
const SYMBOLS='casa:Inicio|flecha:Dirección|ubicacion:Ubicación|brujula:Orientación|correo:Correo|chat:Conversación|telefono:Llamada|compartir:Compartir|red:Conexión|marcador:Marcador|archivo:Archivo|carpeta:Carpeta|copiar:Copiar|archivo-caja:Archivar|descargar:Descargar|subir:Subir|papelera:Eliminar|deshacer:Deshacer|rehacer:Rehacer|buscar:Buscar|ajustes:Ajustes|herramienta:Herramienta|filtro:Filtrar|ordenar:Ordenar|actualizar:Actualizar|reproducir:Reproducir|pausa:Pausar|detener:Detener|grabar:Grabar|siguiente:Siguiente|anterior:Anterior|volumen:Volumen|silencio:Silencio|nota:Música|auriculares:Escucha|escudo:Protección|candado:Bloquear|abierto:Desbloquear|llave:Acceso|correcto:Correcto|cerrar:Cerrar|aviso:Aviso|informacion:Información|ayuda:Ayuda|reloj:Tiempo|calendario:Calendario|sol:Sol|luna:Luna|nube:Nube|lluvia:Lluvia|nieve:Nieve|viento:Viento|termometro:Temperatura|hoja:Naturaleza|agua:Agua|fuego:Calor|libro:Lectura|estudios:Estudios|microscopio:Investigación|atomo:Átomo|matraz:Química|idea:Idea|tren:Ferrocarril|bicicleta:Ciclismo|avion:Vuelo|coche:Automóvil|corazon:Cuidado|estrella:Destacado|ojo:Visibilidad|mano:Participación'.split('|').map((t,i)=>{let[key,label]=t.split(':');return {key,label,group:['Navegación','Comunicación','Archivos','Acciones','Multimedia','Seguridad','Estados','Clima','Ciencia','Vida cotidiana'][Math.min(9,Math.floor(i/7))]};});
const BUBBLES='oval:Conversación oval|redondo:Diálogo redondeado|cuadrado:Diálogo angular|estallido:Exclamación|nube:Pensamiento nuboso|susurro:Susurro|llamada:Llamada telefónica|radio:Mensaje de radio|pensamiento:Idea encadenada|rombo:Diálogo romboidal|cinta:Narración en cinta|pergamino:Nota en pergamino|etiqueta:Etiqueta con voz|ticket:Nota troquelada|hexagono:Diálogo hexagonal|octagono:Aviso octagonal|marco:Marco conversacional|doble:Conversación doble|coral:Varias voces|espiral:Idea en espiral|onda:Diálogo ondulado|globo:Globo de palabras|bandera:Comentario en bandera|grito:Énfasis radial|relato:Viñeta de narración'.split('|').map(t=>{const[key,label]=t.split(':');return {key,label,group:['nube','pensamiento','espiral'].includes(key)?'Pensamiento':['doble','coral'].includes(key)?'Varios interlocutores':['grito','estallido'].includes(key)?'Énfasis':'Conversación'};});
const ANIMS='caminar:Paso y recorrido|correr:Carrera articulada|saltar:Salto y aterrizaje|saludar:Saludo expresivo|asentir:Escucha y asentimiento|aplaudir:Aplauso|leer:Lectura y página|escribir:Escritura|abrir-libro:Apertura de libro|cerrar-caja:Cierre de caja|puerta:Puerta que se abre|mapa:Desplegar un mapa|construir:Construcción por piezas|desarmar:Desarmado por piezas|orbitar:Órbitas conectadas|flotar:Flotación|trazo:Dibujo de un trazo|transformar:Transformación geométrica|pendulo:Péndulos|engranajes:Mecanismos enlazados|agua:Circuito de agua|verter:Verter una bebida|crecer:Crecimiento vegetal|alas:Aleteo|mariposa:Vuelo de mariposa|tren:Llegada ferroviaria|navegar:Navegación|teclear:Escritura en teclado|nodos:Conectar ideas|colaborar:Encuentro y colaboración'.split('|').map((t,i)=>{let[key,label]=t.split(':');return {key,label,group:i<8?'Gestos humanos':i<14?'Objetos articulados':i<20?'Mecánicas':i<26?'Naturaleza':'Secuencias'};});
const EFFECTS='lluvia:Lluvia|nieve:Nieve|humo:Humo|fuego:Fuego|chispas:Chispas|ondas:Ondas de agua|cascada:Cortina de agua|destellos:Destellos|electricidad:Electricidad|polvo:Polvo|confeti:Confeti|barrido:Transición de barrido|tinta:Expansión de tinta|rayos:Rayos de luz|niebla:Niebla|hojas:Hojas al viento|petalos:Pétalos|burbujas:Burbujas|estrellas:Estrellas flotantes|meteoritos:Meteoritos|anillos:Anillos expansivos|sonar:Pulso de sonar|semitono:Trama de puntos|pelicula:Rayas de película|flash:Resplandor|cinta:Cintas ondulantes|fragmentos:Fragmentos|rocio:Rocío|vapor:Vapor|vortice:Vórtice|choque:Onda de choque|cometa:Estela de cometa|red-electrica:Red eléctrica|liquido:Formas líquidas|explosion:Estallido gráfico'.split('|').map((t,i)=>{let[key,label]=t.split(':');return {key,label,group:i<8?'Elementos':i<16?'Atmósfera':i<25?'Partículas':'Transiciones'};});
const UIS='interruptor:Interruptor|progreso:Barra de progreso|deslizador:Deslizador|pestanas:Pestañas|ruta:Ruta de navegación|paginacion:Paginación|multimedia:Controles multimedia|tarjeta:Tarjeta editorial|etiqueta:Etiqueta|insignia:Insignia|tooltip:Ayuda contextual|pasos:Indicador de pasos|calendario:Calendario|tiempo:Panel de tiempo|buscador:Barra de búsqueda|volumen:Control de volumen|mezclador:Mezclador|dial:Selector giratorio|radial:Progreso radial|medidor:Medidor|lista:Lista de tareas|aviso:Notificación|acordeon:Panel acordeón|grafico:Panel de gráficos|cuadro:Cuadro de interruptores'.split('|').map((t,i)=>{let[key,label]=t.split(':');return {key,label,group:i<8?'Navegación':i<16?'Paneles':'Indicadores'};});
const DECORS='marco:Marco angular|feston:Marco festoneado|estrellas:Constelación decorativa|geometria:Composición geométrica|cintas:Cintas entrelazadas|lineas:Trama de líneas|ornamento:Ornamento botánico|esquinas:Esquinas ilustradas|sello:Sello ornamental|divisor:Divisor editorial|arcos:Arcos entrelazados|hojas:Ramas y hojas|flores:Flores gráficas|cuadricula:Cuadrícula escalonada|ondas:Patrón de ondas|rombos:Rombos impresos|circulos:Círculos concéntricos|triangulos:Triángulos superpuestos|papel:Papel recortado|abanico:Abanico geométrico|roseta:Roseta|cabecera:Cabecera editorial|banderines:Guirnalda de banderines|ventana:Ventanas geométricas|mosaico:Mosaico'.split('|').map((t,i)=>{let[key,label]=t.split(':');return {key,label,group:i<10?'Marcos y acentos':i<20?'Patrones':'Composiciones'};});
const COMPOSITION_NAMES=['sendero y primer plano','terrazas y refugio','cauce y vegetación','mirador y horizonte','rocas y paso elevado','dos planos de relieve','ribera y embarcadero','paso entre riscos','arbolado y claro','puente entre orillas','panorama con campamento','ladera y camino curvo','tres niveles de profundidad','primer plano botánico','valle con pasarela','horizonte fragmentado','diagonal de vegetación','refugio junto al agua','relieve en anfiteatro','travesía con hitos'];
const OBJECT_NAMES=['cuerpo facetado y módulo lateral','estructura curva con piezas elevadas','perfil escalonado y accesorios dobles','conjunto abierto con componentes visibles','base articulada y remate superior','silueta extendida con soporte integrado','estructura dividida y piezas desplegadas','configuración compacta con mecanismo lateral','composición de trabajo con elementos separados','estructura asimétrica y accesorios en uso'];
const ANIMAL_NAMES=['observando entre plantas','avanzando sobre el terreno','en movimiento y giro de cabeza','descanso con silueta recogida','buscando alimento','saltando o desplazándose','pareja en diálogo corporal','familia con cría','estiramiento con entorno','grupo en recorrido'];
const SYMBOL_NAMES=['trazo abierto y apoyo lateral','documento con marca integrada','doble panel enlazado','secuencia de tres hitos','insignia de borde recortado','tarjeta con sección lateral','red ramificada','ruta con dos estaciones','módulo de varios canales','conjunto radial de nodos'];
const SCENE_NAMES=['plano frontal con actividad','rincón y mesa compartida','pasillo con dos protagonistas','ventanal y zona de trabajo','espacio abierto con conversación','mesa central y primer plano','tres zonas de actividad','ventana lateral y almacenamiento','lámpara y encuentro','diagonal con objetos en uso','doble puesto de trabajo','estantería y recorrido','arco y conversación cercana','área de espera con objetos','encuadre con vegetación','primer plano con manos ocupadas','dos mesas conectadas','zona de demostración','rincón con colaboración','panorama de actividad'];

// 3. Specialized object constructors. Every family retains its characteristic silhouette.
function drawObject(key,v,p=DEFAULT_PALETTE){
 const q=v%5, ext=v>=5, w=74+q*9, x=120-w/2, y=77+(q%2)*10, h=87-q*5;
 let s=''; const r=(...a)=>R(...a), c=(...a)=>C(...a), path=(...a)=>P(...a);
 const detail=(x,y,w,nr=3)=>Array.from({length:nr},(_,i)=>L(x,y+i*8,x+w-(i%2)*8,y+i*8,p.ink,1.6)).join('');
 switch(key){
 case 'taza':
   s=P(`M${x+w-1} ${y+15} C${x+w+48} ${y-1} ${x+w+46} ${y+63} ${x+w-2} ${y+57}`,'none',p.ink,7)+P(q%2?`M${x} ${y} H${x+w} L${x+w-8} ${y+h} H${x+8}Z`:`M${x} ${y} H${x+w} V${y+h-17} Q120 ${y+h+17} ${x} ${y+h-17}Z`,p.rust)+E(120,y,w/2,9,p.gold)+E(120,y+1,w/2-7,5,p.ink);
   if(ext)s+=L(116,y-37,139,y+3,p.ink,5)+E(115,y-38,8,13,p.teal);else s+=P(`M108 ${y-9} Q97 ${y-25} 112 ${y-38} M135 ${y-8} Q146 ${y-23} 133 ${y-35}`,'none',p.teal,2);
   s+=E(120,y+h+10,53+q*4,7,p.sage)+R(x+13,y+28,w-26,9,p.paper);break;
 case 'tetera':
   s=P(`M${x+w-8} 92 Q${x+w+49} 66 ${x+w+43} 117 Q${x+w+35} 153 ${x+w-3} 151`,'none',p.ink,8)+P(`M${x+6} 112 L${28+q*4} ${70+q*4} L${35+q*3} 125 L${x+5} 157Z`,p.teal)+P(q%2?`M${x} 102 L${x+w} 102 L${x+w+5} 165 Q120 194 ${x-5} 165Z`:`M${x} 104 Q120 66 ${x+w} 104 L${x+w+7} 163 Q120 192 ${x-7} 163Z`,p.rust)+E(120,100,w/2-4,10,p.gold)+C(120,80,8+q,p.ink)+R(101,87,38,6,p.ink);
   s+=ext?P('M103 114 L137 114 L132 156 L108 156Z',p.paper)+detail(109,125,20,3):leaf(120,161,.7,p.gold,0,q);break;
 case 'cafetera':
   s=R(51-q*2,48,138+q*4,148,p.teal,q%2?12:1)+R(65,65,110,29,p.ink)+C(162,79,7,p.gold)+L(83,100,157,100,p.paper,4)+R(83,101,66,18,p.ink)+R(113,116,12,20,p.ink)+R(73,172,96,10,p.ink)+G(drawObject('taza',q,p),'translate(80 122) scale(.32)');
   if(ext)s+=P('M166 104 L183 120 L184 154','none',p.gold,5)+R(182,142,17,33,p.paper);else s+=R(33,67,18,63+q*4,p.gold,4);break;
 case 'tostadora':
   s=R(46-q*3,91,149+q*5,86,p.rust,14+q*4)+R(59,100,121+q*3,9,p.ink,4)+R(55,173,134,9,p.ink)+P(`M77 100 V${54-q*3} Q101 33 123 ${55-q*3} V100Z`,p.gold,p.ink,2)+detail(89,68,19,2)+L(191,119,213,119,p.ink,3)+R(205,112,15,14,p.ink,3);
   if(ext)s+=P('M119 97 V44 Q143 26 167 44 V97Z',p.paper,p.ink,2)+L(125,63,158,63,p.gold,3);else s+=C(72,133,7+q,p.paper)+C(153,143,4,p.ink);break;
 case 'licuadora':
   s=P(`M${78-q*3} 44 H${164+q*3} L${153+q*2} 144 H${89-q*2}Z`,p.blue,p.ink,2)+R(74-q*3,35,95+q*6,13,p.ink,3)+P('M164 59 Q201 45 194 105 Q190 124 158 122','none',p.ink,6)+P('M90 143 H153 L171 198 H73Z',p.teal)+C(124,174,12,p.gold);
   s+=ext?P('M89 107 L157 78 L151 132 H92Z',p.rust)+C(112,106,9,p.gold):P('M93 110 L147 96 L151 134 H89Z',p.gold);
   for(let i=0;i<q+2;i++)s+=L(92,58+i*11,102,58+i*11,p.ink,2);break;
 case 'olla':
   s=P(`M${x} 100 H${x+w} V165 Q120 190 ${x} 165Z`,p.rust)+P(`M${x} 111 H${x-23} V133 H${x} M${x+w} 111 H${x+w+23} V133 H${x+w}`,'none',p.ink,6)+E(120,100,w/2,8,p.ink);
   if(ext)s+=G(E(120,73,w/2+5,9,p.gold)+R(109,56,22,10,p.ink),'rotate(-20 120 73)')+P('M102 98 Q89 78 105 66 M142 98 Q154 77 138 60','none',p.teal,2);else s+=E(120,94,w/2+5,10+q,p.gold)+R(106-q,73,28+q*2,12,p.ink,3);
   s+=R(x+10,119,w-20,12,p.paper);break;
 case 'sarten':
   s=E(100,132,66+q*2,28+q*3,p.ink)+P('M160 129 L215 90 L225 105 L162 145Z',p.ink)+E(100,126,58+q*2,23+q*2,p.teal);
   s+=ext?E(84,119,23,13,p.paper)+C(85,118,9,p.gold)+E(119,133,18,9,p.paper)+C(119,132,6,p.gold):P(`M60 124 Q96 ${90-q*3} 130 119 Q130 140 92 143Z`,p.gold)+detail(72,118,30,2);break;
 case 'horno':
   s=R(56-q*3,46,129+q*6,158,p.paper,4,{stroke:p.ink,'stroke-width':3})+R(57-q*3,47,127+q*6,28,p.teal)+C(79,61,6,p.gold)+C(105,61,6,p.gold)+C(160,61,6,p.gold);
   if(ext)s+=R(70,85,101,73,p.ink)+detail(77,103,84,5)+Poly([[68,154],[172,154],[186,198],[52,198]],p.blue,p.ink,2)+L(70,191,169,191,p.ink,4);else s+=R(70,91,101,90,p.ink,4)+R(80,108,81,56,p.blue)+L(86,100,155,100,p.paper,4)+G(drawObject('pan',q,p),'translate(79 114) scale(.34)');break;
 case 'nevera':
   s=R(70-q*3,35,107+q*5,171,p.paper,4,{stroke:p.ink,'stroke-width':2})+R(73-q*3,39,101+q*5,47+q*3,p.blue)+L(72-q*3,92+q*3,176+q*2,92+q*3,p.ink,3);
   if(ext){s+=R(75,100,92,96,p.teal)+detail(80,116,80,6)+P(`M72 95 L${36-q*2} 111 V213 L72 196Z`,p.paper,p.ink,2)+L(52,138,52,167,p.ink,4);}else{s+=L(154,112,154,152,p.ink,5)+L(154,56,154,74,p.ink,4)+R(87,117,25,27,p.gold)+R(121,165,27,22,p.rust);}break;
 case 'tarro':
   s=P(`M${x+8} 62 H${x+w-8} V82 L${x+w} 98 V188 Q120 206 ${x} 188 V98 L${x+8} 82Z`,p.blue,p.ink,2)+R(x+4,ext?43:58,w-8,14,p.ink,4)+R(x+9,121,w-18,43,p.paper,3);
   if(ext)s+=P(`M${x+3} 111 Q120 134 ${x+w-3} 110 V183 Q120 197 ${x+3} 183Z`,p.gold)+leaf(120,171,.7,p.teal,0,q);else{for(let i=0;i<q+4;i++)s+=C(x+12+(i*17)%(w-22),176-Math.floor(i/3)*15,7,p.rust);s+=leaf(120,157,.5,p.teal,15,q);}break;
 case 'botella':
   s=P(`M${106-q*2} 44 H${133+q*2} V83 Q${148+q*6} 90 ${151+q*6} 110 V193 Q120 210 ${89-q*6} 193 V110 Q${91-q*6} 90 ${106-q*2} 83Z`,p.teal,p.ink,1.5)+R(104-q*2,34,31+q*4,14,p.ink)+R(91-q*4,130,58+q*8,33+q*3,p.paper);
   s+=ext?P('M107 79 H133 L145 103 L97 103Z',p.gold)+L(116,48,116,78,p.paper,3):leaf(120,155,.42,p.rust,0,q);if(ext)s+=R(175,155,25+q*2,44,p.blue,3)+E(187+q,155,12.5+q,4,p.ink);break;
 case 'cubiertos':
   s=P(`M58 51 V101 Q69 126 80 101 V51 M69 51 V102 M58 67 H80 M69 112 V190`,'none',p.ink,5)+E(120,80,15+q*2,29+q,p.teal)+R(116,107,8,84,p.ink,4)+P(`M169 190 V50 Q${198+q*2} 74 180 123 H177 V190Z`,p.rust);
   if(ext)s+=R(37,151,169,55,p.paper,3,{stroke:p.teal,'stroke-width':2})+P('M37 151 L122 179 L206 151','none',p.teal,2);else s+=L(60,201,181,201,p.gold,4)+C(121,134,3,p.gold);break;
 case 'platos':
   s=E(120,180,83+q*2,18,p.ink)+E(120,173,83+q*2,17,p.paper)+E(120,162,75,14,p.teal)+E(120,150,70-q*3,16,p.paper)+E(120,149,52-q*2,10,p.gold);
   if(ext)s+=C(120,82,48+q*2,p.paper,{stroke:p.ink,'stroke-width':2})+C(120,82,34+q*2,'none',{stroke:p.rust,'stroke-width':4})+leaf(120,104,.6,p.teal,0,q);else s+=G(drawObject('cubiertos',q,p),'translate(85 48) scale(.47)');break;
 case 'tabla':
   s=P(`M${x} 86 H105 V51 Q120 35 135 51 V86 H${x+w} V205 H${x}Z`,p.gold,p.ink,2)+C(120,57,6,p.paper)+detail(x+9,111,w-18,5);
   if(ext)s+=G(drawObject('queso',q,p),'translate(91 110) scale(.43)')+P('M46 111 L91 87 L97 98 L51 127Z',p.ink);else s+=G(drawObject('pan',q,p),'translate(67 112) scale(.48)');break;
 case 'batidor':
   s=R(112-q,132,16+q*2,75,p.rust,5)+P(`M119 137 C${49-q*3} 84 78 32 121 31 C164 34 ${192+q*3} 89 121 137Z`,'none',p.ink,3)+P(`M120 137 C84 93 99 38 121 32 C143 58 154 104 120 137Z`,'none',p.teal,2)+L(121,35,121,134,p.ink,2);
   if(ext)s+=E(62,176,34,10,p.paper,{stroke:p.ink,'stroke-width':2})+P('M28 176 Q60 224 96 176Z',p.gold);else s+=R(94,149,53,12,p.gold);break;
 case 'exprimidor':
   s=E(121,151,72+q*3,34,p.ink)+E(121,143,72+q*3,30,p.gold)+P(`M83 133 Q120 ${46-q*3} 159 133 Q121 154 83 133Z`,p.paper,p.ink,2)+P('M107 125 L120 74 L136 127','none',p.teal,2)+R(174,137,36,15,p.ink,4);
   if(ext)s+=G(C(59,79,26,p.gold)+C(59,79,21,p.paper)+Array.from({length:6},(_,i)=>L(59,79,59+Math.cos(i)*18,79+Math.sin(i)*18,p.rust,2)).join(''),'');else s+=C(58,83,22,p.rust)+leaf(66,62,.4,p.teal,45);break;
 case 'mortero':
   s=E(121,130,68+q*3,16,p.ink)+P(`M${53-q*3} 130 Q67 198 120 196 Q180 195 ${189+q*3} 130Z`,p.teal)+P(`M${106-q*3} 137 L${159+q*3} ${46-q*2} Q180 39 184 62 L133 151Z`,p.gold)+R(100,189,44,10,p.ink);
   s+=ext?leaf(77,122,.6,p.sage,-40,q)+leaf(104,129,.5,p.sage,24,q+1):C(77,124,9,p.rust)+C(103,129,7,p.paper);break;
 case 'cesta':
   s=P(`M${53-q*3} 105 L${72-q*2} 190 H${169+q*2} L${190+q*3} 105Z`,p.gold,p.ink,2)+P(`M75 105 Q120 ${-2+q*7} 168 105`,'none',p.ink,7);
   for(let i=0;i<6+q;i++)s+=L(63+i*(119/(5+q)),112,78+i*(90/(5+q)),182,p.rust,2);for(let j=0;j<3+q%3;j++)s+=L(64+j*3,125+j*17,180-j*3,125+j*17,p.ink,1.2);
   if(ext)s+=G(drawObject('pan',q,p),'translate(45 44) scale(.52)')+leaf(148,108,.8,p.sage,22,q);else s+=C(91,101,22,p.rust)+C(146,96,25,p.teal)+R(52,104,139,10,p.ink);break;
 case 'lampara':
   s=E(120,207,52,8,p.ink)+L(120,202,120+(q-2)*10,99,p.ink,7);
   s+=ext?P(`M${120+(q-2)*10} 126 L${53+q*4} 86 L93 46`,'none',p.ink,6)+P('M79 41 Q118 24 151 72 L72 108Z',p.teal)+E(110,81,41,7,p.gold):P(`M${82-q*5} ${45+q*3} H${159+q*3} L190 112 H50Z`,p.rust)+E(120,112,70,6,p.gold)+L(154,115,154,145,p.ink,1.5)+C(154,149,3,p.ink);break;
 case 'reloj':
   s=q%2?R(52,52,135,137,p.teal,25):C(120,121,70,p.teal);s+=C(120,118,56-q*2,p.paper)+L(120,118,100-q*3,86,p.ink,4)+L(120,118,149,106+q*7,p.rust,3)+C(120,118,5,p.ink)+L(75,175,61,202,p.ink,6)+L(165,175,181,202,p.ink,6);
   for(let i=0;i<12;i++)s+=C(120+Math.sin(i*Math.PI/6)*(48-q*2),118-Math.cos(i*Math.PI/6)*(48-q*2),i%3?1.3:2.7,p.ink);
   s+=ext?P('M55 46 Q75 20 95 46 M145 46 Q166 20 187 46','none',p.gold,14)+L(96,38,147,38,p.ink,3):R(113,29,15,16,p.gold)+R(45,199,151,7,p.ink);break;
 case 'libro':
   if(ext)s=P('M28 74 Q74 49 120 74 Q165 45 216 69 V190 Q164 167 120 192 Q72 169 28 194Z',p.paper,p.ink,3)+P('M120 74 V192','none',p.rust,4)+detail(41,101,57,5)+detail(136,97,57,5)+P('M155 62 L155 132 L163 121 L172 131 V61Z',p.gold);
   else s=P(`M${67-q*4} 38 L${169+q*3} 47 V202 L${67-q*4} 192Z`,p.rust,p.ink,2)+R(68-q*4,37,10+q,155,p.ink)+R(94-q*3,69,61+q*3,87,p.gold)+leaf(126,139,.8,p.teal,0,q)+L(85,194,166,201,p.paper,4);break;
 case 'cuaderno':
   s=R(65-q*3,41,117+q*3,164,p.paper,4,{stroke:p.ink,'stroke-width':2})+R(65-q*3,41,16,164,p.teal)+detail(96,83,67,10);for(let i=0;i<7+q;i++)s+=P(`M${59-q*3} ${54+i*12} Q${78-q*3} ${48+i*12} ${78-q*3} ${57+i*12}`,'none',p.ink,2);
   s+=ext?G(drawObject('pluma',q,p),'translate(120 34) rotate(20) scale(.52)'):R(113,39,22,34+q*5,p.rust)+C(152,62,4,p.gold);break;
 case 'periodico':
   s=P(ext?'M31 45 L126 52 L215 40 V193 L125 206 L31 193Z':`M${48-q*3} 45 H${179+q*3} V197 H${48-q*3}Z`,p.paper,p.ink,2)+R(66,60,105,12,p.ink)+L(61,82,180,82,p.ink,2)+R(65,96,43+q*3,46,p.teal)+detail(121+q*2,99,47,6)+detail(65,157,105,4);if(ext)s+=L(125,52,125,199,p.rust,2)+P('M32 187 L21 172 V68','none',p.ink,3);else s+=Poly([[70,135],[85,106],[102,134]],p.gold);break;
 case 'sobre':
   s=R(35,81-q*5,170,112+q*5,p.paper,2,{stroke:p.ink,'stroke-width':2})+P(`M35 ${81-q*5} L120 151 L205 ${81-q*5}`,'none',p.teal,2)+P('M35 193 L101 138 M205 193 L140 137','none',p.ink,2);
   if(ext)s=P('M35 87 L120 24 L205 87Z',p.gold,p.ink,2)+paper(61,52,118,91,p,true)+s;else s+=R(166,92,23+q*2,24,p.rust,1)+L(58,166,99,166,p.teal,2);break;
 case 'pluma':
   s=G(P(`M111 56 H${133+q*2} L131 171 H114Z`,p.teal)+P('M114 171 L121 207 L131 171Z',p.gold,p.ink,1.5)+L(121,178,121,196,p.ink,1)+C(122,180,2,p.ink)+R(110,45,25+q*2,22,p.ink,4)+L(117,73,117,150,p.paper,2),`rotate(${ext?-27:18} 120 120)`);
   if(ext)s+=R(41,157,45,40,p.rust,4)+R(49,149,29,13,p.ink)+E(64,156,19,4,p.gold);else s+=G(R(101,30,32+q*2,74,p.ink,8)+L(119,46,119,89,p.gold,3),'translate(55 28)');break;
 case 'lapices':
   for(let i=0;i<4+q;i++){let xx=67+i*17; s+=G(R(xx,54-(i%3)*7,9,108,p.rust)+Poly([[xx,54-(i%3)*7],[xx+4.5,36-(i%3)*7],[xx+9,54-(i%3)*7]],p.gold),`rotate(${(i-2)*5} ${xx} 160)`);}
   s+=ext?P('M44 141 H200 L182 211 H61Z',p.teal)+detail(70,160,87,4):R(61,139,120+q*2,65,p.gold,6)+leaf(115,187,.6,p.teal,0,q);break;
 case 'maquina':
   s=P(`M${57-q*2} 81 H183 L${205+q*2} 183 H33Z`,p.teal)+R(63,73,112,45,p.ink,4)+paper(76,32-q*2,84,61+q*2,p,false)+R(45,115,151,13,p.ink);
   for(let row=0;row<3+q%2;row++)for(let j=0;j<9;j++)s+=C(55+j*16+row*2,140+row*13,4.5,p.paper);
   s+=R(83,185,79,8,p.ink)+L(181,79,210,61,p.ink,4);if(ext)s+=R(16,95,33,13,p.gold)+L(30,87,30,105,p.ink,3);else s+=C(184,97,11,p.gold);break;
 case 'archivador':
   s=R(67-q*3,36,113+q*4,169,p.teal,4);let count=3+q%3;for(let i=0;i<count;i++){let yy=43+i*155/count;s+=R(76-q*3,yy,94+q*4,144/count,p.paper,2,{stroke:p.ink,'stroke-width':1.2})+R(101-q,yy+9,42,11,p.gold)+L(111,yy+28,134,yy+28,p.ink,3);if(ext&&i===1)s+=Poly([[76-q*3,yy+10],[172+q,yy+10],[191+q,yy+38],[58-q*3,yy+38]],p.blue,p.ink,2)+R(93,yy+4,15,14,p.rust);}break;
 case 'escritorio':
   s=Poly([[37,93],[190,85-q*3],[215,108],[31,119]],p.gold)+L(48,116,39,208,p.ink,7)+L(194,112,204,207,p.ink,7)+R(135-q*5,119,57+q*5,62,p.teal,2)+L(144,141,183,141,p.paper,2)+L(160,151,175,151,p.ink,3);
   s+=ext?G(drawObject('portatil',q,p),'translate(41 22) scale(.42)')+G(drawObject('lampara',q,p),'translate(123 10) scale(.39)'):G(drawObject('libro',q,p),'translate(39 38) scale(.32)')+G(drawObject('taza',q,p),'translate(111 42) scale(.28)');break;
 case 'silla':
   s=P(`M${68-q*4} 39 L${167+q*5} ${43+q*3} L166 133 L76 141Z`,p.teal)+Poly([[67,129],[169,124],[186,151],[56,158]],p.rust)+L(67,157,52,215,p.ink,6)+L(170,149,187,213,p.ink,6)+L(91,154,89,205,p.ink,4);
   if(ext)s+=L(44,113,68,118,p.ink,6)+L(44,113,49,166,p.ink,4)+L(173,103,200,99,p.ink,6)+L(200,100,193,158,p.ink,4);else s+=P(`M89 55 L${146+q*3} ${58+q*2} L143 113 L90 117Z`,p.gold)+L(180,161,165,205,p.ink,4);break;
 case 'ordenador':
   s=R(31-q*2,44,172+q*3,114,p.ink,6)+R(42-q*2,54,150+q*3,90,p.blue)+R(104,158,28,27,p.teal)+Poly([[83,184],[152,184],[166,197],[72,197]],p.ink)+R(43,204,141,12,p.paper,3,{stroke:p.ink,'stroke-width':2});
   s+=ext?R(53,66,42,65,p.paper)+R(106,65,64,13,p.gold)+detail(110,96,55,4):Poly([[55,122],[88,76],[121,119],[145,84],[178,123]],p.teal)+C(167,75,10,p.gold);
   for(let i=0;i<q+3;i++)s+=L(57+i*18,208,57+i*18,212,p.ink,2);break;
 case 'portatil':
   s=P(`M${56-q*3} 51 H${184+q*3} L193 150 H47Z`,p.ink)+Poly([[65-q*3,60],[176+q*3,60],[182,139],[58,139]],p.blue)+Poly([[47,150],[193,150],[219,192],[23,192]],p.teal)+R(30,190,182,7,p.ink)+Poly([[101,176],[148,176],[153,186],[96,186]],p.paper);
   for(let i=0;i<3;i++)s+=L(54-i*5,158+i*6,186+i*5,158+i*6,p.ink,2);
   s+=ext?R(75,80,76,39,p.paper)+L(92,91,136,91,p.rust,4)+L(92,104,125,104,p.teal,3):C(119,99,22+q*2,p.gold)+star(119,99,15,4,.35,p.rust);break;
 case 'telefono':
   if(q%2===0){s=R(78-q*2,30,90+q*4,181,p.ink,13)+R(85-q*2,48,76+q*4,138,p.paper,4)+R(99,66,40,12,p.gold)+R(100,91,48,37,p.teal,5)+C(123,198,5,p.gold);s+=ext?G(drawObject('sobre',1,p),'translate(93 121) scale(.26)'):L(100,153,143,153,p.rust,4);}
   else{s=P('M52 104 H185 L207 193 H31Z',p.rust)+C(120,146,33,p.paper)+C(120,146,20,p.ink);for(let i=0;i<10;i++)s+=C(120+Math.sin(i*6.28/10)*26,146+Math.cos(i*6.28/10)*26,3,p.ink);s+=P(ext?'M28 83 Q65 18 169 39 L183 63 L153 79 L136 60 Q81 47 59 102Z':'M56 81 Q121 39 183 81 L177 101 L150 102 L141 85 Q120 73 99 85 L88 104 L59 101Z',p.ink)+P('M176 98 C211 106 182 125 212 143 C229 173 206 212 177 209','none',p.ink,3);}break;
 case 'camara':
   s=R(34-q*2,73,169+q*4,113,p.teal,9)+R(65,50,56+q*7,26,p.ink,3)+R(153,59,35,14,p.gold)+C(119,131,44+q*2,p.ink)+C(119,131,30+q*2,p.paper)+C(119,131,22+q,p.blue)+C(112,124,8,p.paper)+R(46,87,26,18,p.gold);
   if(ext)s+=R(195,102,21,70,p.ink,5)+P('M47 185 Q49 220 187 188','none',p.rust,5);else s+=L(69,78,69,177,p.ink,2)+C(185,87,5,p.rust);break;
 case 'radio':
   s=R(36-q*2,72,171+q*3,112,p.gold,9)+R(43-q*2,82,96,85,p.teal,4)+R(150,87,42,22,p.paper)+C(165,138,12,p.ink)+C(193,143,7,p.rust);for(let i=0;i<7+q;i++)s+=L(53+i*8,91,53+i*8,158,p.ink,1.6);
   s+=ext?P('M73 71 V40 Q120 13 169 40 V71','none',p.ink,7)+L(186,68,218,20,p.ink,3):L(156,70,118-q*6,27,p.ink,3)+C(118-q*6,27,3,p.ink);break;
 case 'televisor':
   s=R(32-q*2,59,177+q*3,130,p.teal,15)+R(43,72,127+q*2,103,p.paper,15)+R(51,80,110+q*2,85,p.blue,14)+C(188,94,9,p.gold)+C(188,123,7,p.ink)+L(57,191,47,211,p.ink,5)+L(182,191,194,211,p.ink,5);
   if(ext)s+=L(120,57,73,22,p.ink,3)+L(120,57,170,22,p.ink,3)+G(drawObject('microfono',q,p),'translate(73 90) scale(.24)');else s+=Poly([[63,151],[83,112],[112,144],[142,103],[159,152]],p.teal)+C(81,96,10,p.gold)+detail(181,146,14,4);break;
 case 'auriculares':
   s=P(`M${58-q*3} 126 V92 C58 ${11+q*4} 184 ${13+q*4} ${184+q*2} 92 V126`,'none',p.ink,13)+R(42-q*3,107,34+q*2,74,p.rust,13)+R(170+q*2,107,33,74,p.teal,13)+R(69-q*2,111,14,66,p.ink,5)+R(161+q*2,111,14,66,p.ink,5);
   s+=ext?P('M57 174 Q44 214 119 213 L149 213','none',p.ink,4)+R(142,205,24,13,p.gold,4):P('M188 174 Q212 205 163 208','none',p.ink,3)+C(156,208,8,p.gold);break;
 case 'microfono':
   s=R(91-q*2,30,58+q*4,119,p.ink,28)+R(97-q,38,46+q*2,104,p.teal,21);for(let i=0;i<8+q;i++)s+=L(102-q,49+i*7,138+q,49+i*7,p.ink,2);
   s+=P('M76 106 V130 Q120 185 164 130 V106','none',p.ink,5)+L(120,164,120,207,p.ink,6)+E(120,210,45,8,p.ink);
   if(ext)s+=C(181,87,30,'none',{stroke:p.gold,'stroke-width':3})+L(169,113,151,167,p.ink,3)+P('M181 58 L181 115','none',p.gold,1);else s+=C(90-q,38,3,p.paper)+R(108,93,25,13,p.gold,5);break;
 case 'altavoz':
   s=R(65-q*2,30,116+q*3,177,p.ink,4)+R(73-q*2,39,99+q*3,159,p.teal,2)+C(123,79,21+q,p.paper)+C(123,79,12,p.ink)+C(123,151,38+q,p.gold)+C(123,151,25+q,p.ink)+C(123,151,13,p.blue);
   s+=ext?L(189,71,208,57,p.rust,3)+P('M197 91 Q228 121 197 153','none',p.rust,3):R(88,211,70,6,p.ink)+C(160,50,4,p.rust);break;
 case 'proyector':
   s=R(42,112,128+q*5,66,p.teal,5)+P('M170 122 L211 112 V164 L170 155Z',p.ink)+C(92-q*3,78,33+q,p.ink)+C(164+q*2,76,28,p.ink);
   for(let i=0;i<5;i++){let a=i*6.28/5;s+=C(92-q*3+Math.cos(a)*20,78+Math.sin(a)*20,6,p.paper)+C(164+q*2+Math.cos(a)*17,76+Math.sin(a)*17,5,p.paper);}s+=L(68,179,58,204,p.ink,6)+L(152,179,167,204,p.ink,6);
   if(ext)s+=P('M215 119 L232 105 V184 L215 161Z',p.gold)+R(62,133,66,9,p.paper);else s+=detail(68,136,58,3);break;
 // Transport: distinct structural bodies with articulated running gear.
 case 'bicicleta':
   s=wheel(58,170,37,p,6+q)+wheel(187,170,37,p,6+q)+P(`M58 170 L95 ${104-q*4} L140 170Z M95 ${104-q*4} H169 L187 170 M140 170 L169 ${104-q*4}`,'none',p.rust,5)+L(96,107-q*4,90,88,p.ink,4)+L(78,87,104,87,p.ink,5)+P('M169 104 L172 83 L188 77','none',p.ink,4)+C(140,170,9,p.ink)+L(140,170,150,181,p.ink,3);
   if(ext)s+=R(28,100,45,30,p.gold,3)+L(28,137,80,137,p.ink,3)+L(55,137,58,168,p.ink,3);else s+=C(166,103,6,p.gold)+P('M24 157 Q56 112 87 147','none',p.teal,3);break;
 case 'automovil':
   s=P(`M28 137 L59 ${113-q*3} L85 ${76+q*2} H156 L183 114 L218 128 V180 H25Z`,p.rust)+Poly([[69,113],[88,85+q*2],[117,85+q*2],[117,113]],p.paper)+Poly([[124,85+q*2],[152,85+q*2],[173,114],[124,114]],p.blue)+wheel(65,178,24,p)+wheel(178,178,24,p)+R(27,141,19,12,p.gold)+R(201,139,16,12,p.paper)+L(128,133,144,133,p.ink,3);
   if(ext)s+=R(94,54,55+q*3,19,p.teal,4)+L(89,77,163,77,p.ink,3)+L(87,125,87,153,p.ink,2);else s+=L(120,120,120,165,p.ink,2)+R(28,170,26,8,p.ink);break;
 case 'autobus':case 'tranvia':
   s=R(25,62-q*3,194,122+q*3,p.gold,q%2?15:3)+R(25,147,194,28,p.rust)+wheel(62,183,21,p)+wheel(181,183,21,p);
   for(let i=0;i<4+q%3;i++)s+=R(36+i*158/(4+q%3),76-q*3,24+q,47,p.blue,3);s+=R(168,126,33,49,p.teal,2)+L(185,126,185,176,p.ink,2)+R(34,135,19,8,p.paper);
   if(key==='tranvia')s+=P(ext?'M99 60 L142 31 L108 14 L165 14':'M89 60 L133 30 L159 53 L112 30','none',p.ink,3)+L(22,207,221,207,p.ink,2);else if(ext)s+=R(55,40-q*3,87,20,p.teal,3)+L(50,61-q*3,149,61-q*3,p.ink,3);else s+=L(37,66-q*3,189,66-q*3,p.ink,2);break;
 case 'camion':
   s=R(23,78-q*4,122+q*3,98+q*4,p.teal,3)+P('M154 109 H190 L219 144 V179 H151Z',p.rust)+Poly([[165,117],[186,117],[205,144],[165,144]],p.paper)+wheel(60,181,24,p)+wheel(180,181,24,p)+R(25,171,185,12,p.ink);
   if(ext)s+=Poly([[27,77-q*4],[140,77-q*4],[154,55-q*4],[43,55-q*4]],p.gold)+L(40,80,130,159,p.paper,3);else for(let i=0;i<q+4;i++)s+=L(36+i*21,91-q*4,36+i*21,161,p.paper,2);break;
 case 'tren':
   s=P('M37 98 H147 V160 H39Z',p.teal)+R(139,70-q*4,61,99+q*4,p.rust,3)+R(150,83-q*4,37,40,p.paper)+R(62,64,18+q*4,35,p.ink)+P('M37 160 L23 187 H214 L199 159Z',p.ink)+wheel(58,178,23,p,6)+wheel(113,179,25,p,6)+wheel(180,180,25,p,6)+L(56,178,183,179,p.gold,5);
   s+=ext?cloud(65,41,0.48,p.blue,q)+cloud(100,23,0.36,p.sage,q+1):R(144,55-q*4,60,13,p.ink)+C(36,117,10,p.gold);break;
 case 'barco':case 'velero':
   s=P(`M${24+q*3} 151 H${221-q*2} L${182-q*3} 196 H${69+q*3}Z`,p.teal)+L(31,161,207,161,p.ink,3)+P('M20 208 Q50 194 82 208 Q110 221 143 208 Q172 195 220 209','none',p.blue,4);
   if(key==='velero'){s+=L(122,44-q*3,122,151,p.ink,4)+Poly([[115,53-q*3],[45+q*2,140],[115,140]],p.paper)+Poly([[129,66],[189-q*3,140],[129,140]],p.rust);if(ext)s+=L(48,145,201,145,p.gold,3)+Poly([[123,39],[159,50],[123,61]],p.gold);else s+=C(154,171,5,p.paper);}
   else{s+=R(77-q*3,113,100+q*2,38,p.paper)+R(91-q*3,78,68+q*2,36,p.gold)+R(109,60,20+q*3,22,p.ink);for(let i=0;i<4;i++)s+=C(91+i*23,132,6,p.ink);s+=ext?cloud(139,35,.48,p.blue,q):L(177,152,177,85,p.ink,3)+Poly([[177,85],[210,97],[177,107]],p.rust);}break;
 case 'avion':
   s=P(`M28 127 L91 109 L${111-q*4} ${37+q*4} L137 38 L137 104 L203 109 Q233 119 214 130 L135 137 L${157+q*2} 193 L134 200 L102 142 L39 148Z`,p.paper,p.ink,2)+P('M82 124 L39 93 L30 96 L42 131Z',p.rust)+C(201,117,5,p.teal)+L(107,118,176,118,p.teal,3);
   if(ext)s+=P('M99 177 L119 177 L113 189 H99Z',p.ink)+L(80,147,74,168,p.ink,2)+wheel(72,173,10,p);else s+=P('M140 75 L156 75 L151 94 H140Z',p.ink)+P('M109 170 L122 170 L125 189 H115Z',p.rust);break;
 case 'helicoptero':
   s=E(141,128,57+q*3,37,p.rust)+P(`M92 118 L25 ${83-q*3} L23 113 L94 142Z`,p.teal)+P('M151 92 Q203 97 202 127 H151Z',p.blue,p.ink,2)+R(121,71,12,28,p.ink)+L(35,65,213,65,p.ink,5)+L(34,56,46,73,p.ink,2)+L(113,164,108,184,p.ink,4)+L(174,161,182,184,p.ink,4)+L(90,184,204,184,p.ink,5);
   if(ext)s+=L(27,92,27,130,p.ink,3)+L(11,108,45,108,p.ink,3)+L(160,166,157,210,p.ink,2)+P('M145 210 Q153 220 165 208','none',p.ink,3);else s+=R(106,118,20+q*3,26,p.paper,4)+C(98,148,4,p.gold);break;
 // Musical instruments have recognisable bodies, necks, keys, valves and strings.
 case 'guitarra':case 'contrabajo':case 'violin':{
   const big=key==='contrabajo',small=key==='violin';let bw=big?46:small?33:42;
   s=P(`M113 94 C${105-bw} 78 ${84-bw} 123 100 134 C${69-bw/2} 148 ${72-bw/2} 201 122 204 C${166+bw/2} 208 ${170+bw/2} 154 142 136 C${173+bw/2} 107 ${147+bw/2} 80 130 94Z`,p.rust,p.ink,2)+R(115,34-q*2,14+q,85+q*2,p.gold)+R(108,22-q*2,28+q,27,p.ink,4)+C(121,139,big?14:small?9:18,p.ink)+R(102,175,39,8,p.ink);
   for(let i=0;i<(small?4:6);i++)s+=L(116+i*2,30,116+i*2,180,p.paper,.7);for(let i=0;i<3;i++)s+=L(103,29+i*7,141,29+i*7,p.ink,3);
   if(ext||small)s+=L(180,43,192,207,p.ink,3)+L(186,44,198,207,p.gold,1.5);else s+=P('M112 54 Q63 34 70 129','none',p.teal,5);if(big)s+=L(121,203,121,222,p.ink,3);break;}
 case 'piano':
   s=P(`M42 85 C68 ${30-q*3} 151 ${28+q*2} 174 70 L205 117 V152 H37Z`,p.ink)+Poly([[38,117],[196,117],[209,143],[26,143]],p.paper)+L(44,152,40,209,p.ink,7)+L(188,151,207,207,p.ink,7)+L(111,152,114,202,p.ink,5);
   for(let i=0;i<14+q;i++)s+=L(38+i*(155/(14+q)),119,31+i*(172/(14+q)),139,p.ink,1);for(let i=0;i<10;i++)if(i%3!==0)s+=R(42+i*15,117,7,13,p.ink);
   if(ext)s+=Poly([[46,80],[160,22],[201,81],[78,113]],p.teal)+L(171,113,164,50,p.gold,3);else s+=R(94,70,52,36,p.gold)+detail(101,79,35,3);break;
 case 'trompeta':
   s=P(`M36 140 H168 L${212-q*2} ${91-q*3} V${177+q*3} L168 150 H76 Q38 180 40 131 Q44 108 79 108 H146 V138`,'none',p.gold,10)+R(28,130,19,14,p.ink)+Poly([[166,139],[214-q*2,94-q*3],[214-q*2,174+q*3],[166,151]],p.rust);
   for(let i=0;i<3+q%2;i++)s+=L(91+i*17,109,91+i*17,139,p.ink,3)+R(84+i*17,96,13,10,p.ink,2);
   if(ext)s+=G(drawObject('microfono',q,p),'translate(177 155) scale(.25)');else s+=P('M102 161 Q115 179 131 162','none',p.ink,3);break;
 case 'bateria':
   s=C(125,155,48+q*2,p.rust)+C(125,155,39+q*2,p.paper)+star(125,154,19,4,.35,p.teal)+E(62,88,32,10,p.gold)+L(62,88,62,202,p.ink,3)+L(62,182,45,205,p.ink,2)+L(62,182,77,205,p.ink,2)+R(77,82,46,41,p.teal,6)+E(100,83,23,7,p.paper)+R(130,81,49,39,p.teal,5)+E(154,82,24,7,p.paper)+L(110,201,102,216,p.ink,4)+L(146,201,160,216,p.ink,4);
   s+=ext?E(193,62-q*3,34,8,p.gold)+L(193,61-q*3,193,201,p.ink,3):L(63,104,144,42,p.ink,3)+L(102,56,180,104,p.ink,3);break;
 case 'saxofon':
   s=P(`M126 35 H99 Q82 38 89 69 L130 151 Q146 190 171 150 L${184+q*3} ${120-q*2}`,'none',p.gold,24)+Poly([[168,139],[166,91-q*2],[213,107],[188,147]],p.rust)+P('M128 31 H95 Q84 33 83 49','none',p.ink,8);
   for(let i=0;i<6+q;i++)s+=C(99+i*5,75+i*9,3.2,p.ink);if(ext)s+=P('M109 44 Q37 126 115 189','none',p.teal,4)+R(59,143,10,23,p.ink);else s+=P('M114 132 Q99 152 122 157','none',p.ink,3);break;
 case 'flauta':
   s=G(R(105-q,26,22+q*2,183,p.gold,5)+R(103-q,29,26+q*2,7,p.ink)+R(106,60,20,16,p.ink,3)+Array.from({length:7+q%3},(_,i)=>C(116,90+i*12,3+q*.3,p.ink)).join(''),`rotate(${ext?-22:12} 120 120)`);
   if(ext)s+=R(158,82,33,127,p.teal,4)+detail(166,110,17,6);else s+=R(47,49,41,128,p.paper,4,{stroke:p.ink,'stroke-width':1.3})+detail(53,73,27,7);break;
 case 'acordeon':
   s=R(33,66,42,128,p.ink,4)+R(175,66,34,128,p.rust,4);for(let i=0;i<7+q;i++)s+=Poly([[74+i*100/(7+q),67],[82+i*100/(7+q),74],[82+i*100/(7+q),184],[74+i*100/(7+q),193]],i%2?p.teal:p.gold,p.ink,1);
   for(let i=0;i<9;i++)s+=R(40,74+i*12,29,11,p.paper)+((i%3)?R(40,73+i*12,15,5,p.ink):'');for(let i=0;i<12;i++)s+=C(184+(i%2)*13,78+Math.floor(i/2)*19,3,p.paper);
   s+=ext?P('M46 64 Q113 8 193 62','none',p.ink,5):P('M76 83 Q121 100 176 81','none',p.paper,2);break;
 case 'maracas':
   s=G(E(82,81,27+q*2,41,p.rust)+R(77,117,10,92,p.ink,5)+P('M57 62 L104 74 M59 92 L105 105','none',p.gold,7),'rotate(-18 82 155)')+G(E(165,94,26+q,38,p.teal)+R(160,127,10,79,p.ink,4)+C(165,93,13,p.paper),`rotate(${ext?34:12} 165 166)`);if(ext)s+=L(35,43,24,26,p.gold,3)+L(47,34,45,14,p.gold,3);else s+=R(58,211,128,4,p.sage);break;
 // Tool-specific head and grip assemblies.
 case 'martillo':
   s=G(R(112-q,80,18+q*2,130,p.rust,5)+P(`M60 51 H${148+q*4} L178 73 L167 92 L142 74 H104 V94 H60Z`,p.ink)+R(51,53,13,38,p.teal)+L(118,105,118,178,p.gold,3),`rotate(${ext?-24:15} 120 150)`);if(ext)s+=L(50,168,50,205,p.ink,3)+L(42,166,58,166,p.ink,3)+L(175,183,175,211,p.ink,3);else s+=R(41,213,158,5,p.gold);break;
 case 'destornillador':
   s=G(R(106-q*2,26,30+q*4,79,p.rust,10)+R(115,101,12,85,p.blue)+P(q%2?'M115 182 L113 211 H129 L127 182Z':'M117 182 H125 V211 H117Z',p.ink)+L(117,42,117,85,p.paper,3),`rotate(${ext?-24:12} 120 120)`);if(ext)s+=G(R(65,150,43,10,p.ink)+L(69,142,69,168,p.ink,3),'rotate(-15 85 150)')+C(179,185,10,p.gold);else s+=C(182,147,15,p.teal)+L(173,147,191,147,p.ink,3);break;
 case 'llave':
   s=G(P(`M109 105 Q${61-q*4} 82 94 41 L105 68 H137 L146 41 Q174 81 132 106 L137 203 Q120 220 105 203Z`,p.teal,p.ink,2)+C(121,196,7,p.paper),`rotate(${ext?-25:18} 120 122)`);if(ext)s+=Poly([[48,159],[62,151],[78,159],[78,176],[62,185],[48,176]],p.gold)+C(63,168,6,p.ink);else s+=L(115,129,115,177,p.gold,4)+C(181,169,13,p.ink);break;
 case 'alicates':
   s=P(`M89 ${37+q*3} L107 80 L123 104 L141 79 L156 ${37+q*3} L171 52 L145 113 L174 204 L158 214 L123 141 L90 214 L74 204 L103 114 L75 52Z`,p.ink)+P('M103 132 L88 195','none',p.rust,13)+P('M143 131 L163 195','none',p.teal,13)+C(123,114,10,p.gold);if(ext)s+=L(91,75,157,54,p.blue,4)+L(88,91,164,72,p.blue,3);else s+=L(113,104,132,121,p.paper,2);break;
 case 'sierra':
   s=P(`M58 78 L${212-q*3} ${112+q*4} L${204-q*2} 163 L183 151 L171 165 L159 150 L146 163 L134 146 L119 158 L105 142 L88 154 L75 137 L58 145Z`,p.blue,p.ink,2)+P('M25 65 H69 V155 H30 L21 126Z',p.rust,p.ink,2)+P('M36 85 H53 V131 H35Z',p.paper);if(ext)s+=Poly([[105,174],[195,184],[183,211],[93,200]],p.gold)+detail(117,184,50,2);else s+=C(44,72,3,p.ink)+C(43,144,3,p.ink);break;
 case 'taladro':
   s=P(`M61 54 H158 L182 71 V110 H131 L123 179 H74 L92 108 H61Z`,p.teal)+R(164,70,32+q*3,32,p.ink)+P(`M${196+q*3} 77 L228 83 L${196+q*3} 94Z`,p.blue)+R(65,174,75+q*3,27,p.ink,4)+R(97,118,17,31,p.rust);
   for(let i=0;i<4+q;i++)s+=L(70+i*10,63,70+i*10,92,p.paper,2);if(ext)s+=P('M81 195 Q47 223 25 183 Q12 148 40 127','none',p.ink,4);else s+=R(64,178,76+q*3,10,p.gold);break;
 case 'herramientas':
   s=R(34,114,175,91,p.rust,4)+R(30,113,183,14,p.ink)+R(102,120,37,25,p.gold)+P('M85 110 V85 H157 V110','none',p.ink,7);
   if(ext)s=G(drawObject('martillo',q,p),'translate(38 6) scale(.5)')+G(drawObject('destornillador',q,p),'translate(100 7) scale(.45)')+s+R(56,151,46,18,p.paper);else s+=R(35,78-q*3,174,34+q*3,p.teal,4)+P('M96 80 V62 H148 V80','none',p.ink,6);break;
 case 'carretilla':
   s=P(`M42 ${89-q*3} L186 ${102-q*2} L152 163 H76Z`,p.teal)+L(47,125,215,180,p.ink,6)+wheel(74,187,27,p,5)+L(158,164,168,208,p.ink,5)+L(168,208,191,208,p.ink,5);
   if(ext)s+=G(drawObject('maceta',q,p),'translate(38 21) scale(.55)')+L(151,97,175,33,p.ink,5);else s+=Poly([[59,89],[91,63],[112,85],[151,72],[178,101]],p.gold);break;
 case 'escalera':
   s=L(77-q*3,37,43,218,p.ink,8)+L(152+q*2,37,176,218,p.ink,8);for(let i=0;i<5+q;i++){let yy=56+i*143/(4+q);s+=L(74-q*2-i*3,yy,154+q*2+i*3,yy,p.gold,7);}if(ext)s+=L(149+q*2,37,222,218,p.teal,6)+L(170,156,197,157,p.teal,3);else s+=R(80-q,21,73+q*2,21,p.rust,2);break;
 case 'pala':
   s=P('M106 70 L107 37 Q121 23 137 37 L136 70Z','none',p.ink,8)+R(116,66,12,98,p.gold)+P(`M${85-q*2} 153 H${159+q*2} L${151+q*2} 192 Q121 225 ${93-q*2} 192Z`,p.teal)+L(122,159,122,200,p.paper,2);if(ext)s+=Poly([[34,212],[47,184],[75,191],[98,212]],p.rust)+leaf(62,187,.45,p.sage,-25,q);else s+=L(100,164,99,178,p.ink,2)+L(143,166,142,179,p.ink,2);break;
 // Scientific equipment.
 case 'microscopio':
   s=P(`M98 72 Q${179+q*4} 86 162 157 L131 187 H193 V204 H56 V187 H99 Q143 147 117 117Z`,p.teal)+G(R(81,43,32+q*2,77,p.ink,3)+R(74,34,47+q*2,15,p.rust),'rotate(24 100 75)')+R(63,139,103,10,p.ink)+C(151,125,17,p.gold)+C(151,125,6,p.ink);
   if(ext)s+=R(74,123,41,12,p.blue)+L(80,121,103,121,p.paper,2)+R(96,163,39,15,p.paper);else s+=C(114,173,13,p.paper)+L(177,157,198,157,p.ink,4);break;
 case 'telescopio':
   s=G(R(39,91-q*3,143,44+q*6,p.teal,3)+R(29,87-q*3,20,52+q*6,p.ink,3)+R(180,100-q,29,27+q*2,p.gold)+R(206,103-q,16,21+q*2,p.ink),`rotate(-25 121 121)`)+L(119,132,119,201,p.ink,5)+L(119,168,75,216,p.ink,4)+L(119,168,173,216,p.ink,4);
   s+=ext?G(drawObject('brujula',q,p),'translate(148 138) scale(.26)'):C(168,33,9,p.gold)+star(195,50,9,4,.3,p.rust);break;
 case 'matraz':
   s=P(`M${104-q*2} 39 H${138+q*2} V106 L${189+q*3} 187 Q189 207 120 207 Q51 207 ${53-q*3} 187 L${104-q*2} 106Z`,p.blue,p.ink,2)+P(`M88 140 H153 L${179+q*2} 184 Q179 197 120 197 Q61 197 63 183Z`,p.rust)+R(101-q*2,31,40+q*4,12,p.ink);
   for(let i=0;i<q+3;i++)s+=C(97+(i*17)%50,168-(i%3)*11,4+i%3,p.gold);if(ext)s+=cloud(122,11,.32,p.teal,q);else s+=L(108,58,108,90,p.paper,4)+L(82,159,97,159,p.ink,2);break;
 case 'tubos':
   for(let i=0;i<3+q%3;i++){let xx=51+i*138/(3+q%3);s+=P(`M${xx} ${47+(i%2)*16} V164 Q${xx+12} 188 ${xx+24} 164 V${47+(i%2)*16}Z`,p.blue,p.ink,2)+P(`M${xx+4} ${113+(i%3)*12} V161 Q${xx+12} 176 ${xx+20} 161 V${113+(i%3)*12}Z`,i%2?p.gold:p.rust)+R(xx-2,45+(i%2)*16,28,7,p.ink);}
   s+=R(36,133,173,10,p.ink)+R(35,182,174,11,p.teal)+L(46,145,46,206,p.ink,5)+L(199,145,199,206,p.ink,5);if(ext)s+=G(drawObject('pluma',q,p),'translate(146 -3) scale(.33)');else s+=R(95,193,51,10,p.gold);break;
 case 'balanza':
   s=R(113,57,14,137,p.ink)+Poly([[67,191],[174,191],[194,207],[45,207]],p.teal)+L(44,74-q*3,198,74+q*3,p.ink,5)+C(120,74,9,p.gold)+L(50,78-q*3,30,145,p.ink,2)+L(50,78-q*3,78,145,p.ink,2)+P('M24 145 Q51 182 83 145Z',p.gold)+L(188,77+q*3,164,153,p.ink,2)+L(188,77+q*3,214,153,p.ink,2)+P('M160 153 Q189 190 221 153Z',p.rust);
   s+=ext?G(drawObject('manzana',q,p),'translate(23 104) scale(.23)')+R(173,131,22,18,p.ink):R(40,126,27,19,p.ink)+C(190,141,10,p.blue);break;
 case 'globo':
   s=C(120,105,68+q,p.blue)+P(`M82 48 L114 41 L132 63 L116 83 L130 102 L113 126 L101 101 L77 83Z`,p.sage)+P('M152 108 L178 123 L164 149 L146 156 L136 132Z',p.gold)+E(120,106,35-q*2,67,'none',{stroke:p.paper,'stroke-width':1.2})+P(arc(120,105,75,75,-2.3,.9),'none',p.ink,6)+L(146,172,146,192,p.ink,4)+E(132,203,53,9,p.teal);
   if(ext)s+=L(49,111,192,92,p.ink,2)+C(159,85,5,p.rust);else s+=P('M56 105 Q122 84 183 105 M59 124 Q120 105 180 124','none',p.paper,1);break;
 case 'brujula':
   s=C(120,126,72+q*2,p.ink)+C(120,126,62+q*2,p.paper)+Poly([[120,64-q*2],[142,126],[120,178+q*2],[99,126]],p.teal)+Poly([[120,65-q*2],[142,126],[120,126]],p.rust)+C(120,126,6,p.gold)+C(120,33,13,'none',{stroke:p.ink,'stroke-width':4});
   for(let i=0;i<12+q;i++){let a=i*6.28/(12+q);s+=L(120+Math.cos(a)*53,126+Math.sin(a)*53,120+Math.cos(a)*59,126+Math.sin(a)*59,p.ink,2);}if(ext)s+=P('M144 46 Q212 24 217 59 Q222 93 193 98','none',p.rust,4);else s+=C(54,57,6,p.gold);break;
 case 'iman':
   s=P(`M${63-q*2} 51 V135 Q120 209 ${177+q*2} 135 V51 H${151+q} V133 Q121 165 ${88-q} 133 V51Z`,p.rust)+R(63-q*2,46,25+q,32,p.paper)+R(151+q,46,26+q,32,p.teal);
   if(ext)s+=L(76,24,65,8,p.ink,2)+L(170,25,182,9,p.ink,2)+L(115,33,124,12,p.ink,3);else s+=P('M100 78 Q120 95 141 77 M96 92 Q120 112 145 91','none',p.gold,2);break;
 case 'molecula':{
   let pts=Array.from({length:4+q},(_,i)=>[120+Math.cos(i*6.28/(4+q))*(60+(i%2)*12),121+Math.sin(i*6.28/(4+q))*(56+(i%2)*14)]);for(let i=0;i<pts.length;i++)s+=L(120,121,...pts[i],p.ink,5)+L(...pts[i],...pts[(i+1)%pts.length],p.teal,2);s+=C(120,121,ext?25:18,p.rust);pts.forEach((pt,i)=>s+=C(...pt,11+i%3*3,i%2?p.gold:p.blue));if(ext)s+=L(120,121,121,26,p.ink,4)+C(121,25,15,p.teal);break;}
 case 'satelite':
   s=Poly([[99,91],[136,70],[159,104],[121,126]],p.gold)+Poly([[99,91],[121,126],[123,169],[99,131]],p.rust)+Poly([[121,126],[159,104],[159,148],[123,169]],p.teal)+G(R(23,97,64,59,p.blue)+R(173,75,56,63,p.blue),`rotate(${-12-q*4} 120 120)`)+L(73,130,116,121,p.ink,5)+L(149,108,185,102,p.ink,5);
   for(let i=0;i<3+q%2;i++)s+=L(30+i*16,95,35+i*16,151,p.paper,2);s+=P(ext?'M107 81 Q62 59 112 27 L132 58Z':'M121 76 Q161 54 133 32 L112 54Z',p.paper,p.ink,2)+L(113,57,92,36,p.ink,2)+C(92,36,4,p.rust);break;
 // Foods.
 case 'manzana':
   s=P(`M120 79 C${51-q*3} 39 ${30-q*2} 130 78 181 Q108 207 120 190 Q148 210 177 178 C${222+q*2} 109 ${178+q*3} 39 120 79Z`,p.rust)+P('M119 86 Q125 44 138 35','none',p.ink,6)+leaf(126,67,.65,p.sage,62,q)+P('M73 110 Q62 135 77 153','none',p.paper,4);
   if(ext)s+=P('M138 193 Q163 214 196 187 L152 138Z',p.paper,p.ink,1.2)+C(161,170,3,p.ink)+C(170,179,3,p.ink);else s+=C(166,94,5,p.gold);break;
 case 'pera':
   s=P(`M115 61 Q${85-q*3} 57 94 104 C${29-q*3} 166 62 209 122 211 C${186+q*3} 211 203 157 151 105 Q149 60 130 61Z`,p.gold)+P('M122 67 Q131 39 149 31','none',p.ink,6)+leaf(132,59,.65,p.teal,62,q)+P('M81 151 Q72 178 92 187','none',p.paper,4);
   if(ext)s+=E(185,173,25,34,p.paper)+P('M184 143 Q170 171 185 198 Q200 172 184 143Z',p.gold)+C(185,176,3,p.ink);else for(let i=0;i<5+q;i++)s+=C(115+(i*13)%50,146+(i*17)%38,1.5,p.rust);break;
 case 'pan':
   s=P(`M${37-q*2} 146 Q${41-q*2} ${59-q*3} 119 64 Q${201+q*2} 63 ${205+q*2} 146 V184 H${37-q*2}Z`,p.gold,p.ink,2)+P(`M${38-q*2} 146 Q120 165 ${204+q*2} 146 V184 H${38-q*2}Z`,p.rust);for(let i=0;i<3+q%3;i++)s+=P(`M${65+i*31} 99 Q${81+i*31} 107 ${71+i*31} 128`,'none',p.paper,7);
   if(ext)s+=P('M162 129 Q189 107 213 133 V194 H161Z',p.paper,p.ink,2)+C(186,155,3,p.gold)+C(177,173,3,p.gold);else s+=E(120,188,93,5,p.ink);break;
 case 'queso':
   s=Poly([[37,144],[136,55-q*3],[204,117],[204,184],[37,193]],p.gold,p.ink,2)+Poly([[37,144],[136,55-q*3],[204,117]],p.paper,p.ink,2)+C(93,162,10+q,p.rust)+C(174,151,12+q,p.rust)+E(130,107,11,6,p.gold)+E(98,124,7,4,p.gold);
   if(ext)s+=Poly([[153,185],[204,188],[189,215],[139,211]],p.paper,p.ink,1.4)+C(170,201,4,p.gold);else s+=C(138,178,6,p.rust)+L(43,150,194,124,p.ink,1.2);break;
 case 'pastel':
   s=E(120,204,98,9,p.teal)+R(49-q*3,113,143+q*6,84,p.rust,4)+R(49-q*3,137,143+q*6,13,p.paper)+E(120,113,71.5+q*3,16,p.paper)+P(`M${49-q*3} 114 Q70 145 88 119 Q109 139 128 118 Q153 147 173 117 Q187 133 ${192+q*3} 114`,p.paper,p.paper,3);
   for(let i=0;i<(ext?5:2)+q%3;i++){let xx=75+i*22;s+=R(xx,73,5,37,p.teal)+P(`M${xx} 69 Q${xx-6} 59 ${xx+2} 48 Q${xx+12} 60 ${xx+5} 69Z`,p.gold);}if(ext)s+=C(186,189,6,p.gold);else s+=leaf(163,102,.4,p.teal,50);break;
 case 'helado':
   s=Poly([[79-q*4,115],[170+q*3,115],[122,217]],p.gold,p.ink,2)+L(92,135,137,186,p.rust,2)+L(143,131,111,180,p.rust,2)+C(101,107,29+q,p.rust)+C(145,110,30,p.paper)+C(122,68,32,p.teal);
   if(ext)s+=C(124,29,10,p.rust)+L(121,20,132,8,p.ink,2)+R(160,41,12,69,p.gold);else s+=P('M111 100 Q95 141 111 143 Q121 144 119 109Z',p.rust)+C(114,61,4,p.gold);break;
 case 'verduras':
   s=Poly([[58,94],[110+q*3,111],[61,206]],p.rust)+leaf(73,108,.8,p.sage,-30,q)+leaf(72,103,.8,p.teal,23,q)+E(156,148,37+q,49,p.teal)+leaf(155,106,.65,p.sage,-20,q)+C(119,186,25,p.rust)+leaf(122,166,.4,p.teal,25,q);
   if(ext)s+=Poly([[25,149],[187,210],[186,224],[19,165]],p.paper)+C(180,180,17,p.paper)+C(180,180,10,p.gold);else s+=R(106,187,28,10,p.gold);break;
 case 'cereal':
   s=Poly([[63-q*2,51],[147+q*4,41],[181+q*2,64],[178+q*2,204],[63-q*2,197]],p.rust,p.ink,2)+Poly([[147+q*4,41],[181+q*2,64],[178+q*2,204],[147+q*4,187]],p.gold)+R(79-q,78,52+q*3,66,p.paper)+leaf(105+q,137,.73,p.teal,0,q)+E(106,166,27+q,12,p.gold);
   if(ext)s+=Poly([[62-q*2,51],[84,22],[153,31],[147+q*4,41]],p.paper)+Poly([[147+q*4,41],[185,29],[181+q*2,64]],p.teal)+G(drawObject('platos',q,p),'translate(136 139) scale(.35)');else s+=L(77,63,132+q*3,58,p.paper,3);break;
 case 'bocadillo':
   s=P(`M${33-q*2} 118 Q120 ${36-q*4} ${210+q*2} 118Z`,p.gold,p.ink,2)+P(`M${32-q*2} 126 Q61 114 83 135 Q118 112 139 131 Q175 112 ${210+q*2} 132 L205 147 H36Z`,p.teal)+R(39,146,168,13,p.rust,5)+P('M35 162 H206 Q193 193 119 194 Q56 194 35 162Z',p.gold,p.ink,2);
   for(let i=0;i<7+q;i++)s+=L(62+(i*21)%121,96-(i%3)*12,67+(i*21)%121,94-(i%3)*12,p.paper,2);if(ext)s+=L(121,129,122,49,p.ink,2)+Poly([[122,49],[159,53],[122,71]],p.rust);else s+=P('M74 150 L99 168 L132 150Z',p.paper);break;
 case 'frutero':
   s=C(81,119,29+q,p.rust)+G(drawObject('pera',q,p),'translate(76 30) scale(.52)')+C(171,126,28,p.teal)+P(`M${39-q*2} 138 H${211+q*2} Q174 200 123 200 Q71 198 ${39-q*2} 138Z`,p.gold,p.ink,2)+E(124,137,85+q*2,11,'none',{stroke:p.ink,'stroke-width':2})+R(99,199,47,10,p.ink);
   if(ext)s+=leaf(70,114,.75,p.sage,-50,q)+G(drawObject('manzana',q,p),'translate(155 137) scale(.28)');else s+=C(169,101,17,p.gold)+P('M89 174 Q119 185 160 173','none',p.paper,3);break;
 // Clothes and personal objects.
 case 'sombrero':
   s=E(121,161,96,20+q*2,p.ink)+P(q%2?`M67 148 L82 ${69-q*3} L154 66 L173 148Z`:`M68 149 V83 Q123 ${36-q*5} 174 83 V149Z`,p.rust)+P('M68 125 Q122 150 174 125 V149 Q121 173 68 149Z',p.gold);
   if(ext)s+=leaf(163,128,.9,p.teal,34,q);else s+=R(139,132,23,18,p.ink,2)+R(145,137,11,8,p.paper);break;
 case 'gafas':
   s=q%2?R(30,90,77,67,p.teal,8,{stroke:p.ink,'stroke-width':5})+R(132,90,77,67,p.teal,8,{stroke:p.ink,'stroke-width':5}):E(69,121,40,35+q,p.blue,{stroke:p.ink,'stroke-width':6})+E(169,121,40,35+q,p.blue,{stroke:p.ink,'stroke-width':6});s+=P('M106 116 Q119 108 132 116','none',p.ink,6)+L(29,101,13,75,p.ink,5)+L(209,101,228,79,p.ink,5);
   if(ext)s+=P('M14 77 Q28 38 58 39 M227 80 Q215 40 186 43','none',p.rust,5)+L(47,105,74,131,p.paper,3);else s+=P('M42 113 L58 99 M139 117 L164 98','none',p.paper,3);break;
 case 'mochila':
   s=P('M74 79 Q54 47 73 32 H162 Q184 47 164 79','none',p.ink,7)+P(`M${64-q*3} 82 Q121 ${32-q*3} ${181+q*3} 82 V202 H${64-q*3}Z`,p.teal)+R(79-q*2,128,87+q*4,56,p.gold,7)+L(81-q*2,141,164+q*2,141,p.ink,3)+R(86,68,14,63,p.ink)+R(147,68,14,63,p.ink);
   if(ext)s+=R(46-q*2,129,23,56,p.rust,5)+G(drawObject('botella',q,p),'translate(140 7) scale(.4)');else s+=R(106,158,33,13,p.paper)+P('M105 62 V43 H137 V62','none',p.ink,4);break;
 case 'maleta':
   s=R(38-q*2,70,166+q*4,125,p.rust,10)+P(`M${94-q*3} 68 V44 H${149+q*3} V68`,'none',p.ink,7)+R(65,71,17,123,p.ink)+R(161,71,17,123,p.ink)+R(99,119,42,24,p.gold,2)+C(76,131,4,p.paper)+C(170,132,4,p.paper);
   if(ext)s+=wheel(63,199,10,p)+wheel(181,199,10,p)+R(90,26,64,11,p.ink,4)+L(97,39,97,67,p.ink,4);else s+=G(paper(117,74,35,34,p,false),'rotate(12 133 90)')+P('M138 83 L148 56','none',p.ink,1.5);break;
 case 'paraguas':
   s=P(`M27 110 Q122 ${-4+q*7} 219 110 Q193 94 168 111 Q144 94 121 111 Q100 93 75 111 Q50 94 27 110Z`,p.teal,p.ink,2)+P('M28 110 Q122 96 219 110 M75 110 Q91 53 121 38 Q153 56 169 111','none',p.ink,1.5)+L(121,35,121,184,p.ink,4)+P('M121 184 Q122 220 146 203','none',p.rust,7);
   if(ext)s+=P('M28 133 L18 149 M209 133 L221 152 M61 150 L54 164','none',p.blue,4);else s+=Poly([[122,41],[133,56],[125,68]],p.gold)+L(122,18,122,37,p.ink,2);break;
 case 'abrigo':
   s=P(`M91 48 L${55-q*4} 69 L${27-q*2} 142 L57 155 L76 112 L66 211 H181 L168 112 L190 155 L219 142 L${184+q*4} 69 L148 48Z`,p.rust)+P('M91 48 L121 92 L108 125 L87 77Z',p.gold)+P('M148 48 L121 92 L136 125 L155 76Z',p.gold)+L(121,97,121,204,p.ink,2)+R(81,149,25,27,p.paper)+R(140,149,26,27,p.paper);
   for(let i=0;i<3+q%3;i++)s+=C(128,129+i*17,3,p.ink);if(ext)s+=R(70,138,100,12,p.ink)+R(113,135,20,18,p.gold);else s+=P('M91 48 Q119 24 148 48','none',p.ink,5);break;
 case 'zapatos':
   s=P(`M39 97 H95 L117 ${146-q*4} Q171 139 167 182 H36Z`,p.rust)+R(32,179,137,11,p.ink)+P(`M127 59 H174 L189 114 Q232 109 222 148 H123Z`,p.teal)+R(120,147,103,10,p.ink);
   for(let i=0;i<3+q%3;i++)s+=L(83+i*4,119+i*9,101+i*4,116+i*9,p.paper,2)+L(160+i*4,80+i*9,179+i*4,80+i*9,p.paper,2);
   if(ext)s+=R(48,82,36,20,p.gold)+R(137,43,25,21,p.gold);else s+=P('M55 101 V154 M137 62 V123','none',p.gold,3);break;
 case 'bufanda':
   s=P(`M64 45 Q122 17 176 45 L168 89 Q147 110 135 105 L147 206 H107 L95 105 Q61 101 60 84Z`,p.rust)+P('M66 44 L145 66 L168 45 M96 105 L135 105','none',p.ink,2)+P('M143 63 L174 88 L199 189 L163 201 L135 104Z',p.gold);
   for(let i=0;i<4+q;i++)s+=L(111+i*4,205,111+i*4,219,p.ink,2);for(let i=0;i<3+q%3;i++)s+=L(102,129+i*18,139+i*2,129+i*18,p.paper,4);
   if(ext)s+=P('M163 119 L188 133 M165 145 L191 157','none',p.teal,5);else s+=R(110,170,28,17,p.teal);break;
 case 'pulsera':
   s=P(`M${102-q*2} 22 H${143+q*2} L150 73 H96Z`,p.rust)+P('M96 164 H150 L140 224 H103Z',p.rust)+R(74-q*2,66,96+q*4,104,p.ink,14)+R(83-q*2,75,78+q*4,85,p.paper,9)+L(122,116,122,89,p.ink,3)+L(122,116,146,132,p.teal,3)+C(122,116,5,p.gold)+R(172+q*2,95,12,21,p.ink,3);
   if(ext)s+=R(104,39,37,8,p.ink)+R(111,180,19,17,p.gold);else for(let i=0;i<4;i++)s+=C(122,183+i*9,2,p.ink);break;
 case 'bolsa':
   s=P(`M${57-q*2} 84 H${187+q*2} L${201+q*2} 210 H${43-q*2}Z`,p.gold,p.ink,2)+P(`M86 94 V58 Q120 ${7+q*5} 154 58 V94`,'none',p.ink,7)+R(88,121,64,60,p.paper,3)+leaf(121,172,.71,p.teal,0,q);
   if(ext)s+=G(drawObject('pan',q,p),'translate(51 -9) scale(.51)')+leaf(162,84,.65,p.sage,25,q);else s+=L(67,97,60,194,p.rust,3)+L(174,98,186,194,p.rust,3);break;
 // Furnishings and street furniture.
 case 'sofa':
   s=R(39-q*2,71,163+q*3,98,p.teal,15)+R(38,139,163,54,p.rust,6)+R(23,122,35,75,p.teal,9)+R(181,121,36,75,p.teal,9)+L(39,196,32,215,p.ink,6)+L(199,196,207,215,p.ink,6);
   for(let i=0;i<2+q%3;i++)s+=R(61+i*116/(2+q%3),92,105/(2+q%3),52,p.gold,7);
   if(ext)s+=G(drawObject('bufanda',q,p),'translate(1 84) scale(.49)');else s+=R(124,104,43,43,p.paper,3)+L(127,105,164,144,p.rust,2);break;
 case 'sillon':
   s=Poly([[58-q*3,55],[165+q*4,49],[181,145],[60,158]],p.rust)+R(49,142,134,45,p.rust,7)+R(32,120,33,74,p.teal,8)+R(170,117,38,77,p.teal,8)+L(52,190,40,221,p.ink,5)+L(184,191,204,221,p.ink,5);
   if(ext)s+=R(78,77,78,62,p.gold,10)+L(66,194,172,194,p.ink,3);else s+=Poly([[100,87],[160,101],[145,147],[87,131]],p.paper)+leaf(123,128,.44,p.teal,0,q);break;
 case 'cama':
   s=R(36,66,177,92,p.teal,9)+Poly([[39,135],[208,130],[224,199],[20,207]],p.paper,p.ink,2)+Poly([[32,165],[213,157],[224,199],[20,207]],p.rust)+L(35,208,33,224,p.ink,5)+L(212,200,218,223,p.ink,5)+R(52,111,65,31,p.gold,10)+R(129,110,64,31,p.gold,10);
   if(ext)s+=L(37,63,37,25,p.ink,5)+L(209,64,209,26,p.ink,5)+P('M36 25 Q121 62 210 26','none',p.rust,17);else for(let i=0;i<q+3;i++)s+=L(67+i*29,167,68+i*30,198,p.gold,3);break;
 case 'estanteria':
   s=R(39-q*2,25,167+q*3,188,p.ink,2)+R(47-q*2,32,151+q*3,172,p.paper);for(let j=0;j<3+q%2;j++){let yy=77+j*43;for(let i=0;i<4+q%3;i++)s+=R(53+i*22,yy-(22+(i+j)%3*7),14+(i%2)*4,22+(i+j)%3*7,[p.rust,p.teal,p.gold][i%3]);s+=R(47-q*2,yy,151+q*3,8,p.ink);}if(ext)s+=G(drawObject('globo',q,p),'translate(134 2) scale(.28)');else s+=L(133,29,133,206,p.ink,4);break;
 case 'banco':
   for(let j=0;j<3+q%2;j++)s+=R(26-q,65+j*20,188+q*2,13,p.gold,2);s+=Poly([[29,134],[211,134],[224,157],[17,157]],p.rust)+L(44,108,44,212,p.ink,6)+L(196,108,196,212,p.ink,6)+L(48,162,69,207,p.ink,4)+L(190,162,172,207,p.ink,4);
   if(ext)s+=P('M28 150 V114 H61 M207 149 V111 H176','none',p.teal,6);else s+=P('M32 175 Q122 209 209 175','none',p.ink,3);break;
 case 'maceta':
   s=G(plant(120,149,1.35,p,q%3),'');if(ext)s+=leaf(104,110,.75,p.rust,-68,q)+R(80,193,87,10,p.ink);else s+=P('M107 150 L110 185 M129 150 L128 185','none',p.paper,3);break;
 case 'regadera':
   s=P(`M82 108 Q${26-q*2} 46 64 161`,'none',p.ink,8)+P(`M144 115 L197 ${65-q*3} L209 80 L161 161Z`,p.teal)+P('M76 99 H151 L161 185 Q116 205 61 183Z',p.teal)+E(114,99,37,8,p.ink)+E(205,73-q*2,19,8,p.gold,{transform:`rotate(-33 205 ${73-q*2})`});
   if(ext)s+=P('M217 79 L225 99 M210 86 L217 110 M222 74 L233 90','none',p.blue,3)+leaf(109,167,.7,p.paper,0,q);else s+=R(86,131,49,27,p.gold)+P('M94 95 Q87 48 132 48 Q154 53 149 106','none',p.ink,6);break;
 case 'farola':
   s=R(112,100,11+q*2,106,p.ink)+E(118,208,39,8,p.ink)+P(ext?'M120 114 L120 52 Q172 11 191 58':'M118 113 L118 46','none',p.ink,6);
   if(ext)s+=P('M154 59 Q188 30 222 59Z',p.teal)+P('M164 61 Q186 90 209 61Z',p.gold)+L(121,87,84,54,p.ink,4)+P('M54 57 Q84 25 114 57Z',p.rust);else s+=P(`M${70-q*3} 49 H${169+q*3} L153 106 H88Z`,p.gold,p.ink,3)+Poly([[63-q*3,46],[119,17-q*2],[178+q*3,46]],p.teal)+L(101,48,106,106,p.ink,2)+L(141,48,135,106,p.ink,2);break;
 case 'buzon':
   s=R(112,151,12+q*2,64,p.ink)+P(`M${51-q*2} 92 Q53 45 92 50 H171 Q203 57 203 96 V158 H${51-q*2}Z`,p.teal)+P('M51 92 Q63 47 93 51 Q123 55 124 97 V158 H51Z',p.rust,p.ink,2)+R(62,88,50,10,p.ink)+R(152,68,8,63,p.ink)+R(157,63,41,24,p.gold);
   if(ext)s+=P('M53 154 L33 194 L109 193 L123 154Z',p.paper,p.ink,2)+G(drawObject('sobre',q,p),'translate(52 116) scale(.32)');else s+=L(74,121,99,121,p.paper,4);break;
 case 'quiosco':
   s=R(55-q*2,83,140+q*3,126,p.teal)+Poly([[37-q*2,87],[123,27-q*3],[213+q*2,87]],p.rust)+R(67,110,114,63,p.paper)+R(48,173,154,13,p.gold)+L(94,111,94,173,p.ink,3)+L(145,111,145,173,p.ink,3);
   if(ext)s+=Poly([[51,97],[194,97],[212,121],[29,121]],p.gold)+G(drawObject('periodico',q,p),'translate(79 136) scale(.29)');else s+=R(82,188,79,17,p.ink)+C(121,145,15,p.gold);break;
 // Sport, travel and deliberately fictional props.
 case 'balon':{
   const morph=q; s=morph===4?E(121,124,86,52,p.rust):C(121,125,72,p.gold,{stroke:p.ink,'stroke-width':2});
   if(morph===0){s+=Poly([[121,91],[145,112],[136,141],[105,143],[96,115]],p.ink);for(let i=0;i<5;i++){let a=i*6.28/5;s+=L(121+Math.cos(a)*29,125+Math.sin(a)*29,121+Math.cos(a)*68,125+Math.sin(a)*68,p.ink,2);}}
   else if(morph===1)s+=L(51,126,191,126,p.ink,3)+P('M123 53 V196 M80 68 Q153 126 83 180 M163 68 Q89 124 163 180','none',p.ink,3);
   else if(morph===2)s+=P('M72 73 Q115 126 74 176 M171 73 Q123 126 168 179','none',p.rust,4)+Array.from({length:7},(_,i)=>L(80+(i<3?i:-i+6)*6,80+i*14,91+(i<3?i:-i+6)*6,86+i*14,p.rust,2)).join('');
   else if(morph===3)s+=P('M72 74 Q121 115 182 92 M62 164 Q98 112 167 66 M118 196 Q115 129 177 111','none',p.paper,8);
   else s+=L(88,122,152,122,p.paper,4)+Array.from({length:6},(_,i)=>L(94+i*10,115,94+i*10,132,p.paper,3)).join('');
   if(ext)s+=P('M34 207 H206 M42 195 H198','none',p.teal,5)+C(194,43,9,p.rust)+L(186,62,182,82,p.ink,2);else s+=P('M82 202 Q120 215 163 204','none',p.teal,3);break;}
 case 'raqueta':
   s=E(119,84,42+q*3,58,p.teal,{stroke:p.ink,'stroke-width':5})+P('M89 131 L113 161 L124 161 L149 131','none',p.ink,4)+R(109,158,19,63,p.rust,4);
   for(let i=0;i<5;i++){let xx=91+i*14;s+=L(xx,48,xx,117,p.paper,1.2);}for(let j=0;j<5;j++)s+=L(86,49+j*14,150,49+j*14,p.paper,1.2);
   if(ext)s+=C(182,173,23,p.gold)+P('M167 157 Q185 174 167 189','none',p.paper,3);else s+=Poly([[181,147],[170,98],[208,118]],p.paper,p.ink,1.4)+C(179,151,9,p.rust);break;
 case 'patines':
   s=P(`M56 51 H${125+q*4} V109 Q185 102 191 159 H46Z`,p.rust)+R(41,155,155,17,p.ink)+C(67,186,19,p.teal)+C(117,186,19,p.gold)+C(167,186,19,p.teal)+P('M66 81 H110 M66 99 H110 M66 116 H110','none',p.paper,3);
   if(ext)s+=R(46,42,82,20,p.gold)+L(57,62,57,147,p.ink,2);else s+=C(207,181,12,p.ink)+L(190,161,208,176,p.ink,3);break;
 case 'patinete':
   s=wheel(50,195,22,p,5)+wheel(191,195,22,p,5)+L(42,178,165,178,p.teal,11)+P(`M166 179 L180 ${43-q*3} H211`,'none',p.ink,6)+L(160,42-q*3,214,42-q*3,p.rust,7)+L(183,143,192,193,p.ink,5);
   if(ext)s+=R(78,157,49,18,p.gold)+L(100,160,100,115,p.ink,4)+R(79,108,44,10,p.teal,4);else s+=L(53,167,153,167,p.gold,3)+R(190,66,12,24,p.teal,4);break;
 case 'cometa':
   s=Poly([[122,25-q*2],[188+q*4,82],[123,159],[53-q*2,82]],p.gold,p.ink,2)+Poly([[122,25-q*2],[123,159],[53-q*2,82]],p.teal)+L(54,82,188+q*4,82,p.ink,2)+L(122,27,123,157,p.ink,2)+P(ext?'M122 159 Q191 190 137 216 Q93 239 71 194':'M123 159 Q82 181 119 192 Q151 207 132 225','none',p.ink,2);
   for(let i=0;i<3+q%3;i++)s+=Poly([[120+i%2*12,167+i*14],[110+i%2*12,160+i*14],[112+i%2*12,175+i*14]],p.rust);break;
 case 'tienda':
   s=Poly([[31,195],[123,41-q*3],[218,194]],p.teal,p.ink,2)+Poly([[31,195],[124,42-q*3],[131,194]],p.gold)+Poly([[73,194],[126,98],[166,194]],p.ink)+P('M27 198 H222','none',p.ink,3)+L(58,154,13,211,p.ink,2)+L(191,151,229,210,p.ink,2);
   if(ext)s+=Poly([[123,97],[97,194],[71,194]],p.rust)+G(drawObject('linterna',q,p),'translate(139 131) scale(.26)');else s+=L(127,99,132,191,p.paper,2)+R(171,160,23,20,p.paper,3);break;
 case 'cofre':
   s=R(38-q*2,116,169+q*3,85,p.rust,4)+R(67,117,14,83,p.gold)+R(165,117,14,83,p.gold)+R(101,122,40,31,p.ink,3)+C(121,137,5,p.gold);
   if(ext)s+=P(`M38 114 V72 Q121 ${3-q*5} 207 72 V114Z`,p.teal,p.ink,2)+P('M55 103 V76 Q121 38 190 76 V103Z',p.ink)+star(84,105,19,5,.4,p.gold)+star(153,100,24,5,.4,p.gold);else s+=P(`M38 116 V85 Q121 ${16-q*5} 207 85 V116Z`,p.rust,p.ink,2)+L(70,74,69,114,p.gold,8)+L(171,74,173,114,p.gold,8);break;
 case 'llave-ornamental':
   s=C(94,76,39+q*2,p.gold,{stroke:p.ink,'stroke-width':2})+C(94,76,23+q,p.paper)+P(`M113 106 L181 190 L163 206 L148 189 L154 181 L144 169 L136 175 L124 160 L132 153 L99 116Z`,p.gold,p.ink,2);
   if(ext)s+=star(94,77,20,5,.45,p.teal)+P('M58 46 Q12 17 30 77 Q37 101 59 97','none',p.rust,4);else s+=C(94,76,9,p.rust)+L(118,119,160,173,p.ink,2);break;
 case 'linterna':
   s=P('M72 70 H172 L161 191 H83Z',p.ink)+R(83,78,77,103,p.gold,4)+P(`M73 71 Q122 ${21-q*3} 172 71Z`,p.teal)+R(73,187,100,18,p.teal,4)+P('M94 49 V27 Q122 5 149 27 V49','none',p.ink,5)+L(101,75,99,185,p.ink,4)+L(146,76,148,187,p.ink,4);
   if(ext)s+=P('M107 151 Q102 126 122 106 Q145 132 131 153Z',p.rust)+C(120,152,8,p.paper);else s+=R(112,125,19,50,p.paper)+P('M114 121 Q109 107 122 93 Q135 110 129 121Z',p.rust);break;
 case 'pergamino':
   s=P(`M64 43 Q39 39 39 61 Q42 76 66 65 V175 Q196 148 195 189 Q195 211 165 208 H73 Q51 207 51 189 V55 H174 Q192 56 194 76 L188 177`,p.paper,p.ink,2)+R(47,41,134,14,p.gold,7)+R(62,193,125,15,p.gold,7)+detail(77,84,91,8);
   if(ext)s+=C(167,176,23,p.rust)+Poly([[152,188],[150,230],[166,217],[182,229],[181,186]],p.teal)+star(167,175,13,7,.68,p.gold);else s+=leaf(125,166,.61,p.teal,30,q);break;
 default: throw new Error('Constructor de objeto no registrado: '+key);
 }
 return G(s,'',{'data-part':'object-'+key});
}

// 4. Articulated fictional people. Hair, clothing and props do not encode religion or ethnicity.
function drawPerson(spec,poseIndex,p=DEFAULT_PALETTE,o={}){
 const pose=POSES[poseIndex%POSES.length], body=spec.body??0, female=spec.hair===1;
 const skin=[p.skin,p.blue,'#a17f66',p.paper,'#ae967b'][body], cloth=['cocinera','medico','cientifica'].includes(spec.key)?p.paper:body%2?p.teal:p.rust;
 const b=body*2, cx=120, left=pose[2], right=pose[3], ll=pose[4],rl=pose[5];
 let out='';
 // Furniture is a separate layer, so the character is not a flattened poster.
 if(poseIndex===8)out+=G(drawObject('silla',body,p),'translate(4 137) scale(.93 .79)');
 const limbs=(a,bx,by,color,width)=>P(`M${bx} ${by} L${a[0]} ${a[1]} L${a[2]} ${a[3]}`,'none',color,width);
 let legs=limbs(ll,105,199,p.ink,12)+limbs(rl,137,199,p.ink,12)+Poly([[ll[2]-6,ll[3]-3],[ll[2]+7,ll[3]-3],[ll[2]+23,ll[3]+7],[ll[2]-10,ll[3]+7]],p.ink)+Poly([[rl[2]-6,rl[3]-3],[rl[2]+7,rl[3]-3],[rl[2]+23,rl[3]+7],[rl[2]-9,rl[3]+7]],p.ink);
 if(o.action==='caminar'||o.action==='correr'){
  let speed=o.action==='correr'?1.5:3;
  legs=motion(limbs(ll,105,199,p.ink,12)+Poly([[ll[2]-8,ll[3]-3],[ll[2]+9,ll[3]-3],[ll[2]+23,ll[3]+7],[ll[2]-9,ll[3]+7]],p.ink),['-8 108 203','10 108 203','-8 108 203'],o,'rotate',speed)+motion(limbs(rl,137,199,p.ink,12)+Poly([[rl[2]-8,rl[3]-3],[rl[2]+9,rl[3]-3],[rl[2]+23,rl[3]+7],[rl[2]-9,rl[3]+7]],p.ink),['10 136 203','-8 136 203','10 136 203'],o,'rotate',speed);
 }
 out+=G(legs,'',{'data-part':'legs'});
 let torso=Poly([[79-b,121],[109,114],[136,114],[155+b,126],[145+b/2,207],[99-b/2,207]],cloth);
 if(female&&body%2)torso+=Poly([[99,179],[143,179],[157,214],[90,214]],cloth);
 torso+=Poly([[109,115],[123,143],[138,115],[133,170],[124,185],[112,168]],p.paper);
 if(['periodista','narrador','medico','ingeniera'].includes(spec.key))torso+=Poly([[121,139],[126,144],[131,184],[121,194],[119,150]],p.gold)+P('M102 120 L105 153 L91 156 M142 121 L138 153 L151 157','none',p.ink,1.5);
 if(['cocinera','panadera','carpintera','vendedora','agricultor'].includes(spec.key))torso+=Poly([[99,140],[140,140],[151,203],[90,203]],p.gold)+R(104,169,29,19,p.paper)+P('M104 142 L109 122 M137 142 L133 120','none',p.ink,2);
 if(spec.key==='astronauta')torso+=R(99,147,40,36,p.paper,5,{stroke:p.ink,'stroke-width':2})+C(109,158,4,p.rust)+R(120,154,13,8,p.teal)+P('M100 182 Q70 200 73 156','none',p.gold,6);
 if(spec.key==='medico')torso+=P('M105 119 V146 Q109 164 120 146 V122 M119 156 Q133 176 142 165','none',p.teal,2)+C(143,165,4,p.ink);
 if(spec.key==='deportista')torso+=R(106,149,30,25,p.gold,2)+L(92,129,84,150,p.paper,4);
 if(spec.key==='nina')torso+=Poly([[100,141],[141,141],[158,218],[88,218]],p.teal)+L(104,144,110,123,p.gold,6)+L(135,144,132,123,p.gold,6)+R(106,162,29,23,p.gold,4)+C(113,170,3,p.rust);
 if(spec.key==='bibliotecaria')torso+=P('M85 123 L102 119 L111 151 L103 226 L86 220Z',p.teal)+P('M142 120 L156 125 L159 222 L137 229 L129 151Z',p.teal)+P('M111 119 Q121 151 137 119 L144 144 L128 151 L132 184 L120 174 L119 144Z',p.gold);
 if(spec.key==='cientifica')torso+=Poly([[91,122],[109,116],[115,151],[117,225],[84,224]],p.paper,p.ink,1)+Poly([[137,117],[153,127],[158,226],[124,225],[128,151]],p.paper,p.ink,1)+R(130,170,21,18,p.blue,1)+L(132,169,132,160,p.rust,2)+L(139,169,139,157,p.teal,2);
 if(spec.key==='vendedora')torso+=Poly([[101,165],[145,165],[162,215],[86,215]],p.gold)+R(102,179,39,22,p.paper,4)+P('M112 181 V199 M132 181 V199','none',p.rust,2);
 if(spec.key==='vecino')torso+=Poly([[95,120],[106,117],[122,141],[140,117],[151,126],[140,152],[122,163],[101,149]],p.teal)+P('M99 181 Q124 171 143 181 V197 H99Z',p.gold)+L(115,150,113,175,p.paper,2)+L(132,150,134,175,p.paper,2);
 if(spec.age==='mayor')torso+=L(94,152,143,157,p.sage,2);
 out+=G(torso,'',{'data-part':'torso'});
 const arm=(a,bx,by,name)=>{
  let s=P(`M${bx} ${by} L${a[0]} ${a[1]} L${a[2]} ${a[3]}`,'none',cloth,13)+P(`M${a[2]} ${a[3]-1} l4 -9 l4 2 l-1 7 l10 -4 l2 4 l-13 8Z`,skin,p.ink,.6);
  if(o.action==='saludar'&&name==='arm-right')s=motion(s,['0 149 132','-20 149 132','9 149 132','-20 149 132','0 149 132'],o,'rotate',3);
  if(o.action==='aplaudir')s=motion(s,name==='arm-left'?['-8 82 130','9 82 130','-8 82 130']:['8 152 131','-9 152 131','8 152 131'],o,'rotate',1.5);
  if(o.action==='escribir'&&name==='arm-right')s=motion(s,['-3 152 131','4 152 131','-3 152 131'],o,'rotate',.75);
  return G(s,'',{'data-part':name,'data-pivot':bx+','+by});
 };
 out+=arm(left,83-b,132,'arm-left')+arm(right,151+b,133,'arm-right');
 // Neck and head are separately addressable animation groups.
 let head=Poly([[113,106],[133,108],[134,124],[122,140],[110,120]],skin)+P('M102 69 Q121 50 139 71 L139 90 L147 96 L138 100 L137 114 Q116 124 104 103Z',skin)+C(102,91,5,skin)+P('M103 87 Q98 60 117 59 Q151 52 144 78 L131 71 L114 78 L110 93Z',p.ink)+C(133,88,1.7,p.ink)+P('M130 106 Q134 110 138 105','none',p.ink,1.3);
 if(female)head+=C(96,88,12,p.ink)+C(92,103,10,p.ink)+C(105,103,5,'none',{stroke:p.gold,'stroke-width':1.4});
 else head+=P('M106 66 Q126 56 139 54 Q152 50 152 61 Q150 71 140 73Z',p.ink);
 if(['abuela','abuelo'].includes(spec.key))head+=P('M104 70 Q124 54 141 71','none',p.blue,5)+C(130,90,7,'none',{stroke:p.ink,'stroke-width':1.1})+L(106,90,122,90,p.ink,1);
 if(['investigadora','cientifica','bibliotecaria','ingeniera'].includes(spec.key)||poseIndex===22)head+=R(121,83,17,13,'none',3,{stroke:p.ink,'stroke-width':1.5})+L(107,87,121,87,p.ink,1.2);
 if(spec.key==='nina')head+=P('M96 70 Q69 67 75 103 L62 117 L89 114 L98 84Z',p.ink)+Poly([[84,78],[75,70],[72,87],[91,89]],p.gold)+P('M138 73 Q161 61 162 91 L173 112 L148 109 L146 88Z',p.ink)+C(151,82,4,p.gold);
 if(spec.key==='bibliotecaria')head+=P('M99 76 Q91 54 113 56 Q113 61 107 82 L101 115 L90 113 L94 86Z',p.ink)+P('M136 68 Q149 73 148 96 L151 112 H141 L141 84Z',p.ink);
 if(spec.key==='cientifica')head+=P('M97 82 H145 V98 H116 L104 92Z','none',p.teal,3)+R(117,79,29,18,'none',5,{stroke:p.gold,'stroke-width':2});
 if(spec.key==='vendedora')head+=P('M100 68 Q117 56 142 67 L151 75 H98Z',p.teal)+Poly([[135,73],[166,76],[143,82]],p.gold);
 if(['cocinera','panadera'].includes(spec.key))head+=cloud(124,50,.44,p.paper,1)+R(105,49,36,17,p.paper,2,{stroke:p.ink,'stroke-width':1});
 if(['agricultor','cartero','viajero'].includes(spec.key))head+=P('M96 71 L105 48 L132 48 L143 68Z',p.gold)+E(120,72,36,5,p.ink);
 if(spec.key==='bombero')head+=P('M96 72 Q99 43 122 43 Q143 44 146 74Z',p.gold)+R(92,72,57,7,p.ink)+R(116,48,13,21,p.rust);
 if(spec.key==='astronauta')head+=C(121,88,35,'none',{stroke:p.paper,'stroke-width':10})+C(121,88,40,'none',{stroke:p.ink,'stroke-width':1.5})+R(152,80,14,20,p.gold,3);
 if(spec.key==='nino')head+=P('M104 68 Q121 39 140 66 H158 L150 74 H99Z',p.rust);
 let tilt=[0,-4,3,10,7,-6,6,-9,0,9,4,-5,3,-4,-8,2,0,9,13,-3,9,-3,2,8,0][poseIndex%25];
 if(o.action==='asentir')head=motion(head,['-5 121 115','9 121 115','-5 121 115'],o,'rotate',3);
 out+=G(head,`rotate(${tilt} 121 115)`,{'data-part':'head','data-pivot':'121,115'});
 const propKey=poseIndex===16?'telefono':poseIndex===3?'libro':poseIndex===4?'cuaderno':poseIndex===19?'taza':spec.prop;
 const withProp=![0,5,6,7,9,10,11,13,14,15,20,21,22,23,24].includes(poseIndex);
 if(withProp){let xx=right[2]-23,yy=right[3]-19;out+=G(drawObject(propKey,body%5,p),`translate(${xx} ${yy}) scale(.21)`,{'data-part':'held-prop'});}
 if(poseIndex===4||poseIndex===17)out+=L(right[2]-2,right[3]+1,right[2]+8,right[3]-21,p.ink,2);
 if(poseIndex===20)out+=R(left[2]-7,left[3]-6,12,10,p.gold,2)+C(left[2]-1,left[3]-1,3,p.paper);
 if(poseIndex===12)out+=G(drawObject('maleta',body%5,p),`translate(${left[2]-24} ${left[3]-11}) scale(.24)`);
 if(spec.key==='fotografa'&&poseIndex!==16)out+=G(drawObject('camara',body%5,p),'translate(94 133) scale(.22)')+P('M109 126 L107 161 M137 128 L138 162','none',p.ink,1.5);
 if(spec.age==='infancia')return G(out,'translate(25 48) scale(.8)',{'data-character':spec.key,'data-pose':pose[0]});
 if(spec.age==='mayor')return G(out,'translate(8 17) scale(.94)',{'data-character':spec.key,'data-pose':pose[0]});
 return G(out,'',{'data-character':spec.key,'data-pose':pose[0]});
}

function landscapeShape(f,v,p,seed){
 const random=rng(seed), lay=v%5, feature=Math.floor(v/5), type=f.type; let s='';
 // Four authored depth layers, with deterministic ridge profiles and feature placement.
 const sky=R(0,0,400,260,p.paper)+Poly([[205+lay*20,0],[360,0],[220,260],[66,260]],p.gold)+C(306-lay*32,47+(lay%2)*19,22+(type%3)*4,p.gold);
 s+=G(sky,'',{'data-layer':'sky'});
 if(!['lunar','flotante','volcan'].includes(f.key))s+=cloud(70+lay*22,43,.65,p.paper,lay)+cloud(290-lay*17,30,.46,p.paper,lay+1);
 let far='M0 160';for(let i=0;i<=7;i++)far+=' L'+n(i*400/7)+' '+n(72+random()*77+(i%2?12:-15));far+=' L400 260 H0Z';s+=G(P(far,p.blue),'',{'data-layer':'far-relief'});
 let middle='M0 180';for(let i=0;i<=6;i++)middle+=' Q'+n(i*400/6+22)+' '+n(94+random()*67)+' '+n(Math.min(400,(i+1)*400/6))+' '+n(132+random()*55);middle+=' L400 260 H0Z';s+=G(P(middle,p.sage),'',{'data-layer':'mid-relief'});
 switch(f.key){
 case 'alpino':case 'lago':case 'glaciar':case 'tundra':
   for(let j=0;j<3+lay%3;j++){let xx=30+j*90,tip=30+(j%2)*29+lay*3;s+=Poly([[xx-42,187],[xx+28,tip],[xx+107,187]],f.key==='glaciar'?p.blue:p.teal)+Poly([[xx+4,tip+42],[xx+28,tip],[xx+61,tip+49],[xx+35,tip+37],[xx+17,tip+50]],p.paper);}
   if(f.key!=='alpino')s+=P(`M0 198 Q${80+lay*15} 147 179 194 Q297 152 400 188 V260 H0Z`,p.blue)+P('M83 218 Q168 201 259 216 M171 239 Q262 220 358 234','none',p.paper,2);
   if(f.key==='glaciar')for(let i=0;i<5;i++)s+=Poly([[i*73,238],[i*73+14,172+(i%3)*12],[i*73+38,198],[i*73+67,239]],p.paper);
   break;
 case 'pinar':case 'abedules':case 'jungla':case 'otono':
   s+=P(`M0 209 Q${103+lay*18} 142 231 188 T400 184 V260 H0Z`,p.teal);
   for(let i=0;i<9+lay*2;i++)s+=tree(10+i*389/(8+lay*2),173+(i%3)*22,.47+(i%3)*.22,p,type);
   if(f.key==='jungla')s+=P('M37 0 Q31 113 111 43 M245 0 Q185 115 338 50','none',p.ink,2);
   break;
 case 'costa':case 'playa':case 'acantilado':case 'isla':case 'archipielago':
   s+=R(0,133,400,127,p.teal)+P(`M0 136 Q${80+lay*18} 123 174 192 Q236 216 ${400-lay*12} 258 H0Z`,p.gold);
   if(f.key==='isla'||f.key==='archipielago'){s+=R(0,130,400,130,p.teal);for(let i=0;i<(f.key==='isla'?2:4)+lay%3;i++){let xx=40+i*97;s+=E(xx,185+(i%2)*27,43+lay*2,17,p.gold)+tree(xx,174+(i%2)*27,.4,p,2);}}
   if(f.key==='costa'||f.key==='acantilado'){s+=Poly([[0,129],[45,113],[62,180],[128,161],[189,254],[0,260]],p.rust);for(let i=0;i<4;i++)s+=P(`M${i*36} ${157+i*13} L${34+i*33} ${168+i*18}`,'none',p.gold,2);}
   for(let i=0;i<5;i++)s+=P(`M${150+i*27} ${157+i*16} q30 -6 62 1`,'none',p.paper,1.5);
   if(f.key==='playa')s+=tree(50+lay*14,225,.89,p,2);break;
 case 'desierto':case 'oasis':case 'canon':
   s+=P(`M0 166 Q${78+lay*14} 92 193 173 Q315 117 400 147 V260 H0Z`,p.gold)+P(`M0 228 Q${129-lay*13} 141 246 202 T400 174 V260 H0Z`,p.rust);
   if(f.key==='desierto'){s+=P(`M${83+lay*5} 192 V78 Q143 33 185 86 V190 H155 V113 Q132 87 116 115 V192Z`,p.ink)+Poly([[195,215],[213,94+lay*5],[244,72],[260,212]],p.gold);}
   if(f.key==='oasis'){s+=E(199,204,94,24,p.teal)+tree(280-lay*16,194,.8,p,2)+tree(115,204,.63,p,2);}
   if(f.key==='canon'){for(let i=0;i<4;i++)s+=Poly([[i*100-10,200],[i*100+15,75+(i%2)*33],[i*100+52,66+(i%2)*33],[i*100+74,211]],i%2?p.rust:p.gold)+L(i*100+7,137,i*100+60,137,p.paper,2);}
   break;
 case 'rio':case 'cascada':case 'pantano':case 'manglar':
   s+=P(`M0 193 Q145 106 400 173 V260 H0Z`,p.teal)+P(`M${236-lay*23} 138 Q${81+lay*19} 168 231 198 Q325 225 109 260 H260 Q382 221 270 189 Q183 164 ${259-lay*23} 138Z`,p.blue);
   if(f.key==='cascada'){s+=Poly([[144-lay*9,100],[210,81],[239,174],[139,173]],p.ink)+P(`M${159-lay*4} 110 H191 L208 177 Q178 189 161 177Z`,p.paper)+P('M163 119 L173 177 M183 116 L193 175','none',p.blue,2);}
   if(f.key==='pantano'||f.key==='manglar'){for(let i=0;i<8+lay;i++){let xx=25+i*43;s+=P(`M${xx} 245 V198 M${xx} 230 L${xx-12} 215 M${xx} 220 L${xx+9} 203`,'none',p.ink,2)+E(xx+2,201,3,11,p.gold);}if(f.key==='manglar')s+=tree(78,202,1,p,4)+P('M78 193 L48 236 M78 193 L105 236','none',p.ink,4);}
   break;
 case 'volcan':
   s+=Poly([[42,222],[142-lay*6,86],[174+lay*8,86],[304,228]],p.ink)+P(`M${139-lay*6} 86 H${177+lay*8} L210 138 L178 130 L185 180 L155 154 L126 167 L144 118Z`,p.rust)+cloud(160,51,.7,p.blue,lay)+cloud(192,19,.6,p.sage,lay+1)+P('M28 246 Q105 226 163 248 T345 244','none',p.gold,6);break;
 case 'campos':case 'sabana':
   s+=P(`M0 174 Q134 ${111+lay*6} 400 177 V260 H0Z`,p.gold)+P('M0 232 Q220 118 400 218 V260 H0Z',p.teal);
   if(f.key==='campos'){for(let i=0;i<7;i++)s+=P(`M${20+i*49} 260 Q${124+i*27} 184 237 169`,'none',p.paper,2.5);s+=tree(72,174,.59,p,3);}else{for(let i=0;i<4+lay;i++)s+=tree(35+i*74,180+(i%2)*28,.55,p,4);}
   break;
 case 'lunar':
   s+=P(`M0 178 Q128 ${126+lay*11} 245 182 T400 167 V260 H0Z`,p.sage);
   for(let i=0;i<6+lay;i++){let xx=26+i*44,yy=202+(i%3)*15;s+=E(xx,yy,21+(i%3)*5,9,p.ink)+E(xx+3,yy+3,18+(i%3)*5,6,p.blue);}
   s+=C(81,46,22,p.rust)+E(81,46,39,8,'none',{stroke:p.ink,'stroke-width':2,transform:'rotate(-20 81 46)'});break;
 case 'flotante':
   s=R(0,0,400,260,p.paper)+C(315,54,32,p.gold)+cloud(97,56,.85,p.blue,1);
   for(let i=0;i<3+lay%3;i++){let xx=24+i*83,yy=110+(i%2)*53;s+=Poly([[xx,yy],[xx+71,yy-9],[xx+48,yy+62]],p.rust)+E(xx+35,yy,38,9,p.sage)+tree(xx+36,yy,.36,p,lay%5);}
   break;
 }
 // Foreground vignettes create meaningful spatial variants in addition to terrain changes.
 if(feature===0){s+=tree(28+lay*5,259,.9,p,['costa','isla','playa','oasis'].includes(f.key)?2:(type+lay)%5)+leaf(337,260,.78,p.ink,-35,lay)+leaf(356,259,.9,p.teal,15,lay+1);}
 else if(feature===1){let xx=55+lay*34;s+=R(xx,202,42,32,p.paper)+Poly([[xx-7,203],[xx+21,178],[xx+48,203]],p.rust)+R(xx+15,216,12,18,p.ink)+R(xx+32,207,8,9,p.teal)+P(`M${xx+22} 234 Q${xx+53} 239 ${xx+32} 260`,'none',p.paper,12);}
 else if(feature===2){s+=P(`M${24+lay*20} 260 Q${137-lay*12} 217 ${252+lay*15} 203`,'none',p.paper,9);for(let i=0;i<3;i++)s+=Poly([[57+i*55,237-i*11],[66+i*55,221-i*11],[78+i*55,241-i*11]],p.ink);}
 else{s+=P(`M${48+lay*13} 229 Q190 184 ${346-lay*8} 225`,'none',p.ink,5)+P(`M${48+lay*13} 215 Q190 168 ${346-lay*8} 211`,'none',p.gold,3);for(let i=0;i<9;i++)s+=L(64+i*28,213-Math.sin(i/8*Math.PI)*23,64+i*28,229-Math.sin(i/8*Math.PI)*21,p.ink,2);}
 return G(s,'',{'data-scene':'landscape-'+f.key});
}

function drawScene(f,v,p,seed){
 const lay=v%4, set=Math.floor(v/4), rand=rng(seed), outdoor=['calle','plaza','granja','estacion'].includes(f.key), ax=20+lay*18;
 let s=R(0,0,400,300,p.paper), wall='';
 if(outdoor){
  wall+=R(0,0,400,212,p.blue)+C(321-lay*34,50,29,p.gold);
  for(let i=0;i<5;i++){let hh=93+(i*27+lay*17)%86,xx=i*89-17;wall+=R(xx,212-hh,77,hh,i%2?p.paper:p.sage);for(let j=0;j<3;j++)for(let k=0;k<3;k++)wall+=R(xx+12+j*21,226-hh+k*27,10,16,p.teal);}
  wall+=P('M0 218 L400 193 V300 H0Z',p.gold)+P('M0 267 L400 220','none',p.paper,3)+tree(17,237,.93,p,4);
  if(f.key==='plaza')wall+=P('M0 282 Q160 190 400 238','none',p.paper,23)+E(242,225,91,28,p.teal)+E(242,214,75,22,p.paper)+R(232,156,20,55,p.rust)+E(242,159,44,12,p.gold)+P('M242 157 Q204 84 187 146 M242 155 Q279 85 297 145 M242 159 Q245 102 242 86','none',p.teal,3);
  if(f.key==='granja')wall=R(0,0,400,180,p.paper)+P('M0 180 Q190 45 400 180 V300 H0Z',p.sage)+R(202,102,150,103,p.rust)+Poly([[181,102],[274,40],[376,102]],p.ink)+R(248,150,56,55,p.gold)+L(276,151,276,205,p.ink,2);
  if(f.key==='estacion')wall+=R(0,181,400,31,p.teal)+P('M0 92 H400 M30 90 V214 M366 90 V214','none',p.ink,5)+Poly([[0,92],[86,48],[400,58],[400,92]],p.rust);
 }else{
  wall+=Poly([[0,0],[272+lay*17,0],[240+lay*16,197],[0,231]],p.paper)+Poly([[272+lay*17,0],[400,0],[400,224],[240+lay*16,197]],p.gold)+Poly([[0,230],[240+lay*16,197],[400,224],[400,300],[0,300]],p.sage);
  wall+=P(`M${270+lay*17} 0 L${240+lay*16} 197 L400 224`,'none',p.ink,1.5)+P('M16 300 L200 204 M147 300 L233 201 M293 300 L268 205','none',p.paper,1.5);
  if(['invernadero','espacial','planetario','castillo'].includes(f.key)){
   if(f.key==='castillo')for(let i=0;i<3;i++)wall+=P(`M${35+i*119} 145 V74 Q${63+i*119} 11 ${91+i*119} 74 V145Z`,p.teal)+L(63+i*119,43,63+i*119,145,p.paper,2);
   else if(f.key==='planetario'||f.key==='espacial'){wall+=P('M33 155 V82 Q193 -43 368 80 V155Z',p.ink)+C(231,75,28,p.gold);for(let i=0;i<12;i++)wall+=star(49+i*27,67+(i%3)*25,4+i%3,4,.3,p.paper);if(f.key==='espacial')wall+=L(160,28,160,155,p.teal,7)+L(276,27,276,155,p.teal,7);}
   else{wall+=Poly([[31,173],[31,81],[179,18],[356,80],[356,176]],p.blue,p.ink,4);for(let i=0;i<5;i++)wall+=L(51+i*61,73-(i<3?i*12:(4-i)*12),51+i*61,176,p.paper,3);}
  }else{
   wall+=R(35+lay*9,38,93+set*7,105,p.teal,1)+R(41+lay*9,44,81+set*7,93,p.blue)+L(78+lay*9+set*3,42,78+lay*9+set*3,140,p.ink,3)+L(40+lay*9,91,126+lay*9+set*7,91,p.ink,2);
   wall+=Poly([[48+lay*9,141],[124+lay*9+set*7,141],[291,253],[132,274]],p.gold);
  }
  wall+=L(233+lay*12,0,233+lay*12,48,p.ink,2)+P(`M${209+lay*12} 68 Q${233+lay*12} 30 ${263+lay*12} 68Z`,p.ink)+E(236+lay*12,69,27,4,p.gold);
 }
 s+=G(wall,'',{'data-layer':'architecture'});
 const place=(key,x,y,scale=.43,variant=0)=>G(drawObject(key,variant,p),`translate(${x} ${y}) scale(${scale})`,{'data-layer':'furniture','data-object':key});
 // The thematic set is populated with recognisable equipment and spatial relations.
 if(['mercado','biblioteca','libreria','taller','museo','laboratorio','invernadero'].includes(f.key)){
  for(let k=0;k<2+(set%2);k++){let xx=193+k*66-((set%2)?45:0);s+=R(xx,46,59,146,p.ink)+R(xx+4,50,51,137,p.paper);for(let j=0;j<3;j++){s+=R(xx+2,86+j*42,55,5,p.ink);for(let i=0;i<2;i++)s+=place(f.props[(i+j)%4],xx+i*27-3,55+j*42,.13,(v+i+j)%10);}}
 }
 if(f.key==='estudio')s+=place('sillon',21,145,.61,v%10)+place('microfono',151,123,.47,v%10)+place('escritorio',241,162,.48,v%10)+place('radio',288,140,.26,v%10);
 else if(f.key==='mercado')s+=place('cesta',214,199,.43,v%10)+R(263,178,120,30,p.rust)+place('cereal',285,133,.29,v%10)+place('frutero',315,181,.26,v%10);
 else if(f.key==='auditorio')s+=place('piano',183,118,.74,v%10)+place('microfono',90,135,.52,v%10)+R(6,267,390,16,p.rust);
 else if(f.key==='granja')s+=place('carretilla',235,176,.55,v%10)+place('cesta',167,207,.33,v%10)+tree(376,198,.68,p,3);
 else if(f.key==='plaza')s+=place('banco',15,187,.51,v%10)+place('farola',304,63,.77,v%10)+tree(346,198,.56,p,3);
 else if(f.key==='calle')s+=place('banco',170,165,.74,v%10)+place('farola',275,48,.85,v%10)+place('buzon',7,144,.54,v%10);
 else if(f.key==='estacion')s+=place('tren',166,97,.9,v%10)+place('banco',46,178,.57,v%10)+place('reloj',176,5,.25,v%10);
 else if(f.key==='dormitorio')s+=place('cama',125,130,.8,v%10)+place('lampara',28,132,.53,v%10);
 else if(f.key==='salon')s+=place('sofa',158,145,.78,v%10)+place('lampara',36,95,.75,v%10)+place('libro',222,202,.24,v%10);
 else if(f.key==='cocina')s+=place('nevera',263,90,.71,v%10)+place('horno',170,146,.58,v%10)+place('olla',184,122,.31,v%10)+R(30,157,142,17,p.ink)+R(34,174,136,70,p.teal)+place('tetera',40,109,.28,v%10);
 else if(f.key==='castillo')s+=place('cofre',176,159,.76,v%10)+place('pergamino',17,130,.56,v%10)+place('linterna',302,102,.32,v%10);
 else{
   let tableX=lay%2?31:85;s+=place('escritorio',tableX,137,.84,(set*2)%10)+place(f.props[0],tableX+19,130,.28,v%10)+place(f.props[1],tableX+70,129,.31,v%10)+place(f.props[2],tableX+127,124,.30,(v+3)%10);
   if(!['biblioteca','libreria','taller','laboratorio','museo','invernadero'].includes(f.key))s+=place(f.props[3],284,111,.57,v%10);
 }
 // A recurring illustrated cast makes the library useful for human-centred storytelling.
 const actorIndex={estudio:0,investigacion:1,mercado:24,cocina:3,aula:4,laboratorio:21,taller:9,granja:8,museo:11,espacial:13}[f.key]??((set*3+lay)%PEOPLE.length);
 let poseA=f.key==='estudio'?8:[1,3,4,19,13][set], scale=.56+(lay%2)*.045, xx=outdoor?39:13+lay*22;
 if(f.key==='estudio'){xx=35;scale=.49;}
 s+=G(drawPerson(PEOPLE[actorIndex],poseA,p),`translate(${xx} ${112+lay*3}) scale(${scale})`,{'data-layer':'cast'});
 if(set>0||['investigacion','mercado','aula'].includes(f.key))s+=G(drawPerson(PEOPLE[(actorIndex+1+set)%PEOPLE.length],[9,10,19,1,3][set],p),`translate(${258-lay*9} ${120+set*2}) scale(.51)`,{'data-layer':'cast'});
 if(set===4)s+=G(drawPerson(PEOPLE[19],2,p),'translate(170 168) scale(.43)',{'data-layer':'cast'});
 s+=G(plant(369,260,.68,p,v%3),'',{'data-layer':'foreground'});
 if(set%2)s+=G(place('libro',3,237,.34,v%10),'',{'data-layer':'foreground'});
 return G(s,'',{'data-scene':f.key});
}

// 5. Morphology-aware animals: quadrupeds, birds, fish, reptiles, amphibians and invertebrates.
function animalSingle(f,k,p){
 const m=f.morph, tilt=[0,-7,9,0,17,-12][k%6], moving=k===1||k===2||k===5, crouch=k===3;
 let s='', body=p.gold, tail='', face='',headX=178,headY=94;
 const leg=(x,i,wide=7)=>{let bend=moving?(i%2?13:-17):0,y=crouch?154:182;return P(`M${x} 135 L${x+bend} ${155-(k===5?14:0)} L${x+bend+(moving?i%2*12-6:2)} ${y-(k===5?17:0)}`,'none',p.ink,wide)+L(x+bend-4,y-(k===5?17:0),x+bend+10,y-(k===5?17:0),p.ink,wide*.7);};
 if(['Mamíferos'].includes(f.group)){
  const large=['bear','elephant','rhino','hippo','panda'].includes(m),long=['horse','zebra','giraffe','deer','moose','camel'].includes(m);
  let rx=large?67:long?61:50, ry=large?43:long?29:31, by=crouch?140:121;
  if(['kangaroo','koala','monkey'].includes(m)){rx=31;ry=49;by=115;headX=143;headY=62;}
  if(m==='giraffe'){headX=181;headY=47;}
  if(['cat','wolf','raccoon','koala','otter'].includes(m))body=p.blue;
  if(['dog','bear','monkey','moose'].includes(m))body=p.rust;
  if(['sheep','panda','zebra'].includes(m))body=p.paper;
  if(['elephant','rhino','hippo'].includes(m))body=p.teal;
  if(m==='fox')body=p.rust;
  if(!['kangaroo','koala','monkey'].includes(m)){
   for(let i=0;i<4;i++)s+=leg(73+i*25,i,large?11:long?6:7);
  }else{
   s+=P('M95 137 L76 167 L94 185 L121 185 M131 135 L157 162 L150 185 L177 185','none',p.ink,m==='kangaroo'?10:7);
   s+=P('M100 95 L77 119 L89 138 M137 93 L163 121 L151 139','none',body,10);
  }
  if(m==='cat')tail=P(`M64 120 Q16 ${k===5?20:71} 32 50 Q46 30 51 64`,'none',p.ink,8);
  else if(m==='squirrel')tail=P('M75 147 Q11 136 22 74 Q30 24 72 43 Q109 63 65 105Z',p.rust)+P('M53 76 Q30 110 69 124','none',p.gold,4);
  else if(m==='fox')tail=P('M64 119 Q22 119 12 68 Q43 61 88 107Z',body)+Poly([[12,68],[26,100],[38,84]],p.paper);
  else if(m==='monkey')tail=P('M113 148 Q52 182 34 149 Q18 118 43 111 Q67 110 61 130','none',body,9);
  else if(m==='pig')tail=P('M56 116 Q20 85 25 119 Q31 138 39 120','none',body,6);
  else if(m==='raccoon'){
   tail=P('M69 131 Q18 159 18 110','none',body,19);for(let j=0;j<3;j++)tail+=L(24+j*13,132+j%2*4,27+j*13,146+j%2*3,p.ink,6);
  }
  else if(m==='kangaroo')tail=P('M95 133 Q50 186 20 184 L93 151Z',body);
  else if(m==='otter')tail=P('M65 131 Q24 134 5 161 Q57 159 82 149Z',body);
  else if(!['rabbit','koala','hedgehog','bear','panda'].includes(m))tail=P(`M59 115 Q27 ${94+k*5} 31 ${134+k*4}`,'none',body,long?5:8)+(long?E(31,134+k*4,6,10,p.ink):'');
  s+=tail;
  if(m==='camel')s+=P('M68 114 Q64 34 102 97 Q114 31 147 114Z',body);
  if(m==='hedgehog')s+=star(104,114,55,15,.78,p.ink,.15);
  if(m==='sheep'){for(let j=0;j<10;j++)s+=C(109+Math.cos(j*6.28/10)*48,by+Math.sin(j*6.28/10)*22,17,p.paper,{stroke:p.ink,'stroke-width':.7});}
  s+=E(112,by,rx,ry,body);
  if(m==='giraffe')s+=Poly([[142,116],[163,43],[185,45],[166,130]],body);
  if(long&&!['giraffe','camel'].includes(m))s+=Poly([[138,126],[161,74],[179,78],[163,135]],body);
  if(m==='lion')s+=star(178,99,40,12,.86,p.rust,.05);
  if(m==='rabbit')s+=E(139,139,26,33,p.paper)+C(64,119,12,p.paper);
  if(m==='panda')s+=E(103,140,38,22,p.ink)+E(139,104,14,30,p.ink);
  if(m==='koala')s+=C(113,55,19,p.blue)+C(161,51,19,p.blue);
  if(m==='cow')s+=P('M87 96 Q116 86 123 112 L102 127 L82 110Z',p.ink)+P('M128 133 Q153 113 173 137 L151 152Z',p.ink)+E(129,153,13,7,p.rust);
  if(m==='zebra'||m==='tiger')for(let j=0;j<6;j++)s+=P(`M${68+j*17} ${by-ry+4} l13 18 l-5 17 l-6 -18Z`,p.ink);
  if(m==='giraffe')for(let j=0;j<7;j++)s+=Poly([[68+j*15,111+(j%2)*12],[78+j*15,104+(j%2)*12],[87+j*15,117+(j%2)*12],[76+j*15,125+(j%2)*12]],p.rust);
  if(m==='giraffe')for(let j=0;j<3;j++)s+=R(161+j*3,57+j*18,11,9,p.rust,2);
  // Head geometry changes substantially by species, independently of fill color.
  if(['horse','zebra','camel','deer','moose'].includes(m))face=P('M164 74 Q171 66 181 73 L210 100 Q208 113 193 111 L175 94Z',body)+E(207,103,10,8,p.ink);
  else if(m==='giraffe')face=P('M162 45 Q168 33 186 39 L208 48 L205 60 H174Z',body)+C(201,54,4,p.ink);
  else if(m==='elephant')face=E(175,98,33,39,body)+P(`M199 107 Q${236-k*2} 154 208 173 Q184 183 184 160`,'none',body,14)+E(164,95,26,34,p.sage)+P('M198 132 Q220 149 223 128','none',p.paper,5);
  else if(m==='rhino')face=E(181,103,40,30,body)+Poly([[205,90],[222,48],[227,103]],p.paper)+Poly([[183,81],[191,65],[199,88]],p.paper);
  else if(m==='hippo')face=E(176,100,37,29,body)+E(193,121,33,21,body)+C(183,116,3,p.ink)+C(207,116,3,p.ink);
  else if(m==='pig')face=E(175,106,31,29,body)+E(198,119,20,13,p.paper)+C(190,118,3,p.ink)+C(204,118,3,p.ink);
  else if(['kangaroo','koala','monkey'].includes(m))face=C(headX,headY,26,body)+E(headX+6,headY+10,17,14,p.paper)+C(headX+15,headY+6,m==='koala'?7:3,p.ink);
  else if(['dog','wolf','fox','goat','otter'].includes(m))face=P('M156 82 Q182 66 194 90 L219 107 L213 120 L181 121 Q159 113 156 82Z',body)+C(215,107,4,p.ink);
  else if(m==='hedgehog')face=Poly([[143,96],[194,140],[136,147]],p.gold)+C(193,138,4,p.ink);
  else face=E(177,97,27,28,body)+E(192,112,14,9,p.paper)+C(199,107,3,p.ink);
  // Ears, horns and crests are actual geometry, not labels or substituted emojis.
  if(m==='rabbit')face+=E(164,54,9,35,p.gold,{transform:'rotate(-15 164 54)'})+E(184,45,8,38,p.gold,{transform:'rotate(6 184 45)'})+E(183,48,3,26,p.rust);
  else if(['cat','fox','wolf','tiger','lion','goat','kangaroo'].includes(m))face+=Poly([[155,82],[158,52],[175,73]],body)+Poly([[179,74],[192,54],[199,86]],body);
  else if(['bear','panda','dog','sheep','otter'].includes(m))face+=E(158,78,11,m==='dog'?25:12,m==='panda'?p.ink:body)+C(189,72,10,m==='panda'?p.ink:body);
  if(m==='deer')face+=P('M170 76 L158 43 L141 30 M158 44 L160 25 M168 63 L147 58 M184 75 L195 38 L214 30 M197 40 L193 21','none',p.ink,4);
  if(m==='moose')face+=Poly([[167,74],[136,49],[126,22],[135,27],[143,17],[149,43],[158,22],[163,46],[178,43]],p.gold)+Poly([[183,72],[194,40],[207,23],[209,42],[221,32],[225,51],[206,65]],p.gold);
  if(m==='goat')face+=P('M165 75 Q150 31 181 34 M183 78 Q172 35 201 40','none',p.ink,5)+Poly([[190,121],[198,139],[207,119]],p.paper);
  if(m==='cow')face+=P('M158 77 Q143 47 150 41 M187 76 Q211 52 203 44','none',p.gold,6);
  if(m==='giraffe')face+=L(172,39,170,24,p.ink,3)+C(169,21,4,p.rust)+L(185,37,188,22,p.ink,3)+C(189,20,4,p.rust);
  if(['horse','zebra','camel'].includes(m))face+=P('M165 76 L153 86 L140 120 L159 103 L175 81Z',p.ink)+Poly([[167,77],[162,52],[178,66]],body);
  if(m==='raccoon'||m==='panda')face+=E(181,92,12,8,p.ink,{transform:'rotate(-14 181 92)'})+C(182,91,2,p.paper);
  else face+=C(['giraffe'].includes(m)?185:['kangaroo','koala','monkey'].includes(m)?headX+8:180,['giraffe'].includes(m)?46:['kangaroo','koala','monkey'].includes(m)?headY-2:91,2.1,p.ink);
  if(m==='cat')face+=P('M190 109 L220 102 M191 114 L221 114 M187 117 L210 126','none',p.ink,1);
  if(m==='dog')face+=P('M192 121 Q194 138 203 125Z',p.rust);
  s+=G(face,`rotate(${tilt} ${headX} ${headY+20})`);
  return s;
 }
 if(f.group==='Aves'){
  const peng=m==='penguin',owl=m==='owl',flam=m==='flamingo';
  let bx=115,by=flam?94:peng?127:121,bw=peng?37:owl?43:55,bh=peng?59:owl?51:35;
  s+=P(flam?(k%2?'M109 121 L102 164 L128 199 M128 122 L128 199':'M108 124 V198 M131 126 L149 157 L128 161'):`M99 ${by+bh-6} L94 191 M126 ${by+bh-6} L133 191`,'none',p.ink,flam?3:4)+P(flam?'M99 199 H115 M122 199 H143':'M84 193 H102 M122 193 H141','none',p.ink,3);
  if(['eagle','parrot','pigeon'].includes(m))s+=Poly([[74,126],[28,168+(k%2)*12],[89,146]],m==='parrot'?p.rust:p.ink);
  s+=E(bx,by,bw,bh,peng?p.ink:flam?p.rust:owl?p.gold:p.teal);
  if(peng)s+=E(120,140,27,39,p.paper)+C(120,80,28,p.ink)+C(132,78,3,p.paper)+Poly([[139,85],[164,92],[140,97]],p.gold)+P('M82 109 Q45 145 83 166Z',p.ink)+P('M149 115 Q187 156 151 163Z',p.ink);
  else if(owl){s+=Poly([[73,90],[74,47],[100,70],[141,70],[158,44],[156,94]],p.gold)+C(116,91,40,p.gold)+C(96,85,18,p.paper)+C(132,85,18,p.paper)+C(96,85,7,p.ink)+C(132,85,7,p.ink)+Poly([[109,100],[126,100],[117,117]],p.rust);for(let i=0;i<4;i++)s+=P(`M${91+i*15} 132 l7 8 l7 -8`,'none',p.ink,2);s+=P('M80 112 Q61 164 91 162 M151 112 Q169 154 143 162','none',p.rust,6);}
  else{
   if(flam)s+=P(`M145 85 Q191 95 168 51 Q153 ${20+k*3} 187 23`,'none',p.rust,12)+C(187,23,13,p.rust)+P('M194 25 Q218 28 209 43 L196 38Z',p.ink)+C(189,19,2,p.ink);
   else{s+=C(169,91,24,m==='duck'?p.ink:p.teal);s+=m==='parrot'?P('M185 82 Q223 86 194 113Z',p.gold):m==='duck'?E(198,100,22,7,p.gold):Poly([[188,90],[217,99],[187,108]],p.gold);s+=C(176,86,2.5,p.paper);}
   if(m==='eagle')s+=P('M159 79 Q165 65 185 75 L196 90 L204 90 L200 111 L188 105 L191 96 L179 94Z',p.paper)+P('M188 91 Q219 84 208 111 L199 103 L202 96Z',p.gold)+P('M91 137 L103 148 L115 143 L124 156 L136 145','none',p.paper,3);
   if(m==='pigeon')s+=P('M149 101 Q152 139 177 128 L181 111Z',p.blue)+P('M81 124 L112 142 M87 115 L123 137','none',p.ink,4)+P('M188 93 L204 98 L188 101Z',p.ink);
   if(k===2||k===5){s+=P(`M112 104 L51 ${22+k*3} L45 81 L24 60 L58 121 L32 116 L90 158Z`,p.ink)+P(`M117 105 L${165+k*4} 17 L179 71 L218 46 L196 118 L223 107 L161 151Z`,p.teal);}
   else s+=P(`M67 110 Q99 ${78+k*3} 145 124 Q103 ${175-k*4} 67 110Z`,p.gold)+P('M78 119 L120 134 M87 110 L132 125','none',p.ink,1.5);
  }
  return s;
 }
 if(['fish','shark','whale','dolphin','seal','seahorse'].includes(m)){
  if(m==='seahorse')return P(`M131 173 Q${179-k*3} 212 118 205 Q67 196 103 155 L120 112 Q80 88 114 56 Q153 31 164 62 L192 78 L187 90 L155 82 Q145 107 157 136 Q178 175 131 173Z`,p.gold,p.ink,2)+P('M103 86 L84 77 L103 111 M150 124 L180 128 L158 145',p.rust)+C(146,63,3,p.ink)+P('M118 192 Q144 202 142 182','none',p.rust,3)+Array.from({length:5},(_,i)=>L(127,114+i*10,146,118+i*10,p.rust,2)).join('');
  if(m==='seal')return P('M41 151 Q106 82 165 107 Q159 48 193 54 Q224 76 200 101 L195 157 Q130 190 41 151Z',p.blue)+Poly([[56,149],[9,132],[20,166],[57,163]],p.blue)+P('M119 139 L84 188 Q137 182 155 151Z',p.teal)+C(192,72,3,p.ink)+C(214,81,4,p.ink)+P('M209 87 L232 85 M208 91 L231 96','none',p.ink,1);
  let curve=k%3*6;
  s+=P(m==='whale'?'M48 115 Q91 65 174 77 Q234 85 223 132 Q199 171 109 150 L46 141Z':m==='dolphin'?`M49 120 Q100 74 174 92 L${218+curve} 99 L203 112 Q193 163 55 139Z`:m==='shark'?'M42 123 Q128 57 222 119 Q141 182 42 143Z':`M57 121 Q133 ${40+curve} 202 123 Q137 ${198-curve} 57 140Z`,m==='whale'?p.ink:m==='shark'?p.blue:m==='dolphin'?p.teal:p.gold);
  s+=Poly([[65,122],[20,91-curve],[27,126],[13,163+curve],[68,140]],m==='fish'?p.rust:p.teal);
  if(m==='whale')s+=P('M167 89 Q168 43 141 44 M169 76 Q186 37 202 55','none',p.blue,4)+P('M116 143 L148 175 L168 145Z',p.teal)+C(202,107,3,p.paper)+P('M210 127 Q188 138 171 129','none',p.paper,2);
  else{s+=Poly([[113,89],[141,44-curve],[147,99]],p.teal)+Poly([[124,154],[161,180+curve],[164,145]],p.rust)+C(182,111,3,p.ink);if(m==='shark')for(let i=0;i<3;i++)s+=P(`M${156-i*9} 115 q-7 7 0 16`,'none',p.ink,1.5);else if(m==='fish')for(let i=0;i<3+k%3;i++)s+=P(`M${91+i*20} ${98+(i%2)*3} q-11 29 0 56`,'none',p.rust,3);else s+=P('M189 129 Q201 120 213 113','none',p.ink,1.5);}
  return s;
 }
 if(['turtle','crocodile','snake','lizard','frog','toad'].includes(m)){
  if(m==='snake')return P(`M33 182 C${14+k*7} 113 139 181 118 128 C94 75 184 136 169 85 Q159 48 192 49`,'none',p.teal,23)+E(196,48,22,13,p.gold)+C(204,42,2.2,p.ink)+P('M216 47 L232 44 M227 45 L234 51','none',p.rust,2)+P('M42 176 Q72 158 105 159 M129 119 Q149 108 165 109','none',p.gold,6);
  if(m==='frog'||m==='toad'){
   s=P(`M88 126 L45 ${153-k*3} L77 179 L30 189 M153 126 L200 ${151-k*3} L169 181 L218 190`,'none',p.teal,m==='toad'?16:11)+E(121,125,m==='toad'?53:41,m==='toad'?42:35,p.teal)+C(100,87,18,p.teal)+C(145,87,18,p.teal)+C(101,84,10,p.paper)+C(145,84,10,p.paper)+C(102,84,4,p.ink)+C(145,84,4,p.ink)+P('M94 119 Q123 137 152 118','none',p.ink,2)+P('M103 144 L89 185 M138 145 L151 185','none',p.gold,7);
   for(let j=0;j<3;j++)s+=L(88,184,76+j*10,197,p.gold,3)+L(152,184,140+j*10,197,p.gold,3);
   if(m==='toad')for(let j=0;j<8;j++)s+=C(91+(j*23)%61,134+(j%3)*12,3,p.gold);else s+=E(122,146,16,16,p.paper);return s;
  }
  if(m==='turtle'){
   s+=Poly([[58,135],[31,143],[59,146]],p.teal)+E(181,117,29,20,p.teal)+C(194,111,2,p.ink);
   for(let i=0;i<4;i++)s+=P(`M${64+i*29} 141 l${i%2?18:-12} 22 l14 2 l-1 -20Z`,p.teal);
   s+=P(`M50 139 Q67 ${49+k*4} 152 72 Q186 92 178 146Z`,p.gold,p.ink,2)+Poly([[103,77],[132,77],[147,105],[131,132],[96,130],[81,106]],p.teal,p.ink,2)+P('M59 135 L96 130 L104 147 M103 77 L103 61 M132 77 L155 79 M147 105 L174 117','none',p.ink,2);return s;
  }
  s+=P('M62 118 Q12 94 4 149 L70 149Z',p.teal)+E(115,124,63,m==='crocodile'?24:20,p.teal)+P(m==='crocodile'?'M159 106 L228 112 L235 129 L160 143Z':'M157 110 L196 96 L218 115 L194 134 L158 135Z',p.teal);
  for(let i=0;i<4;i++)s+=P(`M${70+i*29} 136 l${i%2?14:-12} ${22+k%2*5} l18 8 l-5 -15`,'none',p.teal,8);
  if(m==='crocodile'){for(let i=0;i<8;i++)s+=Poly([[65+i*17,108],[74+i*17,92],[82+i*17,108]],p.gold);s+=L(174,127,230,122,p.ink,1.5);}
  else s+=P('M75 124 Q122 113 163 123','none',p.gold,4)+P('M85 139 Q57 187 109 188','none',p.teal,8);
  return s+C(185,m==='crocodile'?111:109,3,p.ink);
 }
 if(f.group==='Insectos'||f.group==='Arácnidos'){
  const isSpider=m==='spider', pairs=isSpider?4:3;
  for(let i=0;i<pairs;i++){let yy=90+i*20;s+=P(`M99 ${yy} L${55-i*4} ${yy-22+k*2} L${31-i*4} ${yy+7} M141 ${yy} L${188+i*3} ${yy-21+k*2} L${212+i*3} ${yy+9}`,'none',p.ink,isSpider?3:2.5);}
  if(m==='butterfly'){
   s+=P(`M117 102 C${8+k*3} 8 22 119 84 126 C10 138 69 222 119 140Z`,p.rust)+P(`M123 102 C${230-k*3} 7 221 113 157 126 C228 139 177 219 122 140Z`,p.gold)+E(120,120,8,45,p.ink)+C(120,71,10,p.ink)+P('M116 66 Q96 39 89 49 M124 65 Q142 39 153 48','none',p.ink,2)+C(68,83,17,p.paper)+C(171,83,17,p.teal)+C(83,163,12,p.gold)+C(156,163,12,p.rust);
  }else if(m==='bee'){
   s+=E(94,75,31,48,p.blue,{transform:`rotate(${-24-k*3} 94 75)`})+E(148,75,30,47,p.paper,{stroke:p.ink,'stroke-width':1,transform:`rotate(${24+k*3} 148 75)`})+E(120,130,32,49,p.gold)+R(91,116,59,11,p.ink)+R(91,141,58,11,p.ink)+C(120,77,23,p.ink)+C(111,73,3,p.paper)+C(130,73,3,p.paper)+Poly([[113,175],[122,193],[131,175]],p.ink)+P('M106 55 L95 35 M132 54 L145 32','none',p.ink,2);
  }else if(m==='ant'){
   s+=E(121,156,29,40,p.rust)+E(120,104,21,27,p.rust)+C(121,60,26,p.rust)+C(111,55,3,p.ink)+C(131,55,3,p.ink)+P('M108 37 L97 20 L84 23 M132 37 L145 17 L157 20','none',p.ink,3)+L(114,84,106,93,p.ink,3);
  }else if(m==='beetle'){
   s+=E(122,134,48,58,p.teal)+L(122,79,122,191,p.ink,3)+C(122,69,28,p.ink)+P('M109 49 Q84 20 80 44 M136 49 Q166 20 167 42','none',p.ink,3);for(let j=0;j<6;j++)s+=C(101+(j%2)*43,111+Math.floor(j/2)*27,5+k%2,p.gold);
  }else{s+=E(120,143,40,43,p.ink)+C(120,89,26,p.rust)+C(107,85,4,p.paper)+C(124,82,4,p.paper)+C(138,86,4,p.paper)+P('M108 110 L101 123 M132 111 L140 122','none',p.rust,4);}
  return s;
 }
 if(m==='octopus'){
  for(let i=0;i<8;i++){let start=74+i*12,ex=20+i*30,yy=169+(i%3)*12;s+=P(`M${start} 133 Q${start-15+(i%2)*29} ${154+k*3} ${ex} ${yy} Q${ex+(i<4?-20:19)} ${yy+21} ${ex+(i<4?-5:4)} ${yy+28}`,'none',p.rust,10);}
  s+=E(120,104,45,57,p.rust)+C(105,110,8,p.paper)+C(133,110,8,p.paper)+C(106,111,3,p.ink)+C(132,111,3,p.ink)+P('M110 130 Q122 143 134 130','none',p.ink,2);return s;
 }
 if(m==='crab'){
  for(let i=0;i<4;i++)s+=P(`M87 ${123+i*8} L${49-i*5} ${126+i*16} L${31-i*2} ${141+i*15} M154 ${123+i*8} L${191+i*5} ${126+i*16} L${209+i*2} ${142+i*15}`,'none',p.rust,5);
  s+=P('M86 128 L64 91 L41 75 M153 128 L178 92 L198 73','none',p.rust,9)+P(`M40 90 Q8 70 22 ${39+k*2} L39 61 L49 37 Q83 66 56 87Z`,p.gold)+P(`M189 88 Q163 64 194 36 L203 59 L223 ${40+k*2} Q237 72 205 88Z`,p.gold)+E(121,134,54,30,p.rust)+L(101,116,98,99,p.ink,3)+L(140,116,143,99,p.ink,3)+C(98,96,6,p.paper)+C(143,96,6,p.paper)+C(98,96,2,p.ink)+C(143,96,2,p.ink)+P('M111 142 Q123 150 136 142','none',p.ink,2);return s;
 }
 throw new Error('Morfología sin constructor: '+m);
}
function drawAnimal(f,v,p){
 let s='', marine=['Marinos','Peces'].includes(f.group), habitat='';
 if(v===6){s=G(animalSingle(f,0,p),'translate(0 69) scale(.61)')+G(animalSingle(f,4,p),'translate(158 35) scale(.55)');}
 else if(v===7){s=G(animalSingle(f,1,p),'translate(8 23) scale(.88)')+G(animalSingle(f,3,p),'translate(182 144) scale(.39)');}
 else if(v===9){s=G(animalSingle(f,1,p),'translate(0 25) scale(.60)')+G(animalSingle(f,5,p),'translate(134 45) scale(.56)')+G(animalSingle(f,2,p),'translate(99 126) scale(.40)');}
 else s=G(animalSingle(f,v%6,p),`translate(${v===5?34:24} ${v===5?2:17}) scale(.94)`);
 if(marine){
  for(let j=0;j<3+v%3;j++)habitat+=C(272-j*17,100-j*21,3+(j%3)*2,'none',{stroke:p.blue,'stroke-width':1.5});
  habitat+=P(`M18 224 Q77 ${204-v*2} 130 225 Q214 ${217-v%3*3} 290 221`,'none',p.blue,2)+leaf(22,214,.44,p.teal,-15,v);
 }else{
  habitat+=P(`M13 220 Q${109-v*5} ${208-v%3*3} 276 224`,'none',p.sage,2)+leaf(27,221,.40,p.sage,-35,v)+leaf(263,227,.43,p.teal,25,v+1);
  if(v===4)habitat+=G(drawObject(f.group==='Aves'?'pan':'verduras',2,p),'translate(218 156) scale(.27)');
  if(v===3)habitat+=E(180,218,49,5,p.gold);
  if(v===8)habitat+=tree(49,224,.65,p,4)+P('M201 230 L231 212 L259 230Z',p.gold);
 }
 return G(s+habitat,'',{'data-animal':f.key,'data-pose':v});
}

// 6. Hand-constructed icon morphology (no icon fonts, logos or emoji glyphs).
function drawIcon(key,k,p){
 let s='',a=k%3, sw=3;const st=p.ink;
 switch(key){
 case 'casa':s=Poly([[12,42],[50,11-a*2],[89,42]],p.rust)+P(`M23 42 H78 V86 H59 V59 H40 V86 H23Z`,p.teal)+R(64,49,9,10,p.paper);break;
 case 'flecha':s=P(k%2?'M14 43 H57 V22 L91 50 L57 78 V57 H14Z':'M13 60 L51 60 V82 L91 48 L51 16 V38 H13Z',p.teal)+L(21,49,45,49,p.paper,2);break;
 case 'ubicacion':s=P('M50 91 Q10 54 18 30 Q26 2 52 9 Q82 9 84 35 Q87 56 50 91Z',p.rust)+C(51,37,15,p.paper)+C(51,37,6,p.teal);break;
 case 'brujula':s=C(50,49,36,p.paper,{stroke:st,'stroke-width':3})+Poly([[50,15],[64,50],[50,83],[37,50]],p.teal)+Poly([[50,15],[64,50],[50,50]],p.rust)+C(50,50,4,p.gold);break;
 case 'correo':s=R(12,25,76,55,p.paper,3,{stroke:st,'stroke-width':3})+P('M13 27 L50 54 L87 27 M13 79 L37 47 M87 79 L63 47','none',p.teal,3);break;
 case 'chat':s=P('M14 15 H87 V67 H49 L25 89 V67 H14Z',p.teal)+L(27,30,71,30,p.paper,3)+L(27,44,62,44,p.paper,3);break;
 case 'telefono':s=P('M22 11 L43 29 L34 42 Q44 59 58 65 L72 54 L90 75 Q72 102 44 75 Q6 43 22 11Z',p.rust)+P('M62 16 Q90 20 88 46','none',st,3);break;
 case 'compartir':s=L(22,51,75,20,st,3)+L(23,52,76,79,st,3)+C(20,52,11,p.teal)+C(78,18,11,p.gold)+C(78,80,11,p.rust);break;
 case 'red':s=P('M50 17 V49 H21 V77 M50 49 H79 V77 M50 49 V83','none',st,3)+R(37,6,26,20,p.teal,3)+C(20,81,10,p.rust)+C(50,85,10,p.gold)+C(80,81,10,p.teal);break;
 case 'marcador':s=P('M25 9 H76 V91 L50 70 L25 91Z',p.rust)+star(50,39,17,4,.38,p.paper);break;
 case 'archivo':s=paper(23,9,55,81,p,true)+R(34,57,29,17,p.gold);break;
 case 'carpeta':s=P('M9 25 H39 L49 38 H89 V85 H9Z',p.gold,p.ink,2)+P('M9 85 L20 43 H96 L87 85Z',p.teal);break;
 case 'copiar':s=R(11,11,59,67,p.gold,3)+paper(31,26,56,65,p,true);break;
 case 'archivo-caja':s=R(13,34,75,52,p.teal,2)+R(7,23,87,17,p.gold,2)+R(33,51,35,14,p.paper,3)+L(40,58,62,58,p.ink,2);break;
 case 'descargar':case 'subir':s=P(key==='descargar'?'M42 10 H57 V46 H74 L50 73 L27 46 H42Z':'M43 70 H58 V36 H75 L50 9 L26 36 H43Z',p.rust)+P('M16 65 V87 H86 V65','none',st,4);break;
 case 'papelera':s=P(`M24 30 H77 L${71+a*2} 89 H30Z`,p.teal)+R(18,18,66,9,p.ink,2)+P('M39 18 V9 H63 V18','none',st,3)+L(40,40,43,77,p.paper,3)+L(62,39,59,77,p.paper,3);break;
 case 'deshacer':case 'rehacer':s=key==='deshacer'?P('M31 37 H57 Q92 36 82 72 Q69 95 46 77','none',p.teal,8)+Poly([[10,39],[36,14],[36,62]],p.rust):P('M69 37 H43 Q8 36 18 72 Q31 95 54 77','none',p.teal,8)+Poly([[90,39],[64,14],[64,62]],p.rust);break;
 case 'buscar':s=C(42,39,27,p.paper,{stroke:p.teal,'stroke-width':7})+L(62,60,87,87,st,11)+L(28,30,35,23,p.gold,3);break;
 case 'ajustes':s=star(50,50,43,10,.77,p.teal)+C(50,50,20,p.paper)+C(50,50,10,p.rust);break;
 case 'herramienta':s=P('M61 14 Q94 8 88 40 L65 49 L30 88 L12 73 L51 35 Q49 22 61 14 L62 31 L76 30 L77 16Z',p.teal)+C(25,74,5,p.paper);break;
 case 'filtro':s=P('M9 16 H91 L58 51 V82 L39 92 V51Z',p.gold,p.ink,2)+L(27,30,71,30,p.ink,3);break;
 case 'ordenar':s=L(13,25,59,25,p.teal,6)+L(13,44,47,44,p.teal,6)+L(13,63,32,63,p.teal,6)+L(77,15,77,78,p.ink,4)+Poly([[63,68],[91,68],[77,90]],p.rust);break;
 case 'actualizar':s=P('M23 39 Q32 1 66 20 L80 34 M77 60 Q66 97 32 78 L18 66','none',p.teal,6)+Poly([[62,37],[86,18],[88,48]],p.rust)+Poly([[11,53],[35,64],[12,83]],p.gold);break;
 case 'reproducir':s=Poly([[25,10],[86,50],[25,90]],p.teal)+L(34,29,34,68,p.paper,3);break;
 case 'pausa':s=R(20,13,22+a*2,76,p.teal,3)+R(61,13,22,76,p.rust,3);break;
 case 'detener':s=R(15,15,72,72,p.rust,4)+R(26,26,50,50,'none',2,{stroke:p.paper,'stroke-width':2});break;
 case 'grabar':s=C(50,50,39,p.paper,{stroke:st,'stroke-width':3})+C(50,50,25,p.rust)+C(42,42,6,p.gold);break;
 case 'siguiente':case 'anterior':s=key==='siguiente'?Poly([[14,17],[72,50],[14,85]],p.teal)+R(78,16,11,69,p.ink):Poly([[85,17],[27,50],[85,85]],p.rust)+R(11,16,11,69,p.ink);break;
 case 'volumen':case 'silencio':s=P('M12 37 H32 L59 13 V89 L32 65 H12Z',p.teal);s+=key==='silencio'?P('M71 34 L93 65 M94 34 L72 65','none',p.rust,4):P('M70 33 Q90 51 70 69 M80 21 Q112 52 80 81','none',p.rust,3);break;
 case 'nota':s=P('M39 72 V21 L83 9 V60','none',st,6)+P('M40 21 L83 9 V25 L40 37Z',p.rust)+E(26,75,17,12,p.teal,{transform:'rotate(-20 26 75)'})+E(71,63,17,12,p.teal,{transform:'rotate(-20 71 63)'});break;
 case 'auriculares':s=P('M14 54 V42 Q17 5 51 8 Q86 7 89 42 V57','none',st,8)+R(8,48,23,38,p.teal,8)+R(72,48,23,38,p.rust,8)+L(31,48,31,83,st,3);break;
 case 'escudo':s=P('M49 7 L87 22 V53 Q86 76 49 95 Q12 77 12 53 V22Z',p.teal)+P('M30 50 L44 63 L71 34','none',p.paper,5);break;
 case 'candado':case 'abierto':s=P(key==='candado'?'M27 46 V30 Q50 0 76 30 V47':'M39 46 V28 Q53 0 83 16 V29','none',st,7)+R(16,44,71,46,p.gold,7)+C(51,61,7,p.ink)+R(48,63,6,14,p.ink);break;
 case 'llave':s=C(30,29,20,p.gold,{stroke:st,'stroke-width':3})+C(30,29,8,p.paper)+P('M44 43 L83 83 L93 70 L85 62 L78 69 L70 59 L77 52 L64 40 L57 47Z',p.teal);break;
 case 'correcto':s=P('M13 49 L38 76 L88 23','none',p.teal,12)+P('M18 46 L40 66 L84 21','none',p.gold,2);break;
 case 'cerrar':s=P('M21 21 L81 81 M82 20 L20 82','none',p.rust,11);break;
 case 'aviso':s=Poly([[50,7],[96,90],[5,90]],p.gold,p.ink,2)+R(46,35,8,31,p.ink,3)+C(50,78,4,p.ink);break;
 case 'informacion':s=C(50,50,41,p.teal)+C(50,27,5,p.paper)+P('M43 44 H54 V75 H63 M40 75 H63','none',p.paper,5);break;
 case 'ayuda':s=C(50,50,40,p.paper,{stroke:p.teal,'stroke-width':4})+P('M35 34 Q36 16 54 20 Q79 25 64 46 L51 57 V65','none',p.ink,6)+C(51,80,4,p.rust);break;
 case 'reloj':s=C(50,51,39,p.paper,{stroke:p.ink,'stroke-width':4})+L(50,51,50,25,p.teal,5)+L(50,51,72,63,p.rust,4)+C(50,51,4,p.ink);break;
 case 'calendario':s=R(12,20,77,71,p.paper,4,{stroke:p.ink,'stroke-width':3})+R(13,20,75,19,p.teal)+L(32,10,32,28,p.ink,5)+L(70,10,70,28,p.ink,5);for(let i=0;i<9;i++)s+=R(26+i%3*20,49+Math.floor(i/3)*13,8,6,i===4?p.rust:p.gold,1);break;
 case 'sol':s=C(50,50,25,p.gold);for(let i=0;i<8;i++){let a=i*Math.PI/4;s+=L(50+Math.cos(a)*34,50+Math.sin(a)*34,50+Math.cos(a)*45,50+Math.sin(a)*45,p.ink,3);}break;
 case 'luna':s=P('M67 8 Q16 38 66 86 Q21 103 11 57 Q3 16 67 8Z',p.gold)+star(76,42,10,4,.35,p.teal)+star(81,71,6,4,.35,p.rust);break;
 case 'nube':s=cloud(47,48,.64,p.blue,a)+L(28,81,76,81,p.teal,3);break;
 case 'lluvia':s=cloud(47,37,.65,p.blue,a)+P('M27 60 L19 82 M50 64 L42 90 M73 61 L65 84','none',p.teal,4);break;
 case 'nieve':for(let i=0;i<6;i++){let a=i*Math.PI/3,x=50+Math.cos(a)*37,y=50+Math.sin(a)*37;s+=L(50,50,x,y,p.teal,3)+G(P('M24 0 L30 -8 M24 0 L30 8','none',p.ink,2),`translate(50 50) rotate(${i*60})`);}s+=C(50,50,5,p.gold);break;
 case 'viento':s=P('M10 31 H58 Q87 28 74 13 Q57 0 52 17 M11 50 H78 Q102 51 90 74 Q79 90 66 73 M13 69 H37 Q55 71 44 86','none',p.teal,4);break;
 case 'termometro':s=P('M38 64 V21 Q50 0 62 21 V64 Q85 84 61 94 Q29 102 26 79 Q25 69 38 64Z',p.paper,p.ink,3)+C(48,79,13,p.rust)+R(43,35,10,43,p.rust,4)+L(66,32,84,32,p.teal,3)+L(66,46,78,46,p.teal,3);break;
 case 'hoja':s=P('M20 80 Q1 13 91 8 Q94 76 20 80Z',p.teal)+P('M11 91 L74 25 M37 65 L33 43 M53 49 L75 51','none',p.ink,3);break;
 case 'agua':s=P('M50 7 Q88 50 87 66 Q79 101 44 94 Q7 88 14 58Z',p.blue)+P('M31 61 Q21 81 46 83','none',p.paper,4);break;
 case 'fuego':s=P('M51 6 Q64 40 76 22 Q109 76 70 92 Q26 111 11 69 Q7 46 33 25 Q23 62 44 52 Q61 41 51 6Z',p.rust)+P('M49 55 Q78 82 55 92 Q31 91 49 55Z',p.gold);break;
 case 'libro':s=P('M9 18 Q29 6 50 21 Q75 7 93 18 V83 Q70 71 50 86 Q27 70 9 84Z',p.paper,p.ink,3)+L(50,21,50,86,p.rust,4)+L(21,33,40,34,p.teal,2)+L(62,35,82,32,p.teal,2)+L(21,47,39,48,p.ink,2)+L(62,49,82,46,p.ink,2);break;
 case 'estudios':s=Poly([[5,35],[50,13],[94,36],[49,60]],p.teal)+P('M22 46 V67 Q49 90 79 67 V46',p.gold)+L(91,38,91,76,p.ink,3)+R(87,73,8,14,p.rust);break;
 case 'microscopio':s=G(drawObject('microscopio',a,p),'scale(.42)');break;
 case 'atomo':s=C(50,50,9,p.rust);for(let i=0;i<3;i++)s+=E(50,50,44,18,'none',{stroke:p.teal,'stroke-width':2,transform:`rotate(${i*60} 50 50)`});s+=C(88,62,5,p.gold);break;
 case 'matraz':s=G(drawObject('matraz',a,p),'scale(.42)');break;
 case 'idea':s=P('M35 65 Q7 35 30 15 Q52 -1 74 19 Q94 38 66 66 V79 H35Z',p.gold,p.ink,2)+P('M36 86 H65 M40 95 H60 M44 76 V50 L34 40 M56 76 V50 L66 40','none',p.ink,3);break;
 case 'tren':s=R(20,12,63,71,p.teal,13)+R(28,24,46,27,p.paper,3)+C(33,68,6,p.gold)+C(69,68,6,p.gold)+P('M33 84 L23 98 M69 84 L80 98 M28 91 H74','none',p.ink,4);break;
 case 'bicicleta':s=G(drawObject('bicicleta',a,p),'translate(0 -2) scale(.42)');break;
 case 'avion':s=G(drawObject('avion',a,p),'scale(.42)');break;
 case 'coche':s=G(drawObject('automovil',a,p),'translate(0 -2) scale(.42)');break;
 case 'corazon':s=P('M50 87 C-18 47 13 -2 50 28 C87 -4 121 47 50 87Z',p.rust)+P('M22 43 Q19 31 29 27','none',p.paper,3);break;
 case 'estrella':s=star(50,50,44,5,.45,p.gold)+star(50,50,24,5,.45,p.teal);break;
 case 'ojo':s=P('M5 51 Q49 1 95 51 Q51 99 5 51Z',p.paper,p.ink,3)+C(50,51,21,p.teal)+C(50,51,10,p.ink)+C(43,44,5,p.paper);break;
 case 'mano':s=P('M21 56 L15 35 Q19 22 29 35 L39 52 V16 Q47 5 51 17 V46 L55 10 Q66 5 65 20 V47 L70 17 Q81 14 81 27 L78 54 Q93 27 95 42 L87 77 Q74 98 44 91Z',p.gold,p.ink,2)+L(49,68,68,78,p.rust,2);break;
 default:throw new Error('Símbolo desconocido: '+key);
 }
 return G(s,'',{'data-symbol':key});
}
function drawSymbol(f,v,p){
 const icon=(x,y,sc=.9)=>G(drawIcon(f.key,v,p),`translate(${x} ${y}) scale(${sc})`);
 let s='';
 switch(v){
 case 0:s=icon(74,49,1.35)+L(49,183,196,183,p.gold,5)+star(204,49,10,4,.3,p.rust);break;
 case 1:s=paper(54,20,151,199,p,true)+icon(79,57,1)+L(72,178,185,178,p.teal,3)+L(72,190,158,190,p.ink,2);break;
 case 2:s=R(24,36,105,151,p.gold,5)+R(128,58,103,155,p.paper,4,{stroke:p.ink,'stroke-width':2})+icon(36,58,.82)+icon(140,87,.8)+P('M106 201 H143 L137 195 M143 201 L137 207','none',p.ink,3);break;
 case 3:s=P('M41 76 L125 147 L214 77','none',p.ink,3)+C(41,76,28,p.gold)+C(214,77,28,p.teal)+icon(79,113,.9)+G(drawIcon('correcto',0,p),'translate(24 59) scale(.34)')+G(drawIcon('flecha',0,p),'translate(196 62) scale(.34)');break;
 case 4:s=Poly([[40,40],[200,40],[224,67],[224,184],[191,219],[48,219],[22,191],[22,73]],p.gold)+Poly([[60,219],[54,239],[96,222]],p.rust)+icon(57,67,1.2)+L(59,191,181,191,p.ink,2);break;
 case 5:s=R(23,29,214,190,p.paper,9,{stroke:p.ink,'stroke-width':2})+R(23,29,59,190,p.teal,8)+icon(95,70,1.2)+C(53,69,12,p.gold)+L(41,109,65,109,p.paper,3)+L(41,128,62,128,p.paper,3);break;
 case 6:s=icon(79,76,1)+P('M127 84 V43 H52 M127 43 H204 M127 173 V213 H59 M127 213 H205','none',p.ink,3)+C(50,44,18,p.rust)+C(205,44,18,p.gold)+R(43,201,33,24,p.teal,3)+R(190,201,33,24,p.rust,3);break;
 case 7:s=P('M38 209 Q206 218 134 126 Q46 63 211 40','none',p.teal,6)+icon(59,71,1.2)+C(38,209,13,p.rust)+Poly([[209,29],[234,42],[208,54]],p.gold)+L(205,45,205,75,p.ink,3);break;
 case 8:s=R(23,23,210,205,p.paper,5,{stroke:p.ink,'stroke-width':2})+R(23,23,210,33,p.teal,5)+icon(35,85,1.04)+R(162,71,53,40,p.gold,4)+R(162,125,53,34,p.rust,4)+R(162,173,53,36,p.teal,4)+P('M138 125 H152 V191 H163 M151 90 H162','none',p.ink,2);break;
 case 9:s=C(128,124,98,'none',{stroke:p.ink,'stroke-width':2})+icon(83,80,.9);for(let i=0;i<5;i++){let a=i*6.28/5-1.57,xx=128+Math.cos(a)*98,yy=124+Math.sin(a)*98;s+=C(xx,yy,14,[p.gold,p.rust,p.teal][i%3])+L(128+Math.cos(a)*60,124+Math.sin(a)*60,xx,yy,p.ink,2);}break;
 }
 return s;
}

function wrapWords(text,max=27){
 let lines=[],line='';for(let word of String(text).slice(0,240).split(/\s+/)){if(!word)continue;if(word.length>max){if(line){lines.push(line);line='';}while(word.length>max){lines.push(word.slice(0,max));word=word.slice(max);}line=word;}else if((line+' '+word).trim().length>max){lines.push(line);line=word;}else line=(line+' '+word).trim();}if(line)lines.push(line);return lines.slice(0,5);
}
function drawBubble(f,v,p,o={}){
 const x=38+(v%3)*5,y=36,w=292-(v%3)*10,h=136+(v%2)*12,cx=x+w/2,cy=y+h/2,tailX=73+(v%5)*48;
 let shell='',tail='',outline=p.ink,fill=p.paper;
 const rectPath=`M${x+15} ${y} H${x+w-15} Q${x+w} ${y} ${x+w} ${y+15} V${y+h-15} Q${x+w} ${y+h} ${x+w-15} ${y+h} H${x+15} Q${x} ${y+h} ${x} ${y+h-15} V${y+15} Q${x} ${y} ${x+15} ${y}Z`;
 switch(f.key){
 case 'oval':shell=E(cx,cy,w/2,h/2,fill,{stroke:outline,'stroke-width':2.5});break;
 case 'redondo':shell=R(x,y,w,h,fill,30+v%3*9,{stroke:outline,'stroke-width':2.5});break;
 case 'cuadrado':shell=R(x,y,w,h,fill,0,{stroke:outline,'stroke-width':2.5})+L(x+9,y+9,x+62,y+9,p.gold,4);break;
 case 'estallido':case 'grito':{
  let pts=[],nn=f.key==='grito'?21+v%3:13+v%3;for(let i=0;i<nn*2;i++){let a=i*Math.PI/nn,rr=i%2?.87:1;pts.push([cx+Math.cos(a)*(w/2+15)*rr,cy+Math.sin(a)*(h/2+13)*rr]);}shell=Poly(pts,f.key==='grito'?p.gold:fill,outline,2);break;}
 case 'nube':case 'pensamiento':{
  let d=`M${cx+w/2} ${cy}`;for(let i=0;i<11+v%3;i++){let a=i*2*Math.PI/(11+v%3),b=(i+1)*2*Math.PI/(11+v%3);d+=` Q${n(cx+Math.cos((a+b)/2)*(w/2+27))} ${n(cy+Math.sin((a+b)/2)*(h/2+23))} ${n(cx+Math.cos(b)*w/2)} ${n(cy+Math.sin(b)*h/2)}`;}d+='Z';shell=P(d,fill,outline,2);break;}
 case 'susurro':shell=E(cx,cy,w/2,h/2,fill,{stroke:outline,'stroke-width':2,'stroke-dasharray':`${5+v%3} ${4+v%2}`})+P(`M${x+19} ${y+16} H${x+80}`,'none',p.teal,2);break;
 case 'llamada':shell=P(rectPath,fill,outline,2)+G(drawIcon('telefono',0,p),`translate(${x+10} ${y+6}) scale(.30)`);break;
 case 'radio':shell=P(`M${x} ${y+15} H${x+w} V${y+h-10} H${x+13} L${x} ${y+h-26}Z`,fill,outline,2)+P(`M${x+w-14} ${y+35} q20 20 0 40 M${x+w-27} ${y+43} q12 13 0 25`,'none',p.teal,2);break;
 case 'rombo':shell=Poly([[cx,y-8],[x+w+10,cy],[cx,y+h+8],[x-10,cy]],fill,outline,2);break;
 case 'cinta':shell=Poly([[x,y],[x+w,y],[x+w-17,cy],[x+w,y+h],[x,y+h],[x+17,cy]],p.gold,outline,2)+R(x+24,y+13,w-48,h-26,p.paper);break;
 case 'pergamino':shell=P(`M${x+17} ${y} H${x+w-8} Q${x+w+22} ${y+17} ${x+w} ${y+32} H${x+w-12} V${y+h} H${x+10} Q${x-16} ${y+h} ${x} ${y+h-26} H${x+15}Z`,fill,outline,2)+L(x+24,y+16,x+w-23,y+16,p.gold,5);break;
 case 'etiqueta':shell=Poly([[x+32,y],[x+w,y],[x+w,y+h],[x+32,y+h],[x-9,cy]],fill,outline,2)+C(x+27,cy,7,p.gold,{stroke:outline,'stroke-width':1});break;
 case 'ticket':shell=P(`M${x} ${y} H${x+w} V${cy-13} Q${x+w-25} ${cy} ${x+w} ${cy+13} V${y+h} H${x} V${cy+13} Q${x+24} ${cy} ${x} ${cy-13}Z`,fill,outline,2)+L(x+32,y+9,x+32,y+h-9,p.teal,1.5,{'stroke-dasharray':'4 4'});break;
 case 'hexagono':shell=Poly([[x+31,y],[x+w-31,y],[x+w,cy],[x+w-31,y+h],[x+31,y+h],[x,cy]],fill,outline,2);break;
 case 'octagono':shell=Poly([[x+24,y],[x+w-24,y],[x+w,y+24],[x+w,y+h-24],[x+w-24,y+h],[x+24,y+h],[x,y+h-24],[x,y+24]],fill,outline,2);break;
 case 'marco':shell=P(rectPath,fill,outline,2)+R(x+9,y+9,w-18,h-18,'none',4,{stroke:p.teal,'stroke-width':2});break;
 case 'doble':shell=R(x+52,y-11,w-30,h-19,p.gold,18,{stroke:outline,'stroke-width':2})+P(`M${x+w-9} ${y+h-34} l37 32 l-9 -43`,p.gold,outline,2)+R(x,y+17,w-24,h-7,fill,23,{stroke:outline,'stroke-width':2});break;
 case 'coral':shell=E(x+69,y+30,89,40,p.teal)+E(x+w-51,y+36,87,41,p.gold)+R(x+5,y+37,w-4,h-24,fill,24,{stroke:outline,'stroke-width':2});break;
 case 'espiral':shell=P(rectPath,fill,outline,2)+P(`M${x+37} ${y+26} q-30 -14 -27 13 q5 22 22 11 q13 -10 0 -15`,'none',p.teal,3);break;
 case 'onda':{
  let d=`M${x} ${y+9}`;for(let i=0;i<5+v%3;i++)d+=` q${n(w/(5+v%3)/2)} -19 ${n(w/(5+v%3))} 0`;d+=` V${y+h-6}`;for(let i=0;i<5+v%3;i++)d+=` q-${n(w/(5+v%3)/2)} 19 -${n(w/(5+v%3))} 0`;d+='Z';shell=P(d,fill,outline,2);break;}
 case 'globo':shell=E(cx,cy,w/2,h/2,fill,{stroke:outline,'stroke-width':2})+Poly([[cx-8,y+h-1],[cx+9,y+h-1],[cx+13,y+h+12],[cx-13,y+h+12]],p.rust);break;
 case 'bandera':shell=Poly([[x,y],[x+w,y+11],[x+w-34,cy],[x+w,y+h],[x,y+h-12]],fill,outline,2)+L(x-8,y-8,x-8,y+h+29,p.teal,5);break;
 case 'relato':shell=R(x,y,w,h,fill,1,{stroke:outline,'stroke-width':3})+R(x,y,13,h,p.teal)+P(`M${x+23} ${y+16} h34 M${x+w-19} ${y+h-18} h-37`,'none',p.gold,4);break;
 default:throw new Error('Bocadillo no implementado');
 }
 if(['nube','pensamiento','espiral'].includes(f.key)){
  tail=C(tailX,y+h+19,f.key==='pensamiento'?16:12,p.paper,{stroke:outline,'stroke-width':1.8})+C(tailX+(v%2?13:-12),y+h+44,f.key==='pensamiento'?8:6,p.paper,{stroke:outline,'stroke-width':1.5});
 }else if(f.key==='globo')tail=P(`M${cx} ${y+h+9} Q${cx+27} ${y+h+39} ${tailX} 238`,'none',outline,1.7);
 else tail=P(v%2?`M${tailX} ${y+h-4} L${tailX+26} 228 L${tailX+33} ${y+h-4}`:`M${tailX} ${y+h-4} Q${tailX-8} 214 ${tailX-34} 233 L${tailX+30} ${y+h-4}`,fill,outline,2);
 if(v>=5)tail+=P(`M${x+w-42} ${y+4} L${x+w-13} 9 L${x+w-10} ${y+6}`,p.gold,outline,2);
 if(f.key==='pensamiento')shell+=P(`M${x+21} ${cy-20} Q${x+26} ${y+22} ${x+77} ${y+19}`,'none',p.teal,4)+C(x+w-33,cy+19,5,p.gold);
 const message=o.text??'Hablemos.',lines=wrapWords(message,f.key==='rombo'?18:27),ts=lines.length>3?15:19,base=cy-(lines.length-1)*ts*.65+6;
 let text=lines.map((line,i)=>T(line,cx,base+i*ts*1.3,ts,p.ink,{'text-anchor':'middle'})).join('');
 return G(shell+tail+text,'',{'data-bubble':f.key});
}

function drawUI(f,v,p){
 const q=v%5, ext=v>=5, left=28+(q%2)*9, top=38-(q%2)*7, W=290-q*8, H=156+q*6;
 const icon=(key,x,y,sc=.28)=>G(drawIcon(key,q,p),`translate(${x} ${y}) scale(${sc})`);
 const line=(x,y,w)=>L(x,y,x+w,y,p.teal,3);
 let s='';
 const panel=(fill=p.paper)=>R(left,top,W,H,fill,q%2?18:3,{stroke:p.ink,'stroke-width':2})+R(left+1,top+1,W-2,25,p.gold,q%2?16:2)+C(left+14,top+13,3,p.ink)+C(left+26,top+13,3,p.rust);
 switch(f.key){
 case 'interruptor':s=R(67,79,208-q*9,69,p.teal,35)+C(ext?237-q*9:102,114,27,p.paper)+icon(ext?'correcto':'cerrar',ext?91:221-q*9,97,.30)+line(93,185,138)+R(39,34,89,8,p.gold,4);break;
 case 'progreso':s=panel()+R(left+20,top+63,W-40,25,p.sage,10)+R(left+20,top+63,58+q*28,25,p.teal,10)+C(left+80+q*28,top+75,12,p.gold)+icon('correcto',left+20,top+105,.24)+line(left+58,top+119,W-107);if(ext)s+=R(left+20,top+145,W-40,6,p.rust,3);break;
 case 'deslizador':s=panel()+L(left+22,top+88,left+W-25,top+88,p.sage,9)+L(left+22,top+88,left+90+q*22,top+88,p.teal,9)+R(left+76+q*22,top+67,24,42,p.gold,4)+line(left+20,top+136,65);if(ext)s+=L(left+34,top+44,left+W-32,top+44,p.rust,5)+C(left+51,top+44,7,p.paper);break;
 case 'pestanas':{
  let nn=3+q%3;s=R(left,top+27,W,H-20,p.paper,4,{stroke:p.ink,'stroke-width':2});for(let i=0;i<nn;i++)s+=R(left+i*W/nn,top,W/nn-4,40,i===(ext?nn-1:0)?p.teal:p.gold,8)+L(left+11+i*W/nn,top+19,left+W/nn-17+i*W/nn,top+19,p.paper,3);s+=R(left+20,top+77,63,65,p.rust,5)+line(left+103,top+86,W-132)+line(left+103,top+108,W-148);if(ext)s+=R(left+102,top+130,W-140,12,p.teal,6)+icon('correcto',left+26,top+82,.32);break;}
 case 'ruta':s=R(23,71,315,73,p.paper,4,{stroke:p.ink,'stroke-width':2});for(let i=0;i<3+q%2;i++){let xx=38+i*75;s+=icon(i===0?'casa':i===(ext?2:1)?'carpeta':'archivo',xx,90,.34);if(i<2+q%2)s+=P(`M${xx+45} 98 l8 10 l-8 10`,'none',p.rust,2);}s+=line(65,182,205);break;
 case 'paginacion':{
  const count=3+q,gap=238/count; s=icon('anterior',12,85,.35)+icon('siguiente',313,85,.35);
  for(let i=0;i<count;i++){const xx=62+i*gap,yy=ext?88+(i%2)*18:88;s+=R(xx,yy,gap-7,44,p.paper,5,{stroke:p.ink,'stroke-width':1.5})+T(String(i+1),xx+(gap-7)/2,yy+28,13,p.ink,{'text-anchor':'middle'});if(i===(ext?Math.min(q,count-1):q%count))s+=Poly([[xx+3,yy+49],[xx+gap/2-3,yy+57],[xx+gap-10,yy+49]],p.rust);}
  if(ext)s+=R(78,181,204,7,p.gold,3)+R(123,198,110,5,p.teal,2);else s+=L(80,158,285,158,p.teal,2);break;}
 case 'multimedia':s=panel()+icon('anterior',left+23,top+71,.42)+C(left+W/2,top+94,35,p.gold)+icon(ext?'pausa':'reproducir',left+W/2-21,top+73,.42)+icon('siguiente',left+W-61,top+71,.42)+L(left+22,top+142,left+W-22,top+142,p.teal,4)+C(left+80+q*20,top+142,7,p.rust);break;
 case 'tarjeta':s=panel()+R(left+14,top+41,ext?W-28:85,ext?65:102,p.teal,4);if(ext)s+=line(left+21,top+128,W-64)+line(left+21,top+151,W-105);else s+=line(left+120,top+58,W-152)+line(left+120,top+84,W-171)+R(left+121,top+112,W-149,30,p.rust,6);s+=star(left+52,top+77,23,4,.35,p.gold);break;
 case 'etiqueta':s=Poly([[30,79],[281-q*10,79],[330-q*10,120],[281-q*10,165],[30,165]],p.gold,p.ink,2)+C(58,121,8,p.paper)+icon(ext?'marcador':'correcto',85,94,.52)+line(154,112,111-q*9)+line(154,133,87-q*6);break;
 case 'insignia':s=star(180,100,75+q*4,8+q,.86,p.gold)+Poly([[131,150],[109,221],[153,205],[172,230],[184,163]],p.teal)+Poly([[185,159],[197,226],[220,201],[248,212],[223,144]],p.rust)+C(180,99,50,p.paper)+icon(ext?'escudo':'estrella',145,64,.7);break;
 case 'tooltip':s=R(36,38,280-q*9,119,p.paper,13,{stroke:p.ink,'stroke-width':2})+Poly([[152,157],[176,184],[194,157]],p.paper,p.ink,2)+icon('informacion',56,68,.4)+line(112,84,161-q*9)+line(112,108,130-q*8)+C(177,210,12,p.teal);if(ext)s+=P('M177 197 V180','none',p.rust,2);break;
 case 'pasos':{
  let nn=3+q;for(let i=0;i<nn;i++){let xx=39+i*274/(nn-1);if(i<nn-1)s+=L(xx,91,xx+274/(nn-1),91,p.ink,3);s+=C(xx,91,19,i<(ext?2:1)?p.teal:p.paper,{stroke:p.ink,'stroke-width':2})+icon(i<(ext?2:1)?'correcto':'reloj',xx-12,79,.24)+L(xx-15,133,xx+15,133,p.gold,4)+L(xx-12,149,xx+12,149,p.teal,2);}break;}
 case 'calendario':s=panel()+T('OCT',left+W-54,top+18,13,p.ink);for(let j=0;j<4;j++)for(let i=0;i<7;i++){let xx=left+16+i*(W-28)/7,yy=top+41+j*29;s+=R(xx,yy,22+(q%2)*2,23,(j*7+i===(ext?12:16))?p.rust:p.paper,3,{stroke:p.sage,'stroke-width':.7})+T(String(1+j*7+i),xx+11,yy+15,9,p.ink,{'text-anchor':'middle'});if(ext&&i%2===0&&j%2===0)s+=C(xx+17,yy+5,3,p.teal);}if(ext)s+=L(left+21,top+164,left+W-28,top+164,p.gold,4);break;
 case 'tiempo':s=panel()+T(ext?'12:30':'08:45',left+W/2,top+104,43,p.ink,{'text-anchor':'middle','font-family':'monospace'})+icon('reloj',left+21,top+117,.27)+line(left+66,top+131,W-105)+Array.from({length:q+2},(_,i)=>C(left+W/2-15+i*10,top+43,2.5,p.rust)).join('');if(ext)s+=G(P('M3 28 L7 24 V14 Q17 -4 27 14 V24 L31 28Z',p.gold,p.ink,2)+C(17,33,4,p.teal),`translate(${left+W-55} ${top+102})`)+P(`M${left+W-65} ${top+125} l-6 -8 M${left+W-16} ${top+126} l6 -8`,'none',p.rust,2);break;
 case 'buscador':s=R(23,67,315,78,p.paper,ext?39:8,{stroke:p.ink,'stroke-width':2})+icon('buscar',38,88,.36)+line(91,107,148-q*16)+R(264-q*5,79,59+q*5,54,p.teal,ext?27:5)+icon('flecha',279-q*4,91,.3)+R(60,171,97,8,p.gold,4)+R(172,171,111,8,p.sage,4);break;
 case 'volumen':s=panel()+icon(ext?'silencio':'volumen',left+16,top+71,.53)+L(left+91,top+94,left+W-23,top+94,p.sage,8)+L(left+91,top+94,left+W-74-q*7,top+94,p.teal,8)+C(left+W-74-q*7,top+94,14,p.gold);for(let i=0;i<4+q;i++)s+=L(left+94+i*17,top+129,left+94+i*17,top+136,p.ink,1);break;
 case 'mezclador':s=panel();for(let i=0;i<4+q%3;i++){let xx=left+33+i*(W-60)/(3+q%3),yy=top+64+(i*19+q*7)%58;s+=L(xx,top+48,xx,top+H-24,p.ink,4)+R(xx-10,yy,20,23,i%2?p.rust:p.teal,4)+L(xx-4,yy+12,xx+4,yy+12,p.paper,2);}if(ext)s+=C(left+W-20,top+12,4,p.rust);break;
 case 'dial':s=C(178,123,81,'none',{stroke:p.sage,'stroke-width':8})+C(178,123,57,p.teal)+L(178,123,204-q*11,76,p.gold,7);for(let i=0;i<9+q;i++){let a=i*5/(8+q)+.65;s+=L(178+Math.cos(a)*92,123+Math.sin(a)*92,178+Math.cos(a)*99,123+Math.sin(a)*99,p.ink,2);}if(ext)s+=C(178,123,20,p.paper)+icon('ajustes',163,108,.30);else s+=R(35,190,61,8,p.rust,4);break;
 case 'radial':s=C(179,114,72,'none',{stroke:p.sage,'stroke-width':20})+P(arc(179,114,72,72,-Math.PI/2,Math.PI*.35+q*.3),'none',p.teal,20)+icon(ext?'correcto':'reloj',144,78,.72)+line(128,220,102);break;
 case 'medidor':s=P(arc(176,181,108,108,Math.PI,2*Math.PI),'none',p.gold,22)+P(arc(176,181,108,108,Math.PI,Math.PI+1.8+q*.13),'none',p.teal,22)+L(176,181,ext?243-q*13:107+q*13,99+q*3,p.ink,6)+C(176,181,16,p.rust)+R(123,207,111,8,p.sage,4);break;
 case 'lista':s=panel();for(let i=0;i<3+q%2;i++){let yy=top+47+i*33;s+=R(left+18,yy,21,21,i<(ext?2:1)?p.teal:p.paper,4,{stroke:p.ink,'stroke-width':1.5})+(i<(ext?2:1)?icon('correcto',left+20,yy+2,.17):'')+line(left+56,yy+10,W-82-i*7);}break;
 case 'aviso':s=panel(ext?p.paper:p.gold)+icon(ext?'correcto':'aviso',left+20,top+53,.59)+line(left+98,top+68,W-128)+line(left+98,top+92,W-159)+R(left+98,top+117,W-139,27,p.teal,4)+icon('cerrar',left+W-32,top+7,.15);break;
 case 'acordeon':s=R(left,top,W,H,p.paper,3,{stroke:p.ink,'stroke-width':2});for(let i=0;i<3;i++){let yy=top+i*41;s+=R(left+1,yy+1,W-2,35,i===(ext?1:0)?p.teal:p.gold)+line(left+17,yy+16,W-85)+P(`M${left+W-33} ${yy+12} l7 8 l7 -8`,'none',p.ink,2);}s+=L(left+19,top+139,left+W-23,top+139,p.teal,2);if(ext)s+=R(left+20,top+158,31,15,p.teal,3)+line(left+61,top+165,W-88);break;
 case 'grafico':s=panel()+P(`M${left+20} ${top+46} V${top+H-25} H${left+W-17}`,'none',p.ink,2);for(let i=0;i<5+q%2;i++){let hh=29+(i*23+q*15)%63,xx=left+37+i*(W-66)/(5+q%2);s+=R(xx,top+H-27-hh,18+q,hh,i%2?p.teal:p.rust,2);}if(ext)s+=P(`M${left+34} ${top+91} L${left+91} ${top+103} L${left+161} ${top+57} L${left+W-25} ${top+76}`,'none',p.gold,3);break;
 case 'cuadro':s=panel();for(let i=0;i<6+q%3;i++){let xx=left+22+i%3*(W-35)/3,yy=top+49+Math.floor(i/3)*41;s+=R(xx,yy,60,25,(i+v)%3?p.teal:p.sage,13)+C(xx+((i+v)%3?46:14),yy+12.5,9,p.paper);}break;
 default:throw new Error('Elemento de interfaz sin constructor');
 }
 return G(s,'',{'data-ui-graphic':f.key});
}

function drawDecor(f,v,p){
 const q=v%5, ext=v>=5;let s='',W=360,H=240;
 const cols=[p.teal,p.gold,p.rust,p.sage,p.ink];
 switch(f.key){
 case 'marco':s=P(`M20 ${34+q*3} V20 H${111+q*19} M${251-q*13} 20 H340 V${78+q*8} M340 159 V220 H244 M112 220 H20 V158`,'none',p.ink,5)+P('M31 68 V31 H83 M277 31 H329 V79 M329 183 V209 H277 M76 209 H31 V181','none',p.rust,3);if(ext)s+=star(177,20,13+q,4,.35,p.gold)+leaf(177,220,.48,p.teal,90,q);break;
 case 'feston':s=R(32,34,294,169,p.paper,5,{stroke:p.ink,'stroke-width':2});for(let i=0;i<9+q;i++)s+=C(32+i*294/(8+q),34,10,p.gold)+C(32+i*294/(8+q),203,10,p.gold);for(let j=1;j<6;j++)s+=C(32,34+j*28,10,p.rust)+C(326,34+j*28,10,p.rust);if(ext)s+=R(48,49,262,139,'none',0,{stroke:p.teal,'stroke-width':2});break;
 case 'estrellas':for(let i=0;i<7+q*2;i++){let x=36+(i*59)%291,y=39+(i*47)%155;s+=star(x,y,10+i%4*7,i%3?4:5,.35,cols[i%5]);if(ext&&i>0)s+=L(x,y,36+((i-1)*59)%291,39+((i-1)*47)%155,p.ink,.8);}break;
 case 'geometria':s=Poly([[19,28],[128+q*17,31],[71,216]],p.rust)+C(222,92,62+q*4,p.gold)+R(117,98,122+q*12,111,p.teal)+Poly([[237,115],[340,39],[340,218]],p.ink);if(ext)s+=C(180,160,31,p.paper)+star(73,83,22,4,.35,p.paper);else s+=L(136,119,239,190,p.paper,3);break;
 case 'cintas':for(let i=0;i<3+q%3;i++)s+=P(`M16 ${43+i*36} C${96+q*5} ${-7+i*39} ${210-q*5} ${153+i*10} 344 ${65+i*34}`,'none',cols[i%5],13+q*3);if(ext)s+=L(19,212,342,23,p.ink,2);break;
 case 'lineas':for(let i=0;i<12+q*3;i++){let y=24+i*192/(11+q*3);s+=P(ext?`M21 ${y} L148 ${y-13} L226 ${y+11} L341 ${y-6}`:`M21 ${y} Q176 ${y-22} 341 ${y}`, 'none',cols[i%5],i%3?1:3);}break;
 case 'ornamento':case 'hojas':{
  for(let side of [-1,1]){s+=P(`M180 216 Q${180+side*128} 112 ${180+side*31} 26`,'none',p.ink,2);for(let i=0;i<5+q;i++)s+=leaf(180+side*(Math.sin(i*.33+q*.07)*82+20),202-i*(173/(4+q)),.45+(i%2)*.13,cols[(i+q)%5],side*(42+i*3),i%3);}
  if(f.key==='ornamento')s+=star(180,104,24+q*3,6,.43,p.gold)+C(180,104,9,p.rust);if(ext)s+=leaf(182,214,.8,p.teal,0,q);break;}
 case 'esquinas':for(let i=0;i<4;i++){let xx=i%2?335:25,yy=i<2?26:214;let z=P('M0 46 V0 H64','none',p.ink,4)+P('M10 33 V10 H50','none',p.gold,3)+leaf(14,23,.48,p.teal,44,q);for(let j=0;j<q+1;j++)z+=P(`M${17+j*9} 39 l6 -12 l6 12Z`,j%2?p.gold:p.rust);s+=G(z,`translate(${xx} ${yy}) scale(${i%2?-1:1} ${i<2?1:-1})`);}if(ext)s+=L(111,26,247,26,p.rust,3)+L(107,214,250,214,p.rust,3);break;
 case 'sello':s=star(180,113,92,15+q*2,.90,p.gold)+C(180,113,73,p.paper,{stroke:p.ink,'stroke-width':2})+C(180,113,61,'none',{stroke:p.teal,'stroke-width':2})+star(180,113,35,ext?7:4,.4,p.rust);if(ext)s+=Poly([[117,176],[90,228],[137,210],[162,230],[173,184]],p.teal)+Poly([[191,181],[220,227],[237,205],[276,215],[239,168]],p.rust);break;
 case 'divisor':s=L(18,117,133,117,p.ink,2+q*.5)+L(227,117,344,117,p.ink,2+q*.5)+star(180,117,22+q*4,ext?6:4,.4,p.gold)+C(142,117,4,p.rust)+C(217,117,4,p.rust);if(ext)s+=P('M33 98 H104 M247 138 H327','none',p.teal,3);else s+=leaf(181,116,.61,p.teal,90,q);break;
 case 'arcos':for(let j=0;j<3+q%2;j++)for(let i=0;i<4+q%2;i++)s+=P(`M${15+i*75} ${70+j*58} a${34+q} ${38-q} 0 0 1 ${68+q*2} 0`,'none',cols[(i+j)%5],ext?9:3);break;
 case 'flores':for(let i=0;i<5+q;i++){let xx=40+i*271/(4+q),yy=106+Math.sin(i*2)*38;s+=L(xx,yy,xx,213,p.ink,2)+star(xx,yy,22+i%3*6,6+i%3,.57,cols[i%5])+C(xx,yy,7,p.paper)+leaf(xx,177,.40,p.teal,(i%2?1:-1)*65,q);}if(ext)s+=R(15,214,330,7,p.gold,2);break;
 case 'cuadricula':for(let j=0;j<4+q%2;j++)for(let i=0;i<6;i++){let xx=24+i*53,yy=20+j*43;s+=R(xx+(j%2)*9,yy,ext?36:43,31+(i%2)*4,(i+j+q)%3?cols[(i+j)%5]:'none',q%2?5:0,{stroke:p.ink,'stroke-width':.6});}break;
 case 'ondas':for(let i=0;i<6+q;i++)s+=P(`M10 ${25+i*22} Q70 ${-1+i*22} 120 ${25+i*22} T230 ${25+i*22} T350 ${25+i*22}`,'none',cols[i%5],ext?8:3);if(ext)s+=C(181,115,30,p.paper);break;
 case 'rombos':for(let j=0;j<4;j++)for(let i=0;i<6;i++){let xx=30+i*60,yy=29+j*58;s+=Poly([[xx,yy-22],[xx+23+q,yy],[xx,yy+22],[xx-23-q,yy]],cols[(i+j)%5],ext?p.ink:null,1);if(ext)s+=C(xx,yy,4,p.paper);}break;
 case 'circulos':for(let i=0;i<4+q%2;i++){let xx=61+i*72,yy=i%2?151:83;for(let j=3;j>0;j--)s+=C(xx,yy,11+j*11+q,cols[(i+j)%5]);if(ext)s+=L(xx-37,yy,xx+37,yy,p.paper,2);}break;
 case 'triangulos':for(let i=0;i<7+q;i++){let xx=20+i*28;s+=Poly([[xx,215-i%2*27],[xx+44,27+(i%3)*24],[xx+102,215-i%2*27]],cols[i%5],ext?p.paper:null,1.5);}break;
 case 'papel':for(let i=0;i<3+q;i++){let xx=18+i*246/(2+q),yy=31+(i%2)*13+q*3;s+=P(`M${xx} ${yy} L${xx+71} ${yy-9} L${xx+92} ${198-i*4} L${xx+58} ${201-i*3} L${xx+48} ${214-i*3} L${xx+27} ${203-i*3} L${xx} ${211-i*3}Z`,cols[i%5]);if(ext)s+=P(`M${xx+18} ${yy+18} l35 -2 l4 127`,'none',p.paper,2);}break;
 case 'abanico':for(let i=0;i<8+q*2;i++){let a=Math.PI+i*Math.PI/(7+q*2),b=a+Math.PI/(7+q*2);s+=Poly([[180,214],[180+Math.cos(a)*159,214+Math.sin(a)*184],[180+Math.cos(b)*159,214+Math.sin(b)*184]],cols[i%5],p.paper,.8);}if(ext)s+=C(180,215,28,p.ink)+C(180,215,13,p.gold);break;
 case 'roseta':for(let i=0;i<8+q;i++)s+=G(E(180,75,24,53,cols[i%5]),`rotate(${i*360/(8+q)} 180 122)`);s+=C(180,122,34,p.paper)+star(180,122,23,ext?6:4,.4,p.teal);break;
 case 'cabecera':s=Poly([[16,74],[79,74],[79,152],[16,152],[37,113]],p.teal)+Poly([[282,74],[344,74],[324,113],[344,152],[282,152]],p.rust)+R(53,51,255-q*9,105,p.gold,2)+P('M53 157 L80 179 V157 M283 157 L306 179 V157',p.ink)+R(72,66,215-q*9,75,'none',0,{stroke:p.paper,'stroke-width':2});if(ext)s+=star(179,102,27,4,.32,p.rust);else s+=leaf(180,139,.88,p.teal,0,q);break;
 case 'banderines':s=P('M13 42 Q180 126 349 44','none',p.ink,3);for(let i=0;i<7+q;i++){let xx=26+i*303/(6+q),yy=46+Math.sin(i/(6+q)*Math.PI)*37;s+=Poly(ext?[[xx,yy],[xx+23,yy+5],[xx+21,yy+67],[xx+10,yy+58],[xx,yy+64]]:[[xx,yy],[xx+23,yy+5],[xx+13,yy+56]],cols[i%5]);}break;
 case 'ventana':for(let i=0;i<3+q%2;i++){let xx=24+i*94;s+=P(`M${xx} 210 V87 Q${xx+38} ${5+q*6} ${xx+76} 87 V210Z`,cols[i%5])+P(`M${xx+38} 46 V210 M${xx} 132 H${xx+76}`,'none',p.paper,3);if(ext)s+=C(xx+38,102,17,p.gold);}break;
 case 'mosaico':for(let j=0;j<5;j++)for(let i=0;i<7;i++){let xx=15+i*47,yy=15+j*43;if((i+j+q)%3===0)s+=C(xx+19,yy+18,18,cols[(i+j)%5]);else if((i+j+q)%3===1)s+=Poly([[xx,yy],[xx+39,yy],[xx+(ext?39:0),yy+37]],cols[(i+j+1)%5]);else s+=R(xx,yy,39,37,cols[(i+j)%5],q%2?7:0);}break;
 default:throw new Error('Decoración sin constructor: '+f.key);
 }
 return G(s,'',{'data-decoration':f.key});
}

// 7. Distinct animated actions. All animation is embedded SMIL; posters contain no animation.
function drawAnimation(f,v,p,o){
 const q=v%5, ext=v>=5, dur=6, oo={...o,poster:o.poster??.45};let s='';
 const obj=(key,x,y,scale=.45,variant=v)=>G(drawObject(key,variant,p),`translate(${x} ${y}) scale(${scale})`);
 const labelLine=(y)=>P(`M20 ${y} Q${140+q*15} ${y-8} 341 ${y}`,'none',p.sage,2);
 if(['caminar','correr','saltar','saludar','asentir','aplaudir','leer','escribir'].includes(f.key)){
  const poseMap={caminar:5,correr:7,saltar:11,saludar:0,asentir:9,aplaudir:21,leer:3,escribir:4};
  let human=G(drawPerson(PEOPLE[(v*3)%PEOPLE.length],poseMap[f.key],p,{...oo,action:f.key}),'scale(.60)');
  if(f.key==='caminar'||f.key==='correr'){
   const route=ext?['13 25',`${92+q*8} ${9-q*3}`,'188 23',`${104-q*8} ${35+q*2}`,'13 25']:['12 24',`${101+q*6} ${24-q*4}`,'187 24',`${93-q*5} ${24+q*3}`,'12 24'];
   s+=labelLine(213)+motion(human,route,oo,'translate',dur)+obj(ext?'maleta':'farola',250,88,.48,q);
   if(ext)s+=P(`M24 217 H91 V${208-q*3} H163 V212 H231`,'none',p.gold,4);
  }else if(f.key==='saltar'){
   s+=labelLine(218)+R(151,195-q*5,47+q*9,22+q*5,p.gold,4)+motion(human,[`65 26`,`${95+q*6} ${-25-q*3}`,`179 26`,`${95+q*6} ${-25-q*3}`,'65 26'],oo,'translate',dur);
   if(ext)s+=obj('balon',253,159,.31,q);
  }else{
   s+=labelLine(223)+G(human,`translate(${ext?28:58+q*12} 29)`);
   if(ext)s+=G(drawPerson(PEOPLE[(v*3+1)%PEOPLE.length],f.key==='leer'?4:9,p,{...oo,action:'asentir'}),'translate(209 74) scale(.46)');
   else s+=obj(f.key==='escribir'?'escritorio':f.key==='leer'?'estanteria':'microfono',219,83,.48,q);
   if(f.key==='leer')s+=motion(obj('libro',180,28,.20,q),['0 0','8 -7','0 0'],oo,'translate',3);
   if(f.key==='escribir')s+=P('M130 161 H166 M138 171 H161','none',p.rust,2)+fade(star(197,73,13,4,.35,p.gold),[0,1,0],oo,3);
  }
  return G(s,'',{'data-action':f.key});
 }
 switch(f.key){
 case 'abrir-libro':{
  const w=86+q*9;s+=P(`M177 78 Q${177-w} 43 ${177-w-8} 78 V201 Q${177-w/2} 168 178 201Z`,p.paper,p.ink,2)+L(178,77,178,202,p.rust,4);
  let page=P(`M0 0 Q${w/2} -25 ${w} 0 V123 Q${w/2} 101 0 123Z`,p.gold,p.ink,2)+L(15,37,w-17,34,p.ink,2)+L(15,58,w-17,55,p.ink,2)+L(15,82,w-26,77,p.ink,2);
  s+=G(motion(page,['1 1','.12 1','-1 1','.12 1','1 1'],oo,'scale',dur),'translate(178 77)');if(ext)s+=obj('lampara',248,77,.41,q)+obj('pluma',30,84,.43,q);else s+=leaf(92,151,.62,p.teal,5,q);break;}
 case 'cerrar-caja':{
  let w=132+q*13,x=180-w/2;s+=R(x,121,w,99,p.rust)+R(x+16,137,w-32,64,p.gold)+L(180,122,180,218,p.ink,2);
  s+=motion(Poly([[x,120],[180,120],[180,69],[x,69]],p.paper,p.ink,2),['-49 180 120','0 180 120','0 180 120','-49 180 120'],oo,'rotate',dur);
  s+=motion(Poly([[180,120],[x+w,120],[x+w,69],[180,69]],p.teal,p.ink,2),['42 180 120','0 180 120','0 180 120','42 180 120'],oo,'rotate',dur);
  if(ext)s+=fade(star(180,105,25,4,.35,p.gold),[1,0,0,1],oo,dur)+obj('libro',x-53,123,.31,q);else s+=R(x+22,155,38,20,p.paper);break;}
 case 'puerta':{
  let w=100+q*10;s+=R(77,29,w+18,201,p.ink,3)+R(85,37,w,186,p.teal)+P('M94 223 L177 223 L264 254 H135Z',p.gold);
  let door=R(0,0,w,186,p.rust)+R(12,14,w-24,65,p.gold,2)+R(12,94,w-24,77,p.paper,2)+C(w-14,94,4,p.ink);
  s+=G(motion(door,['1 1','.15 1','.15 1','1 1'],oo,'scale',dur),'translate(85 37)')+obj(ext?'bolsa':'maceta',234,126,.48,q);
  if(ext)s+=G(drawPerson(PEOPLE[25],0,p),'translate(236 52) scale(.34)');break;}
 case 'mapa':{
  let nn=3+q%3;for(let i=0;i<nn;i++){let xx=30+i*290/nn,ww=290/nn;let piece=Poly([[0,28],[ww,17],[ww,169],[0,180]],i%2?p.gold:p.paper,p.ink,2)+P(`M0 ${85+(i%2)*24} L${ww/2} ${74+(i%2)*26} L${ww} ${86+(i%2)*9}`,'none',p.teal,5)+C(ww/2,109,5,p.rust);s+=G(motion(piece,ext?['.18 1','1 1','1 1','.18 1']:['1 1','.16 1','1 1','1 1'],oo,'scale',dur),`translate(${xx} 30)`);}
  s+=obj(ext?'brujula':'maleta',249,172,.27,q);break;}
 case 'construir':case 'desarmar':{
  const nn=5+q+(ext?3:0);for(let i=0;i<nn;i++){let xx=51+i%4*64,yy=203-Math.floor(i/4)*49;let block=R(xx,yy,56,40,[p.teal,p.gold,p.rust][i%3],i%2?2:5)+R(xx+8,yy+7,40,7,p.paper);let values=[`${(i%2?1:-1)*(79+q*11)} ${-137+(i%3)*21}`,'0 0','0 0',`${(i%2?1:-1)*(79+q*11)} ${-137+(i%3)*21}`];if(f.key==='desarmar')values=['0 0',values[0],values[0],'0 0'];s+=motion(block,values,oo,'translate',dur,{keyTimes:'0;0.4;0.75;1'});}s+=labelLine(248);break;}
 case 'orbitar':{
  s=C(180,132,26+q*3,p.gold)+star(180,132,17,6,.57,p.rust);
  for(let j=0;j<2+q%3;j++){let rx=66+j*29,ry=32+j*23;s+=E(180,132,rx,ry,'none',{stroke:p.teal,'stroke-width':1.4,transform:ext?`rotate(${j*19} 180 132)`:null});let vals=[];for(let i=0;i<=12;i++){let a=i*6.28/12+j*1.7;vals.push(`${n(180+Math.cos(a)*rx)} ${n(132+Math.sin(a)*ry)}`);}s+=motion(C(0,0,7+j*3,[p.rust,p.teal,p.ink][j%3]),vals,oo,'translate',dur);}
  break;}
 case 'flotar':{
  let key=['libro','pluma','cereal','camara','llave-ornamental'][q];s+=motion(obj(key,108,38,.62,v),ext?['-47 7','6 -21','51 15','5 39','-47 7']:['0 13','14 -24','0 13','-14 -7','0 13'],oo,'translate',dur)+E(183,228,62,8,p.sage);
  for(let j=0;j<(ext?5:3);j++)s+=motion(star(0,0,7+j,4,.35,j%2?p.gold:p.rust),[`${61+j*46} ${74+j%2*33}`,`${80+j*46} ${53+j%2*58}`,`${61+j*46} ${74+j%2*33}`],oo,'translate',3);break;}
 case 'trazo':{
  let path=q===0?'M25 189 Q98 5 177 135 T334 91':q===1?'M25 204 L70 144 L114 176 L162 78 L214 124 L271 44 L332 77':q===2?'M25 151 C85 16 146 251 192 111 C223 15 299 52 335 161':q===3?'M29 189 Q67 87 124 176 Q200 224 226 77 L331 47':'M37 157 L96 58 L156 168 L224 38 L324 188';
  s+=P(path,'none',p.sage,1.5)+tag('path',{d:path,fill:'none',stroke:p.teal,'stroke-width':5,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':1,'stroke-dashoffset':oo.animate?1:0},animTag('stroke-dashoffset',[1,0,0,1],oo,dur));
  if(ext)s+=motion(obj('pluma',0,0,.22,q),['16 120','139 33','282 121','16 120'],oo,'translate',dur)+star(326,79,11,4,.35,p.gold);else s+=C(27,190,7,p.rust)+C(332,93,7,p.gold);break;}
 case 'transformar':{
  let nn=8+q*2,states=[];for(let st=0;st<4;st++){let pts=[];for(let i=0;i<nn;i++){let a=i*6.28/nn,rr=st===1?(i%2?42:93):st===2?70+(i%3)*8:83;pts.push(n(180+Math.cos(a)*rr)+' '+n(127+Math.sin(a)*rr*(st===3?.61:1)));}states.push(pts.join(' '));}states.push(states[0]);s+=tag('polygon',{points:states[oo.animate?0:2],fill:p.teal,stroke:p.ink,'stroke-width':2},animTag('points',states,oo,dur))+C(180,127,17,p.gold);
  if(ext)s+=motion(R(25,27,26,26,p.rust,3),['0 0','39 132','248 144','260 0','0 0'],oo,'translate',dur);else s+=L(60,228,300,228,p.ink,2);break;}
 case 'pendulo':{
  s=R(38,25,285,15,p.ink)+L(43,38,43,232,p.ink,5)+L(318,38,318,232,p.ink,5);
  for(let i=0;i<2+q%3;i++){let xx=86+i*182/(1+q%3),len=115+(i%2)*47;let z=L(xx,40,xx,40+len,p.ink,2)+C(xx,40+len,19+(i%2)*4,i%2?p.rust:p.gold);s+=motion(z,[`${-20-q*3} ${xx} 40`,`${20+q*3} ${xx} 40`,`${-20-q*3} ${xx} 40`],oo,'rotate',3+(i%2)*3);}
  if(ext)s+=R(57,235,247,10,p.teal);break;}
 case 'engranajes':{
  let count=ext?3:2;for(let i=0;i<count;i++){let xx=82+i*92,yy=115+(i%2)*24,rad=41+(q%2)*5;let z=star(xx,yy,rad,10+q,.79,i%2?p.gold:p.teal)+C(xx,yy,18,p.paper)+C(xx,yy,7,p.ink);s+=motion(z,[`0 ${xx} ${yy}`,`${i%2?-360:360} ${xx} ${yy}`],oo,'rotate',dur);}s+=labelLine(213);break;}
 case 'agua':{
  let points=ext?[[40,49],[313,49],[286,199],[54,209],[40,49]]:[[53,55],[284,77],[296,201],[60,182],[53,55]];let d='M'+points.map(pt=>pt.join(' ')).join(' L');s+=P(d,'none',p.teal,12)+P(d,'none',p.paper,2);
  for(let j=0;j<3+q;j++){let vals=points.map((pt,i)=>`${pt[0]+(i%2?j*2:0)} ${pt[1]+j*2}`);s+=motion(C(0,0,7+(j%2),j%2?p.gold:p.blue),vals,oo,'translate',dur,{begin:(-j*.6)+'s'});}s+=obj('regadera',116,85,.42,q);break;}
 case 'verter':{
  s+=motion(obj(ext?'tetera':'regadera',54,47,.56,q),['0 133 131',`${25+q*4} 133 131`,`${25+q*4} 133 131`,'0 133 131'],oo,'rotate',dur);
  s+=obj('taza',197,116,.52,q)+fade(P(`M178 135 Q${208+q*6} 134 251 179`,'none',p.blue,5),[0,1,1,0],oo,dur)+labelLine(228);
  if(ext)s+=obj('cesta',281,124,.30,q);break;}
 case 'crecer':{
  s+=R(143,193,84,43,p.rust,3)+E(185,193,42,8,p.ink);let pl=tree(0,0,1,p,q);s+=G(motion(pl,['.3 .03','1 1','1 1','.3 .03'],oo,'scale',dur),'translate(184 191)');
  if(ext)s+=obj('regadera',23,142,.36,q)+C(291,48,23,p.gold);else s+=obj('pala',250,116,.43,q);break;}
 case 'alas':{
  let left=P(`M177 124 Q${12+q*8} ${33+q*4} 96 163 L176 159Z`,p.teal),right=P(`M183 124 Q${350-q*8} ${33+q*4} 261 163 L184 159Z`,p.rust);
  s+=motion(left,['-18 180 135','24 180 135','-18 180 135'],oo,'rotate',1.5)+motion(right,['18 180 135','-24 180 135','18 180 135'],oo,'rotate',1.5)+E(180,134,18,44,p.gold)+C(180,79,19,p.ink)+Poly([[189,84],[216,91],[190,96]],p.gold)+labelLine(227);
  if(ext)s+=cloud(47,49,.41,p.blue,q)+cloud(285,42,.46,p.blue,q);break;}
 case 'mariposa':{
  let vals=ext?['10 11','136 -14','191 67','83 104','10 11']:['23 97','58 15','151 37','218 101','23 97'];s+=motion(G(animalSingle(ANIMALS.find(a=>a.key==='mariposa'),q%6,p),'scale(.44)'),vals,oo,'translate',dur)+G(plant(72,211,.77,p,2),'')+G(plant(289,216,.66,p,2),'');
  if(ext)s+=P('M47 38 C210 -3 328 147 125 205','none',p.sage,1.2,{'stroke-dasharray':'4 7'});break;}
 case 'tren':{
  s+=L(13,207,347,207,p.ink,3)+L(12,220,348,220,p.ink,2);for(let i=0;i<15;i++)s+=L(14+i*24,202,24+i*24,225,p.ink,2);
  let train=obj(ext?'tranvia':'tren',0,64,.59,v)+(ext?obj('autobus',-103,76,.47,q):'');
  s+=motion(train,[`12 ${-q*2}`,`${156+q*10} ${-q*2}`,`${156+q*10} ${-q*2}`,`12 ${-q*2}`],oo,'translate',dur)+obj('reloj',281,27,.22,q);break;}
 case 'navegar':{
  for(let i=0;i<3;i++)s+=motion(P(`M0 ${189+i*20} q38 -15 76 0 t76 0 t76 0 t76 0 t76 0`,'none',i%2?p.teal:p.blue,3),['-12 0','10 0','-12 0'],oo,'translate',3);
  s+=motion(obj(ext?'barco':'velero',100,27,.73,q),['-34 -6','20 5','51 -6','-34 -6'],oo,'translate',dur);
  if(ext)s+=obj('farola',1,70,.54,q);else s+=C(298,41,24,p.gold);break;}
 case 'teclear':{
  s+=obj('maquina',59,34,.87,q);for(let i=0;i<7+q;i++)s+=fade(C(117+i*12,157+(i%2)*9,3,p.gold),[0,1,0,0],oo,1.5,{begin:(-i*.1)+'s'});
  s+=motion(paper(130,22,69,76,p,false),['0 9','0 -10','0 -10','0 9'],oo,'translate',dur);
  if(ext)s+=obj('taza',269,127,.35,q);else s+=obj('lampara',243,26,.42,q);break;}
 case 'nodos':{
  const pts=[[52,52],[181,47],[309,63],[84,188],[251,201],[181,127]].slice(0,ext?6:5);for(let i=0;i<pts.length;i++){let next=pts[(i+1+q)%pts.length];let d=`M${pts[i][0]} ${pts[i][1]} L${next[0]} ${next[1]}`;s+=tag('path',{d,stroke:p.teal,'stroke-width':3,fill:'none',pathLength:1,'stroke-dasharray':1,'stroke-dashoffset':oo.animate?1:0},animTag('stroke-dashoffset',[1,0,0,1],oo,dur));s+=C(...pts[i],14+i%3*3,colsFor(p,i))+G(drawIcon(i%2?'correcto':'idea',q,p),`translate(${pts[i][0]-10} ${pts[i][1]-10}) scale(.20)`);}break;}
 case 'colaborar':{
  s+=G(drawPerson(PEOPLE[v%26],19,p,{...oo,action:'saludar'}),'translate(23 59) scale(.57)')+G(drawPerson(PEOPLE[(v+7)%26],1,p,{...oo,action:'asentir'}),'translate(218 64) scale(.55)')+motion(paper(0,0,36+q*4,43,p,true),ext?['118 126','175 102','242 128','175 155','118 126']:['120 128','237 128','237 128','120 128'],oo,'translate',dur)+labelLine(237);
  if(ext)s+=obj('escritorio',119,147,.5,q);else s+=fade(star(189,51,22,4,.35,p.gold),[0,1,1,0],oo,3);break;}
 default:throw new Error('Acción no implementada: '+f.key);
 }
 return G(s,'',{'data-action':f.key});
}
const colsFor=(p,i)=>[p.teal,p.gold,p.rust,p.sage,p.blue][i%5];

function drawEffect(f,v,p,o,seed){
 const rnd=rng(seed),q=v%5,ext=v>=5,oo={...o,poster:o.poster??.42},cid=o.uid+'-fx-bounds';
 const nn=14+q*3+(ext?5:0),center=[180+(q-2)*16,128+(q%2)*11];let s='';
 const drop=(glyph,i,dx=0)=>{
  let xx=ext?center[0]+(rnd()-.5)*215:17+rnd()*321,yy=12+rnd()*186,travel=67+rnd()*65;
  return motion(glyph,[`${n(xx)} ${n(yy)}`,`${n(xx+dx)} ${n(yy+travel)}`,`${n(xx+dx)} ${n(yy+travel)}`,`${n(xx)} ${n(yy)}`],oo,'translate',6,{begin:(-i*.27)+'s'});
 };
 const rays=(nray,draw)=>{let out='';for(let i=0;i<nray;i++){let a=i*6.28/nray+(q*.19);out+=draw(a,i);}return out;};
 switch(f.key){
 case 'lluvia':for(let i=0;i<nn;i++)s+=drop(L(0,0,ext?-8:3,15+(i%3)*5,p.teal,1.5+i%2),i,ext?-45:12);break;
 case 'nieve':for(let i=0;i<nn;i++){let g='';for(let j=0;j<3;j++)g+=G(L(-5-i%3,0,5+i%3,0,p.blue,1.3),`rotate(${j*60})`);s+=drop(g,i,Math.sin(i)*38);}break;
 case 'humo':for(let i=0;i<8+q;i++){let xx=ext?(i%2?248:115):center[0],rr=15+(i%4)*10;let z=cloud(0,0,rr/50,p.blue,i);s+=fade(motion(z,[`${xx} 233`,`${xx+(i%2?1:-1)*(30+q*8)} 93`,`${xx+(i%2?1:-1)*64} -7`],oo,'translate',6,{begin:(-i*.45)+'s'}),[0,.7,0],oo,6);}break;
 case 'fuego':for(let i=0;i<7+q;i++){let xx=83+i*23,hh=67+(i*27)%97;let flame=P(`M-17 0 Q-34 -31 -9 -${hh*.56} Q-11 -${hh*.3} 7 -${hh} Q37 -${hh*.36} 22 0Z`,i%2?p.gold:p.rust);s+=G(motion(flame,['1 1','.8 1.16','1.1 .83','1 1'],oo,'scale',3,{begin:(-i*.23)+'s'}),`translate(${xx} 228)`);}if(ext)s+=P('M81 231 L260 215 M105 209 L238 237','none',p.ink,8);break;
 case 'chispas':case 'rocio':case 'explosion':{
  s+=rays(nn,(a,i)=>{let rr=58+(i%5)*16,values=[`${center[0]} ${center[1]}`,`${n(center[0]+Math.cos(a)*rr)} ${n(center[1]+Math.sin(a)*rr)}`,`${n(center[0]+Math.cos(a)*(rr+24))} ${n(center[1]+Math.sin(a)*(rr+24))}`],glyph=f.key==='rocio'?C(0,0,2+(i%3),p.blue):f.key==='explosion'?star(0,0,5+i%4,4,.4,colsFor(p,i)):L(0,0,Math.cos(a)*12,Math.sin(a)*12,colsFor(p,i),2);return fade(motion(glyph,values,oo,'translate',6,{begin:(-i*.13)+'s'}),[1,1,0],oo,6);});break;}
 case 'ondas':case 'anillos':case 'sonar':case 'choque':{
  for(let j=0;j<3+q;j++){let rr=24+j*15,ell=f.key==='ondas';let ring=ell?E(center[0],center[1],rr,rr*.44,'none',{stroke:p.teal,'stroke-width':2}):C(center[0],center[1],rr,'none',{stroke:colsFor(p,j),'stroke-width':f.key==='choque'?5:2});let vals=['.3 .3','1 1','1.35 1.35'];s+=G(fade(motion(G(ring,`translate(${-center[0]} ${-center[1]})`),vals,oo,'scale',6,{begin:(-j*.8)+'s'}),[0,1,0],oo,6),`translate(${center[0]} ${center[1]})`);}
  if(f.key==='sonar')s+=motion(P(`M${center[0]} ${center[1]} L${center[0]+98} ${center[1]}`,'none',p.gold,3),[`0 ${center[0]} ${center[1]}`,`360 ${center[0]} ${center[1]}`],oo,'rotate',6);if(ext)s+=C(267,178,7,p.rust);break;}
 case 'cascada':for(let i=0;i<11+q;i++){let xx=64+i*15;s+=motion(P(`M${xx} 17 Q${xx+12} 103 ${xx+q*2} 192`,'none',i%2?p.blue:p.teal,5+i%3),['0 0','0 33','0 0'],oo,'translate',3,{begin:(-i*.15)+'s'});}s+=E(179,221,112,16,p.blue)+fade(E(179,219,92,10,'none',{stroke:p.paper,'stroke-width':2}),[0,1,0],oo,3);break;
 case 'destellos':case 'estrellas':for(let i=0;i<nn-3;i++){let xx=22+rnd()*315,yy=24+rnd()*214,rr=5+i%5*3;let z=star(xx,yy,rr,f.key==='estrellas'?5:4,.32,colsFor(p,i));s+=fade(z,[0,1,.2,0],oo,3,{begin:(-i*.17)+'s'});if(ext&&i%3===0)s+=C(xx+11,yy-10,1.6,p.ink);}break;
 case 'electricidad':case 'red-electrica':{
  let count=f.key==='red-electrica'?5+q:3+q;for(let j=0;j<count;j++){let xx=48+j*52,d=`M${xx} 15 L${xx-24} 91 L${xx+14} 101 L${xx-14} 173 L${xx+30} 241`;s+=fade(P(d,'none',j%2?p.gold:p.teal,ext?5:3),[.1,1,.2,1,.1],oo,3,{begin:(-j*.3)+'s'});if(f.key==='red-electrica')s+=L(xx-14,173,xx+52,101,p.ink,1.4)+C(xx+14,101,6,p.rust);}break;}
 case 'polvo':for(let i=0;i<nn*2;i++){let xx=17+rnd()*330,yy=33+rnd()*200;s+=motion(C(0,0,1+(i%3)*.6,i%2?p.ink:p.gold),[`${n(xx)} ${n(yy)}`,`${n(xx+Math.sin(i)*31)} ${n(yy-24)}`,`${n(xx)} ${n(yy)}`],oo,'translate',6);}break;
 case 'confeti':case 'hojas':case 'petalos':case 'fragmentos':{
  for(let i=0;i<nn;i++){let g=f.key==='confeti'?Poly([[0,0],[8+i%4,3],[-2,13]],colsFor(p,i)):f.key==='hojas'?leaf(0,0,.24,colsFor(p,i),i*23,i%3):f.key==='petalos'?P('M0 0 Q-16 -11 -4 -25 Q18 -17 0 0Z',colsFor(p,i)):Poly([[0,0],[-8,-14],[13,-8],[5,11]],colsFor(p,i));s+=drop(motion(g,['-15','35','-15'],oo,'rotate',3),i,ext?48:-24);}
  break;}
 case 'barrido':{
  let count=4+q;for(let j=0;j<count;j++){let xx=j*360/count;let z=R(0,0,360/count+1,260,colsFor(p,j));s+=G(motion(z,ext?['0 1','1 1','1 1','0 1']:['1 0','1 1','1 1','1 0'],oo,'scale',6,{begin:(-j*.12)+'s'}),`translate(${xx} 0)`);}break;}
 case 'tinta':{
  for(let j=0;j<5+q;j++){let xx=65+j*32,yy=98+(j%3)*38,rr=24+j%3*9;let z=P(`M${-rr} 0 C${-rr} ${-rr} ${rr*.6} ${-rr*1.2} ${rr} -3 C${rr*1.3} ${rr} ${-rr*.7} ${rr*1.2} ${-rr} 0Z`,colsFor(p,j));s+=G(motion(z,['.2 .2','1.4 1','1 1.3','.2 .2'],oo,'scale',6,{begin:(-j*.4)+'s'}),`translate(${xx} ${yy})`);}break;}
 case 'rayos':s+=rays(9+q,(a,i)=>fade(Poly([[center[0],center[1]],[center[0]+Math.cos(a)*186,center[1]+Math.sin(a)*186],[center[0]+Math.cos(a+.14)*186,center[1]+Math.sin(a+.14)*186]],i%2?p.gold:p.paper),[.1,.7,.1],oo,6));if(ext)s+=C(...center,18,p.rust);break;
 case 'niebla':case 'vapor':{
  for(let j=0;j<7+q;j++){let yy=30+j*25;let z=P(`M-30 ${yy} Q69 ${yy-34} 157 ${yy+1} T389 ${yy-8}`,'none',j%2?p.blue:p.paper,f.key==='niebla'?16:5);s+=fade(motion(z,['-21 12','22 -17','-21 12'],oo,'translate',6,{begin:(-j*.37)+'s'}),[.25,.8,.25],oo,6);}break;}
 case 'burbujas':for(let i=0;i<nn;i++){let rr=6+i%5*3,g=C(0,0,rr,'none',{stroke:p.teal,'stroke-width':1.7})+P(arc(0,0,rr*.63,rr*.63,-2.5,-1.1),'none',p.gold,2);let xx=27+rnd()*310,yy=45+rnd()*172;s+=motion(g,[`${n(xx)} ${n(yy)}`,`${n(xx+Math.sin(i)*25)} ${n(yy-81)}`,`${n(xx)} ${n(yy)}`],oo,'translate',6);}break;
 case 'meteoritos':{
  for(let i=0;i<4+q+(ext?3:0);i++){let xx=40+i*43,yy=30+(i%3)*39;let z=P('M-60 -35 L0 0','none',p.gold,7)+P('M-49 -14 L-9 8','none',p.rust,2)+star(0,0,10+i%3*3,4,.4,p.paper);s+=motion(z,[`${xx} ${yy}`,`${xx+81} ${yy+140}`,`${xx} ${yy}`],oo,'translate',6,{begin:(-i*.47)+'s'});}break;}
 case 'cometa':{
  const body=P(`M-96 ${-46-q*4} Q-46 -9 0 0 Q-58 17 -108 ${20+q*7} Q-67 -3 -96 ${-46-q*4}Z`,p.gold)+P('M-81 13 Q-29 1 -4 0','none',p.rust,3)+C(0,0,12+q,p.paper);
  s=motion(body,ext?[`297 66`,`150 ${142+q*9}`,`79 193`,`297 66`]:[`103 69`,`213 ${101+q*13}`,`298 174`,`103 69`],oo,'translate',6);
  for(let i=0;i<q+3;i++)s+=fade(star(43+i*55,38+(i%3)*58,4+i%3,4,.3,p.teal),[.2,1,.2],oo,3,{begin:(-i*.2)+'s'});break;}
 case 'liquido':{
  const count=3+q;for(let j=0;j<count;j++){const xx=25+j*300/count,yy=180+(j%2)*18;
   let z=P(`M0 0 C16 -12 8 -69 30 -${85+q*9} C61 -52 35 -30 62 -8 L62 24 H0Z`,colsFor(p,j));
   s+=G(motion(z,ext?['1 1','.7 1.3','1.2 .8','1 1']:['1 .4','1 1.2','1 .7','1 .4'],oo,'scale',6,{begin:(-j*.3)+'s'}),`translate(${xx} ${yy})`);
  }s+=P('M17 225 Q120 203 185 225 T345 222 L345 249 H17Z',p.teal);break;}
 case 'semitono':for(let j=0;j<9;j++)for(let i=0;i<13;i++){let rr=1+((i+j+q)%5),z=C(20+i*26,19+j*28,rr,colsFor(p,(i+j)%5));s+=fade(z,[.15,1,.15],oo,3,{begin:(-i*.09-j*.11)+'s'});}break;
 case 'pelicula':for(let j=0;j<9+q;j++){let xx=18+j*31;s+=fade(P(`M${xx} 3 l${j%2?5:-3} 80 l-6 53 l7 124`,'none',j%2?p.ink:p.gold,1),[0,.8,0,.2,0],oo,3,{begin:(-j*.17)+'s'});}if(ext)s+=motion(R(0,34,360,3,p.paper),['0 0','0 171','0 0'],oo,'translate',6);break;
 case 'flash':s=fade(star(center[0],center[1],110,ext?12:8,.14,p.gold)+star(center[0],center[1],77,4,.24,p.paper)+C(...center,24,p.paper),[0,1,0,0],oo,3);for(let j=0;j<3+q;j++)s+=C(53+j*65,46+j*33,13+j*5,'none',{stroke:p.teal,'stroke-width':1.3});break;
 case 'cinta':for(let j=0;j<4+q;j++){let yy=53+j*37;s+=motion(P(`M-25 ${yy} C100 ${yy-90} 194 ${yy+95} 385 ${yy-27}`,'none',colsFor(p,j),8+j%3*5),ext?['0 -14','26 9','0 -14']:['-21 0','12 23','-21 0'],oo,'translate',6,{begin:(-j*.6)+'s'});}break;
 case 'vortice':{
  for(let j=0;j<5+q;j++){let dd='';for(let i=0;i<20;i++){let a=i*.40+j*6.28/(5+q),rr=12+i*5;dd+=(i?' L':'M')+n(center[0]+Math.cos(a)*rr)+' '+n(center[1]+Math.sin(a)*rr);}s+=motion(P(dd,'none',colsFor(p,j),2.7),[`0 ${center[0]} ${center[1]}`,`${ext?-360:360} ${center[0]} ${center[1]}`],oo,'rotate',6);}break;}
 default:throw new Error('Efecto sin constructor: '+f.key);
 }
 if(ext&&['cascada','tinta','niebla','vapor','semitono','meteoritos'].includes(f.key)){
  // Two differently articulated emitter fields, a connector and a secondary trajectory.
  const first=G(s,'translate(4 17) scale(.61 .83)',{'data-emitter':'left'});
  let second='';
  if(f.key==='cascada')second=motion(P(`M271 23 Q${245-q*5} 97 299 168`,'none',p.teal,13)+E(292,197,42,16,p.blue),['0 0','-12 22','0 0'],oo,'translate',6);
  else if(f.key==='tinta')second=motion(P(`M233 103 Q267 ${22+q*5} 316 79 Q343 156 300 207 Q219 191 233 103Z`,p.rust)+C(294,125,18,p.paper),['0 0','-17 13','0 0'],oo,'translate',6);
  else if(f.key==='semitono'){for(let j=0;j<5+q;j++)second+=motion(Poly([[242+j*12,29+j*24],[267+j*8,40+j*24],[247+j*12,64+j*24]],p.teal),['0 0','-16 12','0 0'],oo,'translate',3);}
  else if(f.key==='meteoritos')second=motion(C(274,149,23,p.rust)+P('M269 136 L233 107 M280 159 L252 144','none',p.gold,4),['0 0','-42 72','0 0'],oo,'translate',6);
  else{for(let j=0;j<4+q;j++)second+=motion(P(`M239 ${223-j*24} Q321 ${189-j*21} 263 ${147-j*18}`,'none',p.blue,f.key==='niebla'?12:4),['0 0','-16 -18','0 0'],oo,'translate',6);}
  s=first+G(second,'',{'data-emitter':'right'});
 }
 return tag('defs',{},tag('clipPath',{id:cid},R(0,0,360,260,'white')))+G(s,'',{'clip-path':`url(#${cid})`,'data-effect':f.key,'data-intentional-clip':'emission-boundary'});
}

// 8. Object assemblies: two functional companions and a genuinely different spatial recipe.
// These are disclosed as procedural assemblies, not 1,200 independently drawn concepts.
const KIT_PROPS={
 'Hogar y cocina':['tetera','taza','platos','cubiertos','cesta','botella'],
 'Oficina y tecnología':['cuaderno','pluma','libro','telefono','lampara','camara'],
 'Transporte':['maleta','brujula','mochila','reloj','bolsa','linterna'],
 'Instrumentos musicales':['microfono','auriculares','cuaderno','maracas','radio','altavoz'],
 'Herramientas':['herramientas','martillo','escalera','alicates','taladro','llave'],
 'Ciencia':['matraz','libro','cuaderno','tubos','pluma','microscopio'],
 'Alimentos':['tabla','platos','cubiertos','cesta','frutero','tarro'],
 'Ropa y accesorios':['maleta','gafas','sombrero','zapatos','bolsa','paraguas'],
 'Muebles y exteriores':['maceta','libro','lampara','taza','bolsa','regadera'],
 'Deporte y aventura':['mochila','brujula','linterna','tienda','maleta','bolsa']
};
const KIT_LAYOUTS=[
 [[6,12,.91],[235,6,.36],[244,147,.35]],
 [[29,38,.85],[1,1,.33],[248,7,.36]],
 [[7,45,.87],[212,16,.50],[249,159,.30]],
 [[125,45,.82],[0,14,.42],[10,157,.31]],
 [[106,61,.71],[5,106,.44],[259,104,.40]],
 [[67,1,.91],[1,151,.34],[259,150,.33]],
 [[97,48,.76],[1,23,.43],[265,12,.36]],
 [[2,21,.90],[245,57,.36],[221,171,.31]],
 [[96,55,.71],[3,106,.37],[232,8,.47]],
 [[117,49,.72],[0,47,.46],[27,165,.33]]
];
const KIT_NAMES=['trío de trabajo lateral','accesorios en dos alturas','disposición triangular','complementos a la izquierda','kit panorámico','complementos en la base','ensamble diagonal','doble estación lateral','organización abierta','mesa de uso compartido'];
function objectCompanions(f,v){let set=(KIT_PROPS[f.group]||KIT_PROPS['Hogar y cocina']).filter(x=>x!==f.key);let a=set[v%set.length],b=set[(v+2+Math.floor(v/5))%set.length];if(a===b)b=set[(v+1)%set.length];return [a,b];}
function drawObjectAssembly(f,v,p){
 const keys=[f.key,...objectCompanions(f,v)],layout=KIT_LAYOUTS[v];let s='';
 if(v===9)s+=Poly([[13,181],[321,175],[347,239],[6,243]],p.sage)+L(16,244,345,244,p.ink,2);
 keys.forEach((key,i)=>{const [x,y,z]=layout[i];s+=G(drawObject(key,(v+i*3)%10,p),`translate(${x} ${y}) scale(${z})`,{'data-part':i===0?'primary-object':'companion-'+i,'data-object':key});});
 return s;
}

// V2 · Pastel illustration atelier. Original IDs are preserved where recipes remain.
// Shapes, poses and compositions are authored; seeds only distribute secondary detail.
function mix(a,b,t=.5){const pa=a.replace('#',''),pb=b.replace('#','');if(!/^[0-9a-f]{6}$/i.test(pa)||!/^[0-9a-f]{6}$/i.test(pb))return a;return '#'+[0,2,4].map(i=>Math.round(parseInt(pa.slice(i,i+2),16)*(1-t)+parseInt(pb.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');}
function inkLine(p){return mix(p.ink,p.blue,.17);}
function flower(x,y,r,p,v=0){let s='';for(let j=0;j<5+(v%2);j++){let a=j*2*Math.PI/(5+v%2);s+=E(x+Math.cos(a)*r*.53,y+Math.sin(a)*r*.53,r*.43,r*.37,v%3===0?p.rust:v%3===1?p.blue:p.paper,{transform:`rotate(${n(a*180/Math.PI)} ${n(x+Math.cos(a)*r*.53)} ${n(y+Math.sin(a)*r*.53)})`});}return s+C(x,y,r*.27,p.gold)+C(x-r*.06,y-r*.08,r*.1,p.paper);}
function littleStars(p,w,h,seed,count=6){let r=rng(seed),s='';for(let i=0;i<count;i++){let x=20+r()*(w-40),y=20+r()*(h-40);s+=i%3?star(x,y,2.5+r()*3.5,4,.28,[p.gold,p.rust,p.blue][i%3]):C(x,y,1.8,p.teal);}return s;}
function ambient(content,o,part='ambient',amp=2,phase=0){return G(motion(content,['0 0',`${amp} ${-amp*1.4}`,'0 0',`${-amp*.6} ${amp*.45}`,'0 0'],o,'translate',6,{begin:phase+'s'}),'',{'data-part':part});}
leaf=function(x,y,s,color,angle=0,type=0){let d=type%3===0?'M0 0 C-19 -5 -33 -37 -6 -61 C17 -40 22 -12 0 0Z':type%3===1?'M0 0 Q-31 -10 -20 -40 Q-4 -55 5 -64 Q30 -27 0 0Z':'M0 0 C-35 -11 -39 -38 -25 -57 C-15 -51 -12 -39 -9 -45 C-13 -62 2 -70 8 -68 C21 -48 25 -18 0 0Z';return G(P(d,color)+P('M0 -2 Q-2 -24 -5 -49','none',mix(color,'#FFFFFF',.43),1.1),`translate(${n(x)} ${n(y)}) rotate(${angle}) scale(${s})`);};
plant=function(x,y,s,p,kind=0){let a='';const pot=[p.rust,p.blue,p.teal][kind%3];if(kind%3===1){a=P('M0 5 V-36 M-1 -12 Q-26 -3 -25 -26 V-41 M0 -2 Q23 7 25 -14 V-29','none',p.teal,12)+P('M-3 -36 L-3 1 M-28 -40 L-28 -19 M21 -27 L21 -10','none',mix(p.teal,p.paper,.65),1.4);for(let i=0;i<5;i++)a+=L(3,-28+i*8,8,-30+i*8,p.ink,.6);a+=flower(0,-38,7,p,0);}else{for(let j=0;j<7;j++){let yy=-3-j*7,ang=(j%2?1:-1)*(22+j*7);a+=leaf(0,yy,.52+(j%3)*.12,[p.sage,p.teal,p.blue][j%3],ang,j);}a+=P('M0 4 Q-8 -30 4 -59','none',mix(p.teal,p.ink,.4),1.6);}
a+=E(0,29,24,4,mix(p.blue,p.paper,.6))+P('M-18 0 H18 L14 27 Q0 32 -14 27Z',pot)+E(0,0,18,4,mix(pot,p.ink,.12))+E(0,0,13,2,p.ink)+P('M-12 6 L-9 23','none',mix(pot,p.paper,.65),3)+L(-17,3,17,3,mix(pot,p.paper,.6),1.4);return G(a,`translate(${x} ${y}) scale(${s})`,{'data-part':'plant'});};
tree=function(x,y,s,p,type=0){let a='',dark=mix(p.teal,p.ink,.32);if(type%6===0){a=R(-3,-95,6,101,dark,2);for(let j=0;j<4;j++){let yy=-31-j*22,ww=38-j*6;a+=P(`M${-ww} ${yy} Q-8 ${yy-16} 0 ${yy-40} Q12 ${yy-14} ${ww} ${yy} Q14 ${yy+6} 0 ${yy+4} Q-15 ${yy+8} ${-ww} ${yy}Z`,j%2?p.teal:p.sage)+P(`M${-ww+10} ${yy} Q-7 ${yy-12} 0 ${yy-29}`,'none',mix(p.teal,p.paper,.65),1);}}
else if(type%6===2){a=P('M-5 5 C-2 -28 7 -69 13 -101 L19 -101 Q11 -42 5 5Z',mix(p.rust,p.ink,.33));for(let j=0;j<6;j++)a+=G(P('M0 0 C-20 -24 -52 -25 -74 -1 C-43 -9 -18 6 0 0Z',j%2?p.teal:p.sage)+P('M-2 0 Q-37 -12 -64 -3','none',mix(p.teal,p.paper,.7),1.2),`translate(16 -99) rotate(${-19+j*58})`);a+=C(12,-99,5,p.gold)+C(20,-99,4,p.gold);}
else{a=P('M-5 4 L-2 -80 L3 -91 L6 4Z',dark);const c=type%6===3?p.rust:type%6===4?p.blue:p.sage;const clusters=[[-24,-71,25],[23,-78,29],[0,-110,30],[-24,-108,22],[23,-113,22],[0,-73,34]];for(let j=0;j<clusters.length;j++){const [xx,yy,rr]=clusters[j];a+=C(xx,yy,rr,mix(c,j%2?p.paper:p.teal,j%2?.15:.08));}a+=P('M0 -5 L0 -89 M0 -37 L-22 -62 M1 -57 L23 -83','none',dark,2.7);for(let j=0;j<10;j++){let xx=-28+(j*23)%58,yy=-113+(j*19)%53;a+=type%6===3?flower(xx,yy,4.4,p,j%3):P(`M${xx} ${yy} q4 -5 9 -1`,'none',mix(c,p.paper,.55),1.2);}}
return G(a,`translate(${n(x)} ${n(y)}) scale(${n(s)})`,{'data-part':'tree'});};
// Precise cubic-Bezier interpolation; static posters and SMIL use the same easing.
function timing(values,more={}){if(more.calcMode||values.length<3)return more;return {calcMode:'spline',keyTimes:values.map((_,i)=>n(i/(values.length-1))).join(';'),keySplines:values.slice(1).map(()=>'.42 0 .22 1').join(';'),...more};}
function bezierEase(u,k){const [x1,y1,x2,y2]=k;const f=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;let lo=0,hi=1,t=u;for(let j=0;j<18;j++){t=(lo+hi)/2;if(f(t,x1,x2)<u)lo=t;else hi=t;}return f(t,y1,y2);}
sampleValues=function(values,t,more={}){const times=more.keyTimes?more.keyTimes.split(';').map(Number):values.map((_,i)=>i/(values.length-1));const tt=clamp(t,0,.999999);let at=0;while(at<times.length-2&&tt>times[at+1])at++;let u=(tt-times[at])/Math.max(.00001,times[at+1]-times[at]);if(more.calcMode==='spline'&&more.keySplines){const curve=more.keySplines.split(';')[at]?.trim().split(/[ ,]+/).map(Number);if(curve?.length===4)u=bezierEase(u,curve);}if(more.calcMode==='discrete')return values[at];const a=String(values[at]).trim().split(/[ ,]+/).map(Number),b=String(values[at+1]??values[at]).trim().split(/[ ,]+/).map(Number);if(a.length!==b.length||a.some(x=>!Number.isFinite(x))||b.some(x=>!Number.isFinite(x)))return values[at];return a.map((x,i)=>n(x+(b[i]-x)*u)).join(' ');};
animTag=function(attribute,values,o,dur=4,more={}){return o.animate?tag('animate',{attributeName:attribute,values:values.join(';'),dur:dur+'s',repeatCount:'indefinite',...timing(values,more)}):'';};
motion=function(content,values,o,type='translate',dur=4,more={}){const m=timing(values,more),start=o.animate?values[0]:sampleValues(values,o.poster??.42,m);return tag('g',{transform:type+'('+start+')'},content+(o.animate?tag('animateTransform',{attributeName:'transform',type,values:values.join(';'),dur:dur+'s',repeatCount:'indefinite',...m}):''));};
fade=function(content,values,o,dur=4,more={}){const m=timing(values,more);return tag('g',{opacity:o.animate?values[0]:sampleValues(values,o.poster??.42,m)},content+animTag('opacity',values,o,dur,m));};

// Expressive cast · cut-paper volumes, curved silhouettes, detailed faces and clothing.
drawPerson=function(spec,poseIndex,p=DEFAULT_PALETTE,o={}){
 const i=poseIndex%25,pose=POSES[i],b=spec.body||0,isWoman=spec.hair===1,idx=hash(spec.key),skin=[p.skin,'#CF9276','#A96D58','#EAC5AA','#C48D72'][b],shade=mix(skin,p.rust,.25),hair=['#4C3B4D','#624256','#72553E','#3A414C','#845957'][idx%5],line=inkLine(p);
 const cloth=['cocinera','medico','cientifica'].includes(spec.key)?p.paper:[p.rust,p.blue,p.teal,p.gold,p.sage][idx%5],pants=mix([p.blue,p.teal,p.rust][b%3],p.ink,.32);let out='';
 const ll=pose[4],rl=pose[5],left=pose[2],right=pose[3],shoulderL=81-b,shoulderR=153+b;
 out+=E(122,301,61,7,mix(p.blue,p.paper,.6),{opacity:.42});
 if(i===8)out+=R(77,208,87,12,p.rust,6)+P('M81 218 L75 293 M160 218 L169 293','none',p.ink,4)+P('M87 211 V163 Q117 144 158 161 V214','none',p.blue,13);
 function shoe(x,y,other=false){return P(`M${x-8} ${y-5} Q${x+1} ${y-7} ${x+8} ${y-3} L${x+20} ${y+2} Q${x+25} ${y+8} ${x+17} ${y+9} H${x-11} Q${x-14} ${y+4} ${x-8} ${y-5}Z`,other?p.paper:line)+L(x-9,y+7,x+19,y+7,other?line:p.paper,1.3)+L(x+6,y-1,x+9,y+3,other?line:p.paper,1.2);}
 function leg(a,hip,side){let d=`M${hip} 199 Q${a[0]} ${a[1]} ${a[2]} ${a[3]-4}`;let vals=[];if(o.action==='caminar'||o.action==='correr'){const run=o.action==='correr',sg=side==='left'?1:-1;for(let k=0;k<5;k++){let aa=k*Math.PI/2,dx=Math.sin(aa)*sg*(run?28:17),kneeY=244-(run?Math.max(0,-Math.sin(aa)*sg)*18:0);vals.push(`M${hip} 199 Q${hip+dx*.55} ${kneeY} ${hip+dx} ${285-Math.max(0,-Math.sin(aa)*sg)*(run?30:7)}`);}d=vals[0];}
 let s=tag('path',{d,fill:'none',stroke:pants,'stroke-width':17-b*.5,'stroke-linecap':'round','stroke-linejoin':'round'},vals.length?animTag('d',vals,o,o.action==='correr'?.75:1.5,{calcMode:'linear'}):'')+(vals.length?'':P(`M${hip+2} 208 Q${a[0]+2} ${a[1]} ${a[2]+2} ${a[3]-6}`,'none',mix(pants,p.paper,.2),1.2));
 if(vals.length){const sg=side==='left'?1:-1,run=o.action==='correr',steps=[];for(let k=0;k<5;k++){let aa=k*Math.PI/2;steps.push(`${n(hip+Math.sin(aa)*sg*(run?28:17))} ${n(285-Math.max(0,-Math.sin(aa)*sg)*(run?30:7))}`);}s+=motion(shoe(0,0,idx%3===0),steps,o,'translate',run?.75:1.5,{calcMode:'linear'});}else s+=shoe(a[2],a[3],idx%3===0);
 return G(s,'',{'data-part':'leg-'+side});}
 out+=G(leg(ll,106,'left')+leg(rl,137,'right'),'',{'data-part':'legs'});
 let torso=P(`M${shoulderL} 126 Q94 116 112 115 H132 Q150 117 ${shoulderR} 127 L${149+b} 193 Q145 210 125 211 Q100 213 ${94-b} 204Z`,cloth);
 torso+=P(`M${shoulderL+4} 132 Q${shoulderL+5} 175 ${100-b} 201 L${109-b} 204 Q98 165 102 124Z`,mix(cloth,p.ink,.1));
 const apron=['cocinera','panadera','agricultor','carpintera','vendedora'].includes(spec.key),coat=['narrador','periodista','medico','ingeniera','cientifica','bibliotecaria'].includes(spec.key);
 if(coat){torso+=P('M108 118 L124 151 L139 119 L130 205 H114Z',p.paper)+P('M102 121 L94 143 L107 150 L102 158 L122 183 L110 138Z',mix(cloth,p.paper,.25))+P('M142 122 L150 143 L138 151 L143 161 L127 182 L136 141Z',mix(cloth,p.ink,.09));if(spec.key==='narrador'||spec.key==='periodista')torso+=P('M121 137 L127 137 L132 174 L125 185 L119 174 L123 145Z',p.blue);torso+=R(135,162,14,2,p.paper,1)+C(125,191,1.8,line);}
 else{torso+=P('M111 118 Q121 135 135 118','none',mix(cloth,p.paper,.6),5)+P('M110 123 Q121 138 136 122','none',line,.8);}
 if(apron)torso+=P('M105 140 H137 L151 206 Q121 217 91 207Z',p.gold)+L(105,141,108,120,p.gold,4)+L(136,141,132,120,p.gold,4)+R(107,174,29,22,p.paper,4)+L(109,180,132,180,mix(p.gold,p.ink,.25),1.2)+L(90,159,99,154,p.gold,4);
 if(spec.key==='medico')torso+=P('M108 121 V143 Q119 160 130 143 V124 M126 151 Q143 170 144 161','none',p.teal,2.4)+C(144,161,4,p.ink);
 if(spec.key==='astronauta')torso+=R(101,146,42,35,p.paper,6,{stroke:line,'stroke-width':1.2})+R(108,151,27,12,p.teal,3)+C(112,173,3,p.rust)+C(123,173,3,p.gold)+P('M101 179 Q71 207 75 157','none',p.gold,5);
 if(['nina','adolescente','vecino'].includes(spec.key)){torso+=P('M96 139 L108 131 L131 131 L143 141 L151 208 H94Z',p.blue)+P('M108 135 L106 121 M132 135 L135 121','none',p.blue,7)+R(106,153,29,25,mix(p.blue,p.paper,.45),5)+C(110,135,2,p.gold)+C(131,135,2,p.gold);}
 if(spec.key==='bibliotecaria')torso+=P('M109 120 Q119 141 137 120 L145 139 L129 150 L137 178 L122 172 L120 146 L104 131Z',p.gold);
 if(spec.key==='deportista')torso+=R(110,151,25,22,p.paper,4)+P('M115 166 L121 157 L129 166','none',p.rust,2)+L(85,131,90,142,p.paper,4);
 if(spec.key==='cientifica')torso+=R(134,167,15,16,p.blue,2)+L(137,166,137,160,p.rust,2)+L(142,166,142,157,p.teal,2);
 torso+=P('M99 201 Q124 207 146 200','none',mix(cloth,p.ink,.2),1);
 out+=G(torso,'',{'data-part':'torso'});
 function hand(x,y,dir=1){return G(P('M-5 2 Q-8 -4 -7 -10 Q-7 -14 -4 -11 L-1 -6 L1 -13 Q3 -15 4 -12 L4 -6 L8 -12 Q11 -13 10 -9 L7 -2 L13 -6 Q17 -6 15 -3 L9 5 Q1 12 -5 2Z',skin)+P('M-1 2 L5 -1 M2 5 L8 1','none',shade,.7),`translate(${x} ${y}) scale(${dir} 1)`);}
 function arm(a,x,y,name){let upper=P(`M${x} ${y} Q${x+(a[0]-x)*.2} ${y+16} ${a[0]} ${a[1]}`,'none',cloth,16);let fore=P(`M${a[0]} ${a[1]} Q${(a[0]+a[2])/2} ${(a[1]+a[3])/2+2} ${a[2]} ${a[3]}`,'none',cloth,13)+L(a[2]-3,a[3]-4,a[2]+3,a[3]+2,mix(cloth,p.paper,.6),5)+hand(a[2],a[3],name==='left'?-1:1);
 if(o.action==='saludar'&&name==='left')fore=motion(fore,[`-8 ${a[0]} ${a[1]}`,`24 ${a[0]} ${a[1]}`,`-12 ${a[0]} ${a[1]}`,`21 ${a[0]} ${a[1]}`,`-8 ${a[0]} ${a[1]}`],o,'rotate',3);
 if(o.action==='escribir'&&name==='right')fore=motion(fore,[`-3 ${a[0]} ${a[1]}`,`3 ${a[0]} ${a[1]}`,`-3 ${a[0]} ${a[1]}`],o,'rotate',.75);
 if(o.action==='aplaudir')fore=motion(fore,[`${name==='left'?-7:7} ${a[0]} ${a[1]}`,`${name==='left'?6:-6} ${a[0]} ${a[1]}`,`${name==='left'?-7:7} ${a[0]} ${a[1]}`],o,'rotate',.75);
 let s=G(upper,'',{'data-part':'upper-arm-'+name})+G(fore,'',{'data-part':'forearm-'+name,'data-pivot':a[0]+','+a[1]});if(['caminar','correr'].includes(o.action))s=motion(s,[`${name==='left'?-8:8} ${x} ${y}`,`${name==='left'?8:-8} ${x} ${y}`,`${name==='left'?-8:8} ${x} ${y}`],o,'rotate',o.action==='correr'?.75:1.5);
 return G(s,'',{'data-part':'arm-'+name,'data-pivot':x+','+y});}
 out+=arm(left,shoulderL+2,132,'left')+arm(right,shoulderR-2,132,'right');
 let head=P('M111 101 H132 V125 Q121 135 110 123Z',skin)+P('M113 107 L131 113 V120 Q119 124 112 116Z',shade);
 let face=P('M102 73 Q103 55 123 55 Q141 56 142 76 L143 86 Q154 93 143 96 V102 Q140 118 126 119 Q109 120 103 104 L99 92Z',skin)+E(101,88,6,9,skin)+P('M100 87 Q104 82 105 92','none',shade,1.3)+E(134,101,5,2.5,mix(skin,p.rust,.6),{opacity:.66});
 let eyes=C(121,85,1.7,line)+C(136,84,1.7,line);if(o.animate){eyes=G(motion(G(eyes,'translate(-128 -85)'),['1 1','1 1','1 .08','1 1','1 1'],o,'scale',6,{keyTimes:'0;.72;.75;.78;1'}),'translate(128 85)',{'data-part':'eyes'});}else eyes=G(eyes,'',{'data-part':'eyes'});
 face+=eyes+P('M117 79 Q120 77 124 79 M133 77 Q136 75 139 77','none',line,1.4)+P('M130 85 L129 95 L133 96','none',shade,1)+P(i===10||i===9?'M126 106 Q132 105 135 106':'M125 104 Q130 111 136 104','none',line,1.25);
 if(i===11||i===24)face+=P('M125 104 Q131 114 137 103Z',p.paper);
 head+=face;
 let hairstyle=isWoman?(idx%4)+1:0;
 if(hairstyle===0){head+=P('M99 86 Q90 70 103 57 Q112 48 124 51 Q137 41 144 51 Q151 58 145 68 Q137 76 128 65 Q116 72 105 73 L106 91 L100 94Z',hair)+P('M107 60 Q120 53 133 55','none',mix(hair,p.paper,.23),2);}
 if(hairstyle===1){head+=C(96,79,15,hair)+C(94,99,13,hair)+P('M100 85 Q87 53 120 51 Q148 51 145 78 Q131 73 122 61 Q108 78 107 94Z',hair);}
 if(hairstyle===2){head+=P('M100 105 Q83 82 94 65 Q101 48 124 50 Q143 49 151 72 L151 110 L140 112 L140 74 L129 65 L111 80 L109 112Z',hair)+P('M96 72 Q97 56 117 55','none',mix(hair,p.paper,.25),2);}
 if(hairstyle===3){head+=P('M97 84 Q90 72 98 60 Q108 43 133 53 Q151 58 146 80 L137 78 L127 65 L108 82 L107 101 L98 95Z',hair)+P('M99 73 Q82 60 78 79 Q79 101 65 112 Q91 124 97 104Z',hair);}
 if(hairstyle===4){for(let j=0;j<7;j++)head+=C(98+j*7,63+(j%2)*4,10,hair);head+=P('M95 74 Q90 85 104 99 L111 83 L111 65Z',hair);}
 if(isWoman)head+=C(102,104,5.5,'none',{stroke:p.gold,'stroke-width':2});
 if(spec.age==='mayor'){head+=P('M103 62 Q124 49 139 61','none',p.paper,6)+P('M116 97 L120 99 M136 97 L140 95','none',shade,.8);}
 if(['investigadora','cientifica','bibliotecaria','ingeniera','abuela','abuelo'].includes(spec.key)||i===22)head+=R(115,79,13,13,'none',4,{stroke:line,'stroke-width':1.6})+R(131,78,13,13,'none',4,{stroke:line,'stroke-width':1.6})+L(128,83,131,83,line,1.1)+L(103,84,115,83,line,1.2);
 if(['cocinera','panadera'].includes(spec.key))head+=cloud(123,51,.37,p.paper,1)+R(103,48,39,15,p.paper,4)+L(106,57,139,57,p.blue,1.2);
 if(['agricultor','viajero','cartero'].includes(spec.key))head+=P('M101 62 L107 43 Q122 39 135 46 L143 65Z',p.gold)+E(121,66,34,5,p.gold)+P('M105 55 Q122 60 138 58','none',p.rust,4);
 if(spec.key==='bombero')head+=P('M96 66 Q99 40 122 40 Q146 43 146 68Z',p.gold)+R(92,66,58,7,p.rust,3)+R(117,45,11,17,p.paper,3);
 if(spec.key==='astronauta')head+=C(122,85,40,'none',{stroke:p.paper,'stroke-width':9})+C(122,85,44,'none',{stroke:p.blue,'stroke-width':1.3})+P('M94 60 Q101 48 114 47','none',p.paper,3)+R(160,77,9,20,p.gold,3);
 if(spec.key==='nino')head+=P('M100 63 Q121 37 141 62 L156 69 H99Z',p.blue)+L(105,62,150,66,line,1);
 if(spec.key==='nina')head+=flower(98,64,8,p,0);
 if(spec.key==='vendedora')head+=P('M99 61 Q120 49 141 62 L156 70 H99Z',p.teal);
 let tilt=[-2,-4,1,9,9,-5,8,-8,-3,7,9,-4,0,-4,-9,2,0,8,12,-3,10,-4,0,9,-2][i];
 if(o.action==='asentir')head=motion(head,['-3 122 118','8 122 118','-3 122 118'],o,'rotate',3);else if(o.animate)head=motion(head,['0 122 118','2 122 118','0 122 118','-1 122 118','0 122 118'],o,'rotate',6);
 out+=G(head,`rotate(${tilt} 122 118)`,{'data-part':'head','data-pivot':'122,118'});
 const propKey=i===16?'telefono':i===3?'libro':i===4?'cuaderno':i===19?'taza':spec.prop;
 if([1,2,3,4,8,16,17,18,19].includes(i)){const px=i===3?99:right[2]-19,py=i===3?150:right[3]-19;out+=G(drawObject(propKey,b%5,p),`translate(${px} ${py}) scale(.16)`,{'data-part':'held-prop'});}
 if(i===4||i===17)out+=L(right[2]-2,right[3]+1,right[2]+8,right[3]-21,p.ink,2);
 if(i===12)out+=G(drawObject('maleta',b,p),`translate(${left[2]-17} ${left[3]-7}) scale(.19)`);
 if(spec.key==='fotografa')out+=G(drawObject('camara',b,p),'translate(103 146) scale(.15)');
 if(o.animate&&['caminar','correr'].includes(o.action))out=motion(out,['0 0','0 -2','0 0','0 -2','0 0'],o,'translate',o.action==='correr'?.75:1.5);
 if(spec.age==='infancia')out=G(out,'translate(21 47) scale(.82)');else if(spec.age==='mayor')out=G(out,'translate(6 17) scale(.94)');
 return G(out,'',{'data-character':spec.key,'data-pose':pose[0]});
};

// Atmospheric landscapes · layered color, light, botanical foreground and story details.
landscapeShape=function(f,v,p,seed,o={}){
 const q=v%5,set=Math.floor(v/5),r=rng(seed),k=f.key,water=['costa','playa','lago','rio','cascada','isla','pantano','glaciar','acantilado','manglar','archipielago'].includes(k),desert=['desierto','oasis','canon'].includes(k),polar=['glaciar','tundra'].includes(k),night=['lunar','flotante'].includes(k);let s='';
 const sky=night?mix(p.blue,p.ink,.54):mix(p.blue,p.paper,.78),far=mix(p.blue,p.paper,.2),mid=desert?mix(p.rust,p.gold,.4):polar?mix(p.blue,p.paper,.2):p.sage;
 s+=G(R(0,0,400,260,sky)+C(298-q*20,53+q%2*9,34,night?p.paper:p.gold)+C(298-q*20,53+q%2*9,43,'none',{stroke:night?p.blue:p.gold,'stroke-width':1,opacity:.38}),'',{'data-layer':'sky'});
 let clouds=cloud(66+q*8,48,.57,p.paper,q)+cloud(232+q*8,35,.43,p.paper,q+1)+cloud(366,93,.44,mix(p.paper,p.blue,.1),q);s+=ambient(clouds,o,'clouds',3,0);
 if(night){s+=littleStars(p,400,145,seed,22);if(k==='lunar')s+=G(E(66,64,37,9,'none',{stroke:p.rust,'stroke-width':6})+C(66,64,20,p.blue),'rotate(-24 66 64)');}
 if(['alpino','lago','glaciar','acantilado','cascada'].includes(k)){
  let ridges='M-20 163 L52 '+(90+q*5)+' L94 128 L'+(159-q*6)+' 36 L220 118 L285 '+(65+q*6)+' L345 134 L414 89 V261 H-20Z';s+=G(P(ridges,far)+P(`M${159-q*6} 36 L${125-q*2} 85 L148 76 L163 90 L177 82 L189 91Z`,p.paper)+P(`M285 ${65+q*6} L261 101 L276 94 L290 111 L303 99Z`,mix(p.paper,p.blue,.1))+P(`M${159-q*6} 36 L220 118 L189 116 L175 99Z`,mix(far,p.blue,.5)),'',{'data-layer':'distant-mountains'});
 }else if(k==='tundra'){s+=P(`M-20 145 Q${80+q*11} 118 171 139 T420 119 V260 H-20Z`,far)+P('M-20 162 Q95 135 188 148 T420 143 V260 H-20Z',mix(p.blue,p.paper,.57));for(let j=0;j<6;j++)s+=P(`M${28+j*64} ${166+(j%2)*14} l10 -7 l16 4 l7 10Z`,mix(p.blue,p.paper,.12));}else if(!night)s+=P(`M-20 145 C48 ${51+q*9} 90 127 158 88 C209 49 250 93 280 102 Q338 57 420 133 V260 H-20Z`,far);
 if(['pinar','abedules','jungla','otono','manglar'].includes(k)){for(let j=0;j<11;j++){let xx=7+j*40,yy=170+(j%3)*11;s+=tree(xx,yy,.55+(.1*(j%3)),{...p,teal:mix(p.teal,p.paper,.22),sage:mix(p.sage,p.blue,.1)},k==='pinar'?0:k==='otono'?3:k==='jungla'?2:k==='abedules'?4:1);}}
 if(desert){s+=P(`M0 158 C69 ${79+q*4} 139 147 222 158 Q328 90 400 132 V260 H0Z`,p.gold)+P(`M0 202 Q92 ${123+q*9} 221 196 Q335 130 400 186 V260 H0Z`,p.rust)+P('M12 198 Q93 142 180 177','none',mix(p.rust,p.paper,.55),1.2);if(k==='canon'){for(let j=0;j<4;j++){let xx=j*113-30,hh=67+(j%2)*22;s+=P(`M${xx} 207 L${xx+23} ${hh+22} L${xx+46} ${hh} H${xx+70} L${xx+93} 208Z`,j%2?p.rust:mix(p.rust,p.blue,.27));for(let z=0;z<4;z++)s+=P(`M${xx+21} ${hh+38+z*17} q30 9 55 2`,'none',p.gold,2);}}
 if(k==='desierto')s+=P(`M${58+q*4} 209 V113 Q109 54 154 113 V209 H130 V119 Q107 91 82 123 V209Z`,mix(p.rust,p.blue,.37))+P('M161 224 L181 133 L208 122 L224 226Z',mix(p.rust,p.gold,.5));
 if(k==='oasis')s+=E(239,203,82,22,p.teal)+E(234,205,66,13,mix(p.teal,p.paper,.3))+tree(283,193,.73,p,2)+tree(194,199,.65,p,2);
 }else if(k==='volcan'){s+=P(`M0 225 L${130-q*6} 88 H${170+q*4} L319 226Z`,mix(p.blue,p.ink,.33))+P(`M${130-q*6} 88 H${170+q*4} L207 151 L176 139 L169 193 L155 146 L135 161 L145 118Z`,p.rust)+P('M151 94 L160 130 L154 144','none',p.gold,5);s+=ambient(cloud(153,57,.5,mix(p.blue,p.paper,.4),1)+cloud(166,25,.64,mix(p.blue,p.paper,.6),0),o,'volcanic-vapor',4);}
 else if(k==='flotante'){for(let j=0;j<4;j++){let xx=18+j*94,yy=122+(j%2)*44;let chunk=P(`M${xx} ${yy} L${xx+73} ${yy-8} L${xx+36} ${yy+65}Z`,p.blue)+E(xx+36,yy,40,10,p.sage)+tree(xx+36,yy,.4,p,(q+j)%6)+P(`M${xx+26} ${yy+9} L${xx+36} ${yy+46} L${xx+43} ${yy+10}`,'none',p.paper,1.5);s+=ambient(chunk,o,'floating-island-'+j,2+j*.6,-j);}}
 else if(k==='lunar'){s+=P('M0 181 Q110 117 208 179 T400 170 V260 H0Z',p.blue);for(let j=0;j<6+q;j++)s+=E(30+j*45,202+j%3*15,20+j%2*5,7,mix(p.blue,p.ink,.35))+P(`M${15+j*45} ${204+j%3*15} q15 8 32 0`,'none',p.paper,1.5);}
 else{
  s+=P(`M0 171 C85 ${129+q*9} 170 164 228 143 Q326 ${100+q*6} 400 163 V260 H0Z`,mid)+P(`M0 214 C98 ${169+q*4} 139 203 221 179 Q340 164 400 198 V260 H0Z`,water?mix(p.teal,p.paper,.17):p.teal);
  if(water){s+=P(`M0 195 Q${111+q*15} 175 215 185 Q320 167 400 185 V260 H0Z`,mix(p.teal,p.blue,.35));let lines='';for(let j=0;j<14;j++){let xx=10+r()*350,yy=196+r()*59;lines+=P(`M${n(xx)} ${n(yy)} q${10+j%3*4} -2 ${22+j%4*4} 0`,'none',mix(p.paper,p.teal,.1),j%4===0?1.4:.7,{opacity:.8});}s+=ambient(lines,o,'water-reflections',1.5);
   if(['rio','cascada','pantano','manglar'].includes(k)){s+=P(`M0 194 Q${61+q*8} 148 218 159 Q122 187 155 206 Q219 239 65 260 H0Z`,p.sage)+P('M281 154 Q199 182 277 216 Q325 241 263 260 H400 V165Z',p.teal);}
   if(k==='cascada'){s+=P('M95 167 L105 113 L166 106 L187 175Z',mix(p.blue,p.ink,.2))+P('M131 114 H156 Q151 143 174 180 Q156 191 140 183Z',p.paper)+P('M142 122 Q141 158 158 183','none',p.blue,2)+E(160,190,32,6,mix(p.paper,p.teal,.15));}
   if(['costa','playa','isla','archipielago'].includes(k)){s+=P(`M0 238 Q108 176 180 203 Q206 214 134 240 L190 260 H0Z`,mix(p.gold,p.paper,.37))+P('M2 244 Q74 200 139 214','none',p.paper,3);if(k==='isla'||k==='archipielago'){s+=E(289-q*8,172,61,12,p.gold)+tree(276-q*8,170,.5,p,2)+tree(298-q*8,171,.37,p,2);}if(k==='playa')s+=G(drawObject('paraguas',q,p),'translate(29 120) scale(.38)');}
   if(k==='pantano'){for(let j=0;j<10;j++){let xx=17+j*17,yy=225+(j%3)*6;s+=P(`M${xx} ${yy} v-31 m0 15 q-8 -13 -12 -13 m12 18 q10 -15 14 -15`,'none',p.teal,1.8)+R(xx-2,yy-40,4,13,p.rust,2);}for(let j=0;j<4;j++)s+=E(207+j*39,223+j%2*17,11,3,p.sage)+flower(207+j*39,220+j%2*17,3,p,j);}
   if(k==='archipielago'){for(let j=0;j<3;j++){let xx=139+j*74,yy=150+j%2*41;s+=E(xx,yy,27+j*7,6+j,p.gold)+tree(xx,yy,.22+j*.065,p,2);}}
   if(k==='glaciar')s+=Poly([[280,217],[297,118],[326,153],[350,141],[384,228]],p.paper)+Poly([[297,118],[310,216],[326,153]],p.blue);
   if(k==='acantilado')s+=P('M0 205 L48 82 L96 102 L105 171 L140 238 L0 260Z',p.blue)+P('M48 82 L83 122 L89 194','none',p.paper,2);
  }else if(k==='campos'||k==='sabana'){s+=P(`M0 228 Q190 ${151+q*8} 400 216 V260 H0Z`,p.gold);if(k==='campos'){for(let j=0;j<7;j++)s+=P(`M${j*64-28} 260 Q${110+j*33} 211 251 190`,'none',p.paper,2);}else{for(let j=0;j<12;j++){let xx=23+j*29,yy=215+(j%3)*13;s+=P(`M${xx} ${yy} l-5 -8 m5 8 l2 -11 m-2 11 l6 -6`,'none',p.sage,1.1);}s+=P('M277 218 L275 166 M275 183 L257 170 M275 183 L296 169','none',p.ink,3)+P('M221 167 Q230 153 251 157 Q271 140 288 155 Q316 145 333 165 Q313 177 278 172 Q245 178 221 167Z',p.sage);}}
 }
 if(!['lunar','flotante'].includes(k)){
  let fg=desert?mix(p.rust,p.blue,.27):mix(p.teal,p.ink,.19);s+=P(`M0 247 Q52 ${221-q*2} 115 243 Q174 260 230 253 Q344 225 400 243 V260 H0Z`,fg);
  if(set===0){if(polar){s+=P('M11 252 L22 222 L42 212 L64 231 L75 254Z',mix(p.blue,p.paper,.25))+P('M22 222 L42 212 L58 231 L42 226Z',p.paper);if(k==='tundra')for(let j=0;j<8;j++)s+=P(`M${272+j*14} 256 l-4 -12 m4 12 l3 -16`,'none',p.sage,1.2);}else if(desert){s+=P('M38 253 V189 M38 224 Q19 224 19 209 V203 M38 218 Q57 218 57 201 V195','none',p.teal,8)+P('M35 197 V244','none',p.paper,.8);for(let j=0;j<5;j++)s+=E(263+j*23,251+j%2*4,7,3,p.gold);}else{s+=tree(33+q*5,251,.84,p,['playa','isla','oasis'].includes(k)?2:k==='pinar'?0:k==='otono'?3:4);for(let j=0;j<7;j++)s+=flower(290+j*16,248-(j%3)*5,3.7,p,j);}}
  if(set===1){const xx=60+q*29;s+=R(xx,198,44,34,p.paper,2)+P(`M${xx-8} 199 L${xx+23} 171 L${xx+54} 199Z`,p.rust)+R(xx+8,208,10,12,p.teal,2)+R(xx+26,211,12,21,p.blue,3)+L(xx+9,214,xx+17,214,p.paper,1)+P(`M${xx+33} 233 Q${xx+88} 245 ${xx+40} 263`,'none',p.gold,10)+R(xx+39,177,7,16,p.blue);}
  if(set===2){s+=P(`M${23+q*18} 260 Q101 216 261 202`,'none',p.gold,8);for(let j=0;j<3;j++){let xx=73+j*65,yy=241-j*15;s+=P(`M${xx} ${yy} L${xx+9} ${yy-11} L${xx+22} ${yy-9} L${xx+30} ${yy+3}Z`,mix(p.blue,p.paper,.13));}}
  if(set===3){s+=P(`M${43+q*8} 230 Q196 183 352 229`,'none',p.rust,8)+P('M53 211 Q198 167 346 211','none',p.gold,2.5);for(let j=0;j<10;j++){let xx=58+j*31,yy=213-Math.sin(j/9*Math.PI)*24;s+=L(xx,yy,xx,yy+18,p.ink,1.5);}}
  s+=leaf(367,262,.56,p.blue,-23,q)+leaf(384,261,.68,p.sage,20,q+1);
 }
 let birds=P(`M${184+q*5} 62 q5 -6 10 0 q5 -6 10 0 M${205+q*4} 85 q3 -4 7 0 q4 -4 8 0`,'none',mix(p.blue,p.ink,.3),1.3);s+=ambient(birds,o,'distant-birds',2);
 return G(s,'',{'data-scene':'landscape-'+k});
};

// Object refinement uses the existing specialized families; assemblies remain editable.
const v1DrawObject=drawObject;
drawObject=function(key,v,p=DEFAULT_PALETTE){const q=v%5,ext=v>=5;let s='';
 if(key==='microfono'){
  s=E(121,214,52,7,mix(p.blue,p.paper,.5))+R(116,140,10,62,p.blue,5)+E(121,204,35,6,p.ink)+P('M80 96 V128 Q80 159 121 159 Q163 159 163 127 V97','none',p.ink,5)+R(89,35,65,109,p.blue,29,{stroke:p.ink,'stroke-width':2})+R(96,43,51,88,p.teal,22)+P('M103 54 Q109 43 132 49','none',p.paper,3);for(let j=0;j<8;j++)s+=L(101,63+j*7,141,63+j*7,mix(p.teal,p.ink,.5),2.4);s+=R(108,120,26,8,p.gold,3)+C(121,151,6,p.rust)+C(81,113,5,p.gold)+C(163,113,5,p.gold);if(ext)s+=P('M146 153 Q193 165 175 201 H193','none',p.ink,2);else s+=P(`M${169+q*3} 69 q${11+q*2} 23 0 42 M${178+q*3} 60 q${17+q*2} 32 0 61`,'none',p.rust,2);s+=R(115,183+q*2,12,5,p.paper,2);
 }else if(key==='cereal'){
  s=P(`M68 48 L142 ${34-q*2} L177 50 V191 L103 210 L68 190Z`,p.rust)+P('M142 34 L177 50 V191 L144 204Z',mix(p.rust,p.blue,.37))+P('M68 48 L142 34 L177 50 L103 67Z',p.gold)+P('M68 48 L103 67 V210 L68 190Z',mix(p.rust,p.paper,.3))+R(113,84,28,60,p.paper,12)+leaf(128,140,.65,p.gold,0,0)+E(124,169,19,8,p.paper)+E(124,167,17,4,p.gold);for(let i=0;i<7;i++)s+=C(112+i%4*7,165+Math.floor(i/4)*4,2,p.rust);s+=L(75,111,95,122,p.paper,2)+L(75,122,95,133,p.paper,2);if(ext)s+=R(151,75,14,57,p.paper,3)+L(156,85,156,124,p.teal,2);else s+=P(`M111 ${151-q} H136`,'none',p.gold,2);
 }else s=v1DrawObject(key,v,p);
 return G(s,'',{'data-illustration':'refined-'+key});
};
const v1Assembly=drawObjectAssembly;
drawObjectAssembly=function(f,v,p){let s=E(178,239,146,9,mix(p.blue,p.paper,.66));s+=v1Assembly(f,v,p);return G(s,'',{'data-studio':'object-collection'});};

// Illustrative buildings are generic designs, not replicas of named sacred sites.
const SACRED_SCENES=[
 ['mezquita','Mezquita de cúpulas','Islam','mosque'],['mezquita-patio','Mezquita con patio porticado','Islam','courtyard'],['iglesia','Iglesia con campanario','Cristianismo','church'],['catedral','Catedral y rosetón','Cristianismo','cathedral'],['sinagoga','Sinagoga y jardín','Judaísmo','synagogue'],['templo-hindu','Templo hindú de torre escalonada','Hinduismo','hindu'],['pagoda-budista','Pagoda budista de varios niveles','Budismo','pagoda'],['estupa','Estupa con terrazas','Budismo','stupa'],['gurdwara','Gurdwara de cúpulas','Sijismo','gurdwara'],['santuario-shinto','Santuario sintoísta y torii','Sintoísmo','shinto']
].map(([key,label,tradition,architecture])=>({key,label,group:'Arquitectura religiosa',tradition,architecture,sacred:true,props:['banco','maceta','farola','libro']}));
const SACRED_SYMBOLS=[
 ['estrella-david','Estrella de David','Judaísmo'],['menora','Menorá de siete brazos','Judaísmo'],['janukia','Janukiá de nueve luces','Judaísmo'],['cruz-latina','Cruz latina','Cristianismo'],['cruz-ortodoxa','Cruz ortodoxa de tres travesaños','Cristianismo'],['pez-icthus','Ichthys · pez cristiano','Cristianismo'],['creciente','Luna creciente y estrella','Asociado a algunas tradiciones islámicas'],['dharmachakra','Dharmachakra · rueda de ocho radios','Budismo'],['loto','Flor de loto','Tradiciones budistas e hinduistas'],['khanda','Khanda sij','Sijismo'],['torii','Puerta torii','Sintoísmo'],['yin-yang','Taijitu · yin y yang','Taoísmo'],['manos-oracion','Manos en gesto de oración','Gesto espiritual compartido'],['diya','Lámpara de aceite diya','Tradiciones del sur de Asia']
].map(([key,label,tradition])=>({key,label,group:'Símbolos religiosos y espirituales',tradition,sacred:true}));
function sixPoint(x,y,r,color,sw=2){let up=[],down=[];for(let j=0;j<3;j++){let a=-Math.PI/2+j*2*Math.PI/3;up.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);a+=Math.PI;down.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}return Poly(up,'none',color,sw)+Poly(down,'none',color,sw);}
function sacredGlyph(key,p){let s='',ic=p.ink,accent=p.rust;
 switch(key){
 case 'estrella-david':s=sixPoint(64,64,49,ic,5);break;
 case 'menora':case 'janukia':{const count=key==='menora'?7:9,half=(count-1)/2,step=count===7?15:12;for(let j=1;j<=half;j++){let ww=j*step;s+=P(`M${64-ww} 45 V${57+j*4} Q${64-ww} ${94+j*1.5} 64 98 Q${64+ww} ${94+j*1.5} ${64+ww} ${57+j*4} V45`,'none',ic,3.7);}s+=L(64,key==='janukia'?27:45,64,110,ic,4)+P('M40 116 Q64 103 88 116Z',accent);for(let j=0;j<count;j++){let xx=64+(j-half)*step,yy=(key==='janukia'&&j===half)?22:39;s+=G(R(xx-2,yy,4,12,p.gold,1)+P(`M${xx} ${yy-4} Q${xx-5} ${yy-10} ${xx} ${yy-17} Q${xx+5} ${yy-10} ${xx} ${yy-4}Z`,accent),'',{'data-candle':String(j+1)});}break;}
 case 'cruz-latina':s=P('M53 16 H75 V49 H106 V70 H75 V116 H53 V70 H22 V49 H53Z',ic)+P('M59 23 H69 V109 H59Z',mix(p.blue,p.paper,.4));break;
 case 'cruz-ortodoxa':s=R(60,12,9,110,ic,2)+R(45,31,39,7,ic,2)+R(28,51,74,9,ic,2)+P('M37 91 L91 105 L93 98 L39 84Z',ic);break;
 case 'pez-icthus':s=P('M12 66 C39 12 78 26 113 94 M12 66 C39 113 78 102 113 38','none',ic,5)+C(41,61,3,accent);break;
 case 'creciente':s=P('M79 17 A47 47 0 1 0 104 91 A41 41 0 0 1 79 17Z',ic)+star(95,46,18,5,.4,p.gold);break;
 case 'dharmachakra':s=C(64,64,42,'none',{stroke:ic,'stroke-width':5})+C(64,64,34,'none',{stroke:p.gold,'stroke-width':2});for(let j=0;j<8;j++){let a=j*Math.PI/4;s+=L(64+Math.cos(a)*11,64+Math.sin(a)*11,64+Math.cos(a)*49,64+Math.sin(a)*49,ic,3.5)+C(64+Math.cos(a)*50,64+Math.sin(a)*50,3,accent);}s+=C(64,64,10,p.gold,{stroke:ic,'stroke-width':3});break;
 case 'loto':for(let j=-2;j<=2;j++)s+=G(P('M64 110 C11 79 39 29 64 14 C91 42 115 79 64 110Z',j===0?p.rust:j%2?p.blue:p.teal,ic,1.3),`rotate(${j*24} 64 110)`);s+=P('M17 110 Q64 93 111 110 Q64 132 17 110Z',p.teal);break;
 case 'khanda':s=C(64,62,26,'none',{stroke:ic,'stroke-width':4})+P('M64 12 L74 32 L69 38 V88 L78 96 L64 115 L50 96 L59 88 V38 L54 32Z',ic)+P('M30 28 C0 65 22 100 55 101 M98 28 C128 65 106 100 73 101','none',ic,6)+P('M31 27 L17 41 L33 37Z',ic)+P('M97 27 L111 41 L95 37Z',ic)+L(39,110,53,100,ic,6)+L(89,110,75,100,ic,6);break;
 case 'torii':s=P('M12 28 Q64 40 116 28 L111 39 Q64 49 17 39Z',p.rust)+R(16,49,96,9,p.rust,2)+P('M33 37 L28 118 H40 L44 37 M83 37 L88 118 H100 L94 37Z',p.rust)+R(59,39,10,21,ic,1)+R(26,107,17,10,ic,1)+R(86,107,17,10,ic,1);break;
 case 'yin-yang':s=C(64,64,47,p.paper,{stroke:ic,'stroke-width':3})+P('M64 17 A47 47 0 0 1 64 111 A23.5 23.5 0 0 1 64 64 A23.5 23.5 0 0 0 64 17Z',ic)+C(64,40.5,6,ic)+C(64,87.5,6,p.paper);break;
 case 'manos-oracion':s=P('M14 100 L41 86 L57 32 Q60 22 64 30 L64 77 Q57 99 36 114Z',p.skin,ic,2)+P('M114 100 L87 86 L71 32 Q68 22 64 30 L64 77 Q71 99 92 114Z',p.skin,ic,2)+P('M12 102 L35 88 L46 112 L21 124Z',p.blue)+P('M116 102 L93 88 L82 112 L107 124Z',p.teal);break;
 case 'diya':s=P('M10 78 Q64 99 117 63 Q107 117 65 117 Q24 116 10 78Z',p.rust,ic,2)+E(63,80,47,12,p.gold)+P('M80 75 Q55 56 77 21 Q102 47 80 75Z',p.gold)+P('M80 70 Q72 58 81 42 Q94 57 80 70Z',p.paper)+P('M22 95 Q59 114 93 94','none',p.gold,2);break;
 default:throw Error('Símbolo espiritual no registrado: '+key);
 }
 return G(s,'',{'data-sacred-symbol':key});
}
function drawSacredSymbol(f,v,p){const q=v%5,ic=inkLine(p);let s='',glyph=sacredGlyph(f.key,{...p,ink:ic});
 if(v===0)s=E(129,221,80,8,mix(p.blue,p.paper,.6))+G(glyph,'translate(61 42) scale(1.04)');
 else if(v===1)s=R(31,26,194,199,p.paper,28,{stroke:p.blue,'stroke-width':1.5})+P('M31 67 Q31 25 75 26 H181 Q225 26 225 67','none',p.rust,4)+G(glyph,'translate(65 54)')+L(76,203,181,203,p.gold,3);
 else if(v===2)s=E(128,122,92,103,mix(p.blue,p.paper,.53))+G(glyph,'translate(64 56)')+G(leaf(50,219,.7,p.teal,-14,2))+G(leaf(210,219,.7,p.sage,14,0));
 else if(v===3){s=P('M36 220 V102 Q128 -27 220 102 V220Z',p.blue)+P('M48 211 V105 Q129 0 208 105 V211Z',p.paper)+G(glyph,'translate(64 76) scale(.98)');for(let j=0;j<3;j++)s+=R(29-j*5,223+j*6,198+j*10,4,p.gold,1);}
 else if(v===4){s=R(35,29,187,185,p.teal,35)+R(43,37,171,169,p.paper,27)+G(glyph,'translate(64 54)');for(let j=0;j<4;j++)s+=flower(43+j*55,221,7,p,j);}
 else if(v===5)s=G(glyph,'translate(35 40) scale(.92)')+P('M188 45 V201','none',p.gold,3)+G(plant(197,207,.62,p,2))+E(110,218,91,5,mix(p.blue,p.paper,.6));
 else if(v===6)s=R(34,37,164,179,p.blue,13)+R(58,19,164,179,p.paper,13,{stroke:p.blue,'stroke-width':1.4})+G(glyph,'translate(77 41) scale(.94)')+L(80,178,190,178,p.gold,2);
 else if(v===7){s=E(128,119,91,91,p.paper,{stroke:p.teal,'stroke-width':3})+G(glyph,'translate(64 55)');for(let j=0;j<8;j++){let a=j*Math.PI/4;s+=flower(128+Math.cos(a)*96,119+Math.sin(a)*96,6,p,j);}}
 else if(v===8)s=P('M36 219 V41 Q128 2 220 41 V219Z',p.rust)+P('M49 207 V51 Q128 16 207 51 V207Z',p.paper)+G(glyph,'translate(66 60) scale(.97)')+R(25,219,207,8,p.gold,3);
 else s=R(28,29,201,161,p.paper,18,{stroke:p.blue,'stroke-width':2})+G(glyph,'translate(68 43) scale(.94)')+P('M40 200 H216 L235 228 H20Z',p.teal)+L(78,213,182,213,p.paper,2)+flower(40,36,12,p,0);
 return G(s,'',{'data-tradition':f.tradition,'data-composition':q});
}
function archWindow(x,y,w,h,p,shape='round'){const d=shape==='pointed'?`M${x} ${y+h} V${y+h*.4} Q${x} ${y+h*.15} ${x+w/2} ${y} Q${x+w} ${y+h*.15} ${x+w} ${y+h*.4} V${y+h}Z`:`M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z`;return P(d,p.blue,p.paper,2)+L(x+w/2,y+w*.35,x+w/2,y+h,p.paper,1)+L(x+2,y+h*.63,x+w-2,y+h*.63,p.paper,1);}
function dome(x,y,w,h,p,color=p.blue){return P(`M${x} ${y} C${x-6} ${y-h*.48} ${x+w*.38} ${y-h*.7} ${x+w/2} ${y-h} C${x+w*.64} ${y-h*.68} ${x+w+6} ${y-h*.48} ${x+w} ${y}Z`,color)+P(`M${x+w*.18} ${y-4} Q${x+w*.09} ${y-h*.4} ${x+w*.46} ${y-h*.81}`,'none',mix(color,p.paper,.48),2)+L(x+w/2,y-h,x+w/2,y-h-9,p.gold,2)+C(x+w/2,y-h-11,2,p.gold)+R(x-3,y,w+6,6,p.gold,1);}
function arcade(x,y,count,w,h,p,pointed=false){let s='';for(let j=0;j<count;j++)s+=archWindow(x+j*(w+10),y,w,h,p,pointed?'pointed':'round');return s;}
function drawSacredScene(f,v,p,seed,o={}){
 const q=v%5,layout=Math.floor(v/5),isEven=q%2===0,k=f.architecture;let s=R(0,0,400,300,mix(p.blue,p.paper,.84));s+=C(314-q*15,52,29,p.gold)+ambient(cloud(75,45,.57,p.paper,q)+cloud(327,88,.43,p.paper,q+1),o,'clouds',2);
 s+=P('M0 178 Q79 120 162 158 Q302 106 400 170 V300 H0Z',mix(p.sage,p.paper,.49))+P('M0 242 Q196 212 400 245 V300 H0Z',mix(p.rust,p.paper,.75));
 let building='',base=246,wall=mix(p.rust,p.paper,.62),shadow=mix(p.blue,p.paper,.35),orn=inkLine(p);
 const plinth=(x,y,w)=>R(x-7,y+6,w+14,6,p.paper,2)+R(x-14,y+13,w+28,6,p.blue,2)+R(x-20,y+19,w+40,6,p.paper,2);
 if(k==='mosque'||k==='courtyard'){
  const h=q%2?85:100,xx=116-q*3,ww=167+q*6;building+=R(xx,base-h,ww,h,wall,2)+R(xx+ww,base-h+14,23,h-14,shadow)+R(xx-30,base-58,37,58,p.paper,2)+R(xx+ww-5,base-58,37,58,p.paper,2);
  building+=dome(xx+16,base-h,ww-32,59+q*3,p,p.teal)+R(xx-6,base-h-2,ww+12,8,p.gold,2);
  for(const tx of [69-q*4,315+q*3]){building+=R(tx,88,15,158,p.paper,3)+R(tx+11,92,6,154,shadow)+R(tx-5,111,27,5,p.gold,2)+R(tx-3,85,24,7,p.blue,2)+dome(tx-2,86,20,25,p,p.blue)+L(tx+8,50,tx+8,55,p.gold,2)+R(tx-5,240,29,6,p.gold,1)+archWindow(tx+4,123,7,26,{...p,blue:p.teal});}
  building+=P('M177 246 V191 Q177 173 200 162 Q223 173 223 191 V246Z',p.blue,p.gold,6)+P('M184 246 V194 Q184 179 200 174 Q216 180 216 194 V246Z',p.ink)+P('M188 246 V197 Q189 185 200 181 Q212 186 212 197 V246Z',mix(p.teal,p.ink,.14));
  building+=arcade(128-q*2,187,2,15,38,p,true)+arcade(244,187,2,15,38,p,true);
  for(let j=0;j<13;j++)building+=star(125+j*12,base-h+13,3,8,.7,p.blue);
  if(k==='courtyard'){building+=R(45,199,112,6,p.rust,2)+R(244,199,112,6,p.rust,2)+arcade(50,205,4,16,40,{...p,blue:shadow})+arcade(249,205,4,16,40,{...p,blue:shadow})+R(38,246,122,7,p.gold,2)+R(242,246,122,7,p.gold,2);}
  building+=plinth(xx,246,ww);
 }else if(k==='church'||k==='cathedral'||k==='synagogue'){
  const tall=k==='cathedral',central=125+q*3,ww=153-q*4;building+=R(central,130,ww,115,wall,2)+P(`M${central-8} 132 L200 ${tall?64:84} L${central+ww+8} 132Z`,p.rust)+P(`M${central+ww} 142 L${central+ww+29} 157 V245 H${central+ww}Z`,shadow);
  let towerXs=k==='church'?[72-q*3]:[72-q*2,288+q*2];
  for(let tx of towerXs){building+=R(tx,tall?76:98,39,tall?169:147,p.paper,2)+R(tx+30,tall?79:101,9,tall?166:144,shadow)+R(tx-4,145,47,6,p.gold,2)+archWindow(tx+11,tall?102:114,17,34,{...p,blue:p.teal},tall?'pointed':'round');
   if(k==='synagogue')building+=dome(tx-2,98,43,34,p,p.blue);else building+=P(`M${tx-7} ${tall?78:99} L${tx+20} ${tall?29:55} L${tx+47} ${tall?78:99}Z`,p.blue)+L(tx+20,tall?20:46,tx+20,tall?34:60,p.gold,2)+L(tx+14,tall?26:52,tx+26,tall?26:52,p.gold,2);}
  if(k==='synagogue'){building+=C(200,151,25,p.paper,{stroke:p.blue,'stroke-width':3})+sixPoint(200,151,17,p.teal,2.2)+P('M182 245 V209 Q183 184 200 184 Q217 184 218 209 V245Z',p.teal)+L(200,190,200,245,p.paper,1.4)+C(196,222,1.4,p.gold)+C(204,222,1.4,p.gold);}
  else{building+=C(200,151,24,p.blue,{stroke:p.paper,'stroke-width':4});for(let j=0;j<8;j++){let aa=j*Math.PI/4;building+=G(E(200,135,4,9,j%2?p.gold:p.rust),`rotate(${j*45} 200 151)`)+L(200+Math.cos(aa)*7,151+Math.sin(aa)*7,200+Math.cos(aa)*23,151+Math.sin(aa)*23,p.paper,1);}building+=C(200,151,5,p.paper)+P('M181 246 V207 Q185 191 200 183 Q215 191 219 207 V246Z',p.ink)+P('M186 246 V211 Q188 197 200 191 Q212 197 214 211 V246Z',p.rust)+L(200,196,200,246,p.gold,1.5);building+=L(200,64,200,78,p.gold,2)+L(194,69,206,69,p.gold,2);}
  building+=archWindow(140,185,20,38,p,tall?'pointed':'round')+archWindow(240,185,20,38,p,tall?'pointed':'round')+plinth(65,246,278);
 }else if(k==='hindu'){
  const levels=6+q%2;building+=R(101,196,200,51,wall,3)+R(130,180,145,66,p.paper,2);
  for(let j=0;j<levels;j++){let yy=178-j*20,ww=116-j*12;building+=P(`M${200-ww/2} ${yy} L${204-ww/2} ${yy-16} L${196+ww/2} ${yy-16} L${200+ww/2} ${yy}Z`,j%2?p.rust:p.gold)+R(196-ww/2,yy,ww+8,5,p.paper,1);for(let z=0;z<Math.max(1,5-j);z++)building+=P(`M${205-ww/2+z*16} ${yy-3} v-7 q4 -8 8 0 v7Z`,shadow);}
  building+=C(200,36,6,p.gold)+L(200,24,200,35,p.gold,2)+P('M200 24 Q220 11 229 25 Q214 22 201 30Z',p.rust);
  for(let x of [110,262]){building+=R(x,173,29,73,wall)+P(`M${x-8} 175 L${x+14} 130 L${x+39} 175Z`,p.blue)+R(x-10,173,50,5,p.gold,2)+archWindow(x+7,201,15,38,p,true);}
  building+=P('M181 246 V215 Q183 198 200 196 Q218 199 219 215 V246Z',p.ink)+R(176,197,6,49,p.gold,2)+R(218,197,6,49,p.gold,2)+R(174,193,53,6,p.gold,2)+plinth(88,246,224);
 }else if(k==='pagoda'){
  const levels=3+q%3;for(let j=0;j<levels;j++){let yy=base-j*40,ww=144-j*17;building+=R(200-ww/2,yy-36,ww,36,p.paper,1)+R(200+ww/2-17,yy-36,17,36,shadow)+R(200-ww/2-4,yy-3,ww+8,6,p.rust,1);for(let z=0;z<3;z++)building+=R(200-ww/2+16+z*(ww-38)/2,yy-29,10,20,p.blue,2)+L(200-ww/2+21+z*(ww-38)/2,yy-29,200-ww/2+21+z*(ww-38)/2,yy-9,p.gold,1);
   building+=P(`M${200-ww/2-22} ${yy-39} Q${178-ww/2} ${yy-22} 200 ${yy-59} Q${222+ww/2} ${yy-22} ${200+ww/2+22} ${yy-39} Q200 ${yy-22} ${200-ww/2-22} ${yy-39}Z`,p.teal)+P(`M${200-ww/2-22} ${yy-39} Q200 ${yy-18} ${200+ww/2+22} ${yy-39}`,'none',p.gold,2);}
  building+=L(200,base-levels*40-25,200,base-levels*40-9,p.gold,2)+C(200,base-levels*40-25,3,p.gold)+plinth(103,246,194);
 }else if(k==='stupa'){
  building+=R(115,226,170,20,p.gold,4)+R(100,242,200,8,p.paper,2)+P('M117 226 A83 83 0 0 1 283 226Z',p.paper)+P('M203 146 Q259 164 270 226 H280 A83 83 0 0 0 203 143Z',shadow)+R(183,137,34,17,p.blue,2)+R(177,131,46,7,p.gold,1)+L(200,52,200,134,p.gold,4);
  for(let j=0;j<5+q%2;j++){let ww=45-j*5,yy=122-j*12;building+=P(`M${200-ww/2} ${yy} Q200 ${yy-12} ${200+ww/2} ${yy}Z`,j%2?p.rust:p.gold)+L(200-ww/2,yy,200+ww/2,yy,p.paper,1);}
  building+=C(200,48,5,p.gold)+plinth(90,250,220)+P('M186 245 V218 Q200 203 214 218 V245Z',p.teal)+R(160,198,80,4,p.gold,2);
 }else if(k==='gurdwara'){
  building+=R(105,168,191,78,p.paper,2)+R(112,157,177,12,p.gold,2)+R(147,121,106,125,wall,2)+dome(150,122,100,50,p,p.gold);
  for(let tx of [96,267])building+=R(tx,151,40,95,p.paper,2)+dome(tx-2,151,44,34,p,p.blue)+archWindow(tx+12,179,16,38,p,true);
  building+=P('M180 246 V199 Q180 181 200 168 Q220 181 220 199 V246Z',p.teal,p.gold,3)+G(sacredGlyph('khanda',{...p,ink:p.blue}),'translate(187 128) scale(.2)')+arcade(147,193,1,19,41,p,true)+arcade(235,193,1,19,41,p,true)+plinth(85,246,230);
  building+=L(337,64,337,263,p.gold,3)+P('M338 64 L379 82 L338 101Z',p.rust)+G(sacredGlyph('khanda',{...p,ink:p.ink}),'translate(339 72) scale(.12)');
 }else if(k==='shinto'){
  building+=R(110,159,189,80,p.rust,3)+R(126,171,155,69,p.paper,2)+R(172,183,63,57,p.blue,1)+L(193,185,193,240,p.paper,1)+L(215,185,215,240,p.paper,1)+P('M76 167 Q121 158 162 117 H249 Q287 160 329 167 Q205 153 76 167Z',mix(p.teal,p.ink,.25))+P('M76 167 Q205 151 329 167','none',p.gold,4)+R(117,239,178,8,p.gold,2);
  building+=P('M162 117 L243 68 M248 117 L168 68','none',p.gold,4)+P('M101 125 Q201 161 298 125','none',p.gold,3);for(let j=0;j<5;j++)building+=P(`M${135+j*31} 139 l6 8 l-4 7 l7 7`,'none',p.paper,3);
  building+=plinth(92,245,225)+G(sacredGlyph('torii',p),'translate(19 150) scale(.65)');
 }
 s+=G(building,'',{'data-layer':'sacred-architecture','data-tradition':f.tradition});
 if(layout===0){s+=E(203,281,78+q*3,11,p.teal)+E(203,278,70+q*3,6,mix(p.teal,p.paper,.55))+ambient(P('M147 279 H190 M215 280 H251 M173 284 H222','none',p.paper,1.2),o,'pool-reflection',1.5)+tree(29,251,.59,p,q%2?3:1)+tree(371,250,.54,p,q%2?1:3);}
 else{s+=P('M181 274 L143 300 H273 L224 274Z',p.paper)+R(163,277,73,3,p.gold)+G(drawObject('banco',q,p),'translate(278 226) scale(.3)')+G(plant(44,276,.5,p,2),'')+tree(29,258,.7,p,3);for(let j=0;j<5;j++)s+=flower(290+j*16,287-j%2*7,4,p,j);}
 s+=G(drawPerson(PEOPLE[(q+v)%26],v%2?5:1,p),`translate(${layout?40:31} 213) scale(.19)`,{'data-layer':'visitors'})+G(drawPerson(PEOPLE[(q+7)%26],9,p),'translate(318 220) scale(.18)',{'data-layer':'visitors'});
 s+=leaf(12,307,.7,p.teal,-37,q)+leaf(383,308,.7,p.blue,23,q)+flower(378,282,6,p,2);return G(s,'',{'data-scene':f.key});
}

// Spatial scenes. Every family has its own set dressing; people inhabit the space.
drawScene=function(f,v,p,seed,o={}){
 if(f.sacred)return drawSacredScene(f,v,p,seed,o);
 const q=v%4,set=Math.floor(v/4),outdoor=['calle','plaza','granja','estacion'].includes(f.key),key=f.key;let s=R(0,0,400,300,p.paper),walls='';
 const place=(k,x,y,sc=.4,vv=v)=>G(drawObject(k,vv%10,p),`translate(${x} ${y}) scale(${sc})`,{'data-part':'prop-'+k});
 if(outdoor){
  walls+=R(0,0,400,221,mix(p.blue,p.paper,.72))+C(320-q*20,46,27,p.gold)+ambient(cloud(64,49,.54,p.paper,q)+cloud(290,88,.43,p.paper,q+1),o,'clouds',2.5);
  for(let j=0;j<4;j++){let xx=j*114-14,hh=118+(j*13+q*7)%45;walls+=R(xx,213-hh,102,hh,[mix(p.rust,p.paper,.56),mix(p.blue,p.paper,.39),mix(p.gold,p.paper,.23),mix(p.teal,p.paper,.45)][j],3)+R(xx+84,215-hh,18,hh-2,[p.rust,p.blue,p.gold,p.teal][j]);for(let z=0;z<2;z++)for(let u=0;u<2;u++)walls+=archWindow(xx+17+u*35,223-hh+z*37,19,27,{...p,blue:mix(p.blue,p.ink,.22)});walls+=R(xx+12,179,70,34,p.teal,3)+P(`M${xx+7} 180 L${xx+18} 166 H${xx+75} L${xx+88} 180Z`,p.rust)+L(xx+50,180,xx+50,211,p.gold,1);}
  walls+=P('M0 215 H400 V300 H0Z',mix(p.rust,p.paper,.6))+P('M0 250 L400 231','none',p.paper,3)+P('M0 290 L400 261 M67 217 L20 300 M220 216 L220 300 M345 215 L400 297','none',mix(p.rust,p.paper,.82),1.7);
  if(key==='granja')walls=R(0,0,400,300,mix(p.blue,p.paper,.7))+C(296,43,29,p.gold)+P('M0 196 Q141 60 400 197 V300 H0Z',p.sage)+P('M0 267 Q215 140 400 258 V300 H0Z',p.teal)+R(195,124,150,102,p.rust,2)+P('M180 126 L270 55 L360 126Z',p.blue)+R(246,167,55,59,p.paper,2)+P('M253 175 L293 219 M293 175 L253 219','none',p.rust,3)+R(226,128,20,23,p.gold,2)+R(304,128,20,23,p.gold,2)+tree(38,223,.7,p,3);
  if(key==='plaza'){
   walls=R(0,0,400,300,mix(p.blue,p.paper,.78))+C(317-q*13,43,28,p.gold)+ambient(cloud(73,51,.48,p.paper,q),o,'clouds',2.5)+P('M0 191 Q198 125 400 189 V300 H0Z',mix(p.sage,p.paper,.25))+P('M24 300 L130 182 H281 L399 300Z',mix(p.rust,p.paper,.60));
   for(let j=0;j<6;j++)walls+=P(`M${40+j*62} 299 L${131+j*28} 183`,'none',p.paper,1.8);
   walls+=E(213,220,69,16,p.blue)+E(213,217,60,12,p.teal)+R(207,154,12,56,p.paper,5)+E(213,157,40,10,p.blue)+E(213,154,35,7,p.teal)+R(209,127,8,25,p.paper,3)+C(213,120,7,p.gold);
   for(let j=0;j<5;j++)walls+=P(`M213 123 Q${182+j*15} 128 ${176+j*18} 154`,'none',p.paper,1.7);
   walls+=tree(51,206,.83,p,4)+tree(356,218,.86,p,3);
  }
  if(key==='estacion')walls+=R(0,131,400,8,p.blue,2)+R(35,133,7,84,p.ink,2)+R(361,133,7,84,p.ink,2)+P('M-5 130 L44 96 H356 L411 130Z',p.teal)+place('tren',183,139,.55,q)+place('reloj',177,70,.27,q);
 }else{
  const corner=272+q*16;
  walls+=R(0,0,400,214,mix(p.rust,p.paper,.75))+P(`M${corner} 0 H400 V240 L${corner-35} 208Z`,mix(p.blue,p.paper,.55))+P(`M0 212 L${corner-35} 208 L400 239 V300 H0Z`,mix(p.gold,p.paper,.4));
  for(let j=0;j<6;j++)walls+=P(`M${j*82-58} 300 L${117+j*32} 210`,'none',mix(p.gold,p.paper,.68),1.2);
  const wx=25+q*8,ww=112+set*5;
  walls+=P(`M${wx} 159 V65 Q${wx+ww/2} -3 ${wx+ww} 65 V159Z`,p.paper)+P(`M${wx+7} 152 V69 Q${wx+ww/2} 11 ${wx+ww-7} 69 V152Z`,mix(p.blue,p.paper,.5))+P(`M${wx+7} 138 Q${wx+ww/2} 111 ${wx+ww-7} 138 V152 H${wx+7}Z`,p.sage)+L(wx+ww/2,34,wx+ww/2,154,p.paper,4)+L(wx+4,96,wx+ww-4,96,p.paper,4)+R(wx-4,158,ww+8,7,p.blue,3);
  walls+=P(`M${wx+7} 165 L${wx+ww-8} 165 L${corner+46} 279 L142 281Z`,mix(p.gold,p.paper,.22),null,0,{opacity:.44});
  let curtain=P(`M${wx-1} 52 Q${wx+10} 74 ${wx+1} 124 L${wx-11} 170 Q${wx+8} 176 ${wx+22} 170 L${wx+31} 55Z`,p.blue)+P(`M${wx+6} 66 Q${wx+14} 106 ${wx-1} 164`,'none',mix(p.blue,p.paper,.5),2);
  walls+=ambient(curtain,o,'curtain',.6);
  const lx=231+q*9;walls+=L(lx,0,lx,49,p.ink,1.8)+P(`M${lx-25} 70 Q${lx-5} 43 ${lx} 45 Q${lx+19} 46 ${lx+29} 70Z`,p.rust)+E(lx+2,70,28,5,p.gold)+P(`M${lx-23} 77 L${lx-96} 236 H${lx+100} L${lx+23} 77Z`,p.gold,null,0,{opacity:.11});
  walls+=R(297,27,70,72,p.paper,6,{stroke:p.blue,'stroke-width':2})+G(leaf(329,87,.63,p.teal,-10,2))+C(348,48,11,p.gold);
  if(['espacial','planetario'].includes(key)){walls+=P('M17 147 V64 Q194 -41 383 66 V147Z',mix(p.blue,p.ink,.67))+C(265,64,26,p.gold)+E(265,64,45,9,'none',{stroke:p.rust,'stroke-width':4,transform:'rotate(-22 265 64)'})+littleStars(p,380,145,seed,20)+L(147,20,147,147,p.paper,4)+L(272,27,272,147,p.paper,4);}
  if(key==='castillo')walls+=archWindow(303,114,39,79,p,'pointed')+P('M0 198 H400','none',p.blue,4);
 }
 s+=G(walls,'',{'data-layer':'architecture'});
 const actor=(ix,pose,x,y,scale=.58,act='')=>G(drawPerson(PEOPLE[ix%26],pose,p,{...o,action:act}),`translate(${x} ${y}) scale(${scale})`,{'data-layer':'cast'});
 let furnishings='',cast='';
 if(key==='estudio'){
  furnishings+=E(189,273,144,18,mix(p.blue,p.paper,.37))+R(278,113,91,4,p.blue,1)+R(278,186,91,4,p.blue,1)+L(281,113,281,210,p.ink,2)+L(366,113,366,210,p.ink,2)+place('radio',285,127,.31,q)+place('libro',291,75,.18,q)+G(plant(353,115,.4,p,2),'')+place('escritorio',214,172,.54,q)+place('taza',260,159,.20,q)+place('microfono',139,113,.54,q);
  cast=actor(0,8,23+q*3,80,.62,'asentir');if(set>1)cast+=actor(1,9,273,155,.34,'asentir');
 }else if(key==='mercado'){
  for(let j=0;j<3;j++){let xx=158+j*78;furnishings+=R(xx,74,67,136,p.paper,4,{stroke:p.blue,'stroke-width':1.1});for(let z=0;z<3;z++){furnishings+=R(xx+3,109+z*41,61,4,p.rust,2);for(let u=0;u<2;u++)furnishings+=place(['cereal','botella','tarro','pan'][(j+z+u)%4],xx-3+u*32,78+z*41,.17,(q+z)%10);}}
  cast=actor(24,2,2,80,.62,'asentir')+actor(19,2,115,139,.44,'saludar');furnishings+=P('M217 213 H331 L317 260 H224Z','none',p.ink,2.5)+P('M214 201 L220 212 M320 260 L315 273 H228','none',p.ink,2.5)+C(232,279,5,p.ink)+C(313,279,5,p.ink);for(let j=0;j<6;j++)furnishings+=L(229+j*16,216,235+j*13,256,p.blue,1.4);furnishings+=place('cereal',227,191,.22,q)+place('botella',263,195,.22,q);
 }else if(key==='cocina'){
  furnishings+=R(139,176,171,62,p.teal,4)+R(136,170,180,9,p.paper,3);for(let j=0;j<3;j++)furnishings+=R(144+j*53,181,47,50,mix(p.teal,p.paper,.32),3)+L(174+j*53,188,180+j*53,188,p.gold,2);
  furnishings+=place('nevera',286,70,.63,q)+place('horno',179,168,.43,q)+place('olla',178,139,.28,q)+place('tetera',239,140,.23,q)+place('tabla',143,152,.23,q)+R(153,119,128,4,p.rust,2)+place('platos',167,85,.25,q)+place('tarro',224,89,.2,q);cast=actor(3,17,13,77,.63,'escribir');
 }else if(key==='dormitorio'||key==='salon'){
  furnishings+=E(209,264,153,19,mix(p.rust,p.paper,.35))+place(key==='dormitorio'?'cama':'sofa',121,147,1,q)+place('lampara',14,124,.61,q)+place('libro',286,218,.2,q);cast=actor(set%2?17:16,key==='dormitorio'?8:3,160,142,.40,'asentir');
 }else if(key==='plaza'||key==='calle'||key==='granja'||key==='estacion'){
  furnishings+=place(key==='granja'?'carretilla':'banco',165,191,.6,q)+place(key==='granja'?'cesta':'farola',315,74,.64,q);cast=actor(25,[1,3,12,9][set],20+set*9,97,.59,'asentir')+actor(1,[9,2,4,11][set],192-set*11,108,.54,'asentir');if(set>1)cast+=actor(19,2,111+set*12,162,.39);
  if(set===1)furnishings+=place('bicicleta',46,191,.42,q);if(set===2)furnishings+=place('paraguas',138,83,.35,q);if(set===3)furnishings+=place('maleta',157,212,.26,q);
furnishings+=tree(12,265,.71,p,3)+G(plant(371,279,.58,p,2),'');
 }else if(key==='auditorio'){
  furnishings+=P('M0 261 H400 V281 H0Z',p.blue)+place('piano',139,126,.82,q)+place('contrabajo',295,98,.64,q)+place('microfono',54,140,.51,q);cast=actor(10,13,18,70,.62,'saludar');
 }else{
  const tableY=222,tx=112+q*4;
  if(['biblioteca','libreria','laboratorio','taller','museo','invernadero'].includes(key)){for(let j=0;j<2;j++){let xx=243+j*67;furnishings+=R(xx,112,62,106,p.paper,3,{stroke:p.blue,'stroke-width':1});for(let z=0;z<2;z++){furnishings+=R(xx+1,150+z*47,60,4,p.rust,1);for(let u=0;u<2;u++)furnishings+=place(f.props[(z+u)%4],xx-1+u*27,118+z*45,.16,q+u);}}}
  cast=actor(({laboratorio:21,taller:9,aula:4,biblioteca:11,libreria:11,cafeteria:7,restaurante:3,museo:2,espacial:13,investigacion:1}[key]??q),3+set%2,1+q*7,87,.57,'asentir');if(set>0||['investigacion','aula','restaurante','cafeteria'].includes(key))cast+=actor((q+8)%26,9,275,97,.53,'asentir');
  furnishings+=P(`M${tx} ${tableY} L${tx-5} 289 M${tx+135} ${tableY} L${tx+144} 289`,'none',p.ink,5)+P(`M${tx-17} ${tableY-9} L${tx+126} ${tableY-15} L${tx+165} ${tableY+5} L${tx-31} ${tableY+9}Z`,p.rust)+P(`M${tx-31} ${tableY+9} H${tx+165} V${tableY+16} H${tx-31}Z`,mix(p.rust,p.blue,.27));
  for(let z=0;z<3;z++)furnishings+=place(f.props[z],tx-21+z*58,tableY-56,.26,(q+z)%10);
  if(['aula','oficina','investigacion'].includes(key))furnishings+=R(183,88,91,58,p.paper,5,{stroke:p.blue,'stroke-width':1.3})+P('M194 132 L209 113 L224 124 L242 105 L261 108','none',p.teal,2)+L(194,138,261,138,p.rust,1.2);
 }
 s+=G(cast,'',{'data-layer':'people'})+G(furnishings,'',{'data-layer':'furniture'});
 let plants=plant(371,277,.69,p,v%3)+(outdoor?'':plant(27,274,.56,p,2));s+=ambient(plants,o,'foreground-plants',.8)+flower(373,281,4,p,q);
 return G(s,'',{'data-scene':f.key});
};

// Rounded animal morphology: softened limbs, species-specific silhouettes and expression.
const v1AnimalSingle=animalSingle;
animalSingle=function(f,k,p){
 if(['kangaroo','koala','monkey'].includes(f.morph)){
  const m=f.morph,c=m==='kangaroo'?p.gold:m==='koala'?p.blue:p.rust,light=mix(c,p.paper,.55),dark=mix(c,p.ink,.17),hop=k===1||k===2,dx=(k%3-1)*7;let z='';
  if(m==='koala')z=P('M161 213 Q169 137 159 29 M164 117 Q190 94 205 80','none',p.teal,11)+G(leaf(194,85,.42,p.sage,31,k));
  if(m==='kangaroo')z=P('M100 154 Q71 203 26 206 Q82 210 118 178Z',dark);
  if(m==='monkey')z=P(`M100 145 C22 193 29 ${71+k*3} 60 78 C82 75 85 121 65 121`,'none',c,9);
  z+=P(`M118 160 Q${92+dx} ${179-(hop?17:0)} ${110+dx} 195 L${149+dx} ${194-(hop?10:0)}`,'none',dark,14)+P(`M148 161 Q${166-dx} ${181-(hop?15:0)} ${169-dx} 195 L${207-dx} ${195-(hop?8:0)}`,'none',c,13);
  z+=P('M139 72 Q168 73 176 117 Q193 157 160 178 Q126 191 106 166 Q84 145 112 107 Q114 82 139 72Z',c)+E(144,131,23,35,light)+P('M122 101 Q113 123 120 143','none',mix(c,p.paper,.68),2);
  if(m==='kangaroo')z+=G(E(144,49,7,27,c),`rotate(-14 144 49)`)+G(E(161,43,7,30,c),`rotate(10 161 43)`)+E(144,47,2.7,18,p.rust)+E(161,42,2.6,21,p.rust);
  else z+=C(125,61,m==='koala'?19:12,dark)+C(177,61,m==='koala'?19:12,dark)+C(125,61,m==='koala'?13:7,light)+C(177,61,m==='koala'?13:7,light);
  z+=E(151,75,27,28,c)+E(154,86,20,16,light);
  if(m==='monkey')z+=E(141,73,12,15,light)+E(163,73,12,15,light);
  z+=C(141,72,3,p.ink)+C(163,72,3,p.ink)+C(142,71,1,p.paper)+C(164,71,1,p.paper)+E(153,83,m==='koala'?8:4,m==='koala'?11:3,p.ink)+P('M146 98 Q153 103 163 96','none',p.ink,1.4);
  let ax=m==='koala'?173:190,ay=hop?102:127;
  z+=P(`M167 109 Q176 128 ${ax+dx} ${ay}`,'none',c,11)+E(ax+dx,ay,7,5,light)+P(`M119 111 Q98 136 ${111-dx} ${140+(k%3)*6}`,'none',dark,10)+E(111-dx,140+k%3*6,6,5,light);
  if(m==='kangaroo')z+=P('M137 135 Q153 144 164 132 Q164 154 148 154 Q136 152 137 135Z',dark);
  return G(z,'',{'data-species':m,'data-fauna-detail':'articulated'});
 }
 if(f.group!=='Mamíferos'){
  let s=v1AnimalSingle(f,k,p);if(['Aves','Peces','Marinos'].includes(f.group))s=G(s,'',{'data-illustration':'detailed-fauna'});return s;
 }
 const m=f.morph,moving=[1,2,5].includes(k),crouch=k===3,big=['bear','elephant','rhino','hippo','panda'].includes(m),long=['horse','zebra','giraffe','deer','moose','camel'].includes(m),by=crouch?139:121,rx=big?64:long?59:49,ry=big?41:long?30:31;
 let color=['fox','dog','bear','monkey','moose','squirrel','otter'].includes(m)?p.rust:['cat','wolf','raccoon','elephant','hippo','rhino'].includes(m)?p.blue:['sheep','panda','zebra','rabbit'].includes(m)?p.paper:p.gold,dark=mix(color,p.ink,.2),light=mix(color,p.paper,.53),s='',headX=long?179:181,headY=m==='giraffe'?51:crouch?121:96;
 function leg(x,i){let bend=moving?(i%2?14:-15):0,yy=crouch?183:191,up=k===5?(i%2?17:10):0;return P(`M${x} ${by+15} Q${x+bend} ${by+35-up} ${x+bend} ${yy-7-up}`,'none',i%2?color:dark,big?14:long?8:9)+P(`M${x+bend-4} ${yy-9-up} Q${x+bend+9} ${yy-13-up} ${x+bend+13} ${yy-3-up} Q${x+bend+4} ${yy+2-up} ${x+bend-5} ${yy-2-up}Z`,long?mix(color,p.ink,.45):i%2?color:dark)+L(x+bend+3,yy-5-up,x+bend+3,yy-1-up,p.paper,.8);}
 for(let i=0;i<4;i++)s+=leg(75+i*22,i);
 let tail='';if(m==='fox')tail=P('M72 120 Q29 129 11 86 Q13 68 24 71 Q58 78 83 109Z',color)+P('M11 86 Q13 68 24 71 L42 80 L29 86 L37 101Z',p.paper);
 else if(m==='cat')tail=P(`M67 134 C13 ${108-k*2} 35 ${47+k*4} 53 71`,'none',color,12)+P(`M53 71 q0 -6 -5 -8`,'none',dark,7);
 else if(m==='squirrel')tail=P('M78 134 Q12 134 19 71 Q30 26 67 49 Q90 71 65 106 Q47 84 44 106 Q49 121 78 134Z',color)+P('M44 76 Q29 107 64 121','none',light,4);
 else if(m==='rabbit')tail=C(62,129,12,p.paper);
 else if(m==='pig')tail=P('M67 123 C24 124 31 86 48 100 C61 114 42 122 36 110','none',color,6);
 else if(m==='raccoon'){tail=P('M73 130 Q25 168 24 109','none',color,22);for(let j=0;j<3;j++)tail+=L(28+j*12,137+j%2*2,35+j*12,145+j%2*3,p.ink,5);}
 else if(m==='otter')tail=P('M65 131 Q24 140 12 167 Q50 164 79 146Z',color);
 else if(!['bear','panda','hedgehog'].includes(m))tail=P(`M67 118 Q34 ${102+k*3} 33 ${143+k*3}`,'none',color,long?5:8)+(long?E(34,143+k*3,5,8,p.ink):'');
 s+=tail;if(m==='camel')s+=P('M64 121 Q65 61 99 92 Q118 53 144 117Z',color);
 if(m==='hedgehog'){for(let j=0;j<17;j++){let a=Math.PI+j/16*Math.PI;let xx=111+Math.cos(a)*55,yy=by+Math.sin(a)*42;s+=P(`M${n(xx-5)} ${n(yy+13)} L${n(xx+2)} ${n(yy-12)} L${n(xx+9)} ${n(yy+12)}Z`,mix(p.rust,p.ink,.35));}}
 if(m==='sheep')for(let j=0;j<12;j++){let a=j*Math.PI/6;s+=C(113+Math.cos(a)*50,by+Math.sin(a)*22,14,p.paper,{stroke:mix(p.blue,p.paper,.6),'stroke-width':1.1});}
 s+=E(113,by,rx,ry,color)+P(`M${113-rx+11} ${by+8} Q114 ${by+ry+19} ${113+rx-13} ${by+6} Q126 ${by+ry+6} ${113-rx+11} ${by+8}Z`,light)+P(`M${112-rx+13} ${by-13} Q99 ${by-ry+1} 126 ${by-ry+9}`,'none',light,2.5);
 if(long)s+=P(m==='giraffe'?'M141 131 L159 53 L180 44 L183 60 L166 135Z':'M139 134 Q145 97 160 86 L182 95 L168 140Z',color);
 if(m==='lion')s+=P('M180 55 Q204 53 216 75 Q225 100 209 124 Q190 145 166 128 Q145 122 143 101 Q145 79 160 69Z',p.rust)+P('M159 85 Q152 105 169 122','none',mix(p.rust,p.ink,.15),2);
 if(m==='cow')s+=P('M76 101 Q91 86 112 99 Q118 112 96 123 Q80 124 76 101Z',mix(p.blue,p.ink,.4))+P('M131 136 Q147 116 161 132 Q161 152 141 149Z',p.blue);
 if(m==='panda')s+=E(142,117,12,31,p.ink);
 if(m==='giraffe'){for(let j=0;j<6;j++)s+=G(R(0,0,9,11,p.rust,3),`translate(${77+j*13} ${106+j%2*11}) rotate(${j*13})`);for(let j=0;j<3;j++)s+=G(R(0,0,8,9,p.rust,2),`translate(${165-j*3} ${68+j*16}) rotate(12)`);}
 if(m==='zebra'||m==='tiger')for(let j=0;j<6;j++)s+=P(`M${69+j*16} ${by-ry+6} q13 10 6 30 l-6 -12Z`,mix(color,p.ink,.63));
 if(['rabbit','deer','moose','giraffe'].includes(m)){s+=G(E(headX-10,headY-28,m==='rabbit'?7:6,m==='rabbit'?28:14,color),`rotate(-18 ${headX-10} ${headY-28})`)+G(E(headX+7,headY-31,6,m==='rabbit'?30:14,color),`rotate(12 ${headX+7} ${headY-31})`);if(m==='rabbit')s+=E(headX-10,headY-28,2.5,18,p.rust)+E(headX+7,headY-31,2,19,p.rust);}
 else if(['cat','fox','wolf'].includes(m))s+=P(`M${headX-24} ${headY-7} L${headX-23} ${headY-34} L${headX-3} ${headY-21} L${headX+9} ${headY-34} L${headX+22} ${headY-7}Z`,color)+P(`M${headX-19} ${headY-14} L${headX-19} ${headY-26} L${headX-9} ${headY-18} M${headX+7} ${headY-23} L${headX+14} ${headY-13}`,'none',p.rust,3);
 else if(['bear','panda','lion','pig','mouse'].includes(m))s+=C(headX-19,headY-19,10,m==='panda'?p.ink:color)+C(headX+16,headY-22,9,m==='panda'?p.ink:color);
 if(m==='goat'||m==='cow'){s+=P(`M${headX-11} ${headY-18} Q${headX-23} ${headY-27} ${headX-16} ${headY-40} M${headX+7} ${headY-20} Q${headX+20} ${headY-29} ${headX+14} ${headY-39}`,'none',m==='goat'?p.ink:p.paper,4)+G(E(headX-24,headY-8,12,6,color),'rotate(-12 '+(headX-24)+' '+(headY-8)+')')+G(E(headX+21,headY-9,11,6,color),'rotate(18 '+(headX+21)+' '+(headY-9)+')');if(m==='goat')s+=P(`M${headX+4} ${headY+22} l7 19 l8 -21Z`,p.paper);}
 if(['deer','moose'].includes(m))for(let j=0;j<2;j++){let xx=headX-10+j*19;s+=P(`M${xx} ${headY-23} L${xx-5} ${headY-53} M${xx-2} ${headY-36} L${xx-16} ${headY-44} M${xx-4} ${headY-47} L${xx+7} ${headY-59}`,'none',p.ink,m==='moose'?4:2.6);}
 if(m==='giraffe')s+=P(`M${headX-6} ${headY-18} v-15 M${headX+6} ${headY-20} v-13`,'none',color,4)+C(headX-6,headY-33,3,p.rust)+C(headX+6,headY-33,3,p.rust);
 let head=E(headX,headY,big?29:long?20:26,big?30:long?22:24,color);
 if(m==='dog')head+=P(`M${headX-20} ${headY-17} Q${headX-39} ${headY-8} ${headX-25} ${headY+22} Q${headX-16} ${headY+26} ${headX-11} ${headY-11}Z`,dark);
 if(m==='elephant')head+=E(headX-19,headY-1,24,30,light)+P(`M${headX+21} ${headY+3} Q${headX+27} ${headY+56} ${headX+44} ${headY+30}`,'none',color,12)+P(`M${headX+19} ${headY+18} Q${headX+30} ${headY+32} ${headX+32} ${headY+16}`,'none',p.paper,4);
 else if(m==='rhino')head+=P(`M${headX+8} ${headY+5} Q${headX+27} ${headY+4} ${headX+26} ${headY-17} L${headX+33} ${headY+9}Z`,p.paper);
 else if(m==='pig'||m==='hippo')head+=E(headX+15,headY+9,17,12,light)+C(headX+12,headY+8,2,dark)+C(headX+21,headY+8,2,dark);
 else head+=E(headX+12,headY+11,long?21:13,10,light)+C(headX+(long?31:22),headY+7,3.5,p.ink);
 if(m==='panda'||m==='raccoon')head+=E(headX-6,headY-3,7,10,p.ink)+E(headX+11,headY-5,6,9,p.ink);
 head+=C(headX+3,headY-5,3.6,p.ink)+C(headX+4,headY-6.2,1.1,p.paper)+P(`M${headX-3} ${headY-13} q4 -3 8 -1`,'none',dark,1.2)+P(`M${headX+7} ${headY+15} q6 5 12 0`,'none',dark,1.2);
 if(['cat','fox','rabbit'].includes(m))head+=P(`M${headX+2} ${headY+8} l-13 -3 M${headX+2} ${headY+12} l-14 3`,'none',dark,.8);
 if(m==='horse'||m==='zebra')head+=P(`M${headX-17} ${headY-19} Q${headX-38} ${headY-15} ${headX-35} ${headY+29} L${headX-22} ${headY+18}Z`,p.ink);
 s+=G(head,`rotate(${[0,-6,7,4,15,-11][k%6]} ${headX} ${headY+17})`,{'data-part':'animal-head'});
 if(m==='rabbit')s+=E(144,143,24,30,color)+E(148,158,15,18,light);
 return G(s,'',{'data-species':m});
};
const v1DrawAnimal=drawAnimal;
drawAnimal=function(f,v,p){let s=E(155,218,118,11,mix(p.teal,p.paper,.65));if(['Marinos','Peces'].includes(f.group))s=P('M11 204 Q102 190 155 210 Q236 230 291 209 L295 237 H12Z',mix(p.blue,p.paper,.54));s+=v1DrawAnimal(f,v,p);if(!['Marinos','Peces'].includes(f.group))for(let j=0;j<4;j++)s+=flower(32+j*14,221-j%2*7,3.8,p,j);return G(s,'',{'data-detail':'botanical-habitat'});};

// Animated effects gain layered depth, continuous particles and organic spline motion.
const v1Effect=drawEffect;
drawEffect=function(f,v,p,o,seed){
 const q=v%5,ext=v>=5,r=rng(seed),cid=o.uid+'-v2-fxclip';let s='';const cols=[p.rust,p.blue,p.teal,p.gold,p.sage];
 if(['confeti','petalos','nieve','lluvia','hojas','burbujas','vapor','humo'].includes(f.key)){
  const count=24+q*4+(ext?12:0);for(let j=0;j<count;j++){
   const x=15+r()*330,yy=-30+r()*200,phase=-r()*8,dur=(j%2?6:3),dx=(ext?1:-1)*(12+r()*38),col=cols[j%5],sz=3+r()*7;
   let glyph='',from=`${n(x)} -25`,to=`${n(x+dx)} 286`;
   if(f.key==='confeti')glyph=j%3===0?R(-sz/2,-sz/2,sz,sz*1.7,col,2):j%3===1?P(`M-${sz} 0 Q0 -${sz} ${sz} 0 Q0 ${sz} -${sz} 0Z`,col):star(0,0,sz,5,.5,col);
   if(f.key==='petalos')glyph=P(`M0 0 C${-sz*2} ${-sz} ${-sz} ${-sz*3} 0 ${-sz*2} C${sz*2} ${-sz*3} ${sz*2} ${-sz} 0 0Z`,j%3?p.rust:p.blue);
   if(f.key==='hojas')glyph=leaf(0,0,.16+sz/70,col,j*17,j);
   if(f.key==='nieve'){glyph=C(0,0,sz*.4,p.paper,{stroke:p.blue,'stroke-width':.6});if(j%3===0)for(let z=0;z<3;z++)glyph+=G(L(-sz,0,sz,0,p.blue,1),`rotate(${z*60})`);}
   if(f.key==='lluvia'){glyph=L(0,0,-3,8+sz*1.7,p.blue,1.1+sz/10);from=`${n(x)} -27`;to=`${n(x-31)} 280`;}
   if(f.key==='burbujas'){glyph=C(0,0,sz+3,'none',{stroke:j%2?p.blue:p.teal,'stroke-width':1.6})+P(arc(-1,-2,sz*.6,sz*.6,3.5,4.8),'none',p.paper,1.7);from=`${n(x)} 286`;to=`${n(x+dx)} -26`;}
   if(f.key==='humo'||f.key==='vapor'){glyph=cloud(0,0,(sz+6)/30,mix(p.blue,p.paper,.2),j);from=`${n(180+(ext?(j%2?78:-78):(x-180)*.15))} 285`;to=`${n(x+dx)} -35`;}
   let rot=motion(glyph,['-30','80','-30'],o,'rotate',3,{begin:phase+'s'}),alpha=j%3===0?.4:.85;
   const travel=[from,`${n((parseFloat(from)+parseFloat(to))/2+Math.sin(j)*19)} 127`,to];if(f.key==='lluvia')travel.splice(1,1);
   const poster=o.animate?o:{...o,poster:((o.poster??.42)+j*.137)%1};s+=fade(motion(rot,travel,poster,'translate',dur,{begin:phase+'s',calcMode:'linear'}),[0,alpha,alpha,0],poster,dur,{begin:phase+'s',keyTimes:'0;.12;.85;1'});
  }
  if(f.key==='lluvia')for(let j=0;j<7;j++)s+=fade(E(35+j*47,243+j%2*7,13,3,'none',{stroke:p.teal,'stroke-width':1.2}),[0,.8,0],o,1.5,{begin:(-j*.23)+'s'});
 }else if(f.key==='liquido'||f.key==='tinta'||f.key==='niebla'){
  const isInk=f.key==='tinta',mist=f.key==='niebla';
  const count=mist?5+q:(isInk?4+q:3+q)+(ext?2:0);
  for(let j=0;j<count;j++){
   let xx=31+j*(278/count)+(ext?13:0),yy=127+Math.sin(j+(ext?1:0))*(ext?64:43),col=cols[j%5];
   const d1=isInk?'M-51 0 C-65 -22 -24 -57 -13 -34 C14 -92 37 -39 26 -23 C76 -24 66 33 25 27 C16 72 -17 61 -23 33 C-62 53 -75 12 -51 0Z':mist?'M-53 0 C-67 -49 -22 -71 17 -52 C56 -59 74 -15 48 25 C39 66 -30 76 -49 36Z':'M-56 0 C-67 -31 -40 -57 -11 -48 C24 -72 67 -38 55 -3 C78 33 43 60 8 45 C-31 60 -63 38 -56 0Z';
   const d2=isInk?'M-51 0 C-87 -37 -32 -23 -13 -34 C-16 -82 34 -67 26 -23 C76 4 35 46 25 27 C42 81 -37 81 -23 33 C-89 62 -75 -23 -51 0Z':mist?'M-53 0 C-25 -68 13 -57 39 -33 C82 -6 46 41 15 43 C-25 75 -78 28 -53 0Z':'M-56 0 C-37 -65 -18 -39 -11 -48 C41 -43 49 -51 55 -3 C53 59 17 68 8 45 C-40 35 -81 26 -56 0Z';
   let blob=tag('path',{d:d1,fill:col,opacity:mist?.24:.73},animTag('d',[d1,d2,d1],o,6,{begin:(-j*.7)+'s'}));
   if(!isInk&&!mist)blob+=P('M-35 -23 Q-15 -48 11 -37','none',p.paper,2.5,{opacity:.7});
   if(isInk)for(let z=0;z<3;z++)blob+=C(-52+z*36,-61+z%2*102,3+z,p.blue);
   const path=ext?['0 0','-17 15','16 -18','0 0']:isInk?['0 0','11 -22','-8 9','0 0']:['0 0','19 12','-9 -14','0 0'];
   s+=G(motion(blob,path,o,'translate',6,{begin:(-j*.7)+'s'}),`translate(${n(xx+20)} ${n(yy)}) scale(${mist?1.45:.75+j%2*.2+(ext?.1:0)})`);
  }
 }else if(['destellos','estrellas'].includes(f.key)){
  for(let j=0;j<20+q*4;j++){let xx=20+r()*320,yy=20+r()*220,rr=4+r()*12;let glyph=star(0,0,rr,f.key==='estrellas'?5:4,.32,cols[j%5])+C(rr+5,-rr,1.7,p.paper),phase=-j*.21;
   s+=G(fade(motion(glyph,['.2 .2','1.12 1.12','.2 .2'],o,'scale',3,{begin:phase+'s'}),[0,1,0],o,3,{begin:phase+'s'}),`translate(${n(xx)} ${n(yy)})`);}
 }else s=v1Effect(f,v,p,o,seed);
 return tag('defs',{},tag('clipPath',{id:cid},R(0,0,360,260,'white')))+G(s,'',{'clip-path':`url(#${cid})`,'data-action':f.key,'data-depth':'layered-particles','data-intentional-clip':'particle-viewport'});
};
const v1Animation=drawAnimation;
drawAnimation=function(f,v,p,o){let s=v1Animation(f,v,p,o);if(['saludar','asentir','aplaudir','leer','escribir','colaborar'].includes(f.key))s=E(179,229,133,13,mix(p.blue,p.paper,.65))+s;return G(s,'',{'data-motion-language':'articulated-eased'});};

// 9. Build catalog once. All IDs and recipes are stable across reloads.
const FAMILY_CONFIG=[
 ['escenarios',SACRED_SCENES,10,[0,0,400,300],(f,v)=>['volumen central y jardines','fachada y arbolado','acceso y senderos','silueta y plaza','volúmenes y vegetación'][v%5]+(v<5?' · patio con agua':' · acceso y plaza'),(f,v,p,o,a)=>drawSacredScene(f,v,p,a.seed,o)],
 ['simbolos',SACRED_SYMBOLS,10,[0,0,256,256],(f,v)=>['emblema independiente','tarjeta ceremonial','medallón botánico','nicho arquitectónico','placa floral','composición con planta','láminas superpuestas','corona de flores','portal ornamental','placa con pedestal'][v],(f,v,p)=>drawSacredSymbol(f,v,p)],
 ['paisajes',LANDS,20,[0,0,400,260],(f,v)=>['cresta diagonal','terrazas abiertas','valle central','panorama escalonado','laderas curvas'][v%5]+' y '+['vegetación en primer plano','refugio ilustrado','sendero con hitos','paso de madera'][Math.floor(v/5)],(f,v,p,o,a)=>landscapeShape(f,v,p,a.seed,o)],
 ['objetos',OBJECTS,10,[0,0,360,260],(f,v)=>KIT_NAMES[v],(f,v,p)=>drawObjectAssembly(f,v,p)],
 ['personas',PEOPLE,25,[0,0,240,320],(f,v)=>POSES[v][1],(f,v,p,o)=>drawPerson(f,v,p,o)],
 ['escenarios',SCENES,16,[0,0,400,300],(f,v)=>SCENE_NAMES[v],(f,v,p,o,a)=>drawScene(f,v,p,a.seed,o)],
 ['animales',ANIMALS,10,[0,0,300,240],(f,v)=>ANIMAL_NAMES[v],(f,v,p)=>drawAnimal(f,v,p)],
 ['simbolos',SYMBOLS,8,[0,0,256,256],(f,v)=>SYMBOL_NAMES[v],(f,v,p)=>drawSymbol(f,v,p)],
 ['bocadillos',BUBBLES,10,[0,0,400,260],(f,v)=>['cola curva a la izquierda','cola angular central','cola curva desplazada','cola angular a la derecha','cola en extremo y contorno compacto'][v%5]+(v>=5?' y respuesta superior':''),(f,v,p,o)=>drawBubble(f,v,p,o)],
 ['animaciones',ANIMS,10,[0,0,360,260],(f,v)=>['secuencia amplia','secuencia escalonada','secuencia de interacción','trayectoria compuesta','recorrido con varios elementos'][v%5]+(v>=5?' · composición acompañada':' · composición focal'),(f,v,p,o)=>drawAnimation(f,v,p,o)],
 ['efectos',EFFECTS,10,[0,0,360,260],(f,v)=>['emisión abierta','estructura desplazada','campo multicapa','distribución fragmentada','emisión densa'][v%5]+(v>=5?' · composición bifocal':' · composición central'),(f,v,p,o,a)=>drawEffect(f,v,p,o,a.seed)],
 ['interfaz',UIS,10,[0,0,360,260],(f,v)=>['estructura amplia','panel redondeado','sistema segmentado','estructura extendida','panel compacto'][v%5]+(v>=5?' · disposición secundaria':' · disposición primaria'),(f,v,p)=>drawUI(f,v,p)],
 ['decoracion',DECORS,10,[0,0,360,240],(f,v)=>['composición abierta','estructura rítmica','distribución escalonada','composición densa','retícula extendida'][v%5]+(v>=5?' · con acentos integrados':' · patrón principal'),(f,v,p)=>drawDecor(f,v,p)]
];
const renderers=Object.create(null),families=[];
for(const [category,list,variants,viewBox,namer,draw] of FAMILY_CONFIG){
 for(const f of list){const key=category+'.'+f.key;renderers[key]=(a,p,o)=>draw(a.recipe.family,a.recipe.variant,p,o,a);families.push({id:key,category,name:f.label,subcategory:f.group,variantCount:variants,viewBox,construction:f});}
}
function buildCatalog(){
 const list=[];
 for(const [category,ff,variants,viewBox,namer] of FAMILY_CONFIG){
  for(const f of ff)for(let v=0;v<variants;v++){
   const familyId=category+'.'+f.key,id=category+'-'+f.key+'-'+String(v+1).padStart(2,'0'),animated=['animaciones','efectos'].includes(category);
   const recipe={version:1,family:{...f},variant:v,structuralAxes:{configuration:v%5,composition:Math.floor(v/5)},design:'pastel-editorial-atelier-v2',palette:DEFAULT_PALETTE};
   if(category==='objetos'){recipe.companions=objectCompanions(f,v);recipe.placement=KIT_LAYOUTS[v].map(x=>[...x]);recipe.primaryConstruction=v;}
   if(category==='personas'){recipe.pose=POSES[v];recipe.appearance={hair:f.hair,body:f.body,age:f.age};}
   if(category==='escenarios'){recipe.architecture=v%4;recipe.activityLayout=Math.floor(v/4);recipe.props=[...f.props];}
   if(category==='bocadillos'){recipe.text='Hablemos.';recipe.tailAnchor=73+(v%5)*48;recipe.secondaryTail=v>=5;}
   if(animated){recipe.action=f.key;recipe.duration=6;recipe.posterTime=2.52;recipe.loop=true;}
   const note=category==='objetos'?'Ensamble vectorial: objeto principal y dos complementos; geometría y distribución configuradas.':category==='interfaz'?'Representación gráfica SVG exportable; no es un control ejecutable.':category==='animaciones'?'Secuencia SMIL autónoma con estado estático representativo.':category==='efectos'?'Efecto animado con encuadre de emisión intencional de 360 × 260.':category==='personas'?'Personaje ficticio articulado: cabeza, torso, brazos, piernas y objetos separados en grupos SVG.':'Ilustración procedural con cambios de estructura y composición; no una simple recoloración.';
   list.push({id,name:f.label+' · '+namer(f,v),category,subcategory:f.group,tags:[f.label,f.key,f.group,category,'pastel','colorido','editorial','vector','SVG',...(f.sacred?['religioso','religiosa','espiritual','sagrado','sagrada','templo',f.tradition,...(category==='escenarios'?['templos',...(f.key.startsWith('mezquita')?['mezquitas','mosque','mosq']:f.key==='iglesia'||f.key==='catedral'?['iglesias','church','churches']:f.key==='sinagoga'?['sinagogas','synagogue']:[])]:[])]:[]),...(category==='objetos'?recipe.companions:[]),...(animated?['animación','movimiento','SMIL']:[]),...(category==='personas'?[POSES[v][0],POSES[v][1],f.prop,'humano','personaje']:[])],kind:animated?'animated-svg':'static-svg',familyId,concept:f.label+'. '+namer(f,v)+'. '+(f.sacred?('Tradición: '+f.tradition+'. Interpretación ilustrada genérica; no es una réplica de un lugar real. '):'')+note,viewBox:[...viewBox],seed:hash(id),recipe,rendererKey:familyId,duration:animated?6:null,loop:animated,posterState:animated?{time:2.52,normalized:.42,method:'deterministic-static-pose'}:null});
  }
 }
 return list;
}
const catalog=buildCatalog(),familyCount=families.length;
function paletteOf(options){let pp={...(PALETTES[options.paletteName]||DEFAULT_PALETTE)};if(options.palette)for(const[k,val]of Object.entries(options.palette))if(k in pp&&/^#[0-9a-fA-F]{6}$/.test(val))pp[k]=val;return pp;}
function renderMarkup(asset,options={}){
 if(!asset||!renderers[asset.rendererKey])throw new Error('No existe el constructor del recurso.');
 const p=paletteOf(options),uid='fa-'+String(options.instance||asset.id).replace(/[^A-Za-z0-9_-]/g,'-'),[vx,vy,w,h]=asset.viewBox;
 const width=clamp(Number(options.width)||w,32,4096),height=n(width*h/w),animate=options.animate===true&&(asset.kind==='animated-svg'||options.ambient===true);
 const o={...options,animate,uid,poster:Number.isFinite(options.poster)?clamp(options.poster,0,1):(asset.posterState?.normalized??.42)};
 let body=renderers[asset.rendererKey](asset,p,o),defs='';
 if(animate&&!/<animate(?:Transform|Motion)?\b/.test(body))body=ambient(body,o,'ambient-presentation',2);
 // Refined surfaces remain vector paint, rather than a raster image behind an SVG tag.
 if(options.finish!==false){for(const key of ['rust','gold','teal','blue','sage','paper']){
   const id=uid+'-paint-'+key,col=p[key];
   defs+=tag('linearGradient',{id,x1:'0%',y1:'0%',x2:'85%',y2:'100%'},tag('stop',{offset:'0%','stop-color':mix(col,p.paper,key==='paper'?.03:.22)})+tag('stop',{offset:'58%','stop-color':col})+tag('stop',{offset:'100%','stop-color':mix(col,key==='paper'?p.blue:p.ink,key==='paper'?.06:.065)}));
   body=body.split('fill="'+col+'"').join('fill="url(#'+id+')"');
  }
 }
 if(options.texture){
  const fid=uid+'-paper-grain';defs+=tag('filter',{id:fid,x:'0%',y:'0%',width:'100%',height:'100%','color-interpolation-filters':'sRGB'},tag('feTurbulence',{type:'fractalNoise',baseFrequency:'.72',numOctaves:2,seed:asset.seed%71,result:'noise'})+tag('feColorMatrix',{in:'noise',type:'saturate',values:0,result:'mono'})+tag('feComponentTransfer',{in:'mono',result:'grain'},tag('feFuncA',{type:'linear',slope:'.06'}))+tag('feComposite',{in:'grain',in2:'SourceGraphic',operator:'in',result:'masked'})+tag('feBlend',{in:'SourceGraphic',in2:'masked',mode:'multiply'}));body=G(body,'',{filter:`url(#${fid})`});
 }
 const speed=clamp(Number(options.speed)||1,.25,4);if(animate&&speed!==1)body=body.replace(/\b(dur|begin)="(-?[\d.]+)s"/g,(_,key,value)=>key+'="'+n(Number(value)/speed)+'s"');
 const bg=options.background&&/^#[0-9a-fA-F]{6}$/.test(options.background)?R(0,0,w,h,options.background):'';
 if(['animaciones','paisajes','escenarios','decoracion'].includes(asset.category)||options.ambient){const cid=uid+'-action-frame';defs+=tag('clipPath',{id:cid},R(0,0,w,h,'white'));body=G(body,'',{'clip-path':`url(#${cid})`,'data-intentional-clip':asset.category==='animaciones'?'action-frame':'composition-frame'});}
 const tid=uid+'-title';
 return '<svg'+attrs({xmlns:NS,viewBox:`${vx} ${vy} ${w} ${h}`,width:n(width),height,role:'img','aria-labelledby':tid,'data-asset-id':asset.id,'data-kind':animate?'animated-svg':'static-svg','data-design':'FORMA Pastel Studio V2','shape-rendering':'geometricPrecision'})+'>'+tag('title',{id:tid},esc(asset.name))+tag('desc',{},esc(asset.concept))+tag('defs',{},defs)+bg+G(body,'',{'data-layer':'artwork'})+'</svg>';
}
function renderAsset(asset,options={}){
 if(typeof DOMParser==='undefined')throw new Error('renderAsset requiere un navegador con DOMParser. Usa renderMarkup para obtener el código.');
 const doc=new DOMParser().parseFromString(renderMarkup(asset,options),'image/svg+xml');if(doc.querySelector('parsererror'))throw new Error('SVG no válido: '+asset.id);return document.importNode(doc.documentElement,true);
}
function validateMetadata(items=catalog){
 let errors=[],counts={};for(const c of categories)counts[c.key]=0;
 if(items.length!==5500)errors.push({id:'catalog',issue:`Se esperaban 5500 registros; encontrados ${items.length}.`});
 let ids=new Set();const fields=['id','name','category','subcategory','tags','kind','familyId','concept','viewBox','seed','recipe','rendererKey'];
 for(const a of items){
  if(ids.has(a.id))errors.push({id:a.id,issue:'ID duplicado.'});ids.add(a.id);if(a.category in counts)counts[a.category]++;else errors.push({id:a.id,issue:'Categoría no válida.'});
  for(const k of fields)if(a[k]===undefined||a[k]===null||a[k]===''||Array.isArray(a[k])&&!a[k].length)errors.push({id:a.id,issue:'Campo incompleto: '+k});
  if(!renderers[a.rendererKey])errors.push({id:a.id,issue:'Constructor inexistente.'});
  if(!Array.isArray(a.viewBox)||a.viewBox.length!==4||a.viewBox.some(x=>!Number.isFinite(x))||a.viewBox[2]<=0||a.viewBox[3]<=0)errors.push({id:a.id,issue:'viewBox inválido.'});
  if(!['static-svg','animated-svg'].includes(a.kind))errors.push({id:a.id,issue:'Tipo no válido.'});
  if(a.kind==='animated-svg'&&(!(a.duration>0)||!a.posterState||a.loop!==true))errors.push({id:a.id,issue:'Animación sin duración, bucle o estado estático.'});
 }
 for(const c of categories)if(counts[c.key]!==c.expected)errors.push({id:c.key,issue:`Cantidad incorrecta: ${counts[c.key]} / ${c.expected}.`});
 return {records:items.length,families:new Set(items.map(x=>x.familyId)).size,counts,errors};
}
function catalogDocument(items=catalog){return {schemaVersion:SCHEMA,libraryVersion:VERSION,generatedBy:'FORMA Pastel Studio offline native SVG',description:'Variantes procedurales de estructura, postura y composición. Las familias base se declaran por separado. JSON de recetas; los constructores están en index.html.',total:items.length,familyCount,categoryCounts:Object.fromEntries(categories.map(c=>[c.key,items.filter(a=>a.category===c.key).length])),palettePresets:PALETTES,rendererContract:'FORMA.renderMarkup(record, options); usar los constructores incluidos en index.html.',families,assets:items};}
// Public deterministic API for reuse in a local animation project.
globalThis.FORMA={version:VERSION,schemaVersion:SCHEMA,NS,categories,catalog,families,familyCount,palettes:PALETTES,defaultPalette:DEFAULT_PALETTE,buildCatalog,renderAsset,renderMarkup,validateMetadata,catalogDocument,normalize,slug,hash,esc,primitives:{R,C,E,P,L,G,T},drawPerson,drawObject,drawScene,landscapeShape,drawAnimal,drawIcon,drawSacredScene,sacredGlyph,sacredScenes:SACRED_SCENES,sacredSymbols:SACRED_SYMBOLS,people:PEOPLE,scenes:SCENES};
})();

