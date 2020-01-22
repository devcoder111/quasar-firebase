<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="capacity"
		@input="$emit('update:capacity', $event)"
		:rules="[val => !!val || 'Field is required']"
		
		v-select-all
		ref="capacity"
		label="Capacity"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="capacity"
			@click="$emit('update:capacity', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['capacity'],
		directives: {
			selectAll
		}
	}
</script>