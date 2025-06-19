import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { RigidBody2D } from '../../engine/physics/RigidBody2D';
import { Vec2D } from '../../engine/vec/Vec2D';
import { Context } from '../../engine/Context';
import { Node } from '../../engine/Node';

export class TerroristEyesRenderable extends Node implements Renderable {
    static readonly polygonSides = 5;
    static readonly polygonRadius = 2.8;
    static readonly eyeSpacing = 1;
    static readonly openDistanceThreshold = 10;
    static readonly eyeRadius = 0.3;
    static readonly eyePairOffset = 0.6;
    static readonly eyePairNormalOffset = 0.2;
    static readonly eyeOpenMin = 0.01;
    static readonly eyeOpenMax = 2.0;
    static readonly eyeColor = '#700';
    static readonly pupilColor = '#300';

    public readonly targetPosition = new Vec2D();

    constructor(
        private readonly context: Context,
        private readonly terroristBody: RigidBody2D
    ) {
        super();
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const tPos = this.terroristBody.position;
        const tAngle = this.terroristBody.angle;
        const rPos = this.targetPosition;

        this.context.vectorPool.borrow((acquire) => {
            const v0 = acquire();
            const v1 = acquire();
            const mid = acquire();
            const tangent = acquire();
            const normal = acquire();
            const eye1 = acquire();
            const eye2 = acquire();

            const sides = TerroristEyesRenderable.polygonSides;
            const angleStep = (2 * Math.PI) / sides;
            const radius = TerroristEyesRenderable.polygonRadius;

            let closestIndex = -1;
            let minDistSq = Infinity;

            for (let i = 0; i < sides; i++) {
                const a0 = i * angleStep;
                const a1 = ((i + 1) % sides) * angleStep;

                const p0 = acquire();
                const p1 = acquire();
                const m = acquire();

                p0.assignPolar(radius, a0);
                p1.assignPolar(radius, a1);

                p0.rotate(tAngle);
                p1.rotate(tAngle);
                p0.add(tPos);
                p1.add(tPos);

                m.set((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

                const dx = m.x - rPos.x;
                const dy = m.y - rPos.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < minDistSq) {
                    minDistSq = distSq;
                    closestIndex = i;
                }
            }

            const thresholdSq =
                TerroristEyesRenderable.openDistanceThreshold ** 2;

            for (let i = 0; i < sides; i++) {
                const a0 = i * angleStep;
                const a1 = ((i + 1) % sides) * angleStep;

                v0.assignPolar(radius, a0);
                v1.assignPolar(radius, a1);

                v0.rotate(tAngle);
                v1.rotate(tAngle);
                v0.add(tPos);
                v1.add(tPos);

                mid.set((v0.x + v1.x) / 2, (v0.y + v1.y) / 2);

                tangent.set(v1.x - v0.x, v1.y - v0.y);
                tangent.normalize();

                // Shift mid outward along the normal to the side
                normal.set(-tangent.y, tangent.x);
                mid.x += normal.x * TerroristEyesRenderable.eyePairNormalOffset;
                mid.y += normal.y * TerroristEyesRenderable.eyePairNormalOffset;

                const pairOffset = TerroristEyesRenderable.eyePairOffset;
                eye1.set(
                    mid.x - tangent.x * pairOffset,
                    mid.y - tangent.y * pairOffset
                );
                eye2.set(
                    mid.x + tangent.x * pairOffset,
                    mid.y + tangent.y * pairOffset
                );

                const isClosest = i === closestIndex;
                const open = isClosest && minDistSq < thresholdSq;

                ctx.save();
                viewport.inWorldCoordinates(ctx, () => {
                    this.#renderEye(ctx, eye1, open, tangent);
                    this.#renderEye(ctx, eye2, open, tangent);
                });
                ctx.restore();
            }
        });
    }

    #renderEye(
        ctx: CanvasRenderingContext2D,
        pos: Vec2D,
        open: boolean,
        tangent: Vec2D
    ) {
        const r = TerroristEyesRenderable.eyeRadius;

        if (!open) {
            const dx = tangent.x * r;
            const dy = tangent.y * r;
            ctx.beginPath();
            ctx.moveTo(pos.x - dx, pos.y - dy);
            ctx.lineTo(pos.x + dx, pos.y + dy);
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 0.05;
            ctx.stroke();
            return;
        }

        const dx = pos.x - this.targetPosition.x;
        const dy = pos.y - this.targetPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = TerroristEyesRenderable.openDistanceThreshold;
        const minDist = 2;
        const t = Math.max(
            0,
            Math.min(1, (maxDist - dist) / (maxDist - minDist))
        );
        const eyeOpen =
            TerroristEyesRenderable.eyeOpenMin +
            t *
                (TerroristEyesRenderable.eyeOpenMax -
                    TerroristEyesRenderable.eyeOpenMin);

        this.context.vectorPool.borrow((acquire) => {
            const left = acquire();
            const right = acquire();
            const normal = acquire();

            normal.set(-tangent.y, tangent.x);
            tangent.normalize();

            left.set(pos.x - tangent.x * r, pos.y - tangent.y * r);
            right.set(pos.x + tangent.x * r, pos.y + tangent.y * r);

            const upperCtrl = acquire();
            upperCtrl.set(
                pos.x + normal.x * r * eyeOpen,
                pos.y + normal.y * r * eyeOpen
            );

            const lowerCtrl = acquire();
            lowerCtrl.set(
                pos.x - normal.x * r * eyeOpen,
                pos.y - normal.y * r * eyeOpen
            );

            // Eye opening shape
            ctx.save();

            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.quadraticCurveTo(upperCtrl.x, upperCtrl.y, right.x, right.y);
            ctx.quadraticCurveTo(lowerCtrl.x, lowerCtrl.y, left.x, left.y);
            ctx.closePath();

            // Eye filling
            ctx.fillStyle = TerroristEyesRenderable.eyeColor;
            ctx.fill();

            // Clipping for the pupil and future elements (eyelid, liquid, etc.)
            ctx.clip();

            // Pupil
            const dir = acquire();
            dir.set(
                this.targetPosition.x - pos.x,
                this.targetPosition.y - pos.y
            );
            dir.normalize();

            const pupilOffset = r * 0.2 * eyeOpen;
            const pupilX = pos.x + dir.x * pupilOffset;
            const pupilY = pos.y + dir.y * pupilOffset;

            ctx.beginPath();
            ctx.arc(pupilX, pupilY, r * 0.3, 0, 2 * Math.PI);
            ctx.fillStyle = TerroristEyesRenderable.pupilColor;
            ctx.fill();

            // TODO: third eyelid will appear here, inside clip()

            ctx.restore();
        });
    }
}

