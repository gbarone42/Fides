
async function fetchActivities() {
    const response = await fetch('http://localhost:4000/activities');
    const activities = await response.json();
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.style.cssText = 'border: 1px solid black; padding: 10px; margin: 10px;';

        item.textContent = `${activity.title} - ${activity.description} - ${activity.date} ${activity.time} at ${activity.place} - Created by: ${activity.username} (${activity.role})`;

        //button to delete activity --> deleteActivity(id)
        item.innerHTML += `<button style="margin: 3px;" onclick="deleteActivity(${activity.id})" style="display: block;">Delete</button>`;

        //button to search for matches --> searchMatchingActivities(id)
        item.innerHTML += `<button style="margin: 3px;" onclick="searchMatchingActivities(${activity.id})" style="display: block;">Search matches</button>`;

        //button to show roles --> showRoles()
        item.innerHTML += `<div data-show-roles-for="${activity.id}"><button style="margin: 3px;" onclick="fetchRoles(${activity.id})" style="display: block;">Show roles</button></div>`;

        //button to add role --> addRole()
        item.innerHTML += `<div data-role-form="${activity.id}"><button style="margin: 3px;" data-role-id="roleBtn" onclick="addRole(${activity.id})" style="display: block;">Add role</button></div>`;

        item.setAttribute('data-activity-id', activity.id);

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