// admin_tipos_usuario.js

import { 
    obtenerTodosLosTiposDeUsuario, 
    crearTipoUsuario, 
    eliminarTipoDeUsuario 
} from '../services/tiposUsuarioServicio.js'; 


const tablaBody = document.querySelector('.data-table-container tbody');
const formularioCrear = document.querySelector('.config-form');
const inputNombreTipo = formularioCrear.querySelector('input[type="text"]');



async function renderizarTablaTipos() {
    tablaBody.innerHTML = '<tr><td colspan="3">Cargando tipos de usuario...</td></tr>';
    
    try {
        const tipos = await obtenerTodosLosTiposDeUsuario();
        
        tablaBody.innerHTML = ''; 
        if (tipos && tipos.length > 0) {
            tipos.forEach(tipo => {
                const fila = document.createElement('tr');
                
                
                fila.innerHTML = `
                    <td>${tipo.idTipo}</td>
                    <td>${tipo.nombreTipo}</td>
                    <td>
                        <button class="action-btn edit" data-id="${tipo.idTipo}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${tipo.idTipo}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });
            
          
            document.querySelectorAll('.action-btn.delete').forEach(button => {
                button.addEventListener('click', manejarEliminacion);
            });
            
        } else {
            tablaBody.innerHTML = '<tr><td colspan="3">No hay tipos de usuario registrados.</td></tr>';
        }

    } catch (error) {
        console.error("Error al cargar los tipos de usuario:", error);
        tablaBody.innerHTML = `<tr><td colspan="3" style="color: red;">Error al conectar con el backend.</td></tr>`;
    }
}




formularioCrear.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const nombre = inputNombreTipo.value.trim();
    if (!nombre) return alert("Por favor, introduce un nombre para el tipo de usuario.");

    const tipoUsuarioData = { 
        nombreTipo: nombre 
    };

    try {
        await crearTipoUsuario(tipoUsuarioData);
        alert(`Tipo '${nombre}' creado con éxito!`);
        inputNombreTipo.value = ''; 
        renderizarTablaTipos(); 
    } catch (error) {
        alert(`Error al crear el tipo: ${error.message}`);
    }
});

async function manejarEliminacion(e) {

    
    const idCadena = e.currentTarget.getAttribute('data-id'); 
    
    const idNumerico = Number(idCadena); 
    console.log("ID a eliminar:", idNumerico);

    if (isNaN(idNumerico) || idNumerico <= 0) {
        console.error("ID no válido detectado:", idCadena);
        alert("Error: El ID del tipo de usuario no es válido.");
        return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres eliminar el tipo de usuario con ID ${idNumerico}?`)) {
        return; 
    }

    try {
        await eliminarTipoDeUsuario(idNumerico);
        alert(`Tipo con ID ${idNumerico} eliminado correctamente.`); 
        renderizarTablaTipos(); 
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}


document.addEventListener('DOMContentLoaded', renderizarTablaTipos);