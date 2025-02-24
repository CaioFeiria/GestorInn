import { FormGroup } from '@angular/forms';

export interface ValidationStrategy {
  validate(
    form: FormGroup,
    formInvalid: boolean,
    fnOne: boolean,
    fnTwo?: boolean
  ): void;
}
