<template>
	<div 
		class="row q-mb-sm">
    <q-input
    	outlined
    	label="Due time"
    	:value="dueTime"
		v-model="time"
    	@input="$emit('update:dueTime', $event)"
    	class="col">
      <template v-slot:append>
      	<q-icon
      		v-if="dueTime"
      		@click="$emit('update:dueTime', '')"
      		name="close"
      		class="cursor-pointer" />
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy>
            <q-time
              :value="dueTime"
			  v-model="time"
              @input="$emit('update:dueTime', $event)"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
	</div>
</template>

<script>
	export default {
		props: ['dueTime'],
		data () {
			return {
			time: '10:54'
			}
		},
		mounted(){
				this.time = this.dueTime
		},
		watch: {
			dueTime(time) {
				this.time = this.dueTime
			}
		}
	}
</script>