// =======================================================
// JSON DE EJEMPLO (Simula la respuesta de tu API de Backend)
// =======================================================

const texto = `La NVIDIA GeForce RTX 4070 12GB marca un punto de inflexión en la relación rendimiento-precio para gamers y creadores de contenido que buscan una experiencia inmersiva en resoluciones 1440p e incluso 4K. Construida sobre la arquitectura ultraeficiente NVIDIA Ada Lovelace, esta tarjeta no solo ofrece framerates excepcionales, sino que también introduce tecnologías de vanguardia que redefinen la calidad visual y la productividad.
Rendimiento y Arquitectura (Ada Lovelace)
El corazón de la RTX 4070 reside en sus Núcleos RT de tercera generación y Núcleos Tensor de cuarta generación. Estos componentes son la clave para desbloquear el verdadero potencial del trazado de rayos (Ray Tracing) en tiempo real, ofreciendo sombras, reflejos e iluminación hiperrealistas con una mínima penalización de rendimiento.
La tecnología DLSS 3 (Deep Learning Super Sampling), exclusiva de la serie RTX 40, utiliza IA para generar frames adicionales de alta calidad (Frame Generation), multiplicando eficazmente la tasa de cuadros por segundo y superando las limitaciones de la GPU tradicional. Esto garantiza un juego ultrafluido a tasas de refresco elevadas, esencial para juegos competitivos y monitores de 144Hz o superiores. Su bus de memoria de 192 bits junto con sus 12 GB de VRAM GDDR6X aseguran que incluso las texturas más exigentes y los entornos de mundo abierto complejos se carguen instantáneamente y se muestren sin stuttering.
Especificaciones Técnicas Detalladas
La RTX 4070 opera con una frecuencia de boost que alcanza fácilmente los 2.475 MHz, superando significativamente a su predecesora directa en la generación anterior. Utiliza la interfaz PCI Express 4.0, aunque es completamente compatible con slots PCIe 3.0 (con un rendimiento mínimamente inferior).
En términos de conectividad, está preparada para el futuro, soportando hasta cuatro pantallas simultáneas. Las salidas de video incluyen:
1x HDMI 2.1a: Soporte para 4K a 120 Hz o 8K a 60 Hz con DSC (Display Stream Compression).
3x DisplayPort 1.4a: La opción estándar para monitores de alta tasa de refresco.
Su diseño térmico es eficiente, generalmente ocupando solo dos ranuras (slots) de expansión en el chasis, y requiere un único conector de alimentación PCIe de 8 pines (o el nuevo conector 16-pin 12VHPWR, dependiendo del ensamblador). Se recomienda una fuente de alimentación (PSU) con una capacidad mínima de 650W para garantizar la estabilidad del sistema bajo carga.
Aplicaciones de Productividad y Creación
Más allá de los juegos, esta tarjeta es una herramienta poderosa para profesionales. Los creadores de contenido se beneficiarán del hardware NVIDIA Encoder (NVENC) de 8ª generación, que ofrece una codificación de video AV1 ultrarrápida, reduciendo drásticamente los tiempos de renderizado en aplicaciones como DaVinci Resolve, Adobe Premiere Pro o Blender. Su capacidad de manejar grandes conjuntos de datos y modelos de IA la convierte en una opción sólida para el desarrollo en el ecosistema NVIDIA Studio.
En resumen, la NVIDIA GeForce RTX 4070 es la tarjeta ideal para aquellos que desean dar el salto a las tecnologías de IA y Ray Tracing sin comprometer la fluidez ni vaciar el bolsillo, ofreciendo una experiencia premium tanto en el juego como en la creación de contenido profesional. Es una inversión duradera que asegura el rendimiento de tu PC durante los próximos años.`;






const productoEjemplo = {
    "id_externo_sku": "GFORCE-RTX4070",
    "nombre_producto": "Tarjeta Gráfica NVIDIA GeForce RTX 4070 12GB",
    "precio_costo_unidad": 589.99,
    "precio_pvp_sugerido": 699.99,
    "stock_integer": 45,
    "categoria": "Hardware | Tarjetas Gráficas",
    "descripcion_tecnica": texto,
    "url_imagen_principal": "assets/img/OIP (3).webp", // Usamos una imagen de tu HTML para que funcione
    "peso_kg": 1.2
};

// Función para formatear el número a moneda (€)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Función principal que inyecta los datos en el HTML
const cargarDetallesProducto = (producto) => {
    if (!producto) {
        console.error("No se encontró el producto.");
        document.querySelector('.product-main-content').innerHTML = '<h1>Producto No Encontrado</h1>';
        return;
    }

    // --- 1. Información Principal ---
    document.getElementById('producto-sku').value = producto.id_externo_sku;
    document.getElementById('product-title').textContent = producto.nombre_producto;
    document.getElementById('product-price').textContent = formatCurrency(producto.precio_pvp_sugerido);
    document.getElementById('main-product-image').src = producto.url_imagen_principal;
    document.getElementById('main-product-image').alt = producto.nombre_producto;

    // --- 2. Descripción / SKU / Categoría ---
    document.getElementById('product-sku-id').textContent = `SKU: ${producto.id_externo_sku}`;
    document.getElementById('product-category').textContent = producto.categoria;
    
    // !!! NUEVA LÍNEA: Inyecta la descripción técnica !!!
    document.getElementById('product-long-description').textContent = producto.descripcion_tecnica; 

    // --- 3. Stock e Información Adicional ---
    const stockInfoElement = document.getElementById('stock-status');
    const stockPesoElement = document.getElementById('product-stock-peso');

    // Estado de Stock
    if (producto.stock_integer > 0) {
        stockInfoElement.className = 'stock-info in-stock';
        stockInfoElement.innerHTML = `<i class="fas fa-check-circle"></i> <span>En stock (${producto.stock_integer} uds).</span>`;
    } else {
        stockInfoElement.className = 'stock-info out-of-stock';
        stockInfoElement.innerHTML = `<i class="fas fa-times-circle"></i> <span>Agotado.</span>`;
    }
    
    // Lista de Stock y Peso
    stockPesoElement.innerHTML = `
        <li><i class="fas fa-cubes spec-icon"></i> Stock Disponible: ${producto.stock_integer}</li>
        <li><i class="fas fa-weight-hanging spec-icon"></i> Peso del Paquete: ${producto.peso_kg} kg</li>
    `;
};

// =======================================================
// Ejecución al cargar la página
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarDetallesProducto(productoEjemplo);
});