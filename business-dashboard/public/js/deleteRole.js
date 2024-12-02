
async function deleteRole(roleId, activityId) {
    
    await fetch(`http://localhost:4000/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    const rolesDiv = document.querySelector(`div[data-show-roles-for="${activityId}"]`);
    rolesDiv.innerHTML = `<button  onclick="fetchRoles(${activityId})">Show roles</button>`;
    toggleRoles = false;
    fetchRoles(activityId);
}
