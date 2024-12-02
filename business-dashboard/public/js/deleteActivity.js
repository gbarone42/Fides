
async function deleteActivity(activityId) {
    await fetch(`http://localhost:4000/activities/${activityId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    fetchActivities();
}
