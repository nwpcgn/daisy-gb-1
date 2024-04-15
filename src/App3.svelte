<script>
	import { sleep } from './lib'
	import { onMount } from 'svelte'
	let frameEl
	let isEl1
	let isEl2
	let shipEl
	let shipX = 20
	let shipY = 20
	let shipA = 0
	let stepSize = 64
	let offsetY = 0
	let currIsland = ''
	let act = {
		island1: false,
		island2: false
	}
	let isArr = []
	let island = {
		width: 256,
		height: 192,
		left: 0,
		top: 0
	}

	function onKeyDown(e) {
		switch (e.keyCode) {
			case 38:
				shipY -= stepSize
				shipA = 180
				check()
				break
			case 40:
				shipY += stepSize
				shipA = 0
				check()
				break
			case 37:
				shipX -= stepSize
				shipA = 90
				check()
				break
			case 39:
				shipX += stepSize
				shipA = 270
				check()
				break
		}
	}

	function checkParent() {
		const shipRec = shipEl.getBoundingClientRect()
		const frameRec = frameEl.getBoundingClientRect()
		let errors = []
		if (shipRec.top < frameRec.top) {
			errors.push('top')
			shipY = 0
		}
		if (shipX < 0) {
			errors.push('left')
			shipX = 0
		}
		if (shipY > frameRec.height - shipRec.height) {
			errors.push('bottom')
			shipY = frameRec.height - shipRec.height
		}
		if (shipX > frameRec.width - shipRec.width) {
			errors.push('right')
			shipX = frameRec.width - shipRec.width
		}
		if (errors.length) console.log('OUTSIDE', errors)
	}

	function checkCollide(element) {
		const rect1 = shipEl.getBoundingClientRect()
		const rect2 = element.getBoundingClientRect()

		let collide = !(
			rect1.right < rect2.left ||
			rect1.left > rect2.right ||
			rect1.bottom < rect2.top ||
			rect1.top > rect2.bottom
		)

		if (collide) {
			console.log({ collide, with: element.id })
			// element.classList.add('active')
			act[element.id] = true
			shipX = rect2.left - 50
			shipY = rect2.top - offsetY
			shipA = 0
		} else {
			// element.classList.remove('active')
			act[element.id] = false
		}
	}

	async function check() {
		await sleep(380)
		checkParent()
		checkCollide(isEl1)
		checkCollide(isEl2)
	}

	onMount(() => {
		console.log('HI')
		offsetY = frameEl.getBoundingClientRect().top
		isArr = document.querySelectorAll('.island1')
		console.log({ offsetY })
	})
</script>

<section class="absolute inset-0 overflow-hidden ocean" bind:this={frameEl}>
	<article
		bind:this={isEl1}
		id="island1"
		class="island1"
		class:active={act.island1}
		style="right: 8vw; bottom: 3vh;">
		{#if act.island1}
			<section class="layer nwp center bg-black bg-opacity-30 rounded-box">
				<ul class="menu bg-base-200 rounded-box">
					<li><a>Item 1</a></li>
					<li><a>Item 2</a></li>
					<li><a>Item 3</a></li>
				</ul>
			</section>
		{/if}
		<span class="sr-only">Island 1</span>
	</article>
	<article
		bind:this={isEl2}
		id="island2"
		class="island1"
		class:active={act.island2}
		style="right: 4vw; top: 2vh;">
		{#if act.island2}
			<section class="layer nwp center bg-black bg-opacity-50 rounded-box">
				<ul class="menu bg-base-200 rounded-box">
					<li><a>Item 1</a></li>
					<li><a>Item 2</a></li>
					<li><a>Item 3</a></li>
				</ul>
			</section>
		{/if}
		<span class="sr-only">Island 1</span>
	</article>
	<div
		bind:this={shipEl}
		style="left: {shipX}px; top: {shipY}px; --rot: {shipA}deg;" />
</section>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<style>
	div {
		width: 64px;
		height: 64px;
		background-color: rgba(0, 21, 128, 0.344);
		position: absolute;
		transition: all 0.3s ease;
		background-image: url('https://nwp-cgn.de/studio/upload/kat13/server/php/files/sails2.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		border-radius: 100%;
		transform: rotate(var(--rot, 90deg));
	}
	.island1 {
		position: absolute;
		width: 256px;
		height: 192px;
		background-image: url('/img/island1.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.island1 {
		@apply transition-transform duration-200 ease-in;
	}
	.island1.active {
		@apply transform scale-110;
	}
</style>
