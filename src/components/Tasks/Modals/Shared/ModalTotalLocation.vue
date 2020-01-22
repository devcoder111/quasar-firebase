<template>
	<div class="row q-mb-sm">
	<q-select
		outlined
		v-model="model"
		:options="options"
		:value="totalLocation"
		
		@input="$emit('update', model)"
		
		
		ref="totalLocation"
		label="Total Locations"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="totalLocation"
			@click="$emit('update:totalLocation', '')"
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
		props: ['totalLocation', 'editTotalLocation'],
		directives: {
			selectAll
		},

	
		watch:{
			tmp(data){
				console.log("bb1", this.editTotalLocation)
				this.model= this.editTotalLocation      // put the selected option value on edit table
			}
		},
	
		mounted(){
			this.tmp=this.editTotalLocation
		console.log('totalLocation', this.totalLocation)
			this.options = this.totalLocation
			
		},
	
		

	}
</script>