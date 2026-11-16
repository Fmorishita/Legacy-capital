// Cierre: fondo desenfocado con empuje lento, escudo entra grande y desenfocado, botón con pulso y flecha
S.fromTo("#end .kb",{scale:1.08},{scale:1.2,duration:6.93,ease:"none"},0);
S.fromTo("#end-crest",{opacity:0,scale:1.6,filter:"blur(16px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.45,ease:"power3.out"},0.13);
S.fromTo("#end-brand",{opacity:0},{opacity:1,duration:0.3},0.43);S.fromTo("#end-re",{opacity:0},{opacity:1,duration:0.3},0.58);up("#end-mas",0.93);
S.fromTo("#end-cta",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.35,ease:"back.out(2.2)"},1.33);S.fromTo("#end-wa",{opacity:0},{opacity:1,duration:0.3},1.83);
S.to("#end-cta",{scale:1.07,boxShadow:"0 0 0 22px rgba(255,208,134,0)",duration:0.39,ease:"sine.inOut",yoyo:true,repeat:11},1.83);S.fromTo("#end-arrow",{y:-6},{y:10,duration:0.39,ease:"power1.inOut",yoyo:true,repeat:11},1.83);
