// si on est connecté on affiche une div 
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");
const deleteBtn = document.getElementById("deleteBtn");
//quand on est connecté on affiche le bouton modifier
if (sessionStorage.getItem("token")) {
    update.style.display = "block";
} else {
    update.style.display = "none";
}

// lorsqu'on click sur modifier on affiche une modal
update.addEventListener("click", function() {
    modal.style.display = "block";
});



// lorsqu'on click sur le bouton close on ferme la modal
close.addEventListener("click", function() {
    modal.style.display = "none";
});

// Quand l'utilisateur clique en dehors du modal, ferme le modal
window.onclick = function(event) {
    if (event.target == modal) { // si l'evenement est le modal on ferme le modal
        modal.style.display = "none";
    }
}


// affichage de produits avec fetch (work) dans la modal
function displayProject(works) { // fonction pour afficher les informations sur chaque projet dans le DOM 
    const cards = `
      <figure id ="M${works?.id}">
      <img src="${works?.imageUrl} "crossOrigin="anonymous">
       
        <i id ="${works.id}" class="fa-regular fa-trash-can "></i>
       
        </div>
             <figcaption>éditer</figcaption>
      </figure>
       `;
    document.getElementById("products").insertAdjacentHTML("beforeend", cards); //insertion de la variable cards dans le html avant la fin de la balise
}

function displayAllModal(e) {
    e.preventDefault(); //empêche le comportement par défaut du formulaire

    document.querySelector(".galleryModal").innerHTML = ""; // Effacement de l'élément HTML avec la classe .galleryModall
    // Boucle pour afficher tous les projets
    for (let j = 0; j <= AllProjects.length - 1; j++) {
        displayProject(AllProjects[j]); // Appel de la fonction displayProject pour afficher les informations sur chaque projet
    }

}

update.addEventListener("click", displayAllModal);

//quand on clique sur ajouter une photo on passe au content suivant modal
const add = document.getElementById("button-add");
const content = document.getElementById("modal-content");
const content2 = document.getElementById("next-modal-container");
const close2 = document.getElementById("close2");

add.addEventListener("click", function() {
    content.style.display = "none";
    content2.style.display = "block";
});

//quand on clique sur retour on passe au content précédent modal
const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block";
    content2.style.display = "none";
});

//quand on clique sur fermer on ferme la modal
close2.addEventListener("click", function() {
    modal.style.display = "none";
});

// Fonction pour supprimer un projet
function deleteProject(id) {
    fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
        .then((result) => {
            if (result.status === 204) { //si le status est 204 on supprime le projet

                console.log(result);
                AllProjects = AllProjects.filter(element => element.id != id); //filter les projets qui ont un id différent de celui qu'on veut supprimer
                console.log(AllProjects);
                document.getElementById("M" + id).remove(); //supprime le projet dans la modal
                document.getElementById("A" + id).remove(); //supprime le projet dans la page index

            }
        })
        .catch((err) => {
            console.error(err);
        });
}


// Suppression d'un projet
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) { //si on clique sur l'icone trash on supprime le projet
        deleteProject(e.target.id); //supprime le projet dans la modal et dans la page index
        // le e.target.id permet de récupérer l'id du projet sur lequel on a cliqué
    }
});

//suppression de tous les projets
deleteBtn.addEventListener("click", function() {
    for (let i = 0; i < AllProjects.length; i++) {
        deleteProject(AllProjects[i].id); // supprime tous les projets dans la modal et dans la page index 
        // le AllProjects[i].id permet de récupérer l'id de chaque projet

    }
});


const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

button.addEventListener("click", function(e) { //quand on clique sur le bouton submit on envoie les données dans la base de données
    e.preventDefault();
    const data = { //on récupère les données du formulaire
        title: title.value,
        category: category.value,
        imageUrl: imageUrl.value,
    };
    fetch("http://localhost:5678/api/works", { //on envoie les données dans la base de données
        method: "POST",
        headers: {
            "Content-Type": "application/json", //on précise le type de données 
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify(data), //on convertit les données en JSON
    }).then((result) => { //on récupère les données du formulaire
        if (result.ok) { //si le status est ok on affiche les données dans la console
            result.json().then((dt) => { //on récupère les données du formulaire
                console.log(dt);
            });
        }
    }).catch((err) => { //si le status est différent de ok on affiche l'erreur dans la console
        console.error(err);
    });
});


function telecharger() {
    var telecharger_image = "";
    const reader = new FileReader(); //permet de lire le contenu d'un fichier sous forme de flux de données 

    reader.addEventListener("load", () => { //permet de lire le contenu d'un fichier sous forme de flux de données
        telecharger_image = reader.result;
        const photo = document.getElementById("image_telecharger");
        document.getElementById("image_telecharger_images").style.display = "block";

        photo.style.backgroundImage = `url(${telecharger_image})`;
        document.getElementById("ajout_container").style.display = "none";
    });

    reader.readAsDataURL(this.files[0]);
    //readAsDataURL permet de lire le contenu d'un fichier sous forme de flux de données 

}

document.getElementById("imageUrl").addEventListener("change", telecharger);
document.getElementById('adding').addEventListener('click', function() {
    document.getElementById('imageUrl').click();
});

///////////////////Envoi des fichiers a API///////////////////

button.addEventListener("click", (e) => {
    e.preventDefault(); //annule le comportement par défaut du bouton submit


    // Récupération des éléments du formulaire
    const photo = document.getElementById("imageUrl");
    const category = document.getElementById("category");
    const title = document.getElementById("title");

    // Vérification que le formulaire est rempli
    if (photo.value === "" || title.value === "" || category.value === "") {
        document.getElementById("Error").innerHTML =
            "Il faut remplir le formulaire.";
    } else {
        document.getElementById("Error").innerHTML = "";

        // Récupération des catégories depuis l'API
        fetch("http://localhost:5678/api/categories").then((res) => { //on récupère les catégories depuis l'API
            console.log(res);
            if (res.ok) {
                res.json().then((categorydata) => { //.json() permet de récupérer les données en JSON 
                    //.then() permet de récupérer les données de la promesse 
                    // Parcours de la liste des catégories pour récupérer l'id correspondant à la catégorie sélectionnée
                    for (let i = 0; i <= categorydata.length - 1; i++) {
                        //length-1 car on commence à 0 et pas à 1 
                        if (category.value === categorydata[i].name) { //si la valeur de la catégorie est égale à la valeur de la catégorie dans la liste
                            categorydata[i].name = categorydata[i].id; //on récupère l'id de la catégorie correspondante 
                            console.log(categorydata[i].id);
                            console.log(category.value);

                            // Récupération de l'image et du token de l'utilisateur
                            const image = document.getElementById("imageUrl").files[0]; //recupere l'image 
                            let token = sessionStorage.getItem("token");
                            console.log(`Bearer  ${token}`); // Bearer permet d'authentifier l'utilisateur 
                            const title = document.getElementById("title").value;

                            // Vérification de la taille de l'image
                            if (image.size < 4 * 1048576) { // 1048576 = 1Mo 
                                // Création du formulaire pour l'envoi des données
                                const formData = new FormData(); //creation d'un objet de type formdata
                                //FormData permet de créer un ensemble de paires clé/valeur représentant les champs d'un formulaire et leurs valeurs.
                                formData.append("image", image); //ajout de l'image dans le formdata
                                formData.append("title", title); //ajout du titre dans le formdata
                                formData.append("category", categorydata[i].id); //ajout de la categorie dans le formdata

                                // Envoi des données à l'API via une requête POST
                                //async permet de définir une fonction asynchrone 
                                //await permet d'attendre la résolution d'une promesse 
                                const setNewProject = async(data) => { //fonction asynchrone pour envoyer les données a l'API       
                                    //fonction asynchnrone permet d'attendre la résolution d'une promesse 
                                    try { //essaye d'envoyer les données
                                        const requete = await fetch( //envoie les données a l'api

                                            "http://localhost:5678/api/works", {
                                                method: "POST",
                                                headers: {
                                                    Authorization: `Bearer ${token}`, //envoie le token de l'utilisateur
                                                    accept: "application/json", //accepte le format json
                                                },
                                                body: data,
                                            }
                                        );
                                        if (requete.status === 201) {
                                            document.getElementById("gallery").innerHTML = ""; //on vide la div gallery
                                            document.querySelector(".galleryModal").innerHTML = ""; //on vide la div galleryModal
                                            displayAllModal();


                                        } else {
                                            throw "Un problème est survenu";
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                };
                                setNewProject(formData); //appel de la fonction pour envoyer les données 
                                // parametre formData pour envoyer les données du formulaire 
                            } else {
                                // Affichage d'un message d'erreur si la taille de l'image est trop grande
                                document.getElementById("Error").innerHTML =
                                    "La taille de la photo est supérieure à 4 Mo.";

                                photo.value = null;
                                document.getElementById("ajout_container").style.display = null; //affiche le formulaire d'ajout
                                document.getElementById("image_telecharger_images").style.display = "none";
                            }
                            supprime(); //supprime les données du formulaire d'ajout quand on ferme la boite de dialogue 
                        }
                    }
                });
            }
        });
    }
});


function supprime() { //fonction pour supprimer les données du formulaire d'ajout
    // Suppression de l'affichage des données quand on ferme la boîte de dialogue d'ajout
    document.getElementById("ajout_container").style.display = null;
    document.getElementById("image_telecharger_images").style.display = "none";

    // Suppression des données de titre
    const input_titre_ajout = document.getElementById("title");
    input_titre_ajout.value = null;

    // Suppression de l'URL de la photo
    const input_photo_url = document.getElementById("imageUrl");
    input_photo_url.value = null;

    // Suppression des données de catégorie
    const category = document.getElementById("category");
    category.value = null;
}


//creation d'une div lorsqu'on est connecté
if (sessionStorage.getItem("token")) {


    const modifier = `
  
  <div id= "modifier">
    <i class="fa-regular fa-pen-to-square"></i>
    <p>modifier</p>
  </div>`;
    // Création d'un modèle de boîte de dialogue pour la modification
    const updates = `
  
        <a href ="#modal"></a>
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p> 
   `;
    // Ajout du bouton "modifier" dans la page
    document.getElementById("updates").insertAdjacentHTML("afterbegin", updates);

    document.getElementById("intro").insertAdjacentHTML("afterbegin", modifier);
    document.getElementById("introduction_photo").insertAdjacentHTML("beforeend", modifier);

}