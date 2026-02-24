import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [gyartok, setGyartok] = useState([]);
  const [mobilok, setMobilok] = useState([]);
  const [editingMobil, setEditingMobil] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchGyartok = async () => {
      const response = await fetch(`${API_URL}/api/gyartok`);
      const gyartok = await response.json();
      console.log("Gyártók:", gyartok);
      setGyartok(gyartok);
    };
    fetchGyartok();

    const fetchMobiles = async () => {
      const response = await fetch(`${API_URL}/api/mobilok`);
      const mobilok = await response.json();
      console.log("Mobilok:", mobilok);
      setMobilok(mobilok);
    };
    fetchMobiles();
  }, []);

  console.log(gyartok);

  const componentDidMount = async (obj) => {
    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    };
    const response = await fetch(`${API_URL}/api/mobilok`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      alert("Hiba történt az adatfelvétel során: " + (data.message || response.status));
      return;
    }
    console.log(data);
    alert("Sikeres adatfelvétel");
    // Újra betöltjük a mobilok listáját
    const fetchMobiles = async () => {
      const response = await fetch(`${API_URL}/api/mobilok`);
      const mobilok = await response.json();
      setMobilok(mobilok);
    };
    fetchMobiles();
  }

  const deleteMobil = async (id) => {
    if (window.confirm("Biztosan törli ezt a mobiltelefont?")) {
      try {
        const response = await fetch(`${API_URL}/api/mobilok/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          alert("Hiba történt a törlés során");
          return;
        }
        
        alert("Mobiltelefon sikeresen törölve");
        // Frissítjük a listát
        const fetchMobiles = async () => {
          const response = await fetch(`${API_URL}/api/mobilok`);
          const mobilok = await response.json();
          console.log("Mobilok:", mobilok);
          setMobilok(mobilok);
        };
        fetchMobiles();
      } catch (error) {
        console.error("Hiba a törlés során:", error);
        alert("Hiba történt a törlés során");
      }
    }
  }

  const openEditModal = (mobil) => {
    setEditingMobil({ ...mobil });
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setEditingMobil(null);
  }

  const updateMobil = async () => {
    if (!editingMobil._id || !editingMobil.nev || !editingMobil.ar) {
      alert("Kérjük, töltse ki az összes mezőt");
      return;
    }

    const gyartIdValue = typeof editingMobil.gyartId === 'object' 
      ? editingMobil.gyartId._id 
      : editingMobil.gyartId;

    if (!gyartIdValue) {
      alert("Kérjük, válasszon egy gyártót");
      return;
    }

    try {
      const updateData = {
        nev: editingMobil.nev,
        ar: editingMobil.ar,
        gyartId: gyartIdValue
      };

      console.log("Módosítási kérés adatai:", updateData);

      const response = await fetch(`${API_URL}/api/mobilok/${editingMobil._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const responseText = await response.text();
      console.log("API válasz:", responseText);
      console.log("Status kód:", response.status);

      if (!response.ok) {
        alert("Hiba történt a módosítás során: " + responseText);
        return;
      }

      const data = JSON.parse(responseText);
      console.log(data);
      alert("Telefon sikeresen módosítva");
      closeModal();
      
      // Frissítjük a listát
      const fetchMobiles = async () => {
        const response = await fetch(`${API_URL}/api/mobilok`);
        const mobilok = await response.json();
        console.log("Mobilok:", mobilok);
        setMobilok(mobilok);
      };
      fetchMobiles();
    } catch (error) {
      console.error("Hiba a módosítás során:", error);
      alert("Hiba történt a módosítás során: " + error.message);
    }
  }
  return (
    <>
      <div className="d-flex justify-content-center pt-5">
        <div style={{ width: "100%", maxWidth: "500px", padding: "30px" }}>
          <h2 className="text-center mb-4 text-white" style={{ backgroundColor: "#667eea", padding: "20px", borderRadius: "10px 10px 0 0" }}>Mobiltelefon Felvétel</h2>
          <Formik
            initialValues={{ _id: "", nev: "", ar: "", gyartId: "" }}
            validate={(values) => {
              const errors = {};
              if (!values._id) {
                errors._id = "Kötelező kitölteni";
              }
              if (!values.nev) {
                errors.nev = "Kötelező kitölteni";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log("Form data", values);
              await componentDidMount(values);
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="p-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "0 0 10px 10px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}>
                <div className="mb-3">
                  <label htmlFor="_id" className="form-label">ID: </label>
                  <Field type="text" name="_id" placeholder="Adjon meg egy egyedi ID-t" className="form-control" />
                  <ErrorMessage name="_id" component="div" className="text-danger mt-2" />
                </div>
                <div className="mb-3">
                  <label htmlFor="nev" className="form-label">Telefon Neve: </label>
                  <Field type="text" name="nev" placeholder="pl. iPhone 15 Pro" className="form-control" />
                  <ErrorMessage name="nev" component="div" className="text-danger mt-2" />
                </div>
                <div className="mb-3">
                  <label htmlFor="ar" className="form-label">Ár (Ft): </label>
                  <Field type="text" name="ar" placeholder="pl. 500000" className="form-control" />
                  <ErrorMessage name="ar" component="div" className="text-danger mt-2" />
                </div>
                <div className="mb-3">
                  <label htmlFor="gyartId" className="form-label">Gyártó: </label>
                  <Field name="gyartId" as="select" className="form-select">
                    <option value="">-- Válasszon gyártót --</option>
                    {gyartok.map((gyarto) => (
                      <option key={gyarto._id} value={gyarto._id}>{gyarto.nev}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="gyartId" component="div" className="text-danger mt-2" />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 fw-bold">
                  {isSubmitting ? "Feldolgozás..." : "Hozzáadás"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <h2 className="mb-4">Mobilok Listája</h2>
        <div className="row g-4">
          {mobilok && mobilok.length > 0 ? (
            mobilok.map((telefon) => {
              return (
                <div key={telefon._id} className="col-md-4 col-sm-6 col-12">
                  <div className="card h-100 shadow-sm" style={{ borderTop: "4px solid #667eea" }}>
                    <div className="card-body">
                      <h5 className="card-title text-primary">{telefon.nev}</h5>
                      <p className="card-text mb-2">
                        <strong>ID:</strong> {telefon._id}
                      </p>
                      <p className="card-text mb-2">
                        <strong>Ár:</strong> <span className="text-success fw-bold">{telefon.ar} Ft</span>
                      </p>
                      <p className="card-text mb-0">
                        <strong>Gyártó:</strong> {telefon.gyartId ? telefon.gyartId.nev : "Ismeretlen"}
                      </p>
                      <div className="d-flex gap-2 mt-3">
                        <button 
                          className="btn btn-warning btn-sm flex-grow-1"
                          onClick={() => openEditModal(telefon)}
                        >
                          Módosítás
                        </button>
                        <button 
                          className="btn btn-danger btn-sm flex-grow-1"
                          onClick={() => deleteMobil(telefon._id)}
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">Nincsenek telefonok az adatbázisban</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal a módosításhoz */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Telefon módosítása</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {editingMobil && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">ID:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingMobil._id}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mobiltelefon Neve:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingMobil.nev}
                        onChange={(e) => setEditingMobil({...editingMobil, nev: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ár (Ft):</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingMobil.ar}
                        onChange={(e) => setEditingMobil({...editingMobil, ar: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gyártó:</label>
                      <select 
                        className="form-select"
                        value={editingMobil.gyartId._id || editingMobil.gyartId}
                        onChange={(e) => {
                          const selectedGyarto = gyartok.find(g => g._id === e.target.value);
                          setEditingMobil({...editingMobil, gyartId: selectedGyarto || e.target.value});
                        }}
                      >
                        <option value="">-- Válasszon gyártót --</option>
                        {gyartok.map((gyarto) => (
                          <option key={gyarto._id} value={gyarto._id}>{gyarto.nev}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                >
                  Mégse
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={updateMobil}
                >
                  Mentés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
