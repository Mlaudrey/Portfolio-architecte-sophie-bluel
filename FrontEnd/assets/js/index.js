const gallery = document.querySelector(".gallery");
console.log("Élément de la galerie sélectionné:", gallery);

// Vérifie la présence du token dans le sessionStorage
const token = sessionStorage.getItem('token');
if (token) {
    console.log("Token trouvé dans sessionStorage:", token);
} else {
    console.log("Token non trouvé dans sessionStorage");
}

function informations(work) { // Fonction pour afficher les informations sur chaque projet
    const card = `
    <figure id ="A${work?.id}">
      <img src="${work?.imageUrl}" crossOrigin="anonymous" alt="${work?.title}"> <!-- Ajout de l'attribut alt pour l'accessibilité -->
      <figcaption>${work?.title}</figcaption>
    </figure>`;
    document.querySelector(".gallery").insertAdjacentHTML("beforeend", card);
    console.log(`Projet ajouté à la galerie: ${work?.title}`);
}

let AllProjects = []; // Tableau de tous les projets
let allCategories = [{
    "id": -1,
    "name": "Tous"
}]; // Tableau de catégories avec un élément "Tous" pour afficher tous les projets

// Fonction pour ajouter manuellement un projet
function addManualProject() {
    // Création d'un projet manuel
    const manualProject = {
        id: 5, 
        title: "Structures Thermopolis",
        imageUrl: "./assets/images/structures-thermopolis.png", 
        categoryId: 1 
    };
    
    AllProjects.push(manualProject); // Ajoute le projet au tableau AllProjects
    console.log("Projet ajouté manuellement:", manualProject);
}

// Récupération de la liste des catégories
fetch("http://localhost:5678/api/categories")
    .then((res) => {
        if (res.ok) return res.json(); // Récupération de toutes les catégories 
        throw new Error('Erreur lors de la récupération des catégories');
    })
    .then((categories) => {
        console.log("Catégories récupérées:", categories);
        // Création d'un bouton pour chaque catégorie
        categories.forEach(element => {
            allCategories.push(element); // Ajouter les catégories dans le tableau allCategories
        });
        // Cacher le bouton all si l'utilisateur est connecté
        if (!sessionStorage.getItem("token")) {
            displayFilter(); // Appel de la fonction displayFilter pour afficher les boutons de filtre dans le DOM
        }
    })
    .catch((err) => {
        console.error("Erreur lors de la récupération des catégories:", err);
    });

// Appeler addManualProject ici pour ajouter le projet avant d'afficher tous les projets
addManualProject();

// Fonction pour afficher tous les projets dans le DOM
function displayAll() {
    fetch("http://localhost:5678/api/works")
    .then((res) => {
        if (res.ok) {
            return res.json(); // Récupération de tous les projets
        }
        throw new Error('Erreur lors de la récupération des projets');
    })
    .then((data) => {
        console.log("Projets récupérés:", data);
        AllProjects = data; // Met à jour le tableau AllProjects avec les données récupérées
        // Ajoute le projet manuel aux projets récupérés
        addManualProject(); 
        // Affiche tous les projets
        displayProjects(AllProjects); // Appelle la fonction displayProjects pour afficher tous les projets
    })
    .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
    });
}

// Appeler displayAll ici après avoir ajouté le projet
displayAll();

// Fonction pour afficher tous les projets dans le DOM
function displayProjects(tableauProjects) {
    document.querySelector(".gallery").innerHTML = ""; // Effacement de l'élément HTML avec la classe .gallery

    for (let i = 0; i < tableauProjects.length; i++) { // Boucle pour afficher tous les projets
        informations(tableauProjects[i]); // Appel de la fonction informations pour afficher les informations sur chaque projet
    }
}

// Fonction pour afficher les boutons de filtre dans le DOM
function displayFilter() {
    const btn = document.getElementById("btn"); // Récupération de l'élément HTML avec l'id btn
    allCategories.forEach(element => { // Création d'un bouton pour chaque catégorie
        const newButton = document.createElement("button"); // Création d'un bouton
        newButton.type = "button"; // Ajout d'un type "button" pour chaque bouton
        newButton.innerHTML = element.name; // Ajout d'un nom pour chaque bouton (nom de la catégorie)
        newButton.className = "btnOpt"; // Ajout d'une classe pour chaque bouton    
        newButton.setAttribute("id", element.id); // Ajout d'un id pour chaque bouton (id de la catégorie)
        newButton.onclick = function() { // Ajout d'un événement au clic sur chaque bouton
            filterProject(element.id); // Appel de la fonction filterProject pour afficher les projets de la catégorie sélectionnée
            console.log(`Filtrage des projets par catégorie: ${element.name}`);
        };
        btn.appendChild(newButton); // Ajout du bouton dans l'élément HTML avec l'id btn
    });
}

// Fonction pour afficher les projets de la catégorie sélectionnée
function filterProject(idCategory) {
    if (idCategory == -1) {
        displayProjects(AllProjects); // Afficher tous les projets
        console.log("Affichage de tous les projets");
    } else {
        const newTable = AllProjects.filter(element => element.categoryId == idCategory); // Filtrage des projets par catégorie
        displayProjects(newTable); // Afficher les projets de la catégorie sélectionnée
        console.log(`Affichage des projets pour la catégorie ID: ${idCategory}`);
    }
}

// Changer login par logout si l'utilisateur est connecté
if (sessionStorage.getItem("token")) {
    document.getElementById("btnLogin").innerHTML = "logout";
    document.getElementById("modify").style.backgroundColor = "black";

    const modification = `
    <div>
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>  
    </div>`;
    
    // Création du bouton de mode édition
    const edition = document.createElement("p"); // Création d'un paragraphe 
    edition.type = "button"; // Ajout d'un type bouton
    edition.insertAdjacentHTML("afterbegin", modification); // Ajout du bouton modifier dans la page 
    edition.className = "edition"; // Ajout de la classe edition
    const container = document.getElementById("container");
    container.appendChild(edition);

    const changment = document.createElement("div"); // Création d'un conteneur pour le bouton de changement
    changment.onclick = function() {}; // Fonction vide pour le bouton (ajustez selon les besoins)
    const changements = document.getElementById("modify");
    changements.appendChild(changment);
} else {
    document.getElementById("btnLogin").innerHTML = "login";
}

// Fonction de déconnexion
function deconnexion() {
    sessionStorage.removeItem("token");
    console.log("Déconnexion réussie");
}
document.getElementById("btnLogin").addEventListener("click", deconnexion);
