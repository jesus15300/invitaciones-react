import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import "./PhotoViewer.css";

/* ---------- CONFIG ---------- */

const scenes = {
  IDLE: "idle",
  INTRO: "intro",
  SESSION: "session",
  MEMORY: "memory",
};

const TIMINGS = {
  IDLE_DELAY: 40000, // tiempo antes de iniciar vista previa
  INTRO_DURATION: 10000, // texto de bienvenida
  PHOTO_DURATION: 12000, // cada foto en la sesión
  MEMORY_DURATION: 16000, // pantalla de cierre
};

const frases = [
  "Momentos que se quedan para siempre ✨",
  "Un recuerdo más para el corazón 📸",
  "Gracias por celebrar con nosotros 💕",
  "De corazón, gracias por estar aquí",
  "Capturando momentos, creando recuerdos",
  "Gracias por ser parte de nuestra historia",
];

const BASE_PATH = import.meta.env.BASE_URL || "/invitacion-denisse/";
const strapiUrl = import.meta.env.VITE_STRAPI_URL;

/* ---------- MAIN ---------- */

export default function Projector() {
  const [scene, setScene] = useState(scenes.IDLE);
  const [familia, setFamilia] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isIdlePreview, setIsIdlePreview] = useState(false);

  const idleTimer = useRef(null);
  const sessionTimer = useRef(null);

  /* ---------- SOCKET ---------- */

  useEffect(() => {
    const socket = io(strapiUrl);

    socket.on("connect", () => {
      socket.emit("projector:ready");
    });

    socket.on("session:completed", async (session) => {
      clearAllTimers();
      setIsIdlePreview(false);

      setFamilia(session.name);
      setScene(scenes.INTRO);

      const res = await fetch(
        `${strapiUrl}/api/photos/session/${session.documentId}`,
      );
      const data = await res.json();

      setPhotos(data);
      setCurrentPhoto(0);

      setTimeout(() => {
        setScene(scenes.SESSION);
      }, TIMINGS.INTRO_DURATION);
    });

    startIdleFlow();

    return () => socket.disconnect();
  }, []);

  /* ---------- SESSION FLOW ---------- */

  useEffect(() => {
    if (scene !== scenes.SESSION || !photos.length) return;

    const isLast = currentPhoto === photos.length - 1;

    sessionTimer.current = setTimeout(() => {
      if (!isLast) {
        setCurrentPhoto((p) => p + 1);
        console.log("Siguiente foto");
      } else {
        setScene(scenes.MEMORY);

        setTimeout(() => {
          startIdleFlow();
        }, TIMINGS.MEMORY_DURATION);
      }
    }, TIMINGS.PHOTO_DURATION);

    return () => clearTimeout(sessionTimer.current);
  }, [scene, currentPhoto, photos]);

  /* ---------- IDLE RANDOM FLOW ---------- */

  const startIdleFlow = () => {
    clearAllTimers();
    setScene(scenes.IDLE);
    setIsIdlePreview(false);

    idleTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${strapiUrl}/api/session/all-sessions-with-photos`,
        );
        const sessions = await res.json();
        if (!sessions?.length) return;

        const randomSession =
          sessions[Math.floor(Math.random() * sessions.length)];

        if (!randomSession.taked_photos?.length) return;

        const randomPhoto =
          randomSession.taked_photos[
            Math.floor(Math.random() * randomSession.taked_photos.length)
          ];

        setFamilia(randomSession.name);
        setPhotos([randomPhoto]);
        setCurrentPhoto(0);
        setIsIdlePreview(true);
        setScene(scenes.INTRO);

        setTimeout(() => {
          setScene(scenes.SESSION);
        }, TIMINGS.INTRO_DURATION);
      } catch (err) {
        console.error(err);
      }
    }, TIMINGS.IDLE_DELAY);
  };

  const clearAllTimers = () => {
    clearTimeout(idleTimer.current);
    clearTimeout(sessionTimer.current);
  };

  async function addFrame(fotoUrl, nombre = "recuerdo") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1536;
    canvas.height = 1024;

    const foto = new Image();
    const marco = new Image();

    foto.crossOrigin = "anonymous";
    marco.crossOrigin = "anonymous";

    foto.src = fotoUrl;
    marco.src = `${BASE_PATH}frames/frame (1).png`;

    await Promise.all([
      new Promise((r) => (foto.onload = r)),
      new Promise((r) => (marco.onload = r)),
    ]);

    // Fondo
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Foto con look vintage
    ctx.filter = "sepia(0.4) contrast(1.1) brightness(0.95)";
    ctx.drawImage(foto, 128, 120, 1280, 720);
    ctx.filter = "none";

    // Marco
    ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  }

  /* ---------- RENDER ---------- */

  return (
    <div className="projector-root">
        {scene === scenes.IDLE && <IdleScene key="idle" />}
        {scene === scenes.INTRO && (
          <IntroScene
            key="intro"
            familia={familia}
            isIdlePreview={isIdlePreview}
          />
        )}
        {scene === scenes.SESSION && photos.length > 0 && (
          <SessionScene
            // key={photos[currentPhoto].id}
            photo={photos[currentPhoto]}
            familia={familia}
            index={currentPhoto}
            addFrame={addFrame}
          />
        )}
        {scene === scenes.MEMORY && <MemoryScene key="memory" />}
    </div>
  );
}

/* ---------- SCENES ---------- */

function IdleScene() {
  return (
    <motion.div
      className="scene idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <video autoPlay loop muted className="bg-video">
        <source src={`${BASE_PATH}videos/xv-fondo.mp4`} />
      </video>

      <motion.img
        src={`${BASE_PATH}img/antifaz-view.png`}
        className="antilope"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, repeatType: "reverse" }}
        style={{}}
      />

      <motion.h1
        animate={{ opacity: [0.6, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        Bienvenidos
      </motion.h1>

      <motion.h2
        initial={{ letterSpacing: "0.2em" }}
        animate={{ letterSpacing: "0.35em" }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        Mis XV Años - Denisse
      </motion.h2>
    </motion.div>
  );
}

function IntroScene({ familia, isIdlePreview }) {
  return (
    <motion.div
      className="scene idle"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <video autoPlay loop muted className="bg-video">
        <source src={`${BASE_PATH}videos/fondo-particulas.mp4`} />
      </video>

      {!isIdlePreview && <motion.p>¡Bienvenid@!</motion.p>}

      <motion.h1
        animate={{ opacity: [0.6, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        {familia}
      </motion.h1>

      {!isIdlePreview && (
        <motion.p
          animate={{ opacity: [0.6, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          {frases[Math.floor(Math.random() * frases.length)]}
        </motion.p>
      )}
    </motion.div>
  );
}

function SessionScene({ photo, familia, index, addFrame }) {
  return (
    <motion.div
      className="scene session"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <video autoPlay loop muted className="bg-video">
        <source src={`${BASE_PATH}videos/fondo-particulas.mp4`} />
      </video>

      <motion.div
        className="familia"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {familia}
      </motion.div>
    
      <FramedImage
        index={index}
        src={photo.file.url}
        alt={`Foto ${index + 1}`}
        addFrame={addFrame}
      />
    </motion.div>
  );
}

function MemoryScene() {
  return (
    <motion.div
      className="scene idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <video autoPlay loop muted className="bg-video">
        <source src={`${BASE_PATH}videos/xv-fondo.mp4`} />
      </video>

      <motion.h1
        animate={{ opacity: [0.6, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        Felices XV Denisse
      </motion.h1>
    </motion.div>
  );
}

function FramedImage({ index, src, alt, addFrame }) {
  const [framedSrc, setFramedSrc] = React.useState(null);
  const fromLeft = index % 2 === 0;

  React.useEffect(() => {
    let alive = true;

    addFrame(src).then((result) => {
      if (alive) setFramedSrc(result);
    });

    return () => {
      alive = false;
    };
  }, [src]);

  if (!framedSrc) {
    return <div className="photo-loading">Procesando…</div>;
  }

  return (
    <motion.img
      key={framedSrc}
      className="session-photo"
      initial={{
        opacity: .8,
        x: fromLeft ? -60 : 60,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: [1, 1.015, 1],
      }}
      transition={{
        duration: 15,
        delay: index * 0.6,
        ease: "easeInOut",
      }}
      src={framedSrc}
      alt={alt}
    />
  );
}
