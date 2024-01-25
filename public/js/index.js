
const botones_delete = document.querySelectorAll(".btn_delete");

const addbtn =document.getElementById("realtimeAddProduct");

addbtn.addEventListener('click',createProduct);

botones_delete.forEach((boton) => {
  boton.addEventListener("click", () => {
    const productoId = boton.getAttribute("data-producto-id");
    socket.emit("deleteProduct", productoId);
  });
});

function createProduct() {
  const newProductName = document.getElementById("newProductName").value;
  const newProductPrice = document.getElementById("newProductPrice").value;
  const newProductCategory =
    document.getElementById("newProductCategory").value;

  const newProduct = {
    title: newProductName,
    descripcion: "",
    code: "",
    status: true,
    stock: 0,
    price: newProductPrice,
    thumbnails: [],
    category: newProductCategory,
  };
  console.log(newProduct);
  socket.emit("addProduct", newProduct);

  document.getElementById("productForm").reset();
}

// const socket = io();
// socket.on("updateProducts", (productos) => {
//     if (Array.isArray(productos)) {
//         const productList = document.getElementById("product-list");
//         productList.innerHTML = productos
//           .map(
//             (product) => `
//             <div>
//               <h3 style="color: green;">${product.title}</h3>
//               <p><strong>Price:</strong> ${product.price}</p>
//               <p><strong>Category:</strong> ${product.category}</p>
//               <button class="btn_delete" data-producto-id=${product.id}>ELIMINAR</button>
//             </div>`
//           )
//           .join('');

//         const new_botones_delete = document.querySelectorAll(".btn_delete");

//         new_botones_delete.forEach((boton) => {
//           boton.addEventListener('click', () => {
//             const productoId = parseInt(boton.getAttribute("data-producto-id"))
//             socket.emit('deleteProduct', productoId);
//           })
//         })
//     } else {
//         console.error("El objeto productos no es un array.");
//     }
// });
