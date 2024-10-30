import { Component, NgModule } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { AddItem, Product } from '../../../models';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private productService: ProductsService, private readonly cartService: CartService) { }

  listProducts: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    const apiEndpoint = 'https://671fed7ce7a5792f053001bf.mockapi.io/api/items';
    this.productService.getListProducts(apiEndpoint).subscribe({
      next: (data) => (this.listProducts = data),
      error: (err) => console.error('Failed to fetch products:', err),
    });
  }

  addProductToCart(event: AddItem): void {
    const addProduct = this.listProducts.find((item) => item.id === event.id);
    this.cartService.addItemToCart({ ...addProduct, quantity: event.quantity });
    window.alert('Product has been successfully added to the cart!');
  }
}
