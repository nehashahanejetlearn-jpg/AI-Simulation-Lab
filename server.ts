import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Science Assistant endpoint
app.post("/api/ai-assistant", async (req, res) => {
  const { message, topic } = req.body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "A message string is required." });
    return;
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const systemInstruction = `You are Dr. Nova, an inspiring, futuristic AI Science Lab Assistant helping students explore Volcanoes, Rocket Propulsion, and DNA Genetics in the AI Science Simulation Lab.
Provide concise, student-friendly, and scientifically precise explanations.
Use clear formatting: 2-3 brief paragraphs or bullet points, an intuitive real-world analogy, and one fun scientific fact.
Topic context: ${topic || "General Science & Simulation Lab"}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction,
        },
      });

      const text = response.text || "";
      res.json({ answer: text, source: "gemini" });
      return;
    } catch (err: unknown) {
      console.warn("Gemini API call failed, falling back to local science response:", err);
    }
  }

  // Fallback if no API key or API call failed
  res.json({
    answer: getLocalScienceAnswer(message, topic),
    source: "local_engine",
  });
});

// Comprehensive local science answering engine
function getLocalScienceAnswer(question: string, topic?: string): string {
  const q = question.toLowerCase();

  if (q.includes("volcano") || q.includes("erupt") || q.includes("magma") || q.includes("lava") || topic === "volcano") {
    if (q.includes("difference between magma and lava") || (q.includes("magma") && q.includes("lava"))) {
      return `**Magma vs. Lava: Key Differences**

• **Magma** is molten liquid and semi-liquid rock stored deep underneath Earth's crust in magma chambers, containing trapped pressurized gases and mineral crystals.
• **Lava** is magma that has breached the surface through a vent or fissure. Once it contacts the atmosphere or ocean water, it cools and solidifies into igneous rock (like basalt, pumice, or obsidian).

💡 *Analogy:* Think of magma like soda inside a pressurized bottle, and lava as the liquid pouring out once the cap is opened!`;
    }

    if (q.includes("cause") || q.includes("why do volcanoes erupt") || q.includes("what causes")) {
      return `**What Causes a Volcano to Erupt?**

Volcanic eruptions are powered by two primary physics drivers:
1. **Buoyancy & Density:** Magma is less dense than the solid rock surrounding it, so it rises upward toward the surface.
2. **Dissolved Gas Pressure:** Magma contains dissolved gases (water vapor, CO₂, SO₂). As magma ascends, pressure drops, causing gas bubbles to expand rapidly. If the pressure exceeds the strength of overlying rock, it fractures and violently erupts!

🌋 *Did You Know:* Viscous (sticky) silica-rich magma traps gas bubbles, creating catastrophic explosive eruptions, while runny basaltic magma allows gases to escape gently, forming smooth lava fountains.`;
    }

    return `**Volcanic Dynamics & Thermodynamics**

Volcanoes act as natural planetary cooling vents. When tectonic plates collide or separate, molten rock forms in the mantle.
• **Pressure:** Magma pressure accumulates as more magma recharges from the mantle.
• **Viscosity & Gas:** High gas concentration + high pressure triggers Plinian eruptions with massive ash columns reaching the stratosphere!
• **Lava Velocity:** Basaltic lava can reach speeds of 10–30 km/h on steep slopes!`;
  }

  if (q.includes("rocket") || q.includes("thrust") || q.includes("gravity") || q.includes("fuel") || topic === "rocket") {
    if (q.includes("thrust") || q.includes("why does a rocket need thrust")) {
      return `**Why Does a Rocket Need Thrust?**

• **Newton's Third Law of Motion:** *"For every action, there is an equal and opposite reaction."* A rocket engine burns fuel at extreme temperatures and violently expels exhaust gas downward at thousands of meters per second. The downward force of the gas pushes the rocket upward with an equal thrust force ($F = \\dot{m} v_e$).
• **Overcoming Gravity and Drag:** To lift off from the launch pad, total thrust force must be greater than the rocket's weight ($T > m \\cdot g$).

🚀 *Key Formula:* Net acceleration $a = \\frac{T - m \\cdot g - F_{\\text{drag}}}{m}$. As fuel is burned, rocket mass $m$ drops, meaning acceleration skyrockets!`;
    }

    if (q.includes("without air") || q.includes("in space") || q.includes("vacuum")) {
      return `**Can Rockets Work in Space Without Air?**

**Yes! In fact, rockets work better in the vacuum of space!**
• Unlike jet airplanes, which need atmospheric oxygen to burn fuel, rockets carry both their own **fuel** and **liquid oxygen (oxidizer)**.
• Rockets do *not* push against the air. They push against their own high-speed exhaust gases (conservation of momentum).
• In space, there is zero air resistance (drag), so 100% of thrust directly accelerates the spacecraft!`;
    }

    return `**Rocket Flight Dynamics & Orbital Mechanics**

A rocket launch balances three opposing forces:
1. **Thrust ($T$):** Upward force created by expanding combustion gases.
2. **Gravity ($F_g = m \\cdot g$):** Downward pull of planetary gravity.
3. **Atmospheric Drag ($F_d$):** Air friction opposing motion, which peaks at *Max-Q* (maximum dynamic pressure).
To reach orbit, rockets must not only climb high into space (~400 km) but accelerate horizontally to orbital speed (~28,000 km/h or 7.8 km/s) so they perpetually fall around Earth!`;
  }

  if (q.includes("dna") || q.includes("replication") || q.includes("base") || q.includes("nucleotide") || topic === "dna") {
    if (q.includes("replication") || q.includes("how does dna replication work")) {
      return `**How Does DNA Replication Work?**

DNA replication is **semi-conservative**, meaning each new DNA double helix keeps one original strand and gains one newly built complementary strand!

1. **Unzipping (Helicase):** The enzyme Helicase breaks the hydrogen bonds between base pairs, opening the replication fork.
2. **Priming (Primase):** RNA primers mark where synthesis should start.
3. **Building (DNA Polymerase):** DNA Polymerase attaches free nucleotides matching the complementary rules: **A with T** and **C with G**.
4. **Sealing (Ligase):** DNA Ligase joins the fragments into two identical double-stranded helices!`;
    }

    if (q.includes("pair") || q.includes("adenine") || q.includes("thymine") || q.includes("guanine") || q.includes("cytosine")) {
      return `**Complementary Base Pairing: Chargaff's Rules**

DNA consists of four chemical bases that pair strictly due to hydrogen bonding geometry:
• **Adenine (A)** pairs exclusively with **Thymine (T)** (held by **2 hydrogen bonds**).
• **Cytosine (C)** pairs exclusively with **Guanine (G)** (held by **3 hydrogen bonds**).

🧬 *Why?* A and G are double-ringed **Purines**, while T and C are single-ringed **Pyrimidines**. A purine must always bond with a pyrimidine to keep the width of the DNA spiral constant at exactly 2 nanometers!`;
    }

    return `**The Architecture of DNA**

Deoxyribonucleic Acid (DNA) is the master biochemical blueprint of all life on Earth:
• **Double Helix:** Discovered by Watson, Crick, Franklin, and Wilkins, it resembles a twisted ladder.
• **Backbone:** Alternating sugar (deoxyribose) and phosphate groups form the outer rails.
• **Rungs:** Nucleotide base pairs (A-T and C-G) form the interior genetic code.
• **Information Density:** A single human cell contains ~3 billion base pairs of DNA—stretched out, it would measure 2 meters long!`;
  }

  return `**Welcome to Dr. Nova's Science Laboratory!**

I am ready to answer any questions about our three simulations:
• **Volcano Lab:** Ask about magma chambers, eruption viscosity, tectonic forces, or volcanic gases.
• **Rocket Lab:** Ask about thrust, orbital velocity, Newton's third law, or escape velocity.
• **DNA Lab:** Ask about double helix structure, nucleotide base pairing, or semi-conservative replication.

*Try asking: "What causes a volcano to erupt?" or "Why does a rocket need thrust?"*`;
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Science Lab Server running at http://localhost:${PORT}`);
  });
}

startServer();
