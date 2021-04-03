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
html.proxies = `
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


module.exports = html;
