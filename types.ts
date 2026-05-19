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
  | 'admin-login'
  | 'packages'
  | 'package-detail'
  | 'order-tracking'
  | 'wishlist';

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
  MULTIPLE = 'Multiple Custom Items',
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
  fullName: string;
  address: string;
  cityPostal: string;
  district: string;
  mobile: string;
  altMobile: string;
  email: string;
  paymentMethod: 'COD' | 'Online Transfer';
  deliveryDate: string;
}

export interface CustomTailoringItem {
  id: string;
  service: GarmentType;
  customGarmentName?: string;
  designFiles: File[];
  specialInstructions: string;
  measurements: Measurements;
  unit: Unit;
  hasPearlWork: boolean;
}

export interface OrderData {
  service: GarmentType | null;
  designFiles: File[];
  specialInstructions: string;
  measurements: Measurements;
  unit: Unit;
  hasPearlWork: boolean;
  deliveryDetails: DeliveryDetails;
  customGarmentName?: string;
  customItems: CustomTailoringItem[];
}

export enum ProductCategory {
  MEN = 'Men',
  WOMEN = 'Women',
  KIDS = 'Kids',
  UNISEX = 'Unisex',
  ACCESSORIES = 'Accessories',
  BRIDAL = 'Bridal',
}

export enum PackageType {
  SEASONAL = 'Seasonal',
  FESTIVAL = 'Festival',
  OFFER = 'Special Offer',
  BUNDLE = 'Bundle',
}

export interface PackageItem {
  productId: string;
  productName?: string;
  qty: number;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  type: PackageType;
  tag: string; // e.g. "SUMMER 2026", "EID SPECIAL"
  description: string;
  bannerImageUrl: string;
  badgeLabel?: string; // e.g. "HOT DEAL", "LIMITED TIME"
  items: PackageItem[];
  discountPercent?: number;
  discountFlat?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
  description?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;         // legacy free-text category
  productCategory?: ProductCategory; // structured gender/type category
  subCategory?: string;     // e.g. "Frocks", "Shirts", "Blouses"
  stock?: number;
  barcode?: string;          // Auto-generated SKU e.g. FF-WMN-48291
  tags?: string[];           // searchable tags
  sizes?: string[];          // available sizes e.g. ["S","M","L","XL"]
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

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  ADVANCE_PAID = 'Advance Paid',
  FULLY_PAID = 'Fully Paid',
  COD = 'Cash on Delivery',
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
  paymentStatus?: PaymentStatus;
  internalNotes?: string;
  invoiceUrl?: string;
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

