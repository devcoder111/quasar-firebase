<template>
	<div class="row q-mb-sm">
	
	<q-select
		outlined
		v-model="role"
		:options="options"
		
		@input="$emit('update:role', $event)"
		:rules="[val => !!val || 'Field is required']"
		
		ref="role"
		label="User role"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="role"
			@click="$emit('update:role', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-select>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['role'],
		data () {
			return {
			model: {},
			options: [
				'Truckdriver', 'Admin', 'Dispatcher', 'Loader', 'Harbour Staff'
			]
			}
		},
	

		
		directives: {
			selectAll
		}
	}
</script>