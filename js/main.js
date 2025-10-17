const contenedorProductos = document.getElementById('contenedor-productos');
let carrito = JSON.parse(localStorage.getItem('carritoEunoia')) || [];
let productosGlobal = [];

// Funciones de Persistencia
function guardarCarrito() {
    localStorage.setItem('carritoEunoia', JSON.stringify(carrito));
}
function guardarStock() {
    let stockData = productosGlobal.map(p => ({
        id: p.id,
        stock: p.stock
    }));
    localStorage.setItem('stockEunoia', JSON.stringify(stockData));
}

// Lógica de Carrito
function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(p => p.id === id); 
    
    if (indice > -1) {
        carrito.splice(indice, 1);
        
        let productoOriginal = productosGlobal.find(p => p.id === id);
        if (productoOriginal) {
            productoOriginal.stock += 1;
        }
        
        guardarCarrito();
        guardarStock();
        
        actualizarTotal(); 
        renderizarCarrito();
        renderizar(productosGlobal);
    }
}

function vaciarCarritoTotal() {
    if (carrito.length === 0) {
        Swal.fire('Vacío', 'El carrito ya está vacío.', 'info');
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a eliminar todos los productos del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.forEach(item => {
                const productoOriginal = productosGlobal.find(p => p.id === item.id);
                if (productoOriginal) {
                    productoOriginal.stock += 1;
                }
            });

            carrito = [];
            localStorage.removeItem('carritoEunoia');
            guardarStock(); 

            actualizarTotal();
            renderizarCarrito();
            renderizar(productosGlobal);

            Swal.fire('Vacío!', 'Tu carrito ha sido vaciado.', 'success');
        }
    });
}

// Carga Asíncrona de Productos
async function fetchProductos() {
    let rutaBase = './'; 
    if (window.location.pathname.includes('/pages/')) {
        rutaBase = '../'; 
    }
    const rutaJson = rutaBase + 'data/productos.json'; 

    try {
        let res = await fetch(rutaJson); 
        
        if (!res.ok) {
            res = await fetch('./data/productos.json'); 
            if (!res.ok) {
                throw new Error('Falló el servidor: ' + res.status);
            }
        }
        
        let data = await res.json();
        productosGlobal = data; 
        
        const stockGuardado = JSON.parse(localStorage.getItem('stockEunoia'));
        
        if (stockGuardado && stockGuardado.length > 0) {
            productosGlobal = productosGlobal.map(producto => {
                const stockItem = stockGuardado.find(s => s.id === producto.id);
                if (stockItem) {
                    producto.stock = stockItem.stock;
                }
                return producto;
            });
        }
        
        renderizar(productosGlobal); 
        
    } catch (error) {
        Swal.fire({
            title: 'Error FATAL',
            text: 'No se pudo cargar la tienda. Vuelve más tarde!',
            icon: 'error'
        });
        console.error('Error de fetch o de JSON:', error); 
    }
}

// Lógica de navegación
let paginaActual = 'contenido'; 
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    paginaActual = 'inicio';
} else if (window.location.pathname.includes('todo.html')) {
    paginaActual = 'todos';
} else if (window.location.pathname.includes('accesorios.html')) {
    paginaActual = 'accesorios';
} else if (window.location.pathname.includes('indumentaria.html')) {
    paginaActual = 'indumentaria';
}

function renderizar(arr) {
    if (paginaActual === 'contenido') {
        return;
    }
  
    let pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';
    
    let productosAmostrar = [];
    const esInicio = window.location.pathname.includes("index.html") || window.location.pathname === "/";

    if (esInicio) {
        const idsElegidos = [1, 2, 8, 7, 6, 14];
        productosAmostrar = arr.filter(p => idsElegidos.includes(p.id));

        const contenedor = document.querySelector(".contenedor-Cards-index"); 
        
        if (contenedor) {
            contenedor.innerHTML = '';
            
            productosAmostrar.forEach(item => {
                let card = document.createElement('section');
                card.classList.add('card-ropa-index');
                
                card.innerHTML = `
                    <img src="${pathPrefix}${item.img}" alt="${item.nombre}"> 
                    <h3>${item.nombre}</h3>
                    <section class="card-ropa-precio-index">
                        <span>$${item.precio.toLocaleString('es-AR')}</span>
                        <p>$${(item.precio * 0.9).toLocaleString('es-AR')} con EFECTIVO/TRANSF.</p> 
                    </section>
                    <button id="btn-${item.id}">Comprar</button> 
                `;
                
                contenedor.appendChild(card);
                
                document.getElementById(`btn-${item.id}`).onclick = function() {
                    addCarrito(item.id);
                };
            });
        }
        return;
    }

    if (paginaActual === 'todos') {
        productosAmostrar = arr;
    } else if (paginaActual === 'accesorios') {
        productosAmostrar = arr.filter(p => p.categoria === 'Accesorios');
    } else if (paginaActual === 'indumentaria') {
        productosAmostrar = arr.filter(p => p.categoria === 'Indumentaria');
    } 
    
    const contenedor = document.getElementById('contenedor-productos');
    if (contenedor) {
        contenedor.innerHTML = ''; 
        
        productosAmostrar.forEach(item => {
            let card = document.createElement('section');
            card.classList.add('card-ropa');
            
            card.innerHTML = `
                <img src="${pathPrefix}${item.img}" alt="${item.nombre}"> 
                <h3>${item.nombre}</h3>
                <section class="card-ropa-precio">
                    <span>$${item.precio.toLocaleString('es-AR')}</span>
                    <p>$${(item.precio * 0.9).toLocaleString('es-AR')} con EFECTIVO/TRANSF.</p> 
                </section>
                <button id="btn-${item.id}" class="btn-comprar">Comprar</button> 
            `;
            
            contenedor.appendChild(card);
            
            document.getElementById(`btn-${item.id}`).onclick = function() {
                addCarrito(item.id);
            };
        });
    }
}

// Añadir al Carrito
function addCarrito(id) {
    let item = productosGlobal.find(p => p.id === id);
    
    if (item && item.stock > 0) {
        carrito.push(item);
        item.stock = item.stock - 1; 
        
        guardarCarrito(); 
        guardarStock();
        
        Toastify({
            text: item.nombre + ' añadido.',
            duration: 2500,
            gravity: "bottom", 
            position: "left", 
            style: {
                background: "linear-gradient(to right, rgb(230, 226, 215), rgba(199, 196, 184, 1)",
                color: "#000000ff"
            },
            offset: {
                x: '1.5rem', 
                y: '1.5rem'
            },
        }).showToast();

    } else {
        Swal.fire('Sin Stock', 'No nos queda más de eso, disculpa.', 'warning');
    }

    actualizarTotal();
    renderizarCarrito();
}

// Actualizar Header y Totales
function actualizarTotal() {

    let total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    
    const cantidadElement = document.getElementById('cantidad-carrito');

    if (cantidadElement) {
        cantidadElement.textContent = carrito.length;
    }
    
    const totalElement = document.getElementById('total-carrito');
    if (totalElement) {
        totalElement.textContent = '$' + total.toLocaleString('es-AR');
    }

   
    
    console.log("Total actualizado: $" + total.toLocaleString('es-AR')); 
}

// Renderizado del Offcanvas
function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-carrito');
    const totalElement = document.getElementById('total-carrito');
    
    if (!contenedor) return;

    contenedor.innerHTML = ''; 

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted">Aún no tienes productos en el carrito.</p>';
        totalElement.textContent = '$0';
        return;
    }
    
    carrito.forEach(producto => {
        let div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'border-bottom', 'py-2');

        div.innerHTML = `
            <div>
                <p class="mb-0 fw-bold">${producto.nombre}</p>
                <small class="text-muted">$${producto.precio.toLocaleString('es-AR')}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger btn-eliminar-carrito" data-id="${producto.id}" title="Quitar">
                ❌
            </button>
        `;

        contenedor.appendChild(div);
    });

    actualizarTotal(); 
    
    // Conexión de botones de eliminación
    document.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
        btn.onclick = (e) => eliminarDelCarrito(parseInt(e.currentTarget.getAttribute('data-id')));
    });
}

// Finalizar Compra (Simulación Asíncrona)
async function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire('Vacío', 'Agrega algo antes de pagar.', 'info');
        return;
    }

    Swal.fire({
        title: 'Cargando...',
        html: 'Estamos chequeando tu tarjeta...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let resultado = await new Promise(resolve => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve({ ok: true, msg: "Listo! Pago exitoso. Que lo disfrutes!" });
            } else {
                resolve({ ok: false, msg: "Fallo la conexión. Intente de nuevo mas tarde." });
            }
        }, 2500); 
    });

    Swal.close(); 

    if (resultado.ok) {
        Swal.fire('Todo OK!', resultado.msg, 'success');
        carrito = []; 
        localStorage.removeItem('carritoEunoia');
        actualizarTotal();
        renderizarCarrito(); // Limpiamos la vista del Offcanvas
    } else {
        Swal.fire('Ups!', resultado.msg, 'error');
    }
}


// =========================================================
// INICIO DE LA APLICACIÓN
// =========================================================

fetchProductos();

document.addEventListener('DOMContentLoaded', () => {
    actualizarTotal(); 
    renderizarCarrito();
    
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
    
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarritoTotal);
    }
});