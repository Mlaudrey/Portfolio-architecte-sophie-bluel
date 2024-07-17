// Récupération des éléments du DOM nécessaires pour manipuler la modal et les boutons
const modal = document.getElementById("modal"); // La modal elle-même
const update = document.getElementById("updates"); // Le bouton "modifier" ou la section de mise à jour
const close = document.getElementById("close"); // Le bouton pour fermer la modal
const deleteBtn = document.getElementById("deleteBtn"); // Le bouton pour supprimer tous les projets

// Vérifier si un token est présent dans le sessionStorage pour afficher le bouton "modifier"
if (sessionStorage.getItem("token")) {
    // Vérifier si le bouton "modifier" n'existe pas déjà dans #updates pour éviter la duplication
    if (!document.getElementById("modifier")) {
        // Créer l'élément div pour le bouton "modifier" avec une icône et un texte
        const modifier = document.createElement("div");
        modifier.id = "modifier"; // Attribuer un ID unique à l'élément pour pouvoir le manipuler plus tard
        modifier.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i> <!-- Icône pour modifier -->
            <p>modifier</p> <!-- Texte pour le bouton -->
        `;

        // Ajouter l'élément "modifier" à l'élément #updates
        update.appendChild(modifier);

        // Rendre visible le bouton "modifier" en affichant #updates
        update.style.display = "flex";
    }
} else {
    // Si aucun token n'est trouvé, masquer le bouton "modifier" en cachant #updates
    update.style.display = "none";
}

// Ajouter un écouteur d'événements pour ouvrir la modal lorsque le bouton "modifier" est cliqué
update.addEventListener("click", function() {
    modal.style.display = "block"; // Afficher la modal
});

// Ajouter un écouteur d'événements pour fermer la modal lorsque le bouton "close" est cliqué
close.addEventListener("click", function() {
    modal.style.display = "none"; // Cacher la modal
});

// Ajouter un écouteur d'événements pour fermer la modal lorsque l'on clique en dehors de celle-ci
window.onclick = function(event) {
    if (event.target == modal) { // Vérifier si l'élément cliqué est la modal elle-même
        modal.style.display = "none"; // Cacher la modal
    }
}

// Fonction pour afficher un projet dans la modal
function displayProject(works) {
    // Création du code HTML pour afficher un projet avec une image et un bouton de suppression
    const cards = `
      <figure id="M${works?.id}" style="position: relative;"> <!-- Attribuer un ID unique à l'élément figure et positionner le relatif -->
          <img src="${works?.imageUrl}" crossOrigin="anonymous" style="width: 100%;"> <!-- Image du projet -->
          <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i> <!-- Icône de suppression avec un ID correspondant à l'ID du projet -->
      </figure>
    `;
    // Ajouter le projet à l'élément #products dans la modal
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

// Fonction pour afficher tous les projets dans la modal lors du clic sur "modifier"
function displayAllModal(e) {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire lors du clic

    // Vider le contenu de la galerie de projets dans la modal pour qu'il n'y ait pas de duplications
    document.querySelector(".galleryModal").innerHTML = "";

    // Boucle pour afficher tous les projets en appelant displayProject pour chaque projet
    for (let j = 0; j <= AllProjects.length - 1; j++) {
        displayProject(AllProjects[j]);
    }
}

// Ajouter un écouteur d'événements sur le bouton "modifier" pour afficher tous les projets dans la modal
update.addEventListener("click", displayAllModal);

// Récupération des éléments du DOM nécessaires pour le formulaire d'ajout de projets
const add = document.getElementById("button-add"); // Bouton pour passer au formulaire d'ajout
const content = document.getElementById("modal-content"); // Contenu actuel de la modal
const content2 = document.getElementById("next-modal-container"); // Contenu suivant de la modal (formulaire d'ajout)
const close2 = document.getElementById("close2"); // Bouton pour fermer la modal lors de l'ajout de projet

// Ajouter un écouteur d'événements sur le bouton "ajouter une photo" pour passer au contenu suivant dans la modal
add.addEventListener("click", function() {
    content.style.display = "none";  // Masquer le contenu actuel
    content2.style.display = "block";  // Afficher le contenu suivant
});

// Ajouter un écouteur d'événements sur le bouton "retour" pour revenir au contenu précédent dans la modal
const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block";  // Afficher le contenu actuel
    content2.style.display = "none";  // Masquer le contenu suivant
});

// Ajouter un écouteur d'événements sur le bouton "close2" pour fermer la modal
close2.addEventListener("click", function() {
    modal.style.display = "none";  // Cacher la modal
});

// Fonction pour supprimer un projet via l'API
function deleteProject(id) {
    // Envoyer une requête DELETE pour supprimer le projet spécifié par l'ID
    fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE", // Méthode HTTP pour supprimer une ressource
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"), // Ajouter le token d'authentification dans les en-têtes
        },
    })
    .then((result) => {
        if (result.status === 204) {  // Vérifier si la suppression a réussi (code 204 signifie "Aucun contenu")
            // Mettre à jour la liste des projets en filtrant celui qui a été supprimé
            AllProjects = AllProjects.filter(element => element.id != id);
            // Supprimer le projet de la modal en utilisant l'ID du projet
            document.getElementById("M" + id).remove();
            // Supprimer le projet de la page index en utilisant l'ID du projet
            document.getElementById("A" + id).remove();
        }
    })
    .catch((err) => {
        console.error(err);  // Afficher les erreurs éventuelles dans la console
    });
}

// Ajouter un écouteur d'événements pour supprimer un projet lorsque l'icône de suppression est cliquée
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {  // Vérifier si l'élément cliqué est une icône de suppression
        deleteProject(e.target.id);  // Appeler la fonction pour supprimer le projet
    }
});

// Ajouter un écouteur d'événements pour supprimer tous les projets lorsque le bouton de suppression est cliqué
deleteBtn.addEventListener("click", function() {
    for (let i = 0; i < AllProjects.length; i++) {
        deleteProject(AllProjects[i].id);  // Supprimer chaque projet en appelant deleteProject
    }
});

// Récupération des éléments du formulaire d'ajout
const form = document.getElementById("form");  // Le formulaire pour ajouter un projet
const title = document.getElementById("title");  // Champ pour le titre du projet
const category = document.getElementById("category");  // Champ pour la catégorie du projet
const imageUrl = document.getElementById("imageUrl");  // Champ pour l'URL de l'image du projet
const button = document.getElementById("submit");  // Bouton pour soumettre le formulaire

// Ajouter un écouteur d'événements sur le bouton de soumission du formulaire
button.addEventListener("click", function(e) {
    e.preventDefault();  // Empêche le comportement par défaut du bouton

    // Récupération des données du formulaire
    const data = {
        title: title.value,  // Récupérer le titre du projet
        category: category.value,  // Récupérer la catégorie du projet
        imageUrl: imageUrl.value,  // Récupérer l'URL de l'image du projet
    };

    // Envoyer une requête POST pour ajouter un nouveau projet via l'API
    fetch("http://localhost:5678/api/works", {
        method: "POST",  // Méthode HTTP pour créer une nouvelle ressource
        headers: {
            "Content-Type": "application/json",  // Indiquer que le corps de la requête contient des données JSON
            Authorization: "Bearer " + sessionStorage.getItem("token"),  // Ajouter le token d'authentification dans les en-têtes
        },
        body: JSON.stringify(data),  // Convertir les données du formulaire en JSON
    }).then((result) => {
        if (result.ok) {  // Vérifier si la requête a réussi
            result.json().then((dt) => {
                console.log(dt);  // Afficher les données du nouveau projet dans la console
            });
        }
    }).catch((err) => {
        console.error(err);  // Afficher les erreurs éventuelles dans la console
    });
});

// Fonction pour télécharger une image et l'afficher dans le formulaire
function telecharger() {
    var telecharger_image = "";  // Variable pour stocker l'image téléchargée
    const reader = new FileReader();  // Créer un lecteur de fichiers

    // Ajouter un écouteur d'événements pour lire le fichier lorsque le chargement est terminé
    reader.addEventListener("load", () => {
        telecharger_image = reader.result;  // Récupérer le contenu du fichier en tant qu'URL de données
        const photo = document.getElementById("image_telecharger");  // Élément pour afficher l'image téléchargée
        document.getElementById("image_telecharger_images").style.display = "block";  // Afficher l'image téléchargée
        photo.style.backgroundImage = `url(${telecharger_image})`;  // Définir l'image de fond pour afficher l'image téléchargée
        document.getElementById("ajout_container").style.display = "none";  // Masquer le conteneur d'ajout d'image
    });

    // Lire le contenu du fichier sélectionné
    reader.readAsDataURL(this.files[0]);
}

// Ajouter un écouteur d'événements pour déclencher la fonction de téléchargement d'image lorsque le champ de fichier change
document.getElementById("imageUrl").addEventListener("change", telecharger);

// Ajouter un écouteur d'événements pour ouvrir le sélecteur de fichiers lorsque le bouton "ajouter" est cliqué
document.getElementById('adding').addEventListener('click', function() {
    document.getElementById('imageUrl').click();  // Simuler un clic sur le champ de fichier pour ouvrir le sélecteur de fichiers
});

// Ajouter un écouteur d'événements pour soumettre le formulaire avec les données de l'image
button.addEventListener("click", (e) => {
    e.preventDefault();  // Empêche le comportement par défaut du bouton de soumission du formulaire

    // Récupération des éléments du formulaire
    const photo = document.getElementById("imageUrl");  // Champ de fichier pour l'image
    const category = document.getElementById("category");  // Champ de texte pour la catégorie
    const title = document.getElementById("title");  // Champ de texte pour le titre

    // Vérifier que tous les champs du formulaire sont remplis
    if (photo.value === "" || title.value === "" || category.value === "") {
        // Afficher un message d'erreur si un champ est vide
        document.getElementById("Error").innerHTML = "Il faut remplir le formulaire.";
    } else {
        document.getElementById("Error").innerHTML = "";  // Effacer le message d'erreur si tous les champs sont remplis

        // Envoyer une requête GET pour récupérer les catégories disponibles
        fetch("http://localhost:5678/api/categories").then((res) => {
            if (res.ok) {  // Vérifier si la requête a réussi
                res.json().then((categorydata) => {
                    // Vérifier si la catégorie sélectionnée existe dans les données récupérées
                    for (let i = 0; i <= categorydata.length - 1; i++) {
                        if (category.value == categorydata[i].name) {
                            const image = photo.files[0];  // Récupérer le fichier de l'image sélectionnée

                            // Vérifier si la taille de l'image dépasse la limite de 4 Mo
                            if (image.size > 4 * 1024 * 1024) {
                                document.getElementById("Error").innerHTML = "L'image ne doit pas dépasser 4Mo.";  // Afficher un message d'erreur
                                return;  // Arrêter la fonction si l'image est trop grande
                            } else {
                                document.getElementById("Error").innerHTML = "";  // Effacer le message d'erreur si la taille est correcte
                            }

                            // Créer un FormData pour envoyer l'image et les autres données du formulaire
                            let formData = new FormData();
                            formData.append("image", image);  // Ajouter l'image au FormData
                            formData.append("title", title.value);  // Ajouter le titre au FormData
                            formData.append("category", categorydata[i].name);  // Ajouter la catégorie au FormData

                            // Envoyer une requête POST pour ajouter le nouveau projet via l'API
                            fetch("http://localhost:5678/api/works", {
                                method: "POST",  // Méthode HTTP pour créer une nouvelle ressource
                                headers: {
                                    Authorization: `Bearer ${token}`,  // Ajouter le token d'authentification dans les en-têtes
                                },
                                body: formData,  // Envoyer les données du formulaire comme FormData
                            }).then((response) => {
                                if (response.ok) {  // Vérifier si la requête a réussi
                                    // Vider le contenu des projets affichés et récupérer la liste mise à jour des projets
                                    document.getElementById("products").innerHTML = "";
                                    fetch("http://localhost:5678/api/works")
                                        .then((res) => res.json())  // Récupérer les projets mis à jour
                                        .then((dt) => {
                                            AllProjects = dt;  // Mettre à jour la liste des projets
                                            for (let j = 0; j < AllProjects.length; j++) {
                                                displayProject(AllProjects[j]);  // Afficher chaque projet
                                            }
                                        });
                                }
                            }).catch((error) => {
                                console.error("Erreur:", error);  // Afficher les erreurs éventuelles
                            });
                        }
                    }
                });
            }
        });
    }
});
