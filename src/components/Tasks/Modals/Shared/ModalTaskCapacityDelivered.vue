<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="capacityDelivered"
		@input="$emit('update:capacityDelivered', $event)"
		:rules="[val => !!val || 'Field is required']"
		
		v-select-all
		ref="capacityDelivered"
		label="Capacity Delivered"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="capacityDelivered"
			@click="$emit('update:capacityDelivered', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['capacityDelivered'],
		directives: {
			selectAll
		}
	}
</script>