'use client';
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {ArrowUpRight,ArrowDown,Zap} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Canvas,useFrame} from '@react-three/fiber';
import * as THREE from 'three';

function OrbitField(){
 const root=useRef<THREE.Group>(null);
 useFrame(({clock,pointer})=>{if(!root.current)return;const t=clock.getElapsedTime();root.current.rotation.z=t*.08;root.current.rotation.y=THREE.MathUtils.lerp(root.current.rotation.y,pointer.x*.15,.025);root.current.rotation.x=THREE.MathUtils.lerp(root.current.rotation.x,pointer.y*.12,.025)});
 return <group ref={root}><mesh rotation={[.45,.4,.2]}><torusGeometry args={[2.15,.008,6,160]}/><meshBasicMaterial color="#ff405d" transparent opacity={.6}/></mesh><mesh rotation={[1.1,.25,.65]}><torusGeometry args={[2.4,.006,6,160]}/><meshBasicMaterial color="#fa8798" transparent opacity={.32}/></mesh><mesh rotation={[.2,1.2,-.4]}><torusGeometry args={[1.9,.007,6,160]}/><meshBasicMaterial color="#e51d41" transparent opacity={.4}/></mesh></group>
}
function ParticleField(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;
 let w=0,h=0,dpr=1,raf=0,active=true;const pointer={x:-10000,y:-10000};const pts=Array.from({length:typeof window!=='undefined'&&window.innerWidth<=850?38:105},()=>({x:Math.random(),y:Math.random(),size:Math.random()*1.7+.4,speed:Math.random()*.00014+.000025,phase:Math.random()*7}));
 const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);w=el.clientWidth;h=el.clientHeight;el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
 const move=(e:PointerEvent)=>{pointer.x=e.clientX;pointer.y=e.clientY};const visibility=()=>{active=!document.hidden;if(active)raf=requestAnimationFrame(draw)};
 const draw=()=>{if(!active)return;ctx.clearRect(0,0,w,h);for(const p of pts){p.y-=p.speed;if(p.y<0)p.y=1;const x=p.x*w,y=p.y*h;const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy);const push=dist<150?(150-dist)*.65:0;const px=x+(dist?dx/dist*push:0),py=y+(dist?dy/dist*push:0);ctx.beginPath();ctx.arc(px,py,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(255,${55+Math.round(p.size*35)},${82+Math.round(p.size*24)},${.22+p.size*.21})`;ctx.fill()}raf=requestAnimationFrame(draw)};
 resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);raf=requestAnimationFrame(draw);
 return()=>{active=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility)};
 },[]);return <canvas ref={canvas} className="particle-canvas" aria-hidden="true"/>;
}
function ProductJourney({reduced}:{reduced:boolean}){
 const stage=useRef<HTMLDivElement>(null);const image=useRef<HTMLImageElement>(null);const aura=useRef<HTMLDivElement>(null);const [tilt,setTilt]=useState({x:0,y:0});
 useEffect(()=>{if(!stage.current||!image.current||!aura.current)return;gsap.registerPlugin(ScrollTrigger);
 const ctx=gsap.context(()=>{
 const mm=gsap.matchMedia();
  // Single source of truth: viewport position determines the current section
  // on EVERY scroll update (down, up, footer, anchor jumps, and page reload).
  mm.add('(min-width: 851px)', () => {
    const el = stage.current!;
    const fixed = el.parentElement!;
    const stops = [
      { id: '#inicio', side: 'right', scale: .94, rotation: 0 },
      { id: '#energia', side: 'right', scale: .84, rotation: -4 },
      { id: '#experiencia', side: 'left', scale: .72, rotation: 5 },
      { id: '#impacto', side: 'right', scale: .75, rotation: -4 },
      { id: '#frio-extremo', side: 'right', scale: .80, rotation: -2 },
      { id: '#final', side: 'left', scale: .78, rotation: 0 },
    ] as const;
    let activeIndex = -1;
    let isHidden = false;
    const findSection = () => {
      const probe = window.innerHeight * .50;
      let current = 0;
      stops.forEach((stop, i) => {
        const node = document.querySelector(stop.id);
        if (node && node.getBoundingClientRect().top <= probe) current = i;
      });
      return current;
    };
    const updatePosition = (force = false) => {
      // FRÍO EXTREMO already renders its own can inside .macro-window.
      // Hide the fixed travelling can there, otherwise TWO cans overlap the heading.
      const macro = document.querySelector('#frio-extremo');
      const footer = document.querySelector('footer');
      const finalButton = document.querySelector<HTMLElement>('#final .button-main');
      const macroRect = macro?.getBoundingClientRect();
      const footerRect = footer?.getBoundingClientRect();
      const probe = window.innerHeight * .50;
      const shouldHide = !!(macroRect && macroRect.top <= probe && macroRect.bottom > probe)
        || !!(footerRect && footerRect.top <= probe);

      // FINAL: the can has a physical 'floor' at VOLVER AL INICIO.
      // As the button rises while scrolling down, the fixed can rises with it
      // instead of covering the footer. Reverse scrolling restores it naturally.
      // Only clamp after the final section becomes active.
      const finalRect = document.querySelector('#final')?.getBoundingClientRect();
      const inFinal = !!(finalRect && finalRect.top <= probe);
      const buttonBottom = finalButton?.getBoundingClientRect().bottom;
      const baseBottom = window.innerHeight * .175 + window.innerHeight * .65;
      const floorY = inFinal && typeof buttonBottom === 'number'
        ? Math.min(0, buttonBottom - baseBottom) : 0;
      gsap.set(fixed, { y: floorY });
      if (force || shouldHide !== isHidden) {
        isHidden = shouldHide;
        gsap.to(fixed, {
          autoAlpha: shouldHide ? 0 : 1,
          duration: reduced ? 0 : .24,
          ease: 'power1.out', overwrite: true,
        });
      }
      const index = findSection();
      if (!force && index === activeIndex) return;
      activeIndex = index;
      const stop = stops[index];
      // Use the fixed wrapper's stable left edge, not the animated stage's rect.
      const wrapperRect = fixed.getBoundingClientRect();
      const targetX = stop.side === 'left'
        ? window.innerWidth * .055 - wrapperRect.left
        : 0;
      gsap.to(el, {
        x: targetX, y: 0, scale: stop.scale, rotation: stop.rotation,
        opacity: 1, visibility: 'visible',
        duration: reduced ? 0 : .65, ease: 'power2.out', overwrite: true,
      });
    };
    gsap.set(el, { x: 0, y: 0, scale: .94, rotation: 0, opacity: 1, visibility: 'visible' });
    const tracker = ScrollTrigger.create({
      trigger: '.story', start: 'top top', end: 'bottom bottom',
      onUpdate: () => updatePosition(),
      onRefresh: () => updatePosition(true),
    });
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    const frame = requestAnimationFrame(() => updatePosition(true));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      tracker.kill();
    };
  });
  // On mobile the desktop can is hidden; each panel has its own MobileCan.
  mm.add('(max-width: 850px)', () => {
    gsap.set(stage.current, { x: 0, y: 0, opacity: 1, visibility: 'visible' });
  });
if (!reduced) gsap.to(aura.current,{rotate:360,duration:35,repeat:-1,ease:'none'});
 return()=>mm.revert();
 });return()=>ctx.revert();},[reduced]);
 return <div className="product-fixed" aria-label="Fotografía real de la lata SPEED Unlimited clásica"><div ref={stage} className="product-stage" onPointerMove={e=>{if(reduced)return;const r=e.currentTarget.getBoundingClientRect();setTilt({x:((e.clientX-r.left)/r.width-.5)*10,y:((e.clientY-r.top)/r.height-.5)*-7})}} onPointerLeave={()=>setTilt({x:0,y:0})}>
 <div className="can-aura" ref={aura}/><div className="orbit-canvas"><Canvas camera={{position:[0,0,7],fov:48}} dpr={[1,1.5]} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}><OrbitField/></Canvas></div>
 <div className="cold-can-stack desktop-cold"><motion.img ref={image} src="/speed-original.png" className="hero-can" alt="Lata original SPEED Unlimited negra, roja y plateada, 473 ml" draggable={false} animate={reduced?{}:{rotateX:tilt.y,rotateY:tilt.x,y:[0,-10,0]}} transition={{rotateX:{type:'spring',stiffness:85,damping:20},rotateY:{type:'spring',stiffness:85,damping:20},y:{duration:5,repeat:Infinity,ease:'easeInOut'}}}/><img className="condensation-overlay" src="/speed-condensation.png" alt="" aria-hidden="true"/><div className="cold-mist cold-mist-a"/><div className="cold-mist cold-mist-b"/><DropletTrails/></div>
 <div className="ground-light"/></div></div>;
}
function DropletTrails(){
 return <div className="droplet-trails" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{left:`${18+(i*17)%64}%`,top:`${8+(i*29)%65}%`,animationDelay:`-${(i*.73).toFixed(2)}s`,animationDuration:`${4+(i%5)}s`}}/>)}</div>;
}
function MacroFocus({reduced}:{reduced:boolean}){
 const wrap=useRef<HTMLElement>(null);const product=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(reduced||!wrap.current||!product.current)return;
 const ctx=gsap.context(()=>{
 gsap.fromTo(product.current,{scale:1,rotation:-7,y:38},{scale:1.58,rotation:3,y:-15,ease:'none',scrollTrigger:{trigger:wrap.current,start:'top 85%',end:'bottom 15%',scrub:true,invalidateOnRefresh:true}});
 },wrap);return()=>ctx.revert();},[reduced]);
 return <section id="frio-extremo" ref={wrap} className="macro-section" aria-label="Detalle de la lata SPEED helada">
  <div className="macro-copy"><div className="kicker">04 / COLD DETAIL</div><h2>FRÍO<br/><em>EXTREMO.</em></h2><p>Una mirada más cerca. Condensación, aluminio y energía en cada detalle.</p><span className="macro-scroll-label">DESLIZÁ PARA ACERCARTE ↓</span></div>
  <div className="macro-window"><div ref={product} className="macro-product cold-can-stack"><img src="/speed-original.png" alt="Detalle de la lata original SPEED Unlimited"/><img src="/speed-condensation.png" className="condensation-overlay" alt=""/><DropletTrails/><div className="cold-mist cold-mist-a"/><div className="cold-mist cold-mist-b"/><DropletTrails/></div></div>
 </section>;
}
function MobileCan({variant = 'right'}:{variant?:'left'|'right'|'center'}){
 const reduced=!!useReducedMotion();
 return <div className={`mobile-can-scene mobile-can-${variant}`} aria-label="SPEED Unlimited original">
   <div className="mobile-can-glow" aria-hidden="true"/>
   <motion.div className="cold-can-stack mobile-cold" initial={reduced?false:{opacity:0,y:70,scale:.86,rotate:-7}} whileInView={{opacity:1,y:0,scale:1,rotate:variant==='left'?-6:variant==='right'?6:0}} viewport={{amount:.28,once:false}} transition={{duration:.9,ease:[.22,1,.36,1]}}>
     <img src="/speed-original.png" alt="Lata SPEED Unlimited original" draggable={false} className="mobile-can-image"/>
     <img src="/speed-condensation.png" alt="" aria-hidden="true" className="condensation-overlay"/>
     <div className="cold-mist cold-mist-a" aria-hidden="true"/>
     <div className="cold-mist cold-mist-b" aria-hidden="true"/><DropletTrails/>
   </motion.div>
   <div className="mobile-can-caption">473 ML <span>✦</span> ORIGINAL EDITION</div>
 </div>;
}
function Reveal({children,className='',delay=0}:{children:React.ReactNode,className?:string,delay?:number}){return <motion.div className={className} initial={false} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,amount:.18}} transition={{duration:.9,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
export default function Home(){const reduced=!!useReducedMotion();const [progress,setProgress]=useState(0);const [charged,setCharged]=useState(false);
 useEffect(()=>{gsap.registerPlugin(ScrollTrigger);const ctx=gsap.context(()=>{
 ScrollTrigger.create({trigger:'.story',start:'top top',end:'bottom bottom',onUpdate:self=>setProgress(Math.round(self.progress*100))});
 if(!reduced){gsap.utils.toArray<HTMLElement>('.split-line').forEach(el=>{gsap.fromTo(el,{y:85,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}})});}
 });return()=>ctx.revert();},[reduced]);
 return <main className={charged?"charged":""}><div className="noise"/><div className="shockwave" aria-hidden="true"/><button className="energy-toggle" type="button" onClick={()=>setCharged(v=>!v)} aria-pressed={charged}><Zap size={17}/> {charged?"DESACTIVAR ENERGÍA":"ACTIVAR ENERGÍA"}</button><ParticleField/><div className="progress-track"><div style={{height:`${progress}%`}}/></div>
 <header className="site-header"><a href="#inicio" className="brand">SPEED<span>®</span></a><nav aria-label="Secciones"><a href="#energia">ENERGÍA</a><a href="#experiencia">EXPERIENCIA</a><a href="#final">FINAL</a></nav><a href="#energia" className="nav-cta">EXPLORAR <ArrowUpRight size={16}/></a></header>
 <ProductJourney reduced={reduced}/><div className="story">
 <section id="inicio" className="panel hero-panel"><div className="hero-halo"/><div className="hero-content"><Reveal><div className="kicker"><span className="pulse-dot"/> INTERACTIVE CONCEPT — 2026</div></Reveal><Reveal delay={.08}><h1>DESATÁ<br/><span>TU</span><br/>ENERGÍA<span className="dot">.</span></h1></Reveal><Reveal delay={.22}><p>Sin pausa. Sin límites. Una experiencia digital que lleva la energía a otro nivel.</p><a className="button-main" href="#energia">SENTÍ LA EXPERIENCIA <ArrowUpRight size={19}/></a></Reveal></div><MobileCan variant="right"/><div className="hero-bottom"><span>01 / 04 — SPEED UNLIMITED</span><a href="#energia">SCROLL PARA DESCUBRIR <ArrowDown size={15}/></a></div><span className="side-label">473 ML · ORIGINAL EDITION</span></section>
 <section id="energia" className="panel energy-panel"><div className="section-inner left"><Reveal><div className="kicker">01 / ENERGÍA EN MOVIMIENTO</div><h2>ROMPÉ<br/><em>LA RUTINA.</em></h2><p>Movimiento que desafía lo estático. Una identidad que no pasa desapercibida.</p><div className="mini-stats"><span>01 / IMPACTO</span><span>∞ / ACTITUD</span></div></Reveal></div><MobileCan variant="right"/><div className="section-number">01</div></section>
 <section id="experiencia" className="panel experience-panel"><div className="energy-beam"/><div className="energy-vortex" aria-hidden="true"><div className="vortex-ring"/><div className="vortex-ring"/><div className="vortex-core"/></div><div className="section-inner right"><Reveal><div className="kicker">02 / EXPERIENCIA SENSORIAL</div><h2>FUERA<br/>DE <em>ÓRBITA.</em></h2><p>Una explosión de energía revela la siguiente escena. La lata se aparta para dejar que la historia respire.</p><div className="feature-row"><span>INTERACCIÓN</span><span>RESPUESTA</span><span>ENERGÍA</span></div></Reveal></div><MobileCan variant="left"/><div className="section-number">02</div></section>
 <section id="impacto" className="panel impact-panel"><div className="section-inner left"><Reveal><div className="kicker">03 / SIN PEDIR PERMISO</div><h2>QUE SE<br/><em>SIENTA.</em></h2><p>Una lata icónica. Una dirección de arte contundente. Una web hecha para destacar.</p><div className="outlined-tag">CREATIVE EXPERIENCE / WEB MOTION</div></Reveal></div><MobileCan variant="right"/><div className="section-number">03</div></section>
 <MacroFocus reduced={reduced}/><section id="final" className="panel final-panel"><div className="final-radiance"/><div className="final-light-ring" aria-hidden="true"/><div className="final-light-sweep" aria-hidden="true"/><div className="section-inner right"><Reveal><div className="kicker">04 / SPEED UNLIMITED</div><h2>NO HAY<br/><em>LÍMITES.</em></h2><p>Una experiencia conceptual. Una actitud sin frenos.</p><a className="button-main" href="#inicio">VOLVER AL INICIO <ArrowUpRight size={19}/></a></Reveal></div><MobileCan variant="left"/><div className="section-number">04</div></section>
 </div><div className="ticker" aria-hidden="true"><div>SPEED UNLIMITED <Zap/> NO HAY LÍMITES <Zap/> SPEED UNLIMITED <Zap/> NO HAY LÍMITES <Zap/></div></div>
 <footer><div className="brand">SPEED<span>®</span></div><p>PROYECTO CONCEPTUAL INDEPENDIENTE PARA CREATIVE LAB.<br/>NO OFICIAL · SIN AFILIACIÓN CON SPEED.</p><a href="#inicio">VOLVER ARRIBA ↑</a></footer></main>
}
