import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: any[] = [
      {
          "id": 1,
          "name": "Book",
          "price": 9.99,
          "url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "description": "You can read it!",
          "quantity": 1
      },
      {
          "id": 2,
          "name": "Headphones",
          "price": 249.99,
          "url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "description": "Listen to stuff!",
          "quantity": 1
      },
      {
          "id": 3,
          "name": "Backpack",
          "price": 79.99,
          "url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "description": "Carry things around town!",
          "quantity": 1
      }
  ];
  totalCost: number = 0;

  customerDetails = {
    name: '',
    address: '',
    creditCard: '',
  };
  // isFormValid: boolean = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // this.cartItems = this.cartService.getCartItems();
    this.calculateTotalCost();
  }

  // onInputChange(): void {
  //   this.isFormValid =
  //     this.customerDetails.name.trim() !== '' &&
  //     this.customerDetails.address.trim() !== '' &&
  //     this.customerDetails.creditCard.trim() !== '';
  // }

  removeCartItem(item: any): void {
    this.cartService.removeItem(item);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalCost();
    window.alert('Product has been removed from cart!');
  }

  calculateTotalCost(): void {
    this.totalCost = this.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  submitOrder(): void {
    this.cartService.updateCustomerInfo({
      ...this.customerDetails,
      totalAmount: this.totalCost,
    });
    this.router.navigate(['/order-success']);
  }
}
