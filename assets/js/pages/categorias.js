import { obtenerTodasLasCategorias } from "../services/categoriaServicio.js";



async function cargarCategorias() {
    try {
        
        const categorias = await obtenerTodasLasCategorias();
        console.log(categorias);
      
    } catch (error) {
        console.error("Fallo al cargar las categorías:", error);
    }
}


cargarCategorias();