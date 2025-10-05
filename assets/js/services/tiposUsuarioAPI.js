// tiposUsuarioAPI.js

import { BASE_API_URL } from './config.js'; 


export async function obtenerTodosLosTiposDeUsuario() {
    try {
        const url = `${BASE_API_URL}/tiposUsuario`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de roles.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodosLosTiposDeUsuario:", error);
        throw error;
    }
}


export async function crearTipoUsuario(tipoUsuarioData) {
    try {
        const url = `${BASE_API_URL}/tiposUsuario`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoUsuarioData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: No se pudo crear el rol. Detalle: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearTipoUsuario:", error);
        throw error;
    }
}


export async function eliminarTipoDeUsuario(id) {
    try {
        const url = `${BASE_API_URL}/tiposUsuario/${id}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.status === 404) {
             throw new Error(`El rol con ID ${id} no fue encontrado.`);
        }
        
        if (!response.ok && response.status !== 204) { 
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: No se pudo eliminar el rol. Detalle: ${errorText}`);
        }
    } catch (error) {
        console.error("Error en eliminarTipoDeUsuario:", error);
        throw error;
    }
}