// Sélection des éléments du DOM
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('errorMessage');

console.log("Éléments du DOM sélectionnés:", form, emailInput, passwordInput, errorDiv);

// Ajout d'un écouteur d'événements pour la soumission du formulaire
form.addEventListener('submit', (event) => {
    // Empêche le comportement par défaut de soumission du formulaire
    event.preventDefault();
    console.log("Soumission du formulaire empêchée");

    // Récupération des valeurs des champs email et mot de passe
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("Valeurs récupérées - Email:", email, "Mot de passe:", password);

    // Envoi de la requête de connexion à l'API
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Corps de la requête au format JSON
        body: JSON.stringify({ email, password }) 
    })
    .then(response => {
        console.log("Réponse reçue du serveur:", response);

        // Si la réponse est positive (status 200), traitement des données
        if (response.ok) {
            console.log("Authentification réussie");

            return response.json().then(data => {
                // Stockage du token et de l'ID utilisateur dans LocalStorage
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('userId', data.userId);
                console.log("Token et userId stockés dans LocalStorage");

                // Redirection vers la page d'accueil
                window.location.href = './index.html';
                console.log("Redirection vers la page d'accueil");
            });

        // Gestion des erreurs d'authentification
        } else if (response.status === 401) {
            console.log("Erreur 401: Accès non autorisé");
            errorDiv.textContent = 'Erreur dans l’identifiant ou le mot de passe';

        // Gestion de l'erreur utilisateur non trouvé
        } else if (response.status === 404) {
            console.log("Erreur 404: Utilisateur non trouvé");
            errorDiv.textContent = 'Erreur dans l’identifiant ou le mot de passe';
        }
    })
    .catch(error => {
        // Gestion des erreurs de la requête
        console.error("Erreur lors de la requête:", error);
        errorDiv.textContent = 'Une erreur est survenue sur le site, veuillez contacter l\'administrateur!';
    });
});