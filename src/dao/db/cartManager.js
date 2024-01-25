import cartModel from "./models/cart.model.js"
import mongoose from "mongoose";

class CartManager {
    constructor() {
        this.carts = [];
    }

    async init() {
        await this.loadCarts();
    }

    async addCart(cart) {
        try {
            const newCart = new cartModel(cart);
            await newCart.save();

            await this.loadCarts();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }

    async getCarts(){
        return this.carts;
    }

    async getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    async generateCartId() {
        return 0;
    }

    async loadCarts() {
        try {
            const cartsFromDB = await cartModel.find().lean();
            cartsFromDB.forEach((cart) => {
                cart.id = cart._id.toString();
                delete cart._id;
            });
            this.carts = cartsFromDB;
        } catch (error) {
            console.error("Error cargando productos desde la base de datos:", error);
        }
    }
    
    async updateCart(updatedCart) {
        try {
            await cartModel.findByIdAndUpdate(updatedCart.id, updatedCart);

            await this.loadCarts();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    async deleteProductInCart(cId, pId){
        try {
          const result = await cartModel.updateOne({_id: cId}, {
            $pull: {products : {product: new mongoose.Types.ObjectId(pId)}}
          });
          if(result.modifiedCount > 0){
            return true;
          }
          else{
            return false;
          }
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      async updateCart(cId, cart){
        try {
          const result = await cartModel.updateOne({_id: cId}, cart);
          return result;
        } catch (error) {
          console.error(error);
          return error;
        }
      }
      async updateProductInCart(cId, pId, quantity){
        if(!quantity){
          return false;
        }
        try {
          const cart = await cartModel.findOne({_id: cId});
          if(!cart){
            return false;
          }
          const product = cart.products.find(product => product.product.toString() === pId);
          if(!product){
            return false;
          }
          product.quantity = quantity;
          await cart.save();
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      async deleteAllProductsInCart(id) {
        try {
         const deleted = await cartModel.updateOne({_id: id}, {
          products: []
         });
         if(deleted.modifiedCount > 0){
          return true;
         }
         else{
          return false;
         }
        } 
        catch (e) {
         console.error(e);
         return false;
        }
      }
      async getProductsCartById(id) {
        try
        {
          const cart=await cartModel.findOne({_id: id}).populate('products.product');
          if (cart) 
            return {message: "OK" , rdo: cart.products}
          else 
            return {message: "ERROR" , rdo: "El carrito no existe o no tiene productos"}
        } 
        catch (e) {
          return {message: "ERROR" , rdo: "Error al obtener los productos del carrito - " + e.message}
       }
      }
      async addProductsToCart(cId, pId, quantity) {
        try {        
          const cart = await cartModel.findOne({_id: cId});
          if(cart){
            const existingProducts = cart.products.find(product => product.product.toString() === pId);
            if(existingProducts){
              existingProducts.quantity += quantity;
            }
            else{
              cart.products.push({product: pId, quantity});
            }
            await cart.save();
            return true;
          }
          else{
            return false;
          }
        } catch (e) {
          return false;
        }
      }
}

export default CartManager;