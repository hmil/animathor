<script lang="ts">
    import * as monaco from 'monaco-editor';
    import { onMount } from 'svelte';
    import { setScript, togglePlayPause, renderVideo } from './engine';

    
    let editorDiv: HTMLDivElement;

    let code = localStorage.getItem('code') ?? `
const WIDTH = 1920;
const HEIGHT = 1080;
const LW = 1/HEIGHT;
ctx.save();
ctx.translate((WIDTH - HEIGHT * 0.9)/2, 0.05 * HEIGHT);
ctx.scale(HEIGHT * 0.9, HEIGHT * 0.9);
ctx.scale(0.5, 0.5);
ctx.translate(1, 1);

ctx.beginPath();
ctx.moveTo(-1, 0);
ctx.lineTo(1, 0);
ctx.moveTo(0, -1);
ctx.lineTo(0, 1);
ctx.lineWidth = LW;
ctx.stroke();

ctx.restore();

ctx.save();
ctx.translate(-20, 0.05 * HEIGHT);
// ctx.font = '0.1px sans-serif'
ctx.font = '20px sans-serif';
ctx.fillText('-1;0', (WIDTH - HEIGHT * 0.9) / 2, HEIGHT * 0.9 /2)
ctx.fillText('1;0', WIDTH - (WIDTH - HEIGHT * 0.9) / 2, HEIGHT* 0.9/2)
ctx.fillText('0;-1', WIDTH / 2, 0)
ctx.fillText('0;1', WIDTH / 2, HEIGHT* 0.9);
ctx.restore();`;

    const extraLib = `
declare const ctx: CanvasRenderingContext2D;
declare const t: number;
${Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype).map((prop) => `
    declare let ${prop}: CanvasRenderingContext2D["${prop}"];
`).join('')}
    `;
console.log(extraLib);
    let editor: monaco.editor.IStandaloneCodeEditor;

    onMount(async () => {
        console.log('mounting');
        editor = monaco.editor.create(editorDiv, {
            value: code,
            language: 'typescript',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,

        });
        monaco.languages.typescript.typescriptDefaults.addExtraLib(extraLib);

        setScript(editor.getValue());
    });


    function onKeyDown(evt: KeyboardEvent) {
        if (evt.ctrlKey === true || evt.metaKey === true) {
            switch (evt.key) {
                case 's':
                    localStorage.setItem('code', editor.getValue());
                    setScript(editor.getValue());
                    evt.preventDefault();
                    evt.stopPropagation();
                    break;
                case 'p':
                    togglePlayPause();
                    evt.preventDefault();
                    evt.stopPropagation();
                    break;
                case 'b':
                    renderVideo();
                    evt.preventDefault();
                    evt.stopPropagation();
                    break;
            }
        }
    }
</script>

<style>
    .editor {
        height: 100%;
    }
</style>

<svelte:window on:keydown={onKeyDown}></svelte:window>
<div class="editor" bind:this={editorDiv}></div>