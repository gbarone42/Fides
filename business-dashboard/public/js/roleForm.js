
document.getElementById('role-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('role').value;
    const description = document.getElementById('description').value;
    const time = document.getElementById('time').value;

    await fetch('http://localhost:4000/activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, description, time })
    });

    // fetchActivities();
});