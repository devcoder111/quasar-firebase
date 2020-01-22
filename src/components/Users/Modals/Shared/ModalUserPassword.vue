<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="password"
		type="password"
		@input="$emit('update:password', $event)"
		:rules="[val => !!val || 'Field is required']"
		v-select-all
		ref="password"
		label="User Password"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="password"
			@click="$emit('update:password', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['password'],
		directives: {
			selectAll
		}
	}
</script>