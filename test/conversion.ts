// import {expect} from "chai";
import {ABAP} from "../packages/runtime/src/";
import {AsyncFunction, runFiles} from "./_utils";

let abap: ABAP;

async function run(contents: string) {
  return runFiles(abap, [{filename: "zfoobar.prog.abap", contents}]);
}

describe("Value conversions", () => {

  beforeEach(async () => {
    abap = new ABAP();
  });

  it("hex value conversion", async () => {
    const code = `
  DATA hex TYPE x.
  DATA integer TYPE i.
  hex = 'AA'.
  integer = hex.
  ASSERT integer = 170.`;

    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("character to string value conversion", async () => {
    const code = `
    DATA lv_char TYPE c LENGTH 5.
    DATA lv_str TYPE string.
    lv_char = ' '.
    lv_str = lv_char.
    ASSERT lv_str = ||.
    lv_char = 'a b  '.
    lv_str = lv_char.
    ASSERT lv_str = |a b|.
    lv_char = ' b'.
    lv_str = lv_char.
    ASSERT lv_str = | b|.`;

    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("character to string value conversion 2", async () => {
    const code = `
  DATA lv_str TYPE string.
  DATA lt_tab TYPE STANDARD TABLE OF string WITH DEFAULT KEY.
  APPEND ' ' TO lt_tab.
  READ TABLE lt_tab INDEX 1 INTO lv_str.
  ASSERT lv_str = ||.`;

    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("character to string value conversion 3", async () => {
    const code = `
    DATA lv_str TYPE string.
    lv_str = ' '.
    ASSERT lv_str = ||.
    lv_str = 'a b  '.
    ASSERT lv_str = |a b|.
    lv_str = ' b'.
    ASSERT lv_str = | b|.`;

    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

});