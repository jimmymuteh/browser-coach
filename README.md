#  Browser Coach

A lightweight, client-side daily habit prediction engine and coaching log built with vanilla JavaScript, HTML5, and CSS3.

 **Live Demo:** [https://jimmymuteh.github.io/browser-coach/](https://jimmymuteh.github.io/browser-coach/)

---

##  How It Works

### Step 1: The Prediction Engine
The engine uses weighted scoring instead of scikit-learn (no Python in the browser for this project). Each input variable contributes a score. Total score above a threshold = goal hit prediction.

### Step 2: The Coaching Generator
The coaching function takes the prediction result and input values, then returns a two-sentence coaching message. This mirrors the pattern from Day 35 but runs entirely in JavaScript.

### Step 3: Wire the Form and Display
The form reads sleep, water, and step count. On submit it runs the prediction, generates coaching, and updates the display panel. No reload. The live tool is below the code.

### Step 4: Session History Log
Each submission appends a record to a session history table. The history persists as long as the page is open. It resets on refresh. This is the starting point for persistent storage with a backend database.

---

##  Built With

- HTML5
- JavaScript

---

