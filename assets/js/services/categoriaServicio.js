import { BASE_API_URL } from './config.js'; 


export async function obtenerTodasLasCategorias() {
    try {
        const url = `${BASE_API_URL}/categorias`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de categorias.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en oobtenerTodosLasCategorias:", error);
        throw error;
    }
}

