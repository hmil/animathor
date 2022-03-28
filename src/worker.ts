console.log('worker');

export const foo = '';

self.addEventListener('install', (event: any) => {
    console.log('installed');
    (self as any).skipWaiting();
});
self.addEventListener('activate', (event: any) => {
    console.log('activated');
    (self as any).clients.claim();
});

const BUFFER_SIZE = 1024;

const min = 'a'.charCodeAt(0);
const max = 'z'.charCodeAt(0);

let lastFrame = -1;
self.addEventListener('fetch', (evt: any) => {
    console.log(evt.request);
    const request = evt.request as Request;
    const url = new URL(evt.request.url);

    let frames = [];
    let notify = () => {};
    let done = false;

    if (url.pathname === '/test') {
        let i = 0;
        const rs = new ReadableStream({
            start(controller) {
            },
            async pull(controller) {
                // if (i++ > 10) {
                //     controller.close();
                //     return;
                // }
                // const bytes = new Uint8Array(BUFFER_SIZE);
                // for (let i = 0 ; i < BUFFER_SIZE ; i++) {
                //     bytes[i] = Math.floor(Math.random() * (max - min) + min);
                // }
                // let string = (Math.random() * 0x1000000).toString(16);

                if (frames.length === 0) {
                    if (done) {
                        controller.close();
                        return;
                    } else {
                        await new Promise<void>(resolve => {notify = resolve});
                    }
                }
                if (frames.length === 0) {
                    throw new Error('No more data!');
                }
                controller.enqueue(frames.splice(0, 1)[0]);

                // controller.enqueue(bytes);
            },
            cancel() {
                // clearInterval(interval);
            }
        });
        evt.respondWith(new Response(rs, {
            headers: {
                'Content-Disposition': 'attachment',
                'Content-Type': 'text/plain'
            }
        }))
    } else if (url.pathname === '/postFrame') {
        const frame = Number(url.searchParams.get('frame'));
        if (frame != lastFrame + 1) {
            throw new Error('Invalid frame sequence!');
        }
        (async () => {
            const buff = await request.arrayBuffer();
            frames.push(buff);
            notify();
            evt.respondWith(new Response('OK'));
        })();
    } else if (url.pathname === '/finishFrames') {
        done = true;
        evt.respondWith(new Response('OK'));
    }
});
