<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="carrier"
		@input="$emit('update:carrier', $event)"
		:rules="[val => !!val || 'Field is required']"
		
		v-select-all
		ref="carrier"
		label="Carrier"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="carrier"
			@click="$emit('update:carrier', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['carrier'],
		directives: {
			selectAll
		}
	}
</script>