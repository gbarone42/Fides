
/* document.getElementById('roleForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('role').value;
    const description = document.getElementById('description').value;
    const time = document.getElementById('time').value;

    await fetch(`http://localhost:4000/activities/roles/${activityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, description, time })
    });

}); */

/* async function roleForm(activityId) {

    console.log('roleForm function is called: ', activityId);

    const role = document.getElementById('role').value;
    const description = document.getElementById('roleDescription').value;
    const time = document.getElementById('roleTime').value;

    await fetch(`http://localhost:4000/activities/roles/${activityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, description, time })
    });

} */

async function roleForm(activityId) {

    if (toggleForm) {
        const formDiv = document.querySelector(`div[data-show-form-for="${activityId}"]`);
        formDiv.innerHTML = '<button onclick="roleForm(${activityId})" style="display: block;">Add role</button>';
        toggleForm = false;
        return;
    }

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
