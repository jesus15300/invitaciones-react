import React, { useState, useRef, useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import ReactHowler from "react-howler";
import { FaGlassCheers, FaMusic, FaBirthdayCake, FaMoon } from "react-icons/fa";
import "./invitacionDenisse.styles.css";
import { fetchAPI } from "../../utils/fetch-api";

export async function getInvitationData() {
  const token = import.meta.env.VITE_STRAPI_TOKEN;
  const path = `/invitations`;
  const slug = "invitacion-xv-denisse";
  const fullPath =
    path +
    `?filters[slug][$eq]=${slug}&populate[0]=itinerary&populate[1]=locations&populate[2]=form.questions&populate[3]=locations.imgUrl&populate[4]=form.questions.options&populate[5]=media.url`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const invitationResponse = await fetchAPI(fullPath, {}, options);

  return invitationResponse.data[0];
}

export default function InvitacionXV() {
  const BASE_PATH = import.meta.env.BASE_URL || "";
  const BASE_STRAPI =
    import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337";
  const [playing, setPlaying] = useState(false);
  const howlerRef = useRef(null);

  const { scrollY } = useViewportScroll();

  const backgroundY = useTransform(scrollY, [0, 800], [0, -120]);
  const maskScale = useTransform(scrollY, [0, 800], [1, 1.5]);

  const toggleMusic = () => setPlaying((p) => !p);

  const nombreInvitado = new URLSearchParams(window.location.search).get(
    "invitado"
  );

  const [invitationData, setInvitationData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [musicLoaded, setMusicLoaded] = useState(false);

  const hoursTo12HourFormat = (time) => {
    // example: "19:30:00" -> "7:30 PM" and "00:00:00" -> "8:00 AM"
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${hour12}:${minute} ${period}`;
  };
  const nameToAnyIcon = (name) => {
    switch (name.toLowerCase()) {
      case "glasscheers":
        return <FaGlassCheers className="icon-gold" />;
      case "music":
        return <FaMusic className="icon-gold" />;
      case "birthdaycake":
        return <FaBirthdayCake className="icon-gold" />;
      case "moon":
        return <FaMoon className="icon-gold" />;
      default:
        return null;
    }
  };
  const findMedia = (title) => {
    // invitationData?.media find by title
    return invitationData?.media.find((media) => media.title === title);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvitationData();
        setInvitationData(data);
      } catch (error) {
        console.error("Error fetching invitation data:", error);
      } finally {
        setTimeout(() => {
          setLoadingData(false);
        }, 800);
      }
    };
    fetchData();
  }, []);

  // start music when scrollY > 300 and fix the problem The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.
  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > 300 && !playing) {
        setPlaying(true);
      }
    });
  }, [scrollY]);

  useEffect(() => {
    if (nombreInvitado) {
      document.title = `Invitación de ${nombreInvitado} - XV Años de Denisse`;
    } else {
      document.title = `Invitación - XV Años de Denisse`;
    }
  }, [nombreInvitado]);

  const fechaEvento = new Date("2026-01-29T19:30:00");
  const [tiempoRestante, setTiempoRestante] = useState({});

  useEffect(() => {
    const actualizarTiempo = () => {
      const ahora = new Date();
      const diferencia = fechaEvento - ahora;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      setTiempoRestante({
        Dias: dias,
        Horas: horas,
        Minutos: minutos,
        Segundos: segundos,
      });
    };

    const timer = setInterval(actualizarTiempo, 1000);
    return () => clearInterval(timer);
  }, [fechaEvento]);

  const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);

  const [valoresFormulario, setValoresFormulario] = useState({
    nombre: nombreInvitado || "",
    asistencia: "confirmado",
  });

  /* ================= RENDERS ================= */

  const renderMusicSection = () => {
    return (
      <>
        <ReactHowler
          src={[BASE_STRAPI + findMedia("main-song")?.url.url]}
          playing={playing}
          onLoad={() => {setMusicLoaded(true)}}
          ref={howlerRef}
          loop={true}
          volume={0.6}
        />
        <button
          onClick={toggleMusic}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="music-floating-btn border-gold text-gold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="music-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {playing ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 19h4V5H6v14zM14 5v14h4V5h-4z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5v14l11-7L9 5z"
              />
            )}
          </svg>
          <span className="music-label">{playing ? "Pausar" : "Música"}</span>
        </button>
      </>
    );
  };

  const renderHomeSection = () => {
    return (
      <section className="hero-container">
        {/* Fondo animado */}
        <motion.div
          style={{ y: backgroundY }}
          className="hero-background-layer"
        >
          <div className="hero-gradient-base" />
          <div className="hero-texture-overlay" />

          {/* Brillo y partículas */}
          <div className="hero-shine-layer">
            <div className="hero-radial-shine" />
            <div className="hero-particles-container">
              <div className="gold-particles-css" />
            </div>
          </div>

          {/* Partículas flotantes animadas */}
          <motion.div className="floating-dots-container">
            {[...Array(70)].map((_, i) => (
              <motion.div
                key={i}
                className="floating-dot bg-gold"
                initial={{ y: -100, x: 200, opacity: 0 }}
                animate={{ y: 800, x: -500, opacity: 1 }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Contenido Principal Home */}
        <motion.div
          style={{ scale: maskScale }}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="hero-content-wrapper"
        >
          {/* Imagen de Perfil */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="hero-image-frame"
          >
            <img
              className="profile-img shadow-deep border-red-dark"
              src={`${BASE_PATH}img/denisse-perfil.jpg`}
              alt="Profile picture"
            />
          </motion.div>

          {/* Textos */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="hero-text-block"
          >
            <div className="subtitle-small text-gold uppercase">
              Baile de Máscaras
            </div>
            <motion.h1
              initial={{ y: 20, opacity: 1 }}
              animate={{ y: [-15, 0] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
              className="main-title text-cream font-serif drop-shadow-text"
            >
              Denisse Salgado
            </motion.h1>
            <p className="date-text text-gold-pale">
              Mis XV Años —{" "}
              {fechaEvento.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* Flecha scroll */}
            <div className="scroll-indicator-container">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 16, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="scroll-line border-gold-pale" />
                <p className="text-gold-pale">Desliza hacia abajo</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    );
  };

  const renderMessageSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        className="card-red border-gold-thick shadow-heavy container-message"
      >
        <p className="message-text text-gray-light">
          Te invito a celebrar el inicio de una nueva etapa en mi vida. Llena de
          sueños, metas y nuevas experiencias.
        </p>
      </motion.div>
    );
  };

  const renderCounterSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        className="counter-wrapper"
      >
        <div
          style={{
            backgroundImage: `url(${BASE_PATH}img/imagen-denisse.jpg)`,
          }}
          className="counter-background-image"
        >
          <div className="counter-overlay-gradient">
            <h3 className="counter-title text-gold-pale">Faltan</h3>
            <div className="counter-grid">
              {tiempoRestante &&
                Object.entries(tiempoRestante).map(([key, value]) => (
                  <div key={key} className="counter-item">
                    <span className="counter-number text-gold">{value}</span>
                    <span className="counter-label text-gray-light">{key}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCardsUbicaciones = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        className="section-container"
      >
        {/* Fondos */}
        <div className="section-bg-gradient" />
        <div className="section-bg-texture mix-blend-overlay" />

        <div className="content relative-z">
          <h3 className="section-title text-gold-pale">Dónde y Cuándo</h3>

          {invitationData?.locations.map((location, index) => (
            <div key={index} className="location-card border-red-transparent">
              <div
                className="location-image"
                style={{
                  backgroundImage: `url(${BASE_STRAPI}${location.imgUrl.formats.medium.url})`,
                }}
              />

              <div className="location-info-overlay border-gold-faint">
                <h4 className="location-name text-gold">{location.name}</h4>
                <p className="location-address text-gray-light">
                  {location.address}
                </p>
                <p className="location-time text-gray-light">
                  A las {hoursTo12HourFormat(location.time)}.
                </p>
                <div className="location-cta-wrapper">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold shadow-std"
                  >
                    Ver en mapa
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderItinerarioSection = () => {
    return (
      <section className="section-container">
        <div className="section-bg-gradient" />
        <div className="section-bg-texture mix-blend-overlay" />

        <div className="content relative-z">
          <h3 className="section-title text-gold-pale">
            Itinerario del Evento
          </h3>

          {/* Línea de tiempo */}
          <div className="timeline-container">
            <div className="timeline-line border-gold-brown" />

            <div className="timeline-items-wrapper">
              {invitationData?.itinerary.map((evento, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="timeline-item"
                >
                  {/* Punto central */}
                  <div className="timeline-dot bg-gold border-black" />

                  {/* Ícono */}
                  <div className="timeline-icon-box bg-black border-gold-semi">
                    {nameToAnyIcon(evento.icon)}
                  </div>

                  {/* Texto */}
                  <div>
                    <p className="timeline-time text-gold-pale-80">
                      {hoursTo12HourFormat(evento.time)}
                    </p>
                    <h3 className="timeline-event-title text-yellow-light">
                      {evento.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderCodigoVestimentaSection = () => {
    return (
      <section id="dress-code" className="section-container">
        <div className="section-bg-gradient" />
        <div className="section-bg-texture mix-blend-overlay" />
        <div className="content relative-z">
          <h3 className="section-title text-gold-pale">Vestimenta</h3>
          <img
            src={`${BASE_PATH}img/masquerade.png`}
            alt="Vestimenta Formal"
            className="dresscode-img drop-shadow-glow-red"
          />
          <p className="text-lg text-yellow-light text-center">
            Vestimenta formal requerida.
          </p>
          <p className="text-lg text-yellow-light text-center mt-2">
            No olvides tu máscara elegante para complementar tu atuendo.
          </p>
        </div>
      </section>
    );
  };

  const renderConfirmacionSection = () => {
    return (
      <>
        <section id="confirm" className="section-container">
          <div className="section-bg-gradient" />
          <div className="section-bg-texture mix-blend-overlay" />

          <div className="content relative-z">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="confirm-card"
            >
              <h3 className="section-title text-gold-pale">
                {nombreInvitado
                  ? "Invitación para:"
                  : "Confirmación de Asistencia"}
              </h3>

              {nombreInvitado && (
                <h4
                  className="mt-2 text-4xl text-gold font-semibold"
                  style={{
                    fontSize: "2.25rem",
                    marginTop: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  {nombreInvitado}
                </h4>
              )}
              <p className="mt-4 text-gray-light" style={{ marginTop: "1rem" }}>
                Solo puedes confirmar tu asistencia una vez. Por favor, haz clic
                en el botón de "Confirmar" para iniciar tu registro.
              </p>

              <div className="btn-group">
                <button
                  className="btn-gold"
                  onClick={() => setAbrirConfirmacion(!abrirConfirmacion)}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  {abrirConfirmacion
                    ? "Cerrar Confirmación"
                    : "Abrir Confirmación"}
                </button>
                <button className="btn-outline">Más información</button>
              </div>
              {abrirConfirmacion && (
                <motion.div
                  className="mt-8"
                  style={{ marginTop: "2rem" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {invitationData?.form.questions.map((field) => (
                    <div
                      key={field.id}
                      className="mb-4 text-left"
                      style={{ marginBottom: "1rem", textAlign: "left" }}
                    >
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-300"
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#d1d5db",
                        }}
                      >
                        {field.label}
                      </label>
                      {field.type == "text" && renderTextField(field)}
                      {field.type == "select" && renderSelectField(field)}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </>
    );
  };

  const renderTextField = (field) => {
    return (
      <input
        type={field.type}
        id={field.id}
        placeholder={field.help}
        className="form-input border-gray bg-gray-dark text-light focus-gold"
        required={true}
        value={valoresFormulario[field.name]}
        disabled={field.disabled}
        onChange={(e) =>
          setValoresFormulario({
            ...valoresFormulario,
            [field.name]: e.target.value,
          })
        }
      />
    );
  };

  const renderSelectField = (field) => {
    return (
      <select
        id={field.id}
        value={valoresFormulario[field.name]}
        onChange={(e) =>
          setValoresFormulario({
            ...valoresFormulario,
            [field.name]: e.target.value,
          })
        }
        className="form-select border-gray bg-gray-dark text-light focus-gold"
        required={true}
      >
        {field.options.map((option) => (
          <>
            <option value={""} disabled>
              {option.help}
            </option>
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          </>
        ))}
      </select>
    );
  };

  return (
    <div className="main-page-wrapper bg-black text-white">
      {loadingData && !musicLoaded ? (
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p className="loading-text text-gold-pale">Cargando invitación...</p>
        </div>
      ) : null}
      {invitationData && renderMusicSection()}

      {renderHomeSection()}

      {renderMessageSection()}
      {renderCounterSection()}
      {renderCardsUbicaciones()}
      {renderItinerarioSection()}

      {renderCodigoVestimentaSection()}
      {renderConfirmacionSection()}

      <footer className="footer-credits">
        Creada con ❤️ por Jesús Emanuel Salgado Lezama -{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
