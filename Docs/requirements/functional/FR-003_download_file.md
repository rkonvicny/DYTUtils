---
**ID Požadavku:** FR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.7 (zjednodušení na iterativní stahování)
---

### Název Funkčního Požadavku:
Stažení JSON souboru(ů) z "Document" objektu (iterativně)

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (pokud provádí interní volání svých vlastních funkcí jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje načíst JSON data z jednoho či více specifikovaných souborů (nebo všech souborů) z přílohy "Document" objektu v 3DEXPERIENCE. Každý soubor má být stažen individuálně.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro stažení obsahu JSON souboru(ů), které jsou přílohou k zadanému "Document" objektu. Každý požadovaný soubor bude stažen individuálně.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - `fileName` (volitelné):
       - Pokud **string**: Název konkrétního JSON souboru, který má být stažen.
       - Pokud **pole stringů**: Seznam názvů JSON souborů, které mají být staženy.
       - Pokud **není zadán (nebo `null`/`undefined`)**: Mají být staženy všechny soubory z dokumentu.
     - `versionId` (volitelné): Identifikátor verze souboru. Použitelné pouze pokud je `fileName` zadán jako string (pro stažení specifické verze jednoho souboru). V ostatních případech je ignorován a stahují se nejnovější verze.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na stažení JSON souboru(ů).
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `GET /resources/v1/modeler/documents/{docId}/files` (nebo `GET /resources/v1/modeler/documents/{docId}?$include=files`) k získání seznamu metadat všech aktuálních souborů (`allCurrentFilesMetadata`) v daném dokumentu.
     3. Inicializace výsledných struktur: `downloadedContents = {}`, `errors = {}`.
     4. Určení souborů ke stažení (`filesToProcessMetadata`):
        a. **Pokud je `fileName` string:** Utilita najde první soubor v `allCurrentFilesMetadata`, jehož `dataelements.title` odpovídá `fileName`. Pokud není nalezen, zaznamená chybu "Not found" pro tento `fileName` do `errors`. `filesToProcessMetadata` obsahuje tento jeden soubor (pokud byl nalezen).
        b. **Pokud je `fileName` pole stringů:** Utilita pro každý název v poli najde první odpovídající soubor v `allCurrentFilesMetadata`. `filesToProcessMetadata` obsahuje seznam nalezených souborů. Pro nenalezené názvy se zaznamená chyba "Not found" do `errors`.
        c. **Pokud `fileName` není zadán:** `filesToProcessMetadata` se stane `allCurrentFilesMetadata`.
     5. Pro každý soubor v `filesToProcessMetadata`:
        a. Získá se jeho `fileId` a `actualFileName`.
        b. Pokud je `fileName` původně string A je zadán `versionId`:
           Utilita získá download ticket pro specifickou verzi: `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/versions/{versionId}/DownloadTicket`.
        c. Jinak (stahuje se nejnovější verze):
           Utilita získá download ticket: `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket`.
        d. Pokud získání ticketu selže, zaznamená se chyba pro `actualFileName` do `errors` a pokračuje se dalším souborem.
        e. Utilita stáhne obsah souboru z FCS. Pokud stahování selže, zaznamená se chyba pro `actualFileName` do `errors` a pokračuje se dalším souborem.
        f. Utilita převede stažený text na JSON objekt. Pokud parsování selže, zaznamená se chyba "Invalid JSON" pro `actualFileName` do `errors`.
        g. Pokud vše proběhlo v pořádku, stažený JSON objekt se uloží do `downloadedContents[actualFileName]`.
   - **Výstupní podmínky/Data:**
     - Objekt obsahující:
       - `contents`: Objekt (mapa), kde klíče jsou názvy souborů (`actualFileName`). Hodnotou je deserializovaný JSON obsah, pokud byl soubor úspěšně stažen a zpracován.
       - `errors`: Objekt (mapa), kde klíče jsou názvy souborů (`actualFileName`) a hodnoty popisují chyby, které nastaly při zpracování daného souboru (např. "Not found", "Invalid JSON", "Download failed").
     - V případě obecné chyby (např. dokument neexistuje): Hlavní chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje (celá operace selže).
     - Chyby u jednotlivých souborů jsou zaznamenány ve výstupním objektu `errors` (viz výše).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem:
     - Jsou vráceny obsahy všech požadovaných souborů (nebo všech souborů v dokumentu, pokud `fileName` nebyl specifikován).
     - Případné chyby při zpracování jednotlivých souborů jsou korektně reportovány v oddělené struktuře.
   - Vrácená data (JSON objekty/řetězce) odpovídají obsahu souborů v 3DEXPERIENCE.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro stahování souborových příloh a získávání metadat souborů.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] `versionId` je volitelný a použitelný pouze při stahování jednoho konkrétního souboru.
   - [ROZHODNUTO] Získání `fileId` z `fileName`: Utilita vždy provede `GET .../{docId}/files` a prohledá výsledky. Cachování se zatím neimplementuje.
   - [ROZHODNUTO] Více souborů se stejným `fileName` (při specifikaci jednoho `fileName`): Utilita použije první nalezený soubor.
   - [ROZHODNUTO] Pokud je `fileName` pole a některý ze souborů v poli není nalezen: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují.
   - [ROZHODNUTO] Pokud při stahování více souborů některý není validní JSON: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují.
