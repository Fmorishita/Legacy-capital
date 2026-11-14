// Mapa regional: se revela en círculo desde el proyecto, pulso en el punto y tiempos
up("#map .gt",0.01);
S.fromTo("#map-wrap",{clipPath:"circle(0% at 36.8% 72.9%)"},{clipPath:"circle(130% at 36.8% 72.9%)",duration:1.0,ease:"power2.out"},0.11);
S.fromTo("#map-img",{scale:1.25,transformOrigin:"36.8% 72.9%"},{scale:1,duration:2.1,ease:"power2.out"},0.11);
[0.21,0.91,1.61].forEach((t,i)=>S.fromTo("#map-ring",{scale:0.3,opacity:1},{scale:2.4,opacity:0,duration:0.7,ease:"power1.out",immediateRender:i===0},t));
pop("#mp1",1.06);pop("#mp2",1.36);
