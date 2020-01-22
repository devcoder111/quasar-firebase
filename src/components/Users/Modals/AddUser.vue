<template>
	<q-card>
    
    <modal-header>Add User</modal-header>

		<form @submit.prevent="submitForm">
	    <q-card-section>
	    	<modal-user-name 
	    		:name.sync="userToSubmit.name"
	    		ref="modalUserName" />
	    	<modal-user-email 
	    		:email.sync="userToSubmit.email"
	    		ref="modalUserEmail" />
			<modal-user-password 
	    		:password.sync="userToSubmit.password"
	    		ref="modalUserPassword" />
			<modal-company 
				:company.sync="userToSubmit.company"
				ref="modalUserCompany" />
			<modal-user-role 
				:role.sync="userToSubmit.role"
				ref="modalUserRole" />

	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>

  </q-card>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex'
	import mixinAddEditTask from 'src/mixins/mixin-add-edit-task'
	import mixinAddEditUser from 'src/mixins/mixin-add-edit-user'

	export default {
		mixins: [mixinAddEditUser],
		data() {
			
			return {
				userToSubmit: {
					name:'',
					email: '',
					password: '',
					company: '',
					role: '',
					completed: false
				},
				
			}
		},
		methods: {
			...mapActions('settings', ['addUser']),
			...mapActions('auth', ['registerUser']),
			submitUser() {
				// this.addUser(this.userToSubmit)
				this.registerUser(this.userToSubmit)
				console.log("userthis", this)
				this.$emit('close')
			}
		},

	}
</script>