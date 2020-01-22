<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="surname"
		@input="$emit('update:surname', $event)"
		:rules="[val => !!val || 'Field is required']"
		v-select-all
		ref="surname"
		label="Surname"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="surname"
			@click="$emit('update:surname', '')"
			surname="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['surname'],
		directives: {
			selectAll
		}
	}
</script>