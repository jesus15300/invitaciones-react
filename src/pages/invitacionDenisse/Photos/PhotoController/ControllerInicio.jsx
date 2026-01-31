export default function ControllerInicio({ setStep, steps, BASE_PATH }) {
    return (
        <>
            <div className="confirm-card" style={{ width: "100%" }}>
              <div className="icon-container">
                {/*  local svg */}
                <img
                  src={`${BASE_PATH}icons/tripod.png`}
                  alt="camera icon"
                  className="icon-image"
                />
              </div>
              <h1 className="section-title text-gold-pale">Sesion de fotos</h1>
              <p className="text-gray-light mb-4">¡Iniciar sesion de fotos!</p>
              <button className="booth-btn" onClick={() => setStep(steps.FORM)}>
                Ir
              </button>
            </div>
            <div className="confirm-card mt-5" style={{ width: "100%" }}>
              <div className="icon-container">
                {/*  local svg */}
                <img
                  src={`${BASE_PATH}icons/image-gallery.png`}
                  alt="camera icon"
                  className="icon-image"
                />
              </div>
              <h1 className="section-title text-gold-pale">Galeria</h1>
              <p className="text-gray-light mb-4">
                Visualiza la galeria de la fiesta
              </p>
              <button className="booth-btn" onClick={() => setStep(steps.TODA_GALERIA)}>
                Ir
              </button>
            </div>
          </>
    )
}