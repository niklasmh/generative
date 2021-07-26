import { getRefraction, rotateVectorAroundAxis, unitVector } from "./geometry";

function round(array) {
  return array.map((number) => {
    const rounded = Math.round(number * 1000) / 1000;
    if (rounded === -0) return 0;
    else return rounded;
  });
}

test("refraction along the normal", () => {
  expect(getRefraction(0, 0, 1, 0, 0, -1, 1.5)).toEqual([0, 0, 1]);
  expect(getRefraction(0, 0, -1, 0, 0, -1, 1.5)).toEqual([0, 0, -1]);
  expect(getRefraction(0, 1, 0, 0, 0, -1, 1.5)).toEqual([0, 1, 0]);
  expect(getRefraction(0, -1, 0, 0, 0, -1, 1.5)).toEqual([0, -1, 0]);
});

test("refraction 45deg towards the normal in glass (reflect)", () => {
  const y = Math.tan(Math.PI / 2);
  expect(round(getRefraction(0, y, 1, 0, 0, -1, 1.5))).toEqual(round(unitVector(0, y, -1)));
});

test("refraction 30deg towards the normal", () => {
  const y = Math.tan(Math.PI / 6);
  expect(round(getRefraction(0, y, 1, 0, 0, -1, 1))).toEqual(round(unitVector(0, y, 1)));
});

test("refraction 15deg towards the normal", () => {
  const y = Math.tan(Math.PI / 12);
  expect(round(getRefraction(0, y, 1, 0, 0, -1, 1))).toEqual(round(unitVector(0, y, 1)));
});

test("rotate vector along an axis", () => {
  expect(round(rotateVectorAroundAxis(1, 0, 0, 0, 0, 1, Math.PI))).toEqual([-1, 0, 0]);
  expect(round(rotateVectorAroundAxis(1, 0, 0, 0, 0, 1, Math.PI / 2))).toEqual([0, 1, 0]);
  expect(round(rotateVectorAroundAxis(0, 1, 0, 0, 0, 1, Math.PI / 2))).toEqual([-1, 0, 0]);
  expect(round(rotateVectorAroundAxis(0, 0, 1, 1, 1, 0, Math.PI))).toEqual([0, 0, -1]);
  expect(round(rotateVectorAroundAxis(1, 0, 1, 0, 1, 0, Math.PI / 2))).toEqual([1, 0, -1]);
  expect(round(rotateVectorAroundAxis(1, 0, 1, 0, -1, 0, -Math.PI / 2))).toEqual([1, 0, -1]);
  expect(round(rotateVectorAroundAxis(1, 1, 1, 0, 1, 0, Math.PI / 2))).toEqual([1, 1, -1]);
});
