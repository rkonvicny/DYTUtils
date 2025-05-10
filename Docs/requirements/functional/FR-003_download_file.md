---
**ID Požadavku:** FR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.3 (aktualizace aktéra)
---

### Název Funkčního Požadavku:
Stažení (Download) JSON souboru z přílohy "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (pokud provádí interní volání svých vlastních funkcí jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje načíst dříve uložená JSON data (např. nastavení, datovou tabulku) z přílohy "Document" objektu v 3DEXPERIENCE pro použití ve své logice.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro stažení obsahu JSON souboru, který je přílohou k zadanému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Název JSON souboru (`fileName`), který má být stažen.
     - Volitelně identifikátor verze souboru (`versionId`), pokud se má stáhnout specifická verze.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na stažení JSON souboru.
     2. Utilita (nebo `Connector3DSpace.js`) nejprve potřebuje získat `fileId` pro daný `fileName` a `docId`. Toho lze dosáhnout voláním `GET /resources/v1/modeler/documents/{docId}/files` (nebo `GET /resources/v1/modeler/documents/{docId}?$include=files`) a prohledáním výsledků.
     3. Pokud je specifikován `versionId`:
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/versions/{versionId}/DownloadTicket`.
     4. Pokud `versionId` není specifikován (stahuje se nejnovější verze):
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket`.
        - Vstup: `docId`, `fileId`.
        - Výstup: `ticketURL`, `fileName` (z FCS).
     5. Utilita (nebo `Connector3DSpace.js`) stáhne obsah souboru z FCS serveru pomocí získaného `ticketURL`.
     6. Utilita zpracuje stažený obsah (očekává se text).
     7. Utilita převede stažený textový obsah na JSON objekt.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: JSON objekt nebo řetězec reprezentující obsah souboru.
     - V případě neúspěchu: Chybová zpráva/kód, nebo např. `null`/`undefined`.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Soubor s daným názvem u "Document" objektu neexistuje (nebyl nalezen `fileId`).
     - Selhání stahování souboru.
     - Selhání získání Download ticketu.
     - Stažený soubor není validní JSON (jak řešit?).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je obsah zadaného JSON souboru z "Document" objektu úspěšně načten.
   - Vrácená data (JSON objekt/řetězec) odpovídají obsahu souboru v 3DEXPERIENCE.
   - V případě chyby (např. soubor neexistuje) je Widgetu vrácena adekvátní informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro stahování souborových příloh.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - [VYŘEŠENO] Jak se bude specifikovat verze souboru ke stažení, pokud bude podporováno verzování? -> Pomocí `versionId` a endpointu `.../versions/{versionId}/DownloadTicket`.
   - Jak utilita získá `fileId` na základě `fileName`? (Pravděpodobně interním voláním `GET .../{docId}/files`). Měla by utilita cachovat toto mapování?
   - Co se stane, pokud existuje více souborů se stejným `fileName` pod jedním `docId`? Který `fileId` se vybere? (Měl by se brát první nalezený, nebo by to měla být chyba?)
