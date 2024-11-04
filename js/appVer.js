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
          <div id="contenido-${taskDoc.id}" class="contenido " style="display: none;"></div>
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







