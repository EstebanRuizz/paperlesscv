## Getting Started

To set up the project, follow these steps:

Install these docker images in your local machine:
docker pull grafana/grafana:latest; 
docker pull keycloak/keycloak:latest; 
docker pull quay.io/keycloak/keycloak:latest; 
docker pull redis:latest; 
docker pull mcr.microsoft.com/mssql/server:2022-latest; 
docker pull elasticsearch:7.17.9; 
docker pull ollama/ollama:latest;

1. **Add Environmental Variables**: 
   - Navigate to the project root directory.
   - Create a `.env` file if it doesn't exist already.
   - Add necessary environmental variables to the `.env` file. Refer to the project documentation for the required variables.

2. **Install Dependencies**:
   - Run `npm ci` in the terminal.
   - This will install all the required dependencies listed in the `package-lock.json` file.

3. **Start the Application**:
   - Once dependencies are installed, start the application using `npm start`.

4. **Start Development Server with Watch Mode**:
   - To run the application in development mode with file watching, use the command `npm run start:dev --watch`.
