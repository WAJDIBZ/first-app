import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert

const SignUp = () => {
  const [values, setValues] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    mdp: "",
    confirmerMdp: "",
    sexe: "",
    dateNaissance: "",
    classe: "",
    specialite: "",
    faculte: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Check for required fields
    if (
      !values.id ||
      !values.nom ||
      !values.prenom ||
      !values.email ||
      !values.tel ||
      !values.mdp ||
      !values.confirmerMdp ||
      !values.sexe ||
      !values.dateNaissance ||
      !values.classe ||
      !values.specialite ||
      !values.faculte
    ) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Tous les champs sont obligatoires.",
      });
      setLoading(false);
      return;
    }

    // Check password confirmation
    if (values.mdp !== values.confirmerMdp) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas.",
      });
      setLoading(false);
      return;
    }

    // Send data to backend
    axios
      .post("http://localhost:8081/signup", values)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Étudiant ajouté avec succès !",
        });
        setValues({
          id: "",
          nom: "",
          prenom: "",
          email: "",
          tel: "",
          mdp: "",
          confirmerMdp: "",
          sexe: "",
          dateNaissance: "",
          classe: "",
          specialite: "",
          faculte: "",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de l'ajout de l'étudiant.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center bg-white rounded-full p-3 mb-4">
            <svg
              className="h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Gestion des Stagiaires
          </h2>
          <p className="mt-2 text-blue-100">Créez votre compte</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informations Personnelles
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Identifiant
                    </label>
                    <input
                      type="text"
                      name="id"
                      id="id"
                      value={values.id}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nom"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      id="nom"
                      value={values.nom}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="prenom"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      id="prenom"
                      value={values.prenom}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="tel"
                      id="tel"
                      value={values.tel}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateNaissance"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date de Naissance
                    </label>
                    <input
                      type="date"
                      name="dateNaissance"
                      id="dateNaissance"
                      value={values.dateNaissance}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sexe
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="sexe-m"
                          name="sexe"
                          type="radio"
                          value="M"
                          checked={values.sexe === "M"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          required
                        />
                        <label
                          htmlFor="sexe-m"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Masculin
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="sexe-f"
                          name="sexe"
                          type="radio"
                          value="F"
                          checked={values.sexe === "F"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="sexe-f"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Féminin
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information and Password */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informations Académiques
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="classe"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Classe
                    </label>
                    <input
                      type="text"
                      name="classe"
                      id="classe"
                      value={values.classe}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="specialite"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Spécialité
                    </label>
                    <input
                      type="text"
                      name="specialite"
                      id="specialite"
                      value={values.specialite}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="faculte"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Faculté
                    </label>
                    <input
                      type="text"
                      name="faculte"
                      id="faculte"
                      value={values.faculte}
                      onChange={handleChange}
                      className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Sécurité
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="mdp"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          name="mdp"
                          id="mdp"
                          value={values.mdp}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmerMdp"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          name="confirmerMdp"
                          id="confirmerMdp"
                          value={values.confirmerMdp}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 border px-3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-lg transition-all duration-300 ease-in-out"
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
                    Chargement...
                  </span>
                ) : (
                  <span>S'inscrire</span>
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Déjà inscrit?{" "}
                <Link
                  to="/"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
