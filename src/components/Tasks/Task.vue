<template>
  <q-item 
  	@click="updateTask({ id: id, updates: { completed: !task.completed, userid : task.userid } })"
  	:class="!task.completed ? 'bg-orange-1' : 'bg-green-1'"
    v-touch-hold:1000.mouse="showEditTaskModal"
  	clickable
  	v-ripple>
    <q-item-section side top>
      <q-checkbox
        v-model="task.completed"
        class="no-pointer-events" />
    </q-item-section>

    <q-item-section>
      <q-item-label
      	:class="{ 'text-strikethrough' : task.completed }"
        v-html="$options.filters.searchHighlight(task.name, search)">
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.compName}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>
    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.carrier}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.capacity}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.numtruck}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.numtrailor}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>
    
    <q-item-section>
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.numtruckdriver}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section v-if="userRole=='Admin'">
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.centralLocation}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section v-if="userRole=='Admin'">
      <div class="row">
        <div class="column justify-center">
          <q-item-label  >{{task.totalLocation}}
          </q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section 
      v-if="task.dueDate"
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
          	{{ task.dueDate | niceDate }}
          </q-item-label>
          <q-item-label
          	class="row justify-end"
          	caption>
          	<small>{{ taskDueTime }}</small>
          </q-item-label>
	    	</div>
    	</div>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <q-btn
          @click.stop="showEditTaskModal"
          flat
          round
          dense
          color="primary"
          icon="edit" />
        <q-btn
          @click.stop="promptToDelete(id, task.userid)"
          flat
          round
          dense
          color="red"
          icon="delete" />
      </div>
    </q-item-section>

    <q-dialog v-model="showEditTask">
      <edit-task 
        @close="showEditTask = false" 
        :task="task"
        :id="id" />
    </q-dialog>
    
  </q-item>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'
  import { date } from 'quasar'

	export default {
		props: ['task', 'id'],
    data() {
      return {
        showEditTask: false
      }
    },
    computed: {
      ...mapState('tasks', ['search']),
      ...mapGetters('settings', ['settings']),
      ...mapState('settings', ['userRole']),
      taskDueTime() {
        if (this.settings.show12HourTimeFormat) {
          return date.formatDate(this.task.dueDate + ' ' + this.task.dueTime, 'h:mmA')
        }
        return this.task.dueTime
      }
    },
    mounted(){
      console.log("task", this.task)
    },
    methods: {
      ...mapActions('tasks', ['updateTask', 'deleteTask']),
      showEditTaskModal() {
        this.showEditTask = true
      },
      promptToDelete(id, userid) {
        console.log('prompt', userid)
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
            id: id,
            userid: userid
          }
          this.deleteTask(payload)
        })
      } 
    },
    filters: {
      niceDate(value) {
        return date.formatDate(value, 'MMM D')
      },
      searchHighlight(value, search) {
        if (search) {
          let searchRegExp = new RegExp(search, 'ig')
          return value.replace(searchRegExp, (match) => {
            return '<span class="bg-yellow-6">' + match + '</span>'
          })
        }
        return value
      }
    },
    components: {
      'edit-task': require('components/Tasks/Modals/EditTask.vue').default
    }
	}
</script>

<style>
	
</style>