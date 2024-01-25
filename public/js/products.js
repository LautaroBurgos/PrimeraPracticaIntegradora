const btns = document.getElementsByTagName('button');

const addProductsToCart = async (pId) => {

    try {
        const result = await fetch(`http://localhost:8080/api/carts/6599a5f6382258907f022ef5/products/${pId}`, {
            body: JSON.stringify({
                quantity: 1
            }),
            method: 'post',
            headers: {
               'Content-Type': 'application/json' 
            }
        });
        if(result.status === 200 || result.status === 201){
            alert('Se agregó correctamente');
        }
        else{
           console.error('Error, no se pudo agregar');
        }
    } catch (error) {
        alert('Error, no se pudo agregar');
    }
}

for(let btn of btns){
    btn.addEventListener('click', (event) => {
        addProductsToCart(btn.id);
    });
}