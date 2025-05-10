---
**ID Požadavku:** FR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.2 (aktualizováno na základě OpenAPI)
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
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`), ke kterému se má soubor přiložit.
     - JSON objekt nebo řetězec k uložení.
     - Název pro ukládaný JSON soubor (např. `gridSettings.json`, `lookupTable.json`).
     - Volitelně komentář k souboru.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na nahrání JSON dat k "Document" objektu.
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket` pro získání FCS check-in ticketu.
        - Vstup: `docId`.
        - Výstup: `ticketURL`, `ticketparamname`, `ticket`.
     3. Utilita převede JSON objekt na řetězec (např. UTF-8).
     4. Utilita (nebo `Connector3DSpace.js`) nahraje obsah JSON souboru na FCS server pomocí získaného ticketu (`ticketURL`, `ticketparamname`, `ticket`).
        - Výstup: FCS `receipt`.
     5. Utilita sestaví JSON payload pro request body podle schématu `files` (pole s jedním souborem).
        - Klíčové atributy v `dataelements`: `title` (název souboru), `receipt` (z kroku 4), `comments` (volitelně), `format` (např. "generic" nebo specifický pro JSON, pokud existuje).
     6. Utilita (nebo `Connector3DSpace.js`) zavolá `POST /resources/v1/modeler/documents/{docId}/files` s připraveným JSON payloadem pro připojení metadat souboru k dokumentu.
     7. Utilita zpracuje odpověď od 3DEXPERIENCE.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o úspěšném nahrání, metadata nahraného souboru (včetně jeho `id` - fileId).
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Selhání získání Check-in ticketu.
     - Selhání nahrávání na FCS.
     - Selhání připojení metadat souboru k dokumentu.
     - Soubor s daným názvem (`title`) již u "Document" objektu existuje. API `POST /resources/v1/modeler/documents/{docId}/files` pravděpodobně vytvoří další soubor se stejným názvem (s jiným fileId). Je třeba zvážit, zda tomu chceme předcházet (např. kontrolou existence souboru se stejným názvem před nahráním a případně použít operaci modifikace - viz FR-004).

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
   - [VYŘEŠENO ČÁSTEČNĚ] Jaké konkrétní WebAPI metody budou použity? -> `PUT .../CheckinTicket`, (FCS upload), `POST .../{docId}/files`.
   - Jak se bude řešit verzování souborů při prvním nahrání? (Pravděpodobně se vytvoří první verze souboru).
   - Pokud soubor se stejným názvem již existuje, má utilita selhat, přepsat (pokud to API umožňuje přímo), nebo vytvořit nový soubor se stejným názvem? (Standardní `POST .../{docId}/files` pravděpodobně přidá nový soubor).
   - Jaký `format` máme použít pro JSON soubory v `files.dataelements.format`? ("generic"?)
