import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../models/product";
import 'rxjs/add/operator/switchMap';
import {ShoppingCartService} from "../shopping-cart.service";
import {Observable, Subscription} from "rxjs";
import {ShoppingCart} from "../models/shopping-cart";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products: Product[] = [];
  category: string;
  filteredProducts: Product [] = [];
  cart$: Observable<ShoppingCart>;

  constructor(
    private rout: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) {

  }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private populateProducts(){
    //populating the list of product
    this.productService
      .getAll()
      .switchMap(products => {
        this.products = products;
        //second observable
        return this.rout.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }

  private applyFilter(){
    //setting product filter array
    this.filteredProducts = (this.category)?
      this.products.filter(p => p.category === this.category) :
      this.products;
  }
}
