/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import {
  type User,
  UserRole,
  type Product,
  type Order,
  OrderStatus,
  GarmentType,
  Unit,
} from '../types';

// Environment variables from Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;
let isUsingSupabase = false;

// Check if credentials are valid and not placeholders
if (
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon')
) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isUsingSupabase = true;
    console.log('✨ Supabase client successfully initialized!');
  } catch (error) {
    console.error('⚠️ Failed to initialize Supabase client:', error);
  }
} else {
  console.warn(
    '💡 FiroFits: Supabase credentials not found or set to default placeholders. Falling back to secure localStorage mode for demonstration!'
  );
}

export { supabase, isUsingSupabase };

// ==========================================
// SEED MOCK DATA FOR FAIL-SAFE FALLBACK MODE
// ==========================================
const DEFAULT_USERS: User[] = [
  {
    id: 'user-customer-1',
    name: 'Saman Perera',
    email: 'customer@example.com',
    passwordHash: 'customer123',
    role: UserRole.CUSTOMER,
    phone: '0771234567',
    address: '123 Galle Road, Colombo 3',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=facearea&facepad=2',
  },
  {
    id: 'user-admin-1',
    name: 'Firoza Sharmila',
    email: 'admin@example.com',
    passwordHash: 'admin123',
    role: UserRole.ADMIN,
    phone: '0711122334',
    address: 'Bespoke Atelier, Ward Place, Colombo 7',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=facearea&facepad=2',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-abaya',
    name: 'Midnight Silk Abaya',
    description: 'An exquisite, flowing abaya tailored from premium Nidha silk. Features delicate hand-sewn pearl embellishments on the bell sleeves and a sleek, contemporary front-open cut. Perfect for luxurious modest wear.',
    price: 18500,
    imageUrl: 'https://images.unsplash.com/photo-1583846243221-7d949c218270?q=80&w=800',
    category: 'Couture modeste',
    stock: 8,
  },
  {
    id: 'prod-saree',
    name: 'Golden Zari Saree Blouse',
    description: 'An elegant Raw Silk saree blouse with elaborate hand-embroidered back panels, intricate gold zari cords, and fine beadwork. Custom tailored to highlight timeless heritage craftsmanship.',
    price: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
    category: 'Heritage Bridal',
    stock: 5,
  },
  {
    id: 'prod-dress',
    name: 'Saint-Tropez Linen Dress',
    description: 'A breathable, chic linen mid-length sundress crafted from organic European flax. Features a sweetheart neckline, delicate smocked back detailing, and a flattering flared silhouette.',
    price: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
    category: 'Summer Resort',
    stock: 12,
  },
  {
    id: 'prod-trousers',
    name: 'Atelier Tailored Linen Trousers',
    description: 'High-waisted, wide-leg trousers engineered in a soft-washed Italian linen. Showcases precise front pleats, structured side pockets, and an adjustable side buckle for an impeccably sharp fit.',
    price: 9500,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
    category: 'Classic Essentials',
    stock: 15,
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    userId: 'user-customer-1',
    customerName: 'Saman Perera',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
    garmentType: GarmentType.ABAYA,
    status: OrderStatus.STITCHING,
    price: 18500,
    orderData: {
      service: GarmentType.ABAYA,
      designFiles: [],
      specialInstructions: 'Please make the sleeve length exactly 22 inches and add black pearls instead of white.',
      measurements: {
        shoulder: '15.5',
        chest: '36',
        waist: '30',
        hip: '40',
        fullLength: '56',
        vestLength: '',
        sleeveLength: '22',
        armhole: '16',
        collarSize: '',
      },
      unit: Unit.INCHES,
      hasPearlWork: true,
      deliveryDetails: {
        name: 'Saman Perera',
        contact: '0771234567',
        address: '123 Galle Road, Colombo 3',
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    },
  },
  {
    id: 'ORD-4029',
    userId: 'user-customer-1',
    customerName: 'Saman Perera',
    date: new Date().toISOString().split('T')[0],
    garmentType: GarmentType.LADIES_DRESS,
    status: OrderStatus.PENDING_QUOTE,
    price: null,
    orderData: {
      service: GarmentType.LADIES_DRESS,
      designFiles: [],
      specialInstructions: 'Require organic linen fabric. Needs a double lining around the chest panel.',
      measurements: {
        shoulder: '15.0',
        chest: '35',
        waist: '28',
        hip: '38',
        fullLength: '45',
        vestLength: '',
        sleeveLength: '12',
        armhole: '15',
        collarSize: '14',
      },
      unit: Unit.INCHES,
      hasPearlWork: false,
      deliveryDetails: {
        name: 'Saman Perera',
        contact: '0771234567',
        address: '123 Galle Road, Colombo 3',
        deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    },
  },
];

// Initialize localStorage DB if empty
const initLocalStorageDB = () => {
  if (!localStorage.getItem('firofits_users')) {
    localStorage.setItem('firofits_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('firofits_products')) {
    localStorage.setItem('firofits_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem('firofits_orders')) {
    localStorage.setItem('firofits_orders', JSON.stringify(DEFAULT_ORDERS));
  }
};
initLocalStorageDB();

// Helper to generate bespoke IDs
const generateBespokeId = (prefix: string) =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

// ==========================================
// SERVICE IMPLEMENTATION (SUPABASE + FALLBACK)
// ==========================================

// AUTHENTICATION
export const authenticateUser = async (
  email: string,
  passwordHash: string,
  role: UserRole
): Promise<User | null> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', role)
        .single();

      if (error || !data) return null;
      if (data.password_hash === passwordHash) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          passwordHash: data.password_hash,
          role: data.role as UserRole,
          phone: data.phone,
          address: data.address,
          profilePhotoUrl: data.profile_photo_url,
        };
      }
      return null;
    } catch (e) {
      console.error('Supabase auth error:', e);
    }
  }

  // LocalStorage fallback
  const users: User[] = JSON.parse(localStorage.getItem('firofits_users') || '[]');
  const user = users.find((u) => u.email === email && u.role === role);
  if (user && user.passwordHash === passwordHash) {
    return user;
  }
  return null;
};

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> => {
  if (isUsingSupabase) {
    try {
      // First check if user exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const { error } = await supabase.from('users').insert([
        {
          name,
          email,
          password_hash: passwordHash,
          role,
        },
      ]);

      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      console.error('Supabase signup error:', e);
      return { success: false, error: e.message || 'Database error occurred.' };
    }
  }

  // LocalStorage fallback
  const users: User[] = JSON.parse(localStorage.getItem('firofits_users') || '[]');
  if (users.some((u) => u.email === email)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: generateBespokeId('USR'),
    name,
    email,
    passwordHash,
    role,
  };
  users.push(newUser);
  localStorage.setItem('firofits_users', JSON.stringify(users));
  return { success: true };
};

export const updateUser = async (
  userId: string,
  updatedData: Partial<User>
): Promise<User | null> => {
  if (isUsingSupabase) {
    try {
      // Map properties to Supabase snake_case schema
      const mappedData: any = {};
      if (updatedData.name !== undefined) mappedData.name = updatedData.name;
      if (updatedData.phone !== undefined) mappedData.phone = updatedData.phone;
      if (updatedData.address !== undefined) mappedData.address = updatedData.address;
      if (updatedData.profilePhotoUrl !== undefined)
        mappedData.profile_photo_url = updatedData.profilePhotoUrl;

      const { data, error } = await supabase
        .from('users')
        .update(mappedData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        passwordHash: data.password_hash,
        role: data.role as UserRole,
        phone: data.phone,
        address: data.address,
        profilePhotoUrl: data.profile_photo_url,
      };
    } catch (e) {
      console.error('Supabase update user error:', e);
    }
  }

  // LocalStorage fallback
  const users: User[] = JSON.parse(localStorage.getItem('firofits_users') || '[]');
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('firofits_users', JSON.stringify(users));
    return users[userIndex];
  }
  return null;
};

// CUSTOMERS
export const getAllCustomers = async (): Promise<User[]> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'Customer');
      if (error) throw error;
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        passwordHash: d.password_hash,
        role: d.role as UserRole,
        phone: d.phone,
        address: d.address,
        profilePhotoUrl: d.profile_photo_url,
      }));
    } catch (e) {
      console.error('Supabase get customers error:', e);
    }
  }

  const users: User[] = JSON.parse(localStorage.getItem('firofits_users') || '[]');
  return users.filter((u) => u.role === UserRole.CUSTOMER);
};

// PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || '',
        price: Number(d.price),
        imageUrl: d.image_url || '',
        category: d.category || 'Ready-to-Wear',
        stock: d.stock || 0,
      }));
    } catch (e) {
      console.error('Supabase get products error:', e);
    }
  }

  return JSON.parse(localStorage.getItem('firofits_products') || '[]');
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: productData.imageUrl,
            category: productData.category || 'Ready-to-Wear',
            stock: productData.stock || 10,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        imageUrl: data.image_url || '',
        category: data.category || 'Ready-to-Wear',
        stock: data.stock || 0,
      };
    } catch (e) {
      console.error('Supabase add product error:', e);
    }
  }

  // LocalStorage fallback
  const products: Product[] = JSON.parse(
    localStorage.getItem('firofits_products') || '[]'
  );
  const newProduct: Product = {
    ...productData,
    id: generateBespokeId('PROD'),
  };
  products.push(newProduct);
  localStorage.setItem('firofits_products', JSON.stringify(products));
  return newProduct;
};

export const updateProduct = async (
  productId: string,
  updatedData: Partial<Product>
): Promise<Product | null> => {
  if (isUsingSupabase) {
    try {
      const mapped: any = {};
      if (updatedData.name !== undefined) mapped.name = updatedData.name;
      if (updatedData.description !== undefined) mapped.description = updatedData.description;
      if (updatedData.price !== undefined) mapped.price = updatedData.price;
      if (updatedData.imageUrl !== undefined) mapped.image_url = updatedData.imageUrl;
      if (updatedData.category !== undefined) mapped.category = updatedData.category;
      if (updatedData.stock !== undefined) mapped.stock = updatedData.stock;

      const { data, error } = await supabase
        .from('products')
        .update(mapped)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        imageUrl: data.image_url || '',
        category: data.category || 'Ready-to-Wear',
        stock: data.stock || 0,
      };
    } catch (e) {
      console.error('Supabase update product error:', e);
    }
  }

  // LocalStorage fallback
  const products: Product[] = JSON.parse(
    localStorage.getItem('firofits_products') || '[]'
  );
  const idx = products.findIndex((p) => p.id === productId);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updatedData };
    localStorage.setItem('firofits_products', JSON.stringify(products));
    return products[idx];
  }
  return null;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  if (isUsingSupabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase delete product error:', e);
      return false;
    }
  }

  // LocalStorage fallback
  const products: Product[] = JSON.parse(
    localStorage.getItem('firofits_products') || '[]'
  );
  const initialLength = products.length;
  const filtered = products.filter((p) => p.id !== productId);
  localStorage.setItem('firofits_products', JSON.stringify(filtered));
  return filtered.length < initialLength;
};

// Helper: Convert File to storable Data URL
const fileToDataUrl = (file: File): Promise<{ name: string; url: string; type: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, url: reader.result as string, type: file.type });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// ORDERS
export const createOrder = async (
  newOrderData: Omit<Order, 'id' | 'date' | 'status' | 'price'>
): Promise<Order> => {
  const designFileData = await Promise.all(
    (newOrderData.orderData.designFiles || []).map((file) => fileToDataUrl(file))
  );

  const bespokeId = generateBespokeId('ORD');
  const currentDate = new Date().toISOString().split('T')[0];

  const completeOrder: Order = {
    ...newOrderData,
    id: bespokeId,
    date: currentDate,
    status: newOrderData.items ? OrderStatus.FABRIC_SOURCING : OrderStatus.PENDING_QUOTE, // Ready-to-wear goes straight to fabric sourcing
    price: null,
    designFileData: designFileData,
  };

  // Safe clean file lists
  completeOrder.orderData.designFiles = [];

  if (isUsingSupabase) {
    try {
      const { error } = await supabase.from('orders').insert([
        {
          id: completeOrder.id,
          user_id: completeOrder.userId,
          customer_name: completeOrder.customerName,
          date: completeOrder.date,
          garment_type: completeOrder.garmentType,
          status: completeOrder.status,
          price: completeOrder.price,
          order_data: {
            specialInstructions: completeOrder.orderData.specialInstructions,
            measurements: completeOrder.orderData.measurements,
            unit: completeOrder.orderData.unit,
            hasPearlWork: completeOrder.orderData.hasPearlWork,
            deliveryDetails: completeOrder.orderData.deliveryDetails,
          },
          design_file_data: completeOrder.designFileData || [],
          items: completeOrder.items || null,
        },
      ]);
      if (error) throw error;
      return completeOrder;
    } catch (e) {
      console.error('Supabase create order error:', e);
    }
  }

  // LocalStorage fallback
  const orders: Order[] = JSON.parse(localStorage.getItem('firofits_orders') || '[]');
  orders.unshift(completeOrder);
  localStorage.setItem('firofits_orders', JSON.stringify(orders));

  // If ready-to-wear, deduct stock locally
  if (completeOrder.items) {
    const products: Product[] = JSON.parse(
      localStorage.getItem('firofits_products') || '[]'
    );
    completeOrder.items.forEach((item) => {
      const pIdx = products.findIndex((p) => p.id === item.productId);
      if (pIdx !== -1 && products[pIdx].stock) {
        products[pIdx].stock = Math.max(0, (products[pIdx].stock || 0) - item.quantity);
      }
    });
    localStorage.setItem('firofits_products', JSON.stringify(products));
  }

  return completeOrder;
};

export const getAllOrders = async (): Promise<Order[]> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        customerName: d.customer_name,
        date: d.date,
        garmentType: d.garment_type as GarmentType,
        status: d.status as OrderStatus,
        price: d.price ? Number(d.price) : null,
        orderData: {
          service: d.garment_type as GarmentType,
          designFiles: [],
          specialInstructions: d.order_data.specialInstructions || '',
          measurements: d.order_data.measurements || {},
          unit: d.order_data.unit || Unit.INCHES,
          hasPearlWork: d.order_data.hasPearlWork || false,
          deliveryDetails: d.order_data.deliveryDetails || {},
        },
        designFileData: d.design_file_data || [],
        items: d.items || undefined,
      }));
    } catch (e) {
      console.error('Supabase get orders error:', e);
    }
  }

  const orders: Order[] = JSON.parse(localStorage.getItem('firofits_orders') || '[]');
  return [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getCustomerOrders = async (userId: string): Promise<Order[]> => {
  const allOrders = await getAllOrders();
  return allOrders.filter(order => order.userId === userId);
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  price: number | null = null
): Promise<Order | null> => {
  if (isUsingSupabase) {
    try {
      const updatePayload: any = { status };
      if (price !== null) updatePayload.price = price;

      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        userId: data.user_id,
        customerName: data.customer_name,
        date: data.date,
        garmentType: data.garment_type as GarmentType,
        status: data.status as OrderStatus,
        price: data.price ? Number(data.price) : null,
        orderData: {
          service: data.garment_type as GarmentType,
          designFiles: [],
          specialInstructions: data.order_data.specialInstructions || '',
          measurements: data.order_data.measurements || {},
          unit: data.order_data.unit || Unit.INCHES,
          hasPearlWork: data.order_data.hasPearlWork || false,
          deliveryDetails: data.order_data.deliveryDetails || {},
        },
        designFileData: data.design_file_data || [],
        items: data.items || undefined,
      };
    } catch (e) {
      console.error('Supabase update order status error:', e);
    }
  }

  // LocalStorage fallback
  const orders: Order[] = JSON.parse(localStorage.getItem('firofits_orders') || '[]');
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    if (price !== null) {
      orders[idx].price = price;
    }
    localStorage.setItem('firofits_orders', JSON.stringify(orders));
    return orders[idx];
  }
  return null;
};
