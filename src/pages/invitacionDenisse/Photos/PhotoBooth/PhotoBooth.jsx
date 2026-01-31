import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./PhotoBooth.css";
import BubbleLoader from "../../../../components/BubleLoader/BubbleLoader";
import ScanLoader from "../../../../components/ScanLoader/ScanLoader";

const strapiUrl = import.meta.env.VITE_STRAPI_URL;
const BASE_PATH = import.meta.env.VITE_BASE_PATH;

const states = {
  DISPONIBLE: "disponible",
  TOMANDO_FOTOS: "tomando_fotos",
  PROCESANDO: "procesando",
  VISUALIZACION: "visualizacion",
};

const poseFrases = [
  "¡Haz tu mejor pose!",
  "¡Sonríe para la cámara!",
  "¡Muestra tus mejores movimientos!",
  "¡Haz una cara divertida!",
  "¡Salta y captura el momento!",
  "¡Abraza a tus amigos y sonrían juntos!",
  "¡Haz una pose elegante!",
  "¡Muestra tu estilo único!",
];
const procesandoFrases = [
  "Procesando tus fotos...",
  "Casi listo...",
  "Wow, se ve genial...",
  "Preparando la magia...",
  "Tus fotos están en camino...",
];
const resultadosFrases = [
  "¡Aquí están tus fotos!",
  "¡Mira estas increíbles capturas!",
  "¡Tus recuerdos están listos!",
  "¡Disfruta de tus fotos!",
];
export default function PhotoBooth() {
  const [state, setState] = useState(states.DISPONIBLE);
  const [session, setSession] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const [fraseIndex, setFraseIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  const secondsToCountdown = 10;
  let totalPhotos = 1;

  useEffect(() => {
    initSocket();
    loadCameras();

    setTimeout(() => {
      // TESTSCENE();
    }, 2500);

    return () => {
      socketRef.current?.disconnect();
      stopCamera();
    };
  }, []);

  // SOLO PARA PRUEBAS
  const TESTSCENE = () => {
    setState(states.VISUALIZACION);
    const urlTest =
      "https://thumbs.dreamstime.com/b/sample-jpeg-fluffy-white-pomeranian-puppy-sits-looks-camera-colorful-balls-front-364720569.jpg";
    const tPhotos = [
      {
        id: 1,
        file: { url: urlTest },
      },
      {
        id: 2,
        file: { url: urlTest },
      },
      {
        id: 3,
        file: { url: urlTest },
      },
      {
        id: 4,
        file: { url: urlTest },
      },
      {
        id: 4,
        file: { url: urlTest },
      },
    ];
    setPhotos(tPhotos);
    // setCountdown(6);
  };

  /* ---------------- SOCKET ---------------- */

  function initSocket() {
    const socket = io(strapiUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("cabina:ready");
    });

    socket.on("session:ready", async (data) => {
      if (state !== states.DISPONIBLE) return;
      setSession(data);
      totalPhotos = data.totalPhotos;
      await startPhotoFlow(data);
    });
  }

  /* ---------------- CAMERAS ---------------- */

  async function loadCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter((d) => d.kind === "videoinput");
    setDevices(cams);
    if (cams[0]) {
      setSelectedDevice(cams[0].deviceId);
      startCamera(cams[0].deviceId);
    }
  }

  async function startCamera(deviceId) {
    stopCamera();
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId }, width: 1280, height: 720 },
    });
    videoRef.current.srcObject = stream;
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
  }

  /* ---------------- PHOTO FLOW ---------------- */

  async function startPhotoFlow(sessionData) {
    setState(states.TOMANDO_FOTOS);
    await updateSessionStatus(sessionData.documentId, "CAPTURING");
    const photos = [];

    for (let i = 0; i < totalPhotos; i++) {
      await runCountdown(secondsToCountdown);
      photos.push(takePhoto());
      setFraseIndex(Math.floor(Math.random() * poseFrases.length));
    }

    setState(states.PROCESANDO);
    await uploadPhotos(photos, sessionData);
    await updateSessionStatus(sessionData.documentId, "DONE");
    await loadPhotosUrls(sessionData.documentId);
    setState(states.VISUALIZACION);

    setTimeout(() => {
      resetBooth();
    }, 18000);
  }

  function runCountdown(seconds) {
    return new Promise((resolve) => {
      let counter = seconds;
      setCountdown(counter);

      const i = setInterval(() => {
        counter--;
        setCountdown(counter);
        if (counter === -1) {
          clearInterval(i);
          resolve();
        }
      }, 1000);
    });
  }

  function takePhoto() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    return dataURLtoBlob(canvas.toDataURL("image/jpeg", 0.9));
  }

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    return new Blob([Uint8Array.from(bstr, (c) => c.charCodeAt(0))], {
      type: mime,
    });
  }

  async function updateSessionStatus(sessionId, status) {
    await fetch(`${strapiUrl}/api/session/update-status/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function uploadPhotos(photos, sessionData) {
    for (let i = 0; i < photos.length; i++) {
      const fd = new FormData();
      fd.append("files", photos[i], `photo_${i}.jpg`);
      fd.append(
        "data",
        JSON.stringify({ documentId: sessionData.documentId, order: i }),
      );

      await fetch(`${strapiUrl}/api/photos`, {
        method: "POST",
        body: fd,
      });
    }
  }

  async function loadPhotosUrls(sessionId) {
    const res = await fetch(`${strapiUrl}/api/photos/session/${sessionId}`);
    const data = await res.json();
    // order by order field
    data.sort((a, b) => a.order - b.order);
    setPhotos(data);
  }

  function resetBooth() {
    setSession(null);
    setCountdown(0);
    setState(states.DISPONIBLE);
    setPhotos([]);
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="booth-container">
      <video ref={videoRef} autoPlay playsInline className="camera" />
      <canvas ref={canvasRef} hidden />

      {/* Selector cámara */}
      <select
        className="camera-select"
        value={selectedDevice}
        onChange={(e) => {
          setSelectedDevice(e.target.value);
          startCamera(e.target.value);
        }}
      >
        {devices.map((d) => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || "Cámara"}
          </option>
        ))}
      </select>

      <AnimatePresence>
        {state === states.DISPONIBLE && (
          <motion.div
            className="overlay home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>¡Hola!</h2>
            <h1>Bienvenido a los XV Años de Denisse</h1>
            <div style={{ display: "flex", gap: "20px" }}>
              <p className="instructions">
                <b>Instrucciones para tomar la foto perfecta:</b>
                <br />
                1. Escanea el código QR 📲 <br />
                2. Ingresa tu nombre en tu teléfono 📱 <br />
                3. Comenzará la cuenta regresiva ⏳ <br />
                4. Realiza tu mejor pose 🕺 <br />
                5. ¡Tómate fotos y diviértete! 📸 <br />
              </p>
              <div className="qr-container">
                <img src={`img/qr-code-cabina-prueba.png`} className="qr" />
                <p style={{ textAlign: "center" }}>Escanea para iniciar</p>
              </div>
            </div>
          </motion.div>
        )}

        {countdown > 0 && (
          <motion.div
            className="overlay countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>{poseFrases[fraseIndex]}</h2>
            <motion.div
              className="countdown"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}

        {state === states.PROCESANDO && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BubbleLoader />
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "reverse",
              }}
            >
              <ScanLoader
                text={
                  procesandoFrases[
                    Math.floor(Math.random() * procesandoFrases.length)
                  ]
                }
              />
            </motion.h2>
          </motion.div>
        )}
        {state === states.VISUALIZACION && (
          <motion.div className="overlay natural-overlay">
            <motion.h2
              className="natural-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              {
                resultadosFrases[
                  Math.floor(Math.random() * resultadosFrases.length)
                ]
              }{" "}
              ✨
            </motion.h2>

            <div className="natural-collage">
              {photos.map((p, index) => {
                const layouts = {
                  3: [
                    { x: 0, y: 60 },
                    { x: 320, y: 250 },
                    { x: 630, y: 80 },
                  ],
                  4: [
                    { x: -0, y: 20 },
                    { x: 630, y: 35 },
                    { x: 70, y: 250 },
                    { x: 500, y: 250 },
                  ],
                  5: [
                    { x: -0, y: 20 },
                    { x: 630, y: 35 },
                    { x: 70, y: 250 },
                    { x: 580, y: 250 },
                    { x: 320, y: 125 },
                  ],
                };

                const target = layouts[photos.length]?.[index] || {
                  x: 0,
                  y: 0,
                };

                const fromX = Math.random() * 600 - 300;
                const fromY = Math.random() * 400 - 200;
                const rotation = Math.random() * 14 - 7;

                return (
                  <motion.img
                    key={p.id}
                    src={p.file.url}
                    alt="foto"
                    className="natural-photo"
                    initial={{
                      x: fromX,
                      y: fromY,
                      scale: 0.85,
                      rotate: rotation,
                      opacity: 0,
                    }}
                    animate={{
                      x: target.x,
                      y: target.y,
                      scale: 1,
                      rotate: rotation / 3,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.8,
                      delay: index * 0.6,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
