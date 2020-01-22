<template>
	<div class="row q-mb-sm">
 

	<q-input  outlined label="Due date" :value="formattedDate" v-model="date2" >
        <template v-slot:append>
		<q-icon
        	
        	@click="$emit('clear')"
        	name="close"
        	class="cursor-pointer" />
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date mask="DD.MM.YYYY" v-model="date1" @input="$emit('update', date1)" ></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
  
	
	</div>
</template>

<script>
import { date } from 'quasar'

import { Quasar } from 'quasar'

	export default {
		props: ['dueDate'],
		data () {
			return {
			date1: '',
			date2: '',
			tmp:''
			}
		},
		mounted(){
			// this.date=this.dueDate
			let today = new Date()
				console.log('dueedit', this.dueDate)
							
			if(this.dueDate == "" || this.dueDate == null) {
				this.tmp = date.formatDate(today, 'DD.MM.YYYY')
			}
			else {
				tihs.tmp = this.dueDate
			}
		},
		computed: {
			formattedDate(){
				// this.date1=date.formatDate(this.date1, 'MM.DD.YYYY')
				this.date2 = date.formatDate(this.date1, 'DD.MM.YYYY')
				return date.formatDate(this.date1, 'DD.MM.YYYY')
			}
		
		},
		watch:{
			tmp(data){
				this.date2 = data
				console.log("date2", data)
				// this.date1 = date.formatDate(data, 'MM.DD.YYYY')

			},
			dueDate(data){
				console.log('editdate', data)
				if(data != "" && data != null) {
					this.tmp = data
				}
				

			}
    	},

	}
</script>