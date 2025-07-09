# Aman — Intruder Alarm System

## ⚠️ Disclaimer

> **This project was created under intense time constraints during a university semester (Fall 2024).**  
> It contains several architectural and design flaws and **does not reflect my current level of experience, knowledge, or development practices**. Please view this project as an early-stage academic prototype, not a polished product.

---

## 📌 Overview

**Aman** is an intruder alarm system simulating how users can secure their homes and how a security or police module might react to real-time alerts. It was built as a university assignment and consists of two main modules:

- **User Module**: For registering homes, adding sensors, and managing rooms.
- **Police/Security Module**: To monitor intrusions in real time and dispatch actions accordingly.

---

## 🧠 Features

- Real-time **intrusion detection** using MQTT and WebSockets (`Socket.IO`)
- Users can **add rooms**, place **motion/door sensors**, and receive **email notifications** when an intrusion occurs
- html page **flickers in real-time** when an intrusion is detected
- JWT-based **authentication & authorization**
- Sensors & alerts fully **simulated**, suitable for demonstration and concept validation

---

## 🛠️ Tools & Technologies

- **Backend**: Node.js, Express, Sequelize (Database First)
- **Frontend**: React, Tailwind CSS
- **Communication**: MQTT (sensor simulation), Socket.IO (real-time dashboard)
- **Database**: PostgreSQL
- **Auth**: JWT

---

## 🧪 System Workflow (Simplified)

1. **User Registration**:
   - Registers
   - Adds rooms and assigns sensors
2. **Intrusion Simulation**:
   - MQTT simulates events like door opening or motion detection
   - Backend receives MQTT messages and triggers alerts
3. **Alert Dispatch**:
   - Backend emits real-time events via Socket.IO to the Police Module
4. **Police Action** (manual):
   - View alert, lock intruder inside room (if door sensor)
   - Assign security personnel to respond (planned feature)

---

## ❌ Known Flaws / Limitations

Again, this is a **student project** made under university pressure and **has major issues** that I’m fully aware of:

- Poor code organization in some modules
- Hardcoded logic for sensors, locations, and even some business rules
- **Sensitive data like SMTP credentials and JWT secrets are hardcoded** (no `.env` file used)
- Inconsistent and non-standard **naming conventions**
- Not following **REST API best practices** (e.g., improper HTTP methods, route naming)
- Minimal validation — many endpoints lack input sanitization or proper error handling
- No clear separation of concerns
- Lacks full frontend coverage for all features and edge cases
- No proper testing strategy (unit/integration tests missing)
