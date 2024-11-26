
/* Custom configuration */

module.exports = {
    services: {
        LOGIN: 'http://localhost:5000/web/login',
        EMPLOYEE_DASHBOARD: '/employee_dashboard',
        BUSINESS_DASHBOARD: '/business_dashboard'
    },
    authMiddleware : require('./auth-middleware')
}