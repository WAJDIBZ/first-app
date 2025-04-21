import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Loader,
  Search,
  Calendar,
  User,
  MapPin,
  Briefcase,
  Building,
} from "lucide-react";

const EncadreurDashboard = () => {
  const [interns, setInterns] = useState([
    {
      ids: 1,
      date_debut: "2023-01-01",
      date_fin: "2023-06-01",
      nature_stage: "Stage de recherche",
      pays: "France",
      presenter_vous:
        "Aziz est un étudiant en informatique passionné par l'intelligence artificielle et le développement logiciel.",
      direction: "Informatique",
      situation: false,
    },
    {
      ids: 2,
      date_debut: "2023-02-15",
      date_fin: "2023-07-15",
      nature_stage: "Stage pratique",
      pays: "Maroc",
      presenter_vous:
        "Sara est une étudiante en finance avec une expérience en analyse de données et gestion de projets.",
      direction: "Finance",
      situation: true,
    },
    {
      ids: 3,
      date_debut: "2023-03-10",
      date_fin: "2023-08-10",
      nature_stage: "Stage d'observation",
      pays: "Tunisie",
      presenter_vous:
        "Mohamed est un étudiant en marketing digital cherchant à approfondir ses connaissances en SEO et stratégie de contenu.",
      direction: "Marketing",
      situation: null,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIntern, setSelectedIntern] = useState(null);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        // Simulate API call delay
        setTimeout(async () => {
          try {
            const response = await axios.get(
              "http://localhost:8081/encadreur-dashboard"
            );
            if (response.data.success) {
              setInterns(response.data.data);
            } else {
              setError("Erreur lors du chargement des stagiaires.");
            }
          } catch (err) {
            console.error("Error fetching data:", err);
            // Keep the initial data for demo purposes
            // setError("Erreur de connexion au serveur.");
          } finally {
            setLoading(false);
          }
        }, 1000);
      } catch (err) {
        setError("Erreur de connexion au serveur.");
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  const updateInternStatus = async (id, situation) => {
    try {
      setLoading(true);
      // Simulating API delay
      setTimeout(async () => {
        try {
          const response = await axios.put(
            `http://localhost:8081/encadreur-dashboard/${id}`,
            { situation }
          );
          if (response.data && response.data.success) {
            // Handle successful response
            setInterns((prevInterns) =>
              prevInterns.map((intern) =>
                intern.ids === id ? { ...intern, situation } : intern
              )
            );

            // Show notification (this would be replaced with a toast in a real app)
            const message = situation
              ? "Stagiaire accepté avec succès"
              : "Stagiaire refusé";
            showToast(message, situation ? "success" : "error");
          }
        } catch (error) {
          console.error("Error updating status:", error);
          // Update the UI anyway for demo purposes
          setInterns((prevInterns) =>
            prevInterns.map((intern) =>
              intern.ids === id ? { ...intern, situation } : intern
            )
          );

          const message = situation
            ? "Stagiaire accepté avec succès"
            : "Stagiaire refusé";
          showToast(message, situation ? "success" : "error");
        } finally {
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      showToast("Erreur lors de la mise à jour du stagiaire", "error");
      setLoading(false);
    }
  };

  // Simple toast notification system
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-xs z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white transition-opacity duration-500`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const filteredInterns = interns.filter((intern) => {
    // Filter by search term
    const matchesSearch =
      intern.presenter_vous.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.nature_stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.pays.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "accepted" && intern.situation === true) ||
      (filterStatus === "rejected" && intern.situation === false) ||
      (filterStatus === "pending" && intern.situation === null);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };
  const updateStagierStatus = async (id, situation) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/encadreur-dashboard/${id}`,
        { situation }
      );
      if (response.data.success) {
        alert(response.data.message);
        setInterns((prevStagiers) =>
          prevStagiers.map((stagier) =>
            stagier.id === id ? { ...stagier, situation } : stagier
          )
        );
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du stagiaire.");
    }
  };

  const getStatusBadge = (situation) => {
    if (situation === true) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Accepté
        </span>
      );
    } else if (situation === false) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Refusé
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Loader className="w-3 h-3 mr-1 animate-spin" /> En attente
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Stagiaires
          </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ahmed Bensouda
              </p>
              <p className="text-xs text-gray-500">Encadreur Principal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Stagiaires
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {interns.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Acceptés
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {
                        interns.filter((intern) => intern.situation === true)
                          .length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Refusés
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {
                        interns.filter((intern) => intern.situation === false)
                          .length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <Loader className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      En attente
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {
                        interns.filter((intern) => intern.situation === null)
                          .length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium text-gray-900">
                Liste des Stagiaires
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border-0 p-0 pl-2 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Rechercher..."
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="accepted">Acceptés</option>
                <option value="rejected">Refusés</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Intern List */}
        {!loading && !error && (
          <>
            {filteredInterns.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-16 sm:px-6 text-center text-gray-500">
                  <p>Aucun stagiaire ne correspond à votre recherche</p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredInterns.map((intern) => (
                    <li key={intern.ids} className="hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                              {intern.presenter_vous.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {intern.presenter_vous.split(" ")[0]}
                              </p>
                              <div className="flex items-center mt-1">
                                <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  {intern.direction}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateStagierStatus(intern.ids, true)
                              }
                              className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                                intern.situation === true
                                  ? "bg-green-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              disabled={intern.situation === true}
                            >
                              {intern.situation === true
                                ? "Accepté"
                                : "Accepter"}
                            </button>
                            <button
                              onClick={() =>
                                updateStagierStatus(intern.ids, false)
                              }
                              className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                                intern.situation === false
                                  ? "bg-red-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                              disabled={intern.situation === false}
                            >
                              {intern.situation === false
                                ? "Refusé"
                                : "Refuser"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="flex items-center text-sm text-gray-500 mr-6">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>
                                {formatDate(intern.date_debut)} -{" "}
                                {formatDate(intern.date_fin)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>{intern.nature_stage}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{intern.pays}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>

      {/* Intern Detail Modal */}
      {selectedIntern && (
        <div
          className="fixed inset-0 overflow-y-auto z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedIntern(null)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white sm:mx-0 sm:h-10 sm:w-10">
                    {selectedIntern.presenter_vous.charAt(0).toUpperCase()}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Fiche de Stagiaire
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">ID:</span>{" "}
                          {selectedIntern.ids}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Période:</span>{" "}
                          {formatDate(selectedIntern.date_debut)} -{" "}
                          {formatDate(selectedIntern.date_fin)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Type de stage:</span>{" "}
                          {selectedIntern.nature_stage}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Pays:</span>{" "}
                          {selectedIntern.pays}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Direction:</span>{" "}
                          {selectedIntern.direction}
                        </p>
                        <div className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Présentation:</span>
                          <p className="mt-1">
                            {selectedIntern.presenter_vous}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Statut:</span>{" "}
                          {getStatusBadge(selectedIntern.situation)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedIntern.situation !== true && (
                  <button
                    type="button"
                    onClick={() => {
                      updateInternStatus(selectedIntern.ids, true);
                      setSelectedIntern(null);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Accepter
                  </button>
                )}
                {selectedIntern.situation !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      updateInternStatus(selectedIntern.ids, false);
                      setSelectedIntern(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Refuser
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedIntern(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncadreurDashboard;
