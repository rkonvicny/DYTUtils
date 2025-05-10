---
**ID Požadavku:** NFR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.3 (aktualizace odkazů na FR)
---

### Název Nefunkčního Požadavku:
Integrace s `Connector3DSpace.js`

**1. Kategorie Nefunkčního Požadavku:**
   - [X] Omezení Návrhu (Design Constraints)
   - [X] Kompatibilita (Compatibility)

**2. Popis Požadavku:**
   - Veškerá komunikace nové utility s WebAPI platformy 3DEXPERIENCE pro operace s "Document" objekty a jejich souborovými přílohami musí probíhat výhradně prostřednictvím existující utility `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - Nová utilita nesmí přímo volat `WAFData` nebo jiné nízkoúrovňové komunikační mechanismy pro interakci s 3DX.

**3. Měřítko / Kritéria Ověření:**
   - Code review potvrdí, že všechna volání směřující na 3DEXPERIENCE API využívají funkce poskytované `Connector3DSpace.js`.
   - Testy prokáží funkčnost přes `Connector3DSpace.js`.

**4. Zdůvodnění / Dopad Nesplnění:**
   - Konzistence v komunikaci s platformou, využití již existující a otestované vrstvy, centralizace logiky pro připojení a autentizaci. Nesplnění by vedlo k duplicitě kódu a potenciálním problémům s údržbou.

**5. Priorita:**
   - [X] Kritická

**6. Související Funkční Požadavky (pokud existují):**
   - FR-001, FR-002, FR-003, FR-004, FR-005, FR-006 (všechny, které komunikují s 3DX)

**7. Otevřené Otázky/Poznámky:**
   - Je `Connector3DSpace.js` plně vybaven pro všechny potřebné operace (včetně vícekrokových interakcí s FCS a volání specifických Document API endpointů), nebo bude potřeba jej rozšířit?
