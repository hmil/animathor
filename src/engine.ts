import { TarFile } from "./TarFile";


const WIDTH = 3840;
const HEIGHT = 2160;

let _ctx: CanvasRenderingContext2D;

let _fn: (ctx: CanvasRenderingContext2D, t: number) => void;

export function setCanvas(ctx: CanvasRenderingContext2D) {
    _ctx = ctx;
    runFunction(_fn);
}

export function setScript(script: string) {
    const compiled = new Function('ctx', 't', `with(ctx) { ${script} }`);
    runFunction(compiled as any);
    _fn = compiled as any;
}

let animationFrame: number | null = null;

let frame = 0;

export function togglePlayPause() {
    if (animationFrame) {
        stopAnimation();
    } else {
        animate();
    }
}

function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
}

function animate() {
    frame++;
    runFunction(_fn);
    animationFrame = requestAnimationFrame(animate);
}

function runFunction(fn: (ctx: CanvasRenderingContext2D, t: number) => void) {
    if (_ctx == null) {
        return;
    }
    _ctx.clearRect(0, 0, WIDTH, HEIGHT);
    _ctx.save();
    try {
        fn(_ctx, frame);
    } catch (e) {
        console.error(e);
    }
    _ctx.restore();
}

export async function renderVideo() {
    stopAnimation();

    if (_ctx == null) {
        throw new Error('Canvas is not set');
    }

    // const tarFile = new TarFile();


    const a = document.createElement('iframe');
    a.style.display = 'none';
    a.src = '/test';
    document.body.appendChild(a);

    for (frame = 0; frame < 30 ; frame++) {
        _ctx.clearRect(0, 0, WIDTH, HEIGHT);
        _ctx.save();
        _fn(_ctx, frame);
        _ctx.restore();
        const bitmap = await new Promise<Blob | null>((resolve) => _ctx.canvas.toBlob(resolve));
        await fetch('/postFrame?f=' + frame, {
            method: 'POST',
            body: await bitmap.arrayBuffer()
        });
        await fetch('/finishFrames');
        // tarFile.add(new Uint8Array(await bitmap.arrayBuffer()), `${frame.toString().padStart(6, '0')}.png`);
    }

    // download(tarFile.toBlob(), 'archive.tar');

    // const a = document.createElement('a');
    // a.style.display = 'none';
    // a.href = '/test';
    // document.body.append(a);
    // a.download = 'test';
    // a.click();
    // document.body.removeChild(a);
    // console.log(await (await fetch('/test')).text());


}

function download(data: Blob, name: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(data);
    document.body.append(a);
    a.download = name;
    a.click();
    document.body.removeChild(a);
}