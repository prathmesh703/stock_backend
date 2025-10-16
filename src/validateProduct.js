export const validateProduct = (product) => {
    const error =[];
   const { sku, name, brand } = product;
    const quantity = parseInt(product.quantity);
    const price = parseInt(product.price);
    const mrp = parseInt(product.mrp);
     if (!sku || !name || !brand || !product.mrp || !product.price || !product.quantity) {
        error.push("Some required fields are empty");
    }  
  if (!isNaN(mrp) && !isNaN(price) && price > mrp) {
        error.push("Price must be less than or equal to MRP");
    }
    if (isNaN(quantity) || quantity < 0) {
        error.push("Invalid quantity");
    }


    return error;
};

