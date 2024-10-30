import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private customerInfo: any;

  addItemToCart(item: any): void {
    this.cartItems.push(item);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
  }

  updateCustomerInfo(info: any): void {
    this.customerInfo = info;
  }

  getCustomerInfo(): any {
    return this.customerInfo;
  }
}
