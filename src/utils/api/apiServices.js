import apiRoutes from './apiRoutes.js'
import apiRequestMethod from './apiRequestMethod.js'
import createServices from './index.js'

const apiMap = {
    getList: {
        method: apiRequestMethod.GET,
        route: apiRoutes.vacancies.getList
    }
}

const apiServices = createServices(apiMap)

export default apiServices
