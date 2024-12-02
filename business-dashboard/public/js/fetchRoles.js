let toggleRoles = false;  // To toggle the roles display

async function fetchRoles(activityId) {

    if (toggleRoles) {
        const rolesDiv = document.querySelector(`div[data-show-roles-for="${activityId}"]`);
        rolesDiv.innerHTML = `<button onclick="fetchRoles(${activityId})">Show roles</button>`;
        toggleRoles = false;
        return;
    }

    toggleRoles = true;

    // const activityId = document.querySelector(`div[data-show-roles-for="${activityId}"]`);
    const response = await fetch(`http://localhost:4000/activities/${activityId}/roles`, {
        credentials: 'include'
    });
    const roles = await response.json();
    const roleList = document.createElement('div');
    const showRolesDiv = document.querySelector(`div[data-show-roles-for="${activityId}"]`);

    if (roles.length === 0) {
        // roleList.style.cssText = 'border: 1px solid black; padding: 5px; margin: 5px;';
        roleList.innerHTML = '<p><strong>No roles found for this activity</strong></p>';
        showRolesDiv.appendChild(roleList);
        return;
    }

    roleList.style.cssText = 'border: 1px solid black; padding: 10px; margin: 10px;';
    roleList.innerHTML = '<h3>Roles:</h3>';

    roles.forEach(role => {
        const roleItem = document.createElement('div');

        roleItem.innerHTML = `<p><strong>ROLE:</strong> ${role.role}</p> <p><strong>DESCRIPTION:</strong> ${role.description}</p> <p><strong>STATUS:</strong> ${role.status}</p>`;

        roleItem.innerHTML += `<button onclick="setPending(${role.id})" style="display: inline;">Set as pending</button>`;

        roleItem.innerHTML += `<button onclick="deleteRole(${role.id}, ${role.activity_id})" style="display: block;">Delete</button>`;
        roleList.appendChild(roleItem);
    });

    showRolesDiv.appendChild(roleList);
}