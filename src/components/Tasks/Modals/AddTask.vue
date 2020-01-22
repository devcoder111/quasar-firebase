<template>
	<q-card>
    
    <modal-header>Add Trip</modal-header>

		<form @submit.prevent="submitForm">
	    <q-card-section>
	    	
	    	<modal-task-name 
	    		:name.sync="taskToSubmit.name"
	    		ref="modalTaskName" />
			<modal-company-name v-if="userRole!='Dispatcher'"
				:compName.sync="getCompanies.companies"
				ref="modalCompanyName" v-on:update="setComName($event)"/>
			<modal-task-carrier 
	    		:carrier.sync="taskToSubmit.carrier"
	    		ref="modalTaskCarrier" />
			<modal-plate-num-truck 
	    		:numtruck.sync="taskToSubmit.numtruck"
	    		ref="modalPlateNumTruck" />
			<modal-plate-num-trailor 
	    		:numtrailor.sync="taskToSubmit.numtrailor"
	    		ref="modalPlateNumTrailor" />
			<modal-number-truck-driver 
	    		:numtruckdriver.sync="taskToSubmit.numtruckdriver"
	    		ref="modalNumTruckDriver" />

			<modal-due-date 
				:dueDate.sync="taskToSubmit.dueDate" v-on:update="setDueDate($event)"
				@clear="clearDueDate"/>

			<modal-due-time
				
				:dueTime.sync="taskToSubmit.dueTime"  v-on:update="setDueTime($event)"/>

			<modal-central-location v-if="userRole!='Dispatcher'"
				:centralLocation.sync="getLocations.locationNames"
				ref="modalCentralLocation" v-on:update="setCentralLocation($event)"/>

			<modal-total-location v-if="userRole!='Dispatcher'"
				:totalLocation.sync="getTotalLocations.locationNames"
				ref="modalTotalLocation" v-on:update="setTotalLocation($event)"/>

			<modal-task-capacity 
	    		:capacity.sync="taskToSubmit.capacity"
	    		ref="modalTaskCapacity" />
			<modal-task-capacityLoaded v-if="userRole=='Admin' || userRole=='Loader'"
	    		:capacityLoaded.sync="taskToSubmit.capacityLoaded"
	    		ref="modalTaskCapacityLoaded" />
			<modal-task-capacityDelivered v-if="userRole=='Admin' && userRole=='Harbour Staff'"
	    		:capacityDelivered.sync="taskToSubmit.capacityDelivered"
	    		ref="modalTaskCapacityDelivered" />
	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>

  </q-card>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex'
	import mixinAddEditTask from 'src/mixins/mixin-add-edit-task'
	import { date } from 'quasar'

	export default {
		mixins: [mixinAddEditTask],
		data() {
			
			return {
				taskToSubmit: {
					name: '',
					carrier:'',
					capacity:'',
					numtruck: '',
					numtrailor:'',
					numtruckdriver:'',
					compName:'',
					dueDate: '',
					dueTime: '',
					centralLocation:'',
					totalLocation:'',
					capacityLoaded:'',
					capacityDelivered:'',
					completed: false
				}
			}
		},
		methods: {
			...mapActions('tasks', ['addTask']),
			submitTask() {
				console.log("son tasktosubmit", this.taskToSubmit)
				this.addTask(this.taskToSubmit)
				this.$emit('close')
			},
			setComName: function(comName) {
				// this.name = v;
				this.taskToSubmit.compName = comName
			},
			setDueDate: function(dueDate){
				dueDate = date.formatDate(dueDate, 'DD.MM.YYYY')
				console.log('tag', dueDate)
				this.taskToSubmit.dueDate = dueDate
			},
			setDueTime: function(dueTime){
				console.log('tag1', dueTime)
				this.taskToSubmit.dueTime = dueTime
			},
			setCentralLocation: function(centralLocation) {
				// this.name = v;
				this.taskToSubmit.centralLocation = centralLocation
			},
			setTotalLocation: function(totalLocation) {
				// this.name = v;
				this.taskToSubmit.totalLocation = totalLocation
			}

		},
		computed: {

			...mapGetters('tasks', ['companies']),
			...mapGetters('settings', ['locations']),
			...mapGetters('settings', ['totalLocations']),
			...mapState('settings', ['userRole']),

			getCompanies() {
				
				return {
					companies: this.companies,
				}
			},
			getLocations(){
				let locationName=[]
				
				let temLocation =  Object.values(this.locations)
				for(let i=0; i < temLocation.length; i++)
				{
					locationName[i]=temLocation[i].name
					
				}
					
				return{
					locationNames:locationName
				}
			},
			getTotalLocations(){
				let locationName=[]
				
				let temLocation =  Object.values(this.totalLocations)
				for(let i=0; i < temLocation.length; i++)
				{
					locationName[i]=temLocation[i].name
					
				}
					
				return{
					locationNames:locationName
				}
			}
		},
		mounted() {
			console.log('locations', this.locations)
			console.log('d', this.taskToSubmit.dueDate)
			if(this.taskToSubmit.dueDate === "" || this.taskToSubmit.dueDate === null) {
				let today = new Date()
				let todaydate = date.formatDate(today, 'DD.MM.YYYY')
				console.log('todaydate', todaydate)
				// let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
				this.taskToSubmit.dueDate = todaydate
				console.log('duedate', this.taskToSubmit.dueDate)
			}

			if(this.taskToSubmit.dueTime === "" || this.taskToSubmit.dueTime === null) {
				let today = new Date()
				let time = today.getHours() + ":" + today.getMinutes();
				this.taskToSubmit.dueTime = time;
				console.log(this.taskToSubmit.dueTime)
			}
		}
	}
</script>