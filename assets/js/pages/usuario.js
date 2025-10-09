
import { 
    listarUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    eliminarUsuario 
} from "../services/usuarioServicio.js"; 


const tablaBody = document.querySelector('.data-table-container tbody'); 
const botonAbrirFormulario = document.querySelector('.content-actions .add-button');
const formularioUsuario = document.querySelector('#usuario-form');     

let usuarioIdEnEdicion = null; 


async function renderizarTablaUsuarios() {
    tablaBody.innerHTML = '<tr><td colspan="7">Cargando Usuarios...</td></tr>';
    console.log("Iniciando carga de usuarios...");
    
    try {
        const usuarios = await listarUsuarios();
        console.log(usuarios);
        tablaBody.innerHTML = ''; 
        if (usuarios && usuarios.length > 0) {
            usuarios.forEach(usuario => {
                const fila = document.createElement('tr');
                
               
                const tipo = usuario.tipoUsuario ? usuario.tipoUsuario.nombreTipo : 'Sin asignar';
                const estadoClass = usuario.estado === 'Activo' ? 'ready' : 'pending';
                const iconoAccion = usuario.estado === 'Activo' ? 'fa-lock' : 'fa-lock-open'; 
                
            
                fila.innerHTML = `
                    <td>${usuario.idUsuario}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>${usuario.correo}</td>
                    <td>${tipo}</td>
                    <td>${usuario.fecharegistro || 'N/A'}</td> 
                    <td><span class="status ${estadoClass}">${usuario.estado}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${usuario.idUsuario}" data-datos='${JSON.stringify(usuario)}'><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${usuario.idUsuario}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });
            
          
            document.querySelectorAll('.action-btn.delete').forEach(button => {
                
                button.addEventListener('click', manejarEliminacionDeUsuario); 
            });
            document.querySelectorAll('.action-btn.edit').forEach(button => {
                button.addEventListener('click', manejarEdicionDeUsuario);
            });
            
        } else {
            tablaBody.innerHTML = '<tr><td colspan="7">No hay usuarios registrados.</td></tr>';
        }

    } catch (error) {
        console.error("Error al cargar los Usuarios:", error);
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error al conectar con el backend: ${error.message}</td></tr>`;
    }
}




async function manejarEliminacionDeUsuario(e) {
    const idCadena = e.currentTarget.getAttribute('data-id'); 
    const idNumerico = Number(idCadena); 
    
    
    if (!confirm(`ADVERTENCIA: ¿Estás seguro de que quieres ELIMINAR al usuario con ID ${idNumerico}?`)) return;

    try {
        await eliminarUsuario(idNumerico);
        alert(`Usuario con ID ${idNumerico} ELIMINADO correctamente.`); 
        renderizarTablaUsuarios(); 
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}


function manejarEdicionDeUsuario(e) {
    
    const usuarioString = e.currentTarget.getAttribute('data-datos');
    const usuario = JSON.parse(usuarioString);
    
    usuarioIdEnEdicion = usuario.id; 
    
    
    
    
    document.querySelector('#input-nombre').value = usuario.nombre;
    document.querySelector('#input-email').value = usuario.email;
    
    if (document.querySelector('#input-password')) document.querySelector('#input-password').value = ''; 
    
    document.querySelector('#select-tipo').value = usuario.tipoUsuario.id; 
    
    alert(`Modo Edición activado para Usuario ID ${usuarioIdEnEdicion}.`);
}


document.addEventListener('DOMContentLoaded', renderizarTablaUsuarios);

