
async function searchActivities() {
    const query = document.getElementById('search-query').value;

    const response = await fetch(`http://localhost:4000/activities/search?title=${query}`);
    const activities = await response.json();
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');

        item.innerHTML = `<p>TITLE: ${activity.title}</p> <p>DESCRIPTION: ${activity.description}</p> <p>DATE & TIME: ${activity.date} ${activity.time} at ${activity.place}</p> <p>Created by: ${activity.username} (${activity.role})</p>`;

        // item.textContent = `${activity.title} - ${activity.description} - ${activity.date} ${activity.time} at ${activity.place} - Created by: ${activity.username} (${activity.role})`;
        item.innerHTML += `<button onclick="deleteActivity(${activity.id})">Delete</button>`;
        activityList.appendChild(item);
    });
}
