
async function searchMatchingAvailability(availabilityId) {

    try {
        const response = await fetch(`http://localhost:3000/matching-availability/${availabilityId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.message === 'No matches found') {
            document.getElementById('matching-availability-list').innerHTML = 'No matches found';
            return;
        }

        const activities = await response.json();
        const activitiesList = document.getElementById('matching-availability-list');
        activitiesList.innerHTML = '';

        activities.forEach(activity => {
            const formattedDate = new Date(activity.date).toISOString().split('T')[0];

            const item = document.createElement('div');
            item.setAttribute('data-activity-match-id', activity.id);

            item.innerHTML = `<p><strong>MATCH FOUND</strong></p> <p><strong>Activity:</strong> ${activity.activity}</p> <p><strong>Date:</strong> ${formattedDate}</p> <p><strong>Time:</strong> ${activity.time}</p> <p><strong>Place:</strong> ${activity.place}</p>`;

            activitiesList.appendChild(item);

            item.innerHTML += `<button onclick="seeRoles(${activity.id}, ${availabilityId})">See available roles</button>`;
        });

    } catch (error) {
        console.error('Error fetching matching activities:', error);
        document.getElementById('matching-availability-list').innerHTML = 'Failed to load matching activities';
    }

}