import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../models/product";
import 'rxjs/add/operator/switchMap';
import {ShoppingCartService} from "../shopping-cart.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy{
  products: Product[] = [];
  category: string;
  filteredProducts: Product [];
  cart: any;
  subscription: Subscription;

  constructor(
    rout: ActivatedRoute,
    productService:ProductService,
    private shoppingCartService: ShoppingCartService) {


    //first Observable
    productService
      .getAll()
      .switchMap(products => {
        this.products = products;
        //second observable
        return rout.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get('category');
        //setting product filter array
        this.filteredProducts = (this.category)?
          this.products.filter(p => p.category === this.category) :
          this.products;
      });
  }

  async ngOnInit() {
    (await this.shoppingCartService.getCart())
      .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
