<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="capacityLoaded"
		@input="$emit('update:capacityLoaded', $event)"
		:rules="[val => !!val || 'Field is required']"
		
		v-select-all
		ref="capacityLoaded"
		label="Capacity Loaded"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="capacityLoaded"
			@click="$emit('update:capacityLoaded', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['capacityLoaded'],
		directives: {
			selectAll
		}
	}
</script>