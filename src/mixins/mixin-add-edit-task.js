export default {
    methods: {
        submitForm() {
            if (this.userRole != "Loader" && this.userRole != "Harbour Staff") {

                this.$refs.modalTaskName.$refs.name.validate()
                this.$refs.modalPlateNumTruck.$refs.numtruck.validate()
                this.$refs.modalPlateNumTrailor.$refs.numtrailor.validate()
                if (!this.$refs.modalTaskName.$refs.name.hasError && !this.$refs.modalPlateNumTruck.$refs.numtruck.hasError && !this.$refs.modalPlateNumTrailor.$refs.numtrailor.hasError) {
                    this.submitTask()
                }
            } else {
                this.submitTask()
            }
        },
        clearDueDate() {
            this.taskToSubmit.dueDate = ''
            this.taskToSubmit.dueTime = ''
        }
    },
    components: {
        'modal-header': require('components/Tasks/Modals/Shared/ModalHeader.vue').default,
        'modal-task-name': require('components/Tasks/Modals/Shared/ModalTaskName.vue').default,
        'modal-task-carrier': require('components/Tasks/Modals/Shared/ModalTaskCarrier.vue').default,
        'modal-task-capacity': require('components/Tasks/Modals/Shared/ModalTaskCapacity.vue').default,
        'modal-surname': require('components/Tasks/Modals/Shared/ModalSurname.vue').default,
        'modal-plate-num-truck': require('components/Tasks/Modals/Shared/modalNumTruck.vue').default,
        'modal-plate-num-trailor': require('components/Tasks/Modals/Shared/modalNumTrailor.vue').default,
        'modal-number-truck-driver': require('components/Tasks/Modals/Shared/modalNumTruckDriver.vue').default,
        'modal-company-name': require('components/Tasks/Modals/Shared/modalCompanyName.vue').default,
        'modal-due-date': require('components/Tasks/Modals/Shared/ModalDueDate.vue').default,
        'modal-due-time': require('components/Tasks/Modals/Shared/ModalDueTime.vue').default,
        'modal-central-location': require('components/Tasks/Modals/Shared/modalCentralLocation.vue').default,
        'modal-total-location': require('components/Tasks/Modals/Shared/modalTotalLocation.vue').default,
        'modal-task-capacityLoaded': require('components/Tasks/Modals/Shared/ModalTaskCapacityLoaded.vue').default,
        'modal-task-capacityDelivered': require('components/Tasks/Modals/Shared/ModalTaskCapacityDelivered.vue').default,
        'modal-buttons': require('components/Tasks/Modals/Shared/ModalButtons.vue').default,
    }
}