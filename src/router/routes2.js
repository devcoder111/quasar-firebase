const routes2 = [{

    path: '/',
    component: () =>
        import ('layouts/blank.vue'),
    children: [{
            path: '/',
            component: () =>
                import ('pages/PageTruckDriver.vue')
        },
        {
            path: '/truckdrivertask',
            component: () =>
                import ('pages/PageTruckDriverTask.vue'),
            props: true
        },
        {
            path: '/driverCentralLocation',
            component: () =>
                import ('pages/PageTruckCentralLoc.vue'),
            props: true
        },
        {
            path: '/driverTotalLocation',
            component: () =>
                import ('pages/PageTruckTotalLoc.vue'),
            props: true
        }



    ]
}]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes2.push({
        path: '*',
        component: () =>
            import ('pages/Error404.vue')
    })
}

export default routes2