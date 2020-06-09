import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import * as _ from 'lodash';


@Component({
  selector: 'in-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductComponent implements OnInit {
  @Output() finish = new EventEmitter();
  @ViewChild('productWizard', { static: false }) productWizard:
    ClrWizard;


  productForm: FormGroup;
  @Input() product;

  deviceType = 'tablet';
  deviceTypes = [{
    name: 'Tablet',
    icon: 'tablet',
  }, {
    name: 'Laptop',
    icon: 'computer'
  }, {
    name: 'Phone',
    icon: 'mobile'
  }, {
    name: 'Monitor',
    icon: 'display'
  }];


  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      basic: fb.group({
          name: ['', Validators.required],
          description: '',
          active: false,
          features: fb.array([
              fb.control('')
          ])
      }),
      expiration: fb.group({
          expirationDate: [null, Validators.compose([Validators.required, this.minDateValidation(new Date())])],
      })
  });
  }

  selectDevice(device) {
    this.deviceType = device.icon;
  }

  get expirationError() {
    if (this.productForm.get('expiration.expirationDate').hasError('required')) {
      return 'This Field is Required!';
    }
    if (this.productForm.get('expiration.expirationDate').hasError('minDateValidation')) {
      return 'Expiration should be after today\'s date';
    }
  }


  get basicFeatures(): FormArray {
    return this.productForm.get('basic.features') as FormArray;
  }

  get isBasicInvalid(): boolean {
    return this.productForm.get('basic').invalid;
  }

  get isExpirationInvalid(): boolean {
    return this.productForm.get('expiration').invalid;
  }


  handleClose() {
    this.finish.emit();
    this.close();
  }

  close() {
    this.productForm.reset();
    this.deviceType = 'tablet';

    this.productWizard.goTo(this.productWizard.pageCollection.pages.first.id);
    this.productWizard.reset();
  }

  handleFinish() {
    this.finish.emit({
      product: {
        type: this.deviceType,
        ...this.productForm.get('basic').value,
        ...this.productForm.get('expiration').value,
      }
    });
    this.close();
  }

  addFeature() {
    this.basicFeatures.push(this.fb.control(''));
  }

  get basicFieldInvalid() {
    return this.productForm.get('basic.name').invalid && this.productForm.get('basic.name').dirty;
  }

  minDateValidation(date: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = new Date(control.value) < date;
      return forbidden ? { minDateValidation: { value: control.value } } : null;
    };
  }


  ngOnInit() {
    if (this.product) {
      this.productForm.setValue({
        basic: {
          ..._.pick(this.product, ['name', 'description',
            'active']),
          features: this.product.features || [''],
        },
        expiration: {
          ..._.pick(this.product, ['expirationDate']),
        }
      });
      this.deviceType = this.product.type;
    }
  }

  ngOnChanges() {
    this.ngOnInit();
  }

}
