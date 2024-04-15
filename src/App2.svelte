<script>
	import { resources } from './store.js'
	console.log($resources)
</script>

<section class="layer">
	<article class="content">
		<div class="inline-grid gap-2">
			{#each Object.entries($resources) as [slug, { name, total, action }]}
				<button class="btn" on:click={resources.click(slug)}
					>{action} {name} {total}</button>
			{/each}
		</div>
	</article>
</section>
