<!-- App.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import CodeEditor from "./CodeEditor.svelte";
	import { setCanvas } from "./engine";
	
	const WIDTH = 3840;
	const HEIGHT = 2160;
	
	let canvas: HTMLCanvasElement;
	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('No ctx');
		}

		setCanvas(ctx);
	});
</script>
<style>

.canvas {
	width: 100%;
}

.App {
	display: flex;
	flex-direction: column;
	height: 100%;
}

</style>
<div class="App">

	<canvas class="canvas" width={WIDTH} height={HEIGHT} bind:this={canvas}></canvas>
	<CodeEditor />
</div>
	