/* HTML string of pages for testing. They are split into
* variables to make each field easier to read.
* 
* #trigger element is added into #daquestion, though it's not at
* that location on the actual page. Otherwise, we'd have a lot more
* html in here. In scope.js, it's found just using its id selector.
*/

let html = {};

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
// TODO: Add tests for individual fields.
// NOTE: `.standard` also tests for old `#sought_variable` element
html.standard = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Direct standard fields</h1>
            <div class="daclear"></div>
        </div>
        <div class="da-subquestion">
            <p>Excludes proxy vars (x, i, j, etc.) or choices created with objects.</p>
        </div>
        <div class="da-form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><span class="visually-hidden">Check if applicable</span>
            <div class="offset-md-4 col-md-8 dafieldpart">
                <fieldset class="da-field-checkbox">
                    <legend class="visually-hidden">Choices:</legend>
                    <input aria-label="checkboxes (yesno)" alt="checkboxes (yesno)" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="Y2hlY2tib3hlc195ZXNubw"
                    id="Y2hlY2tib3hlc195ZXNubw" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="Y2hlY2tib3hlc195ZXNubw" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes (yesno)"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">checkboxes (yesno)</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">checkboxes (yesno)</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes">
            <label class="col-md-4 col-form-label da-form-label datext-right">checkboxes (other)</label>
            <div class="col-md-8 dafieldpart">
                <fieldset class="da-field-checkboxes" role="group">
                    <legend class="visually-hidden">Checkboxes:</legend>
                    <input aria-label="checkboxes opt 1" alt="checkboxes opt 1" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcg_0" name="Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6RSdd"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="Y2hlY2tib3hlc19vdGhlcg_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">checkboxes opt 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">checkboxes opt 1</span>
                    </label>
                    <input aria-label="checkboxes opt 2" alt="checkboxes opt 2" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcg_1" name="Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6SSdd"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="Y2hlY2tib3hlc19vdGhlcg_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">checkboxes opt 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">checkboxes opt 2</span>
                    </label>
                    <input aria-label="checkboxes opt 3" alt="checkboxes opt 3" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="Y2hlY2tib3hlc19vdGhlcg_2" name="Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6TSdd"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="Y2hlY2tib3hlc19vdGhlcg_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="checkboxes opt 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">checkboxes opt 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">checkboxes opt 3</span>
                    </label>
                    <input aria-label="None of the above" alt="None of the above" class="dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore1" aria-hidden="true" id="labelauty-294201"
                    style="display: none;">
                    <label class="form-label btn-light" for="labelauty-294201" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">None of the above</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesnoradio">
            <label for="cmFkaW9feWVzbm8" class="col-md-4 col-form-label da-form-label datext-right">radio (yesno)</label>
            <div class="col-md-8 dafieldpart">
                <fieldset class="da-field-radio" role="radiogroup">
                    <legend class="visually-hidden">Choices:</legend>
                    <input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9feWVzbm8_0" name="cmFkaW9feWVzbm8" type="radio" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="cmFkaW9feWVzbm8_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">Yes</span>
                    </label>
                    <input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9feWVzbm8_1" name="cmFkaW9feWVzbm8" type="radio" value="False" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="cmFkaW9feWVzbm8_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">No</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-radio">
            <label for="cmFkaW9fb3RoZXI" class="col-md-4 col-form-label da-form-label datext-right">radio (other)</label>
            <div class="col-md-8 dafieldpart">
                <fieldset class="da-field-radio" role="radiogroup">
                    <legend class="visually-hidden">Choices:</legend>
                    <input aria-label="radio opt 1" alt="radio opt 1" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_0" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_1" aria-hidden="true"
                    style="display: none;">
                    <label class="form-label btn-light" for="cmFkaW9fb3RoZXI_0" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">radio opt 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">radio opt 1</span>
                    </label>
                    <input aria-label="radio opt 2" alt="radio opt 2" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_1" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_2" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="cmFkaW9fb3RoZXI_1" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">radio opt 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">radio opt 2</span>
                    </label>
                    <input aria-label="radio opt 3" alt="radio opt 3" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="cmFkaW9fb3RoZXI_2" name="cmFkaW9fb3RoZXI" type="radio" value="radio_other_opt_3" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="cmFkaW9fb3RoZXI_2" tabindex="0" role="radio" aria-checked="false" aria-label="radio opt 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">radio opt 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">radio opt 3</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-text">
            <label for="dGV4dF9pbnB1dA" class="col-md-4 col-form-label da-form-label datext-right">text input</label>
            <div class="col-md-8 dafieldpart">
                <input alt="Input box" class="form-control" type="text" name="dGV4dF9pbnB1dA" id="dGV4dF9pbnB1dA">
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-area">
            <label for="dGV4dGFyZWE" class="col-md-4 col-form-label da-form-label datext-right">textarea</label>
            <div class="col-md-8 dafieldpart">
                <textarea alt="Input box" class="form-control" rows="4" name="dGV4dGFyZWE" id="dGV4dGFyZWE"></textarea>
            </div>
        </div>
        <div class="da-form-group row da-field-container da-field-container-datatype-date">
            <label for="ZGF0ZV9pbnB1dA" class="col-md-4 col-form-label da-form-label datext-right">date field</label>
            <div class="col-md-8 dafieldpart">
                <input alt="Input box" class="form-control" type="date" name="ZGF0ZV9pbnB1dA" id="ZGF0ZV9pbnB1dA">
            </div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-dropdown da-field-container-inputtype-dropdown">
            <label for="ZHJvcGRvd25fdGVzdA" class="col-md-4 col-form-label da-form-label datext-right">dropdown</label>
            <div class="col-md-8 dafieldpart">
                <p class="visually-hidden">Select box</p>
                <select class="form-select dasingleselect" name="ZHJvcGRvd25fdGVzdA" id="ZHJvcGRvd25fdGVzdA">
                    <option value="">Select...</option>
                    <option value="dropdown_opt_1">dropdown opt 1</option>
                    <option value="dropdown_opt_2">dropdown opt 2</option>
                    <option value="dropdown_opt_3">dropdown opt 3</option>
                </select>
            </div>
        </div>
        <input type="hidden" name="_checkboxes" value="eyJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IjogIkZhbHNlIiwgIlkyaGxZMnRpYjNobGMxOXZkR2hsY2x0Q0oxa3lhR3haTW5ScFlqTm9abUl6VW05YVdFcG1Zak5DTUZoNlJTZGQiOiAiRmFsc2UiLCAiWTJobFkydGliM2hsYzE5dmRHaGxjbHRDSjFreWFHeFpNblJwWWpOb1ptSXpVbTlhV0VwbVlqTkNNRmg2U1NkZCI6ICJGYWxzZSIsICJZMmhsWTJ0aWIzaGxjMTl2ZEdobGNsdENKMWt5YUd4Wk1uUnBZak5vWm1JelVtOWFXRXBtWWpOQ01GaDZUU2RkIjogIkZhbHNlIiwgImNtRmthVzlmZVdWemJtOCI6ICJGYWxzZSIsICJaR0YwWlY5cGJuQjFkQSI6ICJOb25lIn0">
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button type="submit" class="btn btn-da btn-primary" name="ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw" value="True">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ42Pw.Mt_IdBcCQmIFPn3gi7ZeZLvLLC4">
        <input type="hidden" name="_event" value="WyJkaXJlY3Rfc3RhbmRhcmRfZmllbGRzIl0">
        <input type="hidden" name="_question_name" value="ID direct standard fields">
        <input type="hidden" name="_tracker" value="5">
        <input type="hidden" name="_datatypes" value="eyJaR2x5WldOMFgzTjBZVzVrWVhKa1gyWnBaV3hrY3ciOiAiYm9vbGVhbiIsICJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IjogImJvb2xlYW4iLCAiWTJobFkydGliM2hsYzE5dmRHaGxjZyI6ICJjaGVja2JveGVzIiwgImNtRmthVzlmZVdWemJtOCI6ICJib29sZWFuIiwgImNtRmthVzlmYjNSb1pYSSI6ICJ0ZXh0IiwgImRHVjRkRjlwYm5CMWRBIjogInRleHQiLCAiZEdWNGRHRnlaV0UiOiAidGV4dCIsICJaR0YwWlY5cGJuQjFkQSI6ICJkYXRlIiwgIlpISnZjR1J2ZDI1ZmRHVnpkQSI6ICJkcm9wZG93biJ9">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJZMmhsWTJ0aWIzaGxjMTk1WlhOdWJ3IiwgIlgyWnBaV3hrWHpFIjogIlkyaGxZMnRpYjNobGMxOXZkR2hsY2ciLCAiWDJacFpXeGtYekkiOiAiY21Ga2FXOWZlV1Z6Ym04IiwgIlgyWnBaV3hrWHpNIjogImNtRmthVzlmYjNSb1pYSSIsICJYMlpwWld4a1h6USI6ICJkR1Y0ZEY5cGJuQjFkQSIsICJYMlpwWld4a1h6VSI6ICJkR1Y0ZEdGeVpXRSIsICJYMlpwWld4a1h6WSI6ICJaR0YwWlY5cGJuQjFkQSIsICJYMlpwWld4a1h6YyI6ICJaSEp2Y0dSdmQyNWZkR1Z6ZEEifQ">
    </form>
</div>`;


// ============================
// Simple show if fields - no proxies
// ============================
// Types of fields that use _field_n
// At least all simple showif fields
html.show_if = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="ZGlyZWN0X3Nob3dpZnM" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
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
        <div class="da-form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><span class="visually-hidden">Check if applicable</span>
            <div class="offset-md-4 col-md-8 dafieldpart">
                <fieldset class="da-field-checkbox">
                    <legend class="visually-hidden">Choices:</legend>
                    <input aria-label="Show layer 2" alt="Show layer 2" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="c2hvd18y" id="c2hvd18y" aria-hidden="true"
                    style="display: none;">
                    <label class="form-label btn-light" for="c2hvd18y" tabindex="0" role="checkbox" aria-checked="false" aria-label="Show layer 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">Show layer 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">Show layer 2</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd18z" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18y" data-showif-val="True">
            <div class="da-form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><span class="visually-hidden">Check if applicable</span>
                <div class="offset-md-4 col-md-8 dafieldpart">
                    <fieldset class="da-field-checkbox">
                        <legend class="visually-hidden">Choices:</legend>
                        <input aria-label="Show layer 3" alt="Show layer 3" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="X2ZpZWxkXzE" id="X2ZpZWxkXzE"
                        aria-hidden="true" disabled="" style="display: none;">
                        <label class="form-label btn-light" for="X2ZpZWxkXzE" tabindex="0" role="checkbox" aria-checked="false" aria-label="Show layer 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">Show layer 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">Show layer 3</span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2NoZWNrYm94X3llc25v" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row dayesnospacing da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesno da-field-container-emptylabel"><span class="visually-hidden">Check if applicable</span>
                <div class="offset-md-4 col-md-8 dafieldpart">
                    <fieldset class="da-field-checkbox">
                        <legend class="visually-hidden">Choices:</legend>
                        <input aria-label="showif checkbox yesno" alt="showif checkbox yesno" class="da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth" type="checkbox" value="True" name="X2ZpZWxkXzI"
                        id="X2ZpZWxkXzI" aria-hidden="true" disabled="" style="display: none;">
                        <label class="form-label btn-light" for="X2ZpZWxkXzI" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox yesno"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif checkbox yesno</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif checkbox yesno</span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2NoZWNrYm94ZXNfb3RoZXI" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes">
                <label class="col-md-4 col-form-label da-form-label datext-right">showif checkboxes (multiple)</label>
                <div class="col-md-8 dafieldpart">
                    <fieldset class="da-field-checkboxes" role="group">
                        <legend class="visually-hidden">Checkboxes:</legend>
                        <input aria-label="showif checkbox nota 1" alt="showif checkbox nota 1" class="dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzM_0" name="X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd"
                        type="checkbox" value="True" aria-hidden="true" style="display: none;" disabled="">
                        <label class="form-label btn-light" for="X2ZpZWxkXzM_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox nota 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif checkbox nota 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif checkbox nota 1</span>
                        </label>
                        <input aria-label="showif checkbox nota 2" alt="showif checkbox nota 2" class="dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzM_1" name="X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd"
                        type="checkbox" value="True" aria-hidden="true" style="display: none;" disabled="">
                        <label class="form-label btn-light" for="X2ZpZWxkXzM_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox nota 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif checkbox nota 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif checkbox nota 2</span>
                        </label>
                        <input aria-label="showif checkbox nota 3" alt="showif checkbox nota 3" class="dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzM_2" name="X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eidd"
                        type="checkbox" value="True" aria-hidden="true" style="display: none;" disabled="">
                        <label class="form-label btn-light" for="X2ZpZWxkXzM_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="showif checkbox nota 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif checkbox nota 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif checkbox nota 3</span>
                        </label>
                        <input aria-label="None of the above" alt="None of the above" class="dafield3 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore3" aria-hidden="true" id="labelauty-67439"
                        disabled="" style="display: none;">
                        <label class="form-label btn-light" for="labelauty-67439" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">None of the above</span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3llc25vcmFkaW8" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-boolean da-field-container-inputtype-yesnoradio">
                <label for="X2ZpZWxkXzQ" class="col-md-4 col-form-label da-form-label datext-right">showif yesnoradio</label>
                <div class="col-md-8 dafieldpart">
                    <fieldset class="da-field-radio" role="radiogroup">
                        <legend class="visually-hidden">Choices:</legend>
                        <input aria-label="Yes" alt="Yes" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzQ_0" name="X2ZpZWxkXzQ" type="radio" value="True" aria-hidden="true" disabled="" style="display: none;">
                        <label class="form-label btn-light" for="X2ZpZWxkXzQ_0" tabindex="0" role="radio" aria-checked="false" aria-label="Yes"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">Yes</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">Yes</span>
                        </label>
                        <input aria-label="No" alt="No" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzQ_1" name="X2ZpZWxkXzQ" type="radio" value="False" aria-hidden="true" disabled="" style="display: none;">
                        <label class="form-label btn-light" for="X2ZpZWxkXzQ_1" tabindex="0" role="radio" aria-checked="false" aria-label="No"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">No</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">No</span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3JhZGlvX290aGVy" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-radio">
                <label for="X2ZpZWxkXzU" class="col-md-4 col-form-label da-form-label datext-right">showif radio (multiple)</label>
                <div class="col-md-8 dafieldpart">
                    <fieldset class="da-field-radio" role="radiogroup">
                        <legend class="visually-hidden">Choices:</legend>
                        <input aria-label="showif radio multi 1" alt="showif radio multi 1" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_0" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_1"
                        aria-hidden="true" style="display: none;" disabled="">
                        <label class="form-label btn-light" for="X2ZpZWxkXzU_0" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif radio multi 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif radio multi 1</span>
                        </label>
                        <input aria-label="showif radio multi 2" alt="showif radio multi 2" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_1" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_2" aria-hidden="true"
                        style="display: none;" disabled="">
                        <label class="form-label btn-light" for="X2ZpZWxkXzU_1" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif radio multi 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif radio multi 2</span>
                        </label>
                        <input aria-label="showif radio multi 3" alt="showif radio multi 3" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="X2ZpZWxkXzU_2" name="X2ZpZWxkXzU" type="radio" value="showif_radio_multi_3" aria-hidden="true"
                        disabled="" style="display: none;">
                        <label class="form-label btn-light" for="X2ZpZWxkXzU_2" tabindex="0" role="radio" aria-checked="false" aria-label="showif radio multi 3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-unchecked">showif radio multi 3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                                <span
                                class="labelauty-checked">showif radio multi 3</span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3RleHRfaW5wdXQ" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-text">
                <label for="X2ZpZWxkXzY" class="col-md-4 col-form-label da-form-label datext-right">showif text input</label>
                <div class="col-md-8 dafieldpart">
                    <input alt="Input box" class="form-control" type="text" name="X2ZpZWxkXzY" id="X2ZpZWxkXzY" disabled="">
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX3RleHRhcmVh" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-area">
                <label for="X2ZpZWxkXzc" class="col-md-4 col-form-label da-form-label datext-right">showif text input</label>
                <div class="col-md-8 dafieldpart">
                    <textarea alt="Input box" class="form-control" rows="4" name="X2ZpZWxkXzc" id="X2ZpZWxkXzc" disabled=""></textarea>
                </div>
            </div>
        </div>
        <div style="display: none;" class="dashowif" data-saveas="c2hvd2lmX2Ryb3Bkb3du" data-showif-sign="1" data-showif-mode="0" data-showif-var="c2hvd18z" data-showif-val="True">
            <div class="da-form-group row darequired da-field-container da-field-container-datatype-text da-field-container-inputtype-dropdown">
                <label for="X2ZpZWxkXzg" class="col-md-4 col-form-label da-form-label datext-right">showif dropdown</label>
                <div class="col-md-8 dafieldpart">
                    <p class="visually-hidden">Select box</p>
                    <select class="form-select dasingleselect" name="X2ZpZWxkXzg" id="X2ZpZWxkXzg" disabled="">
                        <option value="">Select...</option>
                        <option value="showif_dropdown_1">showif dropdown opt 1</option>
                        <option value="showif_dropdown_2">showif dropdown opt 2</option>
                        <option value="showif_dropdown_3">showif dropdown opt 3</option>
                        <option value="showif_dropdown_4">showif dropdown opt 4</option>
                    </select>
                </div>
            </div>
        </div>
        <input type="hidden" name="_checkboxes" value="eyJjMmh2ZDE4eSI6ICJGYWxzZSIsICJjMmh2ZDE4eiI6ICJGYWxzZSIsICJjMmh2ZDJsbVgyTm9aV05yWW05NFgzbGxjMjV2IjogIkZhbHNlIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEpiUWlkak1taDJaREpzYlZneVRtOWFWMDV5V1cwNU5GcFlUbVppYlRrd1dWWTRlQ2RkIjogIkZhbHNlIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEpiUWlkak1taDJaREpzYlZneVRtOWFWMDV5V1cwNU5GcFlUbVppYlRrd1dWWTRlU2RkIjogIkZhbHNlIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEpiUWlkak1taDJaREpzYlZneVRtOWFWMDV5V1cwNU5GcFlUbVppYlRrd1dWWTRlaWRkIjogIkZhbHNlIiwgImMyaHZkMmxtWDNsbGMyNXZjbUZrYVc4IjogIkZhbHNlIn0">
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button type="submit" class="btn btn-da btn-primary" name="ZGlyZWN0X3Nob3dpZnM" value="True">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ45kg.7hWBFaZmdlwwBjqLhviS-tyKbS4">
        <input type="hidden" name="_event" value="WyJkaXJlY3Rfc2hvd2lmcyJd">
        <input type="hidden" name="_question_name" value="ID showifs">
        <input type="hidden" name="_tracker" value="6">
        <input type="hidden" name="_datatypes" value="eyJaR2x5WldOMFgzTm9iM2RwWm5NIjogImJvb2xlYW4iLCAiYzJodmQxOHkiOiAiYm9vbGVhbiIsICJjMmh2ZDE4eiI6ICJib29sZWFuIiwgImMyaHZkMmxtWDJOb1pXTnJZbTk0WDNsbGMyNXYiOiAiYm9vbGVhbiIsICJjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZiM1JvWlhJIjogImNoZWNrYm94ZXMiLCAiYzJodmQybG1YM2xsYzI1dmNtRmthVzgiOiAiYm9vbGVhbiIsICJjMmh2ZDJsbVgzSmhaR2x2WDI5MGFHVnkiOiAidGV4dCIsICJjMmh2ZDJsbVgzUmxlSFJmYVc1d2RYUSI6ICJ0ZXh0IiwgImMyaHZkMmxtWDNSbGVIUmhjbVZoIjogInRleHQiLCAiYzJodmQybG1YMlJ5YjNCa2IzZHUiOiAidGV4dCJ9">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJjMmh2ZDE4eSIsICJYMlpwWld4a1h6RSI6ICJjMmh2ZDE4eiIsICJYMlpwWld4a1h6SSI6ICJjMmh2ZDJsbVgyTm9aV05yWW05NFgzbGxjMjV2IiwgIlgyWnBaV3hrWHpNIjogImMyaHZkMmxtWDJOb1pXTnJZbTk0WlhOZmIzUm9aWEkiLCAiWDJacFpXeGtYelEiOiAiYzJodmQybG1YM2xsYzI1dmNtRmthVzgiLCAiWDJacFpXeGtYelUiOiAiYzJodmQybG1YM0poWkdsdlgyOTBhR1Z5IiwgIlgyWnBaV3hrWHpZIjogImMyaHZkMmxtWDNSbGVIUmZhVzV3ZFhRIiwgIlgyWnBaV3hrWHpjIjogImMyaHZkMmxtWDNSbGVIUmhjbVZoIiwgIlgyWnBaV3hrWHpnIjogImMyaHZkMmxtWDJSeWIzQmtiM2R1In0">
    </form>
</div>`;


// ============================
// Buttons
// ============================
// `continue button field:`
html.button_continue = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="YnV0dG9uX2NvbnRpbnVl" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Button (continue)</h1>
            <div class="daclear"></div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uX2NvbnRpbnVl" value="True">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ4-uA.hKcFQB0Glf6JDt96_UPDIDAvcjA">
        <input type="hidden" name="_event" value="WyJidXR0b25fY29udGludWUiXQ">
        <input type="hidden" name="_question_name" value="ID button continue">
        <input type="hidden" name="_tracker" value="12">
        <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dVgyTnZiblJwYm5WbCI6ICJib29sZWFuIn0">
        <input type="hidden" name="_visible" value="">
    </form>
</div>`;

// `yesnomaybe:`
html.buttons_yesnomaybe = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="YnV0dG9uc195ZXNub21heWJl" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Button (yes/no/maybe)</h1>
            <div class="daclear"></div>
        </div>
        <fieldset class="da-button-set da-field-yesnomaybe">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-primary btn-da" name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="True">Yes</button>
            <button class="btn btn-secondary btn-da" name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="False">No</button>
            <button class="btn btn-warning btn-da" name="YnV0dG9uc195ZXNub21heWJl" type="submit" value="None">I don’t know</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ48WA.uOXCbXlqc77MpYPJu5hxyq4b5ss">
        <input type="hidden" name="_event" value="WyJidXR0b25zX3llc25vbWF5YmUiXQ">
        <input type="hidden" name="_question_name" value="ID buttons yesnomaybe">
        <input type="hidden" name="_tracker" value="8">
        <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dWMxOTVaWE51YjIxaGVXSmwiOiAidGhyZWVzdGF0ZSJ9">
        <input type="hidden" name="_visible" value="">
    </form>
</div>`;

// Multiple choice 'continue' button fields that are not yesnomaybe
// `field:` and `buttons:`
html.buttons_other = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="YnV0dG9uc19vdGhlcg" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Button (other)</h1>
            <div class="daclear"></div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_1">button 1</button>
            <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_2">button 2</button>
            <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uc19vdGhlcg" value="button_3">button 3</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ4-QQ.l-7025694Jgr31vxB48L1A2SFy0">
        <input type="hidden" name="_event" value="WyJidXR0b25zX290aGVyIl0">
        <input type="hidden" name="_question_name" value="ID buttons other">
        <input type="hidden" name="_tracker" value="11">
        <input type="hidden" name="_visible" value="">
    </form>
</div>`;

// `field:` and `action buttons:`
// It's not actually a button, it's a link (`<a>`)
html.buttons_event_action = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="YnV0dG9uX2V2ZW50X2FjdGlvbg" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Button (event action)</h1>
            <div class="daclear"></div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button type="submit" class="btn btn-da btn-primary" name="YnV0dG9uX2V2ZW50X2FjdGlvbg" value="True">Continue</button>
            <a data-linknum="1" href="/interview?action=eyJhY3Rpb24iOiAiZW5kIiwgImFyZ3VtZW50cyI6IHt9fQ&amp;i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" class="btn btn-primary btn-da daquestionactionbutton danonsubmit">
                <svg class="svg-inline--fa fa-laugh-wink fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="laugh-wink" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" data-fa-i2svg="">
                    <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm20.1 198.1c4-25.2 34.2-42.1 59.9-42.1s55.9 16.9 59.9 42.1c1.7 11.1-11.4 18.3-19.8 10.8l-9.5-8.5c-14.8-13.2-46.2-13.2-61 0L288 217c-8.4 7.4-21.6.3-19.9-10.9zM168 160c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm230.9 146C390 377 329.4 432 256 432h-16c-73.4 0-134-55-142.9-126-1.2-9.5 6.3-18 15.9-18h270c9.6 0 17.1 8.4 15.9 18z"></path>
                </svg>
                <!-- <i class="fas fa-laugh-wink"></i> Font Awesome fontawesome.com -->Do not pass go</a>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5ADA.Fl6yjmlTVe5CEwvE98xIQ8o7_SM">
        <input type="hidden" name="_event" value="WyJidXR0b25fZXZlbnRfYWN0aW9uIl0">
        <input type="hidden" name="_question_name" value="ID button event action">
        <input type="hidden" name="_tracker" value="24">
        <input type="hidden" name="_datatypes" value="eyJZblYwZEc5dVgyVjJaVzUwWDJGamRHbHZiZyI6ICJib29sZWFuIn0">
        <input type="hidden" name="_visible" value="">
    </form>
</div>`;


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// These tests are useful so we make sure we're handling iteration with
// proxies correctly, but we don't need to worry about guessing the proxy
// name. See https://github.com/plocket/docassemble-cucumber/pull/221

// x[i].name.first
html.proxies_xi = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="cHJveHlfbGlzdFswXS5uYW1lLmZpcnN0" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Proxy var 1</h1>
            <div class="daclear"></div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-text">
            <label for="eFtpXS5uYW1lLmZpcnN0" class="col-md-4 col-form-label da-form-label datext-right">first proxy name</label>
            <div class="col-md-8 dafieldpart">
                <input alt="Input box" class="form-control" type="text" name="eFtpXS5uYW1lLmZpcnN0" id="eFtpXS5uYW1lLmZpcnN0">
            </div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-da btn-primary" type="submit">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5H8A.Tjer87_fAJ3oFK_LPAL6dO1hM0c">
        <input type="hidden" name="_event" value="WyJwcm94eV9saXN0WzBdLm5hbWUuZmlyc3QiXQ">
        <input type="hidden" name="_question_name" value="ID proxy vars">
        <input type="hidden" name="_tracker" value="16">
        <input type="hidden" name="_datatypes" value="eyJlRnRwWFM1dVlXMWxMbVpwY25OMCI6ICJ0ZXh0In0">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJlRnRwWFM1dVlXMWxMbVpwY25OMCJ9">
    </form>
</div>`;

// Second page of above
// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
html.proxies_multi = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="cHJveHlfbGlzdFsxXS5uYW1lLmZpcnN0" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Proxy var 2</h1>
            <div class="daclear"></div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-text">
            <label for="eFtpXS5uYW1lLmZpcnN0" class="col-md-4 col-form-label da-form-label datext-right">second proxy name</label>
            <div class="col-md-8 dafieldpart">
                <input alt="Input box" class="form-control" type="text" name="eFtpXS5uYW1lLmZpcnN0" id="eFtpXS5uYW1lLmZpcnN0">
            </div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-da btn-primary" type="submit">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5IgA.E1YcjbUeiPEheD7U_6uixUMTz1M">
        <input type="hidden" name="_event" value="WyJwcm94eV9saXN0WzFdLm5hbWUuZmlyc3QiXQ">
        <input type="hidden" name="_question_name" value="ID proxy vars">
        <input type="hidden" name="_tracker" value="20">
        <input type="hidden" name="_datatypes" value="eyJlRnRwWFM1dVlXMWxMbVpwY25OMCI6ICJ0ZXh0In0">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJlRnRwWFM1dVlXMWxMbVpwY25OMCJ9">
    </form>
</div>`;


// ============================
// Signature
// ============================
// Signature pages need the sought var node in a particular `default screen parts`
// section or they will be missing on mobile devices/emulators
// It's complicated. This explains it a bit, but not enough:
// https://github.com/plocket/docassemble-ALAutomatedTestingTests/issues/119
html.signature = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="c2lnbmF0dXJlXzE" id="trigger" aria-hidden="true" style="display: none;"></div>
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
        <div id="dasigcontent" style="height: 218.4px;">
            <canvas id="dasigcanvas" width="546px" height="218.4px"></canvas>
        </div>
        <div class="dasigbottompart" id="dasigbottompart">

        </div>
        <fieldset class="da-button-set d-none d-sm-block da-signature">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <div class="dasigbuttons mt-3">
                <a href="#" role="button" class="btn btn-primary btn-da dasigsave">Continue</a>
                <a href="#" role="button" class="btn btn-warning btn-da dasigclear">Clear</a>
            </div>
        </fieldset>
    </div>
    <form aria-labelledby="dasigtitle" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="dasigform" method="POST">
        <input type="hidden" name="_save_as" value="c2lnbmF0dXJlXzE">
        <input type="hidden" id="da_sig_required" value="1">
        <input type="hidden" id="da_ajax" name="ajax" value="0">
        <input type="hidden" id="da_the_image" name="_the_image" value="">
        <input type="hidden" id="da_success" name="_success" value="0">
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5JYw.TjKi2VrM8zgaiChOLEfFcVXH_7c">
        <input type="hidden" name="_event" value="WyJzaWduYXR1cmVfMSJd">
        <input type="hidden" name="_question_name" value="ID first signature">
        <input type="hidden" name="_tracker" value="24">
    </form>
    <div class="d-block d-md-none">
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
    <div class="dasigpost">
        <div data-variable="c2lnbmF0dXJlXzE" id="trigger" aria-hidden="true" style="display: none;"></div>
    </div>
</div>`;


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
// ```
// field: favorite_fruit
// choices:
//   - Apple
//   - Orange
// ```
html.choices = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="ZmllbGRfYW5kX2Nob2ljZXM" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion"><code>field:</code> and <code>choices</code></h1>
            <div class="daclear"></div>
        </div>
        <fieldset class="da-field-radio">
            <legend class="visually-hidden">Choices:</legend>
            <div class="row">
                <div class="col-md-12">
                    <input aria-label="Choice 1" alt="Choice 1" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="ZmllbGRfYW5kX2Nob2ljZXM_0" name="ZmllbGRfYW5kX2Nob2ljZXM" type="radio" value="Choice 1" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="ZmllbGRfYW5kX2Nob2ljZXM_0" tabindex="0" role="radio" aria-checked="false" aria-label="Choice 1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">Choice 1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">Choice 1</span>
                    </label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input aria-label="Choice 2" alt="Choice 2" class="da-to-labelauty labelauty da-active-invisible dafullwidth" id="ZmllbGRfYW5kX2Nob2ljZXM_1" name="ZmllbGRfYW5kX2Nob2ljZXM" type="radio" value="Choice 2" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="ZmllbGRfYW5kX2Nob2ljZXM_1" tabindex="0" role="radio" aria-checked="false" aria-label="Choice 2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg><!-- <i class="far fa-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">Choice 2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check-circle fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg><!-- <i class="fas fa-check-circle fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">Choice 2</span>
                    </label>
                </div>
            </div>
            <div id="daerrorcontainer" style="display:none"></div>
        </fieldset>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-da btn-primary" type="submit">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5QAg.SCJdmS-cpk2MUs3c-25uFHInpHM">
        <input type="hidden" name="_event" value="WyJmaWVsZF9hbmRfY2hvaWNlcyJd">
        <input type="hidden" name="_question_name" value="ID field and choices">
        <input type="hidden" name="_tracker" value="1">
        <input type="hidden" name="_visible" value="">
    </form>
</div>`;


// ============================
// dropdowns created with objects
// ============================
// ```
// - Something: some_var
//   datatype: object
//   choices:
//     - obj1
//     - obj2
// ```
html.object_dropdown = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="b2JqZWN0X2Ryb3Bkb3du" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Object dropdown</h1>
            <div class="daclear"></div>
        </div>
        <div class="da-form-group row darequired da-field-container da-field-container-datatype-object da-field-container-inputtype-dropdown">
            <label for="b2JqZWN0X2Ryb3Bkb3du" class="col-md-4 col-form-label da-form-label datext-right">Object dropdown</label>
            <div class="col-md-8 dafieldpart">
                <p class="visually-hidden">Select box</p>
                <select class="form-select dasingleselect daobject" name="b2JqZWN0X2Ryb3Bkb3du" id="b2JqZWN0X2Ryb3Bkb3du">
                    <option value="">Select...</option>
                    <option value="b2JqX29wdF8x">obj opt 1</option>
                    <option value="b2JqX29wdF8y">obj opt 2</option>
                    <option value="b2JqX29wdF8z">obj opt 3</option>
                </select>
            </div>
        </div>
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-da btn-primary" type="submit">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5MdQ.qmGUG_q-cJeO-zySkNUJgaQIquQ">
        <input type="hidden" name="_event" value="WyJvYmplY3RfZHJvcGRvd24iXQ">
        <input type="hidden" name="_question_name" value="ID object dropdown">
        <input type="hidden" name="_tracker" value="2">
        <input type="hidden" name="_datatypes" value="eyJiMkpxWldOMFgyUnliM0JrYjNkdSI6ICJvYmplY3QifQ">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJiMkpxWldOMFgyUnliM0JrYjNkdSJ9">
    </form>
</div>`;


html.mixed_quotes = `
<div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
    <div data-variable="ZG91YmxlX3F1b3RlX2RpY3RbJ2RvdWJsZV9xdW90ZV9rZXknXQ" id="trigger" aria-hidden="true" style="display: none;"></div>
    <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" class="form-horizontal" method="POST" novalidate="novalidate">
        <div class="da-page-header">
            <h1 class="h3" id="daMainQuestion">Some complex fields</h1>
            <div class="daclear"></div>
        </div>
        <div class="da-form-group row da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes">
            <label class="col-md-4 col-form-label da-form-label datext-right">Singly quoted key</label>
            <div class="col-md-8 dafieldpart">
                <fieldset class="da-field-checkboxes" role="group">
                    <legend class="visually-hidden">Checkboxes:</legend>
                    <input aria-label="1" alt="1" class="dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_0" name="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZiMjVsJ10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">1</span>
                    </label>
                    <input aria-label="2" alt="2" class="dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_1" name="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZkSGR2J10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">2</span>
                    </label>
                    <input aria-label="3" alt="3" class="dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_2" name="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZkR2h5WldVJ10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">3</span>
                    </label>
                    <input aria-label="None of the above" alt="None of the above" class="dafield0 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore0" aria-hidden="true" id="labelauty-647679"
                    style="display: none;">
                    <label class="form-label btn-light" for="labelauty-647679" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">None of the above</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <div class="da-form-group row da-field-container da-field-container-datatype-checkboxes da-field-container-inputtype-checkboxes">
            <label class="col-md-4 col-form-label da-form-label datext-right">Doubly quoted key</label>
            <div class="col-md-8 dafieldpart">
                <fieldset class="da-field-checkboxes" role="group">
                    <legend class="visually-hidden">Checkboxes:</legend>
                    <input aria-label="1" alt="1" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_0" name="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZiMjVsJ10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_0" tabindex="0" role="checkbox" aria-checked="false" aria-label="1"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">1</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">1</span>
                    </label>
                    <input aria-label="2" alt="2" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_1" name="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZkSGR2J10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_1" tabindex="0" role="checkbox" aria-checked="false" aria-label="2"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">2</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">2</span>
                    </label>
                    <input aria-label="3" alt="3" class="dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" id="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_2" name="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZkR2h5WldVJ10"
                    type="checkbox" value="True" aria-hidden="true" style="display: none;">
                    <label class="form-label btn-light" for="ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_2" tabindex="0" role="checkbox" aria-checked="false" aria-label="3"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">3</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">3</span>
                    </label>
                    <input aria-label="None of the above" alt="None of the above" class="dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth" type="checkbox" name="_ignore1" aria-hidden="true" id="labelauty-382460"
                    style="display: none;">
                    <label class="form-label btn-light" for="labelauty-382460" tabindex="0" role="checkbox" aria-checked="false" aria-label="None of the above"><span class="labelauty-unchecked-image text-muted"><svg class="svg-inline--fa fa-square fa-w-14 fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg><!-- <i class="far fa-square fa-fw"></i> Font Awesome fontawesome.com --></span>
                        <span
                        class="labelauty-unchecked">None of the above</span><span class="labelauty-checked-image"><svg class="svg-inline--fa fa-check fa-w-16 fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg><!-- <i class="fas fa-check fa-fw"></i> Font Awesome fontawesome.com --></span>
                            <span
                            class="labelauty-checked">None of the above</span>
                    </label>
                </fieldset>
            </div>
        </div>
        <input type="hidden" name="_checkboxes" value="eyJjMmx1WjJ4bFgzRjFiM1JsWDJScFkzUmJKM05wYm1kc1pWOXhkVzkwWlY5clpYa25YVnRDSjJNelJtWmlNalZzSjEwIjogIkZhbHNlIiwgImMybHVaMnhsWDNGMWIzUmxYMlJwWTNSYkozTnBibWRzWlY5eGRXOTBaVjlyWlhrblhWdENKMk16Um1aa1NHUjJKMTAiOiAiRmFsc2UiLCAiYzJsdVoyeGxYM0YxYjNSbFgyUnBZM1JiSjNOcGJtZHNaVjl4ZFc5MFpWOXJaWGtuWFZ0Q0oyTXpSbVprUjJoNVdsZFZKMTAiOiAiRmFsc2UiLCAiWkc5MVlteGxYM0YxYjNSbFgyUnBZM1JiSW1SdmRXSnNaVjl4ZFc5MFpWOXJaWGtpWFZ0Q0oxcElSbVppTWpWc0oxMCI6ICJGYWxzZSIsICJaRzkxWW14bFgzRjFiM1JsWDJScFkzUmJJbVJ2ZFdKc1pWOXhkVzkwWlY5clpYa2lYVnRDSjFwSVJtWmtTR1IySjEwIjogIkZhbHNlIiwgIlpHOTFZbXhsWDNGMWIzUmxYMlJwWTNSYkltUnZkV0pzWlY5eGRXOTBaVjlyWlhraVhWdENKMXBJUm1aa1IyaDVXbGRWSjEwIjogIkZhbHNlIn0">
        <fieldset class="da-button-set da-field-buttons">
            <legend class="visually-hidden">Press one of the following buttons:</legend>
            <button class="btn btn-da btn-primary" type="submit">Continue</button>
        </fieldset>
        <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YaI9GQ.FV-3E3wNClsNK6F_lvJlxdVDxXY">
        <input type="hidden" name="_event" value="WyJkb3VibGVfcXVvdGVfZGljdFsnZG91YmxlX3F1b3RlX2tleSddIl0">
        <input type="hidden" name="_question_name" value="ID group of complex fields">
        <input type="hidden" name="_tracker" value="3">
        <input type="hidden" name="_datatypes" value="eyJjMmx1WjJ4bFgzRjFiM1JsWDJScFkzUmJKM05wYm1kc1pWOXhkVzkwWlY5clpYa25YUSI6ICJjaGVja2JveGVzIiwgIlpHOTFZbXhsWDNGMWIzUmxYMlJwWTNSYkltUnZkV0pzWlY5eGRXOTBaVjlyWlhraVhRIjogImNoZWNrYm94ZXMifQ">
        <input type="hidden" name="_visible" value="">
        <input type="hidden" name="_varnames" value="eyJYMlpwWld4a1h6QSI6ICJjMmx1WjJ4bFgzRjFiM1JsWDJScFkzUmJKM05wYm1kc1pWOXhkVzkwWlY5clpYa25YUSIsICJYMlpwWld4a1h6RSI6ICJaRzkxWW14bFgzRjFiM1JsWDJScFkzUmJJbVJ2ZFdKc1pWOXhkVzkwWlY5clpYa2lYUSJ9">
    </form>
</div>`;


// // ============================
// // `.there_is_another`
// // ============================
// html.there_is_another = `
// <div id="daquestion" aria-labelledby="dapagetitle" role="main" class="tab-pane fade show active offset-xl-3 offset-lg-3 col-xl-6 col-lg-6 offset-md-2 col-md-8">
//     <div data-variable="cHJveHlfbGlzdC50aGVyZV9pc19hbm90aGVy" id="trigger" aria-hidden="true" style="display: none;"></div>
//     <form aria-labelledby="daMainQuestion" action="/interview?i=docassemble.playground12ALTestingTestsNewDOM%3Aall_tests.yml" id="daform" method="POST" novalidate="novalidate">
//         <div class="da-page-header">
//             <h1 class="h3" id="daMainQuestion">Is there another proxy var?</h1>
//             <div class="daclear"></div>
//         </div>
//         <fieldset class="da-button-set da-field-yesno">
//             <legend class="visually-hidden">Press one of the following buttons:</legend>
//             <button class="btn btn-primary btn-da" name="eC50aGVyZV9pc19hbm90aGVy" type="submit" value="True">Yes</button>
//             <button class="btn btn-secondary btn-da" name="eC50aGVyZV9pc19hbm90aGVy" type="submit" value="False">No</button>
//         </fieldset>
//         <input type="hidden" name="csrf_token" value="IjdmYTE5MzE3ZjY5OTE0Y2MzMGQwYzVkNjJmZDViZjcyMDM4MDZmMWIi.YZ5KUQ.2ObHJubASqN4YqSlhzwDhdZxaoQ">
//         <input type="hidden" name="_event" value="WyJwcm94eV9saXN0LnRoZXJlX2lzX2Fub3RoZXIiXQ">
//         <input type="hidden" name="_question_name" value="ID is there another generic">
//         <input type="hidden" name="_tracker" value="19">
//         <input type="hidden" name="_datatypes" value="eyJlQzUwYUdWeVpWOXBjMTloYm05MGFHVnkiOiAiYm9vbGVhbiJ9">
//         <input type="hidden" name="_visible" value="">
//     </form>
// </div>`;


module.exports = html;
