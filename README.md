# 🛍️ Eunoia Clothing Store

Este proyecto simula un e-commerce desarrollado como trabajo final para el curso de JavaScript de Coder House.

## Características Principales

* **Integración con DOM:** Renderizado dinámico de productos en varias vistas (`todo.html`, `accesorios.html`, `indumentaria.html`).
* **Asincronía (AJAX):** Los datos de los productos se cargan desde un archivo `productos.json` usando `fetch`.
* **Persistencia de Datos:** El carrito de compras y el stock de productos se guardan y se recuperan mediante `localStorage`.
* **Librerías:** Uso de Toastify para notificaciones rápidas y SweetAlert2 (Swal) para la simulación de la compra final.
* **Diseño:** Interfaz responsive con Bootstrap y estilos custom. Implementación de Scroll Snap en `index.html`.

## Funcionalidades del Carrito

1.  Agregar productos, descontando stock.
2.  Eliminar ítems individuales, devolviendo stock.
3.  Vaciar el carrito por completo, restaurando todo el stock.
4.  Simulación de compra con promesa asíncrona.

## Instalación

1.  Clonar el repositorio: `git clone https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories`
2.  Abrir `index.html` en el navegador (o usar la URL de GitHub Pages).