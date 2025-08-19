# Med.AI - Your AI-Powered Medical Assistant


**Med.AI** is a sophisticated, AI-powered web application designed to provide preliminary medical diagnosis, proactive health prevention plans, and robust post-assessment support tools. By leveraging Google's Gemini API, it guides users through a dynamic and context-aware questionnaire to generate a detailed and actionable health report.

**Disclaimer:** Med.AI is an informational tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition. In case of a medical emergency, call your local emergency number immediately.

**Open Source:** For complete transparency, the entire source code for Med.AI is available on GitHub. You can audit, review, and contribute to the project here: [https://github.com/Rimbaud1/Med.AI](https://github.com/Rimbaud1/Med.AI)

---

## ✨ Key Features

### 1. Guided Pre-Diagnosis Flow
A multi-step, intelligent process to gather comprehensive information about a user's health concern.
- **Dynamic Questionnaire:** Generates a unique set of questions based on initial symptoms, age, and medical context.
- **Symptom Quantification:** Allows users to rate the intensity of their symptoms for a more nuanced analysis.
- **Conditional Clinical Tests:** Triggers simple, safe, guided tests only when relevant, including:
  - **Memory Test:** Evaluates cognitive function and concentration.
  - **Neurological Exam:** Simplified checks for neurological warning signs.
  - **Respiratory Rate & Speech Dyspnea Test:** Objectively measures respiratory function.
  - **Capillary Refill Time (CRT):** Assesses circulatory status.
  - **Stability Test:** Checks for balance issues.
- **Multimodal Input:** Supports optional photo uploads for visible symptoms (e.g., rashes, throat irritation) for analysis by a multimodal AI model.
- **Differential Diagnosis:** Utilizes an exclusion filter to help rule out other potential conditions.

### 2. Comprehensive & Actionable Reporting
Once the assessment is complete, Med.AI generates a detailed report that includes:
- **Possible Conditions:** A list of potential issues with confidence scores and simple descriptions.
- **Severity Assessment:** A clear indicator of the estimated severity (Low, Moderate, High).
- **Actionable Recommendations:** Concrete next steps for the user.
- **Suggested OTC Prescription:** Non-prescriptive product suggestions.
- **Intelligent Specialist Referral:** Recommends the most relevant medical specialist (e.g., General Practitioner, Pediatrician, Dermatologist) and provides a direct link to book an appointment on Doctolib, pre-filled with the specialty and user's location.
- **PDF Export:** A beautifully formatted, detailed summary of the entire consultation, perfect for sharing with a healthcare professional.

### 3. Post-Diagnosis Support Suite
The journey doesn't end with the report. Med.AI offers a unique suite of tools to empower the user:
- **Appointment Preparation:** Generates a script to help users explain their situation to a doctor and a list of potential questions the doctor might ask.
- **Evolution Simulator:** Projects three possible evolution scenarios (Favorable, To Monitor, Worrying) for the next 48 hours, detailing signs to watch for and actions to take.
- **Psychological Support Chat ("Aura"):** An AI-powered chat assistant with an adjustable empathy level (from 'Direct' to 'Very Empathetic') to discuss the report and alleviate anxiety.

### 4. Proactive Health & Quick Access
- **Personalized Prevention Plan:** Users can fill out a lifestyle and history profile to receive a proactive plan covering recommended screenings, vaccinations, and lifestyle advice.
- **Direct Diagnosis Lookup:** For users who already know their condition (e.g., "Flu"), this feature provides immediate access to care advice, monitoring instructions, and red flags.
- **Emergency Guide:** A dedicated section for life-threatening situations with clear signs and one-click access to emergency numbers.

---

## 🛠️ How It Works & Technology

Med.AI is built on a modern frontend stack and powered by the **Google Gemini API (`gemini-2.5-flash`)**.

The application's intelligence relies on a sophisticated "chain-of-thought" prompting strategy where each step builds upon the last:
1.  **Initial Parsing:** User's natural language description is parsed to extract key symptoms.
2.  **Contextualization:** User's age, gender, medical history, etc., are formatted and provided as context.
3.  **Conditional Logic:** A series of targeted AI calls determine if specific tests (like the memory or stability test) are relevant before proceeding.
4.  **Dynamic Generation:** The core questionnaire, exclusion symptoms, and self-exam prompts are all generated in real-time by the AI based on the accumulated data.
5.  **Structured Output:** The AI is instructed to return data in a strict JSON format using `responseSchema`, ensuring the application receives reliable, predictable data for rendering reports and tools.
6.  **Final Synthesis:** All collected data points—from initial symptoms to test results and photo analysis—are compiled into a final, comprehensive prompt to generate the report.

### Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Engine:** Google Gemini API (`@google/genai`)
- **PDF Generation:** `jsPDF` & `html2canvas`

---

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rimbaud1/Med.AI
    cd Med-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    You will need a Google Gemini API key. Create a `.env` file in the root of the project and add your key:
    ```
    API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server:**
    The application is configured to run directly from the `index.html` file which uses ES modules. You can serve the directory using a simple local server. If you have Node.js, you can use `serve`:
    ```bash
    npm install -g serve
    serve .
    ```
    Then open your browser to the provided local address.