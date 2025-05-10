---
**ID Požadavku:** NFR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.2 (aktualizace odkazů na FR)
---

### Název Nefunkčního Požadavku:
Práce s JSON daty

**1. Kategorie Nefunkčního Požadavku:**
   - [X] Omezení Návrhu (Design Constraints)

**2. Popis Požadavku:**
   - Utilita je primárně navržena pro ukládání a načítání dat ve formátu JSON.
   - Funkce pro ukládání by měly přijímat JavaScriptové objekty/pole a interně je serializovat do JSON.
   - Funkce pro načítání by měly vracet deserializované JavaScriptové objekty/pole.

**3. Měřítko / Kritéria Ověření:**
   - Testy prokáží, že utilita korektně serializuje a deserializuje různé typy JSON struktur (objekty, pole, vnořené struktury, různé datové typy v JSON).

**4. Zdůvodnění / Dopad Nesplnění:**
   - JSON je standardní a snadno použitelný formát pro konfigurace a strukturovaná data v JavaScriptovém prostředí.

**5. Priorita:**
   - [X] Kritická

**6. Související Funkční Požadavky (pokud existují):**
   - FR-002, FR-003, FR-005

**7. Otevřené Otázky/Poznámky:**
   - Bude potřeba řešit nějaké specifické kódování znaků pro JSON? (Obvykle UTF-8, což by mělo být v pořádku).
