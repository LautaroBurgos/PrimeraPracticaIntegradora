import { productManager, cartManager } from "../app.js";
import { Router } from "express";

const cartRouter = Router();

cartRouter.get("/:cId", async (req, res) => {
    try{
      const {cId}=req.params
      const result = await cartManager.getProductsCartById(cId)
      if (result.message==="OK"){
        return res.status(200).json(result)
      }
      res.status(400).json(result)
    }
    catch(err)
    {
      res.status(400).json({message: "The cart doesn't exist"})
    }
  })

cartRouter.delete('/:cId', async (req, res) => {
    try {
        const { cId } = req.params;
        const deleted = await cartManager.deleteAllProductsInCart(cId);

        if (deleted) {
            return res.status(200).json({ message: 'Products deleted' });
        } else {
            return res.status(404).json({ message: 'Could not delete products', error: 'Cart not found or no products to delete' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

cartRouter.put('/:cId/products/:pId', async (req, res) => {
    const { cId, pId } = req.params;
    const { quantity } = req.body;
    const result = await cartManager.updateProductInCart(cId, pId, quantity);
    if(result){
      res.send({message: 'Product updated'});
    }
    else{
      res.status(400).send({message: 'could not update product'});
    }
  });

cartRouter.put('/:cId', async (req, res) => {
    const { cId } = req.params;
    const cart = req.body;
    try {
      const result = await cartManager.updateCart(cId, cart);
      if(result.modifiedCount > 0){
        res.send({message: 'Cart updated'});
      }
      else{
        res.status(400).send({message: 'Could not update cart'});
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({message: 'Could not update cart'});
    }
  });

cartRouter.delete('/:cId/products/:pId', async (req, res) => {
    const { cId, pId } = req.params;
    
    try {
      const result = await cartManager.deleteProductInCart(cId, pId);
      if(result){
        res.send({message: 'Product deleted'});
      }
      else{
        res.status(400).json({message: 'Product not deleted'});
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({message: 'could not delete product'});
    }
  });

cartRouter.post("/", async (req, res) => {
    try {
        const newCartId = await cartManager.generateCartId();

        const newCart = {
            id: newCartId,
            products: []
        };

        await cartManager.addCart(newCart);

        res.status(201).send({ message: "Cart created successfully.", cart: newCart});
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).send({ error: "Server error during cart creation"});
    }
});

cartRouter.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const existingCart = await cartManager.getCartById(id);
        if (!existingCart) {
            return res.status(404).send({ error: "Cart not found"});
        }

        const cartProducts = existingCart.products;

        res.send({ message: "Products obtained.", products: cartProducts});
    } catch (error) {
        console.error("Error getting cart's products.", error);
        res.status(500).send({error: "Server error getting cart's products."});
    }
})

cartRouter.post("/:cId/products/:pId",async (req,res)=>{
  try{
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const carts = new cartManager()
    console.log({cId, pId, newQuantity});
    const result = await carts.addProductsToCart(cId, pId, newQuantity)

    if (result){
      return res.status(200).json({message: 'Product added'});
    }
    res.status(400).json({message: 'Product was not added'});
  }
  catch(err){
    console.error('Error:', err);
    res.status(400).send({err});
}
})

export default cartRouter;