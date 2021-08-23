import React, {useState, useEffect, useRef} from 'react';
import {client} from '../src/client';
//const Websocket = require('websocket').client;

type Coordinate = {
    x : number,
    y : number
}

type Path = Coordinate[]
type Drawing = Path[]

type DetailedPath = {
    path : Path,
    color : string,
    fontSize? : number,
}

type DetailedDrawing = DetailedPath[];

type Color = 'blue'|'red'|'green'|'yellow'|'purple'|'brown'

const ColorOptions:Color[] = ['blue','red','green','yellow','purple','brown']

export const App:React.FC = () => {
    const canvasRef = useRef<any>(null);
    const contextRef = useRef<any>(null);
    const [drawing, setDrawing]= useState<boolean>(false);
    const currentDrawingStroke = useRef<Path>([]);
    const paths = useRef<DetailedDrawing>([]);
    const [color, setColor] = useState<string>('black');
    const [size, setSize] = useState<number>(5);
    const [playerDrawing, setPlayerDrawing] = useState<string>("");
    const lastEvent = useRef<Coordinate|null>(null);

    useEffect(() => {

        client.onopen = () => {
            console.log("Conencted");
        }

        client.onmessage = (message) => {
            const data = JSON.parse(message.data.toString());
            if(data.method === "undo"){
                if(paths.current.length > 0){
                    paths.current = paths.current.slice(0,paths.current.length-1);
                }
                return reDraw();
            }
            if (data.method === 'restart'){
                paths.current = [];
                return reDraw();
                //return clearWholeThing({preventDefault:() => {}})
            }
            contextRef.current.beginPath();
            const context = canvasRef.current.getContext("2d");
            //context.strokeStyle = path.color;
            context.strokeStyle = data.color;
            context.lineWidth = data.size;
            // @ts-ignore
            data.path.forEach(coordinate => {
                contextRef.current.lineTo(coordinate.x, coordinate.y)
                contextRef.current.stroke();
            })
            contextRef.current.closePath();
            paths.current = [...paths.current, {path:data.path, color:data.color, fontSize:data.size}];
            reDraw();
            console.log(paths.current);
        }

    }, [])

    const setColorOption= (e:any,color:string) => {
        e.preventDefault();
        setColor(color);
        //const canvas = canvasRef.current;
        const context = canvasRef.current.getContext("2d");
        context.strokeStyle = color;
    }

    const optionButtons:any = ColorOptions.map((color,index) => {
        return <button key={index} onClick={(e) => setColorOption(e,color)}> {color} </button>
    })

    // @ts-ignore
    const startDrawing = (e) => {
        currentDrawingStroke.current = [];
        const nativeEvent = e.nativeEvent;
        // @ts-ignore
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setDrawing(true)
    }

    const finishingDrawing = () => {
        paths.current = [...paths.current,{path:currentDrawingStroke.current, color,fontSize:size}];
        contextRef.current.closePath();
        const newPath = JSON.stringify({method:'draw', payload:{path:currentDrawingStroke.current, color, size}});
        //const newPath = JSON.stringify(currentDrawingStroke);
        client.send(newPath);
        setDrawing(false);
    }
    // @ts-ignore
    const draw = (e) => {
        const nativeEvent = e.nativeEvent;
        // @ts-ignore
        if(!drawing){
            return 
        }
        // @ts-ignore
        const {offsetX, offsetY} = nativeEvent;
        //if(currentDrawingStroke[currentDrawingStroke.length-1])
        currentDrawingStroke.current = [...currentDrawingStroke.current, {x:offsetX, y:offsetY}];
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    }

    const reDraw = () => {
        console.log("Im redarawing yo");
        contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        paths.current.forEach(path=> {
            contextRef.current.beginPath();
            const context = canvasRef.current.getContext("2d");
            context.strokeStyle = path.color;
            path.path.forEach(coordinate => {
                contextRef.current.lineTo(coordinate.x, coordinate.y)
                contextRef.current.stroke();
            })
            contextRef.current.closePath();
        })
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth*2;
        canvas.height = window.innerHeight *2;
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`

        const context = canvas.getContext("2d");
        context.scale(2,2);
        context.lineCap = "round";
        context.strokeStyle="green";
        context.lineWidth = 5;
        contextRef.current = context;
    },[])

    const clearWholeThing = (e:any) => {
        e.preventDefault();
        paths.current = [];
        contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        client.send(JSON.stringify({method:"draw", payload:{method:'restart'}}));
    }

    const clearLastStroke = (e:any) => {
        e.preventDefault();
        if(paths.current.length > 0){
            paths.current = paths.current.slice(0,paths.current.length-1);
        }
        ///paths.current = [paths.current.slice(0,paths.current.length-1)];
        reDraw();
        client.send(JSON.stringify({method:"draw", payload:{method:'undo'}}));
        // contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
    }

    const fontsizebuttons = [];
    for(let i=1; i<11; i++){
        fontsizebuttons.push(<button onClick={(e) => {e.preventDefault(); setSize(i); const canvas = canvasRef.current; const context = canvas.getContext("2d"); context.lineWidth=`${i}`}}>{i}</button>)
    }

    return (
        <div>
            {fontsizebuttons}
            {optionButtons}
            <button onClick={clearWholeThing}> Undo Whole Thing :  </button>
            <button onClick={clearLastStroke}> Undo Last Thing:  </button>
            <canvas 
                onMouseDown={startDrawing}
                onMouseUp ={finishingDrawing}
                onMouseMove = {draw}
                ref={canvasRef}
            />
        </div>
    )
}