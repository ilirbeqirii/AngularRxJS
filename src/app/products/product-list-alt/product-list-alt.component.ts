import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  selectedProductId;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  
  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(error => {
       this.errorMessageSubject.next(error);
       return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$;
  
  sub: Subscription;

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
