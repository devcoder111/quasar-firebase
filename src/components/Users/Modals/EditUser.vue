<template>
	<q-card>
    
    <modal-header>Edit User</modal-header>

		<form @submit.prevent="submitForm">
		
	    <q-card-section>	    	
	    	<modal-user-email 
	    		:email.sync="getSelectedUser.user.email"
				:foredit="foredit"
	    		ref="modalUserEmail" />
			<modal-user-role 
				:role.sync="getSelectedUser.user.role"
				ref="modalUserRole" />
	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>

  </q-card>
</template>

<script>
	import { mapActions } from 'vuex'
	import mixinAddEditTask from 'src/mixins/mixin-add-edit-user'

	export default {
		mixins: [mixinAddEditTask],
		props: ['tmpuser', 'id'],
		data() {
			return {
				user:{},
				foredit:true
			}
		},
		computed:{
			getSelectedUser() {
				return {
					user: this.tmpuser,
				}
			}
		},

		methods: {
			...mapActions('settings', ['updateUser']),
			submitUser() {
				console.log("id", this.id, this.tmpuser)
				this.updateUser({
					id: this.id,
					updates: this.tmpuser
				})
				this.$emit('close')
			}
		},
		mounted() {
			this.foredit=true
			console.log("edit", this.tmpuser, this.id);
		}
	}
</script>