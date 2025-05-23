---
**ID Požadavku:** FR-005
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.1
---

### Název Funkčního Požadavku:
Odstranění souboru z "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (jako součást komplexnější operace, např. při aktualizaci souboru)

**2. Cíl/Potřeba Aktéra:**
   - Widget (nebo utilita interně) potřebuje odstranit konkrétní soubor (přílohu) z "Document" objektu v 3DEXPERIENCE.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro odstranění zadaného souboru z "Document" objektu. Před odstraněním utilita zamkne "Document" objekt a po úspěšném odstranění jej odemkne.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Identifikátor souboru (`fileId`) nebo název souboru (`fileName`), který má být odstraněn.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na odstranění souboru.
     2. **Zamčení Dokumentu:** Utilita interně zavolá funkci odpovídající požadavku `FR-004` (Zamčení Dokumentu) pro zadaný `docId`. Pokud zamčení selže, operace končí chybou.
     3. Pokud je zadán `fileName` a ne `fileId`, utilita nejprve získá `fileId`(s) pro všechny soubory s daným `fileName` (např. voláním `GET /resources/v1/modeler/documents/{docId}/files`).
     4. Pro každý nalezený `fileId` (nebo pro přímo zadaný `fileId`):
        a. Utilita (nebo `Connector3DSpace.js`) zavolá `DELETE /resources/v1/modeler/documents/{docId}/files/{fileId}`.
     5. **Odemčení Dokumentu:** Utilita interně zavolá funkci odpovídající požadavku `FR-006` (Odemčení Dokumentu) pro zadaný `docId`. (Tento krok se provede i v případě, že předchozí kroky selhaly, pokud byl dokument úspěšně zamčen).
     6. Utilita zpracuje odpověď(i) od 3DEXPERIENCE (z kroku 4) a vrátí výsledek Widgetu.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o úspěšném odstranění všech relevantních souborů.
     - V případě neúspěchu (pokud alespoň jedno odstranění selže): Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Selhání zamčení dokumentu.
     - Soubor s daným `fileId` (nebo `fileName`) u "Document" objektu neexistuje (a odstranění se tedy neprovede, což nemusí být chyba, pokud je cílem zajistit, že tam soubor není).
     - Selhání komunikace s 3DEXPERIENCE.
     - Nedostatečná oprávnění pro odstranění souboru.
     - Selhání odemčení dokumentu.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce je "Document" objekt zamčen.
   - Všechny specifikované soubory (dle `fileId` nebo všechny s daným `fileName`) jsou úspěšně odstraněny z "Document" objektu v 3DEXPERIENCE.
   - "Document" objekt je odemčen.
   - V případě chyby je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Potřebné pro logiku aktualizace "smaž a nahraj nový".

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro mazání souborů (`DELETE /resources/v1/modeler/documents/{docId}/files/{fileId}`).
   - Funkcionalita pro získání `fileId` z `fileName` (dle `FR-003` nebo interní).
   - Funkcionalita pro zamčení/odemčení dokumentu (dle `FR-004`, `FR-006`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Zamčení/odemčení dokumentu je povinnou součástí této operace.
   - Vyžaduje operace `DELETE .../files/{fileId}` předchozí zamčení dokumentu/souboru ze strany platformy? (Naše utilita to bude dělat pro konzistenci).
   - Pokud je zadán `fileName` a je nalezeno více souborů se stejným názvem, mají se odstranit všechny? (Ano, pro konzistenci s logikou "nahrazení" v `FR-002`).
