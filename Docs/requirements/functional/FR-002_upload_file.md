---
**ID Požadavku:** FR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.6 (aktualizace odkazu na FR-005)
---

### Název Funkčního Požadavku:
Nahrání/Nahrazení JSON souboru v "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje zajistit, aby v "Document" objektu existoval JSON soubor daného názvu s definovaným obsahem. Pokud soubor s daným názvem již existuje, jeho obsah má být nahrazen.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci, která zajistí nahrání JSON dat jako souboru (přílohy) k zadanému "Document" objektu. Před nahráním utilita zamkne "Document" objekt. Pokud soubor se stejným názvem již existuje, bude nejprve odstraněn. Po úspěšném nahrání bude "Document" objekt odemčen.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`), ke kterému se má soubor přiložit/ve kterém má být nahrazen.
     - JSON objekt nebo řetězec k uložení.
     - Název pro ukládaný/nahrazovaný JSON soubor (`fileName`, např. `gridSettings.json`).
     - Volitelně komentář k souboru.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na nahrání/nahrazení JSON souboru.
     2. **Zamčení Dokumentu:** Utilita interně zavolá funkci odpovídající požadavku `FR-004` (Zamčení Dokumentu) pro zadaný `docId`. Pokud zamčení selže, operace končí chybou.
     3. **Odstranění existujícího souboru (pokud existuje):** Utilita interně zavolá funkci odpovídající požadavku `FR-005` (Odstranění souboru) pro zadaný `docId` a `fileName`, aby odstranila všechny existující soubory s tímto názvem.
     4. **Získání Check-in Ticketu:** Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket`.
        - Vstup: `docId`.
        - Výstup: `ticketURL`, `ticketparamname`, `ticket`.
     5. Utilita převede JSON objekt na řetězec (např. UTF-8).
     6. **Upload na FCS:** Utilita (nebo `Connector3DSpace.js`) nahraje obsah JSON souboru na FCS server pomocí získaného ticketu.
        - Výstup: FCS `receipt`.
     7. **Připojení metadat souboru:** Utilita sestaví JSON payload pro request body podle schématu `files` (pole s jedním souborem).
        - Klíčové atributy v `dataelements`: `title` (`fileName`), `receipt` (z kroku 6), `comments` (volitelně), `format` (nastaveno na "application/json").
     8. Utilita (nebo `Connector3DSpace.js`) zavolá `POST /resources/v1/modeler/documents/{docId}/files` s připraveným JSON payloadem.
     9. **Odemčení Dokumentu:** Utilita interně zavolá funkci odpovídající požadavku `FR-006` (Odemčení Dokumentu) pro zadaný `docId`. (Tento krok se provede i v případě, že předchozí kroky selhaly, pokud byl dokument úspěšně zamčen).
     10. Utilita zpracuje odpověď od 3DEXPERIENCE (z kroku 8) a vrátí výsledek Widgetu.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o úspěšném nahrání/nahrazení, metadata nahraného souboru (včetně jeho `id` - fileId).
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - Selhání zamčení dokumentu.
     - Selhání při odstraňování existujícího souboru (pokud existoval a odstranění selhalo).
     - Selhání získání Check-in ticketu.
     - Selhání nahrávání na FCS.
     - Selhání připojení metadat souboru k dokumentu.
     - Selhání odemčení dokumentu (mělo by být logováno, ale primární výsledek operace je dán úspěchem nahrání).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je "Document" objekt zamčen.
   - Jakýkoliv existující soubor se zadaným `fileName` v "Document" objektu je odstraněn.
   - Nový JSON soubor je úspěšně nahrán jako příloha k zadanému "Document" objektu v 3DEXPERIENCE.
   - "Document" objekt je odemčen.
   - Obsah nahraného souboru v 3DEXPERIENCE odpovídá původním JSON datům.
   - V případě chyby je Widgetu vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro práci se souborovými přílohami.
   - Funkcionalita pro odstranění souboru (dle `FR-005`).
   - Funkcionalita pro zamčení/odemčení dokumentu (dle `FR-004`, `FR-006`).
   - Existence "Document" objektu, ke kterému se nahrává.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován a má potřebná oprávnění.
   - `Connector3DSpace.js` je funkční.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Verzování: Utilita nebude aktivně spravovat verze, spoléhá na chování platformy. Každé nahrání (i nahrazení) vytvoří novou "první" verzi souboru s daným názvem.
   - [ROZHODNUTO] Existence souboru se stejným názvem: Bude nahrazen (odstraněn a nahrán nový).
   - [ROZHODNUTO] Formát souboru: Bude použit "application/json".
   - [ROZHODNUTO] Zamčení/odemčení dokumentu je povinnou součástí této operace.
