<template>
	<div class="row q-mb-sm">
	<q-input
		outlined
		:value="email"
		type=email
		@input="$emit('update:email', $event)"
		:rules="[val => !!val || 'Field is required']"
		v-select-all
		:disable="foredit"
		ref="email"
		label="User email"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="email"
			@click="$emit('update:email', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-input>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['email', 'foredit'],
		directives: {
			selectAll
		},
		data () {
			return {
			
			}
		}

	}
</script>