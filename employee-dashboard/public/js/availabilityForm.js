
document.getElementById('availability-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const place = document.getElementById('place').value;

    const employee_id = UserState.id;
    await fetch('http://localhost:3000/availability', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id, date, time, place })
    });

    fetchAvailability(); // Refresh the availability list
});

// Fetch availability on page load
fetchAvailability();
