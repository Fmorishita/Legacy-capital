// Puente financiero: 10 % firma → puente de 20 mensualidades → 80 % contra entrega; tarjeta con montos en cada paso
up("#bridge .gt",0.02);
S.fromTo("#br-l",{opacity:0,y:60},{opacity:1,y:0,duration:0.35,ease:"back.out(1.6)"},0.04);pop("#bc1",0.3,{transformOrigin:"50% 50%"});
S.fromTo("#br-m",{opacity:0},{opacity:1,duration:0.2},1.4);S.fromTo("#br-deck",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.5,ease:"power2.out"},1.4);S.to("#br-cable",{attr:{"stroke-dashoffset":0},duration:0.6,ease:"power2.out"},1.5);
S.fromTo("#br-h line",{opacity:0},{opacity:1,duration:0.15,stagger:0.05},1.7);pop("#bc2",1.9);
S.fromTo("#br-r",{opacity:0,y:60},{opacity:1,y:0,duration:0.35,ease:"back.out(1.6)"},3.45);pop("#bc3",3.75);S.fromTo("#br-note",{opacity:0},{opacity:1,duration:0.3},4.95);
