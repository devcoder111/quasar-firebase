<template>
	<div class="row q-mb-sm">
	<q-select
		outlined
		v-model="model"
		:options="options"
		:value="compName"
		
		@input="$emit('update', model)"
		:rules="[val => !!val || 'Field is required']"
		
		ref="compName"
		label="Dispatcher Company"
		class="col">
			<template v-slot:append>
		<q-icon
			v-if="compName"
			@click="$emit('update:compName', '')"
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
			uniqueCompany:'',
			options: [],
			tmpCompany:'',
			tmp:''
			}
		},
		props: ['compName', 'editCompName'],
		directives: {
			selectAll
		},

	
		watch:{
			tmp(data){
				console.log("aa1", this.editCompName)
				this.model= this.editCompName      // put the selected option value on edit table
			}
		},
	
		mounted(){
			
			this.tmp=this.editCompName
			
			let companyName	=[]
			
			console.log("compname", Object.values(this.compName))
			this.tmpCompany = Object.values(this.compName)
			for(let i=0; i < this.tmpCompany.length; i++){
				if(companyName.indexOf(this.tmpCompany[i]) === -1) {
					companyName.push(this.tmpCompany[i]);
				}
			}
			this.uniqueCompany=Object.values(companyName)
			this.options=this.uniqueCompany
		
		},
	
		

	}
</script>