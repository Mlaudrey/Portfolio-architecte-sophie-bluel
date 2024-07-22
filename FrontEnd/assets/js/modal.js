document.addEventListener('DOMContentLoaded', () => {
    // Obtenez l'élément du lien d'authentification
    const authLink = document.getElementById('authLink');
    const token = sessionStorage.getItem('token');
    console.log('Token trouvé dans sessionStorage:', token);

    if (token) {
        authLink.textContent = 'Logout';
        authLink.href = '#';

        authLink.addEventListener('click', () => {
            console.log('Déconnexion en cours...');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            console.log('Token supprimé du sessionStorage');
            window.location.href = './login.html';
        });
    } else {
        authLink.textContent = 'Login';
        authLink.href = './login.html';
    }

    console.log('Lien d\'authentification:', authLink.textContent, 'Href:', authLink.href);
});

// Code pour le mode édition
const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");

if (sessionStorage.getItem("token")) {
    update.innerHTML = '';
    const modifier = document.createElement("div");
    modifier.id = "modifier";
    modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
    `;
    update.appendChild(modifier);
    update.style.display = "flex";

    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.textContent = 'Logout';
    }
} else {
    update.style.display = "none";
}

// Fonction pour réinitialiser les modales
function resetModals() {
    const content = document.getElementById("modal-content");
    const content2 = document.getElementById("next-modal-container");
    content.style.display = "block";
    content2.style.display = "none";
    modal.style.display = "none";
}

// Affichez le modal lorsque l'utilisateur clique sur le bouton "modifier"
update.addEventListener("click", function() {
    resetModals(); // Réinitialise les modales
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
    const cards = `
        <figure id="M${works?.id}">
            <img src="${works?.imageUrl}" crossOrigin="anonymous">
            <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
        </figure>
    `;
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

// Affichez tous les projets dans le modal
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

add.addEventListener("click", function() {
    content.style.display = "none";
    content2.style.display = "block";
});

const back = document.getElementById("back");
back.addEventListener("click", function() {
    content.style.display = "block";
    content2.style.display = "none";
});

close2.addEventListener("click", function() {
    modal.style.display = "none";
});

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {
        const projectId = e.target.id;
        console.log(`Suppression du projet avec l'ID ${projectId}`);
        deleteProject(projectId);
    }
});

function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Projet avec l'ID ${projectId} supprimé avec succès de la base de données.`);
            const projectElement = document.getElementById(`M${projectId}`);
            if (projectElement) {
                projectElement.remove();
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

const form = document.getElementById("form");
const title = document.getElementById("title");
const category = document.getElementById("category");
const imageUrl = document.getElementById("imageUrl");
const button = document.getElementById("submit");

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
                                } else {
                                    document.getElementById("Error").innerHTML = "Une erreur s'est produite lors de l'ajout du projet.";
                                }
                            });
                        }
                    }
                });
            }
        });
    }
});
