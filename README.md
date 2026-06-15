# PharmaBase 💊
### Blockchain-Powered Pharmaceutical Supply Chain & Counterfeit Detection System

[![Hyperledger Fabric](https://img.shields.io/badge/Blockchain-Hyperledger%20Fabric-2F3134?logo=hyperledger)](https://www.hyperledger.org/use/fabric)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **The global counterfeit drug market causes 1 million deaths annually and costs the pharmaceutical industry $200 billion.** PharmaBase uses Hyperledger Fabric's permissioned blockchain to create an immutable, transparent supply chain — so every medicine's journey from manufacturer to patient is verified, traceable, and tamper-proof.

---

## The Problem

Traditional pharmaceutical supply chains are fragmented, opaque, and vulnerable:
- Counterfeit drugs enter supply chains at any handoff point — manufacturer, distributor, pharmacy
- Paper-based verification is easily forged
- No single source of truth across stakeholders
- Recalls are slow because traceability is broken

## The Solution

PharmaBase creates a **permissioned blockchain network** where every stakeholder (manufacturer, distributor, hospital, pharmacy) operates a node. Every medicine gets a cryptographically unique identity. Every transfer, location update, and ownership change is recorded immutably on-chain — and verified in real time via QR scan.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React.js Frontend                        │
│         QR Scanner · Dashboard · Verification UI · Map         │
└────────────────────────┬────────────────────────────────────────┘
                         │ Axios (REST)
┌────────────────────────▼────────────────────────────────────────┐
│                    Node.js / Express API                        │
│              Auth · Business Logic · Event Emitter             │
└────────────────────────┬────────────────────────────────────────┘
                         │ Fabric SDK
┌────────────────────────▼────────────────────────────────────────┐
│                   Hyperledger Fabric Network                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Manufacturer│  │  Distributor │  │  Hospital / Pharmacy │  │
│  │     Peer     │  │     Peer     │  │        Peer          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│              Chaincode (Smart Contracts) · CouchDB              │
└─────────────────────────────────────────────────────────────────┘
                    Deployed via Docker Compose
```

---

## Features

### Core Blockchain Features
| Feature | Description |
|---|---|
| **Add Medicine** | Register a drug batch on-chain with manufacturer details, batch ID, expiry, and chemical composition |
| **Verify Authenticity** | Instantly verify any medicine is genuine by checking its on-chain record — returns verified / counterfeit |
| **Transfer Ownership** | Record every custody handoff (manufacturer → distributor → hospital → pharmacy) immutably |
| **Full History** | Query the complete lifecycle of any medicine from production to dispensing |

### Tracking Features
| Feature | Description |
|---|---|
| **QR Code Scanning** | Each medicine gets a unique QR code. Scan at any point in the supply chain to verify and update status |
| **Location Tracking** | GPS coordinates recorded at every ownership transfer — full geographic trail on a map view |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Interactive dashboard, QR scanner, verification UI |
| Backend | Node.js + Express | REST API, Fabric SDK integration, business logic |
| Blockchain | Hyperledger Fabric | Permissioned ledger, smart contracts (chaincode) |
| Database | CouchDB (via Fabric) | Rich queries on world state |
| HTTP Client | Axios | Frontend ↔ Backend communication |
| Infrastructure | Docker + Docker Compose | Fabric network orchestration |

---

## Getting Started

### Prerequisites
- Node.js v16+
- Docker Desktop (must be running)
- Docker Compose

### 1. Start the Blockchain Network

```bash
# Navigate to your fabric network directory
cd network

# Start all Docker containers (peers, orderer, CouchDB, CA)
docker-compose up -d

# Verify all containers are running
docker ps
```

### 2. Start the Backend

```bash
cd backend
npm install
node app.js
# Backend runs on http://localhost:3001
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

> **Note:** Ensure your Docker network paths match the peer connection profiles in `/backend/config/`. Update the `grpcOptions.ssl-target-name-override` if your container names differ.

---

## How It Works — Key Flows

### Adding a Medicine
```
Manufacturer fills form → React sends POST /api/medicine →
Node.js calls chaincode invokeTransaction("AddMedicine") →
Fabric records on-chain with timestamp + manufacturer cert →
QR code generated with medicine ID → Stored on ledger
```

### Verifying Authenticity
```
User scans QR code → Medicine ID extracted →
GET /api/medicine/:id/verify →
Chaincode queries world state → Returns on-chain record →
React shows VERIFIED ✓ or COUNTERFEIT ✗ with full history
```

### Ownership Transfer
```
Current owner initiates transfer → New owner address + location captured →
Chaincode validates current owner's certificate →
Transfer recorded with GPS coordinates + timestamp →
Both parties' dashboards update in real time
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/medicine` | Register new medicine on blockchain |
| `GET` | `/api/medicine/:id` | Get medicine details and current owner |
| `GET` | `/api/medicine/:id/verify` | Verify authenticity — returns `genuine` or `counterfeit` |
| `POST` | `/api/medicine/:id/transfer` | Transfer ownership with location |
| `GET` | `/api/medicine/:id/history` | Full transaction history from genesis |
| `GET` | `/api/medicine/:id/location` | Location trail across all transfers |

---

## Roadmap

- [x] Medicine registration on Hyperledger Fabric
- [x] Counterfeit detection via on-chain verification
- [x] QR code generation and scanning
- [x] Ownership transfer with GPS tracking
- [x] Full medicine history from blockchain
- [ ] **ML Anomaly Detection** — Isolation Forest model to flag suspicious transaction patterns
- [ ] **Demand Forecasting** — Time-series ML to predict drug stock needs by region
- [ ] **Supplier Risk Scoring** — Algorithmic trust scores for each supply chain actor
- [ ] **Analytics Dashboard** — Real-time charts: transfer volumes, anomaly rates, geographic heatmaps
- [ ] **REST API Swagger Docs** — Auto-generated API documentation
- [ ] **Cold Chain Monitoring** — Temperature sensor data anchored on-chain for sensitive drugs
- [ ] **Drug Recall System** — Instant on-chain recall broadcast to all network participants

---

## Why Hyperledger Fabric?

Unlike public blockchains (Ethereum), Hyperledger Fabric is **permissioned** — only verified stakeholders join the network. This is critical for pharmaceuticals because:

- **Identity matters**: Every transaction is signed by a known certificate (MSP)
- **Privacy**: Competing companies don't see each other's private data channels
- **Performance**: No mining, so transaction finality in seconds — not minutes
- **Compliance**: Audit trails satisfy FDA 21 CFR Part 11 and WHO track-and-trace requirements

---

## Real-World Impact

| Problem | PharmaBase Solution |
|---|---|
| 10% of drugs in developing markets are counterfeit | Instant QR verification at any point of sale |
| Drug recalls take weeks to propagate | On-chain broadcast reaches all nodes in seconds |
| Supply chain disputes between stakeholders | Immutable record — no party can alter history |
| No visibility into cold-chain breaks | Location + timestamp at every transfer |

---

## Project Structure

```
PharmaBase/
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # QR Scanner, VerificationCard, Map, History
│   │   ├── pages/          # Dashboard, AddMedicine, Transfer, Verify
│   │   └── api/            # Axios service layer
├── backend/                # Node.js + Express
│   ├── routes/             # medicine.js, auth.js
│   ├── fabric/             # Fabric SDK gateway connection
│   └── config/             # Connection profiles, wallet
├── network/                # Hyperledger Fabric network
│   ├── docker-compose.yml  # Peer, orderer, CA, CouchDB containers
│   ├── chaincode/          # Smart contracts (Go / JavaScript)
│   └── crypto-config/      # Certificates and keys
└── README.md
```

---

## Contributing

Pull requests welcome. For major changes, open an issue first.

---

## License

MIT © 2025 — Built with Hyperledger Fabric and React.js
