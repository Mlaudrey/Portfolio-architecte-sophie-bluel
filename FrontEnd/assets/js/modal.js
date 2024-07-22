document.addEventListener('DOMContentLoaded', () => {
    // Obtenez l'élément du lien d'authentification
    const authLink = document.getElementById('authLink');
    const token = sessionStorage.getItem('token');
    console.log('Token trouvé dans sessionStorage:', token);

    if (token) {
        // Si un token est présent, cela signifie que l'utilisateur est connecté
        authLink.textContent = 'Logout'; // Changez le texte du lien en "Logout"
        authLink.href = '#'; // Modifiez l'URL du lien pour la déconnexion

        // Ajoutez un gestionnaire d'événements pour la déconnexion
        authLink.addEventListener('click', () => {
            console.log('Déconnexion en cours...');
            
            // Supprimez le token et l'userId de sessionStorage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');

            // Affichez un message de confirmation dans la console
            console.log('Token supprimé du sessionStorage');

            // Redirigez vers la page de connexion
            window.location.href = './login.html';
        });
    } else {
        // Si aucun token n'est présent, l'utilisateur n'est pas connecté
        authLink.textContent = 'Login'; // Changez le texte du lien en "Login"
        authLink.href = './login.html'; // Modifiez l'URL du lien pour rediriger vers la page de connexion
    }

    // Affichez l'état final du lien d'authentification dans la console pour le débogage
    console.log('Lien d\'authentification:', authLink.textContent, 'Href:', authLink.href);
});

// Code pour le mode édition
const modal = document.getElementById("modal"); // Récupérez l'élément du modal
const update = document.getElementById("updates"); // Récupérez l'élément du bouton de mise à jour
const close = document.getElementById("close"); // Récupérez l'élément du bouton de fermeture du modal

// Vérifiez si l'utilisateur est connecté
if (sessionStorage.getItem("token")) {
    // Vider le contenu existant de l'élément updates pour éviter la duplication
    update.innerHTML = ''; 

    // Créez et ajoutez un nouvel élément "modifier" pour l'édition
    const modifier = document.createElement("div");
    modifier.id = "modifier";
    modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
    `;
    update.appendChild(modifier); // Ajoutez l'élément "modifier" à updates
    update.style.display = "flex"; // Affichez le bouton "modifier"

    // Mettez à jour le texte du lien d'authentification pour le mode édition
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.textContent = 'Logout'; // Affichez "Logout" en mode édition
    }
} else {
    update.style.display = "none"; // Masquez le bouton "modifier" si l'utilisateur n'est pas connecté
}

// Affichez le modal lorsque l'utilisateur clique sur le bouton "modifier"
update.addEventListener("click", function() {
    modal.style.display = "block";
});

// Fermez le modal lorsque l'utilisateur clique sur le bouton de fermeture
close.addEventListener("click", function() {
    modal.style.display = "none";
});

// Fermez le modal si l'utilisateur clique à l'extérieur du modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Affichez un projet dans la galerie
function displayProject(works) {
    // Créez le contenu HTML pour un projet
    const cards = `
        <figure id="M${works?.id}">
            <img src="${works?.imageUrl}" crossOrigin="anonymous">
            <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
        </figure>
    `;
    // Ajoutez le contenu HTML à l'élément "products"
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

// Affichez tous les projets dans le modal
function displayAllModal(e) {
    e.preventDefault(); // Empêchez le comportement par défaut du bouton
    document.querySelector(".galleryModal").innerHTML = ""; // Videz le contenu existant de la galerie du modal
    // Parcourez tous les projets et affichez-les
    for (let j = 0; j < AllProjects.length; j++) {
        displayProject(AllProjects[j]);
    }
}

// Ajoutez un gestionnaire d'événements pour afficher tous les projets dans le modal
update.addEventListener("click", displayAllModal);

const add = document.getElementById("button-add"); // Récupérez l'élément du bouton d'ajout
const content = document.getElementById("modal-content"); // Récupérez l'élément du contenu du modal principal
const content2 = document.getElementById("next-modal-container"); // Récupérez l'élément du contenu du second modal
const close2 = document.getElementById("close2"); // Récupérez l'élément du bouton de fermeture du second modal

// Affichez le formulaire d'ajout de photo lorsque l'utilisateur clique sur le bouton d'ajout
add.addEventListener("click", function() {
    content.style.display = "none"; // Masquez le contenu du modal principal
    content2.style.display = "block"; // Affichez le contenu du second modal
});

// Retournez au modal principal
const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block"; // Affichez le contenu du modal principal
    content2.style.display = "none"; // Masquez le contenu du second modal
});

// Fermez le modal lorsque l'utilisateur clique sur le bouton de fermeture du second modal
close2.addEventListener("click", function() {
    modal.style.display = "none";
});

// Supprimez un projet lorsque l'utilisateur clique sur l'icône de la poubelle
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {
        const projectId = e.target.id;
        console.log(`Suppression du projet avec l'ID ${projectId}`);
        deleteProject(projectId); // Appelez la fonction de suppression du projet
    }
});

// Fonction pour supprimer un projet en faisant une requête DELETE à l'API
function deleteProject(projectId) {
    // Effectuer la requête DELETE pour supprimer le projet de la base de données
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if (response.ok) {
            // Confirmation de la suppression réussie côté serveur
            console.log(`Projet avec l'ID ${projectId} supprimé avec succès de la base de données.`);
            
            // Suppression de l'élément du DOM après confirmation
            const projectElement = document.getElementById(`M${projectId}`);
            
            if (projectElement) {
                projectElement.remove(); // Retirer l'élément du DOM
                console.log(`Élément avec l'ID M${projectId} supprimé du DOM.`);
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

const form = document.getElementById("form"); // Récupérez l'élément du formulaire
const title = document.getElementById("title"); // Récupérez l'élément du champ titre
const category = document.getElementById("category"); // Récupérez l'élément du champ catégorie
const imageUrl = document.getElementById("imageUrl"); // Récupérez l'élément du champ URL de l'image
const button = document.getElementById("submit"); // Récupérez l'élément du bouton de soumission

// Gère la soumission du formulaire d'ajout de projet
button.addEventListener("click", function(e) {
    e.preventDefault(); // Empêchez le comportement par défaut du bouton de soumission
    const data = {
        title: title.value, // Récupérez la valeur du champ titre
        category: category.value, // Récupérez la valeur du champ catégorie
        imageUrl: imageUrl.value, // Récupérez la valeur du champ URL de l'image
    };
    // Envoyez une requête POST pour ajouter un nouveau projet
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    }).then((result) => {
        if (result.ok) {
            result.json().then((dt) => {
                console.log(dt);
            });
        }
    }).catch((err) => {
        console.error(err);
    });
});

// Téléchargez l'image sélectionnée et l'affichez
function telecharger() {
    var telecharger_image = "";
    const reader = new FileReader();

    // Ajoutez un gestionnaire d'événements pour charger l'image
    reader.addEventListener("load", () => {
        telecharger_image = reader.result;
        const photo = document.getElementById("image_telecharger");
        document.getElementById("image_telecharger_images").style.display = "block";
        photo.style.backgroundImage = `url(${telecharger_image})`;
        document.getElementById("ajout_container").style.display = "none";
    });

    // Lisez le fichier sélectionné comme URL de données
    reader.readAsDataURL(this.files[0]);
}

// Ajoutez un gestionnaire d'événements pour le changement de fichier
document.getElementById("imageUrl").addEventListener("change", telecharger);
// Ajoutez un gestionnaire d'événements pour le bouton d'ajout d'image
document.getElementById('adding').addEventListener('click', function() {
    document.getElementById('imageUrl').click();
});

// Gère la soumission du formulaire avec des validations
button.addEventListener("click", (e) => {
    e.preventDefault(); // Empêchez le comportement par défaut du bouton de soumission
    const photo = document.getElementById("imageUrl"); // Récupérez l'élément du champ URL de l'image
    const category = document.getElementById("category"); // Récupérez l'élément du champ catégorie
    const title = document.getElementById("title"); // Récupérez l'élément du champ titre

    // Vérifiez si tous les champs sont remplis
    if (photo.value === "" || title.value === "" || category.value === "") {
        document.getElementById("Error").innerHTML = "Il faut remplir le formulaire.";
    } else {
        document.getElementById("Error").innerHTML = "";

        // Envoyez une requête pour récupérer les catégories disponibles
        fetch("http://localhost:5678/api/categories").then((res) => {
            if (res.ok) {
                res.json().then((categorydata) => {
                    for (let i = 0; i < categorydata.length; i++) {
                        if (category.value === categorydata[i].name) {
                            const image = photo.files[0]; // Récupérez le fichier image sélectionné

                            // Vérifiez la taille de l'image
                            if (image.size > 4 * 1024 * 1024) {
                                document.getElementById("Error").innerHTML = "L'image ne doit pas dépasser 4Mo.";
                                return;
                            } else {
                                document.getElementById("Error").innerHTML = "";
                            }

                            // Créez un objet FormData pour envoyer les données du formulaire
                            let formData = new FormData();
                            formData.append("image", image);
                            formData.append("title", title.value);
                            formData.append("category", categorydata[i].name);

                            // Envoyez une requête POST pour ajouter le projet
                            fetch("http://localhost:5678/api/works", {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                },
                                body: formData,
                            }).then((response) => {
                                if (response.ok) {
                                    // Mettez à jour l'interface utilisateur après une ajout réussi
                                    document.getElementById("products").innerHTML = "";
                                    fetch("http://localhost:5678/api/works")
                                        .then((res) => res.json())
                                        .then((dt) => {
                                            AllProjects = dt;
                                            for (let j = 0; j < AllProjects.length; j++) {
                                                displayProject(AllProjects[j]);
                                            }
                                        });
                                }
                            }).catch((error) => {
                                console.error("Erreur:", error);
                            });
                        }
                    }
                });
            }
        });
    }
});
document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        const formData = new FormData();
        const fileInput = document.getElementById('imageFile');
        formData.append('image', fileInput.files[0]);

        fetch('http://localhost:5678/api/works/upload', { // Assurez-vous que l'URL correspond à votre point de terminaison d'upload
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Image téléversée avec succès:', data);
            // Mettez à jour l'interface utilisateur si nécessaire
        })
        .catch(error => {
            console.error('Erreur lors du téléversement de l\'image:', error);
        });
    });
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        const formData = new FormData();
        const fileInput = document.getElementById('imageFile');
        const file = fileInput.files[0];

        if (file) {
            formData.append('image', file);

            fetch('http://localhost:5678/api/works', { // Assurez-vous que l'URL correspond à votre API
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du téléversement');
                }
                return response.json();
            })
            .then(data => {
                console.log('Image téléversée avec succès:', data);
                alert('Image téléversée avec succès!');
                // Mettez à jour l'interface utilisateur si nécessaire
            })
            .catch(error => {
                console.error('Erreur lors du téléversement de l\'image:', error);
                alert('Erreur lors du téléversement de l\'image: ' + error.message);
            });
        } else {
            console.error('Aucun fichier sélectionné.');
            alert('Aucun fichier sélectionné.');
        }
    });