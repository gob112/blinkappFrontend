import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";



const Timer = () =>{
    const navigate = useNavigate();
    const [duration] = useState(() => {
      const savedDuration = localStorage.getItem("break_timer_duration");
      return savedDuration ? Number(savedDuration) : 10000;
    });
    const [time, setTime] = useState(duration);
    const [start, setStart] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!start) {
            clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1000) {
                    clearInterval(intervalRef.current);
                    setStart(false);
                    navigate('/test');
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [start, navigate]);
     


return(
    <div>
        <h2>Time:{time/1000}</h2>
        <button onClick={() => setStart(true)} disabled={start}>Start</button>
      <button onClick={() => setStart(false)} disabled={!start}>Stop</button>
      

    </div>
);
}

export default Timer;