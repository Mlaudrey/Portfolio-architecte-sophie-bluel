document.addEventListener('DOMContentLoaded', () => {
    // Obtenez le lien d'authentification
    const authLink = document.getElementById('authLink');
    
    // Vérifiez si un token est présent dans le sessionStorage
    const token = sessionStorage.getItem('token');

    // Log pour vérifier l'état du token
    console.log('Token trouvé dans sessionStorage:', token);

    if (token) {
        // Si le token est présent, l'utilisateur est connecté
        authLink.textContent = 'Logout'; // Change le texte du lien pour "Logout"
        authLink.href = '#'; // Utilisez "#" ou une URL pour la déconnexion si nécessaire

        // Ajoutez un gestionnaire d'événements pour la déconnexion
        authLink.addEventListener('click', () => {
            console.log('Déconnexion en cours...');
            
            // Supprimez le token du sessionStorage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');

            // Log pour confirmer la suppression du token
            console.log('Token supprimé du sessionStorage');

            // Redirection vers la page de connexion après déconnexion
            window.location.href = './login.html';
        });
    } else {
        // Si le token n'est pas présent, l'utilisateur n'est pas connecté
        authLink.textContent = 'Login'; // Change le texte du lien pour "Login"
        authLink.href = './login.html'; // Redirection vers la page de connexion
    }

    // Log pour vérifier l'état final du lien
    console.log('Lien d\'authentification:', authLink.textContent, 'Href:', authLink.href);
});

// Code pour le mode édition
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");

// Vérifie si l'utilisateur est connecté
if (sessionStorage.getItem("token")) {
    update.innerHTML = ''; // Vider le contenu existant de #updates pour éviter la duplication

    // Créer et ajouter l'élément "modifier"
    const modifier = document.createElement("div");
    modifier.id = "modifier";
    modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
    `;
    update.appendChild(modifier);
    update.style.display = "flex"; // Afficher le bouton "modifier"

    // Met à jour le texte du lien d'authentification pour le mode édition
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.textContent = 'Logout'; // Affiche "Logout" en mode édition
    }
} else {
    update.style.display = "none"; // Masquer le bouton "modifier"
}

// Affiche le modal lorsque l'utilisateur clique sur le bouton "modifier"
update.addEventListener("click", function() {
    modal.style.display = "block";
});

// Ferme le modal lorsque l'utilisateur clique sur le bouton de fermeture
close.addEventListener("click", function() {
    modal.style.display = "none";
});

// Ferme le modal si l'utilisateur clique à l'extérieur du modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Affiche un projet dans la galerie
function displayProject(works) {
    const cards = `
        <figure id="M${works?.id}">
            <img src="${works?.imageUrl}" crossOrigin="anonymous">
            <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
        </figure>
    `;
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

// Affiche tous les projets dans le modal
function displayAllModal(e) {
    e.preventDefault();
    document.querySelector(".galleryModal").innerHTML = "";
    for (let j = 0; j < AllProjects.length; j++) {
        displayProject(AllProjects[j]);
    }
}

update.addEventListener("click", displayAllModal);

const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

// Affiche le formulaire d'ajout de photo
add.addEventListener("click", function() {
    content.style.display = "none";
    content2.style.display = "block";
});

// Retourne au modal principal
const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block";
    content2.style.display = "none";
});

// Ferme le modal lorsque l'utilisateur clique sur le bouton de fermeture du second modal
close2.addEventListener("click", function() {
    modal.style.display = "none";
});

// Supprime un projet lorsque l'utilisateur clique sur l'icône de la poubelle
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {
        const projectId = e.target.id;
        console.log(`Suppression du projet avec l'ID ${projectId}`);
        deleteProject(projectId);
    }
});

// Fonction pour supprimer un projet en faisant une requête DELETE à l'API
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if (response.ok) {
            // Mettre à jour l'interface utilisateur après la suppression réussie
            document.getElementById(`M${projectId}`).remove();
            console.log(`Projet avec l'ID ${projectId} supprimé avec succès.`);
        } else {
            console.error(`Erreur lors de la suppression du projet avec l'ID ${projectId}.`);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression du projet:", error);
    });
}

const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

// Gère la soumission du formulaire d'ajout de projet
button.addEventListener("click", function(e) {
    e.preventDefault();
    const data = {
        title: title.value,
        category: category.value,
        imageUrl: imageUrl.value,
    };
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

// Télécharge l'image sélectionnée et l'affiche
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

    reader.readAsDataURL(this.files[0]);
}

document.getElementById("imageUrl").addEventListener("change", telecharger);
document.getElementById('adding').addEventListener('click', function() {
    document.getElementById('imageUrl').click();
});

button.addEventListener("click", (e) => {
    e.preventDefault();
    const photo = document.getElementById("imageUrl");
    const category = document.getElementById("category");
    const title = document.getElementById("title");

    if (photo.value === "" || title.value === "" || category.value === "") {
        document.getElementById("Error").innerHTML = "Il faut remplir le formulaire.";
    } else {
        document.getElementById("Error").innerHTML = "";

        fetch("http://localhost:5678/api/categories").then((res) => {
            if (res.ok) {
                res.json().then((categorydata) => {
                    for (let i = 0; i < categorydata.length; i++) {
                        if (category.value === categorydata[i].name) {
                            const image = photo.files[0];

                            if (image.size > 4 * 1024 * 1024) {
                                document.getElementById("Error").innerHTML = "L'image ne doit pas dépasser 4Mo.";
                                return;
                            } else {
                                document.getElementById("Error").innerHTML = "";
                            }

                            let formData = new FormData();
                            formData.append("image", image);
                            formData.append("title", title.value);
                            formData.append("category", categorydata[i].name);

                            fetch("http://localhost:5678/api/works", {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                },
                                body: formData,
                            }).then((response) => {
                                if (response.ok) {
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
