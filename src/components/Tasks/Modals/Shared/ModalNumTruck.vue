<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="numtruck"
		@input="$emit('update:numtruck', $event)"
		:rules="[val => isValidPlateNum(val) || 'Field is allowed only numbers and letters.']"
		v-select-all
		ref="numtruck"
		label="Plate Number Truck"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="numtruck"
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
		props: ['numtruck'],
		directives: {
			selectAll
		},
		methods: {
			isValidPlateNum(val) {
				var re = /([a-zA-Z\-0-9])$/
		    return re.test(String(val).toLowerCase())
			},
		}
	}
</script>