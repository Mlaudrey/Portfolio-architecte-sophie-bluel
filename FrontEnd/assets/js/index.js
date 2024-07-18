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
    <figure id="A${work?.id}">
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

// Récupération de la liste des projets
fetch("http://localhost:5678/api/works")
    .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Erreur lors de la récupération des projets');
    })
    .then((data) => {
        console.log("Projets récupérés:", data);
        AllProjects = data; // Stockage de tous les projets dans la variable AllProjects
        addManualProject(); // Ajout d'un projet manuel à la liste
        displayProjects(AllProjects); // Appel de la fonction displayProjects pour afficher les projets
    })
    .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
    });

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
    gallery.innerHTML = ""; // Effacer le contenu actuel de la galerie
    projects.forEach(work => informations(work)); // Afficher chaque projet
}

// Fonction pour afficher les boutons de filtre
function displayFilter() {
    const btn = document.getElementById("btn"); // Élément contenant les boutons de filtre
    if (!btn) {
        console.error("Élément avec l'ID 'btn' non trouvé.");
        return;
    }
    allCategories.forEach(element => {
        const newButton = document.createElement("button");
        newButton.type = "button";
        newButton.innerHTML = element.name;
        newButton.className = "btnOpt";
        newButton.setAttribute("id", element.id);
        newButton.onclick = function() {
            filterProject(element.id); // Filtrage des projets par catégorie
            console.log(`Filtrage des projets par catégorie: ${element.name}`);
        };
        btn.appendChild(newButton); // Ajout du bouton à l'élément contenant les boutons de filtre
    });
}

// Fonction pour filtrer les projets par catégorie
function filterProject(categoryId) {
    let filteredProjects;
    if (categoryId === -1) {
        filteredProjects = AllProjects; // Afficher tous les projets
    } else {
        filteredProjects = AllProjects.filter(work => work.categoryId === categoryId); // Filtrer les projets par catégorie
    }
    displayProjects(filteredProjects); // Afficher les projets filtrés
}
