// Fonction pour ajouter la bannière du mode édition
function addEditModeBanner() {
    // Création de la div pour le mode édition
    const editModeDiv = document.createElement('div');
    editModeDiv.id = 'edit-mode';
    editModeDiv.className = 'edit-mode';
    editModeDiv.innerHTML = `
        <i class="fa-regular fa-pen-to-square edit-icon"></i>
        <span class="edit-text">Mode édition</span>
    `;

    // Insérer la div en tête de page
    document.body.insertBefore(editModeDiv, document.body.firstChild);
}

// Vérifie la présence du token dans le sessionStorage pour déterminer si l'utilisateur est en mode édition
const token = sessionStorage.getItem('token');
if (token) {
    console.log("Token trouvé dans sessionStorage:", token);
    // Appeler la fonction pour ajouter la div de mode édition
    addEditModeBanner();
} else {
    console.log("Token non trouvé dans sessionStorage");
}

// Sélection de l'élément de la galerie
const gallery = document.querySelector(".gallery");
console.log("Élément de la galerie sélectionné:", gallery);

// Fonction pour afficher les informations sur chaque projet
function informations(work) {
    const card = `
    <figure id="A${work?.id}">
      <img src="${work?.imageUrl}" crossOrigin="anonymous" alt="${work?.title}"> <!-- Ajout de l'attribut alt pour l'accessibilité -->
      <figcaption>${work?.title}</figcaption>
    </figure>`;
    document.querySelector(".gallery").insertAdjacentHTML("beforeend", card);
    console.log(`Projet ajouté à la galerie: ${work?.title}`);
}

// Tableau pour stocker tous les projets
let AllProjects = [];

// Tableau pour stocker toutes les catégories, incluant une catégorie "Tous"
let allCategories = [{
    "id": -1,
    "name": "Tous"
}];

// Récupération de la liste des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then((res) => {
        if (res.ok) return res.json(); // Récupération de toutes les catégories 
        throw new Error('Erreur lors de la récupération des catégories');
    })
    .then((categories) => {
        console.log("Catégories récupérées:", categories);
        // Ajoute les catégories récupérées au tableau allCategories
        categories.forEach(element => {
            allCategories.push(element);
        });
        // Affiche les boutons de filtre uniquement si l'utilisateur n'est pas en mode édition
        if (!sessionStorage.getItem("token")) {
            displayFilter();
        }
    })
    .catch((err) => {
        console.error("Erreur lors de la récupération des catégories:", err);
    });

// Récupération de la liste des projets depuis l'API
fetch("http://localhost:5678/api/works")
    .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Erreur lors de la récupération des projets');
    })
    .then((data) => {
        console.log("Projets récupérés:", data);
        AllProjects = data; // Stockage de tous les projets dans la variable AllProjects
        displayProjects(AllProjects); // Affiche tous les projets
    })
    .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
    });

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
    gallery.innerHTML = ""; // Efface le contenu actuel de la galerie
    projects.forEach(work => informations(work)); // Affiche chaque projet
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
        filteredProjects = AllProjects; // Affiche tous les projets
    } else {
        filteredProjects = AllProjects.filter(work => work.categoryId === categoryId); // Filtre les projets par catégorie
    }
    displayProjects(filteredProjects); // Affiche les projets filtrés
}
