


async function fetchActivities() {
    const response = await fetch('http://localhost:4000/activities');
    const activities = await response.json();
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.textContent = `${activity.title} - ${activity.description} - ${activity.date} ${activity.time} at ${activity.place} - Created by: ${activity.username} (${activity.role})`;
        item.innerHTML += `<button onclick="deleteActivity(${activity.id})">Delete</button>`;
        item.innerHTML += `<button onclick="searchMatchingActivities(${activity.id})">Search matches</button>`; //button to search for matches --> searchMatchingActivities(id)
        item.innerHTML += `<button onclick="showRoles()">Show roles</button>`; //button to show roles --> showRoles()
        activityList.appendChild(item);
    });
}

fetchActivities();

// Get JWT from cookie
/* 
function getCookie(name) {
    const value = `; ${document.cookie}`;
    console.log('document.cookie is: ', value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
} */