<template>
	<q-card>
    
    <modal-header>Edit Trip</modal-header>

		<form @submit.prevent="submitForm">
		<q-card-section v-if="userRole=='Harbour Staff' || userRole=='Loader'">
			<modal-task-capacityLoaded v-if="userRole=='Loader'"
	    		:capacityLoaded.sync="taskToSubmit.capacityLoaded"
	    		ref="modalTaskCapacityLoaded" />
			<modal-task-capacityDelivered v-if="userRole=='Harbour Staff'"
	    		:capacityDelivered.sync="taskToSubmit.capacityDelivered"
	    		ref="modalTaskCapacityDelivered" />
		</q-card-section>
	    <q-card-section v-else>
	    	
	    	<modal-task-name 
	    		:name.sync="taskToSubmit.name"
	    		ref="modalTaskName" />
			<modal-task-carrier 
	    		:carrier.sync="taskToSubmit.carrier"
	    		ref="modalTaskCarrier" />
			<modal-task-capacity 
	    		:capacity.sync="taskToSubmit.capacity"
	    		ref="modalTaskCapacity" />
			<modal-company-name v-if="userRole!='Dispatcher'"
				:compName.sync="getCompanies.companies"
				:editCompName="taskToSubmit.compName"
				ref="modalCompanyName" v-on:update="setComName($event)"/>
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
				:dueDate.sync="taskToSubmit.dueDate"
				v-on:update="setDueDate($event)" />

			<modal-due-time
				
				:dueTime.sync="taskToSubmit.dueTime" v-on:update="setDueTime($event)" />
			<modal-central-location v-if="userRole!='Dispatcher'"
				:centralLocation.sync="getLocations.locationNames"
				:editCentralLocation="taskToSubmit.centralLocation"
				ref="modalCentralLocation" v-on:update="setCentralLocation($event)"/>
			<modal-total-location v-if="userRole!='Dispatcher'"
				:totalLocation.sync="getTotalLocations.locationNames"
				:editTotalLocation="taskToSubmit.totalLocation"
				ref="modalTotalLocation" v-on:update="setTotalLocation($event)"/>
			<modal-task-capacityLoaded v-if="userRole=='Admin' || userRole=='Loader'"
	    		:capacityLoaded.sync="taskToSubmit.capacityLoaded"
	    		ref="modalTaskCapacityLoaded" />
			<modal-task-capacityDelivered v-if="userRole=='Admin' || userRole=='Harbour Staff'"
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
		props: ['task', 'id'],
		data() {
			return {
				taskToSubmit: {},

			}
		},
		methods: {
			...mapActions('tasks', ['updateTask']),
			submitTask() {
				console.log("userid", this.id, this.taskToSubmit)
				this.updateTask({
					id: this.id,
					updates: this.taskToSubmit
				})
				this.$emit('close')
			},
			setComName: function(comName) {
				// this.name = v;
				this.taskToSubmit.compName = comName
			},
			setCentralLocation: function(centralLocation) {
				// this.name = v;
				this.taskToSubmit.centralLocation = centralLocation
			},
			setTotalLocation: function(totalLocation) {
				// this.name = v;
				this.taskToSubmit.totalLocation = totalLocation
			},
			setDueDate: function(dueDate) {
				console.log("sonduedate", dueDate)
				dueDate = date.formatDate(dueDate, 'DD.MM.YYYY')
				this.taskToSubmit.dueDate = dueDate
				console.log(this.taskToSubmit.dueDate)
			},
			setDueTime: function(dueTime){
				console.log('tag1', dueTime)
				this.taskToSubmit.dueTime = dueTime
			},
		},
		mounted() {
			console.log("task111", this.task, this.id)
			this.taskToSubmit = Object.assign({}, this.task)
			console.log("tasktosubmit", this.taskToSubmit)
			if(this.taskToSubmit.dueDate === "" || this.taskToSubmit.dueDate === null) {
				let today = new Date()
				let todaydate = date.formatDate(today, 'DD.MM.YYYY')
				console.log('todaydate', todaydate)
				// let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
				this.taskToSubmit.dueDate = todaydate
				console.log('duedate', this.taskToSubmit.dueDate)
			}

			if(this.task.dueTime === "" || this.task.dueTime === null) {
				let today = new Date()
				let time = today.getHours() + ":" + today.getMinutes();
				this.task.dueTime = time;
				console.log(this.task.dueTime)
			}

		},
		watch:{
			task(data){
				this.taskToSubmit = Object.assign({}, this.task)
			}
		},
		computed: {

			...mapGetters('tasks', ['companies']),
			...mapGetters('settings', ['locations']),
			...mapGetters('settings', ['totalLocations']),
			...mapState('settings', ['userRole']),

			getCompanies() {
				console.log("comp", this.companies)
				return {
					companies: this.companies,
				}
			},
			getLocations() {
				
				let locationName=[]
				console.log('locLe', this.locations)
				let temLocation =  Object.values(this.locations)
				for(let i=0; i < temLocation.length; i++)
				{
					locationName[i]=temLocation[i].name
					
				}
					console.log('locName', locationName)
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
					console.log('locName', locationName)
				return{
					locationNames:locationName
				}
			}

		},
	}
</script>