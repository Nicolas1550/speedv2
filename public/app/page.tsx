'use client';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Zap, MousePointer2, Sparkles, Instagram } from 'lucide-react';
import { useRef, useState } from 'react';
const VoltCan=dynamic(()=>import('../components/VoltCan'),{ssr:false,loading:()=> <div className="can-loading">CARGANDO ENERGÍA...</div>});
const appear={initial:{opacity:0,y:35},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.25},transition:{duration:.75}};
export default function Home(){
 const ref=useRef<HTMLElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});const shift=useTransform(scrollYProgress,[0,1],[0,130]);
 const [flavor,setFlavor]=useState('Original');
 return <main>
  <nav className="nav"><a href="#inicio" className="brand"><Zap size={25} fill="currentColor"/> SPEED<span>®</span></a><div className="navlinks"><a href="#energia">LA ENERGÍA</a><a href="#sabores">SABORES</a><a href="#experiencia">EXPERIENCIA</a></div><a className="navcta" href="#sabores">DESCUBRIR <ArrowUpRight size={16}/></a></nav>
  <section id="inicio" className="hero" ref={ref}>
   <div className="hero-grid"/><div className="ambient ambient-one"/><div className="ambient ambient-two"/>
   <motion.div className="hero-copy" initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{duration:.85}}>
    <div className="eyebrow"><span className="dot"/> ENERGÍA PARA LOS QUE NO PARAN</div>
    <p className="hero-kicker">EL FUTURO NO ESPERA.</p>
    <h1>OWN<br/>THE <span>NIGHT.</span></h1>
    <p className="lead">Una experiencia visual inspirada en la energía de SPEED. Diseño inmersivo, movimiento y una actitud que no se detiene.</p>
    <div className="actions"><a className="btn-primary" href="#sabores">EXPLORÁ SPEED <ArrowUpRight size={19}/></a><a className="btn-outline" href="#experiencia">EXPLORAR <ArrowDown size={18}/></a></div>
    <div className="hero-foot"><span>01 / 03 — THE NEXT ENERGY</span><span><MousePointer2 size={15}/> MOVÉ EL MOUSE SOBRE LA LATA</span></div>
   </motion.div>
   <motion.div className="can-wrap" style={{y:shift}} initial={{opacity:0,scale:.7,rotate:-8}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1.1,delay:.2}}><div className="can-halo"/><div className="energy-arc arc-one"/><div className="energy-arc arc-two"/><div className="hero-lightning">ϟ</div><div className="can-canvas"><VoltCan/></div><div className="orbit-text">CLASSIC BLACK & RED · SPEED ORIGINAL</div></motion.div>
   <div className="scroll-note">SCROLL TO UNLEASH THE ENERGY ↓</div><div className="side-label">UNLEASH YOUR POTENTIAL — EST. 2026</div>
  </section>
  <div className="ticker"><div>FULL SPEED <Zap/> ALL ENERGY <Zap/> FULL SPEED <Zap/> ALL ENERGY <Zap/> FULL SPEED <Zap/> ALL ENERGY <Zap/></div></div>
  <section id="energia" className="energy section"><motion.div {...appear} className="section-head"><span className="section-tag">01 / LO QUE NOS MUEVE</span><h2>ENERGÍA QUE<br/><em>SE SIENTE.</em></h2><p>No es solo una bebida. Es ese impulso que necesitás para llevar cada idea, cada noche y cada desafío al siguiente nivel.</p></motion.div><div className="features"><motion.div {...appear} className="feature"><Zap size={30}/><strong>ACTIVÁ TU MODO</strong><span>Diseñada para momentos que necesitan un extra de energía.</span></motion.div><motion.div {...appear} className="feature"><Sparkles size={30}/><strong>OTRA DIMENSIÓN</strong><span>Una identidad audaz, eléctrica e imposible de ignorar.</span></motion.div><motion.div {...appear} className="feature"><MousePointer2 size={30}/><strong>SIN LÍMITES</strong><span>Creada para quienes hacen las cosas a su manera.</span></motion.div></div></section>
  <section id="sabores" className="flavors section"><motion.div {...appear}><span className="section-tag">02 / ENCONTRÁ TU FRECUENCIA</span><h2>ELEGÍ TU<br/><em>SPEED.</em></h2></motion.div><div className="flavor-layout"><div className="flavor-art"><div className="flavor-bolt"><Zap size={130} fill="currentColor"/></div><div className="flavor-ring"/><span className="flavor-watermark">SPEED</span></div><div className="flavor-details"><p>EXPLORÁ EL CONCEPTO</p>{['Original','Edición roja','Edición nocturna'].map((f,i)=><button key={f} onClick={()=>setFlavor(f)} className={'flavor-option '+(flavor===f?'selected':'')}><span>0{i+1}</span>{f}<ArrowUpRight size={20}/></button>)}<div className="flavor-caption">{flavor==='Original'?'LA CHISPA QUE EMPEZÓ TODO.':flavor==='Neon Berry'?'UN GIRO FRUTAL, UNA NUEVA INTENSIDAD.':'FRESCURA TOTAL. ACTITUD SIN AZÚCAR.'}</div><p className="demo-note">Proyecto conceptual independiente, no oficial ni afiliado a SPEED.</p></div></div></section>
  <section id="experiencia" className="finale section"><motion.div {...appear}><span className="section-tag">03 / EL SIGUIENTE NIVEL</span><h2>NEVER<br/><em>POWER DOWN.</em></h2><p>El momento es ahora. Encendé tu energía.</p><a className="btn-primary" href="#inicio">VOLVER AL INICIO <ArrowUpRight size={19}/></a></motion.div><div className="finale-glow"/></section>
  <footer><a className="brand" href="#inicio"><Zap size={21} fill="currentColor"/> SPEED<span>®</span></a><span>CONCEPT EXPERIENCE · FULL STACK / 3D WEB</span><span>© 2026 SPEED — CONCEPTO NO OFICIAL</span></footer>
 </main>
}
