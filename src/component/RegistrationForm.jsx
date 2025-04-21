import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import axios from "axios";


const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        stageType: "",
        country: "",
        presenterVous: "",
        direction: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); // Hook pour la navigation

    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
        if (storedUserId) {
            setUserId(storedUserId);
    
            // Vérifier si la demande existe et son état
            axios.get(`http://localhost:8081/registration/${storedUserId}`)
                .then(response => {
                    if (response.data.success) {
                        if (response.data.situation === 1) {
                            alert("✅ Votre demande de stage a été acceptée !");
                        } else if (response.data.situation === 0) {
                            alert("❌ Votre demande de stage a été refusée.");
                        }
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de la situation :", error);
                });
    
        } else {
            setError("ID utilisateur introuvable. Veuillez vous connecter.");
            navigate("/"); // Redirection si l'utilisateur n'est pas connecté
        }
    }, [navigate]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert("ID utilisateur introuvable. Veuillez vous connecter.");
            return;
        }
    
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            alert("⛔ La date de début doit être antérieure à la date de fin.");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.post(
                `http://localhost:8081/registration/${userId}`,
                formData
            );
    
            if (response.data.success) {
                alert("✅ Les données ont été enregistrées avec succès !");
    
                // Vérifier immédiatement la situation après enregistrement
                const statusResponse = await axios.get(`http://localhost:8081/registration/${userId}`);
                if (statusResponse.data.success) {
                    if (statusResponse.data.situation === 1) {
                        alert("✅ Votre demande de stage a été acceptée !");
                    } else if (statusResponse.data.situation === 0) {
                        alert("❌ Votre demande de stage a été refusée.");
                    }
                }
                
                // Réinitialiser le formulaire après soumission
                setFormData({
                    startDate: "",
                    endDate: "",
                    stageType: "",
                    country: "",
                    presenterVous: "",
                    direction: "",
                });
            } else {
                setError(`Erreur : ${response.data.message}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setError("⛔ Erreur lors de l'envoi des données. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleLogout = () => {
        localStorage.removeItem("user_id"); // Supprimer l'ID utilisateur
        navigate("/"); // Rediriger vers la page de connexion
    };

    return (
        <div className="">
            <header>
                Formulaire d'inscription
                
            </header>
            <form className="" onSubmit={handleSubmit}>
                <div className="input-box">
                    <label>Date de début</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="input-box">
                    <label>Date de fin</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="input-box">
                    <label>Type de stage</label>
                    <select
                        name="stageType"
                        value={formData.stageType}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="" hidden>
                            Sélectionnez un type
                        </option>
                        <option value="initiation">Initiation</option>
                        <option value="perfectionnement">Perfectionnement</option>
                        <option value="PFE">PFE</option>
                    </select>
                </div>
                <div className="input-box">
                    <label>Pays</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Votre pays"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="input-box">
                    <label>Présentez-vous</label>
                    <textarea
                        name="presenterVous"
                        value={formData.presenterVous}
                        onChange={handleChange}
                        placeholder="Parlez de vous..."
                        required
                        disabled={loading}
                    ></textarea>
                </div>
                <div className="input-box">
                    <label>Direction</label>
                    <input
                        type="text"
                        name="direction"
                        value={formData.direction}
                        onChange={handleChange}
                        placeholder="Direction du stage"
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Envoyer"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                
            </form>
            <button className="logout-button" onClick={handleLogout}>
                    Déconnexion
                </button>
        </div>
    );
};

export default RegistrationForm;
