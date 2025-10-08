import { BASE_API_URL } from './config.js'; 

const USUARIOS_API_URL = `${BASE_API_URL}/usuarios`;


export async function crearUsuario(usuarioData) {
    try {
        const response = await fetch(USUARIOS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioData), 
        });

        if (response.status === 400) { 
            throw new Error("Solicitud inválida. Asegúrese de que todos los datos, incluido el Tipo de Usuario, sean correctos.");
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: No se pudo crear el usuario. Detalle: ${errorText}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error en crearUsuario:", error);
        throw error;
    }
}


export async function actualizarUsuario(id, usuarioActualizadoData) {
    try {
        const url = `${USUARIOS_API_URL}/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioActualizadoData), 
        });

        if (response.status === 404) { 
            throw new Error(`Usuario con ID ${id} no encontrado para actualizar.`);
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: Falló la actualización. Detalle: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en actualizarUsuario (${id}):`, error);
        throw error;
    }
}


export async function eliminarUsuario(id) {
    try {
        const url = `${USUARIOS_API_URL}/${id}`;
        const response = await fetch(url, { method: 'DELETE' });

        if (response.status === 404) { 
            throw new Error(`Usuario con ID ${id} no encontrado para eliminar.`);
        }
        
        if (response.status === 409) { 
            throw new Error("No se puede eliminar el usuario. Está asociado a otros recursos (ej: posts, pedidos).");
        }
        
        if (!response.ok && response.status !== 204) { 
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: Falló la eliminación. Detalle: ${errorText}`);
        }

        return; 
    } catch (error) {
        console.error(`Error en eliminarUsuario (${id}):`, error);
        throw error;
    }
}


export async function listarUsuarios() {
    try {
        const response = await fetch(USUARIOS_API_URL);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de usuarios.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en listarUsuarios:", error);
        throw error;
    }
}