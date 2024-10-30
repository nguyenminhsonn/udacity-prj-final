import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddItem, Product } from '../../../models';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  @Input() productItem!: Product;
  @Output('handleAddItem') addItem = new EventEmitter<AddItem>();
  quantity: number = 1;

  constructor(private readonly cartService: CartService) { }

  validateQuantity(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  addToCart(id: number): void {
    const item: AddItem = { id: id, quantity: this.quantity };
    this.addItem.emit(item);
  }

  // addToCart(item: Product): void {
  //   this.cartService.addItemToCart({ ...item, quantity: this.quantity });
  //   window.alert('Product has been successfully added to the cart!');
  // }
}
