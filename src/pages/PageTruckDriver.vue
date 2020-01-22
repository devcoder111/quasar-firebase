<template>
	<q-page padding>
    <form @submit.prevent="submitForm">
		<q-btn
			to="/auth"
			color="primary"
			icon="people"
			label="Login or Register"
			flat />

		<h5>Enter the Plate Number</h5>
      <q-card-section>
        <q-input outlined  label="Plate Number" placeholder="Enter the Plate Number" v-model="plateNum" lazy-rules autofocus :rules="[val => isValidPlateNum(val) || 'Field is allowed only numbers and letters. NO Spaces, dash etc..']" ref="plateNum"/>
        <q-btn color="primary" label="Search" type="submit" />
      </q-card-section>
      
    </form>
	</q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
	export default {
		data() {
			
			return {
				plateNum:''

			}
		},
		methods: {
			isValidPlateNum(val) {
				var re = /([a-zA-Z\-0-9])$/
		    return re.test(String(val).toLowerCase())
			},
			submitForm() {
				this.$refs.plateNum.validate()
				if (!this.$refs.plateNum.hasError) {

					LocalStorage.set("plateNum", this.plateNum)
					this.$router.push('/truckdrivertask')
				}
			}
		}
	
	}
</script>