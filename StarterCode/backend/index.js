const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 

/* Initial product list. */
let products = [
    { id: 1, name: 'Product 1', description: 'description 1', price: 100, imageUrl: '' },
    { id: 2, name: 'Product 2', description: 'description 2', price: 200, imageUrl: '' },
    { id: 3, name: 'Product 3', description: 'description 3', price: 300, imageUrl: '' },
    { id: 4, name: 'Product 4', description: 'description 4', price: 150, imageUrl: '' },
    { id: 5, name: 'Product 5', description: 'description 5', price: 500, imageUrl: '' },
    { id: 6, name: 'Product 6', description: 'description 6', price: 50, imageUrl: '' },
];

/* Fetches a random image URL. */
const fetchImageUrl = () => {
    return `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`;
};

/* Supports product card retrieval. */
app.get('/api/products', (req, res) => {
    const productsWithImages = products.map(product => ({
        ...product,
        imageUrl: product.imageUrl || fetchImageUrl()
    }));
    res.json(productsWithImages);
});

/* Supports product card additions. */
app.post('/api/products', (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
        imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl : fetchImageUrl(),
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/* Supports product card deletions. */
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(product => product.id === parseInt(id, 10));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
});

/* Supports product card edits. */
app.put('/api/products/edit', (req, res) => {
    const { id, name, description, price, imageUrl } = req.body;

    const productIndex = products.findIndex(product => product.id === parseInt(id, 10));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const existingProduct = products[productIndex];

    const updatedProduct = {
        ...existingProduct,
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price !== undefined ? price : existingProduct.price,
        imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl : existingProduct.imageUrl || fetchImageUrl(),
    };

    products[productIndex] = updatedProduct;

    res.json({ message: 'Product updated successfully', product: updatedProduct });
});

/* Server startup console message. */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
