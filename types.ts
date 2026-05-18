export type View =
  | 'home'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'admin-dashboard'
  | 'order'
  | 'order-confirmation'
  | 'about'
  | 'products'
  | 'cart'
  | 'admin-login';

export enum UserRole {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Used for client auth mock fallback
  role: UserRole;
  phone?: string;
  address?: string;
  profilePhotoUrl?: string;
}

export enum GarmentType {
  SAREE_BLOUSE = 'Saree Blouse',
  LADIES_DRESS = 'Ladies Dress',
  FROCK = 'Frock',
  ABAYA = 'Abaya',
  SCHOOL_UNIFORM = 'School Uniform',
  READY_TO_WEAR = 'Ready-to-Wear',
  OTHER = 'Other',
}

export enum Unit {
  INCHES = 'in',
  CENTIMETERS = 'cm',
}

export interface Measurements {
  shoulder: string;
  chest: string;
  waist: string;
  hip: string;
  fullLength: string;
  vestLength: string;
  sleeveLength: string;
  armhole: string;
  collarSize: string;
}

export interface DeliveryDetails {
  name: string;
  contact: string;
  address: string;
  deliveryDate: string;
}

export interface OrderData {
  service: GarmentType | null;
  designFiles: File[];
  specialInstructions: string;
  measurements: Measurements;
  unit: Unit;
  hasPearlWork: boolean;
  deliveryDetails: DeliveryDetails;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  stock?: number;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. product-size combo)
  product: Product;
  quantity: number;
  selectedSize: string;
  customMeasurements?: Measurements; // Optional bespoke sizing
}

export enum OrderStatus {
  PENDING_QUOTE = 'Pending Quote',
  FABRIC_SOURCING = 'Fabric Sourcing',
  STITCHING = 'Stitching',
  FINISHING = 'Finishing',
  READY_FOR_DELIVERY = 'Ready for Delivery',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface StoredFile {
  name: string;
  url: string;
  type: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  date: string;
  garmentType: GarmentType;
  status: OrderStatus;
  price: number | null;
  orderData: OrderData;
  designFileData?: StoredFile[];
  // Online shopping purchases details
  items?: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size: string;
    customMeasurements?: Measurements;
  }[];
}

