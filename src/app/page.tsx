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
  const [deg,setDeg]:[number[],any] = useState([-997, -801]);
  const [pos,setPos]:[number[],any] = useState([-193, 7, 56]);
  const [pos2,setPos2]:[number[],any] = useState([0,0,0]);
  
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
  },[]);
  useEffect(()=>{
    if(!ctx)return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    drawGround(ground);
    draw(quadrangle);
  });

  useEffect(()=>{
    function goStraight(mul:number){
      setPos2([(pos2[0]|0)+mul,(pos2[1]|0),(pos2[2]|0)]);
    }
    function goLR(mul:number){
      setPos2([(pos2[0]|0),(pos2[1]|0)+mul,(pos2[2]|0)]);
    }
    function goUD(mul:number){
      setPos2([(pos2[0]|0),(pos2[1]|0),(pos2[2]|0)+mul]);
    }
    function goDeg(mul:number){
      setDeg([deg[0],deg[1]+mul]);
    }
    function goDeg2(mul:number){
      setDeg([deg[0]+mul,deg[1]]);
    }
    const keydown=(e:any):any => {
      console.log(e);
      if(e.key=="ArrowUp"){
        goStraight(4);
      }else if(e.key=="ArrowDown"){
        goStraight(-4);
      }else if(e.key=="ArrowLeft"){
        goLR(4);
      }else if(e.key=="ArrowRight"){
        goLR(-4);
      }else if(e.code=="Space"){
        goUD(4);
      }else if(e.key=="Shift"){
        goUD(-4);

      }
      // else if(e.key=="w"){
      //   goDeg(-10);
      // }else if(e.key=="s"){
      //   goDeg(10);
      // }else if(e.key=="a"){
      //   goDeg2(-10);
      // }else if(e.key=="d"){
      //   goDeg2(10);
      // }
    };
    console.log(deg);
    console.log(pos);
    document.addEventListener("keydown", keydown);
    return ()=>{
      document.removeEventListener("keydown", keydown);
    };
  });

  


  

  

  function getDegree(x:number,y:number){
    return -((Math.atan2(y,x))+PI/4)/(PI/2)*SIZE;
  }
  function getRealDegree(x:number){
    return -x/SIZE*(PI/2)-PI/4;
  }

  function drawGround(arr:any){
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
      ctx.fill();
    }
  }


  function draw(arr:any){
    for(let i in arr){
      let now=arr[i];
      ctx.fillStyle = now.color;
      ctx.beginPath();
      let first=true;
      for(let j of now.arr){
        if(first){
          ctx.moveTo(getDegree(j[0]-pos[0]+pos2[0],j[1]-pos[1]+pos2[1])-deg[0], getDegree(j[0]-pos[0]+pos2[0],j[2]-pos[2]+pos2[2])-deg[1]);
        }else{
          ctx.lineTo(getDegree(j[0]-pos[0]+pos2[0],j[1]-pos[1]+pos2[1])-deg[0], getDegree(j[0]-pos[0]+pos2[0],j[2]-pos[2]+pos2[2])-deg[1]);
        }first=false;
        // console.log(`${getDegree(j[0]-pos[0],j[1]-pos[1])-deg[0]}, ${getDegree(j[0]-pos[0],j[2]-pos[2])-deg[1]}`);
      }ctx.closePath();
      ctx.stroke();
    }
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

