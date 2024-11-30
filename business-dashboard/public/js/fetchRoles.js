
async function fetchRoles(activityId) {

    // const activityId = document.querySelector(`div[data-show-roles-for="${activityId}"]`);
    const response = await fetch(`http://localhost:4000/activities/${activityId}/roles`);
    const roles = await response.json();
    const roleList = document.createElement('div');
    const showRolesDiv = document.querySelector(`div[data-show-roles-for="${activityId}"]`);

    if (roles.length === 0) {
        roleList.style.cssText = 'border: 1px solid black; padding: 5px; margin: 5px;';
        roleList.textContent = 'No roles found for this activity';
        showRolesDiv.appendChild(roleList);
        return;
    }

    roleList.style.cssText = 'border: 1px solid black; padding: 10px; margin: 10px;';
    roleList.innerHTML = '<h3>Roles:</h3>';

    roles.forEach(role => {
        const roleItem = document.createElement('div');
        roleItem.style.cssText = 'border: 1px solid black; padding: 5px; margin: 5px;';
        roleItem.textContent = `${role.role} - ${role.description}`;
        roleList.appendChild(roleItem);
    });

    showRolesDiv.appendChild(roleList);
}