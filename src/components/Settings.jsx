import { useEffect, useState } from "react";

const Settings = () => {
  
    const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem("break_timer_duration");
    return saved ? Number(saved) : 10000; // Only use 10000 if localStorage is empty!
});

    useEffect(()=>{
        const current = localStorage.getItem("break_timer_duration");
        if (current != duration){
            localStorage.setItem("break_timer_duration",duration)
        }
        
    },[duration])
    return(
    <div>
      <h3>durations</h3>
       <button onClick={()=>setDuration(5000)} >5 sec</button>
      <button onClick={()=>setDuration(10000)} >10 sec</button>
         <button onClick={()=>setDuration(30000)} >30 sec</button>
         <button onClick={()=>setDuration(60000)} >1min</button>

    </div>
);
};

export default Settings