# 🚖 CabGo – Full-Stack Ride Booking Platform

**CabGo** is a full-stack ride-booking web application designed to simplify urban transportation through an intuitive, responsive, and user-friendly interface. The platform enables passengers to book rides, explore vehicle categories, track trips, manage payments, and view booking histories, while drivers can manage ride requests, update their availability, and monitor their earnings.

Built with **React, Vite, Spring Boot, Java, Spring Security, JWT, and Microsoft SQL Server**, CabGo combines a modern frontend with a secure backend architecture and structured database management.

---

## ✨ Key Features

### 👤 Authentication & Security

* User registration and login.
* JWT-based authentication.
* Role-based access for passengers, drivers, and administrators.
* Protected frontend routes.
* Secure backend API endpoints.
* Automatic handling of unauthorized API responses.

### 🚕 Ride Booking

* Search for rides by entering pickup and destination locations.
* Explore different vehicle categories.
* Select a suitable vehicle for the journey.
* View ride details and estimated fare information.
* Create, manage, and cancel bookings.
* Access booking details through booking references.

### 📍 Maps & Live Tracking

* Interactive map interface.
* Google Maps integration for location and route visualization.
* Route polylines and driving-distance calculations.
* Driver location and availability updates.
* Ride-status tracking throughout the booking lifecycle.
* Fallback functionality when Google Maps API access is unavailable.

*Note: Actual GPS tracking frequency and real-time synchronization depend on the implemented backend and mapping configuration.*

### 💳 Payments & Offers

* Payment checkout interface.
* Support for UPI, cards, wallets, net banking, and cash payment options.
* Booking-related payment records.
* Promotional coupon validation.
* Itemized fare and discount information.

*Note: Payment methods represent supported application options; live payment processing requires integration with an appropriate payment gateway.*

### 🧑‍✈️ Driver Dashboard

* Driver profile management.
* Online and offline availability controls.
* Incoming ride-request management.
* Assigned trip information.
* OTP-based trip verification.
* Ride-status updates.
* Driver earnings information.

### 🧳 Passenger Hub

* View personal profile information.
* Access previous and current bookings.
* Manage saved locations.
* View wallet balance information.
* Track booking progress.
* Review trip and payment details.

---

## 🛠️ Technology Stack

### Frontend

* **React 18** – Component-based user interface.
* **Vite** – Development server and build tool.
* **Tailwind CSS** – Responsive styling and utility classes.
* **React Router v6** – Client-side routing.
* **Axios** – HTTP requests and API communication.
* **JWT Interceptors** – Authentication token handling.
* **Material Symbols Outlined** – Interface icons.
* **Google Fonts** – Inter and Plus Jakarta Sans typography.

### Backend

* **Java 17+** – Backend programming language.
* **Spring Boot 3.3.4** – Application framework.
* **Spring Security 6** – Authentication and authorization.
* **JSON Web Tokens (JWT)** – Stateless authentication.
* **Spring Data JPA** – Database persistence.
* **Maven** – Dependency management and build automation.

### Database

* **Microsoft SQL Server (MSSQL)** – Relational database.
* **Flyway** – Database schema migrations and seed data.
* **Hibernate/JPA** – Object-relational mapping.

### Additional Technologies

* Google Maps APIs for mapping and route visualization.
* REST APIs for frontend-backend communication.
* Environment variables for configuration.

---

## 🏗️ System Architecture

CabGo follows a layered full-stack architecture.

```text
                 ┌───────────────────────────┐
                 │       React Frontend      │
                 │      React + Vite         │
                 └─────────────┬─────────────┘
                               │
                         Axios / REST API
                               │
                 ┌─────────────▼─────────────┐
                 │     Spring Boot Backend  │
                 │                           │
                 │  Controllers              │
                 │  Services                 │
                 │  Repositories             │
                 │  JWT Security             │
                 └─────────────┬─────────────┘
                               │
                          Spring Data JPA
                               │
                 ┌─────────────▼─────────────┐
                 │    Microsoft SQL Server  │
                 │                           │
                 │  Users                    │
                 │  Drivers                  │
                 │  Vehicles                 │
                 │  Bookings                 │
                 │  Payments                 │
                 └───────────────────────────┘
```

### Application Workflow

1. A passenger registers or logs in.
2. The backend validates the credentials and issues a JWT.
3. The frontend stores and uses the authentication token according to the application's authentication implementation.
4. The passenger searches for a ride and selects a vehicle.
5. The frontend sends booking requests to the Spring Boot REST APIs.
6. The backend validates the request and persists booking information.
7. The passenger can view booking details and track ride status.
8. Drivers manage their availability and assigned trips through the driver dashboard.
9. Payment records and booking histories are maintained in the database.

---

## 📂 Project Structure

```text
cabgo/
│
├── README.md
│
├── database/
│   └── migrations/
│       ├── V1__init_schema.sql
│       └── V2__seed_data.sql
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       └── main/
│           ├── java/com/cabgo/
│           │   ├── CabgoApplication.java
│           │   ├── config/
│           │   ├── security/
│           │   ├── controller/
│           │   ├── service/
│           │   │   └── impl/
│           │   ├── repository/
│           │   ├── entity/
│           │   ├── dto/
│           │   ├── mapper/
│           │   └── exception/
│           │
│           └── resources/
│               ├── application.properties
│               └── db/
│                   └── migration/
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    │
    └── src/
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   ├── apiClient.js
        │   ├── authService.js
        │   ├── bookingService.js
        │   ├── driverService.js
        │   └── vehicleService.js
        ├── routes/
        │   ├── AppRoutes.jsx
        │   └── ProtectedRoute.jsx
        ├── components/
        ├── pages/
        │   ├── Home/
        │   ├── BookACab/
        │   ├── PaymentCheckout/
        │   ├── LiveTracking/
        │   ├── PassengerHub/
        │   ├── MyBookings/
        │   ├── DriverDashboard/
        │   └── Auth/
        └── assets/
```

*The structure above represents the intended organization. Some filenames or directories may differ in your actual repository.*

---

## ⚙️ Prerequisites

Before running CabGo locally, install the following:

* Java Development Kit (JDK) 17 or a compatible newer version.
* Node.js and npm.
* Microsoft SQL Server.
* Git.
* A code editor such as Visual Studio Code or IntelliJ IDEA.

**Recommended:** Use Java 17 or 21 for a predictable development environment with Spring Boot 3.3.4. Verify compatibility before using newer Java versions.

---

## 🚀 Getting Started

Follow these steps to run CabGo on your local machine.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Navigate to the project directory:

```bash
cd cabgo
```

Replace the repository URL with your actual GitHub repository URL.

### Step 2: Configure the Database

Start your Microsoft SQL Server instance.

Open SQL Server Management Studio (SSMS) and execute:

```sql
CREATE DATABASE cabgo_db;
```

Open the backend configuration file:

```text
backend/src/main/resources/application.properties
```

Configure your database connection:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=cabgo_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=validate

spring.flyway.enabled=true
```

Ensure the remaining required JPA, Flyway, and JWT properties are configured for your application.

Set your database credentials in your environment instead of committing passwords to GitHub.

For PowerShell:

```powershell
$env:DB_USERNAME="your_sql_username"
$env:DB_PASSWORD="your_sql_password"
```

**Important:** Confirm that your SQL Server instance is listening on port `1433` and that SQL Server authentication is configured correctly.

### Step 3: Run the Backend

Open a terminal in the backend directory:

```bash
cd backend
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

The backend is configured to run at:

```text
http://localhost:8088
```

Flyway can apply the database migrations automatically when the backend starts, provided that the migrations are available in the configured migration location and the database connection is valid.

### Step 4: Run the Frontend

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

### Step 5: Configure Google Maps (Optional)

To enable Google Maps functionality, configure a Google Maps API key.

Create a `.env` file inside the frontend directory if your Vite configuration expects environment variables there:

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Enable the required Google Maps APIs in Google Cloud Console.

Do not commit API keys or other secrets to a public repository. Restrict browser API keys by website origin and API permissions.

The mapping fallback behavior depends on the actual implementation; verify that routing and tracking continue to work when a key is unavailable.

---

## 🔌 API Endpoints

The following endpoints describe the application's intended REST API.

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/login`    | Authenticate a user            |
| POST   | `/api/auth/register` | Register a passenger or driver |

### Vehicles

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/vehicles`        | Retrieve vehicle categories |
| GET    | `/api/vehicles/{code}` | Retrieve vehicle details    |

### Bookings

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/bookings`             | Create a booking                     |
| GET    | `/api/bookings/{id}`        | Retrieve a booking by ID             |
| GET    | `/api/bookings/ref/{ref}`   | Retrieve a booking by reference      |
| GET    | `/api/bookings/my-bookings` | Retrieve the current user's bookings |
| PATCH  | `/api/bookings/{id}/status` | Update booking status                |
| POST   | `/api/bookings/{id}/cancel` | Cancel a booking                     |

### Drivers

| Method | Endpoint                         | Description                             |
| ------ | -------------------------------- | --------------------------------------- |
| GET    | `/api/drivers/me`                | Retrieve the current driver profile     |
| PATCH  | `/api/drivers/status`            | Update driver availability and location |
| GET    | `/api/drivers/incoming-requests` | Retrieve incoming ride requests         |

### Payments

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| POST   | `/api/payments/process`             | Process a payment request    |
| GET    | `/api/payments/booking/{bookingId}` | Retrieve payment information |

### Users

| Method | Endpoint                          | Description                         |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/api/users/me`                   | Retrieve the current user's profile |
| GET    | `/api/users/saved-locations`      | Retrieve saved locations            |
| POST   | `/api/users/saved-locations`      | Save a location                     |
| GET    | `/api/users/verify-coupon/{code}` | Validate a promotional coupon       |

**Note:** Verify these routes against the actual controller mappings before publishing the README as definitive API documentation.

---

## 🗃️ Database Management

CabGo uses Microsoft SQL Server to persist application data.

The database schema may contain tables for:

* Users
* Drivers
* Vehicle classes
* Bookings
* Payments
* Saved locations
* Promotional codes
* Trip and status information

### Flyway Migrations

The project includes versioned migration scripts:

```text
V1__init_schema.sql
V2__seed_data.sql
```

* `V1__init_schema.sql` defines the initial database schema.
* `V2__seed_data.sql` inserts initial demonstration data.

Flyway tracks applied migrations and helps maintain consistent database versions across development environments.

---

## 🧪 Testing

Before using the application, verify the following workflows:

* User registration and login.
* JWT authentication and protected routes.
* Vehicle category selection.
* Booking creation and cancellation.
* Booking history retrieval.
* Driver availability updates.
* Trip status transitions and OTP verification.
* Payment request handling.
* Coupon validation.
* Database connectivity and migration execution.
* Responsive behavior on mobile and desktop screens.

Use the browser developer tools and backend logs to diagnose API or configuration issues.

---

## 🔐 Security Considerations

* Keep database credentials and JWT signing secrets out of source control.
* Use HTTPS in production.
* Validate and authorize protected API requests on the backend.
* Apply role-based authorization to driver and administrator operations.
* Validate all booking, payment, and trip-status updates on the server.
* Never trust client-side payment confirmations without server-side verification.
* Restrict Google Maps API keys.
* Use appropriate password hashing and account-validation practices.
* Avoid publishing real customer information or production credentials.

**Demo credentials should only be used in a local or isolated demonstration environment.** Replace default credentials and disable or remove seeded administrator accounts before deploying publicly.

---

## 🌟 Future Enhancements

Potential improvements include:

* Integration with a production payment gateway.
* WebSocket-based real-time ride updates.
* More advanced driver-passenger matching.
* Push notifications for booking updates.
* Email and SMS notifications.
* Ride ratings and reviews.
* Improved administrative analytics.
* Automated backend and frontend tests.
* Production deployment with managed database hosting.
* Enhanced accessibility and multilingual support.

---

## 🎯 Project Objectives

CabGo aims to demonstrate practical full-stack development through:

* Responsive frontend development.
* REST API design and integration.
* Secure authentication and authorization.
* Relational database design.
* Database migrations and persistence.
* Role-based application workflows.
* Ride-booking and trip-management functionality.
* Third-party mapping integration.

---

## 👩‍💻 Author

**Komal Khole**

Full-Stack Development | Java | Spring Boot | React | SQL

---

## 📄 License

This project is intended for educational and demonstration purposes.

If you plan to distribute or reuse the code publicly, consider adding an appropriate open-source license.

---

**CabGo – Making Every Journey Simpler. 🚖**
