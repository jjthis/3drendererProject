"use client"; 

import Image from "next/image";
import style from "./css/page.module.css"
import {  useEffect, useRef, useState } from "react";
import {ground, quadrangle} from "./quadrangle";
import { sign } from "crypto";
const PI = 3.1415926535897932384626;
const SIZE = 1000;

export default function Home() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [ctx,setCtx]:[any,any] = useState(null);
  const [dpr,setDpr]:[number,any] = useState(1);
  const [deg,setDeg]:[number[],any] = useState([0,0]);
  const [pos,setPos]:[number[],any] = useState([5,-5,0]);
  

  const keydown=(e:any):any => {
    if(e.key=="ArrowUp"){
      goStraight(1);
    }else if(e.key=="ArrowDown"){
      goStraight(-1);
    }
  };

  const keyup=(e:any):any => {
    if(e.key=="ArrowUp"){
      stopStraight();
    }else if(e.key=="ArrowDown"){
      stopStraight();
    }
  };

  useEffect(()=>{
    const canvas:any = canvasRef.current;
    setDpr(window.devicePixelRatio);
    canvas.width =  SIZE;
    canvas.height = SIZE; 
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    context.strokeStyle = "black";
    context.lineWidth = 2.5;
    setCtx(context);


    document.addEventListener("keydown", keydown);
    
    document.addEventListener("keyup", keyup);

    return ()=>{
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };

  },[]);
  useEffect(()=>{
    if(!ctx)return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    draw(ground,false);
    draw(quadrangle,true);
  });


  const [callback,setCallback]:[any,any]=useState(():any=>{});
  let delay=20;

  const savedCallback:any = useRef(callback); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.


  useEffect(() => {
    function tick() {
      savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
    }
    if (delay !== null) { // 만약 delay가 null이 아니라면 
      let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
      return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
    }
  }, [delay]); // delay가 바뀔 때마다 새로 실행된다.

  // useInterval(()=>{
  //   draw();
  //   if(deg[0]<-140)mul*=-1;
  //   if(deg[0]>0)mul*=-1;
  //   deg[0]+=mul*2;deg[1]+=mul*2;
  //   pos[0]+=mul;
  //   pos[1]+=mul;
    
  // },20);

  function getDegree(x:number,y:number){
    ////-pi~pi
    ///90 = -pi/4~pi/4
    ///0~pi/2
    return -((Math.atan2(y,x))+PI/4)/(PI/2)*SIZE;
  }
  function getRealDegree(x:number){
    return -x/SIZE*(PI/2)-PI/4;
  }
  function goStraight(mul:number){
    console.log("GO "+mul);
    savedCallback.current = ()=>{
      ///대각선 길이가 T일때 각도가 D일때
      // x,y
      // T*sin(D) = y
      // T*cos(D) = x
      ///x * tan(D2) = z
      setPos([(pos[0]|0)+mul*Math.sin(getRealDegree(deg[0])),(pos[1]|0)+mul*Math.cos(getRealDegree(deg[0])),(pos[2]|0)mul*Math.sin(getRealDegree(deg[0]))*Math.tan(getRealDegree(deg[1]))]);
    };
      
  }
  function stopStraight(){
    console.log("stop");
    savedCallback.current = ():any=>{};
  }


  function draw(arr:any,isStr:boolean){
    for(let i in arr){
      let now=arr[i];
      ctx.fillStyle = now.color;
      ctx.beginPath();
      let first=true;
      for(let j of now.arr){
        if(first){
          ctx.moveTo(getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0], getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]);
        }else{
          ctx.lineTo(getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0], getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]);
        }first=false;
        // console.log(`${getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0]}, ${getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]}`);
      }ctx.closePath();
      if(isStr)ctx.stroke();
      else ctx.fill();
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
        {/* <div onClick={draw}>
          버튼
        </div> */}
        <div>
          <label>
            posx:&nbsp;&nbsp;
          </label>
          <input 
              id='posx' type={"range"} min="-800" max="800" 
              onChange={e=>setPos([e.currentTarget.value,pos[1],pos[2]])}>
          </input>
        </div>
        <div>
          <label>
            posy:&nbsp;&nbsp;
          </label>
          <input 
              id='posy' type={"range"} min="-800" max="800"  
              onChange={e=>setPos([pos[0],e.currentTarget.value,pos[2]])}>
          </input>
        </div>
        <div>
          <label>
            posz:&nbsp;&nbsp;
          </label>
          <input 
              id='posz' type={"range"} min="-800" max="800" 
              onChange={e=>setPos([pos[0],pos[1],e.currentTarget.value])}>
          </input>
        </div>
        <div>
          <label>
            degx:&nbsp;&nbsp;
          </label>
          <input 
              id='degx' type={"range"} min="-2000" max="2000" 
              onChange={e=>setDeg([e.currentTarget.value,deg[1]])}>
          </input>
        </div>
        <div>
          <label>
            degy:&nbsp;&nbsp;
          </label>
          <input 
              id='degy' type={"range"} min="-2000" max="2000" 
              onChange={e=>setDeg([deg[0],e.currentTarget.value])}>
          </input>
        </div>
               
        </div>
      </main>
    </div>
  );
}

