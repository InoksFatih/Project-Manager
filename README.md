
 # Project Manager

A brief description of what this project does and who it's for


Project Manager is a web application designed to efficiently manage projects, tasks, and teams. It provides a range of features to create, update, and delete projects and tasks, assign tasks to team members, and track progress. Additionally, it includes a calendar component to visualize and manage tasks associated with specific projects and team members.

# Table of Contents

1. Features
2. Technologies Used
3. Installation
4. Usage


# Features:

1. Project Management:

+ Create, update, and delete projects.


2. Task Management:

+ Create, update, and delete tasks, associating them with specific projects.
+ Tasks can include attachments and are assigned to team members.



3. Team Collaboration:

+ Assign tasks to team members.
+ Tasks can have subtasks, associated with the assigned team member.

4. Calendar View:

+ Visualize tasks associated with selected projects and team members.
+ Add, view, and edit tasks directly from the calendar.

# Technologies Used
+ Frontend: Angular 17 / SCSS / HTML5 / TypeScript
+ Backend: Spring Boot / Java 
+ Database: MySQL

# Installation
To run the Project Manager application locally, follow these steps:

1. Clone the repository:

```bash
  git clone https://github.com/InoksFatih/Project-Manager.git
```

2. Navigate to the backend directory:

```bash
  cd backend
```

4. Configure your MySQL database connection in application.properties.

5. Build and run the Spring Boot application:

```bash
  mvn spring-boot:run
```

6. Open another terminal and navigate to the frontend directory:


```bash
  cd ../frontend
```

7. Install frontend dependencies:

```bash
  npm install
```

8. Start the Angular development server:

```bash
  ng serve
```

9. Access the application at http://localhost:4200 in your web browser.


# Usage

Explore the various features of the application from the navigation menu.
Create projects and tasks, assign tasks to team members, and track progress.
Utilize the calendar view to manage tasks associated with specific projects and team members.
