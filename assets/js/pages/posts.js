import { listarTodosLosPosts, eliminarPost } from "../services/postServicio.js"; 
// ^ Asegúrate de que la ruta relativa a postServicio.js sea correcta.

// Elemento donde inyectaremos las filas de la tabla
const postsTbody = document.getElementById('posts-tbody'); 

/**
 * Mapea el estado del post a una clase CSS para darle color.
 * @param {string} estado - El estado del post (ej: 'PUBLICADO', 'BORRADOR').
 * @returns {string} Clase CSS.
 */
function obtenerClaseEstado(estado) {
    const estadoLimpio = estado ? estado.toUpperCase() : '';
    switch (estadoLimpio) {
        case 'PUBLICADO':
            return 'status ready';
        case 'BORRADOR':
            return 'status pending';
        case 'ARCHIVADO':
            return 'status archived';
        default:
            return 'status unknown';
    }
}

/**
 * Función para renderizar los posts en la tabla.
 * @param {Array<Object>} posts Lista de objetos Post obtenidos de la API.
 */
function renderizarTablaPosts(posts) {
    // Si no hay posts o la lista está vacía
    if (!posts || posts.length === 0) {
        postsTbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay posts registrados.</td></tr>';
        return;
    }

    postsTbody.innerHTML = ''; // Limpiar filas de carga
    
    posts.forEach(post => {
        // Mapeo de datos usando la estructura que recibes del GET:
        const id = post.idTipo;
        const fechaPublicacion = new Date(post.fechaPublicacion).toLocaleDateString('es-ES');
        
        // Mapeo de relaciones anidadas
        const autorNombre = post.idAutor ? post.idAutor.nombreUsuario : 'Desconocido';
        
        // Mapeo de Categorías (Many to Many)
        const categoriasNombres = post.categorias && post.categorias.length > 0 
            ? post.categorias.map(cat => cat.nombreTipo || 'Categoría').join(', ') 
            : 'Sin Categorías';
            
        const claseEstado = obtenerClaseEstado(post.estado);

        const row = postsTbody.insertRow();
        
        row.innerHTML = `
            <td>${id}</td>
            <td>${post.titulo}</td>
            <td>${autorNombre}</td>
            <td>${categoriasNombres}</td>
            <td>${fechaPublicacion}</td>
            <td><span class="${claseEstado}">${post.estado}</span></td>
            <td>
                <a href="crear_post.html?id=${id}" class="action-btn edit" title="Editar"><i class="fas fa-edit"></i></a>
                <button class="action-btn delete" data-id="${id}" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });
    
    // Asignar los listeners de eventos después de crear las filas
    asignarEventosAccion();
}

/**
 * Asigna manejadores de eventos a los botones de Eliminar.
 */
function asignarEventosAccion() {
    postsTbody.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.id;
            if (confirm(`¿Estás seguro de que quieres eliminar el Post ID ${postId}? Esta acción no se puede deshacer.`)) {
                try {
                    await eliminarPost(postId);
                    alert(`✅ Post ID ${postId} eliminado con éxito.`);
                    // Recargar la lista después de la eliminación
                    inicializarListadoPosts(); 
                } catch (error) {
                    alert(`❌ Error al eliminar el Post ID ${postId}: ${error.message}`);
                }
            }
        });
    });
}


/**
 * Función principal para cargar los posts al cargar la página.
 */
async function inicializarListadoPosts() {
    postsTbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando posts...</td></tr>';
    
    try {
        const posts = await listarTodosLosPosts();
        renderizarTablaPosts(posts);
        
    } catch (error) {
        console.error("Error al cargar la lista de posts:", error);
        postsTbody.innerHTML = '<tr><td colspan="8" class="text-center error-message">❌ Error al cargar los datos. Revisa el servidor.</td></tr>';
    }
}

// Iniciar la carga de datos cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarListadoPosts);
