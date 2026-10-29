'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Can() {
 const group = useRef<THREE.Group>(null!);
 const mouse = useRef({x:0,y:0});
 const progress = useRef(0);
 useEffect(()=>{const move=(e:MouseEvent)=>{mouse.current.x=(e.clientX/window.innerWidth)*2-1;mouse.current.y=(e.clientY/window.innerHeight)*2-1};const scroll=()=>{progress.current=Math.min(1,window.scrollY/(window.innerHeight*2.2))};window.addEventListener('pointermove',move);window.addEventListener('scroll',scroll,{passive:true});scroll();return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll)}},[]);
 const texture = useMemo(() => {
   const c = document.createElement('canvas'); c.width=1024;c.height=1024;
   const ctx=c.getContext('2d')!;
   const grad=ctx.createLinearGradient(0,0,1024,0);
   grad.addColorStop(0,'#08090d');grad.addColorStop(.18,'#1d2026');grad.addColorStop(.48,'#07080c');grad.addColorStop(.82,'#1b1d22');grad.addColorStop(1,'#08090d');
   ctx.fillStyle=grad;ctx.fillRect(0,0,1024,1024);
   for(let i=0;i<65;i++){ctx.fillStyle=`rgba(255,255,255,${.008+(i%4)*.004})`;ctx.fillRect(i*19,0,2,1024)}
   ctx.save();ctx.translate(512,500);ctx.transform(1,0,-.16,1,0,0);
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='italic 900 238px Arial Black, Impact, sans-serif';
   ctx.shadowColor='#f11932';ctx.shadowBlur=20;ctx.fillStyle='#f2f2f3';ctx.fillText('SPEED',0,0,925);
   ctx.shadowBlur=0;ctx.lineWidth=5;ctx.strokeStyle='#bfc1c5';ctx.strokeText('SPEED',0,0,925);
   ctx.restore();
   ctx.fillStyle='#ee1734';ctx.fillRect(108,616,808,18);ctx.fillRect(180,649,664,5);
   ctx.textAlign='center';ctx.fillStyle='#e8e9ed';ctx.font='900 45px Arial';ctx.fillText('ENERGY DRINK',512,714);
   ctx.fillStyle='#e21c35';ctx.font='bold 25px Arial';ctx.fillText('ORIGINAL • CLASSIC',512,790);
   ctx.fillStyle='#c5c5cc';ctx.font='22px Arial';ctx.fillText('CONCEPT 3D • 250 ML',512,943);
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
 },[]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 useFrame((state,delta)=>{
   if(!group.current)return;
   group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y, Math.PI/2+mouse.current.x*.12+Math.sin(state.clock.elapsedTime*.32)*.035+progress.current*1.55,2.2,delta);
   group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,mouse.current.y*-.09+progress.current*.24,2.2,delta);
   group.current.rotation.z=THREE.MathUtils.damp(group.current.rotation.z,-.04-mouse.current.x*.06+progress.current*.44,2.2,delta);
  group.current.position.x=THREE.MathUtils.damp(group.current.position.x, -progress.current*.65, 2, delta);
  group.current.position.y=THREE.MathUtils.damp(group.current.position.y, -progress.current*.6+Math.sin(state.clock.elapsedTime*1.3)*.06, 2, delta);
  const size=1.12-progress.current*.36;group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x,size,2,delta));
 });
 return <group ref={group} scale={1.12}>
   <mesh castShadow><cylinderGeometry args={[1,1,3.4,96,1,true]}/><meshStandardMaterial map={texture} metalness={.45} roughness={.23} side={THREE.DoubleSide}/></mesh>
   <mesh position={[0,1.7,0]}><cylinderGeometry args={[.99,.99,.09,96]}/><meshStandardMaterial color="#c6c9d3" metalness={.92} roughness={.2}/></mesh>
   <mesh position={[0,-1.7,0]}><cylinderGeometry args={[.99,.99,.09,96]}/><meshStandardMaterial color="#a4a5b2" metalness={.9} roughness={.25}/></mesh>
   <mesh position={[0,1.756,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.8,.045,12,96]}/><meshStandardMaterial color="#777984" metalness={1} roughness={.23}/></mesh>
   <mesh position={[0,1.76,.12]} rotation={[-Math.PI/2,0,.3]}><torusGeometry args={[.3,.045,12,48]}/><meshStandardMaterial color="#8a8b95" metalness={1} roughness={.22}/></mesh>
 </group>
}
export default function VoltCan(){return <Canvas dpr={[1,1.75]} camera={{position:[0,0,7.6],fov:40}} gl={{alpha:true,antialias:true}}>
 <ambientLight intensity={1.5}/><directionalLight position={[3,5,6]} intensity={3.5} color="#f2d7ff"/><pointLight position={[-4,0,3]} intensity={65} color="#ef1637" distance={11}/><pointLight position={[4,-2,-2]} intensity={75} color="#ff7181" distance={11}/>
 <Float speed={1.1} rotationIntensity={.035} floatIntensity={.22}><Can/></Float>
 <Sparkles count={180} scale={[7,6,4]} size={2.8} speed={.5} color="#f54d64"/>
 </Canvas>}
