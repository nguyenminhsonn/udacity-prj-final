import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css',
})
export class OrderSuccessComponent {
  customerInfo: any;
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.getCustomerInfo();
  }

  getCustomerInfo() {
    this.customerInfo = this.cartService.getCustomerInfo();
  }
}
