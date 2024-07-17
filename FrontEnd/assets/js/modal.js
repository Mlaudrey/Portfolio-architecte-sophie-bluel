const modal = document.getElementById("modal");
const update = document.getElementById("updates");
const close = document.getElementById("close");
const deleteBtn = document.getElementById("deleteBtn");

if (sessionStorage.getItem("token")) {
    // Vider le contenu existant de #updates pour éviter la duplication
    update.innerHTML = '';

    // Créer les éléments pour "modifier" et "updates"
    const modifier = document.createElement("div");
    modifier.id = "modifier";
    modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
    `;
    
    // Ajouter les éléments à #updates
    update.appendChild(modifier);
    
    // Afficher le bouton "modifier"
    update.style.display = "flex";
} else {
    update.style.display = "none";
}

update.addEventListener("click", function() {
    modal.style.display = "block";
});

close.addEventListener("click", function() {
    modal.style.display = "none";
});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function displayProject(works) {
    const cards = `
      <figure id="M${works?.id}">
          <img src="${works?.imageUrl}" crossOrigin="anonymous">
          <i id="${works.id}" class="fa-regular fa-trash-can trash-icon"></i>
      </figure>
    `;
    document.getElementById("products").insertAdjacentHTML("beforeend", cards);
}

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

function deleteProject(id) {
    fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    })
    .then((result) => {
        if (result.status === 204) {
            AllProjects = AllProjects.filter(element => element.id != id);
            document.getElementById("M" + id).remove();
            document.getElementById("A" + id)?.remove();
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("fa-trash-can")) {
        deleteProject(e.target.id);
    }
});

deleteBtn.addEventListener("click", function() {
    for (let i = 0; i < AllProjects.length; i++) {
        deleteProject(AllProjects[i].id);
    }
});

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
