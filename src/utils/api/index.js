import axios from 'axios'


/**
 * Create axios client
 */
const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })


/**
 * Set Interceptors
 *
 * @return {number}
 */
const setInterceptors = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    return axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            return { data: error.response, status: error.response.status }
        })
}


/**
 * Get URL
 *
 * @param route
 * @param properties
 * @return {*}
 */
const getUrlFromRouteProps = (route, properties) => {
    if (properties) {
        for (const [key, value] of Object.entries(properties)) {
            if (value) {
                route = route.replace(`{${key}}`, String(value))
            }
        }
    }

    return import.meta.env.VITE_API_BASE_URL + route
}

/**
 * Create request
 *
 * @param service
 * @return {function(*, *, *): Promise<{data: *, meta, links, status: *}>}
 */
const createRequest = (service) => {
    return async (properties, body, headers) => {
        const response = await axiosInstance[service.method](getUrlFromRouteProps(service.route, properties), body, headers)

        return {
            data: response.data,
            status: response.status,
            // meta: response.data?.meta || null,
            // links: response.data?.links || null,
        }
    }
}


/**
 * Create API service
 *
 * @param mapServices
 * @return {{}}
 */
const createServices = (mapServices) => {
    setInterceptors()

    const services = {}

    if (mapServices) {
        for (const [key, value] of Object.entries(mapServices)) {
            services[key] = createRequest(value)
        }
    }

    return services
}

export default createServices
