export default function ControllerForm({ setStep, steps, setSessionId, setPhotos, setCapturedIds, capturedIds, name, setName, contact, setContact, totalPhotos, setTotalPhotos, crearSesion, cargarFotos }) {
    return (
        <div className="confirm-card" style={{ width: "100%" }}>
              <h3 className="section-title text-gold-pale">
                ¡Hora de las fotos!
              </h3>
              <p>Asegurate de estar en la zona de fotos</p>
              <p className="mt-4 mb-4 text-gray-light">
                Para identificarte, escribe tu nombre o el de tu familia
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  crearSesion();
                }}
              >
                <input
                  className="booth-input"
                  placeholder="Nombre / Familia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={true}
                />
                <input
                  className="booth-input"
                  placeholder="Email (opcional)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <select
                  className="booth-input"
                  placeholder="Numero de fotos"
                  value={totalPhotos}
                  onChange={(e) => setTotalPhotos(Number(e.target.value))}
                  type="select"
                >
                  {[3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "foto" : "fotos"}
                    </option>
                  ))}
                </select>
                <button className="booth-btn" type="submit">
                  Iniciar sesión de fotos
                </button>
              </form>

              {capturedIds.length > 0 && (
                <p className="mt-4">Sesiones guardadas:</p>
              )}
              {capturedIds.length > 0 && (
                <div className="session-list">
                  {capturedIds.map((id, i) => (
                    <button
                      key={id}
                      className="session-chip"
                      onClick={() => cargarFotos(id)}
                    >
                      Sesión #{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
    )
}