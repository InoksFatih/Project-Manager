Project Manager
Project Manager is a web application designed to efficiently manage projects, tasks, and teams. It provides a range of features to create, update, and delete projects and tasks, assign tasks to team members, and track progress. Additionally, it includes a calendar component to visualize and manage tasks associated with specific projects and team members.

Table of Contents

Features
Technologies Used
Installation
Usage


Features
Project Management:
Create, update, and delete projects.
Task Management:
Create, update, and delete tasks, associating them with specific projects.
Tasks can include attachments and are assigned to team members.
Team Collaboration:
Assign tasks to team members.
Tasks can have subtasks, associated with the assigned team member.
Calendar View:
Visualize tasks associated with selected projects and team members.
Add, view, and edit tasks directly from the calendar.
Technologies Used
Frontend:
Angular
Bootstrap
HTML5/CSS3
Backend:
Spring Boot
Java
Database:
MySQL
Installation
To run the Project Manager application locally, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/InoksFatih/Project-Manager.git
Navigate to the backend directory:

bash
Copy code
cd backend
Configure your MySQL database connection in application.properties.

Build and run the Spring Boot application:

bash
Copy code
mvn spring-boot:run
Open another terminal and navigate to the frontend directory:

bash
Copy code
cd ../frontend
Install frontend dependencies:

bash
Copy code
npm install
Start the Angular development server:

bash
Copy code
ng serve
Access the application at http://localhost:4200 in your web browser.

Usage
Explore the various features of the application from the navigation menu.
Create projects and tasks, assign tasks to team members, and track progress.
Utilize the calendar view to manage tasks associated with specific projects and team members.
