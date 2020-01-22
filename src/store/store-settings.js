import Vue from 'vue'
import { LocalStorage, uid, Notify, Loading } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase'

// import * as admin from 'firebase-admin'
// import * as functions from 'firebase-functions'

const state = {
    users: {},
    settings: {
        show12HourTimeFormat: false,
        showTasksInOneList: false,
    },
    locations: {},
    totalLocations: {},
    userRole: '',
    plateTask: {},
    userData: []
}

const mutations = {
    cleanUser(state) {
        state.userRole = ''
        state.userData = []
    },
    deletePlateTask(state) {
        state.plateTask = {}
    },
    readPlateTask(state, payload) {
        console.log("mutation-platetask", payload.driverTask)
        Vue.set(state.plateTask, payload.id, payload.driverTask)
        Loading.hide()
            // state.plateTask = payload.centralLocation
    },
    deleteLocations(state) {
        state.locations = {}
    },
    deleteTotalLocations(state) {
        state.totalLocations = {}
    },

    checkRole(state, payload) {

        state.userRole = payload
    },
    checkUserData(state, payload) {
        state.userData = payload
    },
    updateUser(state, payload) {
        Object.assign(state.users[payload.id], payload.updates)
    },
    updateLocation(state, payload) {

        Object.assign(state.locations[payload.id], payload.updates)
    },
    deleteLocation(state, id) {
        Vue.delete(state.locations, id)
    },
    updateTotalLocation(state, payload) {
        Object.assign(state.totalLocations[payload.id], payload.updates)
    },
    deleteTotalLocation(state, id) {
        Vue.delete(state.totalLocations, id)
    },

    setShow12HourTimeFormat(state, value) {
        state.settings.show12HourTimeFormat = value
    },
    setShowTasksInOneList(state, value) {
        state.settings.showTasksInOneList = value
    },
    setSettings(state, settings) {
        Object.assign(state.settings, settings)
    },
    addUser(state, payload) {
        Vue.set(state.users, payload.id, payload.user)
    },
    addLocation(state, payload) {

        Vue.set(state.locations, payload.id, payload.location)
    },
    addTotalLocation(state, payload) {
        Vue.set(state.totalLocations, payload.id, payload.totalLocation)
    },
}

function check_role() {
    let userEmail = firebaseAuth.currentUser.email
    firebaseDb.ref('users/').orderByChild('email').equalTo(userEmail).on("value", function(snapshot) {

        snapshot.forEach(function(data) {
            let role = data.val().role
            let payload = role
            return role;


        });
    });

}

const actions = {
    updateUser({ dispatch }, payload) {
        dispatch('fbUpdateUser', payload)
    },
    updateUserPagination({ dispatch }, payload) {
        console.log('pagination', payload)
        let userId = firebaseAuth.currentUser.uid
        let p1 = new Promise(
            (resolve, reject) => {
                firebaseDb.ref('users/').orderByChild('uid').equalTo(userId).on("value", function(snapshot) {
                    snapshot.forEach(function(data) {
                        payload.id = data.key
                        console.log('payload', payload)
                        resolve(payload)
                    })
                })
            });
        p1.then((payload) => {
            console.log("payload1", payload)
            dispatch('fbUpdateUser', payload)
        })

        // firebaseDb.ref('users/').orderByChild('uid').equalTo(userId).on("value", function(snapshot) {
        //     snapshot.forEach(function(data) {
        //         // console.log('pagination1', data.key)
        //         payload.id = data.key
        //         console.log('payload', payload)

        //         let userRef = firebaseDb.ref('users/' + payload.id)
        //         userRef.update(payload.updates, error => {
        //             if (error) {
        //                 showErrorMessage(error.message)
        //             } else {

        //                 // console.log("userpayloadkeys", payload.updates)
        //                 // let keys = Object.keys(payload.updates)
        //                 // if (!(keys.includes('completed') && keys.length == 1)) {
        //                 //     // Notify.create('User updated!')
        //                 // }
        //             }
        //         })

        //         // dispatch('fbUpdateUser', payload)

        //     });

        // });
    },
    updateLocation({ dispatch }, payload) {
        dispatch('fbUpdateLocation', payload)
    },
    updateTotalLocation({ dispatch }, payload) {
        dispatch('fbUpdateTotalLocation', payload)
    },
    deleteLocation({ dispatch }, id) {
        dispatch('fbDeleteLocation', id)
    },
    deleteTotalLocation({ dispatch }, id) {
        dispatch('fbDeleteTotalLocation', id)
    },
    addUser({ dispatch }, user) {
        let userId = uid()
        console.log('uid', )
        let payload = {
            id: userId,
            user: user
        }
        dispatch('settings/fbReadUserData', null, { root: true });
        dispatch('fbAddUser', payload)
    },
    addLocation({ dispatch }, location) {
        let locationId = uid()
        let payload = {
            id: locationId,
            location: location
        }
        dispatch('fbAddLocation', payload)
        dispatch('settings/fbReadLocationData', null, { root: true });


    },
    addTotalLocation({ dispatch }, location) {
        let locationId = uid()
        let payload = {
            id: locationId,
            location: location
        }
        dispatch('fbAddTotalLocation', payload)
        dispatch('settings/fbReadTotalLocationData', null, { root: true });


    },
    getallTasks({ dispatch }, plateNum) {
        Loading.show()
        let user, userKey

        let users = firebaseDb.ref('tasks')
        let p1 = new Promise(
            (resolve, reject) => {
                users.on('value', snapshot => {
                    user = snapshot.val()
                    userKey = Object.keys(user)

                    resolve(userKey)

                })
            });
        p1.then((userKey) => {

                // console.log("plateNum", plateNum)
                let payload = {
                    user: userKey,
                    plateNum: plateNum
                }

                dispatch('fbgetallTasks', payload)
            }

        );

    },

    fbgetallTasks({ dispatch, commit }, payload) {
        const user = payload.user;
        let plateNum = payload.plateNum;
        commit('deletePlateTask')

        user.forEach(function(userID) {
            firebaseDb.ref('tasks/' + userID).orderByChild('numtruck').equalTo(plateNum).on("value", function(snapshot) {
                console.log("A ", snapshot.val());
                if (!snapshot.exists()) {
                    setTimeout(function() {
                        Loading.hide()
                    }, 1000)
                }
                snapshot.forEach(function(data) {
                    console.log("B ", data.val());
                    if (data.val().centralLocation != "") {
                        //finding data with centralLocation variable on centrallocation table

                        let payload = {
                            id: data.key,
                            driverTask: data.val()
                        }
                        let centralLocationName = data.val().centralLocation
                        console.log("cl", data.val(), user)
                        let totalLocationName = data.val().totalLocation
                        payload.driverTask.plateNum = plateNum
                        user.forEach(function(userID1) {
                            try {
                                firebaseDb.ref('locations/' + 'K34JsrLVLpf6MRsSt1uddQHhbI93').orderByChild('name').equalTo(centralLocationName).on("value", function(snapshot1) {
                                    console.log("sss", snapshot1.exists())
                                    if (snapshot1.exists()) {

                                        snapshot1.forEach(function(data1) {
                                            console.log('ccc', data1.val())
                                            payload.driverTask.centralLocationData = data1.val()

                                        });
                                    }
                                });

                            } catch (error) {
                                console.log('eee')
                            }
                        })
                        console.log('ddd')
                        user.forEach(function(userID2) {
                            try {

                                firebaseDb.ref('totalLocations/' + 'K34JsrLVLpf6MRsSt1uddQHhbI93').orderByChild('name').equalTo(totalLocationName).on("value", function(snapshot2) {
                                    if (snapshot2.exists()) {

                                        snapshot2.forEach(function(data2) {
                                            payload.driverTask.totalLocationData = data2.val()
                                            console.log("plate ", payload);
                                            commit('readPlateTask', payload)
                                        });
                                    } else {
                                        // payload.driverTask.totalLocationData = []
                                        // console.log("plate ", payload);
                                        // commit('readPlateTask', payload)

                                    }
                                });
                                console.log("bbb")
                            } catch (error) {

                            }
                        })


                    } else {
                        setTimeout(function() {
                            Loading.hide()
                        }, 1000)
                    }

                });
            });
        });



        // firebaseDb.ref().child('locations').once('value', function(snapshot) {
        //     snapshot.forEach(function(snapshot1) {
        //         console.log("A1 ", snapshot1.key); // e.g. "http://..."
        //         snapshot1.forEach(function(childSnapshot) {
        //             console.log("child1 ", childSnapshot.key); // e.g. "20170116"
        //             childSnapshot.forEach(function(grandchildSnapshot) {
        //                 console.log("grandchildkey ", grandchildSnapshot.key); // e.g. "-Kb9...gkE"
        //                 console.log("grandchildval ", grandchildSnapshot.val()); // "pne"
        //             });
        //             // childSnapshot.orderByChild("name").equalTo("22222").on('child_added', function(snap2) {
        //             //     console.log("grand", snap2.val());
        //             // });
        //         });
        //     });
        // });


    },

    fbCheckRole({ commit }) {
        let userEmail = firebaseAuth.currentUser.email

        firebaseDb.ref('users/').orderByChild('email').equalTo(userEmail).on("value", function(snapshot) {

            snapshot.forEach(function(data) {
                console.log('tag', data.val())
                let role = data.val().role
                let payload = role
                let payload1 = {
                    uid: data.val().uid,
                    userRole: role,
                    company: data.val().company,
                    email: data.val().email,
                    rowsPerPage: data.val().rowsPerPage
                }
                commit('checkRole', payload)
                commit('checkUserData', payload1)
                LocalStorage.set('loggedIn', payload)
            });
        });


    },

    fbReadUserData({ commit }) {
        let userId = firebaseAuth.currentUser.uid
        let users = firebaseDb.ref('users/')

        // initial check for data
        users.on('child_added', snapshot => {

            let user = snapshot.val()
            let payload = {
                id: snapshot.key,
                user: user
            }
            commit('addUser', payload)
        })

        users.on('child_changed', snapshot => {

            let user = snapshot.val()
            let payload = {
                id: snapshot.key,
                updates: user
            }
            commit('updateUser', payload)
        })

    },

    fbReadLocationData({ commit, dispatch }) {

        let userId = firebaseAuth.currentUser.uid
        console.log("Email ", firebaseAuth.currentUser.email);
        console.log('role', state.userRole)

        let locations = firebaseDb.ref('locations/' + userId)

        // if (LocalStorage.getItem("loggedIn") == "Admin") {
        //     commit('deleteLocations'); //intitial remove all locations state

        //     let user, userKey

        //     let users = firebaseDb.ref('locations')
        //     let p1 = new Promise(
        //         (resolve, reject) => {
        //             users.on('value', snapshot => {
        //                 user = snapshot.val()
        //                 userKey = Object.keys(user)

        //                 resolve(userKey)

        //             })
        //         });
        //     p1.then((userKey) => {

        //             userKey.forEach(function(userID) {
        //                 firebaseDb.ref('locations/' + userID).once('value', snapshot => {

        //                     snapshot.forEach(function(data) {

        //                         let payload = {
        //                             id: data.key,
        //                             location: data.val()
        //                         }
        //                         commit('addLocation', payload)
        //                     });
        //                 });
        //             });

        //         }

        //     );
        // } else {

        // initial check for data
        // locations.once('value', snapshot => {
        //     let location = snapshot.val()
        //     let payload = {
        //         id: snapshot.key,
        //         location: location
        //     }
        //     console.log('fbReadLocationData', location)
        //     commit('addLocation', payload)
        // }, error => {

        // })
        commit('deleteLocations'); //intitial remove all locations state
        locations.on('child_added', snapshot => {
            let location = snapshot.val()
            let payload = {
                id: snapshot.key,
                location: location
            }

            commit('addLocation', payload)
        })

        locations.on('child_changed', snapshot => {
            let location = snapshot.val()
            let payload = {
                id: snapshot.key,
                updates: location
            }
            commit('updateLocation', payload)
        })

        // child removed
        locations.on('child_removed', snapshot => {
                let locationId = snapshot.key
                commit('deleteLocation', locationId)
            })
            // }




    },
    fbReadTotalLocationData({ commit }) {
        let userId = firebaseAuth.currentUser.uid
        let totalLocations = firebaseDb.ref('totalLocations/' + userId)

        // if (LocalStorage.getItem("loggedIn") == "Admin") {
        //     commit('deleteTotalLocations'); //intitial remove all locations state

        //     let user, userKey

        //     let users = firebaseDb.ref('locations')
        //     let p1 = new Promise(
        //         (resolve, reject) => {
        //             users.on('value', snapshot => {
        //                 user = snapshot.val()
        //                 userKey = Object.keys(user)

        //                 resolve(userKey)

        //             })
        //         });
        //     p1.then((userKey) => {


        //             userKey.forEach(function(userID) {
        //                 firebaseDb.ref('totalLocations/' + userID).once('value', snapshot => {

        //                     snapshot.forEach(function(data) {
        //                         console.log("totallocationB ", data.key);
        //                         let payload = {
        //                             id: data.key,
        //                             totalLocation: data.val()
        //                         }
        //                         commit('addTotalLocation', payload)
        //                     });
        //                 });
        //             });

        //         }

        //     );
        // } 

        commit('deleteTotalLocations');
        // initial check for data
        totalLocations.on('child_added', snapshot => {
            let totalLocation = snapshot.val()
            let payload = {
                id: snapshot.key,
                totalLocation: totalLocation
            }

            commit('addTotalLocation', payload)
        })

        totalLocations.on('child_changed', snapshot => {
            let totalLocation = snapshot.val()
            let payload = {
                id: snapshot.key,
                updates: totalLocation
            }
            commit('updateTotalLocation', payload)
        })

        // child removed
        totalLocations.on('child_removed', snapshot => {
            let totalLocationId = snapshot.key
            commit('deleteTotalLocation', totalLocationId)
        })


    },
    fbAddUser({}, payload) {
        console.log("payl", payload)
        let userId = firebaseAuth.currentUser.uid
        let userRef = firebaseDb.ref('users/' + payload.id)
            // payload.user.rowsPerPage = 5
            // console.log("email", id)
        userRef.set(payload.user, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                Notify.create('User added!')
            }
        })
    },
    fbAddLocation({}, payload) {
        let userId = firebaseAuth.currentUser.uid
        let locationRef = firebaseDb.ref('locations/' + userId + '/' + payload.id)
        locationRef.set(payload.location, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                Notify.create('Location added!')
            }
        })
    },
    fbAddTotalLocation({}, payload) {
        let userId = firebaseAuth.currentUser.uid
        let totalLocationRef = firebaseDb.ref('totalLocations/' + userId + '/' + payload.id)
        totalLocationRef.set(payload.location, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                Notify.create('TotalLocation added!')
            }
        })
    },
    fbDeleteLocation({}, locationId) {
        let userId = firebaseAuth.currentUser.uid
        let locationRef = firebaseDb.ref('locations/' + userId + '/' + locationId)
        locationRef.remove(error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                Notify.create('Location deleted!')
            }
        })
    },
    fbDeleteTotalLocation({}, locationId) {
        let userId = firebaseAuth.currentUser.uid
        let totalLocationRef = firebaseDb.ref('totalLocations/' + userId + '/' + locationId)
        totalLocationRef.remove(error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                Notify.create('TotalLocation deleted!')
            }
        })
    },
    fbUpdateUser({}, payload) {

        let userId = firebaseAuth.currentUser.uid
        let userRef = firebaseDb.ref('users/' + payload.id)
        console.log('payload', payload)
        userRef.update(payload.updates, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                console.log("userpayloadkeys", payload.updates)
                let keys = Object.keys(payload.updates)
                if (!(keys.includes('completed') && keys.length == 1)) {
                    // Notify.create('User updated!')
                }
            }
        })
    },
    fbUpdateLocation({}, payload) {
        let userId = firebaseAuth.currentUser.uid
        let locationRef = firebaseDb.ref('locations/' + userId + '/' + payload.id)
        locationRef.update(payload.updates, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                let keys = Object.keys(payload.updates)
                if (!(keys.includes('completed') && keys.length == 1)) {
                    Notify.create('Location updated!')
                }
            }
        })
    },
    fbUpdateTotalLocation({}, payload) {
        let userId = firebaseAuth.currentUser.uid
        let totalLocationRef = firebaseDb.ref('totalLocations/' + userId + '/' + payload.id)
        totalLocationRef.update(payload.updates, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                let keys = Object.keys(payload.updates)
                if (!(keys.includes('completed') && keys.length == 1)) {
                    Notify.create('TotalLocation updated!')
                }
            }
        })
    },
    setShow12HourTimeFormat({ commit, dispatch }, value) {
        commit('setShow12HourTimeFormat', value)
        dispatch('saveSettings')
    },
    setShowTasksInOneList({ commit, dispatch }, value) {
        commit('setShowTasksInOneList', value)
        dispatch('saveSettings')
    },
    saveSettings({ state }) {
        LocalStorage.set('settings', state.settings)
    },
    getSettings({ commit }) {
        let settings = LocalStorage.getItem('settings')
        if (settings) {
            commit('setSettings', settings)
        }
    }
}

const getters = {
    settings: state => {
        return state.settings
    },

    users: state => {
        return state.users
    },
    locations: state => {

        return state.locations
    },
    totalLocations: state => {
        return state.totalLocations
    },
    userRole: state => {
        return state.userRole
    },
    userData: state => {
        return state.userData
    },
    plateTask: state => {
        console.log("state-platetask", state.plateTask)
        return state.plateTask
    },


}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}