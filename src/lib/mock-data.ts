export type Product = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  cloudinaryId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const CATEGORIES = ["All", "Skincare", "Lipstick", "Fragrance", "Serums", "Makeup"] as const;

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    notes?: string;
  };
  items: OrderItem[];
  deliveryCharge: number;
  grandTotal: number;
  paymentStatus: "Paid" | "Not Paid";
  orderStatus: "Pending" | "Preparing" | "Packed" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

export const testimonials = [
  { name: "Ananya R.", role: "Verified Buyer", text: "The Velvet Rose Serum transformed my skin in two weeks. It feels like liquid silk — I've never received so many compliments.", rating: 5, avatar: "https://i.pravatar.cc/120?img=47" },
  { name: "Priya M.", role: "Beauty Editor", text: "Eve Beauty Care's Golden Hour lipstick is the most flattering burgundy I've ever worn. Truly a luxury experience.", rating: 5, avatar: "https://i.pravatar.cc/120?img=32" },
  { name: "Sara K.", role: "Verified Buyer", text: "Midnight Bloom is my new signature scent. Elegant, complex, and lasts all day. Packaging is chef's kiss.", rating: 5, avatar: "https://i.pravatar.cc/120?img=45" },
];

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
