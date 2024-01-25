import productModel from "./models/product.model.js"

class ProductManager {
    constructor() {
        this.products = [];
    }

    async init() {
        await this.loadProducts();
    }

    async addProduct(product) {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();

            await this.loadProducts();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }
    
    generateProductId() {
        return 0;
    }

    async getProducts() {
        return this.products
    }
  
    async getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }
  
    async updateProduct(updatedProduct) {
        try {
            await productModel.findByIdAndUpdate(updatedProduct.id, updatedProduct);

            await this.loadProducts();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }
  
    async deleteProduct(productId) {
        try {
            await productModel.findByIdAndDelete(productId);

            await this.loadProducts();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
    
  
    async loadProducts(limit = 10, page = 1, query = '', sort = '') {
        try {
          const [code, value] = query.split(':');
        
          const productsFromDB = await productModel.paginate({ [code]: value }, {
            limit,
            page,
            sort: sort ? { price: sort } : {}
          });
      
          productsFromDB.payload = productsFromDB.docs;
          delete productsFromDB.docs;
            
          return { message: "OK", ...productsFromDB };
        } catch (e) {
          console.error("Error al obtener productos desde la base de datos:", e);
          return { message: "ERROR", rdo: "No hay productos" };
        }
      }
}
            

export default ProductManager;