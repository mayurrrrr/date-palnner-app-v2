# **Date Planner**

Date Planner is a fun and interactive web application that helps you plan a special date effortlessly. From choosing the perfect time and cuisine to selecting desserts and locations, this app ensures you can craft a memorable plan for your loved one.

---

## **Features**

- **Step-by-Step Date Planning:**
  - Input both your and your partner's details.
  - Pick a suitable date and time.
  - Choose cuisines and desserts with visually appealing images.
  - Add additional places you'd like to visit.
  - Select a meeting location using Google Maps.

- **Google Maps Integration:**
  - Search for locations using Google Places API.
  - Dynamically center the map to the selected location.

- **PDF Export:**
  - Save the finalized date plan as a PDF with all the details, including:
    - Date and time.
    - Cuisine and dessert choices.
    - Additional places.
    - Selected meeting location.

- **Interactive Design:**
  - Smooth animations for transitions between steps using Framer Motion.
  - Beautiful and user-friendly interface with responsive design.

- **Confetti Celebration:**
  - Adds a fun touch with confetti animations after successful plan generation.

---

## **Tech Stack**

### **Frontend**
- **React**: Component-based library for building the user interface.
- **Framer Motion**: For animations and smooth transitions.
- **Lucide React**: Lightweight icons for enhanced UI.
- **Google Maps API**: For location search and map display.

### **PDF Generation**
- **html2pdf.js**: Used to generate the PDF file from the finalized plan.

---

## **Installation**

### **Prerequisites**
- Node.js and npm installed on your system.
- A Google Cloud Platform account with API access for:
  - **Google Maps JavaScript API**
  - **Google Places API**

---

### **Steps to Set Up Locally**

Here’s the properly formatted Markdown section:

```markdown
## **Installation**

### **Steps to Set Up Locally**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/date-planner.git
   cd date-planner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the following:
     ```plaintext
     VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```
