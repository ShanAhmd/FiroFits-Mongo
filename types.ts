// FIX: Replaced the entire file content which was an incorrect copy of App.tsx 
// with the correct type definitions for the application. This resolves all 
// import and type errors across the project.

export type View =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'admin-dashboard'
  | 'order'
  | 'order-confirmation'
  | 'about'
  | 'products';

export enum UserRole {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, never store/handle plain passwords on the client.
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

// Represents a file that has been processed and stored (e.g., as a data URL)
// This is used in the mock database to represent uploaded files.
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
    // The raw form data
    orderData: OrderData;
    // The data for design files after being processed for storage
    designFileData?: StoredFile[];
}
