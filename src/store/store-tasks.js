import Vue from 'vue'
import { LocalStorage, uid, Notify } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
    tasks: {

    },
    search: '',
    sort: 'name',
    tasksDownloaded: false,
    companies: {}
}

const mutations = {
    deleteTasks(state) {
        state.tasks = {}
    },
    readCompany(state, payload) {
        Vue.set(state.companies, payload.id, payload.company)
    },
    updateTask(state, payload) {
        console.log('taskupdatePayload', payload)
        Object.assign(state.tasks[payload.id], payload.updates)
    },
    deleteTask(state, id) {
        Vue.delete(state.tasks, id)
    },
    addTask(state, payload) {
        Vue.set(state.tasks, payload.id, payload.task)
        console.log("statetasks", state.tasks)
    },
    clearTasks(state) {
        state.tasks = {}
    },
    setSearch(state, value) {
        state.search = value
    },
    setSort(state, value) {
        state.sort = value
    },
    setTasksDownloaded(state, value) {
        state.tasksDownloaded = value
    }
}

const actions = {
    updateTask({ dispatch }, payload) {
        dispatch('fbUpdateTask', payload)
    },
    deleteTask({ dispatch }, payload) {
        console.log('deletetask', payload)
        dispatch('fbDeleteTask', payload)
    },
    addTask({ dispatch }, task) {
        let taskId = uid()
        let payload = {
            id: taskId,
            task: task
        }
        dispatch('fbAddTask', payload)
    },
    setSearch({ commit }, value) {
        commit('setSearch', value)
    },
    setSort({ commit }, value) {
        commit('setSort', value)
    },

    fbReadData({ commit }) {

        let userId = firebaseAuth.currentUser.uid
        let userTasks = firebaseDb.ref('tasks/' + userId)
        setTimeout(function() {
            if (LocalStorage.getItem("loggedIn") == "Admin" || LocalStorage.getItem("loggedIn") == "Loader" || LocalStorage.getItem("loggedIn") == "Harbour Staff") {

                commit('deleteTasks')
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

                        userKey.forEach(function(userID) {
                            firebaseDb.ref('tasks/' + userID).once('value', snapshop => {

                                commit('setTasksDownloaded', true)
                            }, error => {
                                showErrorMessage(error.message)
                                this.$router.replace('/auth')
                            })

                            firebaseDb.ref('tasks/' + userID).on('value', snapshot => {

                                snapshot.forEach(function(data) {

                                    let payload = {
                                        id: data.key,
                                        task: data.val()
                                    }
                                    payload.task.userid = userID
                                    console.log("payloadADD", payload)
                                    commit('addTask', payload)
                                });
                            });
                            // firebaseDb.ref('tasks/' + userID).on('child_added', snapshot => {

                            //     snapshot.forEach(function(data) {

                            //         let payload = {
                            //             id: data.key,
                            //             task: data.val()
                            //         }
                            //         console.log("payload2", payload)
                            //         payload.task.userid = userID
                            //         commit('addTask', payload)
                            //     });
                            // });
                            firebaseDb.ref('tasks/' + userID).on('child_changed', snapshot => {

                                snapshot.forEach(function(data) {

                                    let payload = {
                                        id: data.key,
                                        task: data.val()
                                    }
                                    console.log("payload3", payload)
                                    commit('updateTask', payload)
                                });
                            });
                            firebaseDb.ref('tasks/' + userID).on('child_removed', snapshot => {
                                console.log('deletesnapshot', snapshot)
                                commit('deleteTask', snapshot.key)
                            });
                        });

                    }

                );
            } else {
                commit('deleteTasks')

                // initial check for data
                userTasks.once('value', snapshop => {

                    commit('setTasksDownloaded', true)
                }, error => {
                    showErrorMessage(error.message)
                    this.$router.replace('/auth')
                })

                // child added
                userTasks.on('child_added', snapshot => {
                    let task = snapshot.val()
                    let payload = {
                        id: snapshot.key,
                        task: task
                    }
                    console.log("payloadADD", payload)
                    payload.task.userid = userId
                    commit('addTask', payload)
                })

                // child changed
                userTasks.on('child_changed', snapshot => {
                    let task = snapshot.val()
                    let payload = {
                        id: snapshot.key,
                        updates: task
                    }
                    console.log("payload3", payload)
                    commit('updateTask', payload)
                })

                // child removed
                userTasks.on('child_removed', snapshot => {
                    let taskId = snapshot.key
                    commit('deleteTask', taskId)
                })
            }

        }, 1000);

    },
    fbAddTask({}, payload) {
        let userId = firebaseAuth.currentUser.uid
        let userEmail = firebaseAuth.currentUser.email

        let userCompany

        firebaseDb.ref('users/').orderByChild('email').equalTo(userEmail).on("value", function(snapshot) {

            snapshot.forEach(function(data) {
                console.log("userdata", data.val())
                userCompany = data.val().company
                if (LocalStorage.getItem("loggedIn") == "Admin" || LocalStorage.getItem("loggedIn") == "Loader" || LocalStorage.getItem("loggedIn") == "Hurbour Staff") {
                    console.log('tag', payload.task.compName)
                    firebaseDb.ref('users/').orderByChild('company').equalTo(payload.task.compName).on("value", function(snapshot) {
                        snapshot.forEach(function(data) {
                            console.log("userdata1", data.val())
                            let uid = data.val().uid
                            let taskRef = firebaseDb.ref('tasks/' + uid + '/' + payload.id)
                            taskRef.set(payload.task, error => {
                                if (error) {
                                    showErrorMessage(error.message)
                                } else {
                                    Notify.create('Task added!')
                                }
                            })
                        })
                    })

                } else {

                    if (LocalStorage.getItem("loggedIn") == "Dispatcher") {

                        payload.task.compName = userCompany
                    }
                    console.log("taskpayload", payload)
                    let taskRef = firebaseDb.ref('tasks/' + userId + '/' + payload.id)
                    taskRef.set(payload.task, error => {
                        if (error) {
                            showErrorMessage(error.message)
                        } else {
                            Notify.create('Task added!')
                        }
                    })
                }
            });
        });



    },
    fbUpdateTask({}, payload) {
        // let userId = firebaseAuth.currentUser.uid
        let userId = payload.updates.userid
        console.log("payload", payload)
        let taskRef = firebaseDb.ref('tasks/' + userId + '/' + payload.id)
        taskRef.update(payload.updates, error => {
            if (error) {
                showErrorMessage(error.message)
            } else {
                let keys = Object.keys(payload.updates)
                if (!(keys.includes('completed') && keys.length == 1)) {
                    Notify.create('Task updated!')
                }
            }
        })
    },
    fbDeleteTask({ commit }, payload) {
        console.log('deleteuserid', payload.userid)
            // let userId = firebaseAuth.currentUser.uid
        let userId = payload.userid
        let taskId = payload.id
        let taskRef = firebaseDb.ref('tasks/' + userId + '/' + taskId)
        taskRef.remove(error => {
                if (error) {
                    showErrorMessage(error.message)
                } else {
                    Notify.create('Task deleted!')
                }
            })
            // commit('deleteTask', taskId)
    },
    fbReadCompany({ commit }) {
        let userId = firebaseAuth.currentUser.uid
        let users = firebaseDb.ref('users/')

        users.on('child_added', snapshot => {

            let user = snapshot.val()
            let payload = {
                id: snapshot.key,
                company: user.company
            }
            commit('readCompany', payload)

        })
    }
}

const getters = {
    tasksSorted: (state) => {
        let tasksSorted = {},
            keysOrdered = Object.keys(state.tasks)

        keysOrdered.sort((a, b) => {
            let taskAProp = state.tasks[a][state.sort].toLowerCase(),
                taskBProp = state.tasks[b][state.sort].toLowerCase()

            if (taskAProp > taskBProp) return 1
            else if (taskAProp < taskBProp) return -1
            else return 0
        })

        keysOrdered.forEach((key) => {
            tasksSorted[key] = state.tasks[key]
        })

        return tasksSorted
    },
    tasksFiltered: (state, getters) => {

        let tasksSorted = getters.tasksSorted,
            tasksFiltered = {}
        if (state.search) {
            Object.keys(tasksSorted).forEach(function(key) {
                let task = tasksSorted[key],
                    taskNameLowerCase = task.name.toLowerCase(),
                    searchLowerCase = state.search.toLowerCase()
                if (taskNameLowerCase.includes(searchLowerCase)) {
                    tasksFiltered[key] = task
                }
            })
            return tasksFiltered
        }
        return tasksSorted
    },
    tasksTodo: (state, getters) => {
        let tasksFiltered = getters.tasksFiltered
        console.log('tasksfilter', tasksFiltered)
        let tasks = {}
        Object.keys(tasksFiltered).forEach(function(key) {
            let task = tasksFiltered[key]
            if (!task.completed) {
                tasks[key] = task
            }
        })
        return tasks
    },
    tasksCompleted: (state, getters) => {
        let tasksFiltered = getters.tasksFiltered
        let tasks = {}
        Object.keys(tasksFiltered).forEach(function(key) {
            let task = tasksFiltered[key]
            if (task.completed) {
                tasks[key] = task
            }
        })
        return tasks
    },
    companies: state => {
        return state.companies
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}