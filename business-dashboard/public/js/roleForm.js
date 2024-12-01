
let toggleForm = false;

async function roleForm(activityId) {

    console.log('ToggleForm: ', toggleForm)
    if (toggleForm) {
        const formDiv = document.querySelector(`div[data-show-form-for="${activityId}"]`);
        formDiv.innerHTML = '<button onclick="roleForm(${activityId})" style="display: block;">➕</button>';
        toggleForm = false;
        return;
    }

    toggleForm = true;

    try {
        const role = document.getElementById('role' + activityId).value;
        const description = document.getElementById('roleDescription' + activityId).value;
        const time = document.getElementById('roleTime' + activityId).value;

        const response = await fetch(`http://localhost:4000/activities/roles/${activityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, description, time }),
        credentials: 'include' // If using sessions/cookies
        });

        alert('Role added successfully!');
        window.location.reload();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
