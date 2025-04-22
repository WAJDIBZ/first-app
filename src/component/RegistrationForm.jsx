import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);

      // Check if the internship request exists and its status
      axios
        .get(`http://localhost:8081/registration/${storedUserId}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.situation === 1) {
              setStatusMessage({
                type: "success",
                text: "Votre demande de stage a été acceptée !",
              });
            } else if (response.data.situation === 0) {
              setStatusMessage({
                type: "error",
                text: "Votre demande de stage a été refusée.",
              });
            } else if (response.data.situation === 2) {
              setStatusMessage({
                type: "pending",
                text: "Votre demande de stage est en cours d'examen.",
              });
              // If we have existing data, load it into the form
              if (response.data.formData) {
                setFormData(response.data.formData);
                setFormSubmitted(true);
              }
            }
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de la situation :",
            error
          );
        });
    } else {
      setError("ID utilisateur introuvable. Veuillez vous connecter.");
      setTimeout(() => {
        navigate("/"); // Redirect if user is not logged in
      }, 1500);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("La date de début doit être antérieure à la date de fin.");
      return false;
    }

    if (formData.presenterVous.length < 50) {
      setError("Votre présentation doit contenir au moins 50 caractères.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("ID utilisateur introuvable. Veuillez vous connecter.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `http://localhost:8081/registration/${userId}`,
        formData
      );

      if (response.data.success) {
        setSuccess("Les données ont été enregistrées avec succès !");
        setFormSubmitted(true);

        // Check status immediately after submission
        const statusResponse = await axios.get(
          `http://localhost:8081/registration/${userId}`
        );
        if (statusResponse.data.success) {
          if (statusResponse.data.situation === 1) {
            setStatusMessage({
              type: "success",
              text: "Votre demande de stage a été acceptée !",
            });
          } else if (statusResponse.data.situation === 0) {
            setStatusMessage({
              type: "error",
              text: "Votre demande de stage a été refusée.",
            });
          } else if (statusResponse.data.situation === 2) {
            setStatusMessage({
              type: "pending",
              text: "Votre demande de stage est en cours d'examen.",
            });
          }
        }
      } else {
        setError(`Erreur : ${response.data.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setError(
        "Erreur lors de l'envoi des données. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    navigate("/");
  };

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      stageType: "",
      country: "",
      presenterVous: "",
      direction: "",
    });
    setFormSubmitted(false);
    setStatusMessage(null);
    setSuccess("");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-indigo-950 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 blur-3xl"></div>
      </div>

      {/* Header with nav */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-xl overflow-hidden mb-8 z-10">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3 shadow-md">
              <svg
                className="h-6 w-6 text-blue-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">
              Demande de Stage - Gestion des Stagiaires
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-white bg-blue-800 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Status message */}
      {statusMessage && (
        <div
          className={`max-w-4xl mx-auto w-full mb-6 p-4 rounded-lg shadow-md z-10 
          ${
            statusMessage.type === "success"
              ? "bg-green-50 border-l-4 border-green-500"
              : statusMessage.type === "error"
              ? "bg-red-50 border-l-4 border-red-500"
              : "bg-yellow-50 border-l-4 border-yellow-500"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 mr-3 ${
                statusMessage.type === "success"
                  ? "text-green-500"
                  : statusMessage.type === "error"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {statusMessage.type === "success" ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : statusMessage.type === "error" ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <p
              className={`text-sm font-medium ${
                statusMessage.type === "success"
                  ? "text-green-800"
                  : statusMessage.type === "error"
                  ? "text-red-800"
                  : "text-yellow-800"
              }`}
            >
              {statusMessage.text}
            </p>
            {formSubmitted && (
              <button
                onClick={resetForm}
                className="ml-auto text-sm bg-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                Nouvelle demande
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main form */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-xl overflow-hidden z-10">
        <div className="px-6 py-6 sm:px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Formulaire de demande de stage
          </h2>

          {/* Success/Error messages */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de début <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200"
                    required
                    disabled={loading || formSubmitted}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de fin <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200"
                    required
                    disabled={loading || formSubmitted}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="stageType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type de stage <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <select
                    id="stageType"
                    name="stageType"
                    value={formData.stageType}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200 appearance-none"
                    required
                    disabled={loading || formSubmitted}
                  >
                    <option value="" hidden>
                      Sélectionnez un type
                    </option>
                    <option value="initiation">Initiation</option>
                    <option value="perfectionnement">Perfectionnement</option>
                    <option value="PFE">Projet de Fin d'Études (PFE)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pays <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200"
                    placeholder="Votre pays"
                    required
                    disabled={loading || formSubmitted}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="presenterVous"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Présentez-vous <span className="text-red-500">*</span>
                <span className="ml-1 text-xs text-gray-500">
                  (minimum 50 caractères)
                </span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <textarea
                  id="presenterVous"
                  name="presenterVous"
                  value={formData.presenterVous}
                  onChange={handleChange}
                  rows={5}
                  className="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200"
                  placeholder="Parlez de vos études, vos compétences, vos motivations pour ce stage..."
                  required
                  disabled={loading || formSubmitted}
                ></textarea>
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {formData.presenterVous.length} caractères
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="direction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Direction <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="direction"
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3 transition-all duration-200"
                  placeholder="Direction ou département souhaité pour le stage"
                  required
                  disabled={loading || formSubmitted}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading || formSubmitted}
                className={`${
                  formSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800"
                } relative w-full md:w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-lg transition-all duration-300 ease-in-out`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : formSubmitted ? (
                  <span className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Formulaire soumis
                  </span>
                ) : (
                  <span className="transition-all duration-300">
                    Soumettre ma demande
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 max-w-4xl mx-auto w-full text-center z-10">
        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} Gestion des Stagiaires. Tous droits
          réservés.
        </p>
        <p className="text-xs text-blue-200">
          Développé par aziz louati
        </p>
        </div>
        </div>
    );
}
export default RegistrationForm;