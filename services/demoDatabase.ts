// FIX: Replaced placeholder content with a full mock database implementation.
import {
  type User,
  UserRole,
  type Order,
  OrderStatus,
  type Product,
  GarmentType,
  type OrderData,
  Unit,
} from '../types';

// Simple ID generator
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

// MOCK DATA
let users: User[] = [
  {
    id: 'user-1',
    name: 'Saman Perera',
    email: 'customer@example.com',
    passwordHash: 'customer123',
    role: UserRole.CUSTOMER,
    phone: '0771234567',
    address: '123 Galle Road, Colombo 3',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=facearea&facepad=2&ixlib=rb-4.0.3'
  },
  {
    id: 'user-2',
    name: 'Fathima R.',
    email: 'fathima@example.com',
    passwordHash: 'password123',
    role: UserRole.CUSTOMER,
    phone: '0719876543',
    address: '456 Kandy Road, Kandy',
  },
  {
    id: 'user-admin',
    name: 'Firoza Sharmila',
    email: 'admin@example.com',
    passwordHash: 'admin123',
    role: UserRole.ADMIN,
  },
];

let products: Product[] = [
    { id: 'prod-1', name: 'Elegant Saree Blouse', description: 'A beautifully crafted silk saree blouse with intricate embroidery. Perfect for weddings and special occasions.', price: 4500, imageUrl: 'https://images.unsplash.com/photo-1617019819122-a524314c8f5f?q=80&w=800' },
    { id: 'prod-2', name: 'Casual Linen Dress', description: 'A comfortable and stylish linen dress, ideal for day wear. Breathable fabric and a relaxed fit.', price: 6200, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' },
    { id: 'prod-3', name: 'Modern Abaya', description: 'A chic and modest Abaya made from high-quality crepe. Features subtle pearl detailing on the sleeves.', price: 8500, imageUrl: 'https://images.unsplash.com/photo-1583846243221-7d949c218270?q=80&w=800' },
    { id: 'prod-4', name: 'Classic School Uniform', description: 'Durable and well-stitched school uniform, made to withstand daily wear and tear. Available for all major schools.', price: 3500, imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f68c6aa98?q=80&w=800' },
];

let orders: Order[] = [
  {
    id: 'ORD-001', userId: 'user-1', customerName: 'Saman Perera', date: '2023-10-26', garmentType: GarmentType.SAREE_BLOUSE, status: OrderStatus.DELIVERED, price: 4800.00,
    orderData: {} as OrderData,
  },
  {
    id: 'ORD-002', userId: 'user-2', customerName: 'Fathima R.', date: '2023-10-28', garmentType: GarmentType.ABAYA, status: OrderStatus.STITCHING, price: 8500.00,
    orderData: {} as OrderData,
  },
  {
    id: 'ORD-003', userId: 'user-1', customerName: 'Saman Perera', date: '2023-11-01', garmentType: GarmentType.LADIES_DRESS, status: OrderStatus.PENDING_QUOTE, price: null,
    orderData: {} as OrderData,
  },
  {
    id: 'ORD-004', userId: 'user-2', customerName: 'Fathima R.', date: '2023-11-02', garmentType: GarmentType.SCHOOL_UNIFORM, status: OrderStatus.CANCELLED, price: 3500.00,
    orderData: {} as OrderData,
  },
];

// AUTHENTICATION
export const authenticateUser = (email: string, password: string, role: UserRole): User | null => {
  const user = users.find(u => u.email === email && u.role === role);
  if (user && user.passwordHash === password) {
    return user;
  }
  return null;
};

export const createUser = (name: string, email: string, password: string, role: UserRole): { success: boolean, error?: string } => {
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const newUser: User = {
    id: generateId('user'),
    name,
    email,
    passwordHash: password,
    role,
  };
  users.push(newUser);
  return { success: true };
};

export const updateUser = (userId: string, updatedData: Partial<User>): User | null => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        return users[userIndex];
    }
    return null;
};

// Helper to convert a File to a storable Data URL format
const fileToDataUrl = (file: File): Promise<{ name: string; url: string; type: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, url: reader.result as string, type: file.type });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

// ORDERS
export const createOrder = async (newOrderData: Omit<Order, 'id' | 'date' | 'status' | 'price'>): Promise<Order> => {
  const designFileData = await Promise.all(
    (newOrderData.orderData.designFiles || []).map(file => fileToDataUrl(file))
  );

  const newOrder: Order = {
    ...newOrderData,
    id: generateId('ORD'),
    date: new Date().toISOString().split('T')[0],
    status: OrderStatus.PENDING_QUOTE,
    price: null,
    designFileData: designFileData,
  };
  
  // Clear the File objects from the data that gets stored in memory,
  // as they are complex objects and we now have the data URLs.
  newOrder.orderData.designFiles = [];

  orders.unshift(newOrder);
  return newOrder;
};

export const getAllOrders = (): Order[] => {
  return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | null => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        return orders[orderIndex];
    }
    return null;
};

// CUSTOMERS (subset of users)
export const getAllCustomers = (): User[] => {
  return users.filter(u => u.role === UserRole.CUSTOMER);
};

// PRODUCTS
export const getProducts = (): Product[] => {
  return products;
};

export const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
        ...productData,
        id: generateId('prod'),
    };
    products.push(newProduct);
    return newProduct;
};

export const updateProduct = (productId: string, updatedData: Partial<Product>): Product | null => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedData };
        return products[productIndex];
    }
    return null;
};

export const deleteProduct = (productId: string): boolean => {
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    return products.length < initialLength;
};