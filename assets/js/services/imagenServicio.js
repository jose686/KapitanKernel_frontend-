

import { BASE_API_URL } from './config.js'; 



const IMAGEN_API_URL = `${BASE_API_URL}/imagenes`;


/**
 * Sube un archivo de imagen al servidor junto con su metadata.
 * @param {File} file El objeto File a subir.
 * @param {number} idUsuario ID del usuario que sube la imagen.
 * @param {string} altText Texto alternativo para SEO.
 * @returns {Promise<Object>} La promesa que se resuelve con el objeto Imagenes creado.
 */
export async function subirImagen(file, idUsuario, altText) { 
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUsuario', idUsuario);
    formData.append('altText', altText);

    try {
        
        const response = await fetch(IMAGEN_API_URL, {
            method: 'POST',
            body: formData, 
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
            throw new Error(`Error ${response.status}: Falló la subida de la imagen. Mensaje: ${errorBody.message || errorBody.error}`);
        }

    
        return await response.json(); 
    } catch (error) {
        console.error("Error en subirImagen (Servicio):", error);
        throw error;
    }
}



export async function listarTodasLasImagenes() {
    const response = await fetch(`${IMAGEN_API_URL}`); 
    if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo listar las imágenes.`);
    }
    return await response.json(); 
}

/**
 * Elimina una imagen del servidor por su ID.
 * @param {number} id ID de la imagen a eliminar.
 * @returns {Promise<void>} Promesa que se resuelve al eliminar.
 */
export async function eliminarImagen(id) {
    const response = await fetch(`${IMAGEN_API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 404) {
        // Esto captura la RecursoNoEncontradoException del backend
        throw new Error(`Error 404: La imagen con ID ${id} no fue encontrada.`);
    }

    if (!response.ok && response.status !== 204) {
        // 204 No Content es la respuesta esperada
        throw new Error(`Error ${response.status}: No se pudo eliminar la imagen.`);
    }
    
    // Si la respuesta es 204 No Content, la promesa se resuelve sin contenido.
}