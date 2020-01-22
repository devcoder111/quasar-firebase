<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="numtrailor"
		@input="$emit('update:numtrailor', $event)"
		:rules="[val => isValidPlateNum(val) || 'Field is allowed only numbers and letters.']"
		v-select-all
		ref="numtrailor"
		label="Plate Number Trailor"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="numtrailor"
			@click="$emit('update:numtrailor', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['numtrailor'],
		directives: {
			selectAll
		},
		methods:{
			isValidPlateNum(val) {
				var re = /([a-zA-Z\-0-9])$/
		    return re.test(String(val).toLowerCase())
			},
		}
	}
</script>