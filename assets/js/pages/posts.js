


import { 
    crearPost, 
    actualizarPost, 
    eliminarPost, 
    listarTodosLosPosts 
} from "../services/postsServicio.js"; 


const tablaBody = document.querySelector('.data-table-container tbody');
const botonCrearPost = document.querySelector('.content-actions .add-button'); 


const formularioPost = document.querySelector('#post-form'); 
const inputContenido = document.querySelector('#post-contenido');
const selectAutorId = document.querySelector('#post-autor-id'); 
const selectCategoriasIds = document.querySelector('#post-categorias-ids'); 




async function renderizarTablaPosts() {
    tablaBody.innerHTML = '<tr><td colspan="7">Cargando Posts...</td></tr>';
    
    try {
        const posts = await listarTodosLosPosts();
        
        tablaBody.innerHTML = ''; 
        if (posts && posts.length > 0) {
            posts.forEach(post => {
                const fila = document.createElement('tr');
                
                
                
               
                const autorNombre = post.autor ? post.autor.nombre : 'N/A';
                
                const categoriasNombres = post.categorias ? post.categorias.map(c => c.nombre).join(', ') : 'Sin Cat.'; 

                fila.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.titulo}</td>
                    <td>${autorNombre}</td> 
                    <td>${categoriasNombres}</td>
                    <td>${post.fechaCreacion}</td>
                    <td><span class="status ready">${post.estado}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${post.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });
            
            
            document.querySelectorAll('.action-btn.delete').forEach(button => {
                button.addEventListener('click', manejarEliminacionDePost);
            });
             document.querySelectorAll('.action-btn.edit').forEach(button => {
                button.addEventListener('click', manejarEdicionDePost); 
             });

        } else {
            tablaBody.innerHTML = '<tr><td colspan="7">No hay posts registrados.</td></tr>';
        }

    } catch (error) {
        console.error("RENDER ERROR: Fallo al cargar los Posts:", error);
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error al conectar: ${error.message}</td></tr>`;
    }
}


async function manejarCreacionDePost(e) {
    e.preventDefault(); 
    
   
    const titulo = inputTitulo ? inputTitulo.value.trim() : '';
    const contenido = inputContenido ? inputContenido.value.trim() : '';
    
 
    const idAutor = Number(selectAutorId ? selectAutorId.value : 0);
    
    const idsCategorias = obtenerValoresSelectMultiple(selectCategoriasIds); 
    
    if (!titulo || !contenido || idAutor <= 0 || idsCategorias.length === 0) {
        return alert("Por favor, complete Título, Contenido, Autor y Categorías.");
    }
    
    
    const postData = { titulo, contenido }; 

    try {
        
        await crearPost(postData, idAutor, idsCategorias); 
        
        alert(`Post "${titulo}" creado con éxito!`);
        
        formularioPost.reset(); 
        renderizarTablaPosts(); 
    } catch (error) {
        alert(`Error al crear el Post: ${error.message}`);
    }
}


async function manejarEliminacionDePost(e) {
    const idCadena = e.currentTarget.getAttribute('data-id'); 
    const idNumerico = Number(idCadena); 

    if (isNaN(idNumerico) || idNumerico <= 0) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar el Post ID ${idNumerico}?`)) return;

    try {
        await eliminarPost(idNumerico);
        alert(`Post con ID ${idNumerico} eliminado correctamente.`); 
        renderizarTablaPosts(); 
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}


function obtenerValoresSelectMultiple(selectElement) {
    if (!selectElement) return [];
    
    return Array.from(selectElement.selectedOptions).map(option => Number(option.value));
}




document.addEventListener('DOMContentLoaded', renderizarTablaPosts);


if (formularioPost) {
    formularioPost.addEventListener('submit', manejarCreacionDePost);
}



