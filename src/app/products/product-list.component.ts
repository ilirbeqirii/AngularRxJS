import { Component, ChangeDetectionStrategy } from "@angular/core";

import { EMPTY, Subject, combineLatest, BehaviorSubject } from "rxjs";

import { Product } from "./product";
import { ProductService } from "./product.service";
import { catchError, map, startWith } from "rxjs/operators";
import { ProductCategoryService } from "../product-categories/product-category.service";

@Component({
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
//OnDestroy
export class ProductListComponent {
  pageTitle = "Product List";
  errorMessage = "";

  //1. create action stream
  //private categorySelectedSubject = new Subject<number>();
  private categorySelectedSubject = new BehaviorSubject<number>(0);

  //1.1 take subject's observable
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  //2. combine action stream with data stream
  products$ = combineLatest([
    this.productService.productsWithAdd$,
    //this.categorySelectedAction$.pipe(startWith(0))
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    //3. emit selected id to action stream
    this.categorySelectedSubject.next(+categoryId);
  }
}
