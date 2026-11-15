const { expect } = require('chai');
const scope = require('../../lib/scope');

describe('setCheckbox', function () {
  for (const initial of [false, true]) {
    for (const wanted of [false, true]) {
      it(`sets a checkbox without aria-checked from ${initial} to ${wanted}`, async function () {
        const input = { type: 'checkbox', checked: initial };
        const element = {
          control: input,
          getAttribute: () => null,
          click() { input.checked = !input.checked; },
        };
        const label = { evaluate: fn => fn(element) };
        await scope.setCheckbox(scope, { label, answer: String(wanted) });
        expect(input.checked).to.equal(wanted);
      });
    }
  }

  it('uses aria-checked when native checkbox state is unavailable', async function () {
    let checked = false;
    const element = {
      control: { type: 'checkbox', checked: undefined },
      getAttribute: () => String(checked),
      click() { checked = !checked; },
    };
    await scope.setCheckbox(scope, { label: { evaluate: fn => fn(element) }, answer: 'True' });
    expect(checked).to.equal(true);
  });
});
