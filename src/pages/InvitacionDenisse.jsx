import React, { useState, useRef, useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import ReactHowler from "react-howler";
import {
  FaGlassCheers,
  FaMusic,
  FaBirthdayCake,
  FaMoon,
  FaSuitcase,
  FaTshirt,
} from "react-icons/fa";

// Nota: Este archivo asume que usas TailwindCSS en el proyecto.
// Coloca un archivo de audio en public/music/valz.mp3 (o cambia la ruta).

export default function InvitacionXV() {
  const BASE_PATH = import.meta.env.BASE_URL;
  const [playing, setPlaying] = useState(false);
  const howlerRef = useRef(null);

  const { scrollY } = useViewportScroll();
  // Parallax: a medida que el usuario hace scroll el background se mueve sutilmente
  const backgroundY = useTransform(scrollY, [0, 800], [0, -120]);
  const maskScale = useTransform(scrollY, [0, 800], [1, 1.5]);

  const toggleMusic = () => setPlaying((p) => !p);

  const nombreInvitado = new URLSearchParams(window.location.search).get(
    "invitado"
  );

  //obtener de query param ?nombre=Denisse

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
      setTiempoRestante({ dias, horas, minutos, segundos });
    };

    const timer = setInterval(actualizarTiempo, 1000);
    return () => clearInterval(timer);
  }, [fechaEvento]);

  const eventos = [
    {
      hora: "7:30 PM",
      icono: <FaGlassCheers className="w-6 h-6 text-yellow-400" />,
      titulo: "Recepción de invitados",
    },
    {
      hora: "8:00 PM",
      icono: <FaMusic className="w-6 h-6 text-yellow-400" />,
      titulo: "Vals de Denisse",
    },
    {
      hora: "8:30 PM",
      icono: <FaBirthdayCake className="w-6 h-6 text-yellow-400" />,
      titulo: "Cena y brindis",
    },
    {
      hora: "9:30 PM",
      icono: <FaMusic className="w-6 h-6 text-yellow-400" />,
      titulo: "Invitado especial y baile",
    },
    {
      hora: "12:00 AM",
      icono: <FaMoon className="w-6 h-6 text-yellow-400" />,
      titulo: "Cierre del evento",
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

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* Música (oculto) */}
      <ReactHowler
        src={["/music/valz.mp3"]}
        playing={playing}
        ref={howlerRef}
        loop={true}
        volume={0.6}
      />

      {/* Botón de música */}
      <button
        onClick={toggleMusic}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        className="fixed z-50 top-6 right-6 bg-black/60 backdrop-blur-sm border border-yellow-300 text-yellow-300 px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
        <span className="text-sm font-semibold">
          {playing ? "Pausar" : "Música"}
        </span>
      </button>

      {/* Main hero / intro */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Fondo animado: terciopelo rojo con brillo dorado */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#2b0000] via-[#4a0000] to-[#120000]" />

          {/* overlay de textura (usa blend para efecto elegante) */}
          <div
            className="absolute inset-0 mix-blend-overlay opacity-80"
            style={{
              backgroundImage:
                "url(https://images.freecreatives.com/wp-content/uploads/2016/07/Dark-Purple-Velvet-Texture1.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          

          {/* brillo dorado animado */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 10% 20%, rgba(255,215,100,0.08), transparent 8%), radial-gradient(circle at 80% 80%, rgba(255,215,100,0.06), transparent 12%)",
              }}
            />

            {/* partículas doradas sutiles creadas con CSS */}
            <div className="absolute inset-0 opacity-70 pointer-events-none">
              <div className="gold-particles" />
            </div>
          </div>
          <motion.div className="absolute inset-0 pointer-events-none flex flex-wrap items-start p-4">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-yellow-300 rounded-full shadow-lg opacity-80 m-2"
                initial={{ y: -50, x: Math.random() * 500 }}
                animate={{ y: 800 }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Contenido de inicio */}
        <motion.div
          style={{ scale: maskScale }}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative z-20 flex flex-col items-center text-center px-6"
        >
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="w-72 max-w-xs sm:max-w-sm lg:w-96"
          >
            {/* imagen de denisse (tamaño Tailwind válido) */}
            <img
              className="w-48 h-48 rounded-full mx-auto object-cover shadow-2xl border-8 border-red-700/70 shadow-4xl shadow-black/50"
              src={`${BASE_PATH}img/denisse-perfil.jpg`}
              alt="Profile picture"
            />
          </motion.div>

          {/* Texto principal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-6 text-center"
          >
            <div className="uppercase tracking-wider text-yellow-300 text-sm">
              Baile de Máscaras
            </div>
            <motion.h1
              initial={{ y: 20, opacity: 1 }}
              // Animación sutil y continua sin desaparecer
              animate={{ y: [-15, 0] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#f6e6c8] drop-shadow-lg mt-2 will-change-transform"
            >
              Denisse Salgado
            </motion.h1>
            <p className="mt-3 text-yellow-100/80">
              Mis XV Años — {fechaEvento.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {/* indicador de 'Desliza' con flecha en circulo */}
            <div className="mt-4 pt-8">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="border-b-2 border-yellow-100/80 w-6 mx-auto mb-1" />
                <p className="text-yellow-100/80">Desliza hacia abajo</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Fade bottom */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" /> */}
      </section>

      {/* Información del evento: scroll reveals */}
      <main className="relative z-10">
        <section className="flex items-center justify-center min-h-[70vh] px-0 pb-0">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9 }}
              className="bg-red-900 p-8 border border-8 border-yellow-700 shadow-2xl max-w-[600px] m-6 rounded-2xl"
            >
              {/* <h2 className="text-2xl text-yellow-200 font-semibold">
                !V!
              </h2> */}
              <p className="my-16 text-gray-200 text-xl text-center">
                Te invito a celebrar el inicio de una nueva etapa en mi vida.
                Llena de sueños, metas y nuevas experiencias.
              </p>
            </motion.div>

            {/* Imagen de fondo con texto que 
            aparezca cuando se muestre en el viewport*/}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9 }}
              className=""
            >
              <div
                style={{
                  backgroundImage: `url(${BASE_PATH}img/imagen-denisse.jpg)`,
                  filter: "brightness(0.8)",
                }}
                className=" h-screen overflow-hidden shadow-inner bg-cover bg-top w-[100%] max-w-[600px] mx-auto rounded-3xl relative flex flex-col justify-end"
              >
                {/* contador con días, horas, minutos y segundos anclado al fondo */}
                <div className="p-16 bg-gradient-to-b from-transparent to-black/40 justify-end items-center h-full flex flex-col">
                  <h3 className="text-4xl text-yellow-200">Faltan</h3>
                  <div className="mt-4 flex gap-6 text-center">
                    <div className="flex flex-col">
                      <span className="text-2xl text-yellow-300">
                        {tiempoRestante.dias}
                      </span>
                      <span className="text-sm text-gray-200">Días</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl text-yellow-300">
                        {tiempoRestante.horas}
                      </span>
                      <span className="text-sm text-gray-200">Horas</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl text-yellow-300">
                        {tiempoRestante.minutos}
                      </span>
                      <span className="text-sm text-gray-200">Minutos</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl text-yellow-300">
                        {tiempoRestante.segundos}
                      </span>
                      <span className="text-sm text-gray-200">Segundos</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* tarjeta con imagen / mapa estilizado */}

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9 }}
              className="p-4 mt-12 relative"
            >
              {/* Fondo */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#120000] via-[#4a0000] to-[#120000]" />
              <div
                className="absolute inset-0 mix-blend-overlay opacity-80 z-0"
                style={{
                  backgroundImage:
                    "url(https://images.freecreatives.com/wp-content/uploads/2016/07/Dark-Purple-Velvet-Texture1.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10 max-w-3xl mx-auto px-6">
                <h3 className="text-4xl text-yellow-200 text-center pb-8 ">
                  Dónde y cuándo
                </h3>

                {/* card de iglesia */}
                <div className="rounded-2xl overflow-hidden border border-2 border-red-900/60 shadow-inner mb-8">
                  <div
                    className="h-64 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url(https://i.pinimg.com/originals/46/da/b9/46dab93a3de47358bbba3ada67715311.jpg)",
                    }}
                  />
                  <div className="p-6 bg-gradient-to-t from-black/40 to-transparent border border border-yellow-900/20">
                    <h4 className="text-md text-yellow-300 mt-1">
                      Parroquia San Juan Bautista
                    </h4>
                    <p className="text-sm text-gray-200 mt-2">
                      Vicente Guerrero, Cuauhtémoc 285, 73784 Libres, Puebla
                    </p>
                    <p className="text-sm text-gray-200 mt-1">A las 5:00 PM</p>
                    <div className="mt-6">
                      <a
                        href="#confirm"
                        className="inline-block mt-2 px-5 py-3 bg-yellow-300 text-black rounded-full font-semibold shadow"
                      >
                        Ver en mapa
                      </a>
                    </div>
                  </div>
                </div>

                {/* card de Salon */}
                <div className="rounded-2xl overflow-hidden border border-2 border-red-900/60 shadow-inner mb-8">
                  <div
                    className="h-64 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url(https://cdn0.bodas.com.mx/vendor/1378/3_2/960/jpg/el-encanto-3_5_311378-167213240558574.webp)",
                    }}
                  />
                  <div className="p-6 bg-gradient-to-t from-black/40 to-transparent">
                    <h3 className="text-lg text-yellow-300 mt-1">
                      Salón de Fiestas "El Encanto"
                    </h3>
                    <p className="text-sm text-gray-200 mt-2">
                      Vicente Guerrero, Cuauhtémoc 285, 73784 Libres, Puebla
                    </p>
                    <p className="text-sm text-gray-200 mt-1">A las 5:00 PM</p>
                    <div className="mt-6">
                      <a
                        href="#confirm"
                        className="inline-block mt-2 px-5 py-3 bg-yellow-300 text-black rounded-full font-semibold shadow"
                      >
                        Ver en mapa
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seccion de itinerario con linea de tiempo vertical y hora */}
            <section className="relative text-red-100 py-20">
              {/* Fondo */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#120000] via-[#4a0000] to-[#120000]" />
              <div
                className="absolute inset-0 mix-blend-overlay opacity-80"
                style={{
                  backgroundImage:
                    "url(https://images.freecreatives.com/wp-content/uploads/2016/07/Dark-Purple-Velvet-Texture1.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Contenido */}
              <div className="relative max-w-3xl mx-auto px-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl font-serif text-center text-yellow-300 mb-12"
                >
                  Itinerario del Evento
                </motion.h2>

                {/* Línea central */}
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-yellow-800/60" />

                  <div className="space-y-10">
                    {eventos.map((evento, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className={`relative flex flex-col items-center text-center`}
                      >
                        {/* Punto en la línea */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-yellow-400 rounded-full border-4 border-black shadow-lg" />

                        {/* Ícono */}
                        <div className="bg-black border border-yellow-700/50 p-3 rounded-full shadow-md mb-3">
                          {evento.icono}
                        </div>

                        {/* Contenido */}
                        <div>
                          <p className="text-sm text-yellow-200/80">
                            {evento.hora}
                          </p>
                          <h3 className="text-lg font-semibold text-yellow-100 mt-1">
                            {evento.titulo}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* codigo de Vestimenta formal */}
        <section
          id="dress-code"
          className="min-h-[60vh] flex items-center justify-center px-6 pb-28"
        >
          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <h3 className="text-4xl text-yellow-200 text-center pb-8 ">
              Vestimenta
            </h3>
            <img
              src={`${BASE_PATH}img/masquerade.png`}
              alt="Vestimenta Formal"
              className="mx-auto mb-6 w-48 h-48 object-contain"
              style={{ filter: "drop-shadow(0 0 48px rgba(241, 40, 40, 0.9))" }}
            />
            <p className="text-lg text-yellow-100 text-center">
              Vestimenta formal requerida.
            </p>
            <p className="text-lg text-yellow-100 text-center mt-2">
              No olvides tu máscara elegante para complementar tu atuendo.
            </p>
          </div>
        </section>

        {/* Confirmación / QR (sección simple) */}
        <section
          id="confirm"
          className="min-h-[60vh] flex items-center justify-center px-6 pb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl w-full bg-black/60 border border-yellow-900 rounded-3xl p-10 text-center"
          >
            <h3 className="text-2xl text-yellow-200 font-semibold">
              {nombreInvitado
                ? "Invitacion para:"
                : "Confirmación de Asistencia"}
            </h3>
            {nombreInvitado && (
              <h4 className="mt-2 text-4xl text-yellow-300 font-semibold">
                {nombreInvitado}
              </h4>
            )}
            <p className="mt-4 text-gray-300">
              Solo puedes confirmar tu asistencia una vez. Por favor, haz clic
              en el botón de "Confirmar" para iniciar tu registro.
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-5 py-3 rounded-full bg-yellow-300 text-black font-semibold"
                onClick={() => setAbrirConfirmacion(!abrirConfirmacion)}
              >
                {abrirConfirmacion
                  ? "Cerrar Confirmación"
                  : "Abrir Confirmación"}
              </button>
              <button className="px-5 py-3 rounded-full bg-transparent border border-yellow-300 text-yellow-300">
                Más información
              </button>
            </div>
            {abrirConfirmacion && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {camposFormulario.map((campo) => (
                  <div key={campo.id} className="mb-4 text-left">
                    <label
                      htmlFor={campo.id}
                      className="block text-sm font-medium text-gray-300"
                    >
                      {campo.label}
                    </label>
                    {campo.tipo == "text" && (
                      <input
                        type={campo.tipo}
                        id={campo.id}
                        placeholder={campo.placeholder}
                        className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-500 focus:border-yellow-300 focus:ring focus:ring-yellow-300 disabled:opacity-50"
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
                    )}
                    {campo.tipo == "select" && (
                      <select
                        id={campo.id}
                        value={valoresFormulario[campo.id]}
                        onChange={(e) =>
                          setValoresFormulario({
                            ...valoresFormulario,
                            [campo.id]: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-500 focus:border-yellow-300 focus:ring focus:ring-yellow-300"
                        required={true}
                      >
                        {campo.opciones.map((opcion) => (
                          <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>

        <footer className="py-12 text-center text-sm text-gray-500">
          Creada con ❤️ por Jesús Emanuel Salgado Lezama -{" "}
          {new Date().getFullYear()}
        </footer>
      </main>

      {/* CSS en componente: partículas doradas y tipografías */}
      <style>{`
        /* Partículas doradas (sutiles) */
        .gold-particles {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,215,100,1) 0.6px, transparent 1px);
          background-size: 18px 18px;
          opacity: 0.06;
          animation: drift 14s linear infinite;
          will-change: transform;
        }

        @keyframes drift {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-30px) translateX(18px) rotate(1deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }

        /* Fuentes elegantes: si usas Tailwind, agrégalas en index.html con Google Fonts */
        .font-serif { font-family: 'Playfair Display', serif; }

      `}</style>
    </div>
  );
}
