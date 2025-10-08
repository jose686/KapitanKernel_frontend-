import { BASE_API_URL } from './config.js'; 

const POSTS_API_URL = `${BASE_API_URL}/postsControlador`;


function construirParametros(idAutor, idsCategorias) {
   
    const params = new URLSearchParams();
    
   
    if (idAutor) {
        params.append('idAutor', idAutor);
    }
    
    
    if (idsCategorias && Array.isArray(idsCategorias)) {
        idsCategorias.forEach(id => {
            params.append('idsCategorias', id);
        });
    }
    
    return params.toString(); 
}



export async function crearPost(postData, idAutor, idsCategorias) {
    try {
        const parametros = construirParametros(idAutor, idsCategorias);
        const url = `${POSTS_API_URL}?${parametros}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData), 
        });

        if (response.status === 404) { 
            throw new Error("El autor o alguna de las categorías especificadas no fue encontrado.");
        }
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo crear el Post.`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error en crearPost:", error);
        throw error;
    }
}


export async function actualizarPost(id, postActualizadoData, idAutor, idsCategorias) {
    try {
        const parametros = construirParametros(idAutor, idsCategorias);
        const url = `${POSTS_API_URL}/${id}?${parametros}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postActualizadoData), 
        });

        if (response.status === 404) {
            throw new Error("El Post, el autor o alguna de las categorías no fue encontrado.");
        }
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Falló la actualización del Post.`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en actualizarPost (${id}):`, error);
        throw error;
    }
}


export async function eliminarPost(id) {
    try {
        const url = `${POSTS_API_URL}/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (response.status === 404) {
            throw new Error(`Post con ID ${id} no encontrado para eliminar.`);
        }
        
        if (!response.ok && response.status !== 204) {
            throw new Error(`Error ${response.status}: No se pudo eliminar el Post.`);
        }

        return; 
    } catch (error) {
        console.error(`Error en eliminarPost (${id}):`, error);
        throw error;
    }
}


export async function listarTodosLosPosts() {
    try {
        const response = await fetch(POSTS_API_URL);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de Posts.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en listarTodosLosPosts:", error);
        throw error;
    }
}