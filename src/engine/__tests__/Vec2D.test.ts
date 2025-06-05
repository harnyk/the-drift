import { Vec2D } from '../vec/Vec2D';

describe('Vec2D.fromPolar', () => {
  it('creates vector at given length and angle', () => {
    const v = Vec2D.fromPolar(5, Math.PI / 4);
    const comp = 5 / Math.sqrt(2);
    expect(v.x).toBeCloseTo(comp);
    expect(v.y).toBeCloseTo(comp);
  });

  it('handles zero angle', () => {
    const v = Vec2D.fromPolar(3, 0);
    expect(v.x).toBeCloseTo(3);
    expect(v.y).toBeCloseTo(0);
  });
});
