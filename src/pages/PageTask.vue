<template>
  <q-page>

  	<div >

  		<template v-if="tasksDownloaded">
  			<q-list bordered padding class="q-mb-md">		
				<q-table
					title="Trip"
					:data="data"
					:columns="columns"
					row-key="name"
					:visible-columns="visibleColumns"
					:pagination.sync="pagination"
					>

					<!-- <template v-slot:top-right>
						<q-btn color="positive" icon="edit" label="Add Task" @click="showAddTask = true"/>
					</template> -->
					
					<template v-slot:body-cell-actions="props">
						<q-td class="q-gutter-x-sm" style="text-align:center">
						<q-btn round outline color="primary" icon="edit" @click="modalEditTask(props.row)"/>
						<q-btn  v-if="userData.userRole !='Loader' && userData.userRole !='Harbour Staff'" round outline color="negative" icon="delete" @click.stop="promptToDelete(props.row.__index, props.row.userid)" />
						</q-td>
					</template>
				</q-table>			
		</q-list>
		<div class="absolute-bottom text-center q-mb-lg no-pointer-events">
  				<q-btn v-if="userData.userRole !='Loader' && userData.userRole !='Harbour Staff'"
  				@click="showAddTask = true"
  				  round
  				  class="all-pointer-events"
  				  color="primary"
  				  size="24px"
  				  icon="add"
  				/>
  			</div>	
  		</template>

  	</div>
		
		<q-dialog v-model="showAddTask">
		  <add-task @close="showAddTask = false" />
		</q-dialog>
		<q-dialog v-model="showEditTask" persistent>
			<edit-task 
				@close="showEditTask = false" 
				:task="task"
				:id="taskId" />
		</q-dialog>
  </q-page>
</template>

<script>
	import { mapGetters, mapState, mapActions } from 'vuex'
	import { LocalStorage } from 'quasar'

	export default {
		data() {
			return {
				pagination: {
					rowsPerPage: '' // current rows per page being displayed
				},
				visibleColumns: [ ],
				tmp:[],
				showAddTask: false,
				showEditTask: false,
				taskIds:[],
				task:'',
				taskId:'',
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
					
					{ name: 'compName', align: 'center', label: 'Dispatcher Company', field: 'compName', sortable: true },
					{ name: 'carrier', align: 'center',  label: 'Carrier', field: 'carrier' },
					{ name: 'capacity', align: 'center', label: 'Capacity', field: 'capacity' },
					{ name: 'numtruck', align: 'center', label: 'Plate Number Truck', field: 'numtruck', sortable: true },
					{ name: 'numtrailor', align: 'center', label: 'Plate Number Trailor', field: 'numtrailor', sortable: true },
					{ name: 'numtruckdriver', align: 'center',  label: 'Number of Truckdriver', field: 'numtruckdriver' },
					{ name: 'centralLocation', align: 'center', label: 'Central Location', field: 'centralLocation' },
					{ name: 'totalLocation', align: 'center', label: 'Total Location', field: 'totalLocation' },
					{ name: 'dueDate', align: 'center', label: 'Due Date', field: 'dueDate' },
					{ name: 'dueTime', align: 'center', label: 'Due Time', field: 'dueTime' },
					{ name: 'capacityLoaded', align: 'center', label: 'Capacity Loaded', field: 'capacityLoaded' },
					{ name: 'capacityDelivered', align: 'center', label: 'Capacity Delivered', field: 'capacityDelivered' },
					{ name: 'actions', field: 'id', label: 'Actions', sortable: false, required: true, align: 'center' }
				],
				data: [
				
				]
			}
		},
		computed: {
			...mapGetters('tasks', ['tasksTodo', 'tasksCompleted']),
			...mapGetters('settings', ['settings']),
			...mapState('settings', ['userRole']),
			...mapState('tasks', ['search', 'tasksDownloaded']),
			...mapState('settings', ['userData']),
			// taskDueTime() {
			// 	if (this.settings.show12HourTimeFormat) {
			// 	return date.formatDate(this.task.dueDate + ' ' + this.task.dueTime, 'h:mmA')
			// 	}
			// 	return this.task.dueTime
			// }
			
		},
		methods: {
			...mapActions('tasks', ['fbReadData', 'deleteTask']),
			...mapActions('settings', ['updateUserPagination']),
			
			modalEditTask(task){
				
				this.task = task
				this.taskId = this.taskIds[task.__index]
				console.log("task", this.task, this.taskId)
				this.showEditTask = true
			},
			promptToDelete(id, userid) {
				console.log('id userid', id, userid)
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
					let payload = {
						id: this.taskIds[id],
						userid: userid
					}
					this.deleteTask(payload)
				
				})
			} 
		},
		mounted() {
			this.$root.$on('showAddTask', () => {
				this.showAddTask = true
			})
			// console.log("userdata", this.userData)
			if(this.userData.userRole == "Admin"){
				this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityLoaded', 'numtruck', 'capacityDelivered', 'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
			}else if(this.userData.userRole == "Dispatcher"){
				this.visibleColumns= [  'carrier', 'capacity',  'numtruck', 'numtrailor','numtruckdriver',  'dueDate', 'dueTime']
			}else if(this.userData.userRole == "Loader"){
				this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityLoaded', 'numtruck', 'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
			}else if(this.userData.userRole == "Harbour Staff"){
				this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityDelivered', 'numtruck',  'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
			}
			if(this.userData.rowsPerPage=="" || this.userData.rowsPerPage== null){
				this.pagination.rowsPerPage = 5
			}else{

				this.pagination.rowsPerPage = this.userData.rowsPerPage
			}

			this.tmp = this.tasksTodo
			this.data = Object.values(this.tasksTodo)
			this.taskIds = Object.keys(this.tasksTodo)
		},
		
		watch:{
			pagination(data){
				console.log('pagination', data.rowsPerPage)
				let user={}
				user.rowsPerPage = data.rowsPerPage
				
				this.updateUserPagination({
					updates: user
				})
				
			},
			tasksTodo(data){
				this.data = Object.values(data)
				this.taskIds = Object.keys(data)
				console.log("sondataas", this.data);
			},
			userData(data){
				console.log("userdata", data)
				if(data.userRole == "Admin"){
					this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityLoaded', 'numtruck', 'capacityDelivered', 'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
				}else if(data.userRole == "Dispatcher"){
					this.visibleColumns= [  'carrier', 'capacity',  'numtruck', 'numtrailor','numtruckdriver',  'dueDate', 'dueTime']
				}else if(data.userRole == "Loader"){
					this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityLoaded', 'numtruck',  'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
				}else if(data.userRole == "Harbour Staff"){
					this.visibleColumns= [ 'compName', 'carrier', 'capacity', 'capacityDelivered', 'numtruck',  'numtrailor','numtruckdriver', 'centralLocation', 'totalLocation', 'dueDate', 'dueTime']
				}
				// switch (key) {
				// 	case value:
						
				// 		break;
				
				// 	default:
				// 		break;
				// }
			}


		},

		components: {
			'add-task' : require('components/Tasks/Modals/AddTask.vue').default,
			'edit-task' : require('components/Tasks/Modals/EditTask.vue').default,
			'tasks-todo' : require('components/Tasks/TasksTodo.vue').default,
			'tasks-completed' : require('components/Tasks/TasksCompleted.vue').default,
			'no-tasks' : require('components/Tasks/NoTasks.vue').default,
			'search' : require('components/Tasks/Tools/Search.vue').default,
			'sort' : require('components/Tasks/Tools/Sort.vue').default
		}
	}
</script>

<style>
	.q-scroll-area-tasks {
		display: flex;
		flex-grow: 1;
	}
</style>
