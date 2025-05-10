---
**ID Požadavku:** FR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** [KONR]
**Verze:** 0.1
---

### Název Funkčního Požadavku:
Stažení (Download) JSON souboru z přílohy "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Vývojář widgetu (prostřednictvím volání API utility)
   - Utilita samotná

**2. Cíl/Potřeba Aktéra:**
   - Načíst dříve uložená JSON data (např. nastavení, datovou tabulku) z přílohy "Document" objektu v 3DEXPERIENCE pro použití v aplikaci/widgetu.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro stažení obsahu JSON souboru, který je přílohou k zadanému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu.
     - Název JSON souboru, který má být stažen.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na stažení JSON souboru.
     2. Utilita použije `Connector3DSpace.js` pro volání příslušného WebAPI 3DEXPERIENCE pro stažení souboru.
     3. Utilita zpracuje odpověď (obsah souboru).
     4. Utilita převede stažený obsah na JSON objekt (pokud je to žádoucí).
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: JSON objekt nebo řetězec reprezentující obsah souboru.
     - V případě neúspěchu: Chybová zpráva/kód, nebo např. `null`/`undefined`.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Soubor s daným názvem u "Document" objektu neexistuje.
     - Selhání stahování souboru.
     - Stažený soubor není validní JSON (jak řešit?).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce je obsah zadaného JSON souboru z "Document" objektu úspěšně načten.
   - Vrácená data (JSON objekt/řetězec) odpovídají obsahu souboru v 3DEXPERIENCE.
   - V případě chyby (např. soubor neexistuje) je vrácena adekvátní informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro stahování souborových příloh.

**7. Předpoklady:**
   - Uživatel (widget) je autentizován.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - Jak se bude specifikovat verze souboru ke stažení, pokud bude podporováno verzování?
