document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'élément du lien d'authentification par son ID
    const authLink = document.getElementById('authLink');
    // Récupérer le token de session depuis le sessionStorage
    const token = sessionStorage.getItem('token');
    console.log('Token trouvé dans sessionStorage:', token);

    // Vérifier si le token existe
    if (token) {
        // Si le token existe, modifier le texte du lien d'authentification en "Logout"
        authLink.textContent = 'Logout';
        // Modifier l'URL du lien pour empêcher la redirection
        authLink.href = '#';

        // Ajouter un événement au clic pour la déconnexion
        authLink.addEventListener('click', () => {
            console.log('Déconnexion en cours...');
            // Supprimer le token et l'ID utilisateur du sessionStorage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            console.log('Token supprimé du sessionStorage');
            // Rediriger vers la page de login
            window.location.href = './login.html';
        });
    } else {
        // Si le token n'existe pas, modifier le texte du lien d'authentification en "Login"
        authLink.textContent = 'Login';
        // Modifier l'URL du lien pour rediriger vers la page de login
        authLink.href = './login.html';
    }

    console.log('Lien d\'authentification:', authLink.textContent, 'Href:', authLink.href);
});

// Récupérer les éléments nécessaires pour le mode édition
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");

// Vérifier si un token est présent dans le sessionStorage pour activer le mode édition
if (sessionStorage.getItem("token")) {
    // Vider le contenu de l'élément update
    update.innerHTML = '';
    // Créer un nouveau div pour le mode édition
    const modifier = document.createElement("div");
    modifier.id = "modifier";
    modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
    `;
    // Ajouter le nouveau div à l'élément update
    update.appendChild(modifier);
    update.style.display = "flex"; // Afficher le bouton de modification

    // Modifier le texte du lien d'authentification en "Logout"
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.textContent = 'Logout';
    }
} else {
    // Si aucun token n'est présent, cacher le bouton de modification
    update.style.display = "none";
}

// Fonction pour réinitialiser l'affichage des modales
function resetModals() {
    const content = document.getElementById("modal-content");
    const content2 = document.getElementById("next-modal-container");
    content.style.display = "block"; // Afficher le contenu principal de la modal
    content2.style.display = "none"; // Cacher le contenu de la deuxième modal
}

// Fonction pour réinitialiser l'état de la modal d'ajout de photo
function resetAddPhotoModal() {
    const photo = document.getElementById("imageUrl");
    const category = document.getElementById("category");
    const title = document.getElementById("title");
    const error = document.getElementById("Error");
    const imagePreview = document.getElementById("image_telecharger");
    const imagePreviewContainer = document.getElementById("image_telecharger_images");
    const ajoutContainer = document.getElementById("ajout_container");

    // Réinitialiser les champs de formulaire
    photo.value = "";
    category.value = "";
    title.value = "";
    error.innerHTML = "";

    // Réinitialiser les prévisualisations d'image
    imagePreview.style.backgroundImage = "";
    imagePreviewContainer.style.display = "none";
    ajoutContainer.style.display = "flex";

    // Afficher la première page de la modal
    const content = document.getElementById("modal-content");
    const content2 = document.getElementById("next-modal-container");
    content.style.display = "block";
    content2.style.display = "none";
}

// Afficher la modal lorsque l'utilisateur clique sur le bouton "modifier"
update.addEventListener("click", function() {
    resetModals(); // Réinitialiser les modales
    modal.style.display = "block"; // Afficher la modal
});

// Fermer la modal lorsque l'utilisateur clique sur le bouton de fermeture
close.addEventListener("click", function() {
    modal.style.display = "none"; // Cacher la modal
});

// Fermer la modal si l'utilisateur clique à l'extérieur de celle-ci
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Cacher la modal
    }
}

// Afficher un projet dans la galerie
function displayProject(works) {
    const cards = `
        <figure id="M${works?.id}">
            <img src="${works?.imageUrl}" crossOrigin="anonymous">
            <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
        </figure>
    `;
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

// Ajouter un projet dans la galerie
function addToGallery(works) {
    const cards = `
        <figure id="A${works?.id}">
            <img src="${works?.imageUrl}" crossOrigin="anonymous">
            <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
        </figure>
    `;
    document.getElementById("gallery").insertAdjacentHTML("beforeend", cards);
}

// Afficher tous les projets dans le modal
function displayAllModal(e) {
    e.preventDefault(); // Empêcher le comportement par défaut du clic
    document.querySelector(".galleryModal").innerHTML = ""; // Vider la galerie
    for (let j = 0; j < AllProjects.length; j++) {
        displayProject(AllProjects[j]); // Afficher chaque projet
    }
}

// Ajouter un événement au clic sur le bouton "modifier" pour afficher tous les projets
update.addEventListener("click", displayAllModal);

const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

// Afficher la modal d'ajout de photo lorsque l'utilisateur clique sur le bouton "Ajouter"
add.addEventListener("click", function() {
    resetAddPhotoModal(); // Réinitialiser l'état de la modal d'ajout de photo
    content.style.display = "none"; // Cacher le contenu principal de la modal
    content2.style.display = "block"; // Afficher le contenu de la deuxième modal
});

// Retourner à la première modal lorsque l'utilisateur clique sur le bouton "back"
const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block"; // Afficher le contenu principal de la modal
    content2.style.display = "none"; // Cacher le contenu de la deuxième modal
});

// Ajouter un événement au clic pour la suppression d'un projet
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {
        const projectId = e.target.id; // Récupérer l'ID du projet à supprimer
        console.log(`Suppression du projet avec l'ID ${projectId}`);
        deleteProject(projectId); // Appeler la fonction de suppression du projet
    }
});

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE', // Utiliser la méthode DELETE
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Projet avec l'ID ${projectId} supprimé avec succès de la base de données.`);
            const products = document.getElementById("products");
            const projectElement = products.querySelector(`[id="M${projectId}"]`);
            const gallery = document.getElementById("gallery");
            const galleryElement = gallery.querySelector(`[id="A${projectId}"]`);
            if (projectElement) {
                projectElement.remove(); // Supprimer l'élément du DOM
                galleryElement.remove(); // Supprimer l'élément du DOM
                console.log(`Élément avec l'ID M${projectId} supprimé du DOM.`);
                // Ne pas fermer la modal ici
            } else {
                console.error(`Élément avec l'ID M${projectId} non trouvé dans le DOM.`);
            }
        } else {
            console.error(`Erreur lors de la suppression du projet avec l'ID ${projectId} côté serveur.`);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression du projet:", error);
    });
}

// Récupérer les éléments du formulaire d'ajout de photo
const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

// Ajouter un événement au clic sur le bouton de soumission du formulaire
button.addEventListener("click", function(e) {
    e.preventDefault(); // Empêcher le comportement par défaut du bouton

    const photo = imageUrl.files[0];
    const categoryId = parseInt(category.value, 10); // Convertir la catégorie en nombre

    if (!photo || !title.value || isNaN(categoryId)) {
        document.getElementById("Error").innerHTML = "Il faut remplir le formulaire correctement.";
        return;
    }

    // Créer un FormData pour envoyer le fichier image
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", categoryId);
    formData.append("image", photo); // Utiliser le fichier image

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: formData // Envoyer les données en format FormData
    })
    .then(result => {
        if (result.ok) {
            result.json().then(data => {
                console.log(data);

                // Actualiser la galerie après l'ajout d'un nouveau projet
                fetch("http://localhost:5678/api/works")
                    .then(result => result.json())
                    .then(data => {
                        AllProjects = data;
                        document.querySelector(".galleryModal").innerHTML = "";
                        document.getElementById("gallery").innerHTML = "";
                        for (let j = 0; j < AllProjects.length; j++) {
                            addToGallery(AllProjects[j]);
                        }
                        document.getElementById("modal").style.display = "none";
                    });
            });
        } else {
            document.getElementById("Error").innerHTML = "Une erreur s'est produite lors de l'ajout du projet.";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("Error").innerHTML = "Une erreur s'est produite lors de l'ajout du projet.";
    });
});

// Fonction pour télécharger et prévisualiser une image
function telecharger() {
    var telecharger_image = "";
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        telecharger_image = reader.result;
        const photo = document.getElementById("image_telecharger");
        document.getElementById("image_telecharger_images").style.display = "block";
        photo.style.backgroundImage = `url(${telecharger_image})`;
        document.getElementById("ajout_container").style.display = "none";
    });

    reader.readAsDataURL(this.files[0]); // Lire le fichier sélectionné
}

// Ajouter un événement de changement sur l'élément de sélection d'image
document.getElementById("imageUrl").addEventListener("change", telecharger);

// Simuler un clic sur l'élément de sélection d'image lorsque l'utilisateur clique sur le bouton d'ajout
document.getElementById('adding').addEventListener('click', function() {
    document.getElementById('imageUrl').click();
});