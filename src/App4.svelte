<script>
	import { onMount } from 'svelte'
	import { sleep } from './lib'
	let map = {
		atlasCols: 23,
		cols: 8,
		rows: 8,
		tsize: 64,
		layers: [
			[
				242, 242, 243, 160, 160, 160, 241, 242, 242, 242, 243, 160, 160, 160,
				241, 242, 265, 265, 266, 160, 160, 160, 264, 265, 160, 160, 160, 160,
				160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160,
				160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160,
				160, 160, 160, 160, 160, 160, 160, 160
			],
			[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 23, 0,
				0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 23, 0, 0, 0
			],
			[
				112, 112, 89, 89, 89, 89, 89, 112, 112, 112, 89, 89, 89, 89, 89, 112,
				89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89,
				89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89,
				89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89
			]
		],
		getTile: function (layer, col, row) {
			return this.layers[layer][row * map.cols + col]
		}
	}

	let daten = {
		canvasW: 513,
		canvasH: 513,
		canvasId: 'canvas1',
		canvasArr: [[], []]
	}
	let canvasArr = [[], []]
	function drawLayer(layer) {
		let id = -1
		canvasArr[layer] = []
		for (let r = 0; r < map.rows; r++) {
			for (let c = 0; c < map.cols; c++) {
				id++
				const tile = map.getTile(layer, c, r)
				if (tile !== 0) {
					// 0 => empty tile
					const tileVal = tile - 1
					const sY = Math.floor(tileVal / map.atlasCols) * map.tsize
					const sX = (tileVal % map.atlasCols) * map.tsize
					const tX = c * map.tsize // target x
					const tY = r * map.tsize // target y
					const size = map.tsize
					// console.log({ id, layer, tileVal, sX, sY, tX, tY });
					canvasArr[layer].push({
						id,
						layer,
						tileVal,
						sX,
						sY,
						tX,
						tY,
						size
					})
					// this.ctx.drawImage(
					//   this.tileAtlas,
					//   sX,
					//   sY,
					//   map.tsize, // source width
					//   map.tsize, // source height
					//   tX, // c * map.tsize, // target x
					//   tY, // r * map.tsize, // target y
					//   map.tsize, // target width
					//   map.tsize // target height
					// );
				}
			}
		}
	}

	function handleClick(e) {
		let layer = parseInt(e.currentTarget.dataset.layer)
		let id = parseInt(e.currentTarget.dataset.id)
		canvasArr[layer] = canvasArr[layer].filter((x) => x.id !== id)
	}

	onMount(async () => {
		drawLayer(0)
		await sleep()
		drawLayer(1)
		await sleep()
		drawLayer(2)
		console.log(canvasArr)
	})
</script>

<section class="layer">
	<section class="absolute inset-0 grid place-content-center gap-4">
		<div
			id="canvas1"
			class="relative border border-blue-600"
			style="width: 513px; height: 513px;">
			{#each canvasArr as item}
				{#each item as data (data.id)}
					<button
						on:click={handleClick}
						data-layer={data.layer}
						data-id={data.id}
						class="tile"
						style="--sz: {data.size}px; --sx: -{data.sX}px; --sy: -{data.sY}px; --tx: {data.tX}px; --ty: {data.tY}px;">
						<span class="sr-only">{data.id}</span>
					</button>
				{/each}
			{/each}
		</div>
	</section>
</section>

<style>
	.tile {
		--sz: 64px;
		--sx: -64px;
		--sy: -64px;
		--tx: 0px;
		--ty: 0px;
		background-image: url('/img/towerDefense.png');
		background-repeat: no-repeat;
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(var(--tx), var(--ty));
		overflow: hidden;
	}

	.tile {
		width: var(--sz);
		height: var(--sz);
		background-position: var(--sx) var(--sy);
	}
</style>
