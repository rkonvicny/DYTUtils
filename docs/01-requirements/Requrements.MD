# Combined Document

## Included Files
* 17		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-001_CREATE_DOCUMENT.MD
* 90		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-002_UPLOAD_FILE.MD
* 168		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-003_DOWNLOAD_FILE.MD
* 243		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-004_LOCK_FILE_AND_GET_CHECKOUT_TICKET.MD
* 302		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-005_DELETE_FILE.MD
* 373		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-006_UNRESERVE.MD
* 439		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-007_SEARCH_DOCUMENT.MD
* 507		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-001_CONNECTOR3DSPACE_INTEGRATION.MD
* 547		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-002_REQUIREJS_IMPLEMENTATION.MD
* 588		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-003_JSON_FILE.MD

---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-001_CREATE_DOCUMENT.MD
---
---
**ID Požadavku:** FR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.5 (Uzavření otevřených otázek, zmínka o DocumentWebServiceHelper)
---

### Název Funkčního Požadavku:
Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTUtils - Document Extension` (která volá funkce z `DYTUtils - DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje zajistit existenci "Document" objektu se specifickým titulkem v 3DEXPERIENCE pro následné ukládání JSON souborů (např. konfigurací, malých datových sad). Pokud dokument neexistuje, má být vytvořen.

**3. Popis Funkcionality:**
   - Utilita `DYTUtils - DocumentWebServiceHelper` poskytne funkci, která nejprve ověří existenci "Document" objektu se zadaným titulkem. Pokud dokument neexistuje, vytvoří nový. Pokud existuje, vrátí informace o existujícím dokumentu.
   - **Vstupní podmínky/Data:**
     - Titulek ("title") pro "Document" objekt (povinné).
   - **Hlavní scénář (Kroky):**
     1. Utilita `DYTUtils - DocumentWebServiceHelper` přijme požadavek na zajištění existence "Document" objektu se zadaným titulkem.
     2. Utilita interně zavolá funkci odpovídající požadavku `FR-007` (Vyhledání "Document" objektů) s použitím zadaného titulku jako `searchString`.
     3. **Pokud je nalezen jeden nebo více dokumentů s odpovídajícím titulkem:**
        a. Utilita vrátí identifikátor (`id`) a metadata prvního nalezeného dokumentu. (Strategie pro výběr v případě více shod bude definována v `FR-007`, pro účely této funkce se použije první nalezený).
     4. **Pokud není nalezen žádný dokument s odpovídajícím titulkem (nebo pokud strategie v `FR-007` určí, že se má vytvořit nový i přes existenci jiných):**
        a. Utilita sestaví JSON payload pro request body pro vytvoření nového dokumentu podle schématu `documents` (definovaného v OpenAPI).
           - Povinný atribut v `dataelements`: `title` (zadaný Widgetem).
           - Ostatní atributy (např. `name`, `policy`, `collabspace`, `description`) nebudou explicitně nastaveny utilitou a ponechají se na defaultním chování platformy 3DEXPERIENCE (např. autonaming pro `name`).
        b. Utilita použije `Connector3DSpace.js` pro volání `POST /resources/v1/modeler/documents` s připraveným JSON payloadem.
        c. Utilita zpracuje odpověď od 3DEXPERIENCE.
        d. Utilita vrátí identifikátor (`id`) a metadata nově vytvořeného "Document" objektu.
   - **Výstupní podmínky/Data (pro funkci v `DocumentWebServiceHelper`):**
     - V případě úspěchu (dokument nalezen nebo nově vytvořen): Identifikátor (`id`) "Document" objektu a jeho základní metadata.
     - V případě neúspěchu (např. chyba při vyhledávání nebo vytváření): Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE (při vyhledávání nebo vytváření).
     - Nedostatečná oprávnění pro vyhledání nebo vytvoření objektu.
     - Nevalidní vstupní parametry (např. prázdný titulek).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce z `DocumentWebServiceHelper` s validním titulkem:
     - Pokud dokument s daným titulkem existuje (a strategie `FR-007` neurčí jinak), funkce vrátí jeho `id` a metadata.
     - Pokud dokument s daným titulkem neexistuje (nebo strategie `FR-007` určí vytvoření), je v 3DEXPERIENCE vytvořen nový "Document" objekt se zadaným titulkem a funkce vrátí jeho `id` a metadata.
   - V případě chyby je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Základní funkce pro práci s novými daty.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js` (pro komunikaci s 3DEXPERIENCE).
   - Přístup k WebAPI 3DEXPERIENCE pro tvorbu "Document" objektů (`POST /resources/v1/modeler/documents`).
   - Funkcionalita pro vyhledávání dokumentů (dle `FR-007`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován v 3DEXPERIENCE.
   - `Connector3DSpace.js` je správně inicializován a funkční.

**8. Otevřené Otázky/Poznámky:**
   - [VYŘEŠENO] Jaká konkrétní WebAPI metoda (přes `Connector3DSpace.js`) bude použita pro vytvoření "Document" objektu?
     - Odpověď: `POST /resources/v1/modeler/documents`
   - [ROZHODNUTO] Povinné a volitelné atributy: Povinný bude pouze `title`. Ostatní (např. `name`, `description`, `policy`, `collabspace`) nebudou utilitou explicitně nastavovány.
   - [ROZHODNUTO] Existence dokumentu: Utilita nejprve vyhledá dokument podle titulku (využitím `FR-007`). Pokud existuje, vrátí jeho ID. Pokud neexistuje, vytvoří nový.
   - [VYŘEŠENO] Jak se bude řešit případ, kdy vyhledávání (`FR-007`) vrátí více dokumentů se stejným titulkem?
     - Odpověď: Pro účely `FR-001` se vezme první nalezený dokument. Detailní strategie pro `FR-007` je definována tamtéž.
   - Poznámka: Tato funkcionalita bude primárně implementována v rámci modulu `DYTUtils - DocumentWebServiceHelper` a využívána hlavní utilitou `DYTUtils - Document Extension`.


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-002_UPLOAD_FILE.MD
---
---
**ID Požadavku:** FR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.8 (Odstranění podpory komentářů při nahrávání)
---

### Název Funkčního Požadavku:
Nahrání JSON souboru do "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTUtils - Document Extension` (která volá funkce z `DYTUtils - DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Aktér potřebuje nahrát obsah JSON jako soubor do specifikovaného a již zamčeného "Document" objektu v 3DEXPERIENCE.

**3. Popis Funkcionality:**
   - Utilita `DYTUtils - DocumentWebServiceHelper` poskytne funkci, která zajistí nahrání JSON dat jako souboru (přílohy) k zadanému a již zamčenému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`), ke kterému se má soubor přiložit.
     - Obsah souboru jako řetězec (`fileContent`, např. serializovaný JSON).
     - Název pro ukládaný JSON soubor (`fileName`, např. `gridSettings.json`).
     - Typ obsahu (`contentType`, např. "application/json").
   - **Hlavní scénář (Kroky):**
     1. Utilita `DYTUtils - DocumentWebServiceHelper` přijme požadavek na nahrání souboru.
     2. **Získání Check-in Ticketu:** Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket`.
        - Vstup: `docId`.
        - Výstup: `ticketURL`, `ticketparamname`, `ticket`.
     3. **Upload na FCS:** Utilita (nebo `Connector3DSpace.js`) nahraje `fileContent` na FCS server pomocí získaného ticketu.
        - Výstup: FCS `receipt`.
     4. **Připojení metadat souboru:** Utilita sestaví JSON payload pro request body podle schématu `files` (pole s jedním souborem).
       - Klíčové atributy v `dataelements`: `title` (`fileName`), `receipt` (z kroku 3), `format` (předaný `contentType`). Komentáře se v této verzi nepředávají.

     5. Utilita (nebo `Connector3DSpace.js`) zavolá `POST /resources/v1/modeler/documents/{docId}/files` s připraveným JSON payloadem.
     6. Utilita zpracuje odpověď od 3DEXPERIENCE (z kroku 5) a vrátí výsledek.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Metadata nahraného souboru (včetně jeho `id` - fileId).
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - "Document" objekt není zamčený.
     - Selhání získání Check-in ticketu.
     - Selhání nahrávání na FCS.
     - Selhání připojení metadat souboru k dokumentu.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Nový JSON soubor je úspěšně nahrán jako příloha k zadanému "Document" objektu v 3DEXPERIENCE.
   - Obsah nahraného souboru v 3DEXPERIENCE odpovídá původním JSON datům.
   - V případě chyby je vrácena srozumitelná chybová informace.
   - Funkce předpokládá, že "Document" objekt je již zamčen volající stranou.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have)

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro práci se souborovými přílohami.
   - Existence "Document" objektu, ke kterému se nahrává.

**7. Předpoklady:**
   - Aktér (např. `DYTUtils - Document Extension`) je autentizován a má potřebná oprávnění.
   - `Connector3DSpace.js` je funkční.
   - "Document" objekt, identifikovaný `docId`, existuje a je zamčený volající stranou.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Verzování: Utilita nebude aktivně spravovat verze, spoléhá na chování platformy. Každé nahrání (i nahrazení) vytvoří novou "první" verzi souboru s daným názvem.
   - [POZNÁMKA] Tento FR popisuje pouze nahrání souboru. Logika pro "nahrazení" (tj. smazání existujícího souboru před nahráním nového) je řešena volající stranou (např. v `DYTUtils - Document Extension` s využitím `FR-005`).
   - [ROZHODNUTO] Formát souboru: Bude použit "application/json" (předáno jako `contentType`).
   - [POZNÁMKA] Zamčení/odemčení dokumentu není součástí tohoto FR; předpokládá se, že dokument je již zamčen.
   - [POZNÁMKA] Tato funkcionalita bude primárně implementována v rámci modulu `DYTUtils - DocumentWebServiceHelper`.
   - [ROZHODNUTO] Komentáře k souborům: V této verzi se nebudou komentáře k souborům předávat platformě 3DEXPERIENCE během nahrávání.


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-003_DOWNLOAD_FILE.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-004_LOCK_FILE_AND_GET_CHECKOUT_TICKET.MD
---
---
**ID Požadavku:** FR-004
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.8 (Upřesnění aktéra, odstranění komentáře, zmínka o DocumentWebServiceHelper)
---

### Název Funkčního Požadavku:
Zamčení (Rezervace) "Document" objektu pro modifikaci

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTUtils - Document Extension` (která volá funkce z `DYTUtils - DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Aktér potřebuje zajistit exkluzivní přístup k "Document" objektu před jeho modifikací nebo modifikací jeho souborů, aby se předešlo konfliktům při souběžných úpravách.

**3. Popis Funkcionality:**
   - Utilita `DYTUtils - DocumentWebServiceHelper` poskytne funkci pro zamčení (rezervaci) zadaného "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
   - **Hlavní scénář (Kroky):**
     1. Utilita `DYTUtils - DocumentWebServiceHelper` přijme požadavek na zamčení "Document" objektu.
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/reserve` s prázdným tělem požadavku.
     3. Utilita zpracuje odpověď a vrátí informaci o úspěšnosti zamčení.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o zamčení (např. aktualizovaná metadata Dokumentu potvrzující rezervaci a kým je rezervován).
     - V případě neúspěchu: Chybová zpráva/kód (např. objekt neexistuje, je již zamčen jiným uživatelem, nedostatečná oprávnění).
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - "Document" objekt je již zamčen jiným uživatelem.
     - Aktér nemá oprávnění k zamčení.
     - Selhání komunikace s 3DEXPERIENCE.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce z `DocumentWebServiceHelper` je specifikovaný "Document" objekt úspěšně zamčen v 3DEXPERIENCE.
   - V případě, že je objekt již zamčen nebo dojde k jiné chybě, je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Mělo by být (High/Should-have) - Důležité pro řízenou modifikaci.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro operaci `reserve` na dokumentu (`PUT /resources/v1/modeler/documents/{docId}/reserve`).

**7. Předpoklady:**
   - Aktér (např. `DYTUtils - Document Extension`) je autentizován a má potřebná oprávnění.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Zamčení se bude provádět na úrovni celého dokumentu pomocí `PUT .../{docId}/reserve`.
   - [VYŘEŠENO] Stažení souboru po check-outu: Není součástí tohoto požadavku; řeší `FR-003`.
   - [NEPATŘÍ SEM] Jak se bude řešit situace, kdy `fileName` není unikátní: Tato otázka se přesouvá k požadavkům, které pracují s `fileName`.
   - [POZNÁMKA] Tato funkcionalita bude primárně implementována v rámci modulu `DYTUtils - DocumentWebServiceHelper`.


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-005_DELETE_FILE.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-006_UNRESERVE.MD
---
---
**ID Požadavku:** FR-006
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.1 (nově vytvořen rozdělením původního FR-004)
---

### Název Funkčního Požadavku:
Odemčení (Zrušení rezervace/Check-in bez změn) Dokumentu nebo Souboru

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje uvolnit zámek na Dokumentu nebo souboru, který byl dříve zamčen pro modifikaci, aniž by provedl změny v obsahu souboru (např. uživatel zrušil editaci).

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro odemčení (zrušení rezervace) zadaného Dokumentu nebo konkrétního souboru v rámci Dokumentu, který byl dříve zamčen volajícím Widgetem.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Volitelně identifikátor souboru (`fileId`) nebo název souboru (`fileName`), pokud byl zamčen pouze konkrétní soubor.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na odemčení Dokumentu nebo souboru.
     2. Pokud je zadán `fileName` a ne `fileId`, utilita nejprve získá `fileId` (např. voláním `GET /resources/v1/modeler/documents/{docId}/files`).
     3. **Odemčení konkrétního souboru:** Pokud je specifikován `fileId` (nebo byl získán z `fileName`):
        - API `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}` s `keepLocked: false` (pokud byl soubor zamčen přes `CheckoutTicket` a následně `CheckinTicket` bez reálné změny obsahu, ale jen pro odemčení).
        - Alternativně, pokud platforma nabízí explicitní "unlock file" nebo "cancel checkout" API, použije se to. OpenAPI specifikace přímo takový endpoint pro soubor neukazuje, ale `unreserve` na dokumentu ano. Je třeba ověřit, jak se odemyká soubor zamčený přes `CheckoutTicket` bez provedení `PUT` na `/files/{fileId}`.
     4. **Odemčení celého Dokumentu:** Pokud byl zamčen celý Dokument (a ne konkrétní soubor):
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/unreserve`.
        - Vstup: `docId`.
        - Výstup: Aktualizovaná metadata Dokumentu potvrzující zrušení rezervace.
     5. Utilita zpracuje odpověď a vrátí Widgetu informaci o úspěšnosti odemčení.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o odemčení.
     - V případě neúspěchu: Chybová zpráva/kód (např. objekt neexistuje, není zamčen volajícím, nedostatečná oprávnění).
   - **Alternativní scénáře/Chybové stavy:**
     - Dokument nebo soubor neexistuje.
     - Dokument nebo soubor není zamčen, nebo je zamčen jiným uživatelem.
     - Widget nemá oprávnění k odemčení.
     - Selhání komunikace s 3DEXPERIENCE.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je specifikovaný Dokument nebo soubor úspěšně odemčen v 3DEXPERIENCE.
   - V případě chyby Widget obdrží srozumitelnou chybovou informaci.

**5. Priorita:**
   - [ ] Mohlo by být (Medium/Could-have) - Užitečné pro korektní uvolňování zdrojů.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro operace unreserve/správu zámků.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován a má potřebná oprávnění.
   - Objekt (Dokument/soubor) byl dříve zamčen tímto Widgetem/uživatelem.

**8. Otevřené Otázky/Poznámky:**
   - Jaký je přesný mechanismus pro "zrušení check-outu" nebo "odemčení" konkrétního souboru, který byl zamčen pomocí `PUT .../files/{fileId}/CheckoutTicket`, pokud se neprovede následný `PUT .../files/{fileId}` (check-in)? Je `unreserve` na celém dokumentu dostatečné, nebo existuje specifičtější operace pro soubor? OpenAPI přímo "unreserve file" neukazuje. Možná se soubor odemkne automaticky po určité době, nebo je potřeba provést "check-in" s původním obsahem (nebo bez `receipt`)?
   - Jak se bude řešit situace, kdy `fileName` není unikátní pod daným `docId`?


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\FUNCTIONAL\FR-007_SEARCH_DOCUMENT.MD
---
---
**ID Požadavku:** FR-007
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.2 (zapracování rozhodnutí k otevřeným otázkám)
---

### Název Funkčního Požadavku:
Vyhledání "Document" objektu podle titulku

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (interně, např. pro `FR-001`)

**2. Cíl/Potřeba Aktéra:**
   - Widget (nebo utilita) potřebuje vyhledat existující "Document" objekt v 3DEXPERIENCE na základě jeho přesného titulku, aby mohl ověřit jeho existenci nebo s ním dále pracovat.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro vyhledání "Document" objektu na základě zadaného titulku.
   - **Vstupní podmínky/Data:**
     - Titulek (`title`) dokumentu, který se má vyhledat (povinné).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek na vyhledání "Document" objektu se zadaným `title`.
     2. Utilita sestaví dotaz pro API endpoint `GET /resources/v1/modeler/documents/search`.
        - Povinný parametr: `searchStr={title}` (přesný titulek).
        - Parametry `$top`, `$skip`, `$include`, `$fields` nebudou utilitou explicitně nastavovány.
     3. Utilita použije `Connector3DSpace.js` pro volání tohoto endpointu.
     4. Utilita zpracuje odpověď od 3DEXPERIENCE:
        a. Pokud odpověď obsahuje jeden nebo více dokumentů, utilita vezme první nalezený dokument z pole výsledků.
        b. Pokud odpověď neobsahuje žádné dokumenty (prázdné pole), považuje se to za "nenalezeno".
   - **Výstupní podmínky/Data:**
     - Pokud je nalezen alespoň jeden dokument odpovídající titulku: Objekt reprezentující první nalezený "Document" objekt (obsahující minimálně jeho `id`, `title`, `name` a další defaultně vrácená metadata).
     - Pokud není nalezen žádný dokument: `null` nebo definovaná hodnota indikující "nenalezeno".
     - V případě chyby API nebo nevalidního vstupu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE.
     - API vrátí chybu (např. problém s indexem).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem s validním titulkem:
     - Pokud dokument s daným titulkem existuje, funkce vrátí objekt reprezentující první nalezený dokument.
     - Pokud dokument s daným titulkem neexistuje, funkce vrátí `null` (nebo ekvivalent).
   - V případě chyby je Widgetu vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Mělo by být (High/Should-have) - Užitečné pro kontrolu duplicit a vyhledávání, klíčové pro `FR-001`.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro vyhledávání dokumentů (`/resources/v1/modeler/documents/search`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován v 3DEXPERIENCE.
   - Vyhledávací služba (Exalead index) na straně 3DEXPERIENCE je funkční.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Vyhledávání bude vždy podle přesného `title`.
   - [ROZHODNUTO] Limit 50 a stránkování (`$top`, `$skip`) se neřeší.
   - [ROZHODNUTO] Parametry `$include` a `$fields` se nebudou explicitně používat; spoléháme na defaultní odpověď API.
   - [ROZHODNUTO] Pokročilé vyhledávání se nebude podporovat.
   - [ROZHODNUTO] Pokud vyhledávání vrátí více dokumentů se stejným titulkem, použije se první nalezený.


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-001_CONNECTOR3DSPACE_INTEGRATION.MD
---
---
**ID Požadavku:** NFR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.6 (aktualizace odkazu na FR-005)
---

### Název Nefunkčního Požadavku:
Integrace s `Connector3DSpace.js`

**1. Kategorie Nefunkčního Požadavku:**
   - [X] Omezení Návrhu (Design Constraints)
   - [X] Kompatibilita (Compatibility)

**2. Popis Požadavku:**
   - Veškerá komunikace nové utility s WebAPI platformy 3DEXPERIENCE pro operace s "Document" objekty a jejich souborovými přílohami musí probíhat výhradně prostřednictvím existující utility `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - Nová utilita nesmí přímo volat `WAFData` nebo jiné nízkoúrovňové komunikační mechanismy pro interakci s 3DX.

**3. Měřítko / Kritéria Ověření:**
   - Code review potvrdí, že všechna volání směřující na 3DEXPERIENCE API využívají funkce poskytované `Connector3DSpace.js`.
   - Testy prokáží funkčnost přes `Connector3DSpace.js`.

**4. Zdůvodnění / Dopad Nesplnění:**
   - Konzistence v komunikaci s platformou, využití již existující a otestované vrstvy, centralizace logiky pro připojení a autentizaci. Nesplnění by vedlo k duplicitě kódu a potenciálním problémům s údržbou.

**5. Priorita:**
   - [X] Kritická

**6. Související Funkční Požadavky (pokud existují):**
   - FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007 (všechny, které komunikují s 3DX)

**7. Otevřené Otázky/Poznámky:**
   - Je `Connector3DSpace.js` plně vybaven pro všechny potřebné operace (včetně vícekrokových interakcí s FCS a volání specifických Document API endpointů), nebo bude potřeba jej rozšířit?


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-002_REQUIREJS_IMPLEMENTATION.MD
---
---
**ID Požadavku:** NFR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** [KONR]
**Verze:** 0.1
---

### Název Nefunkčního Požadavku:
Implementace jako RequireJS modul

**1. Kategorie Nefunkčního Požadavku:**
   - [X] Omezení Návrhu (Design Constraints)
   - [X] Udržovatelnost (Maintainability)
   - [X] Kompatibilita (Compatibility)

**2. Popis Požadavku:**
   - Nová utilita musí být implementována jako standardní RequireJS modul.
   - Musí být možné ji snadno integrovat do existujících widgetů vyvíjených pomocí RequireJS.

**3. Měřítko / Kritéria Ověření:**
   - Utilita je definována pomocí `define([...], function(...) {...});`.
   - Lze ji úspěšně načíst a používat v jiném RequireJS modulu.

**4. Zdůvodnění / Dopad Nesplnění:**
   - Standardizace vývoje, snadná správa závislostí, znovupoužitelnost v rámci ekosystému widgetů. Nesplnění by zkomplikovalo integraci a údržbu.

**5. Priorita:**
   - [X] Kritická

**6. Související Funkční Požadavky (pokud existují):**
   - Všechny

**7. Otevřené Otázky/Poznámky:**
   - Budou nějaké specifické konvence pro název modulu nebo jeho umístění ve struktuře projektu?


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\01-REQUIREMENTS\NON-FUNCTIONAL\NFR-003_JSON_FILE.MD
---
---
**ID Požadavku:** NFR-003
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.3 
---

### Název Nefunkčního Požadavku:
Práce s JSON daty

**1. Kategorie Nefunkčního Požadavku:**
   - [X] Omezení Návrhu (Design Constraints)

**2. Popis Požadavku:**
   - Utilita je primárně navržena pro ukládání a načítání dat ve formátu JSON.
   - Funkce pro ukládání by měly přijímat JavaScriptové objekty/pole a interně je serializovat do JSON.
   - Funkce pro načítání by měly vracet deserializované JavaScriptové objekty/pole.

**3. Měřítko / Kritéria Ověření:**
   - Testy prokáží, že utilita korektně serializuje a deserializuje různé typy JSON struktur (objekty, pole, vnořené struktury, různé datové typy v JSON).

**4. Zdůvodnění / Dopad Nesplnění:**
   - JSON je standardní a snadno použitelný formát pro konfigurace a strukturovaná data v JavaScriptovém prostředí.

**5. Priorita:**
   - [X] Kritická

**6. Související Funkční Požadavky (pokud existují):**
   - FR-002, FR-003

**7. Otevřené Otázky/Poznámky:**
   - Bude potřeba řešit nějaké specifické kódování znaků pro JSON? (Obvykle UTF-8, což by mělo být v pořádku).


---
