import { FormControl, FormGroup } from '@angular/forms';

export default class ValidateForm {
  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((fields) => {
      const singleField = formGroup.get(fields);

      if (singleField instanceof FormControl) {
        singleField.markAsDirty({ onlySelf: true });
      } else if (singleField instanceof FormGroup) {
        this.validateAllFormFields(singleField);
      }
    });
  }
}
