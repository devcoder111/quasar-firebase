<template>
	<q-page padding>
		
    <q-table
		title="Your Trips"
		:data="data"
		:columns="columns"
		row-key="name"
		selection="single"
		:selected.sync="selected"
		>
	
       <template v-slot:header="props">
         <q-tr :props="props">
           <q-th v-for="col in props.cols" :key="col.name" :props="props">
             {{ col.label }}
           </q-th>
         </q-tr>
        </template> 
       <template v-slot:body="props">
        <q-tr class="cursor-pointer" :props="props" @click.native = "tappedRow(props)" >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>

	</q-table>		
	<div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>	
	</q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapGetters, mapActions, mapState } from 'vuex'
import EventBus from './event-bus';
	export default {
		data() {
			return {
				plate:[],
				plateNum:[],
				selected: [],
				columns: [
				{
				name: 'plateNum',
				required: true,
				label: 'Plate Number',
				align: 'center',
				field: row => row.plateNum,
				format: val => `${val}`,
				sortable: true
				},
				
				{ name: 'carrier', align: 'center', label: 'Carrier', field: 'carrier', sortable: true },
				{ name: 'dueDate', align: 'center', label: 'DueDate', field: 'dueDate', sortable: true },
				{ name: 'dueTime', align: 'center', label: 'DueTime', field: 'dueTime', sortable: true },
			
			],
			data: [],
			}
		},
		mounted() {
			console.log("localstoragePlateNum", LocalStorage.getItem('plateNum'))
			this.plateNum = LocalStorage.getItem('plateNum')
			 const promise = new Promise((resolve, reject) => {
				if(this.getallTasks( LocalStorage.getItem('plateNum') ))
					 resolve()
				else{
					reject(Error('it broke'));
				}
			 });
			promise.then(result => {
				let plateTask = this.plateTask
				this.plate = this.plateTask
				console.log("plateTask1", plateTask)
				// this.data = Object.values(plateTask)
				let tempData = this.objectValues(plateTask)
				this.data = tempData
				console.log("plateTaskdata", tempData)
				
			}, err => {
				console.log(err);
			});
			// console.log("plateTask", this.plateTask)
		},
		created(){
			
			},
		watch:{
			
			plate(data){
				let tempData = this.objectValues(data)
				this.data = tempData
			}

		},
		methods: {
			...mapActions('settings', ['getallTasks']),
			tappedRow(data){
				console.log('tag', data)
				EventBus.$emit('plateTask', data.row);
				LocalStorage.set("plateData", data.row)
				this.$router.push('/driverCentralLocation')	
			},
			objectValues(obj) {
				let vals = [];
				for (const prop in obj) {
					console
					vals.push(obj[prop]);
				}
				return vals;
			}
			
		},
		computed: {
			...mapGetters('settings', ['plateTask']),
		},
	
	}
</script>