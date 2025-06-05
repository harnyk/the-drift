import { Vec2D } from '../vec/Vec2D';
import { BodyType } from './CollisionDetector';


export abstract class CollisionBody {
    position: Vec2D;
    angle: number;
    type: BodyType;

    constructor(position: Vec2D, angle = 0, type: BodyType = 'dynamic') {
        this.position = position;
        this.angle = angle;
        this.type = type;
    }

    abstract getVertices(): Vec2D[];

    getAxes(): Vec2D[] {
        const verts = this.getVertices();
        const axes: Vec2D[] = [];
        for (let i = 0; i < verts.length; i++) {
            const p1 = verts[i];
            const p2 = verts[(i + 1) % verts.length];
            const edge = p2.sub(p1);
            axes.push(new Vec2D(-edge.y, edge.x).normalize());
        }
        return axes;
    }
}
