<template>
  <q-page padding>
		<q-list
			class="q-mb-md"
			bordered
			padding>
		  <q-item-label header>Settings</q-item-label>

		  <q-item tag="label" v-ripple>
		    <q-item-section>
		      <q-item-label>Show 12 hour time format</q-item-label>
		    </q-item-section>
		    <q-item-section side >
		      <q-toggle
		      	v-model="show12HourTimeFormat"
		      	color="blue" />
		    </q-item-section>
		  </q-item>

		  <q-item tag="label" v-ripple>
		    <q-item-section>
		      <q-item-label>Show tasks in one list</q-item-label>
		    </q-item-section>
		    <q-item-section side >
		      <q-toggle
		      	v-model="showTasksInOneList"
		      	color="blue" />
		    </q-item-section>
		  </q-item>

		</q-list>

		<q-list bordered 
				padding
			class="q-mb-md">
		  <q-item-label header>More</q-item-label>

		  <q-item
		  	to="/settings/help"
		  	tag="label"
		  	v-ripple>
		    <q-item-section>
		      <q-item-label>Help</q-item-label>
		    </q-item-section>
		    <q-item-section side >
		      <q-icon name="chevron_right" /> 
		    </q-item-section>
		  </q-item>

		  <q-item
		  	@click="visitOurWebsite"
		  	tag="label"
		  	v-ripple>
		    <q-item-section>
		      <q-item-label>Visit our website</q-item-label>
		    </q-item-section>
		    <q-item-section side >
		      <q-icon name="chevron_right" /> 
		    </q-item-section>
		  </q-item>

		  <q-item
		  	@click="emailUs"
		  	tag="label"
		  	v-ripple>
		    <q-item-section>
		      <q-item-label>Email us</q-item-label>
		    </q-item-section>
		    <q-item-section side >
		      <q-icon name="chevron_right" /> 
		    </q-item-section>
		  </q-item>

		</q-list>

		<q-list bordered padding v-if="userRole=='Admin'">
		  <q-item-label header>Users</q-item-label>

		  <q-item
		  	tag="label"
			class="text-primary">
		    <q-item-section color="primary">
				<q-item-label>Email</q-item-label>
		    </q-item-section>
			 <q-item-section>
				<q-item-label>Company</q-item-label>
		    </q-item-section>
			<q-item-section>
				<q-item-label>Role</q-item-label>
		    </q-item-section>
		  </q-item>

			
		   <q-item
		  	tag="label"
			v-for="(user, i) in users"
			v-bind:key="user.email+i" 
			>
		    <q-item-section>
				<q-item-label>{{ user.email }}</q-item-label>
		    </q-item-section>
			 <q-item-section>
				<q-item-label >{{ user.company }}</q-item-label>
		    </q-item-section>
			<q-item-section>
				<q-item-label >{{ user.role }}</q-item-label>
		    </q-item-section>
			 <q-item-section side> 
				<q-icon name="edit"
				@click="modalFunc(user, i)"
				/> 
		     </q-item-section>
		   </q-item>

		    <q-item>
		    <q-item-section>
				<q-item-label></q-item-label>
		    </q-item-section>
			 <q-item-section side> 
				<q-btn @click="showAddUser = true" color="positive" icon="edit"  label="add user" />
		    </q-item-section>
		  </q-item>

		</q-list>
		

		<q-list bordered padding class="q-mb-md">		
				<q-table
					title="Central Locations"
					:data="data"
					:columns="columns"
					row-key="name"
					>

					<template v-slot:top-right>
						<q-btn color="positive" icon="edit" label="Add Location" @click="prompt = true"/>
					</template>
					<template v-slot:body-cell-actions="props">
						<q-td class="q-gutter-x-sm" style="text-align:center">
						<q-btn round outline color="primary" icon="edit" @click="modalEditLocFunc(props.row)"/>
						<q-btn round outline color="negative" icon="delete" @click.stop="promptToDelete(props.row.__index)" />
						</q-td>
					</template>
				</q-table>			
		</q-list>
		
		<total-location />
		

		<q-dialog v-model="prompt" persistent>
			<add-location @close="prompt = false" />
		</q-dialog>
		<q-dialog v-model="showEditLocModal" persistent>
			<edit-location @close="showEditLocModal = false" 
				:tmplocation="tmpLocationData"
				:id="tmpLocationID"
			/>
		</q-dialog>
		<q-dialog v-model="showEditUserModal">
		  <edit-user @close="showEditUserModal = false" 
		  :tmpuser="tmpUserData" 
		  :id="id"/>
		</q-dialog>

		<q-dialog v-model="showAddUser">
		  <add-user @close="showAddUser = false" />
		</q-dialog>
  </q-page>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex'
	import { openURL } from 'quasar'
	import EventBus from './event-bus';

	export default {
		data() {
			return {
			prompt: false,

			showAddUser: false,
			showEditUserModal:false,
			showEditLocModal:false,
			tmpUserData: "",
			tmpLocationData:"",
			tmpLocationID:"",
			locationIds:[],
			id:"",
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
			data: [],
			}
		},
		created(){
						
			EventBus.$on('EVENT_NAME', (data)=>{
				console.log("emitdata", data);
				this.data=Object.values(data);
			})
		},
		computed: {

			...mapGetters('settings', ['settings']),
			...mapGetters('settings', ['users']),
			...mapGetters('settings', ['locations']),
			...mapState('settings', ['userRole']),

			...mapState({ usersTo: state => state.users}),
			show12HourTimeFormat: {
				get() {
					return this.settings.show12HourTimeFormat
				},
				set(value) {
					this.setShow12HourTimeFormat(value)
				} 
			},
			showTasksInOneList: {
				get() {
					return this.settings.showTasksInOneList
				},
				set(value) {
					this.setShowTasksInOneList(value)
				} 
			},
			getLocations() {
				console.log("loc", this.locations)
				return {
					locations: Object.values(this.locations),
				}
		
			},

		},
		methods: {
			...mapActions('settings', ['setShow12HourTimeFormat', 'setShowTasksInOneList', 'deleteLocation']),
			visitOurWebsite() {
				openURL('http://www.google.com')
			},
			emailUs() {
				window.location.href = 'mailto:hello@geolistics?subject=Geolistics App Feedback'
			},
			modalFunc(user, index) {
				console.log("fff", user);
				this.tmpUserData = user;
				this.id= index;
				
				this.showEditUserModal = true;
				
			},
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
				this.deleteLocation(this.locationIds[id])
			
				})
			} 
					
		},
		watch:{
			locations(data){
				this.locationIds = Object.keys(this.locations)
				console.log('Originlocation', this.locations)
				this.data = Object.values(this.locations)
				console.log('newloca', Object.values(this.locations))
			}
		},
		mounted() {
			this.$root.$on('showAddUser', () => {
				this.showAddUser = true
			})
			this.$root.$on('prompt', () => {
				this.prompt = true
			})
			this.locationIds = Object.keys(this.locations)
			console.log('Originlocation', this.locations)
			this.data = Object.values(this.locations)
			console.log('loca', Object.values(this.locations))
		},
		components: {
			'add-user' : require('components/Users/Modals/AddUser.vue').default,
			'edit-user' : require('components/Users/Modals/EditUser.vue').default,
			'add-location' : require('components/Location/AddLocation.vue').default,
			'edit-location' : require('components/Location/EditLocation.vue').default,
			'total-location' : require('components/Location/TotalLocation.vue').default,
		}
		
	}
</script>

<style>
.admin {
	color: #a2aa33;
}
	
</style>
