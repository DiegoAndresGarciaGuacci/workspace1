const catID = localStorage.getItem("catID"); //usar el ID de las categorias
const CARS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; /*hicimos la constante con la url*/

function sortCategories(criteria, array) { //funcion inspirada en la proporciona en categories.js
    let result = []; 
    const precioMin = parseFloat(document.getElementById("rangeFilterCountMin").value); //se obtiene el valor de los campos de precio
    const precioMax = parseFloat(document.getElementById("rangeFilterCountMax").value);
    if (criteria === "priceDes") {
        result = array.slice().sort((a, b) => a.cost - b.cost); //se organiza el array en orden descendente 
    } else if (criteria === "priceAsc") {
        result = array.slice().sort((a, b) => b.cost - a.cost); // se invierte la logica para ordenar de forma ascendente
    } else if (criteria === "relevancy") {
        result = array.slice().sort((a, b) => b.soldCount - a.soldCount); //se aplica el mismo orden pero para la cantidad vendida
    } else if (criteria === "rangePrice") {
        if (!isNaN(precioMin) && isNaN(precioMax)) {
            result = array.filter(product => product.cost >= precioMin); //se filtra el array segun el rango de precios
        } else if (isNaN(precioMin) && !isNaN(precioMax)) {
            result = array.filter(product => product.cost <= precioMax);
        } else if (!isNaN(precioMin) && !isNaN(precioMax)) {
            result = array.filter(product => product.cost >= precioMin && product.cost <= precioMax);
        } else {
            result = array; 
        }
    }
    return result;
}

function showCategoriesList(name, array) { /* funcion para mostrar los items con imagen, precio, nombre, currency y cantidad vendidos*/
    
    let title = `
    <div id="titulo-cat" class="text-center p-4">
        <h2>${name}</h2>
        <h5 class="lead">Los mejores productos, a los mejores precios.</h5>
    </div>`; //agrega el titulo de la categoria

    let htmlContentToAppend = ""
    //Itera entre los productos y crea elementos html para mostrarlos
    for (let i = 0; i < array.length; i++) {
        let product = array[i]; 
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action" id="${i}">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1"> 
                            <h4>${product.name} - ${product.currency}  ${product.cost}</h4>  
                            <p>${product.description}</p> 
                        </div>
                        <small class="text-muted">${product.soldCount} vendidos </small> 
                    </div>
                </div>
            </div>
        </div>`;
    }
     //inserta el contenido html
    document.getElementById("products-cat").innerHTML = htmlContentToAppend;
    document.getElementById("title").innerHTML = title;
}
//guarda el id del producto y te manda al html de product info de ese producto
function setProductId(productId) {
  localStorage.setItem("prodId", productId);
  console.log("ID del producto seleccionado:", productId);
  window.location.href = "product-info.html";
}
  //la funcion muestra y ordena los productos
function sortAndShow (criteria, array, name){
  currentArray = sortCategories(criteria, array)
  showCategoriesList(name, currentArray)
} 

fetch(CARS_URL)
  .then(response => response.json())
  .then(data => {
    const catName = data.catName;
    let productsArray = data.products;
    showCategoriesList(catName, productsArray);

    
      // Muestra los botones de productos
    for (let i = 0; i < productsArray.length; i++){
      console.log(document.getElementById(i))
      document.getElementById(i).addEventListener("click", function(){
        let product = productsArray[i];
        setProductId(product.id)
      });
    }
 
    document.getElementById("rangeFilterCount").addEventListener("click", function() { //agregamos un event para filtrar y ordenar los productos
      if (rangeFilterCountMin.value.trim() !== '' || rangeFilterCountMax.value.trim() !== '') {
        sortAndShow("rangePrice", productsArray, catName);
      } else {
        showCategoriesList(catName, productsArray);
      }
    });


    document.getElementById("sortAsc").addEventListener("click", function() { //por precio ascendente
      sortAndShow("priceAsc", productsArray, catName);
    });

    document.getElementById("sortDesc").addEventListener("click", function() { //por precio descendente
      sortAndShow("priceDes", productsArray, catName);
    });

    document.getElementById("sortByCount").addEventListener("click", function() { //por relevancia
      sortAndShow("relevancy", productsArray, catName);
    });

    
    document.getElementById("clearRangeFilter").addEventListener("click", function() {
      rangeFilterCountMin.value = ''; // campo precio min
      rangeFilterCountMax.value = ''; // campo precio max 
      showCategoriesList(catName, productsArray);
    });


    document.getElementById("query").addEventListener("input", function(e) {
        let value = e.target.value.trim().toLowerCase(); //obtener value del input, saca espacios en blanco y pasa a letra minuscula 
        if (value.length > 0) {
            const searched = productsArray.filter(product => (product.name.toLowerCase().includes(value)) || (product.description.toLowerCase().includes(value)) );
            showCategoriesList(catName, searched);
        } else {
            showCategoriesList(catName, productsArray);
        }
    });


  })
//si aparece un error nos va a salir en la consola un mensaje
  .catch(error => {
    console.error("Error al cargar los datos", error);
  });
