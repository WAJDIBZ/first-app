import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert

const Login = () => {
  const [credentials, setCredentials] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedId = localStorage.getItem("saved_id");
    if (savedId) {
      setCredentials((prev) => ({ ...prev, id: savedId }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing after an error
    if (error && formSubmitted) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!credentials.id.trim() || !credentials.password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8081", {
        id: credentials.id,
        password: credentials.password,
      });

      if (response.data.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("saved_id", credentials.id);
        } else {
          localStorage.removeItem("saved_id");
        }

        // Set user session
        localStorage.setItem("user_id", credentials.id);
        localStorage.setItem("user_role", response.data.role);

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Connexion réussie",
          text: "Vous êtes connecté avec succès !",
          timer: 2000,
          showConfirmButton: false,
        });

        // Add small delay for better UX
        setTimeout(() => {
          switch (response.data.role) {
            case "etudiant":
              navigate("/registration");
              break;
            case "encadreur":
              navigate("/encadreur-dashboard");
              break;
            case "admin":
              navigate("/admin-dashboard");
              break;
            default:
              setError("Rôle inconnu.");
          }
        }, 300);
      } else {
        setError(response.data.message || "Identifiants invalides");
      }
    } catch (err) {
      console.error("Erreur serveur :", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Erreur d'authentification.");
      } else if (!navigator.onLine) {
        setError("Pas de connexion Internet. Vérifiez votre connexion réseau.");
      } else {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl relative z-10">
        {/* Logo and Header Section with refined gradient */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-10 text-center relative">
          <div className="inline-flex items-center justify-center bg-white rounded-full p-4 mb-5 shadow-lg">
            <svg
              className="h-8 w-8 text-blue-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            Gestion des Stagiaires
          </h2>
          <p className="mt-2 text-blue-100 font-light">
            Accédez à votre espace personnel
          </p>

          {/* Decorative dots */}
          <div className="absolute bottom-2 left-6 flex space-x-1">
            <div className="w-1 h-1 rounded-full bg-blue-200 opacity-70"></div>
            <div className="w-1 h-1 rounded-full bg-blue-200 opacity-70"></div>
            <div className="w-1 h-1 rounded-full bg-blue-200 opacity-70"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Identifiant
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="id"
                  value={credentials.id}
                  onChange={handleChange}
                  className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-3 border px-3 transition-all duration-200"
                  placeholder="Votre identifiant"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-3 border px-3 transition-all duration-200"
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-lg transition-all duration-300 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className={`h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-all duration-300 ${
                      loading ? "opacity-0" : "opacity-100"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
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
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="transition-all duration-300">
                    Se connecter
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Pas encore inscrit?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="h-4 w-4 mr-1 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Connexion sécurisée
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
