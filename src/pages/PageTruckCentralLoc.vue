<template>
	<q-page padding>
		<q-btn
			to="/truckdrivertask"
			color="primary"
			icon="chevron_left"
			label="Back"
			flat />
		<div class="column" >
			
			<div class="col column">
				<div class="col-sm-6">
				NumTruck: {{plateData.numtruck}}
				</div>
				
				<div class="col-sm-6">
				Carrier: {{plateData.carrier}}
				</div>
				<div class="col-sm-6">
				DueDate: {{plateData.dueDate}}
				</div>
				<div class="col-sm-6">
				DueTime: {{plateData.dueTime}}
				</div>
			</div>
		</div>
		<div>
			<span>Please drive to the central location</span>
			<div class="col-sm-6">
				DmsX: {{plateData.centralLocationData.dmsx}}
			</div>
			<div class="col-sm-6">
				DmsY: {{plateData.centralLocationData.dmsy}}
			</div>
			<div class="col-sm-6">
				LocationX: {{plateData.centralLocationData.locationx}}
			</div>
			<div class="col-sm-6">
				LocationY: {{plateData.centralLocationData.locationy}}
			</div>
		</div>
		<div>
			<span>Press the Buton "I have arrived"</span>
			<div>

				<q-btn
				to="/driverTotalLocation"
				color="primary"
				
				label="I have arrived"
				flat />
			</div>
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
				plateData:''
			}
		},
		mounted() {
		this.plateData = LocalStorage.getItem("plateData")
		},
		created(){
		},
		methods: {
		
			getPlateData() {
				
				console.log('tag', this.plateData)
			
				return {
					plateTask1: 'data'
				}
			
			},
			
		},
		computed: {
			// ...mapGetters('settings', ['plateTask']),
		},
	
	}
</script>