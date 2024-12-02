
async function setPending(roleId) {

    const response = await fetch(`http://localhost:4000/roles/${roleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'pending' })
    });

    if (response.ok) {
        alert('Role set as pending');
        window.location.reload();
        fetchRoles(role.activity_id);
    } else {
        alert('Error setting role as pending');
    }

}