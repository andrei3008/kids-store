export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  size: string;
  quantity: number;
  slug: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);
}

export function calculateCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
