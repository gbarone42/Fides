
/* Custom configuration */

module.exports = {
    services: {
        LOGIN: 'http://localhost:5000/web/login',
        EMPLOYEE_DASHBOARD: 'http://localhost:3000/employee_dashboard',
        BUSINESS_DASHBOARD: 'http://localhost:4000/business_dashboard'
    },
    authMiddleware : require('./auth-middleware')
}