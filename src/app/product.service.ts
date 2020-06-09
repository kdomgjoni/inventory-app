import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



export interface IProduct {
  id: number;
  name: string;
  active: boolean;
  expirationDate: string;
  description: string;
  type: string;
  features?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: IProduct[] = [
    {
      id: this.generateId(),
      name: 'IPhone X',
      active: true,
      description: 'Like Brand New',
      expirationDate: '01/15/2019',
      type: 'mobile'
    },
    {
      id: this.generateId(),
      name: 'IPhone 11',
      active: false,
      description: 'Like Brand New',
      expirationDate: '01/15/2020',
      type: 'mobile'
    },
    {
      id: this.generateId(),
      name: 'Galaxy s10+',
      active: false,
      description: 'Like Brand New',
      expirationDate: '05/17/2020',
      type: 'mobile'
    },
    {
      id: this.generateId(),
      name: 'Samsung Tab',
      active: false,
      description: 'Like Brand New',
      expirationDate: '08/11/2018',
      type: 'mobile'
    },
    {
      id: this.generateId(),
      name: 'Samsung Note',
      active: false,
      description: 'Like Brand New',
      expirationDate: '04/06/2020',
      type: 'mobile'
    }
  ];

  products$ = new BehaviorSubject<IProduct[]>(this.products);


  constructor() {

  }

  generateId() {
    return Math.floor(Math.random() * 1000);
  }

  removeProduct(product) {
    const index = this.products.indexOf(product);
    this.products = [
      ...this.products.slice(0, index),
      ...this.products.slice(index + 1),
    ];
    this.products$.next(this.products);
  }

  addProduct(product) {
    this.products = [
      {
        id: this.generateId(),
        ...product,
      },
      ...this.products,
    ];
    this.products$.next(this.products);
  }

  editProduct(id, product) {
    const index = this.products.findIndex(p => p.id === id);
    this.products = [
      ...this.products.slice(0, index),
      {
        id,
        ...product,
      },
      ...this.products.slice(index + 1),
    ];
    this.products$.next(this.products);
  }

}
