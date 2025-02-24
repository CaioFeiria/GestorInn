import { Injectable } from '@angular/core';
import { ValidationStrategy } from '../strategies/validation-guest/validation.strategy';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private validation!: ValidationStrategy;

  setValidation(validation: ValidationStrategy): void {
    this.validation = validation;
  }

  validate(
    form: FormGroup,
    formInvalid: boolean,
    fnOne: boolean,
    fnTwo?: boolean
  ): void {
    if (!this.validation) {
      throw new Error('Nenhuma estratégia foi definida!');
    }
    return this.validation.validate(form, formInvalid, fnOne, fnTwo);
  }
}
