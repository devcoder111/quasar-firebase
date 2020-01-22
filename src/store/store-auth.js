import { LocalStorage, Loading, uid, Notify } from 'quasar'
import { firebaseAuth, firebaseDb } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
    loggedIn: false
}

const mutations = {
    setLoggedIn(state, value) {
        state.loggedIn = value
    }
}

const actions = {
    registerUser({ dispatch }, payload) {
        Loading.show()
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                console.log('response: ', response)
                payload.uid = response.user.uid
                let userId = uid()
                payload.id = userId

                console.log("payl", payload)

                let userRef = firebaseDb.ref('users/' + payload.id)

                // console.log("email", id)
                userRef.set(payload, error => {
                    if (error) {
                        showErrorMessage(error.message)
                    } else {
                        Notify.create('User added!')
                    }
                })
            })
            .catch(error => {
                showErrorMessage(error.message)
            })
    },
    loginUser({}, payload) {
        Loading.show()
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                console.log('response: ', response)

            })
            .catch(error => {
                showErrorMessage(error.message)
            })
    },
    logoutUser({ commit }) {
        console.log('logoutUser')
        firebaseAuth.signOut()
        commit('settings/cleanUser', null, { root: true })


    },
    handleAuthStateChange({ commit, dispatch }) {
        firebaseAuth.onAuthStateChanged(user => {
            Loading.hide()
            if (user) {
                commit('setLoggedIn', true)
                    //               LocalStorage.set('loggedIn', true)
                this.$router.push('/task')
                dispatch('settings/fbCheckRole', null, { root: true });
                dispatch('tasks/fbReadData', null, { root: true })
                dispatch('settings/fbReadUserData', null, { root: true });
                dispatch('tasks/fbReadCompany', null, { root: true });
                dispatch('settings/fbReadLocationData', null, { root: true });
                dispatch('settings/fbReadTotalLocationData', null, { root: true });
            } else {
                commit('tasks/clearTasks', null, { root: true })
                commit('tasks/setTasksDownloaded', false, { root: true })
                commit('setLoggedIn', false)
                LocalStorage.set('loggedIn', false)
                this.$router.replace('/')
            }
        })
    },

}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}