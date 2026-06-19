import { useEffect, useState, useRef } from "react"



const Timer = () =>{
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(false);
    const intervalRef = useRef(null);
    const [duration, setDuration] = useState(0);


    useEffect(()=>{
        if (start) {

            intervalRef.current= setInterval(()=>{

                setTime(prevTime => {
                    if (prevTime <= 1000) {
                        // Stop when less than or equal to 1 second left
                        clearInterval(intervalRef.current);
                        setStart(false);
                        return 0; // Set exactly 0
                    }
                    return prevTime - 1000;
                    });
            },1000);
        }else{
            clearInterval(intervalRef.current);
            setTime(duration);
        }

        return () => {
            clearInterval(intervalRef.current);
        }

    },[start,duration]);


return(
    <div>
        <h2>Time:{time/1000}</h2>
        <button onClick={() => setStart(true)} disabled={start}>Start</button>
      <button onClick={() => setStart(false)} disabled={!start}>Stop</button>
      <h3>durations</h3>
       <button onClick={()=>setDuration(5000)} >5 sec</button>
      <button onClick={()=>setDuration(10000)} >10 sec</button>
         <button onClick={()=>setDuration(30000)} >30 sec</button>
         <button onClick={()=>setDuration(60000)} >1min</button>

    </div>
);
}

export default Timer;