<template>
	<div class="row q-mb-sm">
	<q-select
		outlined
		v-model="model"
		:options="options"
		:value="centralLocation"
		
		@input="$emit('update', model)"
		
		
		ref="centralLocation"
		label="Central Locations"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="centralLocation"
			@click="$emit('update:centralLocation', '')"
			name="close"
			class="cursor-pointer" />
	  </template>
	</q-select>
	</div>
</template>

<script>
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		data () {
			return {
			model: null,
			// uniqueCompany:'',
			options: [],
			// tmpCompany:'',
			tmp:''
			}
		},
		props: ['centralLocation', 'editCentralLocation'],
		directives: {
			selectAll
		},

	
		watch:{
			tmp(data){
				console.log("bb1", this.editCentralLocation)
				this.model= this.editCentralLocation      // put the selected option value on edit table
			}
		},
	
		mounted(){
			this.tmp=this.editCentralLocation
		console.log('centrallocation', this.centralLocation)
			this.options = this.centralLocation
			
		},
	
		

	}
</script>