<template>
<q-list bordered padding class="q-mb-md">
	<q-table
		title="Total Locations"
		:data="data"
		:columns="columns"
		row-key="name"
		>

		<template v-slot:top-right>
			<q-btn color="positive" icon="edit" label="Add Total Location" @click="prompt = true"/>
		</template>
		<template v-slot:body-cell-actions="props">
			<q-td class="q-gutter-x-sm" style="text-align:center">
			<q-btn round outline color="primary" icon="edit" @click="modalEditLocFunc(props.row)"/>
			<q-btn round outline color="negative" icon="delete" @click.stop="promptToDelete(props.row.__index)" />
			</q-td>
		</template>
	</q-table>	
	<q-dialog v-model="prompt" persistent>
		<add-totallocation @close="prompt = false" />
	</q-dialog>	
	<q-dialog v-model="showEditLocModal" persistent>
		<edit-totallocation @close="showEditLocModal = false" 
			:tmplocation="tmpLocationData"
			:id="tmpLocationID"
		/>
	</q-dialog>
</q-list>	
	
	
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex'
	import EventBus from './../../pages/event-bus';
	export default {
		
		data() {
			
			return {
				prompt: false,
				tmpLocationData:"",
				tmpLocationID:"",
				locationIds:[],
				showEditLocModal: false,

				selected: [],
				columns: [
					{
					name: 'name',
					required: true,
					label: 'Name',
					align: 'center',
					field: row => row.name,
					format: val => `${val}`,
					sortable: true
					},
					{ name: 'locationx', align: 'center', label: 'LocationX', field: 'locationx', sortable: true },
					{ name: 'locationy', align: 'center', label: 'LocationY', field: 'locationy', sortable: true },
					{ name: 'dmsx', align: 'center',  label: 'DmsX', field: 'dmsx' },
					{ name: 'dmsy', align: 'center', label: 'DmsY', field: 'dmsy' },
					{ name: 'actions', field: 'id', label: 'Actions', sortable: false, required: true, align: 'center' }
				],
				data: [
				
				],
			}
		},
		created(){
						
			EventBus.$on('editTotalLocationEvent', (data)=>{
				console.log("emitdata", data);
				this.data=Object.values(data);
			})
		},
		methods: {
			...mapActions('settings', ['deleteTotalLocation']),
			modalEditLocFunc(locData) {
				this.tmpLocationData =  locData;
				this.tmpLocationID = this.locationIds[locData.__index]
				console.log("locdata", this.tmpLocationData, this.tmpLocationID)
				this.showEditLocModal = true;
				
			},

			promptToDelete(id) {
				this.$q.dialog({
				title: 'Confirm',
				message: 'Really delete?',
				ok: {
					push: true
				},
				cancel: {
					color: 'negative'
				},
				persistent: true
				}).onOk(() => {
				this.deleteTotalLocation(this.locationIds[id])
			
				})
			} 
			
		},
		computed: {
			...mapGetters('settings', ['totalLocations']),
		
		},
		watch:{
			totalLocations(data){
				this.locationIds = Object.keys(this.totalLocations)
				console.log('Originlocation', this.totalLocations)
				this.data = Object.values(this.totalLocations)
				console.log('loca', Object.values(this.totalLocations))	
			}
		},
		mounted() {
			this.$root.$on('prompt', () => {
				this.prompt = true
			})
			this.locationIds = Object.keys(this.totalLocations)
			console.log('Originlocation', this.totalLocations)
			this.data = Object.values(this.totalLocations)
			console.log('loca', Object.values(this.totalLocations))	
		
		},
		components: {
			'add-totallocation' : require('./AddTotalLocation.vue').default,
			'edit-totallocation' : require('./EditTotalLocation.vue').default,
			
		}
	}
</script>