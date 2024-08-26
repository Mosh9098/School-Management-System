# Study Sphere App

By: DAVID MAINA

## Description
Study Sphere App is a comprehensive educational platform designed for students, teachers, and admins to manage and participate in a learning environment. The application allows admins to manage users and classes, teachers to monitor student progress, and students to track their academic performance. The backend is built using Flask, and the frontend is developed using React, with a focus on delivering a seamless user experience.

## Features

### Backend
. User Management: Admins can create, update, and delete user accounts for students, teachers, and other admins.
. Class Management: Teachers can create and manage classes, including setting schedules and assigning students.
. Enrollment System: Students can enroll in classes and view their enrollment status.
. Attendance Tracking: Teachers can record student attendance, and students can view their attendance history.
. Grade Management: Teachers can assign grades, and students can view their grades for each class.
. Authentication: Secure login system with role-based access control.

### Frontend
. User Dashboard: Personalized dashboards for students, teachers, and admins with role-specific features.
. Class Overview: Detailed view of class schedules, enrolled students, and academic content.
. Profile Management: Users can update their profiles and customize their preferences.
. Notifications: Real-time notifications for new assignments, grades, and class updates.
. Responsive Design: Optimized for both desktop and mobile devices.

## Installation

### Backend
#### Installation Requirements
 .Python 3.8+
 .Flask
 .Flask-SQLAlchemy
 .Flask-Migrate
 .Flask-Bcrypt
 .Flask-CORS

#### Installation Instructions
 1. Clone the repository: git clone https://github.com/omolojohn/Study-Sphere-App.git

 2. Navigate to the project directory: cd Study-Sphere-App/Server

 3. Install the required Python packages: pipenv install -r requirements.txt

 4. Set up the database: flask db upgrade

 5. Seed the database (optional): python seed.py

 6. Run the application: python app.py

 ## Frontend

#### Installation Requirements
 .Node.js
 .npm or Yarn
 .React
 .Vite (for development)

 #### Installation Instructions

 1. Navigate to the frontend directory: cd Study-Sphere-App/my-app

 2. Install the required packages: npm install

 3. Run the development server: npm run dev

## Usage

### Backend
 1. Start the Flask server: The backend will run on port 5555 by default.
Access the API: Use tools like Postman to interact with the backend API for testing and development.
Frontend
 2. Open the application: Access the frontend by navigating to http://localhost:3000 in your web browser.
Navigate through the app: Use the navigation bar to access different sections like Dashboard, Classes, and Profile.

## Dependencies

### Backend
  .Flask
  .SQLAlchemy
  .Flask-Migrate
  .Bcrypt
  .SendGrid (for email notifications)
  .Cloudinary (for image uploads)

### Frontend
  React
  Vite
  Axios (for API requests)
  React Router (for navigation)
  Redux (for state management)

## Challenges Faced

 1. Database Schema Design: Balancing the relationships between users, classes, and enrollments required careful planning to avoid data redundancy.
 2. Role-Based Access Control: Implementing secure and scalable role-based authentication was challenging but crucial for the project’s success.
 3. Frontend Integration: Ensuring seamless communication between the frontend and backend, particularly for real-time updates, presented several technical challenges.

## Future Improvements

 1. Progressive Web App (PWA): Convert the application into a PWA for better offline support and mobile accessibility.
 2. Advanced Analytics: Implement detailed analytics and reporting features for tracking student progress over time.
 3. Automated Testing: Increase test coverage and automate testing for both backend and frontend components.
 4. Multilingual Support: Add support for multiple languages to cater to a diverse user base.

## Live Link

## Technologies Used

 ### Backend
  .Python
  .Flask
  .PostgreSQL

 ### Frontend
  .React
  .Vite
  .CSS (Tailwind)

## Contributing

Contributions are welcome! If you have any suggestions, feature requests, or bug reports, please open an issue on GitHub.

## Support and Contact Details
GitHub:mosh9098

Email: mosh9098@gmail.com

## License

MIT License

© 2024 David Maina

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgments
 1. Inspiration for this project came from the need to streamline and enhance educational experiences for students and educators alike.

 2. Special thanks to the open-source community for providing the tools and libraries that made this project possible.

 3. Moringa School

 4. Dennis Kiboi (dennis-kiboi)










