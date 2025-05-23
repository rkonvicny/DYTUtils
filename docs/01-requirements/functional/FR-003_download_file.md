---
**ID Požadavku:** FR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.9 (Odstranění podpory versionId, vždy se stahuje aktuální verze)
---

### Název Funkčního Požadavku:
Stažení obsahu JSON souboru z "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTUtils - Document Extension` (která volá funkce z `DYTUtils - DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Aktér potřebuje načíst obsah konkrétního JSON souboru z přílohy "Document" objektu v 3DEXPERIENCE.

**3. Popis Funkcionality:**
   - Utilita `DYTUtils - DocumentWebServiceHelper` poskytne funkci pro stažení obsahu jednoho specifikovaného JSON souboru, který je přílohou k zadanému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Název konkrétního JSON souboru, který má být stažen (`fileName` - povinné, string).
   - **Hlavní scénář (Kroky):**
     1. Utilita `DYTUtils - DocumentWebServiceHelper` přijme požadavek na stažení obsahu souboru.
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `GET /resources/v1/modeler/documents/{docId}/files` k získání seznamu metadat všech aktuálních souborů (`allCurrentFilesMetadata`) v daném dokumentu.
     3. Utilita najde v `allCurrentFilesMetadata` soubor, jehož `dataelements.title` odpovídá zadanému `fileName`.
        a. Pokud soubor není nalezen, operace končí chybou ("File not found").
        b. Pokud je nalezeno více souborů se stejným `fileName`, použije se první nalezený.
     4. Z metadat nalezeného souboru se získá jeho `fileId`.
     5. **Získání Download Ticketu:**
        a. Utilita získá download ticket pro aktuální verzi souboru: `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket`.
     6. Pokud získání ticketu selže, operace končí chybou.
     7. **Stažení obsahu z FCS:** Utilita stáhne obsah souboru z FCS pomocí získaného ticketu.
     8. Pokud stahování selže, operace končí chybou.
     9. Utilita vrátí stažený obsah souboru (jako string).
   - **Výstupní podmínky/Data (pro funkci v `DocumentWebServiceHelper`):**
     - V případě úspěchu: Obsah souboru jako textový řetězec. Metadata o staženém souboru (např. `FileInfo`).
     - V případě neúspěchu: Chybová zpráva/kód (např. "Document not found", "File not found", "Download failed").
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Soubor se zadaným `fileName` v dokumentu neexistuje.
     - Selhání získání Download ticketu.
     - Selhání stahování z FCS.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce z `DocumentWebServiceHelper` s validním `docId` a `fileName`:
     - Je vrácen obsah požadovaného souboru.
     - Vrácená data (řetězec) odpovídají obsahu souboru v 3DEXPERIENCE.
   - V případě, že dokument nebo soubor neexistuje, nebo dojde k jiné chybě, je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro stahování souborových příloh a získávání metadat souborů.

**7. Předpoklady:**
   - Aktér (např. `DYTUtils - Document Extension`) je autentizován.
   - `Connector3DSpace.js` je funkční.
   - "Document" objekt, identifikovaný `docId`, existuje.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Verzování souborů: V této verzi se nebude podporovat stahování konkrétní verze souboru pomocí `versionId`. Vždy se stáhne aktuální (první nalezená) verze souboru.
   - [ROZHODNUTO] Získání `fileId` z `fileName`: Utilita vždy provede `GET .../{docId}/files` a prohledá výsledky.
   - [ROZHODNUTO] Více souborů se stejným `fileName`: Utilita použije první nalezený soubor.
   - [POZNÁMKA] Tento FR popisuje pouze stažení obsahu jednoho souboru. Deserializace na JSON objekt probíhá ve vyšší vrstvě (v `DYTUtils - Document Extension`).
   - Poznámka: Tato funkcionalita bude primárně implementována v rámci modulu `DYTUtils - DocumentWebServiceHelper`.
   - [VIZE DO BUDOUCNA] Možnost rozšířit funkcionalitu o stahování více souborů najednou (např. pokud `fileName` je pole) nebo všech souborů (pokud `fileName` není zadán).
