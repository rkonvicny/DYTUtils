---
**ID Požadavku:** FR-002
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.8 (Odstranění podpory komentářů při nahrávání)
---

### Název Funkčního Požadavku:
Nahrání JSON souboru do "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTJSONManager` (která volá funkce z `DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Aktér potřebuje nahrát obsah JSON jako soubor do specifikovaného a již zamčeného "Document" objektu v 3DEXPERIENCE.

**3. Popis Funkcionality:**
   - Utilita `DocumentWebServiceHelper` poskytne funkci, která zajistí nahrání JSON dat jako souboru (přílohy) k zadanému a již zamčenému "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`), ke kterému se má soubor přiložit.
     - Obsah souboru jako řetězec (`fileContent`, např. serializovaný JSON).
     - Název pro ukládaný JSON soubor (`fileName`, např. `gridSettings.json`).
     - Typ obsahu (`contentType`, např. "application/json").
   - **Hlavní scénář (Kroky):**
     1. Utilita `DocumentWebServiceHelper` přijme požadavek na nahrání souboru.
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
   - [POZNÁMKA] Tato funkcionalita bude primárně implementována v rámci modulu `DocumentWebServiceHelper`.
   - [ROZHODNUTO] Komentáře k souborům: V této verzi se nebudou komentáře k souborům předávat platformě 3DEXPERIENCE během nahrávání.
