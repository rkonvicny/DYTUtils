---
**ID Požadavku:** FR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** [KONR]
**Verze:** 0.1
---

### Název Funkčního Požadavku:
Vytvoření nového 3DEXPERIENCE "Document" objektu pro ukládání JSON dat

**1. Popis Aktéra/Uživatele:**
   - Vývojář widgetu (prostřednictvím volání API utility)
   - Utilita samotná (jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Vytvořit v 3DEXPERIENCE nový kontejner (objekt typu "Document") pro následné ukládání JSON souborů (např. konfigurací, malých datových sad).

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro vytvoření nového objektu typu "Document" v prostředí 3DEXPERIENCE.
   - **Vstupní podmínky/Data:**
     - Název pro nový "Document" objekt (povinné).
     - Volitelně další metadata pro "Document" (např. popis) - *k další specifikaci, pokud je relevantní*.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na vytvoření nového "Document" objektu s definovanými parametry.
     2. Utilita použije `Connector3DSpace.js` pro volání příslušného WebAPI 3DEXPERIENCE pro vytvoření "Document" objektu.
     3. Utilita zpracuje odpověď od 3DEXPERIENCE.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Identifikátor (např. physical ID) nově vytvořeného "Document" objektu.
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE.
     - Nedostatečná oprávnění pro vytvoření objektu.
     - Nevalidní vstupní parametry.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce s validními parametry je v 3DEXPERIENCE vytvořen nový "Document" objekt.
   - Funkce vrátí validní identifikátor nově vytvořeného "Document" objektu.
   - V případě chyby je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Základní funkce pro práci s novými daty.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js` (pro komunikaci s 3DEXPERIENCE).
   - Přístup k WebAPI 3DEXPERIENCE pro tvorbu "Document" objektů.

**7. Předpoklady:**
   - Uživatel (widget) je autentizován v 3DEXPERIENCE.
   - `Connector3DSpace.js` je správně inicializován a funkční.

**8. Otevřené Otázky/Poznámky:**
   - Jaká konkrétní WebAPI metoda (přes `Connector3DSpace.js`) bude použita pro vytvoření "Document" objektu?
   - Jsou potřeba nějaká defaultní metadata pro nově vytvářené "Document" objekty?
   - Jak se bude řešit případ, kdy "Document" s daným názvem již existuje (pokud je název myšlen jako unikátní identifikátor v nějakém kontextu)?
