<template>
  <q-card style="min-width: 300px">
    <form @submit.prevent="submitForm">
      <q-card-section>
        <div class="text-h6">ADD TOTAL LOCATION</div>
      </q-card-section>

      <q-card-section>
        <q-input outlined  label="Name" placeholder="Input Name"  v-model="locationToSubmit.name" autofocus :rules="[val => !!val || 'Field is required']" ref="name"/>
      </q-card-section>
      <q-card-section>
        <q-input outlined  label="LocationX" placeholder="Input LocationX" type="number" v-model="locationToSubmit.locationx" :rules="[val => !!val || 'Field is required']"/>
      </q-card-section>
      <q-card-section>
        <q-input outlined  label="LocationY" placeholder="Input LocationY" type="number" v-model="locationToSubmit.locationy" :rules="[val => !!val || 'Field is required']"/>
      </q-card-section>
      <q-card-section>
        <q-input outlined  label="DmsX" placeholder="Input DmsX" type="text" v-model="locationToSubmit.dmsx" />
      </q-card-section>
      <q-card-section>
        <q-input outlined  label="DmsY" placeholder="Input DmsY" type="text" v-model="locationToSubmit.dmsy" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Add location" type="submit" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex'
	import EventBus from './../../pages/event-bus';
	export default {
		
		data() {
			
			return {
				locationToSubmit : {
					locationx:'',
					locationy:'',
					dmsx:'',
					dmsy:'',
				}
			}
		},
		methods: {
			...mapActions('settings', ['addTotalLocation']),
			
			submitLocation() {
				this.addTotalLocation(this.locationToSubmit)
				this.$emit('close')			
			},
			submitForm() {  
				this.$refs.name.validate()
				if (!this.$refs.name.hasError) {
					this.submitLocation()
					console.log("this", this)
					this.$emit('close')
					// EventBus.$emit('EVENT_NAME1', this.locations);
				}
            }
		},
		computed: {
			// ...mapGetters('settings', ['totalLocations']),
		
		},
	}
</script>