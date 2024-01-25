
import fs from "fs/promises";

class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.cartIdCounter = 0;
        this.path = filePath;
        this.fileName = "carts.json";
    }

    async init() {
        await this.loadCarts();
    }

    async addCart(cart) {
        cart.id = this.cartIdCounter;
        this.carts.push(cart);
        await this.saveCarts();
        console.log("Carrito agregado:", cart);
    }

    async getCarts(){
        await this.loadCarts();
        return this.carts;
    }

    async getCartById(cartId) {
        await this.loadCarts();
        const searchCart = this.carts.find(cart => cart.id === cartId);
        if (searchCart) {
            return searchCart;
        } else {
            console.error("Carrito no encontrado:", cartId);
        }
    }

    async generateCartId() {
        return this.cartIdCounter++;
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path + this.fileName, "utf8");
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar el archivo de carritos:", error);
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        try {
            await fs.writeFile(this.path + this.fileName, data, "utf8");
        } catch (error) {
            console.log("No se pudo guardar el archivo de carritos.");
        }
    }


async updateCart(updatedCart) {
    const index = this.findIndexById(updatedCart.id);

    if (index !== -1) {
        this.carts[index] = {
            ...this.carts[index],
            ...updatedCart
        };
        await this.saveCarts();
        console.log('Carrito actualizado:', this.carts[index]);
    } else {
        console.error('Carrito no encontrado:', updatedCart.id);
    }
}

findIndexById(cartId) {
    return this.carts.findIndex(cart => cart.id === cartId);
}

}

export default CartManager;