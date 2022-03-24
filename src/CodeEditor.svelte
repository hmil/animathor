<script lang="ts">
    import * as monaco from 'monaco-editor';
    import { onMount } from 'svelte';
import { runScript, togglePlayPause } from './engine';

    
    let editorDiv: HTMLDivElement;

    let code = localStorage.getItem('code') ?? `function x() {
    console.log("Hello world!");
}`;

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

        runScript(editor.getValue());
    });


    function onKeyDown(evt: KeyboardEvent) {
        if (evt.ctrlKey === true) {
            switch (evt.key) {
                case 's':
                    localStorage.setItem('code', editor.getValue());
                    runScript(editor.getValue());
                    evt.preventDefault();
                    evt.stopPropagation();
                    break;
                case 'p':
                    togglePlayPause();
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