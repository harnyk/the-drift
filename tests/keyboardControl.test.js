const assert = require('assert');
const { KeyboardControl, KeyCodeWASD } = require('./dist/KeyboardControl');

function press(ctrl, code) {
    ctrl.keyDownListener({ code });
}

function release(ctrl, code) {
    ctrl.keyUpListener({ code });
}

function collect(ctrl) {
    const events = [];
    ctrl.subscribe(e => events.push(e));
    return events;
}

function testVertical() {
    const ctrl = new KeyboardControl(KeyCodeWASD);
    const events = collect(ctrl);
    press(ctrl, KeyCodeWASD.Up);
    press(ctrl, KeyCodeWASD.Down);
    release(ctrl, KeyCodeWASD.Up);
    release(ctrl, KeyCodeWASD.Down);
    assert.deepStrictEqual(events, [
        { type: 'vertical', value: 1 },
        { type: 'vertical', value: 0 },
        { type: 'vertical', value: -1 },
        { type: 'vertical', value: 0 },
    ]);
}

function testHorizontal() {
    const ctrl = new KeyboardControl(KeyCodeWASD);
    const events = collect(ctrl);
    press(ctrl, KeyCodeWASD.Left);
    press(ctrl, KeyCodeWASD.Right);
    release(ctrl, KeyCodeWASD.Left);
    release(ctrl, KeyCodeWASD.Right);
    assert.deepStrictEqual(events, [
        { type: 'horizontal', value: -1 },
        { type: 'horizontal', value: 0 },
        { type: 'horizontal', value: 1 },
        { type: 'horizontal', value: 0 },
    ]);
}

try {
    testVertical();
    testHorizontal();
    console.log('Tests passed');
} catch (err) {
    console.error('Tests failed');
    console.error(err);
    process.exit(1);
}
