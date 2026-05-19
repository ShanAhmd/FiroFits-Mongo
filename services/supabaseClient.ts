/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import {
  type User,
  UserRole,
  type Product,
  type Order,
  type Package,
  type PackageItem,
  type Coupon,
  PackageType,
  ProductCategory,
  OrderStatus,
  GarmentType,
  Unit,
  PaymentStatus,
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
      } as any,
      customItems: [],
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
      } as any,
      customItems: [],
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

// Helper: Upload file to products_uploads storage bucket
export const uploadProductImage = async (fileOrBase64: File | string, filename: string): Promise<string> => {
  if (!isUsingSupabase || !supabase) {
    if (typeof fileOrBase64 === 'string') return fileOrBase64;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(fileOrBase64 as File);
    });
  }

  try {
    let body: Blob | File;
    let contentType = 'image/jpeg';
    
    if (typeof fileOrBase64 === 'string') {
      if (!fileOrBase64.startsWith('data:image')) {
        return fileOrBase64;
      }
      const parts = fileOrBase64.split(';base64,');
      const base64Data = parts[1];
      const match = parts[0].match(/:(.*?)$/);
      if (match) contentType = match[1];
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      body = new Blob([byteArray], { type: contentType });
    } else {
      body = fileOrBase64;
      contentType = fileOrBase64.type;
    }

    const cleanName = filename.replace(/[^a-zA-Z0-9.]/g, '_');
    const path = `${Date.now()}-${cleanName}`;
    const { data, error } = await supabase.storage
      .from('products_uploads')
      .upload(path, body, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('products_uploads')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading product image:', error);
    if (typeof fileOrBase64 === 'string') return fileOrBase64;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(fileOrBase64 as File);
    });
  }
};

// Helper: Upload file to products_uploads storage bucket for customer design references
const uploadFileToSupabase = async (file: File): Promise<{ name: string; url: string; type: string }> => {
  if (!isUsingSupabase || !supabase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, url: reader.result as string, type: file.type });
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const path = `${Date.now()}-${cleanFileName}`;
    const { data, error } = await supabase.storage
      .from('products_uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('products_uploads')
      .getPublicUrl(data.path);

    return {
      name: file.name,
      url: publicUrlData.publicUrl,
      type: file.type
    };
  } catch (error) {
    console.error('Failed uploading design file to Supabase storage:', error);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, url: reader.result as string, type: file.type });
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
};

// ORDERS
export const createOrder = async (
  newOrderData: Omit<Order, 'id' | 'date' | 'status' | 'price'>
): Promise<Order> => {
  const designFileData = await Promise.all(
    (newOrderData.orderData.designFiles || []).map((file) => uploadFileToSupabase(file))
  );

  // Serialize design files for each individual custom garment in the items list
  const serializedCustomItems = await Promise.all(
    (newOrderData.orderData.customItems || []).map(async (item) => {
      const itemFiles = await Promise.all(
        (item.designFiles || []).map((file) => uploadFileToSupabase(file))
      );
      return {
        id: item.id,
        service: item.service,
        customGarmentName: item.customGarmentName,
        specialInstructions: item.specialInstructions,
        measurements: item.measurements,
        unit: item.unit,
        hasPearlWork: item.hasPearlWork,
        designFileData: itemFiles,
      };
    })
  );

  const bespokeId = generateBespokeId('ORD');
  const currentDate = new Date().toISOString().split('T')[0];

  // Set main garment type dynamically
  let finalGarmentType = newOrderData.garmentType;
  if (newOrderData.orderData.customItems && newOrderData.orderData.customItems.length > 1) {
    finalGarmentType = GarmentType.MULTIPLE;
  } else if (newOrderData.orderData.customItems && newOrderData.orderData.customItems.length === 1) {
    finalGarmentType = newOrderData.orderData.customItems[0].service;
  }

  const completeOrder: Order = {
    ...newOrderData,
    id: bespokeId,
    date: currentDate,
    status: newOrderData.items ? OrderStatus.FABRIC_SOURCING : OrderStatus.PENDING_QUOTE,
    price: null,
    garmentType: finalGarmentType,
    designFileData: designFileData,
  };

  // Safe clean file lists before saving
  completeOrder.orderData.designFiles = [];
  completeOrder.orderData.customItems = []; // clear raw File objects in memory

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
            customItems: serializedCustomItems,
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
  
  // Keep the serialized custom items in the fallback orderData
  const completeOrderWithSerialized: Order = {
    ...completeOrder,
    orderData: {
      ...completeOrder.orderData,
      customItems: serializedCustomItems as any,
    }
  };

  orders.unshift(completeOrderWithSerialized);
  localStorage.setItem('firofits_orders', JSON.stringify(orders));

  // If ready-to-wear, deduct stock locally
  if (completeOrderWithSerialized.items) {
    const products: Product[] = JSON.parse(
      localStorage.getItem('firofits_products') || '[]'
    );
    completeOrderWithSerialized.items.forEach((item) => {
      const pIdx = products.findIndex((p) => p.id === item.productId);
      if (pIdx !== -1 && products[pIdx].stock) {
        products[pIdx].stock = Math.max(0, (products[pIdx].stock || 0) - item.quantity);
      }
    });
    localStorage.setItem('firofits_products', JSON.stringify(products));
  }

  return completeOrderWithSerialized;
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
          customItems: d.order_data.customItems || [],
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
  price: number | null = null,
  internalNotes?: string,
  paymentStatus?: PaymentStatus
): Promise<Order | null> => {
  if (isUsingSupabase) {
    try {
      const updatePayload: any = { status };
      if (price !== null) updatePayload.price = price;
      if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes;
      if (paymentStatus !== undefined) updatePayload.payment_status = paymentStatus;

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
          customItems: data.order_data.customItems || [],
        },
        designFileData: data.design_file_data || [],
        items: data.items || undefined,
        internalNotes: data.internal_notes,
        paymentStatus: data.payment_status as PaymentStatus,
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
    if (internalNotes !== undefined) {
      orders[idx].internalNotes = internalNotes;
    }
    if (paymentStatus !== undefined) {
      orders[idx].paymentStatus = paymentStatus;
    }
    localStorage.setItem('firofits_orders', JSON.stringify(orders));
    return orders[idx];
  }
  return null;
};

// ============================================================
// BARCODE / SKU GENERATOR
// ============================================================
const generateBarcode = (productCategory?: ProductCategory, category?: string): string => {
  const catMap: Record<string, string> = {
    [ProductCategory.MEN]: 'MEN',
    [ProductCategory.WOMEN]: 'WMN',
    [ProductCategory.KIDS]: 'KDS',
    [ProductCategory.UNISEX]: 'UNI',
    [ProductCategory.ACCESSORIES]: 'ACC',
    [ProductCategory.BRIDAL]: 'BRD',
  };
  const code = productCategory ? (catMap[productCategory] || 'GEN') : 'GEN';
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `FF-${code}-${rand}`;
};

// ============================================================
// PACKAGES CRUD
// ============================================================
export const getPackages = async (): Promise<Package[]> => {
  if (isUsingSupabase) {
    try {
      const { data: pkgs, error } = await supabase
        .from('packages')
        .select('*, package_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return pkgs.map((p: any): Package => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: p.type as PackageType,
        tag: p.tag,
        description: p.description || '',
        bannerImageUrl: p.banner_image_url || '',
        badgeLabel: p.badge_label,
        discountPercent: p.discount_percent ? Number(p.discount_percent) : undefined,
        discountFlat: p.discount_flat ? Number(p.discount_flat) : undefined,
        validFrom: p.valid_from,
        validTo: p.valid_to,
        isActive: p.is_active,
        createdAt: p.created_at,
        items: (p.package_items || []).map((i: any): PackageItem => ({
          productId: i.product_id,
          productName: i.product_name,
          qty: i.qty,
        })),
      }));
    } catch (e) {
      console.error('getPackages error:', e);
    }
  }
  return JSON.parse(localStorage.getItem('firofits_packages') || '[]');
};

export const getActivePackages = async (): Promise<Package[]> => {
  const all = await getPackages();
  const today = new Date().toISOString().split('T')[0];
  return all.filter(p => p.isActive && p.validFrom <= today && p.validTo >= today);
};

export const createPackage = async (pkg: Omit<Package, 'id' | 'createdAt'>): Promise<Package> => {
  const newPkg: Package = { ...pkg, id: generateBespokeId('PKG'), createdAt: new Date().toISOString() };
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase.from('packages').insert([{
        name: newPkg.name, slug: newPkg.slug, type: newPkg.type, tag: newPkg.tag,
        description: newPkg.description, banner_image_url: newPkg.bannerImageUrl,
        badge_label: newPkg.badgeLabel, discount_percent: newPkg.discountPercent,
        discount_flat: newPkg.discountFlat, valid_from: newPkg.validFrom,
        valid_to: newPkg.validTo, is_active: newPkg.isActive,
      }]).select().single();
      if (error) throw error;
      // Insert package items
      if (newPkg.items.length > 0) {
        await supabase.from('package_items').insert(
          newPkg.items.map(i => ({ package_id: data.id, product_id: i.productId, product_name: i.productName, qty: i.qty }))
        );
      }
      return { ...newPkg, id: data.id };
    } catch (e) { console.error('createPackage error:', e); }
  }
  const packages: Package[] = JSON.parse(localStorage.getItem('firofits_packages') || '[]');
  packages.unshift(newPkg);
  localStorage.setItem('firofits_packages', JSON.stringify(packages));
  return newPkg;
};

export const updatePackage = async (id: string, updates: Partial<Package>): Promise<Package | null> => {
  if (isUsingSupabase) {
    try {
      const mapped: any = {};
      if (updates.name !== undefined) mapped.name = updates.name;
      if (updates.tag !== undefined) mapped.tag = updates.tag;
      if (updates.type !== undefined) mapped.type = updates.type;
      if (updates.description !== undefined) mapped.description = updates.description;
      if (updates.bannerImageUrl !== undefined) mapped.banner_image_url = updates.bannerImageUrl;
      if (updates.badgeLabel !== undefined) mapped.badge_label = updates.badgeLabel;
      if (updates.discountPercent !== undefined) mapped.discount_percent = updates.discountPercent;
      if (updates.discountFlat !== undefined) mapped.discount_flat = updates.discountFlat;
      if (updates.validFrom !== undefined) mapped.valid_from = updates.validFrom;
      if (updates.validTo !== undefined) mapped.valid_to = updates.validTo;
      if (updates.isActive !== undefined) mapped.is_active = updates.isActive;
      const { error } = await supabase.from('packages').update(mapped).eq('id', id);
      if (error) throw error;
      if (updates.items) {
        await supabase.from('package_items').delete().eq('package_id', id);
        if (updates.items.length > 0) {
          await supabase.from('package_items').insert(
            updates.items.map(i => ({ package_id: id, product_id: i.productId, product_name: i.productName, qty: i.qty }))
          );
        }
      }
    } catch (e) { console.error('updatePackage error:', e); }
  }
  const packages: Package[] = JSON.parse(localStorage.getItem('firofits_packages') || '[]');
  const idx = packages.findIndex(p => p.id === id);
  if (idx !== -1) { packages[idx] = { ...packages[idx], ...updates }; localStorage.setItem('firofits_packages', JSON.stringify(packages)); return packages[idx]; }
  return null;
};

export const deletePackage = async (id: string): Promise<void> => {
  if (isUsingSupabase) {
    try { await supabase.from('packages').delete().eq('id', id); } catch (e) { console.error('deletePackage error:', e); }
  }
  const packages: Package[] = JSON.parse(localStorage.getItem('firofits_packages') || '[]');
  localStorage.setItem('firofits_packages', JSON.stringify(packages.filter(p => p.id !== id)));
};

// ============================================================
// COUPONS CRUD
// ============================================================
export const getCoupons = async (): Promise<Coupon[]> => {
  if (isUsingSupabase) {
    try {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((c: any): Coupon => ({
        id: c.id, code: c.code, discountPercent: c.discount_percent ? Number(c.discount_percent) : undefined,
        discountFlat: c.discount_flat ? Number(c.discount_flat) : undefined,
        minOrderValue: c.min_order_value ? Number(c.min_order_value) : undefined,
        maxUses: c.max_uses, usedCount: c.used_count, expiresAt: c.expires_at,
        isActive: c.is_active, description: c.description,
      }));
    } catch (e) { console.error('getCoupons error:', e); }
  }
  return JSON.parse(localStorage.getItem('firofits_coupons') || '[]');
};

export const validateCoupon = async (code: string, orderTotal: number): Promise<Coupon | null> => {
  const coupons = await getCoupons();
  const today = new Date().toISOString().split('T')[0];
  const coupon = coupons.find(c =>
    c.code.toUpperCase() === code.toUpperCase() &&
    c.isActive &&
    c.expiresAt >= today &&
    (c.minOrderValue === undefined || orderTotal >= c.minOrderValue) &&
    (c.maxUses === undefined || (c.usedCount || 0) < c.maxUses)
  );
  return coupon || null;
};

export const createCoupon = async (coupon: Omit<Coupon, 'id' | 'usedCount'>): Promise<Coupon> => {
  const newCoupon: Coupon = { ...coupon, id: generateBespokeId('CPN'), usedCount: 0 };
  if (isUsingSupabase) {
    try {
      const { error } = await supabase.from('coupons').insert([{
        code: newCoupon.code, discount_percent: newCoupon.discountPercent, discount_flat: newCoupon.discountFlat,
        min_order_value: newCoupon.minOrderValue, max_uses: newCoupon.maxUses, expires_at: newCoupon.expiresAt,
        is_active: newCoupon.isActive, description: newCoupon.description,
      }]);
      if (error) throw error;
    } catch (e) { console.error('createCoupon error:', e); }
  }
  const coupons: Coupon[] = JSON.parse(localStorage.getItem('firofits_coupons') || '[]');
  coupons.unshift(newCoupon);
  localStorage.setItem('firofits_coupons', JSON.stringify(coupons));
  return newCoupon;
};

export const updateCoupon = async (id: string, updates: Partial<Coupon>): Promise<void> => {
  if (isUsingSupabase) {
    try {
      const mapped: any = {};
      if (updates.code !== undefined) mapped.code = updates.code;
      if (updates.discountPercent !== undefined) mapped.discount_percent = updates.discountPercent;
      if (updates.discountFlat !== undefined) mapped.discount_flat = updates.discountFlat;
      if (updates.minOrderValue !== undefined) mapped.min_order_value = updates.minOrderValue;
      if (updates.maxUses !== undefined) mapped.max_uses = updates.maxUses;
      if (updates.expiresAt !== undefined) mapped.expires_at = updates.expiresAt;
      if (updates.isActive !== undefined) mapped.is_active = updates.isActive;
      if (updates.description !== undefined) mapped.description = updates.description;
      await supabase.from('coupons').update(mapped).eq('id', id);
    } catch (e) { console.error('updateCoupon error:', e); }
  }
  const coupons: Coupon[] = JSON.parse(localStorage.getItem('firofits_coupons') || '[]');
  const idx = coupons.findIndex(c => c.id === id);
  if (idx !== -1) { coupons[idx] = { ...coupons[idx], ...updates }; localStorage.setItem('firofits_coupons', JSON.stringify(coupons)); }
};

export const deleteCoupon = async (id: string): Promise<void> => {
  if (isUsingSupabase) {
    try { await supabase.from('coupons').delete().eq('id', id); } catch (e) { console.error('deleteCoupon error:', e); }
  }
  const coupons: Coupon[] = JSON.parse(localStorage.getItem('firofits_coupons') || '[]');
  localStorage.setItem('firofits_coupons', JSON.stringify(coupons.filter(c => c.id !== id)));
};

// Re-export generateBarcode for use in admin components
export { generateBarcode };
