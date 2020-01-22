<template>
	<q-page padding>
		<q-btn
			to="/driverCentralLocation"
			color="primary"
			icon="chevron_left"
			label="Back"
			flat />
		<div>
			<span>You have arrived at Central Location.</span>
			<span>Please drive now to the Final Location</span>

		</div>
		<div class="column" >
			
			<div class="col column">
				<div class="col-sm-6">
					DmsX: {{plateData.totalLocationData.dmsx}}
				</div>
				
				<div class="col-sm-6">
					DmsY: {{plateData.totalLocationData.dmsy}}
				</div>
				<div class="col-sm-6">
					LocationX: {{plateData.totalLocationData.locationx}}
				</div>
				<div class="col-sm-6">
					LocationY: {{plateData.totalLocationData.locationy}}
				</div>
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