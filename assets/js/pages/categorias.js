

import { 
    obtenerTodasLasCategorias, 
    crearCategoria, 
    eliminarCategoria,
    
} from '../services/categoriaServicio.js'; 



let categoriaIdEnEdicion = null; 


const formularioCrear = document.querySelector('.config-form');

async function renderizarTablaCategorias() {
    
    
    const tablaBody = document.querySelector('.admin-content-area table tbody'); 

    if (!tablaBody) {
        
        console.error("ERROR CRÍTICO: El cuerpo de la tabla (tbody) no se encontró. Revise el selector.");
        return; 
    }
    
    tablaBody.innerHTML = '<tr><td colspan="3">Cargando categorías...</td></tr>';
    
    try {
        const categorias = await obtenerTodasLasCategorias();

        if (categorias && categorias.length > 0) {
            categorias.forEach(categoria => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${categoria.idCategoria}</td>
                    <td>${categoria.nombreCategoria}</td>
                    <td>
                        <button class="action-btn edit" data-id="${categoria.idCategoria}" data-nombre="${categoria.nombre}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${categoria.idCategoria}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            tablaBody.appendChild(fila);
            });

            document.querySelectorAll('.action-btn.delete').forEach(button => {
                button.addEventListener('click', manejarEliminacion);
            });
            document.querySelectorAll('.action-btn.edit').forEach(button => {
                button.addEventListener('click', manejarEdicion); 
         });
 
        } else {
            tablaBody.innerHTML = '<tr><td colspan="3">No hay categorías registradas.</td></tr>';
        }

    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        tablaBody.innerHTML = `<tr><td colspan="3" style="color: red;">Error al conectar con el backend.</td></tr>`;
    }
}



if (formularioCrear) {
    formularioCrear.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
       
        const inputNombreCategoria = document.querySelector('#nombreCategoria');
        const botonGuardar = formularioCrear.querySelector('.add-button');
        
        if (!inputNombreCategoria) return alert("Error interno: No se encontró el campo de nombre.");
        
        const nombre = inputNombreCategoria.value.trim();
        if (!nombre) return alert("Por favor, introduce un nombre para la categoría.");

        const categoriaData = { 
            nombreCategoria: nombre 
        };

        try {
            if (categoriaIdEnEdicion) {
                
                await actualizarCategoria(categoriaIdEnEdicion, categoriaData);
                alert(`Categoría ID ${categoriaIdEnEdicion} actualizada con éxito!`);
                categoriaIdEnEdicion = null; 
                botonGuardar.innerHTML = `<i class="fas fa-plus"></i> Crear Categoria`;
            } else {
                
                await crearCategoria(categoriaData);
                alert(`Categoría '${nombre}' creada con éxito!`);
            }
            
            inputNombreCategoria.value = ''; 
            renderizarTablaCategorias(); 
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}


async function manejarEliminacion(e) {
    e.stopPropagation(); 
    const idCadena = e.currentTarget.getAttribute('data-id'); 
    const idNumerico = Number(idCadena); 

   
    if (isNaN(idNumerico) || idNumerico <= 0) {
        console.error("Error: ID de categoría no válido.", idCadena);
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría con ID ${idNumerico}?`)) return;

    try {
        await eliminarCategoria(idNumerico);
        alert(`Categoría con ID ${idNumerico} eliminada correctamente.`); 
        renderizarTablaCategorias(); 
    } catch (error) {
         alert(`Error al eliminar: ${error.message}`);
    }
}



function manejarEdicion(e) {
    e.stopPropagation();
    const idCadena = e.currentTarget.getAttribute('data-id');
    const nombre = e.currentTarget.getAttribute('data-nombre');
    categoriaIdEnEdicion = Number(idCadena);
    
    const inputNombreCategoria = document.querySelector('#nombreCategoria');
    if (inputNombreCategoria) {
        inputNombreCategoria.value = nombre;
    }
    const botonGuardar = document.querySelector('.config-form .add-button');
    if (botonGuardar) {
        botonGuardar.innerHTML = `<i class="fas fa-save"></i> Guardar Cambios (ID ${categoriaIdEnEdicion})`;
    }
}


document.addEventListener('DOMContentLoaded', renderizarTablaCategorias);
