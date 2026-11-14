// Plusvalía: se trazan las dos curvas (conservador 8 % y optimista 10 %) y aparecen los valores por año
up("#chart .gt",0.02);
S.to("#ln-c",{attr:{"stroke-dashoffset":0},duration:2.0,ease:"power1.inOut"},0.45);S.to("#ln-o",{attr:{"stroke-dashoffset":0},duration:2.0,ease:"power1.inOut"},0.6);
S.fromTo(".cp",{opacity:0},{opacity:1,duration:0.25,stagger:0.6},0.5);pop("#lg1",0.45);pop("#lg2",0.75);
