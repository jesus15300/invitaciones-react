import React, { useEffect, useState, useRef } from "react";
import "./PhotoController.css";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import BubbleLoader from "../../../../components/BubleLoader/BubbleLoader";
import ControllerInicio from "./ControllerInicio";
import ControllerForm from "./ControllerForm";
import ScanLoader from "../../../../components/ScanLoader/ScanLoader";
const strapiUrl = import.meta.env.VITE_STRAPI_URL;
const BASE_PATH = import.meta.env.BASE_URL || "/invitacion-denisse/";

const steps = {
  LOADING: "loading",
  FORM: "form",
  OCUPADA: "ocupada",
  CREANDO: "creando",
  LISTO: "listo",
  GALERIA: "galeria",
  TODA_GALERIA: "toda_galeria",
  INICIO: "inicio",
};

const resultadosFrases = [
  "¡Aquí están tus fotos!",
  "¡Mira estas increíbles capturas!",
  "¡Tus recuerdos están listos!",
  "¡Disfruta de tus fotos!",
];

export default function PhotoController() {
  const [step, setStep] = useState(steps.INICIO);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [totalPhotos, setTotalPhotos] = useState(3);
  const [sessionId, setSessionId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [capturedIds, setCapturedIds] = useState([]);
  const [dataSesiones, setDataSesiones] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      // TESTSESION();
    }, 2000);

    const ids = localStorage.getItem("sessionIds");
    if (ids) setCapturedIds(JSON.parse(ids));
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const disponible = await cabinaDisponible();
      if (!disponible) {
        setStep(steps.INICIO);
      }
      setIsLoading(false);
    }
    if (step == steps.FORM) {
      fetchData();
    }
    if(step === steps.TODA_GALERIA){
      cargarSesionesConFotos();
    }
  }, [step]);
  const CabinaOcupada = async () => {
    const res = await fetch(`${strapiUrl}/api/session/active-sessions`);
    const data = await res.json();
    // verificamos sesiones activas "CREATED" o "CAPTURING"
    if (data?.length > 0) {
      setStep(steps.OCUPADA);
    }
  };

  const cabinaDisponible = async () => {
    const res = await fetch(
      `${strapiUrl}/api/session/is-photo-booth-available`,
    );
    const data = await res.json();
    if (!data.available) {
      alert(
        "La cabina de fotos no está conectada. Por favor, espera un momento.",
      );
      return false;
    }
    return true;
  };

  const TESTSESION = () => {
    setStep(steps.GALERIA);
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
  };

  function initSocket() {
    const socket = io(strapiUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("controller:ready");
    });

    socket.on("session:completed", async (session) => {
      await cargarFotos(session.documentId);
      setStep(steps.GALERIA);
      socket.disconnect();
    });
  }

  const crearSesion = async () => {
    setIsLoading(true);
    await CabinaOcupada();
    setIsLoading(false);
    setStep(steps.CREANDO);
    setTimeout(async () => {
      try {
        const res = await fetch(`${strapiUrl}/api/session/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, contact, totalPhotos }),
        });
        const data = await res.json();
        if (!res.ok) alert("Error al crear la sesión. Intenta de nuevo.");
        const ids = [...capturedIds, data.documentId];
        localStorage.setItem("sessionIds", JSON.stringify(ids));
        setCapturedIds(ids);
        setSessionId(data.documentId);
        initSocket();
        setStep(steps.LISTO);
      } catch (error) {
        console.error("Error creating session:", error);
        setStep(steps.FORM);
      }
    }, 2000);
  };

  const cargarFotos = async (id) => {
    const res = await fetch(`${strapiUrl}/api/photos/session/${id}`);
    const data = await res.json();
    setPhotos(data);
    setStep(steps.GALERIA);
  };

  // Se cargan las sesiones fotográficas con fotos para ver los de toda la fiesta
  const cargarSesionesConFotos = async () => {
    setIsLoading(true);
    setPhotos([]);
    const res = await fetch(`${strapiUrl}/api/session/all-sessions-with-photos`);
    const data = await res.json();
    setDataSesiones(data);
    setIsLoading(false);
    return data;
  }

  const resetBooth = () => {
    setStep(steps.FORM);
    setName("");
    setContact("");
    setSessionId(null);
    setPhotos([]);
    setDataSesiones([]);
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
  async function descargarImg(fotoUrl, nombre = "recuerdo") {
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
    const link = document.createElement("a");
    link.download = `${nombre}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: isLoading ? "auto" : "none" }}
      >
        <BubbleLoader />
        <h2 className="loading-text">Cargando...</h2>
      </motion.div>
      <Header step={step} setStep={setStep} />

      <div className="section-bg-gradient" />
      <div className="section-bg-texture mix-blend-overlay" />
      <div
        className="section-container"
        style={{ margin: "20px", paddingTop: "0", zIndex: 20 }}
      >
        {step === steps.INICIO && (
          <ControllerInicio
            setStep={setStep}
            steps={steps}
            BASE_PATH={BASE_PATH}
          />
        )}
        {step === steps.FORM && !isLoading && (
          <ControllerForm
            setStep={setStep}
            steps={steps}
            setSessionId={setSessionId}
            setPhotos={setPhotos}
            setCapturedIds={setCapturedIds}
            capturedIds={capturedIds}
            name={name}
            setName={setName}
            contact={contact}
            setContact={setContact}
            totalPhotos={totalPhotos}
            setTotalPhotos={setTotalPhotos}
            crearSesion={crearSesion}
            cargarFotos={cargarFotos}
          />
        )}
        <motion.div
          className="booth-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {step === steps.OCUPADA && (
            <ControllerOcupado comprobarDisponibilidad={CabinaOcupada} />
          )}

          {step === steps.CREANDO && <ControllerCreando />}

          {step === steps.LISTO && <ControllerListo />}

          {step === steps.GALERIA && (
            <ControllerGaleria
              photos={photos}
              addFrame={addFrame}
              descargarImg={descargarImg}
            />
          )}
          {/* Va a tener el nombre de la persona con las fotos tomadas */}
          {step === steps.TODA_GALERIA && (
            <>
            {dataSesiones.length === 0 && !isLoading && (
              <h2 className="section-title text-gold-pale">
                No hay fotos disponibles aún.
              </h2>
            )}
            {dataSesiones.map((sesion) => (
              <ControllerGaleria
                key={sesion.id}
                nombre={sesion.name}
                photos={sesion.taked_photos}
                addFrame={addFrame}
                descargarImg={descargarImg}
              />
            ))}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

function Header({ step, setStep }) {
  return (
    <div className="header">
      <div className="header-logo">
        <img src={`${BASE_PATH}img/imagen-denisse.jpg`} alt="Logo Denisse" />
      </div>
      <h1 className="header-title">XV Denisse</h1>
      {step !== steps.INICIO && (
        <div
          className="header-home-btn"
          onClick={() =>
            setStep(steps.INICIO)
          }
        >
          <img
            src={`${BASE_PATH}icons/home.png`}
            alt="Inicio"
            title="Ir al inicio"
          />
        </div>
      )}
    </div>
  );
}
function ControllerCreando() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="confirm-card"
    >
      <h2 className="section-title text-gold-pale">¡Preparate!</h2>

      <h2 className="booth-title">
        En unos momentos iniciará la sesión de fotos
      </h2>
      <br />
      <h2 className="booth-title">Captura tu mejor sonrisa :)</h2>
    </motion.div>
  );
}
function ControllerListo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="confirm-card"
      style={{ width: "100%" }}
    >
      <h2 className="section-title text-gold-pale">¡Todo listo! 🎉 </h2>
      <p className="booth-text">Posa y luce increíble ✨</p>
      <br />
      <p className="booth-text">En breve veras tus fotos...</p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
      >
        <ScanLoader text="Casi Listo..." font="32px" />
      </div>
    </motion.div>
  );
}
function ControllerGaleria({ photos, addFrame, descargarImg, nombre = null }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="confirm-card gallery-card"
      style={{ width: "100%", maxWidth: "500px", marginBottom: "40px" }}
    >
      <h2 className="section-title text-gold-pale">
        {nombre ? `Fotos de ${nombre}` : resultadosFrases[Math.floor(Math.random() * resultadosFrases.length)]}
      </h2>

      <div className="gallery-column">
        {photos.map((p, index) => {
          if (!p.file) return null;
          return (
            <>
              <FramedImage
                idx={index}
                src={p.file.url}
                alt="foto"
                addFrame={addFrame}
              />
              <button
                className="download-btn"
                onClick={() =>
                  descargarImg(p.file.url, `foto-${index + 1}`)
                }
              >
                Descargar
              </button>
            </>
          );
        })}
      </div>
    </motion.div>
  );
}

function ControllerOcupado({ comprobarDisponibilidad }) {
  return (
    <div className="confirm-card" style={{ width: "100%" }}>
      <h1 className="section-title text-gold-pale">Un momento</h1>
      <p className="text-gray-light mt-4 mb-4">
        Alguien más está tomando fotos. Por favor, espera tu turno.
      </p>
      <button className="booth-btn" onClick={comprobarDisponibilidad}>
        Volver a intentar
      </button>
    </div>
  );
}
function FramedImage({ idx, src, alt, addFrame }) {
  const [framedSrc, setFramedSrc] = React.useState(null);
  const fromLeft = idx % 2 === 0;


  React.useEffect(() => {
    let alive = true;

    addFrame(src).then(result => {
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
                className="gallery-photo"
                initial={{
                  opacity: 0,
                  x: fromLeft ? -60 : 60,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: [1, 1.015, 1],
                }}
                transition={{
                  duration: 2.5,
                  delay: idx * 0.6,
                  ease: "easeInOut",
                }}
      src={framedSrc}
      alt={alt}
    />
  );
}