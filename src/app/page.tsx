"use client"; 

import Image from "next/image";
import style from "./css/page.module.css"
import {  useEffect, useRef, useState } from "react";
import {quadrangle} from "./quadrangle";
const PI = 3.1415926535897932384626;
const SIZE = 1000;

export default function Home() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [ctx,setCtx] = useState();
  const [dpr,setDpr] = useState(1);
  const [deg,setDeg] = useState([0,0]);
  const [pos,setPos] = useState([5,-5,0]);
  
  useEffect(()=>{
    const canvas = canvasRef.current;
    setDpr(window.devicePixelRatio);
    canvas.width =  SIZE;
    canvas.height = SIZE; 
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    context.strokeStyle = "black";
    context.lineWidth = 2.5;
    setCtx(context);
  },[]);

  function useInterval(callback:any, delay:number) {
    const savedCallback:any = useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.
  
    useEffect(() => {
      savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
      }
      if (delay !== null) { // 만약 delay가 null이 아니라면 
        let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
        return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
      }
    }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
  }
  let mul=1;

  useInterval(()=>{
    draw();
    if(deg[0]<-140)mul*=-1;
    if(deg[0]>0)mul*=-1;
    deg[0]+=mul*2;deg[1]+=mul*2;
    pos[0]+=mul;
    pos[1]+=mul;
    
  },20);

  function getDegree(x:number,y:number){
    return (Math.atan2(y,x))*SIZE/PI;
  }
  function draw(){
    ctx.clearRect(0, 0, SIZE, SIZE);
    for(let i in quadrangle){
      let now=quadrangle[i];
      ctx.fillStyle = now.color;
      ctx.beginPath();
      let first=true;
      for(let j of now.arr){
        if(first){
          ctx.moveTo(getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0], getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]);
        }else{
          ctx.lineTo(getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0], getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]);
        }first=false;
        // console.log(`${j[0]}, ${j[1]}`);
      }ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // ctx.fillStyle = '#f00';
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(50,50);////x,y
    // ctx.lineTo(50, 100);
    // ctx.lineTo(0, 90);
    // ctx.closePath();
    // ctx.fillStyle = "blue";
    // ctx.fill();

    // ctx.beginPath();
    // ctx.moveTo(10, 50);
    // ctx.lineTo(50,20);////x,y
    // ctx.lineTo(50, 70);
    // ctx.closePath();
    // ctx.fillStyle = "red";
    // ctx.fill();
  }

  return (
    <div className="flex">
      <main className="flex ">
        <div className="flex flex-col h-screen w-screen justify-center items-center">
          <canvas ref={canvasRef} className={style.canvas} ></canvas>
        <div onClick={draw}>
          버튼
        </div>
        </div>
      </main>
    </div>
  );
}

