# 🌿 Pacayacu Bot: Environmental Health and Radiation Protection Literacy

An interactive educational ecosystem deployed on WhatsApp (m-learning) designed to improve scientific literacy regarding environmental radioactivity (NORM and TENORM) in the Ecuadorian Amazon (Pacayacu, Sucumbíos). 

This project combines rigorous scientific outreach with gamification strategies (edutainment) to explain the physics of ionizing radiation, debunk misconceptions, and promote radiation protection protocols based on empirical and dosimetric evidence.

## 🔬 Pedagogical and Scientific Approach

The chatbot is structured to cater to an audience with a medium-to-high academic profile, ensuring rigor in physical concepts. Learning is analytically measured using Hake’s Normalized Gain through a pre-test (diagnostic) and post-test evaluation system.

The user is guided by avatars representing Amazonian wildlife through four progressive modules:
1. **🦫 Level 1 (Capybara):** Electromagnetic spectrum. Rigorous distinction between ionizing and non-ionizing radiation.
2. **🦜 Level 2 (Macaw):** Natural radiation vs. TENORM. Distinction between endemic natural background radiation and anthropogenic environmental liabilities.
3. **🐍 Level 3 (Anaconda):** Exposure pathways and dosimetry. Distinction between physical quantities: Activity (Becquerel - Bq) and Effective Dose (millisievert - mSv).
4. **🐆 Level 4 (Jaguar):** Citizen science and protocols. The dose-response principle and resolving dilemmas through mathematical evidence.

## 🛠️ Architecture and Technology Stack

The project operates under a microservices architecture optimized for agile cloud deployments (Render):

* **Backend:** Node.js + Express.js
* **Database:** PostgreSQL (via Supabase) for recording metrics and interaction logs.
* **API Integration:** Meta Cloud API (WhatsApp Business) for sending messages, buttons, and multimedia badges.
* **Static Infrastructure:** Express server that exposes graphic resources (certificates and badges) for consumption by the Meta API.

## 📁 Source Code Structure

* `config/db.js`: Connection to Supabase (PostgreSQL)
* `controllers/botController.js`: Main router and user state manager
* `controllers/diagnosticoController.js`: Pre-test logic
* `controllers/nivelesController.js`: Gamified navigation and certificate delivery
* `controllers/posttestController.js`: Hake algorithm calculation and closure
* `data/niveles.js`: Curriculum matrix and content for the 4 levels
* `data/posttest.js`: Question bank and feedback
* `routes/apiRoutes.js`: Meta Webhooks and token validation
* `services/whatsapp.js`: Network layer for interacting with the Meta API
* `app.js`: Main entry point

## 🚀 Local Installation and Deployment

1. Clone the repository using `git clone [REPOSITORY_URL]`
2. Install dependencies in the project root by running `npm install`
3. Create a `.env` file in the project root to define environment variables.
4. Define the following credentials in `.env`: `PORT`, `VERIFY_TOKEN`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `DATABASE_URL`, and `BASE_URL`.
5. Run the server in development mode using `npm run dev`

## 📊 Impact and Data Science

The database architecture enables the extraction of structured reports to evaluate didactic transposition. The anonymized data facilitates statistical analysis of areas of conceptual difficulty, retention curves, and psychometric validation of the measurement instrument.

## ✒️ Authorship and Citation

* **Principal Investigator:** Armijos-Vanega, Victor.
* **Acknowledgments:** We acknowledge the academic framework of the State University of Milagro (UNEMI) and the technical support and methodological guidance in software deployment provided by the ‘Zétesis’ Center for Scientific Research and Development.

If you use this code or data derived from this project in your research, please cite the official repository hosted on Zenodo:
> **Armijos-Vanega, V. (2026).** *Pacayacu Bot: Gamified Chatbot for Scientific Literacy on TENORM*. Zenodo.
> DOI:[10.5281/zenodo.20644227]

```
