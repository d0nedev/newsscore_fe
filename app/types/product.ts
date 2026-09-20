export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Body for both POST /api/products and PUT /api/products/:id.
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}
