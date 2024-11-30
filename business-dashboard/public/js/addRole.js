
function addRole(activityId) {

    const roleDiv = document.querySelector(`div[data-activity-id="${activityId}"]`);
    const roleBtn = roleDiv.querySelector('button[data-role-id="roleBtn"]');

    roleBtn.style.display = 'none'; //It disappears, otherwise it would be duplicated and be clickable multiple times. It reappears after the form is submitted.

    // Create unique ids for each form
    const roleId = 'role' + activityId;
    const roleTimeId = 'roleTime' + activityId;
    const roleDescriptionId = 'roleDescription' + activityId;

    // Create a new div to hold the form
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form style="padding: 10px;" onsubmit="event.preventDefault()">
        <label for="role">Role:</label>
        <input type="text" id="${roleId}" name="role" autocomplete="off" required><br>
        <label for="roleDescription">Description:</label>
        <input type="text" id="${roleDescriptionId}" name="roleDescription" autocomplete="off" required><br>
        <label for="time">Time:</label>
        <input type="time" id="${roleTimeId}" name="time" required><br>
        <button onclick="roleForm(${activityId})">Submit</button>
        </form>`;

    roleDiv.appendChild(formContainer);
    roleDiv.style.padding = '10px';
}
