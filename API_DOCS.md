# API Documentation

This document describes the API endpoints provided by the Smart Timetable Management System backend running on `http://localhost:5000`.

---

## 1. Get Timetable
Retrieves the timetable for a specific branch, section, and semester.

- **URL:** `/api/timetable`
- **Method:** `GET`
- **Query Params:**
  - `branch` (String) - E.g., `Electrical`
  - `section` (String) - E.g., `A`
  - `semester` (Number) - E.g., `5`

**Success Response:**
- **Code:** 200 OK
- **Content:** Array of timetable objects populated with faculty, room, and time slot details.

---

## 2. Auto-Generate Timetable
Triggers the backend algorithm to assign faculties and rooms, then generates a complete timetable for the given batch.

- **URL:** `/api/timetable/generate`
- **Method:** `POST`
- **Body:**
  ```json
  {
      "branch": "Electrical",
      "section": "A",
      "semester": 5
  }
  ```

**Success Response:**
- **Code:** 200 OK
- **Content:** Returns the generated records or a success message.

---

## 3. Submit Faculty Leave Request
Submits a leave request for a faculty member and attempts to find a substitute.

- **URL:** `/api/faculty/leave-request`
- **Method:** `POST`
- **Body:**
  ```json
  {
      "facultyId": "65123abcd...",
      "date": "2026-10-15",
      "timeSlotId": "Monday-1",
      "substituteFacultyId": "65124bcde..." // Optional
  }
  ```

**Success Response:**
- **Code:** 200 OK
- **Content:**
  ```json
  {
      "message": "Substitute found successfully.",
      "facultyOnLeave": "Dr. Pritam Kumar",
      "subject": "Digital Electronics",
      "substituteName": "Ajeet Kumar",
      "leaveDate": "2026-10-15",
      "inviteId": "65125cdef..."
  }
  ```

---

## 4. Get All Faculty
Retrieves a list of all faculty members.

- **URL:** `/api/faculty`
- **Method:** `GET`

**Success Response:**
- **Code:** 200 OK
- **Content:** Array of faculty objects (id, name, department, expertiseSubjects).
