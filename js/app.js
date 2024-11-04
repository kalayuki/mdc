// Importa las funciones necesarias de Firebase y Firestore desde las URLs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase para tu proyecto específico
const firebaseConfig = {
  apiKey: "AIzaSyA3_eY6y8aByTkYumsz37CIwCJxkzARlqA",
  authDomain: "crearcrudmdc.firebaseapp.com",
  projectId: "crearcrudmdc",
  storageBucket: "crearcrudmdc.appspot.com",
  messagingSenderId: "153120987977",
  appId: "1:153120987977:web:a475ed44d7d4ffadeb1898"
};

// Inicializa Firebase y configura Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Captura el formulario del DOM por su ID para manejar el envío de tareas
const taskForm = document.getElementById("task-form");
// Captura los campos del formulario
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskCategoria = document.getElementById("task-categoria");
// Captura el contenedor de tareas donde se mostrarán las tareas obtenidas de Firestore
const taskContainer = document.getElementById("task-container");

// ID de tarea actual para la edición
let currentTaskId = null;

// Función para eliminar una tarea por su ID
const eliminarTarea = (id) => deleteDoc(doc(db, 'task', id));

// Función para guardar una nueva tarea en Firestore
const saveTask = async (title, description, categoria) => {
  try {
    await addDoc(collection(db, "task"), {
      title: title,
      description: description,
      categoria: categoria
    });
    taskForm.reset(); // Limpia el formulario después de guardar la tarea
    console.log("Tarea guardada correctamente");
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
};

// Función para editar una tarea por su ID
const editarTarea = async (id) => {
  const docRef = doc(db, 'task', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() }; // Devuelve el ID y los datos del documento
};

// Función para actualizar una tarea en Firestore
const updateTask = async (id, title, description, categoria) => {
  try {
    await updateDoc(doc(db, 'task', id), {
      title: title,
      description: description,
      categoria: categoria
    });
    console.log("Tarea actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
  }
};

// Función para obtener las tareas en tiempo real y mostrarlas en el DOM
const getTasksRealtime = () => {
  onSnapshot(collection(db, "task"), (querySnapshot) => {
    taskContainer.innerHTML = ""; // Limpia el contenedor de tareas

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const title = task.title;
      const description = task.description;
      const category = task.categoria;
      const id = doc.id;

      taskContainer.innerHTML += `
        <tr>
          <td>${title}</td>
          <td>${description}</td>
          <td>${category}</td>
          <td class="actions">
            <button class="btn btn-primary btn-eliminar" data-id="${id}">Eliminar</button>
            <button class="btn btn-secondary btn-editar-presentacion" data-id="${id}">Editar</button>
          </td>
        </tr>
      `;
    });

    // Selecciona todos los botones de eliminar después de actualizar el DOM
    const btnEliminar = document.querySelectorAll('.btn-eliminar');

    // Agrega un evento de clic a cada botón de eliminar
    btnEliminar.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        
        if (confirmDelete) {
          await eliminarTarea(e.target.dataset.id);
          console.log("Tarea eliminada correctamente");
        } else {
          console.log("Eliminación cancelada");
        }
      });
    });

    // Selecciona todos los botones de editar
    const btnEditar = document.querySelectorAll(".btn-editar-presentacion");

    btnEditar.forEach(btn => {
      btn.addEventListener("click", async e => {
        currentTaskId = e.target.dataset.id; // Obtener el ID del documento
        const task = await editarTarea(currentTaskId); // Obtener la tarea

        // Muestra los datos de la tarea en el formulario
        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskCategoria.value = task.categoria;

        // Cambia el color de los campos a verde
        taskTitle.classList.add('edited');
        taskDescription.classList.add('edited');
        taskCategoria.classList.add('edited');
      });
    });
  });
};

// Evento para obtener y mostrar tareas en tiempo real cuando se carga el DOM
window.addEventListener("DOMContentLoaded", () => {
  getTasksRealtime(); // Llama a la función para actualizar las tareas en tiempo real
});

// Evento de envío del formulario de tareas
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la página

  const titulo = taskTitle.value.trim();
  const descripcion = taskDescription.value.trim().replace(/\s\s+/g, ' ');
  const categoria = taskCategoria.value.trim().toUpperCase();
  
  if (currentTaskId) {
    // Si hay un ID de tarea actual, se trata de una actualización
    await updateTask(currentTaskId, titulo, descripcion, categoria);
    currentTaskId = null; // Resetea el ID de tarea actual
  } else {
    // Si no hay ID, se trata de una nueva tarea
    await saveTask(titulo, descripcion, categoria);
  }

  // Limpia el formulario después de guardar o actualizar la tarea
  taskForm.reset();

  // Regresa los campos a su color normal
  taskTitle.classList.remove('edited');
  taskDescription.classList.remove('edited');
  taskCategoria.classList.remove('edited');
});


//************************************************************************************************************** */
//*************************************************************************************************************** */

//FORMULARIOS CURSOS 

// Captura el contenedor de cursos y los campos del formulario
const cursosContainer = document.getElementById("task-cursos");
const cursoTitulo = document.getElementById("cursoTitulo");
const cursoLink = document.getElementById("LinkTitulo");
const cursoCategoria = document.getElementById("categoriCurso");
const cursoSubCategoria = document.getElementById("subCategoriaCcurso");
const cursoForm = document.getElementById("form-curso");

// ID de curso actual para edición
let currentCursoId = null;

// Función para guardar un nuevo curso
const saveCurso = async (titulo, link, categoria, subCategoria) => {
  try {
    await addDoc(collection(db, "cursos"), {
      titulo: titulo,
      link: link,
      categoria: categoria,
      subCategoria: subCategoria
    });
    cursoForm.reset();
    console.log("Curso guardado correctamente");
  } catch (error) {
    console.error("Error al guardar el curso:", error);
  }
};

// Función para obtener cursos en tiempo real
const getCursosRealtime = () => {
  onSnapshot(collection(db, "cursos"), (querySnapshot) => {
    cursosContainer.innerHTML = ""; // Limpia el contenedor de cursos

    querySnapshot.forEach((doc) => {
      const curso = doc.data();
      const titulo = curso.titulo;
      const link = curso.link;
      const categoria = curso.categoria;
      const subCategoria = curso.subCategoria;
      const id = doc.id;

      cursosContainer.innerHTML += `
        <tr>
          <td>${titulo}</td>
          <td><a href="${link}" target="_blank">Ver Curso</a></td>
          <td>${categoria}</td>
          <td>${subCategoria}</td>
          <td class="actions">
            <button class="btn btn-primary btn-eliminar" data-id="${id}">Eliminar</button>
            <button class="btn btn-secondary btn-editar-curso" data-id="${id}">Editar</button>
          </td>
        </tr>
      `;
    });

    // Manejo de eventos para los botones "Eliminar"
    const btnEliminarCurso = document.querySelectorAll('.btn-eliminar');
    btnEliminarCurso.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este curso?");
        
        if (confirmDelete) {
          await deleteDoc(doc(db, 'cursos', e.target.dataset.id));
          console.log("Curso eliminado correctamente");
        } else {
          console.log("Eliminación cancelada");
        }
      });
    });

    // Manejo de eventos para los botones "Editar"
    const btnEditarCurso = document.querySelectorAll(".btn-editar-curso");
    btnEditarCurso.forEach(btn => {
      btn.addEventListener("click", async e => {
        currentCursoId = e.target.dataset.id;
        const curso = await getCursoById(currentCursoId);

        // Mostrar datos del curso en el formulario
        cursoTitulo.value = curso.titulo;
        cursoLink.value = curso.link;
        cursoCategoria.value = curso.categoria.toUpperCase();
        cursoSubCategoria.value = curso.subCategoria.toUpperCase();

        // Cambiar color de los campos
        cursoTitulo.classList.add('edited');
        cursoLink.classList.add('edited');
        cursoCategoria.classList.add('edited');
        cursoSubCategoria.classList.add('edited');
      });
    });
  });
};

// Función para obtener un curso por ID para edición
const getCursoById = async (id) => {
  const docRef = doc(db, 'cursos', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() };
};

// Función para actualizar curso
const updateCurso = async (id, titulo, link, categoria, subCategoria) => {
  try {
    await updateDoc(doc(db, 'cursos', id), {
      titulo: titulo,
      link: link,
      categoria: categoria,
      subCategoria: subCategoria
    });
    console.log("Curso actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
  }
};

// Evento para obtener y mostrar cursos en tiempo real
window.addEventListener("DOMContentLoaded", () => {
  getCursosRealtime();
});

// Evento de envío del formulario de cursos
cursoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = cursoTitulo.value.trim();
  const link = cursoLink.value.trim();
  const categoria = cursoCategoria.value.trim();
  const subCategoria = cursoSubCategoria.value.trim();

  if (currentCursoId) {
    // Actualización de curso
    await updateCurso(currentCursoId, titulo, link, categoria, subCategoria);
    currentCursoId = null;
  } else {
    // Nuevo curso
    await saveCurso(titulo, link, categoria, subCategoria);
  }

  // Limpieza del formulario
  cursoForm.reset();

  // Restauración de estilo de los campos
  cursoTitulo.classList.remove('edited');
  cursoLink.classList.remove('edited');
  cursoCategoria.classList.remove('edited');
  cursoSubCategoria.classList.remove('edited');
});



