import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
const invalidInputRange: string = 'invalidInputRange';
const invalidInputLength =
  (minLength: number, maxLength: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    // logic code
    if (control.value != null && control.value.length > 0) {
      if (
        control.value.length < minLength ||
        control.value.length > maxLength
      ) {
        return { invalidInputRange: true };
      }
    }
    return null;
  };

export const userNameValidator = Validators.compose([
  Validators.required,
  invalidInputLength(5, 255),
]);

export const fullNameValidator = Validators.compose([
  Validators.required,
  invalidInputLength(5, 255),
]);

export const addressValidator = Validators.compose([
  Validators.required,
  invalidInputLength(8, 255),
]);

export const passwordValidator = Validators.compose([
  Validators.required,
  invalidInputLength(8, 255),
]);
