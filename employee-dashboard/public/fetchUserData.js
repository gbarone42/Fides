
const UserState = {
    id: null,
    email: null,
    role: null,
    
    // Method to set user data
    setUser(userData) {
        this.id = userData.id;
        this.email = userData.email;
        this.role = userData.role;
    },
    
    // Method to clear user data
    clearUser() {
        this.id = null;
        this.email = null;
        this.role = null;
    }
};

// Wait for page load before fetching data
document.addEventListener('DOMContentLoaded', function() {

    fetch('http://localhost:3000/api/employee_dashboard', {
        method: 'GET',
        credentials: 'include', // Sends cookies with the request
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            window.location.href = 'http://localhost:5000/web/login';
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(data => {
        UserState.setUser(data.user);
        // loadUserData(UserState);
    })
    .catch(error => console.error('Error fetching dashboard data:', error));

});
