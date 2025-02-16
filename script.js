const apiUrl = "https://tu-api-gratuita.com"; // Cambiar por la URL real

document.addEventListener("DOMContentLoaded", async () => {
    const apiStatus = document.getElementById("api-status");
    const wakeApiButton = document.getElementById("wake-api");
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const uploadButton = document.getElementById("upload-button");
    const loading = document.getElementById("loading");
    const message = document.getElementById("message");

    // Verificar estado de la API
    async function checkApiStatus() {
        try {
            const response = await fetch(`${apiUrl}/status`);
            if (response.ok) {
                apiStatus.textContent = "API Conectada";
                apiStatus.classList.remove("offline");
                apiStatus.classList.add("online");
                uploadButton.disabled = false;
            } else {
                throw new Error("API no disponible");
            }
        } catch {
            apiStatus.textContent = "API Desconectada";
            apiStatus.classList.remove("online");
            apiStatus.classList.add("offline");
            uploadButton.disabled = true;
        }
    }

    // Llamar a la API para activarla
    wakeApiButton.addEventListener("click", async () => {
        wakeApiButton.disabled = true;
        try {
            await fetch(`${apiUrl}/wake`);
            setTimeout(checkApiStatus, 5000); // Esperar 5s antes de verificar
        } catch {
            apiStatus.textContent = "Error al activar API";
            wakeApiButton.disabled = false;
        }
    });

    // Manejar la subida de archivos
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!fileInput.files.length) return;

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        uploadButton.disabled = true;
        loading.classList.remove("hidden");
        message.textContent = "";

        try {
            const response = await fetch(`${apiUrl}/upload/`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                message.textContent = "Archivo subido exitosamente.";
            } else {
                message.textContent = "Error al subir archivo.";
            }
        } catch {
            message.textContent = "No se pudo conectar con la API.";
        }

        uploadButton.disabled = false;
        loading.classList.add("hidden");
    });

    checkApiStatus(); // Verificar el estado al cargar la página
});
