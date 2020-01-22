<template>
	<transition
	  appear
	  enter-active-class="animated zoomIn"
	  leave-active-class="animated zoomOut absolute-top"
	>
		<div>
			<list-header
				v-if="!settings.showTasksInOneList"
				bgColor="bg-orange-4"
				>Task</list-header>
				
			<q-item 
			class= 'bg-orange-1' v-ripple>
				<q-item-section side top>
				<q-checkbox
					value=true
					class="no-pointer-events" />
				</q-item-section>
				<q-item-section>
				<q-item-label>Name
				</q-item-label>
				</q-item-section>
				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label  >Dispatcher Company
					</q-item-label>
					</div>
				</div>
				</q-item-section>
				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label  >    Carrier
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label >Capacity
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label  >Plate Number Truck
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label  >Plate Number Trailor
					</q-item-label>
					</div>
				</div>
				</q-item-section>
				
				<q-item-section>
				<div class="row">
					<div class="column justify-center">
					<q-item-label  >Number of Truckdriver 
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section v-if="userRole=='Admin'">
				<div class="row" >
					<div class="column justify-center">
					<q-item-label  >Central Location
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section>
				<div class="row" v-if="userRole=='Admin'">
					<div class="column justify-center">
					<q-item-label  >Total Location
					</q-item-label>
					</div>
				</div>
				</q-item-section>

				<q-item-section 
				side>
					<div class="row">
						<div class="column justify-center">
							<q-icon 
								name="event"
								size="18px"
								class="q-mr-xs" />
						</div>
						<div class="column">
					<q-item-label 
						class="row justify-end"
						caption>
						DueDate
					</q-item-label>
					<q-item-label
						class="row justify-end"
						caption>
						<small>DueTime</small>
					</q-item-label>
						</div>
					</div>
				</q-item-section>

				<q-item-section side>
				<div class="row">
					<q-btn
					
					flat
					round
					dense
					color="primary"
					icon="edit" />
					<q-btn
					
					flat
					round
					dense
					color="red"
					icon="delete" />
				</div>
				</q-item-section>		
			</q-item>
			<q-list 
				separator
				bordered>

				<task
					v-for="(task, key) in tasksTodo"
			  	:key="key"
			  	:task="task"
			  	:id="key"></task>

			</q-list>
		</div>
	</transition>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'

	export default {
		props: ['tasksTodo'],
		computed: {
			...mapGetters('settings', ['settings']),
			...mapState('settings', ['userRole']),
		},
		components: {
			'task' : require('components/Tasks/Task.vue').default,
			'list-header' : require('components/Shared/ListHeader.vue').default,
		},
		mounted() {
			console.log("todotask", this.tasksTodo)
		},
	}
</script>