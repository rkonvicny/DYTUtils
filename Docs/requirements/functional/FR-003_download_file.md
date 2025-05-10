---
**ID Požadavku:** FR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.6 (upřesnění chování při chybách u více souborů)
---

### Název Funkčního Požadavku:
Stažení JSON souboru(ů) z "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (pokud provádí interní volání svých vlastních funkcí jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje načíst dříve uložená JSON data z jednoho či více souborů (nebo všech souborů) z přílohy "Document" objektu v 3DEXPERIENCE pro použití ve své logice.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro stažení obsahu JSON souboru(ů), které jsou přílohou k zadanému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - `fileName` (volitelné):
       - Pokud **string**: Název konkrétního JSON souboru, který má být stažen.
       - Pokud **pole stringů**: Seznam názvů JSON souborů, které mají být staženy.
       - Pokud **není zadán (nebo `null`/`undefined`)**: Mají být staženy všechny soubory z dokumentu.
     - `versionId` (volitelné): Identifikátor verze souboru. Použitelné pouze pokud je `fileName` zadán jako string (pro stažení specifické verze jednoho souboru). V ostatních případech je ignorován a stahují se nejnovější verze.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na stažení JSON souboru(ů).
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `GET /resources/v1/modeler/documents/{docId}/files` (nebo `GET /resources/v1/modeler/documents/{docId}?$include=files`) k získání seznamu metadat všech souborů (`allFilesMetadata`) v daném dokumentu.
     3. Určení souborů ke stažení (`targetFilesMetadata`):
        a. **Pokud je `fileName` string:** Utilita prohledá `allFilesMetadata` a najde první soubor, jehož `dataelements.title` odpovídá zadanému `fileName`. Pokud není nalezen, operace končí chybou "Soubor nenalezen". `targetFilesMetadata` obsahuje tento jeden soubor.
        b. **Pokud je `fileName` pole stringů:** Utilita pro každý název v poli prohledá `allFilesMetadata` a najde první odpovídající soubor. `targetFilesMetadata` obsahuje seznam nalezených souborů. Pokud některý název není nalezen, bude pro něj ve výsledku zaznamenána chyba.
        c. **Pokud `fileName` není zadán:** `targetFilesMetadata` se stane `allFilesMetadata` (všechny soubory).
     4. Pro každý soubor v `targetFilesMetadata` (nebo pro každý název v poli `fileName`, pokud byl zadán jako pole):
        a. Získá se jeho `fileId` a `actualFileName` (z `dataelements.title`). Pokud soubor pro daný název nebyl nalezen (v případě `fileName` jako pole), zaznamená se chyba pro tento `actualFileName` a přejde se k dalšímu.
        b. Pokud je `fileName` původně string A je zadán `versionId`:
           Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/versions/{versionId}/DownloadTicket`.
        c. Jinak (stahuje se nejnovější verze):
           Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket`.
           - Vstup: `docId`, `fileId`.
           - Výstup: `ticketURL`, `fcsFileName`.
        d. Utilita (nebo `Connector3DSpace.js`) stáhne obsah souboru z FCS serveru pomocí získaného `ticketURL`. Pokud stahování selže, zaznamená se chyba pro tento `actualFileName` a přejde se k dalšímu.
        e. Utilita zpracuje stažený obsah (očekává se text) a převede jej na JSON objekt. Pokud parsování selže, zaznamená se chyba "Invalid JSON" pro tento `actualFileName`.
        f. Stažený JSON objekt (nebo informace o chybě) se uloží do výsledné struktury (např. mapy/objektu s klíčem `actualFileName`).
   - **Výstupní podmínky/Data:**
     - Pokud byl `fileName` původně **string**: JSON objekt nebo řetězec reprezentující obsah souboru. Nebo `null`/objekt s chybou, pokud soubor nebyl nalezen nebo se jej nepodařilo zpracovat.
     - Pokud byl `fileName` původně **pole stringů** nebo **nebyl zadán**: Objekt (mapa), kde klíče jsou názvy požadovaných/všech souborů (`actualFileName`). Hodnotou pro každý klíč bude:
       - Deserializovaný JSON obsah, pokud byl soubor úspěšně nalezen, stažen a zpracován.
       - Objekt s informací o chybě (např. `{ error: "Not found" }`, `{ error: "Invalid JSON" }`, `{ error: "Download failed" }`), pokud se zpracování daného souboru nezdařilo.
     - V případě obecné chyby (např. dokument neexistuje, chyba komunikace s API pro seznam souborů): Chybová zpráva/kód, která se týká celé operace.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje (celá operace selže).
     - Specifikovaný `fileName` (pokud je string) v "Document" objektu neexistuje (operace pro tento soubor selže a vrátí chybu).
     - Pokud je `fileName` pole a některý ze souborů v poli není nalezen: Pro tento soubor bude ve výsledku zaznamenána chyba "Not found". Ostatní soubory se zpracují normálně.
     - Selhání získání Download ticketu pro konkrétní soubor: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují normálně.
     - Selhání stahování konkrétního souboru z FCS: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují normálně.
     - Stažený obsah pro konkrétní soubor není validní JSON: Pro tento soubor bude ve výsledku zaznamenána chyba "Invalid JSON". Ostatní soubory se zpracují normálně.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem:
     - Pokud je `fileName` string: obsah zadaného JSON souboru je úspěšně načten a vrácen, nebo je vrácena chyba, pokud se zpracování nezdařilo.
     - Pokud je `fileName` pole nebo není zadán: je vrácen objekt (mapa) obsahující buď úspěšně načtené JSON obsahy pro každý relevantní soubor, nebo informaci o chybě pro soubory, které se nepodařilo zpracovat.
   - Vrácená data (JSON objekty/řetězce) odpovídají obsahu souborů v 3DEXPERIENCE.
   - V případě chyby (např. dokument neexistuje) je Widgetu vrácena adekvátní informace.

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
   - [ROZHODNUTO] Více souborů se stejným `fileName` (při specifikaci jednoho `fileName`): Utilita použije první nalezený soubor. (Poznámka: `FR-002` by měl zajišťovat, že k této situaci nedochází.)
   - [ROZHODNUTO] Pokud je `fileName` pole a některý ze souborů v poli není nalezen: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují.
   - [ROZHODNUTO] Pokud při stahování více souborů některý není validní JSON: Pro tento soubor bude ve výsledku zaznamenána chyba. Ostatní soubory se zpracují.
