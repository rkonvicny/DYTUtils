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
