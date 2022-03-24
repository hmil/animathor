<!-- App.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import CodeEditor from "./CodeEditor.svelte";
import { setCanvas } from "./engine";
	
	  const WIDTH = 3840;
	  const HEIGHT = 2160;
		
	  const LW = 1/HEIGHT;
	
	  let canvas: HTMLCanvasElement;
	  onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
		  throw new Error('No ctx');
		}
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
		ctx.restore();

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
	