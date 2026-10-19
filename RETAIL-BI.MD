# BlueMart Retail Intelligence
[Live Demo](https://retail-bi.priyanshu.cv/) | [API Documentation](https://api-retail-bi.priyanshu.cv/docs) | [GitHub Repository](https://github.com/priyanshwho/Retail-Analysis)

Enterprise retail business intelligence and diagnostic analytics platform turning 641K+ transactional records into automated inventory and profit intelligence.

---

### DOMAIN
Retail Analytics / Business Intelligence / Supply Chain & E-Commerce

### SCALE & METRICS
641,843 Transactions | 50 Stores | $73.2M Revenue | 8,735 Inventory Snapshots

---

## Overview

**BlueMart Retail Intelligence** is an end-to-end commercial Business Intelligence and Data Analytics platform built for a supermarket chain operating 50 stores across the United Arab Emirates (**Dubai**, **Abu Dhabi**, and **Sharjah**). The platform aggregates and models **641,843 sales transactions**, **200 catalog SKUs**, and **8,735 inventory snapshots**, transforming raw point-of-sale ledgers into real-time executive visibility, gross margin analytics, and predictive inventory alerts.

Retail enterprises face massive operational friction from fragmented sales channels, stockout hazards on high-velocity items, and silent margin erosion caused by aggressive discounting. BlueMart solves these challenges through a unified analytics system: from exploratory data science in Python to a sub-second analytical REST API and a high-performance executive dashboard with zero-layout-shift skeleton loading for both light and dark themes.

---

## Key Features

- **Executive Performance Scorecard**: Real-time aggregation of **$73.2M total revenue**, **$21.1M gross profit** (28.8% net margin), and **1.67M units moved** across all 50 operational outlets.
- **Omnichannel Revenue Attribution**: Comprehensive sales channel breakdown tracking revenue split across Physical Stores (41.3%), Website (27.7%), Mobile App (17.9%), Amazon.ae (8.8%), and Noon (4.3%).
- **Diagnostic Stockout Hazard Engine**: Algorithmic quadrant model detecting high-velocity products (`sales > median`) with depleted stock buffers (`stock_on_hand < median`) to prevent lost sales.
- **Margin Leakage & Discount Auditing**: Automated identification of high-volume SKUs suffering margin degradation due to excessive discounting or supplier pricing mismatches.
- **Pareto 80/20 Catalog Engine**: Cumulative revenue curve identifying the exact **41 SKUs (20.5% of catalog)** that generate **80% of total commercial revenue**.
- **Granular Ledger Explorer**: Searchable, sortable transaction explorer indexing 641,000+ sales entries and daily inventory health states with instant CSV report generation.
- **Zero-Layout-Shift Skeleton Architecture**: Custom-engineered dual-theme (light/dark) skeleton loading system mirroring the exact geometry of cards, charts, and tables for an instant, fluid user experience.

---

## Data Science & Analytics Deep Dive (`retail-analysis`)

The foundational intelligence was designed and validated in Python (`retail-analysis/Retail.ipynb`), addressing core business hypotheses and five central management questions.

### 1. Data Schema & Hygiene Pipeline
- **Dataset Scale**: 
  - `bm_sales.csv`: 641,843 sales transaction records ($32.7\text{ MB}$).
  - `bm_skus.csv`: 200 catalog products with detailed unit costs, retail prices, categories, and brands.
  - `bm_stores.csv`: 50 retail locations across 3 Emirates (`Dubai`: 28, `Abu Dhabi`: 14, `Sharjah`: 8) across 3 formats (`Mall`: 22, `High Street`: 18, `Community`: 10).
  - `bm_inventory.csv`: 8,735 store-SKU snapshots recording stock-on-hand, reorder thresholds, and safety stock.
- **Data Quality Assessment**:
  - Identified 159,821 null values in `customer_id` representing anonymous POS cash/card walk-in shoppers; preserved these to maintain accurate revenue and inventory depletion counts.
  - De-duplicated 28 duplicate transaction rows to prevent artificial volume inflation.
  - Standardized timestamps to datetime objects for vectorized monthly and seasonal grouping.
  - Verified 100% referential integrity between foreign keys (`store_id` and `sku_id`) across tables.

### 2. Feature Engineering & Unit Economics
Synthesized an analytics-ready master dataset by joining transactional sales with product catalog economics:
$$\text{COGS} = \text{quantity} \times \text{cost\_price}$$
$$\text{Gross Profit} = \text{total\_value} - \text{COGS}$$
$$\text{Profit Margin \%} = \left(\frac{\text{Gross Profit}}{\text{total\_value}}\right) \times 100$$

### 3. Five Big Management Questions Resolved

#### Q1: Revenue Trajectory & Seasonality
- Stable baseline sales volume averaging **~3.0M to 3.2M AED monthly revenue**.
- Recurring revenue surges coinciding with regional festive periods (Ramadan, Eid al-Fitr, and Q4 Dubai Shopping Festival).
- Gross profit margin maintained a resilient corridor between **28.2% and 29.4%**, indicating disciplined promotional discounting.

#### Q2: Category Sales & Margin Performance
| Category | Total Sales (AED) | Total Profit (AED) | Profit Margin | Key Finding |
| :--- | :--- | :--- | :--- | :--- |
| **Electronics** | **40,790,950.89** | **11,848,265.14** | **29.05%** | **Core Revenue Anchor (55.7% of total revenue)** |
| **Household** | **8,190,735.92** | **2,360,418.07** | **28.82%** | High basket-size stability |
| **Personal Care** | **8,181,799.29** | **2,115,959.34** | **25.86%** | High volume, consistent footfall driver |
| **Grocery** | **5,564,702.41** | **1,661,022.56** | **29.85%** | High repeat frequency staple |
| **Snacks** | **4,321,275.25** | **1,299,444.11** | **30.07%** | Highest impulse margin category |
| **Dairy** | **4,238,161.64** | **1,237,884.73** | **29.21%** | Fast inventory turnover, perishable |
| **Beverages** | **1,922,157.59** | **574,416.61** | **29.88%** | High bundle attachment rate |

#### Q3: Brand & Product Profitability
- **Brand Rankings**:
  1. **`Premium`**: Top dollar contributor (**24.56M AED Sales**, **7.21M AED Profit**, **29.36% Margin** across 477,247 units).
  2. **`Budget`**: High volume tier (**15.24M AED Sales**, **4.27M AED Profit**, **28.04% Margin**).
  3. **`BlueMart` (Private Label)**: Highest margin efficiency (**11.28M AED Sales**, **3.37M AED Profit**, **29.85% Margin**).
- **Top 2 Most Profitable SKUs**:
  - `Electronics_Batteries_1035` (Premium): **768.5K AED Profit** (39.04% margin).
  - `Electronics_Mobile Accessories_1174` (Premium): **690.0K AED Profit** (37.27% margin).
  - All top 10 most profitable products were within the **Electronics** category (Batteries, Cables, Accessories, and Chargers).

#### Q4: Store & Regional Geographic Performance
- **Regional Split**: Dubai captures **58.2%** of retail revenue, Abu Dhabi **28.5%**, and Sharjah **13.3%**.
- **Top Stores**: `BlueMart Store 41` (1.50M AED), `Store 11` (1.49M AED), `Store 49` (1.49M AED).
- **Store Formats**:
  - **Mall Outlets (22 Stores)**: Highest electronics sales volume and largest average order value.
  - **High Street Outlets (18 Stores)**: Highest local weekday footfall and delivery dispatch density.
  - **Community Stores (10 Stores)**: Strongest repeat customer loyalty and highest Grocery/Dairy basket share.

#### Q5: Omnichannel Revenue Attribution
- **In-Store**: **$30.23M (41.29%)** — Core margin anchor with zero third-party take rates.
- **Website**: **$20.30M (27.73%)** — Direct-to-consumer digital portal capturing first-party customer telemetry.
- **Mobile App**: **$13.10M (17.89%)** — Highest customer retention and repeat purchase cadence.
- **Amazon.ae**: **$6.47M (8.84%)** & **Noon**: **$3.11M (4.25%)** — High-reach discovery channels with platform commissions.

### 4. Diagnostic Risk Modeling & Ad-Hoc Analytics
- **Stockout Hazard Engine**: Flagged high-selling consumable electronics where stock on hand was below median, averting supply disruptions during high-demand peaks.
- **Margin Leakage Detection**: Pinpointed products with high sales volume but sub-median profits (e.g., `Dairy_Cream_1015`, `Grocery_Rice_1121` at <14.3% margin), recommending minimum markup thresholds and private-label substitution.
- **Pareto Principle Validation**: Proved that **41 SKUs (20.5% of total catalog)** deliver **80% of company revenue**, enabling leadership to focus supply chain priority and safety stock on the vital few.

---

## Core Full-Stack Architecture

### Backend & Data Pipeline
- **FastAPI (Python 3.12)**: Asynchronous REST engine structured with modular routers (`/overview`, `/analytics`, `/explorer`).
- **Neon Serverless PostgreSQL**: Cloud database storing 641,843 sales transactions with PgBouncer connection pooling executing complex aggregations in **<50ms**.
- **Production Infrastructure**: Hosted on an **Oracle Cloud Infrastructure (OCI)** Ubuntu server with **PM2** process management, automated crash recovery, and **Caddy** automated SSL reverse proxy.

### Frontend & BI Dashboard
- **React 19 & TypeScript**: Component-driven SPA optimized with lazy-loaded route splitting.
- **Tailwind CSS & Recharts**: Custom glassmorphism aesthetic with responsive data visualizations (composed line/bar trends, donut distributions, city comparison matrices).
- **Exact-Geometry Skeleton Loading**: Handcrafted skeleton placeholders matching the exact height, shape, and grid layout of cards and charts in both light and dark themes, eliminating layout shifts.

---

## Technologies & Tools

- **Data Science & Analytics**: Python 3.12, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook
- **Database & Query Optimization**: PostgreSQL, Neon Cloud Serverless, PgBouncer, SQLAlchemy
- **Backend Architecture**: FastAPI, Uvicorn, PM2, Caddy Server, REST APIs
- **Frontend & Visualization**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Deployment & Cloud Infrastructure**: Oracle Cloud Infrastructure (OCI), Vercel Edge Platform, Git/GitHub

---

## My Role & Impact

- **End-to-End Data Analysis**: Cleaned, audited, and modeled **641,843 transaction records** and **8,735 inventory snapshots** in Python, establishing actionable retail KPIs.
- **Strategic Business Problem Solving**: Addressed the 5 fundamental executive management questions, uncovering that Electronics accounts for 55.7% of gross sales and identifying 41 Pareto SKUs driving 80% of enterprise revenue.
- **Inventory & Risk Engine Design**: Engineered diagnostic models for stockout detection and margin leak prevention, enabling data-backed replenishment schedules.
- **High-Performance Architecture**: Architected a production FastAPI backend on Oracle Cloud with PgBouncer connection pooling achieving sub-50ms query times over 641K records.
- **Executive Frontend Delivery**: Built a responsive, dual-theme React 19 dashboard deployed on Vercel with tailored skeleton loading for seamless executive presentation.
