import { Component, OnInit } from '@angular/core';
import {ProductService} from "../product.service";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../models/product";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[] = [];
  category: string;
  filteredProducts: Product [];

  constructor(
    rout: ActivatedRoute,
    productService:ProductService) {

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


}
