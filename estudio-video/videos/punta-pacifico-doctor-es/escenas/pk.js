// Pickleball: se dibujan las líneas de la cancha, aparece la red y la pelota cruza dos veces
up("#pk .gt",0.02);
S.to(".pkl",{attr:{"stroke-dashoffset":0},duration:0.4,ease:"power2.out",stagger:0.05},0.05);
S.fromTo("#pk-net",{opacity:0},{opacity:1,duration:0.2},0.3);
S.set("#pk-ball",{opacity:1},0.5);
S.fromTo("#pk-ball",{x:330,scale:1},{x:690,scale:0.62,duration:0.6,ease:"none"},0.5);
S.fromTo("#pk-ball",{y:452},{y:110,duration:0.3,ease:"power1.out",immediateRender:false},0.5);
S.to("#pk-ball",{y:200,duration:0.29,ease:"power1.in"},0.8);
S.to("#pk-ball",{x:560,scale:1.05,duration:0.7,ease:"none"},1.1);
S.to("#pk-ball",{y:140,duration:0.29,ease:"power1.out"},1.1);
S.to("#pk-ball",{y:450,duration:0.39,ease:"power1.in"},1.4);
