
 // Show all matching availabilities for a certain activity
async function searchMatchingActivities(activityId) {
    try {

        const response = await fetch(`http://localhost:4000/matching-activities/${activityId}`, {
            headers: {
                // 'Authorization': `Bearer ${token}`, //DO I need this?
                'Content-Type': 'application/json',
                credentials: 'include'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const activities = await response.json();
        const activityList = document.getElementById('matching-activity-list');
        activityList.innerHTML = '';

        activities.forEach(activity => {
            const formattedDate = new Date(activity.date).toISOString().split('T')[0];
            const item = document.createElement('div');

            item.innerHTML = `<p><strong>MATCH FOUND:</strong> ${formattedDate} ${activity.time} at ${activity.place}</p> <p>Created by: ${activity.username} (${activity.role})</p>`;

            // item.textContent = `MATCHING AVAILABILITY --> ${formattedDate} ${activity.time} at ${activity.place} - Created by: ${activity.username} (${activity.role})`;
            activityList.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching matching activities:', error);
        document.getElementById('matching-activity-list').innerHTML = 'Failed to load matching activities';
    }
}

/* async function searchMatchingActivities(activityId) {
    const token = localStorage.getItem('token');
    console.log('TOKEN is: ', token);

    const response = await fetch(`http://localhost:4000/matching-activities/${activityId}`,
            { headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }}
    );
    const activities = await response.json();
    const activityList = document.getElementById('matching-activity-list');
    activityList.innerHTML = '';

    // Matches from employees' availabilities
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.textContent = `${activity.title} - ${activity.description} - ${activity.date} ${activity.time} at ${activity.place} - Created by: ${activity.username} (${activity.role})`;
        // item.innerHTML += `<button onclick="deleteActivity(${activity.id})">Delete</button>`;
        activityList.appendChild(item);
    });
} */