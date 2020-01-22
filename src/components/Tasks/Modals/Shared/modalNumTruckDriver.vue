<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="numtruckdriver"
		@input="$emit('update:numtruckdriver', $event)"
		:rules="[val => !!val || 'Field is required']"
		v-select-all
		ref="numtruckdriver"
		label="Number of Truck Driver"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="numtruckdriver"
			@click="$emit('update:numtruck', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['numtruckdriver'],
		directives: {
			selectAll
		}
	}
</script>