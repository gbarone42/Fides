
/* Custom configuration */

module.exports = {
    services: {
        LOGIN: 'http://localhost:5000/web/login',
        EMPLOYEE_DASHBOARD: 'http://localhost:3000/activities',
        BUSINESS_DASHBOARD: 'http://localhost:4000/web/activities/'
    },
    authMiddleware : require('./auth-middleware')
}