export default {
    methods: {
        submitForm() {
            this.$refs.modalUserEmail.$refs.email.validate()
            if (!this.$refs.modalUserEmail.$refs.email.hasError) {
                this.submitUser()
            }
        },
        clearDueDate() {
            this.userToSubmit.dueDate = ''
            this.userToSubmit.dueTime = ''
        }
    },
    components: {
        'modal-header': require('components/Tasks/Modals/Shared/ModalHeader.vue').default,
        'modal-user-name': require('components/Users/Modals/Shared/ModalUserName.vue').default,
        'modal-user-email': require('components/Users/Modals/Shared/ModalUserEmail.vue').default,
        'modal-user-password': require('components/Users/Modals/Shared/ModalUserPassword.vue').default,
        'modal-user-role': require('components/Users/Modals/Shared/ModalUserRole.vue').default,
        'modal-company': require('components/Users/Modals/Shared/ModalCompany.vue').default,
        'modal-buttons': require('components/Tasks/Modals/Shared/ModalButtons.vue').default,
    }
}