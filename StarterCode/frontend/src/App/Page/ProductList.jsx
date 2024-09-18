import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', 
    },
    secondary: {
      main: '#ff5722',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
  };

  const handleModalSubmit = () => {
    if (edit) {
      handleEditSubmit();
    } else {
      handleAddProduct();
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/products', {
        ...newProduct,
      });

      setProducts([...products, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEdit = (product) => {
    setEdit(true);
    setEditingProductId(product.id);
    setNewProduct({ ...product });
    handleOpen();
  };

  const handleEditSubmit = async () => {
    try {
      const { data } = await axios.put('http://localhost:3000/api/products/edit', {
        id: editingProductId,
        ...newProduct,
      });
  
      setProducts(products.map(product => 
        product.id === editingProductId 
          ? { ...product, ...data.product }
          : product
      ));
  
      handleClose();
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <ThemeProvider theme={customTheme}>
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Product List
      </Typography>
      <hr />

      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Product
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{edit ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={newProduct.imageUrl}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleModalSubmit}>
            {edit ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          backgroundColor: 'aliceblue',
          padding: 2,
          borderRadius: 2,
          mt: 4, 
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {products.map(product => (
            <Card key={product.id} sx={{ width: 200, margin: 2, textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="h6">${product.price}</Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <IconButton color="primary" onClick={() => handleEdit(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  </ThemeProvider>

  );
};

export default ProductList;
