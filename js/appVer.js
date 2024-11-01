// Importa las funciones necesarias de Firebase y Firestore desde las URLs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3_eY6y8aByTkYumsz37CIwCJxkzARlqA",
  authDomain: "crearcrudmdc.firebaseapp.com",
  projectId: "crearcrudmdc",
  storageBucket: "crearcrudmdc.appspot.com",
  messagingSenderId: "153120987977",
  appId: "1:153120987977:web:a475ed44d7d4ffadeb1898"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Contenedor donde se mostrarán las tarjetas
const contenedorTarjetas = document.getElementById("contenedorTarjetas");

// Función para obtener y mostrar datos de las dos colecciones
const mostrarDatos = () => {
  // Escucha cambios en la colección 'task'
  onSnapshot(collection(db, "task"), (taskSnapshot) => {
    contenedorTarjetas.innerHTML = ""; // Limpia el contenedor

    // Itera sobre cada documento de 'task'
    taskSnapshot.forEach((taskDoc) => {
      const taskData = taskDoc.data();
      const taskCategoria = taskData.categoria;

      // Crea el contenedor HTML de la tarjeta
      let tarjetaHtml = document.createElement("div");
      tarjetaHtml.className = "tarjeta";
      tarjetaHtml.innerHTML = `
        <div class="cuerpo__tarjeta">
          <h2 class="titulo__tarjeta">${taskData.title}</h2>
          <p>${taskData.description}</p>
          <div class="contenedor_de_curso">
          <button class="acordeon">Ver Cursos</button>
          <div id="contenido-${taskDoc.id}" class="contenido" style="display: none;"></div>
          <button id="cerrar-${taskDoc.id}" class="boton-cerrar" style="display: none;">Cerrar</button>
          </div>
        </div>
      `;

      // Añade el contenedor al DOM
      contenedorTarjetas.appendChild(tarjetaHtml);

      // Escucha cambios en la colección 'cursos' y filtra por categoría
      onSnapshot(collection(db, "cursos"), (cursoSnapshot) => {
        let cursosHtml = "";

        cursoSnapshot.forEach((cursoDoc) => {
          const cursoData = cursoDoc.data();

          // Verifica si la categoría del curso coincide con la categoría de la tarea
          if (cursoData.categoria === taskCategoria) {
            cursosHtml += `<a href="${cursoData.link}" target="_blank">${cursoData.titulo}</a><br>`;
          }
        });

        // Inserta los cursos filtrados en el contenedor correspondiente
        const contenidoDiv = document.getElementById(`contenido-${taskDoc.id}`);
        contenidoDiv.innerHTML = cursosHtml; // Actualiza el contenido del contenedor
      });

      // Agrega el evento 'click' al botón para mostrar/ocultar cursos
      const botonVerCursos = tarjetaHtml.querySelector(".acordeon");
      const botonCerrar = tarjetaHtml.querySelector(`#cerrar-${taskDoc.id}`);
      const contenidoDiv = tarjetaHtml.querySelector(`#contenido-${taskDoc.id}`);

      botonVerCursos.addEventListener("click", () => {
        contenidoDiv.style.display = "block"; // Muestra el contenido
        botonCerrar.style.display = "block"; // Muestra el botón "Cerrar"
        botonVerCursos.style.display = "none"; // Oculta el botón "Ver Cursos"
      });

      // Evento para ocultar el contenido y volver a mostrar el botón "Ver Cursos"
      botonCerrar.addEventListener("click", () => {
        contenidoDiv.style.display = "none"; // Oculta el contenido
        botonCerrar.style.display = "none"; // Oculta el botón "Cerrar"
        botonVerCursos.style.display = "block"; // Vuelve a mostrar el botón "Ver Cursos"
      });
    });
  });
};

// Llama a la función para mostrar los datos cuando se carga el DOM
document.addEventListener("DOMContentLoaded", mostrarDatos);







/*





const cursosArray = [
    { id: 1, titulo: "Competencias de Gestión", descripcion: "Cursos orientados a desarrollar habilidades en gestión y liderazgo.", categorias: "Contabilidad" },
    { id: 2, titulo: "Administración Financiera", descripcion: "Cursos diseñados para optimizar la administración y finanzas de empresas.", categorias: "Programación" }
];

const cursos= [

{
    id:"curso1", categoria:"Contabilidad", link:"....", nombre:"Contabilidad de Costos"
},

{
    id:"curso2", categoria:"Contabilidad", link:"....", nombre:"Contabilidad Financiera"
},
{
    id:"curso4", categoria:"Programación", link:"....", nombre:"PERRO"
},
{
    id:"curso5", categoria:"Programación", link:"....", nombre:"GATO"
},








]

window.onload = function() {
    let cardContainer = document.getElementById("contenedorTarjetas");

    cursosArray.forEach((cursoCategoria) => {
        // Filtrar los cursos que pertenecen a la misma categoría
        const cursosFiltrados = cursos.filter(curso => curso.categoria === cursoCategoria.categorias);

        // Crear el contenido del menú desplegable
        let cursosListado = cursosFiltrados.map(curso => `<a href="${curso.link}" target="_blank">${curso.nombre}</a>`).join("");

        // Crear la tarjeta con el acordeón para el listado de cursos
        cardContainer.innerHTML += `
            <div id="tarjeta-${cursoCategoria.id}" class="tarjeta">
                <div class ="cuerpo__tarjeta">
                <h2 class="titulo__tarjeta">${cursoCategoria.titulo}</h2>
                <p>${cursoCategoria.descripcion}</p>
                
                </div>
                <div class="deplegable__categoria">
                <div class="acordeon" onclick="toggleContenido(${cursoCategoria.id})">${cursoCategoria.categorias}</div>
            
                <div id="contenido-${cursoCategoria.id}" class="contenido">
                    ${cursosListado}
                    </div>
                </div>
                </div>
            </div>
        `;
    });
};

function toggleContenido(id) {
    const contenido = document.getElementById(`contenido-${id}`);
    contenido.style.display = (contenido.style.display === "block") ? "none" : "block";
}





/*
window.onload = function() {
    let card = document.getElementById("contenedorTarjetas");

    cursosArray.map((x) => {
        card.innerHTML += `
            <div id="${x.id}" class="tarjeta">
                <h2 class="titulo__tarjeta">${x.titulo}</h2>
                <p>${x.descripcion}</p>
                <div id="${x.categorias}" class="menu">${x.categorias}</div>
            </div>
        `;
    });
};

window.onload = function(){
    let menu = document.getElementById
}


*/
/*
const cursosArray = [
    {
        id: 1,
        titulo: "Competencias de Gestión",
        descripcion: "Cursos orientados a desarrollar habilidades en gestión y liderazgo.",
        categorias: "hola"[
            { 
                id: 1, 
                nombre: "Liderazgo", 
                cursos: [
                    { id: 1, nombre: "Liderazgo Transformacional" }, 
                    { id: 2, nombre: "Toma de Decisiones" }, 
                    { id: 3, nombre: "Capacidad Estratégica" }
                ] 
            },
            { 
                id: 2, 
                nombre: "Herramientas de Gestión", 
                cursos: [
                    { id: 4, nombre: "Planificación Estratégica" }, 
                    { id: 5, nombre: "Análisis de Procesos" }, 
                    { id: 6, nombre: "Gestión de Proyectos" }
                ] 
            },
            { 
                id: 3, 
                nombre: "Comunicación", 
                cursos: [
                    { id: 7, nombre: "Comunicación Efectiva" }, 
                    { id: 8, nombre: "Negociación" }, 
                    { id: 9, nombre: "Resolución de Conflictos" }
                ] 
            }
        ]
    },
    {
        id: 2,
        titulo: "Administración Financiera",
        descripcion: "Cursos diseñados para optimizar la administración y finanzas de empresas.",
        categorias: [
            { 
                id: 4, 
                nombre: "Contabilidad", 
                cursos: [
                    { id: 10, nombre: "Contabilidad Básica" }, 
                    { id: 11, nombre: "Contabilidad de Costos" }, 
                    { id: 12, nombre: "Contabilidad Financiera" }
                ] 
            },
            { 
                id: 5, 
                nombre: "Análisis Financiero", 
                cursos: [
                    { id: 13, nombre: "Análisis de Balance" }, 
                    { id: 14, nombre: "Ratios Financieros" }, 
                    { id: 15, nombre: "Flujo de Caja" }
                ] 
            },
            { 
                id: 6, 
                nombre: "Inversiones", 
                cursos: [
                    { id: 16, nombre: "Gestión de Portafolio" }, 
                    { id: 17, nombre: "Riesgo de Inversiones" }
                ] 
            }
        ]
    },
    {
        id: 3,
        titulo: "Programación",
        descripcion: "Cursos orientados a aprender habilidades en desarrollo de software y programación.",
        categorias: [
            { 
                id: 7, 
                nombre: "Desarrollo Web", 
                cursos: [
                    { id: 18, nombre: "HTML y CSS" }, 
                    { id: 19, nombre: "JavaScript Básico" }
                ] 
            },
            { 
                id: 8, 
                nombre: "Backend", 
                cursos: [
                    { id: 20, nombre: "Node.js" }, 
                    { id: 21, nombre: "Bases de Datos SQL" }
                ] 
            },
            { 
                id: 9, 
                nombre: "Desarrollo Móvil", 
                cursos: [
                    { id: 22, nombre: "Flutter Básico" }, 
                    { id: 23, nombre: "Android con Kotlin" }
                ] 
            }
        ]
    }
];

*/

// Ejemplo de acceso a los cursos
console.log(cursos);

// accedemos al div de contenedor de las tarjetas 

// window.onload = function() {
//     let card = document.getElementById("contenedorTarjetas");
//     console.log(card)

//     cursosArray.map((x) => {
//         card.innerHTML += `
//             <div id=${x.id} class="tarjeta">
//                 <h2 class="titulo__tarjeta">${x.titulo}</h2>
//                 <p>${x.descripcion}</p>
//                 <div>${x.categorias}</div>
//             </div>
//         `;
//     });
// };








/*



const contenedorTarjetas = document.getElementById('contenedorTarjetas');

// Verificar si el contenedor existe en el DOM
if (!contenedorTarjetas) {
    console.error("No se encontró el contenedor con el ID 'contenedorTarjetas' en el DOM");
} else {
    // Recorremos el array de cursos y generamos el HTML
    cursosArray.forEach(curso => {
        const categoriasHTML = curso.categorias.map(categoria => {
            const cursosHTML = categoria.cursos.map(cursoObj => 
                `<li><a href="formulario_inscripcion.html?id=${cursoObj.id}">${cursoObj.nombre}</a></li>`
            ).join('');
            
            return `
                <div class="contenedor__menu__tarjeta__desplegable">
                    <a href="#" onclick="toggleDesplegable('desplegable-${curso.id}-${categoria.id}')">${categoria.nombre}</a>
                    <p class="cantidad__de__cursos">Ver ${categoria.cursos.length} capacitaciones</p>
                    <div id="desplegable-${curso.id}-${categoria.id}" class="contendor__desplegable" style="display: none;">
                        <ul>${cursosHTML}</ul>
                    </div>
                </div>
            `;
        }).join('');
        
        const tarjetaHTML = `
            <div class="tarjeta">
                <h2 class="titulo__tarjeta">${curso.titulo}</h2>
                <p>${curso.descripcion}</p>
                <div>${categoriasHTML}</div>
            </div>
        `;
        
        contenedorTarjetas.insertAdjacentHTML('beforeend', tarjetaHTML);
    });
}

// Función para mostrar/ocultar los cursos en cada categoría
function toggleDesplegable(id) {
    const desplegable = document.getElementById(id);
    if (desplegable) {
        console.log("Toggle desplegable:", id); // Depuración
        desplegable.style.display = desplegable.style.display === 'none' ? 'block' : 'none';
    } else {
        console.error("No se encontró el desplegable con id:", id);
    }
}*/