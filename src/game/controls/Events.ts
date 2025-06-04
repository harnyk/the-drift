export interface ControlEventHorizontal {
    type: 'horizontal';
    value: number;
}

export interface ControlEventVertical {
    type: 'vertical';
    value: number;
}

export type ControlEvent = ControlEventHorizontal | ControlEventVertical;
