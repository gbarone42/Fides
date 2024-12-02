
async function fetchActivities() {
    const response = await fetch('http://localhost:4000/activities', {
        credentials: 'include'
    });
    const activities = await response.json();
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.classList.add('activity-item');

        const formattedDate = new Date(activity.date).toLocaleDateString();
        item.innerHTML = `<p><strong>TITLE:</strong> ${activity.title}</p> <p><strong>DESCRIPTION:</strong> ${activity.description}</p> <p><strong>DATE AND TIME:</strong> ${formattedDate} ${activity.time} at ${activity.place}</p> <p><strong>Creato da - </strong> ${activity.username}</p>`;

        //button to delete activity --> deleteActivity(id)
        item.innerHTML += `<button onclick="deleteActivity(${activity.id})">Delete</button>`;

        //button to search for matches --> searchMatchingActivities(id)
        item.innerHTML += `<button onclick="searchMatchingActivities(${activity.id})">Search matches</button>`;

        //button to show roles --> showRoles()
        item.innerHTML += `<div data-show-roles-for="${activity.id}"><button onclick="fetchRoles(${activity.id})">Show roles</button></div>`;

        //button to add role --> addRole()
        item.innerHTML += `<div data-role-form="${activity.id}"><button data-role-id="roleBtn" onclick="addRole(${activity.id})">Add role</button></div>`;

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