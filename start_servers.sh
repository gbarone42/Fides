
# Array of directories
directories=(
  "./register-service"
  "./employee-dashboard"
  "./business-dashboard"
  "./matching-service"
)

# Function to start a server
start_server() {
  cd "$1" || exit
  folder_name=$(basename "$1")
  echo "Starting server in $1"
  #npm install ../shared   ---   Run this only the first time, to install the config dependencies
  nodemon server.js > "${folder_name}_log.txt" 2>&1 &
  cd - > /dev/null
}

# Loop through directories and start servers
for dir in "${directories[@]}"; do
  start_server "$dir"
done

echo "All servers started. Press Ctrl+C to stop all servers."

# Wait for user input to keep the script running
read -r -d '' _ </dev/tty