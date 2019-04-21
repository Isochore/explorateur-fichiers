window.onload = () => { // Au chargement de la page, fais un premier fetch 
    let files;
    let grille;
    renderResponse(".");
}

// Initialisation

let divPath = document.querySelector(".div_path");
let url_array = ["."];
let url_array_stock = [""];

window.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("fichier")) {
        if (event.target.getAttribute("data-path").split(".").length > 1) {
            event.target.style.cursor = "not-allowed";
            // event.target.style.pointerEvents = "none";

        }
    }
})

// Si on double click sur un icon, fais un fetch
window.addEventListener("dblclick", (event) => {
    // S'assure que l'on ne puisse pas double cliquer sur les boutons de navigation et l'arborescence
    if (containsClass("fichier") && event.target.getAttribute("data-path").split(".").length <= 1) {
        transitionOpacity(0.0);
        // Ajoute le dossier au chemin
        isDir(event.target.getAttribute("data-path"), false);
        // Render
        renderResponse(arrayToUrl(url_array));
    }
})

// Remplace le double click pour mobile
window.addEventListener("touchstart", (event) => {
    // S'assure que l'on ne puisse pas double cliquer sur les boutons de navigation et l'arborescence
    if (containsClass("fichier")) {
        transitionOpacity(0.0);
        // Ajoute le fichier au chemin
        isDir(event.target.getAttribute("data-path"), false);
        // Render
        renderResponse(arrayToUrl(url_array));
    }

})


/* Fonction qui permet de transformer notre tableau contenant les data-path cliqué en une url valide */
function arrayToUrl(array) {
    return array.toString().split(",").join("/");
}

// Fonction au click

window.addEventListener("click", (event) => {

    let allFichier = document.querySelectorAll('.fichier');

    for (i = 0; i < allFichier.length; i++) {
        allFichier[i].parentNode.classList.remove("backgroundParent");
    }

    if (containsClass("div_path")) {

        select();

    }

    if (event.target.classList.contains("fichier")) {
        event.target.parentNode.classList.add("backgroundParent");
    }
    // Si on clique sur un élément à gauche , fais un fetch
    if (containsClass("aside-elem")) {
        // Réinitialise le chemin à la racine
        transitionOpacity(0.0);
        url_array = ["."];
        url_array_stock = ["."];
        // Ajoute l'élément à gauche dans le chemin 
        isDir(event.target.getAttribute("data-path"), true);

    } else if (containsClass("home")) { // Si click sur le bouton accueil
        if (url_array.length > 1) {
            transitionOpacity(0.0);
        }
        url_array = ["."];
        url_array_stock = ["."];
        renderResponse(".");
    } else if (containsClass("back")) { // Si click sur le bouton précédent
        if (url_array.length > 1) {

            url_array.pop();
            transitionOpacity(0.0);
        }
        // if (url_array.length == 2) {
        //     url_array_stock = ["."];
        // } 
        renderResponse(arrayToUrl(url_array));
    } else if (containsClass("next")) { // Si click sur le bouton suivant
        // Ne push que s'il y a quelque chose à pusher
        if (url_array.length < url_array_stock.length) { // Vérifie que les deux tableaux ont une taille différente
            url_array.push(url_array_stock[url_array.length]);
            transitionOpacity(0.0);
            renderResponse(arrayToUrl(url_array))
        }


    }

})

// Fonction fetch

function renderResponse(data) {
    setTimeout(() => {
        fetch(`/explorateur_de_fichier/index.php?fichier=${data}`)
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                grille = document.querySelector("#grille");
                grille.innerHTML = response.grille;
                divPath.innerHTML = response.chemin;
                attributeCorrectIcon();
                transitionOpacity(1.0);

            })
            .catch((error) => {
                console.log(error)
            })
    }, 200)
}

// Fonction qui vérifie si la cible possède une extension
function isDir(path, aside) {
    if (path.split(".").length <= 1) {
        url_array.push(path);
        url_array_stock.push(path);
    }

    // Si click sur l'aside ajouter le chemin au tableau réinitialisé
    if (aside) {
        renderResponse(event.target.getAttribute("data-path"));
    }
}

/* Fonction qui prend le nom d'une classe en paramètre et qui retourne un booléen
 selon l'occurence ou non de la classe sur l'event */
function containsClass(classNom) {
    return event.target.classList.contains(classNom);
}

// Fonction qui attribue un icone en fonction de l'extension 
function attributeCorrectIcon() {
    let icons = document.querySelectorAll('.icon');
    for (let i = 0; i < icons.length; i++) {
        let extension = icons[i].getAttribute('data-path').split(".")[1]; // On découpe la chaine afin de récupérer l'extension
        switch (extension) {
            case undefined:
                // On change le chemin de l'image en fonction de son extension
                icons[i].setAttribute('src', "./img/icones/document.svg");
                break;
            case "lock":
                icons[i].setAttribute('src', "./img/icones/fichier_rempli.svg");
                break;
            case "md":
                icons[i].setAttribute('src', "./img/icones/readme.svg");
                break;
            case "html":
                icons[i].setAttribute('src', "./img/icones/chromium_logo.svg");
                break;
            case "git":
                icons[i].setAttribute('src', "./img/icones/git_logo.svg");
                break;
            case "json":
                icons[i].setAttribute('src', "./img/icones/json_logo.svg");
                break;
            case "css":
                icons[i].setAttribute('src', "./img/icones/fichier_css.svg");
                break;
            case "scss":
                icons[i].setAttribute('src', "./img/icones/fichier_scss.svg");
                break;
            case "svg":
                icons[i].setAttribute('src', "./img/icones/fichier_svg_logo.svg");
                break;
            case "twig":
                icons[i].setAttribute('src', "./img/icones/twig_logo.svg");
                break;
            case "php":
                icons[i].setAttribute('src', "./img/icones/php_logo.svg");
                break;
            case "js":
                icons[i].setAttribute('src', "./img/icones/fichier_js.svg");
                break;
            default:
                icons[i].setAttribute('src', "./img/icones/fichier_rempli.svg");
                break;
        }
    }
}

function transitionOpacity(opac) {
    let allElems = document.querySelectorAll(".elem");
    for (let elem of allElems) {
        elem.style.opacity = opac;
    }
}

function select() {
    let range = document.createRange();
    range.selectNodeContents(document.querySelector(".div_path")); 
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}