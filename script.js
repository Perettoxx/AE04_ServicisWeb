/**
 * Funció que busca un cocktail determinat a la API.
 * En cas de estar buit el TextInput recuperará tots el cocktails de la API.
 */
function buscarCocktails() {
    var query = document.getElementById('query').value;

    // URL de la API de cócteles
    var apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + query;

    axios.get(apiUrl)
        .then(function (response) {
            var data = response.data;
            var cocktails = data.drinks;
            mostrarCocktails(cocktails);
        })
        .catch(function (error) {
            alert("Error al buscar cockatils.");
            console.error(error);
        });
}

/**
 * Funció que mostra els cocktails donat un JSON
 * @param {JSON} cocktails JSON amb les dades dels cocktails
 */
function mostrarCocktails(cocktails) {
    var cocktailsDiv = document.getElementById('cocktails');
    cocktailsDiv.innerHTML = '';

    if (!cocktails) {
        alert("No s'han trobat cocktails amb eixe nom.'");
        return;
    }

    cocktails.forEach(function (cocktail) {
        var cocktailDiv = document.createElement('div');
        cocktailDiv.classList.add('cocktail');

        var nomCocktail = document.createElement('h2');
        nomCocktail.textContent = cocktail.strDrink;
        cocktailDiv.appendChild(nomCocktail);

        var imagenCocktail = document.createElement('img');
        imagenCocktail.src = cocktail.strDrinkThumb;
        imagenCocktail.alt = cocktail.strDrink;
        cocktailDiv.appendChild(imagenCocktail);

        var ingredients = document.createElement('p');
        ingredients.textContent = "Ingredients: ";
        for (var i = 1; i <= 15; i++) {
            var ingrediente = cocktail['strIngredient' + i];
            var medida = cocktail['strMeasure' + i];

            if (ingrediente && ingrediente.trim() !== "") {
                ingredients.textContent += ingrediente;
                if (medida && medida.trim() !== "") {
                    ingredients.textContent += " (" + medida + ")";
                }
                ingredients.textContent += ", ";
            } else {
                break;
            }
        }
        cocktailDiv.appendChild(ingredients);

        var instruccions = document.createElement('p');
        instruccions.textContent = "Instruccions: " + cocktail.strInstructions;
        cocktailDiv.appendChild(instruccions);

        var guardarButton = document.createElement('button');
        guardarButton.textContent = "Guardar";
        guardarButton.addEventListener('click', function () {
            guardarCocktail(cocktail.strDrink, cocktail.strDrinkThumb, ingredients.textContent, instruccions.textContent);
        });
        cocktailDiv.appendChild(guardarButton);

        cocktailsDiv.appendChild(cocktailDiv);
    });
}

/**
* Funció que guarda un cocktail a la BDD
**/
function guardarCocktail(nom, imagen, ingredients, instruccions) {
    var dades = {
        nombre: nom,
        imagen: imagen,
        ingredientes: ingredients,
        instrucciones: instruccions
    };

    $.ajax({
        type: "POST",
        url: "guardar_coctel.php",
        data: dades,
        success: function (response) {
            alert(response);
        },
        error: function () {
            alert("Error al guardar el cocktail");
        }
    });
}

/**
 * Funció que recupera un cocktail determinat de la BDD.
 * En cas de estar buit el TextInput recuperará tots el cocktails de la BDD.
 **/
function recuperarCocktails() {
    var inputValor = document.getElementById('query').value.trim();
    var cocktailsDiv = document.getElementById('cocktails');
    cocktailsDiv.innerHTML = '';

    let archivo;

    if (inputValor === "") {
        archivo = 'recuperar_todos.php';
    } else {
        archivo = 'recuperar_coctel.php?nombre=' + inputValor;
    }

    // Realizar la solicitud AJAX
    fetch(archivo)
        .then(response => response.json())
        .then(cocktails => {
            // Verificar si se encontraron cócteles
            if (cocktails.length === 0) {
                alert("No se encontraron cócteles.");
                return;
            }

            // Iterar sobre cada cóctel y mostrarlo en la página
            cocktails.forEach(cocktail => {
                var cocktailDiv = document.createElement('div');
                cocktailDiv.classList.add('cocktail');

                var nomCocktail = document.createElement('h2');
                nomCocktail.textContent = cocktail.nombre;
                cocktailDiv.appendChild(nomCocktail);

                var imagenCocktail = document.createElement('img');
                imagenCocktail.src = cocktail.imagen;
                imagenCocktail.alt = cocktail.nombre;
                cocktailDiv.appendChild(imagenCocktail);

                var ingredients = document.createElement('p');
                ingredients.textContent = cocktail.ingredientes;
                cocktailDiv.appendChild(ingredients);

                var instruccions = document.createElement('p');
                instruccions.textContent = cocktail.instrucciones;
                cocktailDiv.appendChild(instruccions);

                cocktailsDiv.appendChild(cocktailDiv);
            });
        })
        .catch(error => {
            console.error('Error al recuperar els cocktails:', error);
            alert("Error al recuperar els cocktails.");
        });
}