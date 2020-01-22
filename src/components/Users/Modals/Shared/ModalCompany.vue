<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="company"
		@input="$emit('update:company', $event)"
		:rules="[val => !!val || 'Field is required']"
		v-select-all
		ref="company"
		label="User company"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="company"
			@click="$emit('update:company', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['company'],
		directives: {
			selectAll
		}
	}
</script>