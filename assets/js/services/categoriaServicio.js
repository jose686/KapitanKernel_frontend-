import { BASE_API_URL } from './config.js'; 

const CATEGORIAS_API_URL = `${BASE_API_URL}/categorias`; 

export async function obtenerTodasLasCategorias() {
    try {
        const response = await fetch(CATEGORIAS_API_URL);

        if (!response.ok) {
           
            throw new Error(`Error HTTP ${response.status}: No se pudo obtener la lista de categorías.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fallo en la llamada a la API de Categorías:", error);
        throw error; 
    }
}

export async function obtenerCategoriaPorId(id) {
    try {
        const url = `${CATEGORIAS_API_URL}/${id}`;
        const response = await fetch(url);
        
        if (response.status === 404) {
             throw new Error("Categoría no encontrada.");
        }
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la categoría con ID ${id}.`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en obtenerCategoriaPorId (${id}):`, error);
        throw error;
    }
}


export async function crearCategoria(categoriaData) {
    try {
        const response = await fetch(CATEGORIAS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(categoriaData), 
        });

        if (response.status === 409) { 
            throw new Error("Ya existe una categoría con la información proporcionada.");
        }
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo crear la nueva categoría.`);
        }

        
        return await response.json(); 
    } catch (error) {
        console.error("Error en crearCategoria:", error);
        throw error;
    }
}




export async function eliminarCategoria(id) {
    try {
        const url = `${CATEGORIAS_API_URL}/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (response.status === 404) {
            throw new Error("Categoría a eliminar no encontrada.");
        }
        
        if (response.status === 409) { 
            throw new Error("No se puede eliminar la categoría. Probablemente está asociada a otros recursos (productos, etc.).");
        }
        
        if (!response.ok && response.status !== 204) {
            throw new Error(`Error ${response.status}: No se pudo eliminar la categoría con ID ${id}.`);
        }


        return; 
    } catch (error) {
        console.error(`Error en eliminarCategoria (${id}):`, error);
        throw error;
    }
}

