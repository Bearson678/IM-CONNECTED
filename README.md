# Elements of Software Engineering 50.003 2025 Project
## CT12

## About
IM-CONNECTED is a project under 50.003 Elements of Software Construction. The goal is to design a webapp designed for LionDefenders's needs to allievate the stresses and workload experienced by Caregivers.

## How to run 
### Locally without docker
1. `Clone this repository` and `navigate` to the the folder containing your local copy
2. run `npm i` to install all the dependencies
3. In .env, `NODE_ENV=development`
4. In VSC or your preffered IDE, run `npm run dev:all`

### Locally with docker
1. `Clone this repository` and `navigate` to the the folder containing your local copy
2. Download Docker desktop and ensure it is open
3. In VSC or ur preffered IDE, in WSL or your preffered linux container run: `dos2unix docker.sh`
4. In .env, `NODE_ENV=production`
5. `./docker.sh build` to build the containers
6. `./docker.sh start` to start the copy
7. Remember to do `./docker.sh stop`before ending your session, if not you might need to do `docker system prune -a --volumes` when u try rebuilding as there might be errors

### Railway deployment 
1. Run `https://im-connected-production.up.railway.app`
2. It can be run all device sizes including `phone, ipad and computer`

## Features

### Main Features

### (a) Medicine Scanner + Logger
#### Frontend Features
- Image Upload Interface
- Real-time Processing Feedback
- Care Recipient Management
- Medication Database Display

#### Backend Features
- Advanced OCR Processing
- 6-variant image preprocessing using Tesseract
- Multi-Database Cascade
- FDA → NIH → RxNav → OpenFDA sequential lookup
- AI Fallback System
- OpenAI integration for comprehensive medication coverage

<img src="pictures\19.png">

### (b) AI Chatbot

#### Frontend Features
- Convenient 24/7 emotional support
- Chatbot remembers contextual history
- Multilingual support
- Summarizes forum posts

#### Backend Features
- Any prompt on the frontend goes to our backend server which queries the database for the conversation’s threadId
- Retrieves that conversation Id if it exist, otherwise sends a POST request to openAI’s assistant api to create one, then saves it the database for future use
- Once the threadId is settled, it is used to establish a http stream with openAI’s assistant API endpoint
- Any requests to summarize posts will lead to openAI calling our backend server-side function to retrieve the post content via post name from the database for shortening

<img src="pictures\11.png">

### (c) Forum

#### Frontend Features
- Dynamic sizing of font, allowing the web app to run seamlessly on a phone
- supports mutilayered comments as well as image & video upload
- Accessibility features: 
    - All 4 official languages of Singapore are supported
    - Screen reader support through larger font size & easy content mode
#### Backend
- MVC Framework 
- Standard CRUD Operations for all entities.
- Utilization for Google Cloud Services 
    - E.g: Translate & Google Cloud Storage
- Standard Encryption for sensitive data and media uploads

<img src="pictures\16.png">
<img src="pictures\17.png">
<img src="pictures\18.png">

### Other Features


### Splash Screen 
<img src="pictures\20.png">

### Login / Sign Up
Users can login, sign up and change password for an account. An otp will be sent to their email account asking them for verification.

<img src="pictures\13.png">
<img src="pictures\14.png">


### Preferences
<img src="pictures\21.png">

### Dashboard
The main page providing an overview of our features.
<img src="pictures\15.png">

### Profie
Users can 
<img src="pictures\12.png">

## Routers
- `/`, default page, loads splashscreen
- `/signup`, loads sign up page
- `/signin`, loads sign in page
- `/preferences`, loads preferences page
- `/emailauthentication`, for checking your email is valid when first registering an account
- `/forgetpasword`, used to change user's pasword
- `/dashboard`, loads dashboard
- `/forum`, loads forum
- `/forum/newpost`, when users wants to create a post / view drafts / post draft
- `/forum/viewpost`, when user clicks on a certain post to see its contents
- `/forum/mypost`, to see user's posted posts
- `/forum/savedpost`, shows user's saved posts
- `/medication`, to load medicine scanner in 
- `/chatbot`, loads ai chatbot page
- `/profile`, loads profile page


## Testing
Jest is used as the core testing suite for backend unit testing while Vitest and react-testing module are the test suites for frontend unit testing.
For Integration testing, we've used the call-graph based integration testing to simulate real-case data flow and test serveral use cases to validate our code.
Top-down orientation was choosen as the preferred way of testing due to the added benefit of fault separation and clear identification of which sections of the code are being tested.
For End-to-End testing, Cypress is used to simulate use cases with the full integration of frontend and backend code as a collective.
For Fuzzy testing, Apache JMeter is used to generate numerous test inputs and run our api calls indefinitely so as to identify unexpected vulnerabilities that we may have not spotted.
### Unit Testing
To run a specific unit test from the backend, type `npm run test /name/of/test/file` in the terminal.
To run all the tests from the frontend, type `npm run frondendtest` in the terminal.
### Integration Testing
To run a specific integration test from the backend, type `npm run test /name/of/test/file` in the terminal.
To run a set of integration tests from a specific use case from the backend, type `npm run test backendtest:forum/integration/usecasename` in the terminal.

### End-to-end Testing
To load up Cypress, run `npm run cypress` in the terminal.
Select your preferred browser to run the test on.
Select your use case of choice.

### Fuzzy Testing
Ensure that Apache JMeter is installed, and open `jmeter.bat` under apache-jmeter-5.6.3\bin.
Under the JMeter GUI, open a file of the `.jmx` extension.
Click the green play button to start running the test.







