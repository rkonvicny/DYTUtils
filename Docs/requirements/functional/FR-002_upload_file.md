---
**ID Požadavku:** FR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** [KONR]
**Verze:** 0.1
---

### Název Funkčního Požadavku:
Nahrání (Upload) JSON souboru jako přílohy k "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Vývojář widgetu (prostřednictvím volání API utility)
   - Utilita samotná

**2. Cíl/Potřeba Aktéra:**
   - Uložit JSON data (např. nastavení KendoUI komponenty, malá datová tabulka) do 3DEXPERIENCE jako soubor připojený k existujícímu "Document" objektu.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro nahrání JSON dat jako nového souboru (přílohy) k zadanému "Document" objektu.
   - *Poznámka: Tento požadavek se může později rozdělit nebo zpřesnit v kontextu operací check-in/check-out.*
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu, ke kterému se má soubor přiložit.
     - JSON objekt nebo řetězec k uložení.
     - Název pro ukládaný JSON soubor (např. `gridSettings.json`, `lookupTable.json`).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na nahrání JSON dat k "Document" objektu.
     2. Utilita převede JSON objekt na řetězec (pokud je to nutné).
     3. Utilita použije `Connector3DSpace.js` pro volání příslušného WebAPI 3DEXPERIENCE pro nahrání souboru k "Document" objektu.
     4. Utilita zpracuje odpověď od 3DEXPERIENCE.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o úspěšném nahrání, případně identifikátor souboru/přílohy.
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Selhání nahrávání souboru (problém s konektivitou, velikostí souboru, oprávněními).
     - Soubor s daným názvem již u "Document" objektu existuje (jak řešit? přepsat? verzovat? - *k další specifikaci*).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce je JSON soubor úspěšně nahrán jako příloha k zadanému "Document" objektu v 3DEXPERIENCE.
   - Obsah nahraného souboru v 3DEXPERIENCE odpovídá původním JSON datům.
   - V případě chyby je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro práci se souborovými přílohami "Document" objektů.
   - Existence "Document" objektu, ke kterému se nahrává.

**7. Předpoklady:**
   - Uživatel (widget) je autentizován.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - Jaké konkrétní WebAPI metody (přes `Connector3DSpace.js`) budou použity pro operace se soubory (upload, check-in, check-out, download)? Toto bude specifikováno později.
   - Jak se bude řešit verzování souborů?
   - Jaký je maximální povolený rozměr JSON souboru?
