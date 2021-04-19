/* HTML string of pages for testing. They are split into
* variables to make each field easier to read.
*/

let html = {};

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
// TODO: Add tests for individual fields.
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
    </div>

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
    </div>

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
    </div>

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
    </div>

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
    </div>

    <div class="form-group row darequired da-field-container da-field-container-datatype-text"><label for="dGV4dF9pbnB1dA" class="col-md-4 col-form-label da-form-label datext-right">text input</label>
      <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control" type="text" name="dGV4dF9pbnB1dA" id="dGV4dF9pbnB1dA"></div>
    </div>

    <div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-area"><label for="dGV4dGFyZWE" class="col-md-4 col-form-label da-form-label datext-right">textarea</label>
      <div class="col-md-8 dafieldpart"><textarea alt="Input box" class="form-control" rows="4" name="dGV4dGFyZWE" id="dGV4dGFyZWE"></textarea></div>
    </div>

    <div class="form-group row darequired da-field-container da-field-container-datatype-dropdown da-field-container-inputtype-dropdown"><label for="ZHJvcGRvd25fdGVzdA" class="col-md-4 col-form-label da-form-label datext-right">dropdown</label>
      <div class="col-md-8 dafieldpart">
        <p class="sr-only">Select box</p><select class="form-control" name="ZHJvcGRvd25fdGVzdA" id="ZHJvcGRvd25fdGVzdA">
          <option value="">Select...</option>
          <option value="dropdown_opt_1">dropdown opt 1</option>
          <option value="dropdown_opt_2">dropdown opt 2</option>
          <option value="dropdown_opt_3">dropdown opt 3</option>
        </select>
      </div>
    </div>

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


// ============================
// Simple show if fields - no proxies
// ============================
// Types of fields that use _field_n
// At least all simple showif fields
html.show_if = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Reveal showifs</h1>
      <div class="daclear"></div>
    </div>
    <div class="da-subquestion">
      <p>We start only seeing layer 1, the first question. All other layers are hidden to test finding various hidden fields in the DOM.</p>
      <p>TODO:</p>
      <ul>
        <li>object</li>
        <li>object_checkbox</li>
      </ul>
      <p>No showifs: yesnomaybe: (buttons), buttons: (other), continue button field:</p>
    </div>

    <div class="form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><label for="c2hvd18y" class="sr-only">Check if applicable</label>
      <div class="offset-md-4 col-md-8 dafieldpart">
        <fieldset class="da-field-checkbox">
          <legend class="sr-only">Choices:</legend><input aria-label="Show layer 2" alt="Show layer 2" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="c2hvd18y" id="c2hvd18y" aria-hidden="true" style="display: none;"><label class="btn-light" for="c2hvd18y" tabindex="0" role="checkbox" aria-checked="false" aria-label="Show layer 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
              </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Show layer 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Show layer 2</span></label>
        </fieldset>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd18z" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18y" data-showif-val="True">
      <div class="form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><label for="X2ZpZWxkXzE" class="sr-only">Check if applicable</label>
        <div class="offset-md-4 col-md-8 dafieldpart">
          <fieldset class="da-field-checkbox">
            <legend class="sr-only">Choices:</legend><input aria-label="Show layer 3" alt="Show layer 3" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="X2ZpZWxkXzE" id="X2ZpZWxkXzE" aria-hidden="true" disabled="" style="display: none;"><label class="btn-light" for="X2ZpZWxkXzE" tabindex="0" role="checkbox" aria-checked="false" aria-label="Show layer 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Show layer 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Show layer 3</span></label>
          </fieldset>
        </div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2NoZWNrYm94X3llc25v" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><label for="X2ZpZWxkXzI" class="sr-only">Check if applicable</label>
        <div class="offset-md-4 col-md-8 dafieldpart">
          <fieldset class="da-field-checkbox">
            <legend class="sr-only">Choices:</legend><input aria-label="showif checkbox yesno" alt="showif checkbox yesno" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="X2ZpZWxkXzI" id="X2ZpZWxkXzI" aria-hidden="true" disabled="" style="display: none;"><label class="btn-light" for="X2ZpZWxkXzI" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox yesno"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif checkbox yesno</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif checkbox yesno</span></label>
          </fieldset>
        </div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2NoZWNrYm94ZXNfb3RoZXI" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes"><label class="col-md-4 col-form-label da-form-label datext-right">showif checkboxes (multiple)</label>
        <div class="col-md-8 dafieldpart">
          <fieldset class="da-field-checkboxes" role="group">
            <legend class="sr-only">Checkboxes:</legend><input aria-label="showif checkbox nota 1" alt="showif checkbox nota 1" class="dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzM_0" name="X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd" type="checkbox" value="True" aria-hidden="true" style="display: none;" disabled=""><label class="btn-light" for="X2ZpZWxkXzM_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox nota 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif checkbox nota 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif checkbox nota 1</span></label><input aria-label="showif checkbox nota 2" alt="showif checkbox nota 2" class="dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzM_1" name="X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd" type="checkbox" value="True" aria-hidden="true" style="display: none;" disabled=""><label class="btn-light" for="X2ZpZWxkXzM_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox nota 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif checkbox nota 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif checkbox nota 2</span></label><input aria-label="None of the above" alt="None of the above" class="dafield3 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore3" aria-hidden="true" id="labelauty-473746" disabled="" style="display: none;"><label class="btn-light" for="labelauty-473746" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                </svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">None of the above</span></label>
          </fieldset>
        </div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3llc25vcmFkaW8" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesnoradio"><label for="X2ZpZWxkXzQ" class="col-md-4 col-form-label da-form-label datext-right">showif yesnoradio</label>
        <div class="col-md-8 dafieldpart">
          <fieldset class="da-field-radio" role="radiogroup">
            <legend class="sr-only">Choices:</legend><input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzQ_0" name="X2ZpZWxkXzQ" type="radio" value="True" aria-hidden="true" disabled="" style="display: none;"><label class="btn-light" for="X2ZpZWxkXzQ_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Yes</span></label><input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzQ_1" name="X2ZpZWxkXzQ" type="radio" value="False" aria-hidden="true" disabled="" style="display: none;"><label class="btn-light" for="X2ZpZWxkXzQ_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">No</span></label>
          </fieldset>
        </div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3JhZGlvX290aGVy" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-radio"><label for="X2ZpZWxkXzU" class="col-md-4 col-form-label da-form-label datext-right">showif radio (multiple)</label>
        <div class="col-md-8 dafieldpart">
          <fieldset class="da-field-radio" role="radiogroup">
            <legend class="sr-only">Choices:</legend><input aria-label="showif radio multi 1" alt="showif radio multi 1" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_0" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_1" aria-hidden="true" style="display: none;" disabled=""><label class="btn-light" for="X2ZpZWxkXzU_0" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif radio multi 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif radio multi 1</span></label><input aria-label="showif radio multi 2" alt="showif radio multi 2" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_1" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_2" aria-hidden="true" style="display: none;" disabled=""><label class="btn-light" for="X2ZpZWxkXzU_1" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif radio multi 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif radio multi 2</span></label><input aria-label="showif radio multi 3" alt="showif radio multi 3" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_2" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_3" aria-hidden="true" disabled="" style="display: none;"><label class="btn-light" for="X2ZpZWxkXzU_2" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">showif radio multi 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">showif radio multi 3</span></label>
          </fieldset>
        </div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3RleHRfaW5wdXQ" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-text"><label for="X2ZpZWxkXzY" class="col-md-4 col-form-label da-form-label datext-right">showif text input</label>
        <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control" type="text" name="X2ZpZWxkXzY" id="X2ZpZWxkXzY" disabled=""></div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3RleHRhcmVh" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-area"><label for="X2ZpZWxkXzc" class="col-md-4 col-form-label da-form-label datext-right">showif text input</label>
        <div class="col-md-8 dafieldpart"><textarea alt="Input box" class="form-control" rows="4" name="X2ZpZWxkXzc" id="X2ZpZWxkXzc" disabled=""></textarea></div>
      </div>
    </div>
    
    <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2Ryb3Bkb3du" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
      <div class="form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-dropdown"><label for="X2ZpZWxkXzg" class="col-md-4 col-form-label da-form-label datext-right">showif dropdown</label>
        <div class="col-md-8 dafieldpart">
          <p class="sr-only">Select box</p><select class="form-control" name="X2ZpZWxkXzg" id="X2ZpZWxkXzg" disabled="">
            <option value="">Select...</option>
            <option value="showif_dropdown_1">showif dropdown opt 1</option>
            <option value="showif_dropdown_2">showif dropdown opt 2</option>
            <option value="showif_dropdown_3">showif dropdown opt 3</option>
          </select>
        </div>
      </div>
    </div>

    <input type="hidden" name="_checkboxes" value="eyJjMmh2ZDE4eSI6ICJGYWxzZSIsICJjMmh2ZDE4eiI6ICJGYWxzZSIsICJjMmh2ZDJsbVgyTm9aV05yWW05NFgzbGxjMjV2IjogIkZhbHNlIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEpiUWlkak1taDJaREpzYlZneVRtOWFWMDV5V1cwNU5GcFlUbVppYlRrd1dWWTRlQ2RkIjogIkZhbHNlIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEpiUWlkak1taDJaREpzYlZneVRtOWFWMDV5V1cwNU5GcFlUbVppYlRrd1dWWTRlU2RkIjogIkZhbHNlIiwgImMyaHZkMmxtWDNsbGMyNXZjbUZrYVc4IjogIkZhbHNlIn0">
    
    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button type="submit" class="btn btn-da btn-primary" name="ZGlyZWN0X3Nob3dpZnM" value="True"><span>Continue</span></button></div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YFkEfw.7rkISHHqxsnefWbxbBnTwqKrBsQ">
    <input type="hidden" name="_event" value="WyJkaXJlY3Rfc2hvd2lmcyJd">
    <input type="hidden" name="_question_name" value="ID showifs">
    <input type="hidden" name="_tracker" value="8">
    <input type="hidden" name="_datatypes" value="eyJaR2x5WldOMFgzTm9iM2RwWm5NIjogImJvb2xlYW4iLCAiYzJodmQxOHkiOiAiYm9vbGVhbiIsICJjMmh2ZDE4eiI6ICJib29sZWFuIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WDNsbGMyNXYiOiAiYm9vbGVhbiIsICJjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZiM1JvWlhJIjogImNoZWNrYm94ZXMiLCAiYzJodmQybG1YM2xsYzI1dmNtRmthVzgiOiAiYm9vbGVhbiIsICJjMmh2ZDJsbVgzSmhaR2x2WDI5MGFHVnkiOiAidGV4dCIsICJjMmh2ZDJsbVgzUmxlSFJmYVc1d2RYUSI6ICJ0ZXh0IiwgImMyaHZkMmxtWDNSbGVIUmhjbVZoIjogInRleHQiLCAiYzJodmQybG1YMlJ5YjNCa2IzZHUiOiAidGV4dCJ9">
    <input type="hidden" name="_visible" value="">
    <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJjMmh2ZDE4eSIsICJYMlpwWld4a1h6RSI6ICJjMmh2ZDE4eiIsICJYMlpwWld4a1h6SSI6ICJjMmh2ZDJsbVgyTm9aV05yWW05NFgzbGxjMjV2IiwgIlgyWnBaV3hrWHpNIjogImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEkiLCAiWDJacFpXeGtYelEiOiAiYzJodmQybG1YM2xsYzI1dmNtRmthVzgiLCAiWDJacFpXeGtYelUiOiAiYzJodmQybG1YM0poWkdsdlgyOTBhR1Z5IiwgIlgyWnBaV3hrWHpZIjogImMyaHZkMmxtWDNSbGVIUmZhVzV3ZFhRIiwgIlgyWnBaV3hrWHpjIjogImMyaHZkMmxtWDNSbGVIUmhjbVZoIiwgIlgyWnBaV3hrWHpnIjogImMyaHZkMmxtWDJSeWIzQmtiM2R1In0">
  </form>
</section>`;


// ============================
// Buttons
// ============================
// `continue button field:`
html.button_continue = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Button (continue)</h1>
      <div class="daclear"></div>
    </div>

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uX2NvbnRpbnVl" value="True"><span>Continue</span></button></div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YFovuA.U2cDuafLiEV5tfzlDHUdqn5UpHM">
    <input type="hidden" name="_event" value="WyJidXR0b25fY29udGludWUiXQ">
    <input type="hidden" name="_question_name" value="ID button continue">
    <input type="hidden" name="_tracker" value="11">
    <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dVgyTnZiblJwYm5WbCI6ICJib29sZWFuIn0">
    <input type="hidden" name="_visible" value="">
  </form>
</section>`;

// `yesnomaybe:`
html.buttons_yesnomaybe = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Button (yes/no/maybe)</h1>
      <div class="daclear"></div>
    </div>

    <fieldset class="da-field-yesnomaybe">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div>
        <button class="btn btn-primary btn-da " name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="True"><span>Yes</span></button>
        <button class="btn btn-da btn-secondary" name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="False"><span>No</span></button>
        <button class="btn btn-da btn-warning" name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="None"><span>I don’t know</span></button>
      </div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YFn06Q.qy7hRea2kn5UZaqKe7fBKoO7p0o">
    <input type="hidden" name="_event" value="WyJidXR0b25zX3llc25vbWF5YmUiXQ">
    <input type="hidden" name="_question_name" value="ID buttons yesnomaybe">
    <input type="hidden" name="_tracker" value="9">
    <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dWMxOTVaWE51YjIxaGVXSmwiOiAidGhyZWVzdGF0ZSJ9">
    <input type="hidden" name="_visible" value="">
  </form>
</section>`;

// Multiple choice 'continue' button fields that are not yesnomaybe
// `field:` and `buttons:`
html.buttons_other = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Button (other)</h1>
      <div class="daclear"></div>
    </div>

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div>
        <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_1"><span>button 1</span></button>
        <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_2"><span>button 2</span></button>
        <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_3"><span>button 3</span></button>
      </div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YFoMuw.5kqHJwVOXKDaQen-VQuev2Ve3Z8">
    <input type="hidden" name="_event" value="WyJidXR0b25zX290aGVyIl0">
    <input type="hidden" name="_question_name" value="ID buttons other">
    <input type="hidden" name="_tracker" value="10">
    <input type="hidden" name="_visible" value="">
  </form>
</section>`;

// `field:` and `action buttons:`
// It's not actually a button, it's a link (`<a>`)
html.buttons_event_action = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Button (event action)</h1>
      <div class="daclear"></div>
    </div>

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uX2V2ZW50X2FjdGlvbg" value="True"><span>Continue</span></button>
        <a data-linknum="1" href="/interview?action=eyJhY3Rpb24iOiAiZW5kIiwgImFyZ3VtZW50cyI6IHt9fQ&amp;i=docassemble.playground12ALTestingTestingRun%3Aall_tests.yml" class="btn btn-primary btn-da daquestionactionbutton danonsubmit"><svg class="svg-inline--fa fa-laugh-wink fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="laugh-wink" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" data-fa-i2svg="">
            <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm20.1 198.1c4-25.2 34.2-42.1 59.9-42.1s55.9 16.9 59.9 42.1c1.7 11.1-11.4 18.3-19.8 10.8l-9.5-8.5c-14.8-13.2-46.2-13.2-61 0L288 217c-8.4 7.4-21.6.3-19.9-10.9zM168 160c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm230.9 146C390 377 329.4 432 256 432h-16c-73.4 0-134-55-142.9-126-1.2-9.5 6.3-18 15.9-18h270c9.6 0 17.1 8.4 15.9 18z"></path>
          </svg><!-- <i class="fas fa-laugh-wink"></i> Font Awesome fontawesome.com --> Do not pass go</a></div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YFo2Rw.jEdEyLOdAegw_klnELh4Jux0C9A">
    <input type="hidden" name="_event" value="WyJidXR0b25fZXZlbnRfYWN0aW9uIl0">
    <input type="hidden" name="_question_name" value="ID button event action">
    <input type="hidden" name="_tracker" value="14">
    <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dVgyVjJaVzUwWDJGamRHbHZiZyI6ICJib29sZWFuIn0">
    <input type="hidden" name="_visible" value="">
  </form>
</section>`


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
html.proxies_xi = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTests80Signatures%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Proxy vars</h1>
      <div class="daclear"></div>
    </div>
    
    <div class="form-group row darequired da-field-container da-field-container-datatype-text"><label for="eFtpXS5uYW1lLmZpcnN0" class="col-md-4 col-form-label da-form-label datext-right">Name of person in list</label>
      <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control" type="text" name="eFtpXS5uYW1lLmZpcnN0" id="eFtpXS5uYW1lLmZpcnN0" aria-invalid="false"></div>
    </div>

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button class="btn btn-da btn-primary" type="submit"><span>Continue</span></button></div>
    </fieldset>

    <input type="hidden" name="csrf_token" value="IjQ5MDg1MTU1M2Q3OTAzMzBlYWE0NTdjNDJhMWVhMGZjYjUzOWZmMDYi.YF34KA.OcIBnD6kITqqewqXHsSxT-rCZBg">
    <input type="hidden" name="_event" value="WyJhX2xpc3RbMF0ubmFtZS5maXJzdCJd">
    <input type="hidden" name="_question_name" value="ID proxy vars">
    <input type="hidden" name="_tracker" value="1">
    <input type="hidden" name="_datatypes" value="eyJlRnRwWFM1dVlXMWxMbVpwY25OMCI6ICJ0ZXh0In0">
    <input type="hidden" name="_visible" value="">
    <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJlRnRwWFM1dVlXMWxMbVpwY25OMCJ9">
  </form>
</section>`;

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
html.proxies_non_match = `
<section id="daquestion" class="tab-pane active col-xl-6 col-lg-6 col-md-9">
  <div class="progress mt-2">
    <div class="progress-bar" role="progressbar" aria-valuenow="60.27856815417815" aria-valuemin="0" aria-valuemax="100" style="width: 60.27856815417815%;"></div>
  </div>
  <p><code>Page id: dbd 04 benefits dates</code></p>
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12testingaddteststoseparatinginterviewcodeetc%3AChildSupportObligors.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">When did you get State Veterans Benefits?</h1>
      <div class="daclear"></div>
    </div>

    <div class="form-group row darequired da-field-container da-field-container-datatype-date da-group-has-error"><label for="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU" class="col-md-4 col-form-label da-form-label datext-right">When did your State Veterans Benefits start?</label>
      <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control is-invalid" type="date" name="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU" id="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU" aria-describedby="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU-error"><span id="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU-error" class="da-has-error text-danger">You need to fill this in.</span></div>
    </div>

    <div class="form-group row da-field-container da-field-container-note">
      <div class="col-md-12">
        <p>If you do not know when your State Veterans Benefits began, give us your best estimate.</p>
      </div>
    </div>

    <div class="form-group row darequired da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesnoradio da-group-has-error"><label for="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw" class="col-md-4 col-form-label da-form-label datext-right">Do you still get State Veterans Benefits?</label>
      <div class="col-md-8 dafieldpart">
        <fieldset class="da-field-radio" role="radiogroup">
          <legend class="sr-only">Choices:</legend><input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth is-invalid" id="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_0" name="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw" type="radio" value="True" aria-hidden="true" style="display: none;" aria-describedby="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw-error"><label class="btn-light" for="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
              </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Yes</span></label><input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_1" name="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw" type="radio" value="False" aria-hidden="true" style="display: none;"><label class="btn-light" for="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
              </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">No</span></label><span id="eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw-error" class="da-has-error text-danger">You need to select one.</span>
        </fieldset>
      </div>
    </div>

    <div style="display: none;" class="dajsshowif" data-saveas="eW91cl9wYXN0X2JlbmVmaXRzW2ldLmVuZF9kYXRl" data-jsshowif="eyJleHByZXNzaW9uIjogInZhbChcInlvdXJfcGFzdF9iZW5lZml0c1tpXS5zdGlsbF9yZWNlaXZpbmdcIikgPT09IGZhbHNlIiwgInZhcnMiOiBbInlvdXJfcGFzdF9iZW5lZml0c1tpXS5zdGlsbF9yZWNlaXZpbmciXSwgInNpZ24iOiB0cnVlLCAibW9kZSI6IDB9">
      <div class="form-group row darequired da-field-container da-field-container-datatype-date"><label for="X2ZpZWxkXzM" class="col-md-4 col-form-label da-form-label datext-right">When did your State Veterans Benefits end?</label>
        <div class="col-md-8 dafieldpart"><input alt="Input box" class="form-control" type="date" name="X2ZpZWxkXzM" id="X2ZpZWxkXzM" disabled=""></div>
      </div>
    </div>

    <input type="hidden" name="_checkboxes" value="eyJlVzkxY2w5d1lYTjBYMkpsYm1WbWFYUnpXMmxkTG5OMGFXeHNYM0psWTJWcGRtbHVadyI6ICJGYWxzZSJ9">

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button class="btn btn-da btn-primary" type="submit"><span>Next</span></button></div>
    </fieldset>

    <div class="daundertext">
      <p>Feedback, suggestions, or comments? <a data-linknum="1" href="https://apps-dev.suffolklitlab.org/interview?i=docassemble.playground12testingaddteststoseparatinginterviewcodeetc%3Afeedback.yml&amp;github_repo=docassemble-deadbrokedads&amp;github_user=carorob&amp;variable=your_past_benefits%5B%27State+Veterans+Benefits%27%5D.still_receiving&amp;question_id=dbd+04+benefits+dates&amp;reset=1&amp;from_list=1" target="_blank">Complete this survey</a>.</p>
    </div> <input type="hidden" name="csrf_token" value="IjkyOGQ1MmExNGRmY2M1MWNlZmEzMTE1MjcxODc1M2Y1OWYzYzA3ZTIi.YGuZjg.40f4LTH-W4hfe6B23YhZDv4MHVE">
    <input type="hidden" name="_event" value="WyJ5b3VyX3Bhc3RfYmVuZWZpdHNbJ1N0YXRlIFZldGVyYW5zIEJlbmVmaXRzJ10uc3RpbGxfcmVjZWl2aW5nIl0">
    <input type="hidden" name="_question_name" value="ID dbd 04 benefits dates">
    <input type="hidden" name="_tracker" value="21">
    <input type="hidden" name="_datatypes" value="eyJlVzkxY2w5d1lYTjBYMkpsYm1WbWFYUnpXMmxkTG5OMFlYSjBYMlJoZEdVIjogImRhdGUiLCAiZVc5MWNsOXdZWE4wWDJKbGJtVm1hWFJ6VzJsZExuTjBhV3hzWDNKbFkyVnBkbWx1WnciOiAiYm9vbGVhbiIsICJlVzkxY2w5d1lYTjBYMkpsYm1WbWFYUnpXMmxkTG1WdVpGOWtZWFJsIjogImRhdGUifQ">
    <input type="hidden" name="_visible" value="">
    <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJlVzkxY2w5d1lYTjBYMkpsYm1WbWFYUnpXMmxkTG5OMFlYSjBYMlJoZEdVIiwgIlgyWnBaV3hrWHpJIjogImVXOTFjbDl3WVhOMFgySmxibVZtYVhSelcybGRMbk4wYVd4c1gzSmxZMlZwZG1sdVp3IiwgIlgyWnBaV3hrWHpNIjogImVXOTFjbDl3WVhOMFgySmxibVZtYVhSelcybGRMbVZ1WkY5a1lYUmwifQ">
  </form>
</section>`;


// ============================
// Signature
// ============================
html.signature = `
<section id="daquestion" class="tab-pane active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
  <div class="dasigpage" id="dasigpage">
    <div class="dasigshowsmallblock dasigheader d-block d-sm-none" id="dasigheader" style="">
      <div class="dasiginnerheader">
        <a href="#" role="button" class="btn btn-sm btn-warning dasignav-left dasignavbutton dasigclear">Clear</a>
        <a href="#" role="button" class="btn btn-sm btn-primary dasignav-right dasignavbutton dasigsave">Continue</a>
        <div id="dasigtitle" class="dasigtitle">Signature 1</div>
      </div>
    </div>
    <div class="dasigtoppart" id="dasigtoppart">
      <div id="daerrormess" class="dasigerrormessage dasignotshowing">You must sign your name to continue.</div>
      <div class="da-page-header d-none d-sm-block">
        <h1 class="h3">Signature 1</h1>
        <div class="daclear"></div>
      </div>
    </div>
    <div id="dasigmidpart" class="dasigmidpart"></div>

    <div id="dasigcontent" style="height: 180px;"><canvas id="dasigcanvas" width="450px" height="180px"></canvas></div>
    
    <div class="dasigbottompart" id="dasigbottompart">
    </div>
    <div class="form-actions d-none d-sm-block dasigbuttons mt-3">
      <a href="#" role="button" class="btn btn-primary btn-da dasigsave">Continue</a>
      <a href="#" role="button" class="btn btn-warning btn-da dasigclear">Clear</a>
    </div>
  </div>
  <form aria-labelledby="dasigtitle" action="/interview?i=docassemble.playground12ALTestingTests80Signatures%3Aall_tests.yml" id="dasigform" method="POST"><input type="hidden" name="_save_as" value="c2lnbmF0dXJlXzE"><input type="hidden" id="da_sig_required" value="1"><input type="hidden" id="da_ajax" name="ajax" value="0"><input type="hidden" id="da_the_image" name="_the_image" value=""><input type="hidden" id="da_success" name="_success" value="0"> <input type="hidden" name="csrf_token" value="IjkyYzc0NDk2YWFkZjUyODg3NWY3NDM3NjliZjQ5ODMwOTgyOGE4ZGEi.YGhoaw.rQUphWhyjZQEJSvcwUfT6st9Q4k">
    <input type="hidden" name="_event" value="WyJzaWduYXR1cmVfMSJd">
    <input type="hidden" name="_question_name" value="ID first signature">
    <input type="hidden" name="_tracker" value="11">
  </form>
  <div class="d-block d-md-none"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div>
  <div class="dasigpost"></div>
</section>`;


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
html.choices = `
<section id="daquestion" class="tab-pane active col-xl-6 col-lg-6 col-md-9">
  <div class="progress mt-2">
    <div class="progress-bar" role="progressbar" aria-valuenow="53.67087698402467" aria-valuemin="0" aria-valuemax="100" style="width: 53.67087698402467%;"></div>
  </div>
  <p><code>Page id: dbd 02 - ever pay late?</code></p>
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12testingaddteststoseparatinginterviewcodeetc%3AChildSupportObligors.yml" id="daform" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">Did you ever pay late?</h1>
      <div class="daclear"></div>
    </div>
    <div class="da-subquestion">
      <p>Did you ever fall behind on child support payments?</p>
    </div>

    <fieldset class="da-field-radio">
      <legend class="sr-only">Choices:</legend>
      <div class="row">
        <div class="col-md-12"><input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth is-invalid" id="Y3NfYXJyZWFyc19tYw_0" name="Y3NfYXJyZWFyc19tYw" type="radio" value="Yes" aria-hidden="true" style="display: none;" aria-describedby="Y3NfYXJyZWFyc19tYw-error"><label class="btn-light" for="Y3NfYXJyZWFyc19tYw_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
              </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">Yes</span></label></div>
      </div>
      <div class="row">
        <div class="col-md-12"><input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="Y3NfYXJyZWFyc19tYw_1" name="Y3NfYXJyZWFyc19tYw" type="radio" value="No" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y3NfYXJyZWFyc19tYw_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
              </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">No</span></label></div>
      </div>
      <div class="row">
        <div class="col-md-12"><input aria-label="I am not sure" alt="I am not sure" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="Y3NfYXJyZWFyc19tYw_2" name="Y3NfYXJyZWFyc19tYw" type="radio" value="I am not sure" aria-hidden="true" style="display: none;"><label class="btn-light" for="Y3NfYXJyZWFyc19tYw_2" tabindex="0" role="radio" aria-checked="false" aria-label="I am not sure"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
              </svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-unchecked">I am not sure</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span><span class="labelauty-checked">I am not sure</span></label></div>
      </div>
      <div id="daerrorcontainer" style=""><span id="Y3NfYXJyZWFyc19tYw-error" class="da-has-error text-danger">You need to select one.</span></div>
    </fieldset>

    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div>
        <button class="btn btn-da btn-primary" type="submit"><span>Next</span></button>
      </div>
    </fieldset>

    <div class="daundertext">
      <p>Feedback, suggestions, or comments? <a data-linknum="1" href="https://apps-dev.suffolklitlab.org/interview?i=docassemble.playground12testingaddteststoseparatinginterviewcodeetc%3Afeedback.yml&amp;github_repo=docassemble-deadbrokedads&amp;github_user=carorob&amp;variable=cs_arrears_mc&amp;question_id=dbd+02+-+ever+pay+late%3F&amp;reset=1&amp;from_list=1" target="_blank">Complete this survey</a>.</p>
    </div> <input type="hidden" name="csrf_token" value="IjU0NGE0ZjczNGQ4YzY0NWUyNTE4Y2NjNzA4NDNhOTQyM2RkZGI2Y2Ui.YGuCAQ.pEgr9bcH4JjKkajiB3MXXrM4PKg">
    <input type="hidden" name="_event" value="WyJjc19hcnJlYXJzX21jIl0">
    <input type="hidden" name="_question_name" value="ID dbd 02 - ever pay late?">
    <input type="hidden" name="_tracker" value="18">
    <input type="hidden" name="_visible" value="">
  </form>
</section>`;


// ============================
// dropdowns created with objects
// ============================
// ```
// - Something: some_var
//   datatype: object
//   object labeler: |
//     lambda y: y.short_label()```
//   choices: some_obj
// ```
html.object_dropdown = `
<section id="daquestion" class="tab-pane active col-xl-6 col-lg-6 col-md-9">
  <div class="progress mt-2">
    <div class="progress-bar" role="progressbar" aria-valuenow="18.549374999999998" aria-valuemin="0" aria-valuemax="100" style="width: 18.549374999999998%;"></div>
  </div>
  <p><code>id: choose a court from list</code><br>
    <code>Package: docassemble.playground12MotionMod66Metadata playground; AL-2.0.12</code></p>
  <div data-variable="dHJpYWxfY291cnQ" id="sought_variable" aria-hidden="true" style="display: none;"></div>
  <div class="daaudiovideo-control al_custom_media_controls">
    <audio title="Read this screen out loud" class="daaudio-control" preload="none" style="display: none;">
      <source src="/speakfile?i=docassemble.playground12MotionMod66Metadata%3A209a_plaintiff_s_motion_to_modify.yml&amp;question=137&amp;digest=e4bf45b8a4efe4a8a2b518850cbbe90c&amp;type=question&amp;format=mp3&amp;language=en&amp;dialect=us" type="audio/mpeg">
      <source src="/speakfile?i=docassemble.playground12MotionMod66Metadata%3A209a_plaintiff_s_motion_to_modify.yml&amp;question=137&amp;digest=e4bf45b8a4efe4a8a2b518850cbbe90c&amp;type=question&amp;format=ogg&amp;language=en&amp;dialect=us" type="audio/ogg">
      <a target="_blank" href="/speakfile?i=docassemble.playground12MotionMod66Metadata%3A209a_plaintiff_s_motion_to_modify.yml&amp;question=137&amp;digest=e4bf45b8a4efe4a8a2b518850cbbe90c&amp;type=question&amp;format=ogg&amp;language=en&amp;dialect=us">Listen</a>
    </audio>
    <div id="page_reader_substitute_1" class="btn-group"> <button class="media-action play btn btn-sm btn-outline-secondary"> <svg class="svg-inline--fa fa-volume-up fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg="">
          <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"></path>
        </svg><!-- <i class="fas fa-volume-up"></i> Font Awesome fontawesome.com --><span>&nbsp;Listen&nbsp;</span> <svg class="svg-inline--fa fa-play fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
          <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
        </svg><!-- <i class="fas fa-play"></i> Font Awesome fontawesome.com --> </button> <button class="media-action restart btn btn-sm btn-outline-secondary" aria-hidden="true" style="display: none;"> <svg class="svg-inline--fa fa-volume-up fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg="">
          <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"></path>
        </svg><!-- <i class="fas fa-volume-up"></i> Font Awesome fontawesome.com --><span>&nbsp;Listen&nbsp;</span> <svg class="svg-inline--fa fa-undo fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="undo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
          <path fill="currentColor" d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"></path>
        </svg><!-- <i class="fas fa-undo"></i> Font Awesome fontawesome.com --> </button> <button class="media-action pause btn btn-sm btn-outline-secondary" aria-hidden="true" style="display: none;"> <svg class="svg-inline--fa fa-volume-up fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg="">
          <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"></path>
        </svg><!-- <i class="fas fa-volume-up"></i> Font Awesome fontawesome.com --><span>&nbsp;Listen&nbsp;</span> <svg class="svg-inline--fa fa-pause fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
          <path fill="currentColor" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path>
        </svg><!-- <i class="fas fa-pause"></i> Font Awesome fontawesome.com --> </button> <button class="media-action stop btn btn-sm btn-outline-secondary"> <svg class="svg-inline--fa fa-stop fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
          <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></path>
        </svg><!-- <i class="fas fa-stop"></i> Font Awesome fontawesome.com --> </button></div>
  </div>
  <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12MotionMod66Metadata%3A209a_plaintiff_s_motion_to_modify.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
    <div class="da-page-header">
      <h1 class="h3" id="daMainQuestion">What court is your case in?</h1>
      <div class="daclear"></div>
    </div>
    <div class="da-subquestion">
      <p>Look at your Abuse Prevention Order. </p>
      <p>Underneath <strong>your</strong> name, see the court name. </p>
      <p>Select that court from the list below:</p>
    </div>
    <div class="form-group row darequired da-field-container da-field-container-datatype-object da-field-container-inputtype-dropdown da-field-container-nolabel">
      <label for="dHJpYWxfY291cnQ" class="sr-only">Answer here</label>
      <div class="col dawidecol dafieldpart">
        <p class="sr-only">Select box</p><select class="form-control daobject" name="dHJpYWxfY291cnQ" id="dHJpYWxfY291cnQ">
          <option value="">Select...</option>
          <option value="YWxsX2NvdXJ0c1swXQ">Attleboro District Court</option>
          <option value="YWxsX2NvdXJ0c1syXQ">Ayer District Court</option>
          <option value="YWxsX2NvdXJ0c1szXQ">Barnstable County Superior Court</option>
        </select>
      </div>
    </div>
    <fieldset class="da-field-buttons">
      <legend class="sr-only">Press one of the following buttons:</legend>
      <div class="form-actions">
        <button type="button" class="btn btn-link btn-da daquestionbackbutton danonsubmit" title="Go back to the previous question"><span><svg class="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
              <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
            </svg><!-- <i class="fas fa-chevron-left"></i> Font Awesome fontawesome.com --> Undo</span></button>
        <button class="btn btn-da btn-primary" type="submit"><span>Next</span></button></div>
    </fieldset>
    <div class="daundertext">
      <p>Feedback, suggestions, or comments? <a data-linknum="1" href="https://apps-dev.suffolklitlab.org/interview?i=docassemble.MAVirtualCourt%3Afeedback.yml&amp;github_repo=docassemble-AssemblyLine&amp;github_user=suffolklitlab&amp;variable=trial_court&amp;question_id=choose+a+court+from+list&amp;package_version=playground&amp;reset=1&amp;from_list=1" target="_blank">Complete this survey</a>.</p>
    </div> <input type="hidden" name="csrf_token" value="IjkyYzc0NDk2YWFkZjUyODg3NWY3NDM3NjliZjQ5ODMwOTgyOGE4ZGEi.YH2U8g.PRwZHAGRHFPeYDe4K5aQQ3-ztz0">
    <input type="hidden" name="_event" value="WyJ0cmlhbF9jb3VydCJd">
    <input type="hidden" name="_question_name" value="ID choose a court from list">
    <input type="hidden" name="_tracker" value="5">
    <input type="hidden" name="_datatypes" value="eyJkSEpwWVd4ZlkyOTFjblEiOiAib2JqZWN0In0">
    <input type="hidden" name="_visible" value="">
    <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJkSEpwWVd4ZlkyOTFjblEifQ">
  </form>
</section>`;


module.exports = html;
