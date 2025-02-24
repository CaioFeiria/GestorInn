import { FormGroup } from '@angular/forms';
import { ValidationStrategy } from './validation.strategy';

export class FormValidationStrategy implements ValidationStrategy {
  validate(
    form: FormGroup,
    formInvalid: boolean,
    fnOne: boolean,
    fnTwo?: boolean
  ): void {
    if (form.invalid && fnOne && fnTwo) {
      formInvalid = true;
    } else {
      formInvalid = false;
    }
  }
}
