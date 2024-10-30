import { Component } from '@angular/core';
import { Product } from '../../../models';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import data from '../../assets/data/data.json';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product: Product | null = null;
  quantity: number = 1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = data.find((item) => item.id === productId) || null;
  }

  validateQuantity(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  addToCart(product: Product | null): void {
    if(product) {
      this.cartService.addItemToCart({ ...product, quantity: this.quantity });
      window.alert('Product successfully added to the cart!');
    } else {
      window.alert('Product not existed!');
    }
  }
}
