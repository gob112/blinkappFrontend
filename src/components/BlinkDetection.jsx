
//enabale webcam feed

import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

const LEFT_EYE_INDICES = [362, 385, 386, 263, 374, 380];
const RIGHT_EYE_INDICES = [33, 159, 158, 133, 153, 145];

const BlinkDetection = () => {
    // refs to persist values between renders
    const webcamRef = useRef(null);
    const landmarkerRef = useRef(null);
    const wsRef = useRef(null);


    //this hook will be called once
    //want to load the Ai once 

    //load in ML for face detecction
    useEffect(()=>{
        const mediapipeload = async () =>{
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            const modelUrl = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
            try {
                // quick HEAD check to see if model is reachable
                const head = await fetch(modelUrl, { method: 'HEAD' });
                if (!head.ok) {
                    console.error('Model URL not reachable:', modelUrl, head.status);
                }

                landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: modelUrl,
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    outputFaceBlendshapes: false,
                    outputFacialTransformationMatrixes: false,
                });
                console.log('FaceLandmarker loaded successfully');
            } catch (err) {
                console.error('Failed to load FaceLandmarker model:', err);
            }

        };
        //call the function, its async so will not halt other things 
        mediapipeload();

        //Runs only on the first render

        
    },[]);


    
    //feed in video feed into face detection AI and extract the relevent coordinates and store into a object
    const captureCoordinates = async () => {
            //get the current state of the things fron useRef
            const video = webcamRef.current && webcamRef.current.video;
            const timestamp = performance.now();
            // pass video into AI to get resulting landmarks
            if (!landmarkerRef.current || !video) return;
            // ensure video frame has non-zero dimensions to avoid MediaPipe ROI errors
            if (!video.videoWidth || !video.videoHeight) {
                console.warn('Skipping frame: video has zero width/height', video.videoWidth, video.videoHeight);
                return;
            }

            let result;
            try {
                result = await landmarkerRef.current.detectForVideo(video, timestamp);
            } catch (err) {
                console.error('detectForVideo failed:', err);
                return;
            }


            //extract the eye landmarks only via coordinates defined above
            if (result && result.faceLandmarks && result.faceLandmarks.length > 0) {
                const landmarks = result.faceLandmarks[0]; // First detected face

                const leftEyeCoords = LEFT_EYE_INDICES.map(index => landmarks[index]);
                const rightEyeCoords = RIGHT_EYE_INDICES.map(index => landmarks[index]);

                // Send the secure numerical data to your backend
                await sendToBackend({ left: leftEyeCoords, right: rightEyeCoords ,time:timestamp});
            };


        };

        //define afterwards as the things before need to be done first
        //send post req to backend with these coordinates and display the respose
        // const sendToBackend = async (eyedata) => {
        const sendToBackend = async (eyedata) => {
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(eyedata));
            } else {
                console.warn('WebSocket is not open, cannot send data', ws?.readyState);
            }
        };

        useEffect(() => {
            const ws = new WebSocket("ws://localhost:8000/ws");
            wsRef.current = ws;

            ws.addEventListener("open", () => {
                console.log('WebSocket connected');
            });

            ws.addEventListener("message", (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Is eye closed?", data.eyeclosed);
                } catch (err) {
                    console.error('Failed to parse WebSocket message', err, event.data);
                }
            });

            ws.addEventListener("error", (event) => {
                console.error('WebSocket error', event);
            });

            ws.addEventListener("close", (event) => {
                console.log('WebSocket closed', event.code, event.reason);
                if (wsRef.current === ws) {
                    wsRef.current = null;
                }
            });

            return () => {
                ws.close();
                if (wsRef.current === ws) {
                    wsRef.current = null;
                }
            };
        }, []);







            // try {
            //     const response = await fetch('http://127.0.0.1:8000/eye', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(eyedata),
            //     });
            //     const data = await response.json();
            //     console.log("Is eye closed?", data.eyeclosed);
            // } catch (error) {
            //     console.error("Error sending coordinates:", error);
            // }


        // };
        //set an iterval on how many times are the coordinates send and captured
    useEffect(() => {
        const interval = setInterval(() => {
            captureCoordinates();
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Webcam ref={webcamRef} muted={true} style={{ width: 640, height: 480 }} />
        </div>
    );




};


export default BlinkDetection;








