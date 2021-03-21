/* HTML string of pages for testing. They are split into
* variables to make each field easier to read.
*/

let html = {};

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
// TODO: Add tests for individual fields.
html.checkboxes_yesno = `
<div class="form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><label for="Y2hlY2tib3hlc195ZXNubw" class="sr-only">Check if applicable</label>
  <div class="offset-md-4 col-md-8 dafieldpart">
    <fieldset class="da-field-checkbox">
      <legend class="sr-only">Choices:</legend><input aria-label="checkboxes (yesno)" alt="checkboxes (yesno)" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="Y2hlY2tib3hlc195ZXNubw" id="Y2hlY2tib3hlc195ZXNubw" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc195ZXNubw" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes (yesno)"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes (yesno)</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes (yesno)</span></label>
    </fieldset>
  </div>
</div>`;
html.checkboxes_multiple_1 = `
<div class="form-group row darequired da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes"><label class="col-md-4 col-form-label da-form-label datext-right">checkboxes (other) 1</label>
  <div class="col-md-8 dafieldpart">
    <fieldset class="da-field-checkboxes" role="group">
      <legend class="sr-only">Checkboxes:</legend><input aria-label="checkboxes opt 1" alt="checkboxes opt 1" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8x_0" name="Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8x_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 1</span></label><input aria-label="checkboxes opt 2" alt="checkboxes opt 2" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8x_1" name="Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8x_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 2</span></label><input aria-label="checkboxes opt 3" alt="checkboxes opt 3" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8x_2" name="Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8x_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 3</span></label><input aria-label="None of the above" alt="None of the above" class="dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore1" aria-hidden="true" id="labelauty-712020" style="display: none;"><label class="btn-light" for="labelauty-712020" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">None of the above</span></label>
    </fieldset>
  </div>
</div>`;
html.checkboxes_multiple_2 = `
<div class="form-group row darequired da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes"><label class="col-md-4 col-form-label da-form-label datext-right">checkboxes (other) 2</label>
  <div class="col-md-8 dafieldpart">
    <fieldset class="da-field-checkboxes" role="group">
      <legend class="sr-only">Checkboxes:</legend><input aria-label="checkboxes opt 1" alt="checkboxes opt 1" class="dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8y_0" name="Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8y_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 1</span></label><input aria-label="checkboxes opt 2" alt="checkboxes opt 2" class="dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8y_1" name="Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8y_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 2</span></label><input aria-label="checkboxes opt 3" alt="checkboxes opt 3" class="dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcl8y_2" name="Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10" type="checkbox" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y2hlY2tib3hlc19vdGhlcl8y_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">checkboxes opt 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">checkboxes opt 3</span></label><input aria-label="None of the above" alt="None of the above" class="dafield2 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore2" aria-hidden="true" id="labelauty-344271" style="display: none;"><label class="btn-light" for="labelauty-344271" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
          </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">None of the above</span></label>
    </fieldset>
  </div>
</div>`;
html.radio_yesno = `
<div class="form-group row darequired da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesnoradio"><label for="cmFkaW9feWVzbm8" class="col-md-4 col-form-label da-form-label datext-right">radio (yesno)</label>
  <div class="col-md-8 dafieldpart">
    <fieldset class="da-field-radio" role="radiogroup">
      <legend class="sr-only">Choices:</legend><input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9feWVzbm8_0" name="cmFkaW9feWVzbm8" type="radio" value="True" aria-hidden="true" style="display: none;"><label class="btn-light" for="cmFkaW9feWVzbm8_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
          </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Yes</span></label><input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9feWVzbm8_1" name="cmFkaW9feWVzbm8" type="radio" value="False" aria-hidden="true" style="display: none;"><label class="btn-light" for="cmFkaW9feWVzbm8_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
          </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">No</span></label>
    </fieldset>
  </div>
</div>`;
html.radio_multiple = `
<div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-radio"><label for="cmFkaW9fb3RoZXI" class="col-md-4 col-form-label da-form-label datext-right">radio (other)</label>
  <div class="col-md-8 dafieldpart">
    <fieldset class="da-field-radio" role="radiogroup">
      <legend class="sr-only">Choices:</legend><input aria-label="radio opt 1" alt="radio opt 1" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_0" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_1" aria-hidden="true" style="display: none;"><label class="btn-light" for="cmFkaW9fb3RoZXI_0" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
          </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">radio opt 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">radio opt 1</span></label><input aria-label="radio opt 2" alt="radio opt 2" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_1" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_2" aria-hidden="true" style="display: none;"><label class="btn-light" for="cmFkaW9fb3RoZXI_1" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
          </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">radio opt 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">radio opt 2</span></label><input aria-label="radio opt 3" alt="radio opt 3" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_2" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_3" aria-hidden="true" style="display: none;"><label class="btn-light" for="cmFkaW9fb3RoZXI_2" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
          </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">radio opt 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
          </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">radio opt 3</span></label>
    </fieldset>
  </div>
</div>`;
html.input_text = `
<div class="form-group row darequired da-field-container da-field-container-datatype-text"><label for="dGV4dF9pbnB1dA" class="col-md-4 col-form-label da-form-label datext-right">text input</label>
  <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control" type="text" name="dGV4dF9pbnB1dA" id="dGV4dF9pbnB1dA"></div>
</div>`;
html.textarea = `
<div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-area"><label for="dGV4dGFyZWE" class="col-md-4 col-form-label da-form-label datext-right">textarea</label>
  <div class="col-md-8 dafieldpart"><textarea alt="Input box" class="form-control" rows="4" name="dGV4dGFyZWE" id="dGV4dGFyZWE"></textarea></div>
</div>`;
html.dropdown = `
<div class="form-group row darequired da-field-container da-field-container-datatype-dropdown da-field-container-inputtype-dropdown"><label for="ZHJvcGRvd25fdGVzdA" class="col-md-4 col-form-label da-form-label datext-right">dropdown</label>
  <div class="col-md-8 dafieldpart">
    <p class="sr-only">Select box</p><select class="form-control" name="ZHJvcGRvd25fdGVzdA" id="ZHJvcGRvd25fdGVzdA">
      <option value="">Select...</option>
      <option value="dropdown_opt_1">dropdown opt 1</option>
      <option value="dropdown_opt_2">dropdown opt 2</option>
      <option value="dropdown_opt_3">dropdown opt 3</option>
    </select>
  </div>
</div>`;

html.standard = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Direct standard fields</h1>
      <div class="daclear"></div>
    </div>
    <div class="da-subquestion">
      <p>Excludes proxy vars (x, i, j, etc.) or choices created with objects.</p>
    </div>
    ${ html.checkboxes_yesno }
    ${ html.checkboxes_multiple_1 }
    ${ html.checkboxes_multiple_2 }
    ${ html.radio_yesno }
    ${ html.radio_multiple }
    ${ html.input_text }
    ${ html.textarea }
    ${ html.dropdown }
    <input type="hidden" name="_checkboxes" value="eyJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eFcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOVmpsMlkwaFNaazFSSjEwIjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eFcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOVmpsMlkwaFNaazFuSjEwIjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eFcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOVmpsMlkwaFNaazEzSjEwIjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eVcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOYkRsMlkwaFNaazFSSjEwIjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eVcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOYkRsMlkwaFNaazFuSjEwIjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eVcwSW5XVEpvYkZreWRHbGlNMmhtWWpOU2IxcFlTbVpOYkRsMlkwaFNaazEzSjEwIjogIkZhbHNlIiwgImNtRmthVzlmZVdWemJtOCI6ICJGYWxzZSJ9">
    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button type="submit" class="btn btn-da btn-primary" name="ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw" value="True"><span>Continue</span></button></div>
    </fieldset>
    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YE9fYw.Y5HDKdETXjEiofroVR8D1htKt5w">
    <input type="hidden" name="_event" value="WyJkaXJlY3Rfc3RhbmRhcmRfZmllbGRzIl0">
    <input type="hidden" name="_question_name" value="ID direct standard fields">
    <input type="hidden" name="_tracker" value="1">
    <input type="hidden" name="_datatypes" value="eyJaR2x5WldOMFgzTjBZVzVrWVhKa1gyWnBaV3hrY3ciOiAiYm9vbGVhbiIsICJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IjogImJvb2xlYW4iLCAiWTJobFkydGliM2hsYzE5dmRHaGxjbDh4IjogImNoZWNrYm94ZXMiLCAiWTJobFkydGliM2hsYzE5dmRHaGxjbDh5IjogImNoZWNrYm94ZXMiLCAiY21Ga2FXOWZlV1Z6Ym04IjogImJvb2xlYW4iLCAiY21Ga2FXOWZiM1JvWlhJIjogInRleHQiLCAiZEdWNGRGOXBibkIxZEEiOiAidGV4dCIsICJkR1Y0ZEdGeVpXRSI6ICJ0ZXh0IiwgIlpISnZjR1J2ZDI1ZmRHVnpkQSI6ICJkcm9wZG93biJ9">
    <input type="hidden" name="_visible" value="">
    <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IiwgIlgyWnBaV3hrWHpFIjogIlkyaGxZMnRpYjNobGMxOXZkR2hsY2w4eCIsICJYMlpwWld4a1h6SSI6ICJZMmhsWTJ0aWIzaGxjMTl2ZEdobGNsOHkiLCAiWDJacFpXeGtYek0iOiAiY21Ga2FXOWZlV1Z6Ym04IiwgIlgyWnBaV3hrWHpRIjogImNtRmthVzlmYjNSb1pYSSIsICJYMlpwWld4a1h6VSI6ICJkR1Y0ZEY5cGJuQjFkQSIsICJYMlpwWld4a1h6WSI6ICJkR1Y0ZEdGeVpXRSIsICJYMlpwWld4a1h6YyI6ICJaSEp2Y0dSdmQyNWZkR1Z6ZEEifQ">
  </form>
</section>`;


module.exports = html;
