import { Matrix3 } from '../Matrix3';

function expectMatrixClose(actual: Matrix3, expected: Matrix3, precision = 5) {
  actual.values.forEach((v, i) => {
    expect(v).toBeCloseTo(expected.values[i], precision);
  });
}

describe('Matrix3.invert', () => {
  it('inverts a matrix and yields identity when multiplied', () => {
    const m = Matrix3.translation(2, 3)
      .multiply(Matrix3.rotation(Math.PI / 6))
      .multiply(Matrix3.scale(2, 4));
    const inv = m.invert();
    const result = m.multiply(inv);
    expectMatrixClose(result, Matrix3.identity());
  });

  it('throws on non invertible matrix', () => {
    const m = Matrix3.scale(0, 1);
    expect(() => m.invert()).toThrow('Matrix not invertible');
  });
});
