import React, { useState, useRef, useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import ReactHowler from "react-howler";
import { FaGlassCheers, FaMusic, FaBirthdayCake, FaMoon } from "react-icons/fa";
import "./invitacionDenisse.styles.css";

export default function InvitacionXV() {
  const BASE_PATH = import.meta.env.BASE_URL || "";
  const [playing, setPlaying] = useState(false);
  const howlerRef = useRef(null);

  const { scrollY } = useViewportScroll();
  
  const backgroundY = useTransform(scrollY, [0, 800], [0, -120]);
  const maskScale = useTransform(scrollY, [0, 800], [1, 1.5]);

  const toggleMusic = () => setPlaying((p) => !p);

  const nombreInvitado = new URLSearchParams(window.location.search).get(
    "invitado"
  );

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

  const eventos = [
    {
      hora: "7:30 PM",
      icono: <FaGlassCheers className="icon-gold" />,
      titulo: "Recepción de invitados",
    },
    {
      hora: "8:00 PM",
      icono: <FaMusic className="icon-gold" />,
      titulo: "Vals de Denisse",
    },
    {
      hora: "8:30 PM",
      icono: <FaBirthdayCake className="icon-gold" />,
      titulo: "Cena y brindis",
    },
    {
      hora: "9:30 PM",
      icono: <FaMusic className="icon-gold" />,
      titulo: "Invitado especial y baile",
    },
    {
      hora: "12:00 AM",
      icono: <FaMoon className="icon-gold" />,
      titulo: "Cierre del evento",
    },
  ];

  const ubicaciones = [
    {
      imgUrl:
        "https://i.pinimg.com/originals/46/da/b9/46dab93a3de47358bbba3ada67715311.jpg",
      nombre: "Parroquia San Juan Bautista",
      direccion: "Vicente Guerrero, Cuauhtémoc 285, 73784 Libres, Puebla",
      hora: "3:00 PM",
      mapaUrl: "https://goo.gl/maps/example1",
    },
    {
      imgUrl:
        "https://cdn0.bodas.com.mx/vendor/1378/3_2/960/jpg/el-encanto-3_5_311378-167213240558574.webp",
      nombre: "Salón de Fiestas El Encanto",
      direccion: "",
      hora: "4:00 PM",
      mapaUrl: "https://goo.gl/maps/example2",
    },
  ];

  const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);

  const camposFormulario = [
    {
      id: "nombre",
      label: "Nombre",
      tipo: "text",
      disabled: !!nombreInvitado,
      placeholder: "Ingresa tu nombre",
    },
    {
      id: "asistencia",
      label: "Asistencia",
      tipo: "select",
      opciones: [
        { value: "confirmado", label: "Confirmado" },
        { value: "pendiente", label: "Pendiente" },
        { value: "rechazado", label: "Rechazado" },
      ],
    },
  ];

  const [valoresFormulario, setValoresFormulario] = useState({
    nombre: nombreInvitado || "",
    asistencia: "confirmado",
  });

  /* ================= RENDERS ================= */

  const renderMusicSection = () => {
    return (
      <>
        <ReactHowler
          src={["/music/valz.mp3"]}
          playing={playing}
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

          {ubicaciones.map((ubicacion, index) => (
            <div key={index} className="location-card border-red-transparent">
              <div
                className="location-image"
                style={{ backgroundImage: `url(${ubicacion.imgUrl})` }}
              />
              <div className="location-info-overlay border-gold-faint">
                <h4 className="location-name text-gold">{ubicacion.nombre}</h4>
                <p className="location-address text-gray-light">
                  {ubicacion.direccion}
                </p>
                <p className="location-time text-gray-light">
                  A las {ubicacion.hora}
                </p>
                <div className="location-cta-wrapper">
                  <a
                    href={ubicacion.mapaUrl}
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
              {eventos.map((evento, index) => (
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
                    {evento.icono}
                  </div>

                  {/* Texto */}
                  <div>
                    <p className="timeline-time text-gold-pale-80">
                      {evento.hora}
                    </p>
                    <h3 className="timeline-event-title text-yellow-light">
                      {evento.titulo}
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
                  {camposFormulario.map((campo) => (
                    <div
                      key={campo.id}
                      className="mb-4 text-left"
                      style={{ marginBottom: "1rem", textAlign: "left" }}
                    >
                      <label
                        htmlFor={campo.id}
                        className="block text-sm font-medium text-gray-300"
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#d1d5db",
                        }}
                      >
                        {campo.label}
                      </label>
                      {campo.tipo == "text" && renderTextField(campo)}
                      {campo.tipo == "select" && renderSelectField(campo)}
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

  const renderTextField = (campo) => {
    return (
      <input
        type={campo.tipo}
        id={campo.id}
        placeholder={campo.placeholder}
        className="form-input border-gray bg-gray-dark text-light focus-gold"
        required={true}
        value={valoresFormulario[campo.id]}
        disabled={campo.disabled}
        onChange={(e) =>
          setValoresFormulario({
            ...valoresFormulario,
            [campo.id]: e.target.value,
          })
        }
      />
    );
  };

  const renderSelectField = (campo) => {
    return (
      <select
        id={campo.id}
        value={valoresFormulario[campo.id]}
        onChange={(e) =>
          setValoresFormulario({
            ...valoresFormulario,
            [campo.id]: e.target.value,
          })
        }
        className="form-select border-gray bg-gray-dark text-light focus-gold"
        required={true}
      >
        {campo.opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="main-page-wrapper bg-black text-white">
      {renderMusicSection()}

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
