import fs from 'fs/promises';

    class ProductManager {
    constructor(filePath) {
      this.products = [];
      this.productIdCounter = 0; 
      this.path = filePath;
      this.fileName = 'products.json';
    }

    async init() {
      await this.loadProducts();

      console.log(this.products)

      //idea para que productIdCounter empiece con un id que respete los productos que ya hay pero no funciona
      //this.products.forEach((producto) => {
      //  if(producto.id > productIdCounter) {
      //    productIdCounter = producto.id + 1;
      //  }
      //})
    }

    async addProduct(product) {
      this.products.push(product);
      await this.saveProducts();
      console.log('Producto agregado:', product);
    }

    generateProductId() {
      this.productIdCounter++;
      return this.productIdCounter.toString();
    }
  
    async getProducts() {
      await this.loadProducts();
      return this.products;
    }

    async getProductById(productId) {
      await this.loadProducts();
      const searchProduct = this.products.find(product => product.id === productId);
      if (searchProduct) {
        return searchProduct;
      } else {
        console.error('Producto no encontrado:', productId);
      }
  }

  async updateProduct(updatedProduct) {
    const index = this.findIndexById(updatedProduct.id);

    console.log('Intentando actualizar producto con ID:', updatedProduct.id);
    console.log('Productos actuales:', this.products);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
        
      };
      await this.saveProducts();
      console.log('Producto actualizado:', this.products[index]);
    } else {
      console.error('Producto no encontrado:', productId);
    }
  }

  async deleteProduct(productId) {
    const index = this.findIndexById(productId);

    console.log(typeof(productId))

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      await this.saveProducts();
      console.log('Producto eliminado:', deletedProduct);
    } else {
      console.error('Producto no encontrado:', productId);
    }
  }

  findIndexById(productId) {
    return this.products.findIndex(product => product.id === productId);
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path + this.fileName, 'utf8');
      this.products = JSON.parse(data);

    } catch (error) {
      console.error('Error al cargar el archivo de productos:', error);
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    try {
      await fs.writeFile(this.path + this.fileName, data, 'utf8');
    } catch (error) {
      console.log('No se pudo guardar el archivo de productos.');
    }
  }
}

export default ProductManager