import { Router } from "express";
import { productManager } from "../app.js"; 

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = '' } = req.query;
    console.log("Query parameters:", { limit, page, query, sort });
    const result = await productManager.loadProducts(limit, page, query, sort);
    console.log("Result:", result);
    if(result){
      res.send(result);
    }
    else{
      res.status(400).json({message: 'Not found'})
    }
  } 
  catch (err) {
    console.log({ err });
    res.status(400).json({ message: "Error obtaining products" + err.message });
}
})
    
    productsRouter.get("/:id", async (req, res) => {
        const { id } = req.params;
      
        const product = await productManager.getProductById(id);
      
        if (product) {
          res.send(product);
        } else {
          res.status(404).send({ error: "Product not found" });
        }
      });

      productsRouter.post("/", async (req, res) => {
        try {
            const {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ error: "Must complete each field" })
            }
            const newProductId = productManager.generateProductId();

            const newProduct = {
                id: newProductId,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails: thumbnails || []
            }

            await productManager.addProduct(newProduct);

            res.status(201).send({ message: "Product added successfully.", product: newProduct})
        } catch (error) {
            console.error("Error adding the product:", error);
            res.status(500).send({ error:"Server error adding the product." })
        }
      });

      productsRouter.put("/:id", async (req, res) => {
        try {
          const {id} = req.params;

          const existingProduct = await productManager.getProductById(id);
          if (!existingProduct) {
            return res.status(404).send({ error: "Product not found"});
          }

          const {
            title, 
            description,
            code,
            price,
            stock,
            category,
            thumbnails
          } = req.body;

            existingProduct.title = title || existingProduct.title;
            existingProduct.description = description || existingProduct.description;
            existingProduct.code = code || existingProduct.code;
            existingProduct.price = price || existingProduct.price;
            existingProduct.stock = stock || existingProduct.stock;
            existingProduct.category = category || existingProduct.category;
            existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;

            console.log(existingProduct)

            await productManager.updateProduct(existingProduct);

            res.send({ message: "Product updated!.", product: existingProduct});
        } catch (error) {
          console.error("Error updating product:", error);
          res.status(500).send({ error: "Server error updating the product"});
        }
      })

      productsRouter.delete("/:id", async (req, res) => {
        try {
          const {id} = req.params;

          const existingProduct = await productManager.getProductById(id);
          if (!existingProduct) {
            return res.status(404).send({ error: "Product not found"})
          }

          await productManager.deleteProduct(id);

          res.send({ message: "Product deleted"});
        }
        catch (error) {
          console.error("Error deleting the product:", error);
          res.status(500).send({error: "Server error deleting the product"})
        }
      })


export default productsRouter;