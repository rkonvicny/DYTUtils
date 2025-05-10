---
**ID Požadavku:** FR-005
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.1 (nově vytvořen rozdělením původního FR-004)
---

### Název Funkčního Požadavku:
Aktualizace obsahu JSON souboru a Check-in

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje nahrát modifikovaný obsah JSON souboru do 3DEXPERIENCE, vytvořit novou verzi souboru a případně soubor odemknout.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro nahrání nového obsahu JSON souboru na FCS a následné provedení operace check-in v 3DEXPERIENCE, čímž se aktualizují metadata souboru a vytvoří nová verze.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Identifikátor souboru (`fileId`) nebo název souboru (`fileName`), který se aktualizuje.
     - Nový JSON obsah (objekt nebo řetězec) k uložení.
     - Volitelně komentář k check-inu (např. důvod změny).
     - Volitelně příznak `keepLocked` (zda má soubor zůstat zamčený i po check-inu, defaultně `false`).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na aktualizaci a check-in JSON souboru.
     2. Pokud je zadán `fileName` a ne `fileId`, utilita nejprve získá `fileId` (např. voláním `GET /resources/v1/modeler/documents/{docId}/files`).
     3. **Získání Check-in Ticketu:** Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket`.
        - Vstup: `docId`.
        - Výstup: `ticketURL`, `ticketparamname`, `ticket`.
     4. **Upload nové verze na FCS:** Utilita převede nový JSON obsah na řetězec a (nebo `Connector3DSpace.js`) nahraje tento obsah na FCS server pomocí ticketu z kroku 3.
        - Výstup: Nový FCS `receipt`.
     5. **Check-in (Update File Metadata):** Utilita sestaví JSON payload pro request body podle schématu `files` (pole s jedním souborem).
        - Klíčové atributy v `dataelements`: `title` (původní název souboru, neměl by se měnit touto operací), `receipt` (z kroku 4), `comments` (komentář k check-inu), `keepLocked`.
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}` s tímto payloadem.
     6. Utilita zpracuje odpověď a vrátí Widgetu informaci o úspěšnosti a nové verzi souboru.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o úspěšném check-inu, metadata aktualizovaného souboru (včetně nové verze/revize).
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Dokument nebo soubor neexistuje.
     - Soubor není zamčen volajícím Widgetem (pokud to platforma vyžaduje pro `PUT` operaci).
     - Selhání získání Check-in ticketu.
     - Selhání nahrávání na FCS.
     - Selhání operace `PUT .../files/{fileId}` (update metadat).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je nový obsah JSON souboru úspěšně nahrán na FCS.
   - Metadata souboru v 3DEXPERIENCE jsou aktualizována a je vytvořena nová verze souboru.
   - Soubor je odemčen, pokud `keepLocked` bylo `false` (nebo nebylo specifikováno).
   - Widget obdrží informace o nové verzi souboru.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Klíčová funkce pro modifikaci dat.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro operace se soubory (check-in ticket, update file).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován a má potřebná oprávnění.
   - Soubor, který má být aktualizován, existuje.
   - (Volitelně) Soubor je zamčen volajícím Widgetem, pokud to vyžaduje logika platformy/utility.

**8. Otevřené Otázky/Poznámky:**
   - Vyžaduje operace `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}` (update file metadata) předchozí zamčení souboru volajícím? (Pravděpodobně ano, pro konzistenci).
   - Jak se bude řešit situace, kdy `fileName` není unikátní pod daným `docId` při získávání `fileId`?
   - Může se při `PUT .../{docId}/files/{fileId}` měnit i `title` (název souboru)? OpenAPI naznačuje, že ne (`x-ApplicableOperations: Create (Required), Read (Yes), Modify (No)` pro `files.dataelements.title`). Přejmenování by byla jiná operace.
