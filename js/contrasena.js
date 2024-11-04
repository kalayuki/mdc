// Contraseña predefinida
const CORRECT_PASSWORD = "mdc";

// Verificar si la contraseña ya fue ingresada correctamente
window.onload = function() {
    if (localStorage.getItem("authenticated") === "true") {
        // Si ya está autenticado, mostrar el contenido principal
        document.getElementById("passwordScreen").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    }
};

// Función para verificar la contraseña
function checkPassword() {
    const passwordInput = document.getElementById("passwordInput").value;
    const errorMessage = document.getElementById("errorMessage");

    if (passwordInput === CORRECT_PASSWORD) {
        // Almacena el estado de autenticación en Local Storage
        localStorage.setItem("authenticated", "true");

        // Muestra el contenido principal y oculta la pantalla de contraseña
        document.getElementById("passwordScreen").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    } else {
        // Muestra un mensaje de error si la contraseña es incorrecta
        errorMessage.style.display = "block";
    }
}
