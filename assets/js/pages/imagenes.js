import { subirImagen, listarTodasLasImagenes,eliminarImagen } from "../services/imagenServicio.js"; 

// --- Selección de Elementos del DOM ---
const uploadForm = document.getElementById('uploadImageForm');
const galleryContainer = document.getElementById('imageGallery');
const messageDiv = document.getElementById('uploadMessage');
const BACKEND_HOST = "http://localhost:8080";

// --- 1. RENDERIZADO DE LA GALERÍA ---
async function renderGallery() {
    galleryContainer.innerHTML = '<p id="loadingMessage">Cargando imágenes...</p>';
    
    try {
        // Ahora se espera que esto devuelva una List<Imagenes> (objetos) del backend
        const imagenes = await listarTodasLasImagenes();
        galleryContainer.innerHTML = ''; // Limpiar el mensaje de carga

        if (imagenes.length === 0) {
            galleryContainer.innerHTML = '<p>No hay imágenes subidas todavía.</p>';
            return;
        }

        imagenes.forEach(img => {
            
            const fullImageUrl = `${BACKEND_HOST}${img.ruta}`; 
            const id = img.idImagen || 'unknown'; 
            const alt = img.altText || 'Imagen subida'; 
            
            const imgElement = document.createElement('div');
            imgElement.className = 'item-imagen';
            imgElement.dataset.id = id; 
            
            imgElement.innerHTML = `
                <img src="${fullImageUrl}" alt="${alt}"> 
                <span class="selector-imagen"><i class="fas fa-trash-alt" data-id="${id}"></i></span>
            `;
            galleryContainer.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Error al renderizar galería (JS):", error);
        // Mostrar un mensaje de error más específico si es posible
        galleryContainer.innerHTML = `<p style="color: red;">Error al cargar la galería de imágenes. ${error.message || 'Verifica la consola.'}</p>`;
    }
}

// --- 2. MANEJO DE LA SUBIDA ---
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('imageFile');
    const altTextInput = document.getElementById('altText');
    const userIdInput = document.getElementById('userId');
    
    if (!fileInput.files[0]) {
        messageDiv.textContent = 'Por favor, seleccione un archivo.';
        return;
    }

    messageDiv.textContent = 'Subiendo imagen...';
    
    try {
        const nuevaImagen = await subirImagen(
            fileInput.files[0], 
            Number(userIdInput.value), 
            altTextInput.value
        );

        messageDiv.textContent = `✅ Imagen '${nuevaImagen.nombreArchivo}' subida con éxito!`;
        uploadForm.reset(); 
        await renderGallery(); 
        
    } catch (error) {
        console.error("Error al subir imagen:", error);
        messageDiv.textContent = `❌ Error al subir: ${error.message}`;
    }
});

galleryContainer.addEventListener('click', async (e) => {
    // Verificar si el clic fue en el ícono de la papelera
    if (e.target.classList.contains('fa-trash-alt')) {
        const idImagen = e.target.dataset.id; 

        if (!idImagen || idImagen === 'unknown') {
            messageDiv.textContent = '❌ Error: ID de imagen desconocido.';
            return;
        }

        // 1. Confirmación de seguridad
        if (!confirm(`¿Estás seguro de que quieres eliminar la imagen con ID ${idImagen}?`)) {
            return;
        }

        messageDiv.textContent = `Eliminando imagen ${idImagen}...`;

        try {
            // 2. Llamar al servicio DELETE
            await eliminarImagen(idImagen); 

            // 3. Éxito y recargar galería
            messageDiv.textContent = `✅ Imagen ID ${idImagen} eliminada con éxito.`;
            // Eliminar el mensaje de éxito después de un breve tiempo
            setTimeout(() => { messageDiv.textContent = ''; }, 3000); 
            
            // 4. Actualizar la galería sin recargar la página
            await renderGallery(); 

        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            messageDiv.textContent = `❌ Error al eliminar: ${error.message}`;
        }
    }
});

document.addEventListener('DOMContentLoaded', renderGallery);

