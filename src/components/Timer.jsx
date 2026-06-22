import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";



const Timer = () =>{
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(false);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const [duration, setDuration] = useState(() => {
  // 1. Fetch the value from the global browser cache
  const savedDuration = localStorage.getItem("break_timer_duration");
  
  // 2. Convert it to a number if it exists, otherwise use a fallback default
  return savedDuration ? Number(savedDuration) : 10000; 
});

    useEffect(()=>{
      
        setTime(duration);
        setStart(true);
    },[duration])

    useEffect(()=>{
        if (start && time>0) {

            intervalRef.current= setInterval(()=>{

                setTime(prevTime => {
                    if (prevTime <= 1000) {
                        // Stop when less than or equal to 1 second left
                        clearInterval(intervalRef.current);
                        setStart(false);
                        navigate('/test')
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

    },[start,navigate]);
     


return(
    <div>
        <h2>Time:{time/1000}</h2>
        <button onClick={() => setStart(true)} disabled={start}>Start</button>
      <button onClick={() => setStart(false)} disabled={!start}>Stop</button>
      

    </div>
);
}

export default Timer;