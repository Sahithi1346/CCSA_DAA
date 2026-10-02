# CCSA - College Counselling Seat Allocator

> Design and Analysis of Algorithms (DAA) Project - III Year, I Term
>
> A full-stack web application that simulates the Telangana EAMCET seat allocation process using Greedy and Backtracking algorithms.

## Project Overview

CCSA automates the college seat allocation process for engineering students based on:
- EAMCET Rank (lower rank = better)
- Category (OC, BC-A, BC-B, BC-C, BC-D, BC-E, SC, ST, EWS)
- College Preferences (up to 5 preferences per student)
- Category-wise Closing Ranks (cutoff data)
- Available Seat Capacity per college-branch combination

The system processes 1,000+ students and allocates seats using two classic DAA algorithms.

## Algorithms Used

### Greedy Algorithm
- Processes students sorted by EAMCET rank (best rank first)
- For each student, iterates through preferences in order
- Allocates the first eligible preference where studentRank <= categoryClosingRank AND seats are available
- Time Complexity: O(S x P) where S = students, P = preferences
- Approach: Locally optimal at each step - fast, deterministic

### Backtracking Algorithm
- Uses recursive backtracking with constraint satisfaction
- Attempts each preference, backtracks if constraints fail
- More exhaustive search than greedy
- Time Complexity: O(S x P) in practice (with pruning)
- Approach: Explores alternatives before giving up

### Eligibility Rule

    Student is eligible for a preference if:
      studentRank <= categoryClosingRank  AND  availableSeats > 0
    (Lower numerical rank = better. e.g., rank 5,000 beats rank 20,000)

## Features

| Feature | Description |
|---------|-------------|
| Dashboard | Live stats - total students, colleges, seats, allocation summary |
| Students Tab | View, search, add students with paginated list |
| Colleges Tab | Manage college-branch-capacity-cutoff data |
| Allocation Engine | Run Greedy or Backtracking on selected students |
| Results Tab | Full allocation results with status badges |
| Persistence | All data saved to localStorage - survives page refresh |
| Batch Allocation | Select multiple students, run allocation, step through results |
| CSV Export | Download allocation results as a CSV file |
| Auth System | Login / Register pages with Supabase integration |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Backend (optional) | Flask (Python), SQLite |
| Server | Node.js (server.js) |
| Auth | Supabase |
| Algorithms | Custom JS (Greedy + Backtracking) |
| Data | Telangana EAMCET 2021 real cutoff data (CSV/JSON) |

## Project Structure

```
College_allocator/
|
|-- frontend/               # All Frontend UI Files
|   |-- index.html          # Main dashboard (SPA)
|   |-- landing.html        # Landing/home page
|   |-- login.html          # Login page
|   |-- register.html       # Registration page
|   |-- js/                 # Client-side JavaScript
|   |   |-- dashboard-app.js
|   |   |-- auth.js
|   |   |-- eamcet-manager.js
|   |   |-- algorithms.js
|   |   |-- greedy.js
|   |   |-- backtracking.js
|   |   |-- state.js
|   |   -- supabase-config.js
|   |-- css/                # Stylesheets
|   |   |-- dashboard.css
|   |   |-- auth.css
|   |   |-- landing.css
|   |   -- main.css
|   -- static/             # Images & static assets
|
|-- backend/                # All Backend & Data Files
|   |-- server.js           # Node.js static & API server
|   |-- app.py              # Flask backend application
|   |-- config.py           # Configuration
|   |-- college_allocator.db# SQLite database
|   |-- data/               # Cutoff JSON/CSV datasets
|   |   |-- cutoffs.json
|   |   |-- institutes.json
|   |   |-- students.json
|   |   -- 2021_FinalPhase.csv
|   |-- templates/          # Flask HTML templates
|   |-- package.json        # Backend dependencies
|   -- package-lock.json
|
|-- package.json            # Root project package config
-- .gitignore
```

## Setup and Run

### Prerequisites
- Node.js v16+
- A modern browser (Chrome, Edge, Firefox)

### Steps

`ash
# 1. Clone the repository
git clone https://github.com/Sahithi1346/CCSA_DAA.git
cd CCSA_DAA

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# Navigate to http://localhost:3000
`

Note: The app works fully in the browser via localStorage - no backend required for the allocation features.

## How to Use

1. Login or open index.html directly in the browser
2. Go to the Students tab to view 1,000 pre-loaded students
3. Click Add Student to add a new student with preferences
4. Click Run Allocation for Selected Students, check student checkboxes, then click Run
5. The right panel shows the step-by-step allocation process
6. Navigate results using the page number buttons
7. Go to Results tab to see all allocation outcomes
8. Click Download CSV to export results

## Sample Output

    Student: Aarav Sharma | Rank: 12,450 | Category: BC-B

    Checking Preference 1: JNTU Hyderabad - CSE
      Eligible (rank 12,450 <= BC-B closing rank 18,000)
      Seat available (87 remaining)
      -> ALLOCATED

    Result: JNTU Hyderabad - CSE (Preference 1)

## Team

| Name | Role |
|------|------|
| Thavisahi Sahithi | Project Lead |

**Course:** Design and Analysis of Algorithms (DAA)
**Year/Sem:** III Year, I Term
**Institution:** Jawaharlal Nehru Technological University Hyderabad

## License

This project is built for academic purposes under the DAA course.
(c) 2026 CCSA Team. All rights reserved.
