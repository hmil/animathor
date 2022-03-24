
const WIDTH = 3840;
const HEIGHT = 2160;

let _ctx: CanvasRenderingContext2D;

let _fn: (ctx: CanvasRenderingContext2D, t: number) => void;

export function setCanvas(ctx: CanvasRenderingContext2D) {
    _ctx = ctx;
}

export function runScript(script: string) {
    const compiled = new Function('ctx', 't', `with(ctx) { ${script} }`);
    runFunction(compiled as any);
    _fn = compiled as any;
}

let animationFrame: number | null = null;

let frame = 0;

export function togglePlayPause() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    } else {
        animate();
    }
}

function animate() {
    frame++;
    runFunction(_fn);
    animationFrame = requestAnimationFrame(animate);
}

function runFunction(fn: (ctx: CanvasRenderingContext2D, t: number) => void) {
    _ctx.clearRect(0, 0, WIDTH, HEIGHT);
    _ctx.save();
    try {
        fn(_ctx, frame);
    } catch (e) {
        console.error(e);
    }
    _ctx.restore();
}