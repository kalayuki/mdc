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

// Obtiene referencias de elementos del DOM
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskCategoria = document.getElementById("task-categoria");
const taskContainer = document.getElementById("task-container");

let currentTaskId = null; // Variable para almacenar el ID de la tarea en edición

// Función para eliminar una tarea
const eliminarTarea = (id) => deleteDoc(doc(db, 'task', id));

// Función para guardar una nueva tarea en Firestore
const saveTask = async (title, description, categoria) => {
  try {
    await addDoc(collection(db, "task"), { title, description, categoria });
    taskForm.reset();
    console.log("Tarea guardada correctamente");
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
};

// Función para obtener una tarea por ID para edición
const editarTarea = async (id) => {
  const docRef = doc(db, 'task', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() };
};

// Función para actualizar una tarea existente en Firestore
const updateTask = async (id, title, description, categoria) => {
  try {
    await updateDoc(doc(db, 'task', id), { title, description, categoria });
    console.log("Tarea actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
  }
};

// Función para mostrar las tareas en tiempo real en el DOM
const getTasksRealtime = () => {
  onSnapshot(collection(db, "task"), (querySnapshot) => {
    taskContainer.innerHTML = ""; // Limpia el contenedor

    querySnapshot.forEach((doc) => {
      const { title, description, categoria } = doc.data();
      const id = doc.id;

      taskContainer.innerHTML += `
        <tr>
          <td>${title}</td>
          <td>${description}</td>
          <td>${categoria}</td>
          <td class="actions">
            <button class="btn btn-primary btn-eliminar" data-id="${id}">Eliminar</button>
            <button class="btn btn-secondary btn-editar-presentacion" data-id="${id}">Editar</button>
          </td>
        </tr>
      `;
    });

    // Configura los eventos para los botones "Eliminar"
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
          await eliminarTarea(e.target.dataset.id);
          console.log("Tarea eliminada correctamente");
        }
      });
    });

    // Configura los eventos para los botones "Editar"
    document.querySelectorAll(".btn-editar-presentacion").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        currentTaskId = e.target.dataset.id;
        const task = await editarTarea(currentTaskId);

        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskCategoria.value = task.categoria;

        // Cambia el color de los campos a verde
        [taskTitle, taskDescription, taskCategoria].forEach(field => field.classList.add('edited'));
      });
    });
  });
};

// Inicializa la obtención en tiempo real de tareas al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  if (taskForm && taskContainer) {
    getTasksRealtime();
  }
});

// Evento de envío del formulario de tareas
taskForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = taskTitle.value.trim();
  const descripcion = taskDescription.value.trim().replace(/\s\s+/g, ' ');
  const categoria = taskCategoria.value.trim().toUpperCase();

  if (currentTaskId) {
    await updateTask(currentTaskId, titulo, descripcion, categoria);
    currentTaskId = null;
  } else {
    await saveTask(titulo, descripcion, categoria);
  }

  taskForm.reset();
  [taskTitle, taskDescription, taskCategoria].forEach(field => field.classList.remove('edited'));
});

// FORMULARIOS CURSOS

// Captura los elementos del DOM para los cursos
const cursosContainer = document.getElementById("task-cursos");
const cursoTitulo = document.getElementById("cursoTitulo");
const cursoLink = document.getElementById("LinkTitulo");
const cursoCategoria = document.getElementById("categoriCurso");
const cursoSubCategoria = document.getElementById("subCategoriaCurso");
const cursoForm = document.getElementById("form-curso");

let currentCursoId = null; // Variable para almacenar el ID del curso en edición

// Función para guardar un nuevo curso
const saveCurso = async (titulo, link, categoria, subCategoria) => {
  try {
    await addDoc(collection(db, "cursos"), { titulo, link, categoria, subCategoria });
    cursoForm.reset();
    console.log("Curso guardado correctamente");
  } catch (error) {
    console.error("Error al guardar el curso:", error);
  }
};

// Función para obtener un curso por ID
const getCursoById = async (id) => {
  const docRef = doc(db, 'cursos', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() };
};

// Función para actualizar un curso existente
const updateCurso = async (id, titulo, link, categoria, subCategoria) => {
  try {
    await updateDoc(doc(db, 'cursos', id), { titulo, link, categoria, subCategoria });
    console.log("Curso actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
  }
};

// Función para mostrar los cursos en tiempo real en el DOM
const getCursosRealtime = () => {
  onSnapshot(collection(db, "cursos"), (querySnapshot) => {
    cursosContainer.innerHTML = ""; // Limpia el contenedor

    querySnapshot.forEach((doc) => {
      const { titulo, link, categoria, subCategoria } = doc.data();
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

    // Configura los eventos para los botones "Eliminar"
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
          await deleteDoc(doc(db, 'cursos', e.target.dataset.id));
          console.log("Curso eliminado correctamente");
        }
      });
    });

    // Configura los eventos para los botones "Editar"
    document.querySelectorAll(".btn-editar-curso").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        currentCursoId = e.target.dataset.id;
        const curso = await getCursoById(currentCursoId);

        cursoTitulo.value = curso.titulo;
        cursoLink.value = curso.link;
        cursoCategoria.value = curso.categoria.toUpperCase();
        cursoSubCategoria.value = curso.subCategoria.toUpperCase();

        [cursoTitulo, cursoLink, cursoCategoria, cursoSubCategoria].forEach(field => field.classList.add('edited'));
      });
    });
  });
};

// Inicializa la obtención en tiempo real de cursos al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  if (cursoForm && cursosContainer) {
    getCursosRealtime();
  }
});

// Evento de envío del formulario de cursos
cursoForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = cursoTitulo.value.trim();
  const link = cursoLink.value.trim();
  const categoria = cursoCategoria.value.trim().toUpperCase();
  const subCategoria = cursoSubCategoria.value.trim().toUpperCase();

  if (currentCursoId) {
    await updateCurso(currentCursoId, titulo, link, categoria, subCategoria);
    currentCursoId = null;
  } else {
    await saveCurso(titulo, link, categoria, subCategoria);
  }

  cursoForm.reset();
  [cursoTitulo, cursoLink, cursoCategoria, cursoSubCategoria].forEach(field => field.classList.remove('edited'));
});
