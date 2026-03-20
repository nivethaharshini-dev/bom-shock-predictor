# BOM Shock Predictor
> AI-Driven, Self-Healing Supply Chain Intelligence Platform — Blueprints 2026, DSC SVCE

## Project Overview
Modern manufacturing depends on complex Bills of Materials (BOM). A single component 
failure can halt entire production lines — yet no intelligent, predictive system exists 
to prevent this. This platform predicts and prevents supply chain disruptions in 
electronics manufacturing by detecting BOM shock events before they cause production 
halts, and recommends ML-driven substitute components automatically.

## Features & Functionalities
- **BOM Upload & Parsing** — Accepts CSV/JSON formats, identifies all components and parent-child relationships
- **Supply Risk Monitoring** — Continuously monitors live supplier alerts, logistics signals, and geopolitical disruptions
- **ML Equivalency Engine** — Uses KNN, Cosine Similarity & Random Forest to compare voltage, tolerance, temperature, and package type
- **Procurement Dashboard** — Visual interface showing affected BOM components with ranked substitute parts and compatibility scores (0–100%)
- **Shock Detection Module** — Maps supplier failure to exact impacted product lines
- **Predictive Analytics** — Time-series forecasting model predicts supply shocks days in advance

## Tech Stack
| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, Tailwind CSS, Chart.js / Recharts |
| Backend | Python (Flask / FastAPI), REST APIs, JWT Auth |
| ML / AI | Scikit-learn, KNN, Cosine Similarity, Random Forest, NLP Datasheet Parser |
| Database | PostgreSQL, Neo4j Graph DB, Redis |
| DevOps | Docker, GitHub Actions (CI/CD), AWS / GCP, Kubernetes |

## Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Neo4j 5+
- Git

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/nivethaharshini-dev/bom-shock-predictor.git
cd bom-shock-predictor

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Install frontend dependencies
npm install --prefix frontend

# 4. Configure environment variables
cp .env.example .env
# Fill in your DB credentials and API keys in .env

# 5. Initialize the database
python manage.py db upgrade
python seed_data.py

# 6. Run the application
python app.py           # Backend: localhost:5000
npm run dev --prefix frontend  # Frontend: localhost:3000
```

## Screenshots
> Coming soon — UI mockups and demo screenshots will be added here.

## Novelty of Solution
| Capability | Existing Tools | BOM Shock Predictor |
|-----------|---------------|-------------------|
| ML-Based Equivalency | Manual search | KNN + Cosine + RF scoring |
| Predictive Risk Detection | Reactive only | Time-series forecasting |
| BOM Hierarchy Awareness | Flat lookup | Graph DB parent-child mapping |
| Compatibility Scoring | Engineer guesswork | Automated 0–100% score |
| Unified BOM Intelligence | Fragmented tools | Single integrated platform |

## Future Roadmap
- **Q3 2026** — ERP Integration (SAP, Oracle, Microsoft Dynamics)
- **Q4 2026** — LLM Datasheet Understanding (GPT-4 / Claude)
- **Q1 2027** — Multi-Tier Supplier Graph analytics
- **Q2 2027** — Global Component Marketplace
- **2027+** — Autonomous Self-Healing mode

## Business Model
- **SaaS Subscription** — Tiered monthly plans for SMEs and enterprise manufacturers
- **ERP API Licensing** — Premium connectors for SAP, Oracle, and Dynamics
- **Marketplace Commission** — Transaction fee from verified component supplier marketplace

## Team — The Senators
| Name | Role |
|------|------|
| Rahul R | Machine learning engineer |
| Naresh Kumar R | Backend developer |
| Lakshanaa A M | Project lead and presenter |
| Lavanya P | Frntend developer |
| Nivethalakshmi C B | Database handling |
| Nivetha Harshini J | Database handling |

3rd Year | ECE | Sri Venkateswara College of Engineering | Blueprints 2026
