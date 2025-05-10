---
**ID Požadavku:** FR-004
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.4 (nově vytvořen rozdělením původního FR-004)
---

### Název Funkčního Požadavku:
Zamčení (Rezervace/Check-out) Dokumentu nebo Souboru pro modifikaci

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje zajistit exkluzivní přístup k Dokumentu nebo konkrétnímu souboru v Dokumentu před jeho modifikací, aby se předešlo konfliktům při souběžných úpravách.
   - Widget může potřebovat stáhnout aktuální verzi souboru po jeho zamčení.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro zamčení (rezervaci/check-out) zadaného Dokumentu nebo konkrétního souboru v rámci Dokumentu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
     - Volitelně identifikátor souboru (`fileId`) nebo název souboru (`fileName`), pokud se má zamknout pouze konkrétní soubor. Pokud není specifikován, zamkne se celý Dokument.
     - Volitelně komentář k rezervaci/check-outu.
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na zamčení Dokumentu nebo souboru.
     2. Pokud je zadán `fileName` a ne `fileId`, utilita nejprve získá `fileId` (např. voláním `GET /resources/v1/modeler/documents/{docId}/files`).
     3. **Zamčení konkrétního souboru:** Pokud je specifikován `fileId` (nebo byl získán z `fileName`):
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/CheckoutTicket`.
        - Vstup: `docId`, `fileId`.
        - Výstup: `ticketURL` pro stažení souboru, `fileName` (z FCS), potvrzení o zamčení.
     4. **Zamčení celého Dokumentu:** Pokud není specifikován `fileId` ani `fileName`:
        Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/reserve`.
        - Vstup: `docId`, volitelně `reservedComment`.
        - Výstup: Aktualizovaná metadata Dokumentu potvrzující rezervaci.
     5. Utilita zpracuje odpověď a vrátí Widgetu informaci o úspěšnosti zamčení a případně ticket pro stažení.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o zamčení. Pokud byl zamčen konkrétní soubor, také `ticketURL` a `fileName` pro stažení.
     - V případě neúspěchu: Chybová zpráva/kód (např. objekt neexistuje, je již zamčen jiným uživatelem, nedostatečná oprávnění).
   - **Alternativní scénáře/Chybové stavy:**
     - Dokument nebo soubor neexistuje.
     - Dokument nebo soubor je již zamčen jiným uživatelem.
     - Widget nemá oprávnění k zamčení.
     - Selhání komunikace s 3DEXPERIENCE.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je specifikovaný Dokument nebo soubor úspěšně zamčen v 3DEXPERIENCE.
   - Pokud byl zamčen konkrétní soubor, Widget obdrží platný ticket pro jeho stažení.
   - V případě, že je objekt již zamčen nebo dojde k jiné chybě, Widget obdrží srozumitelnou chybovou informaci.

**5. Priorita:**
   - [ ] Mělo by být (High/Should-have) - Důležité pro řízenou modifikaci.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro operace reserve/checkout.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován a má potřebná oprávnění.

**8. Otevřené Otázky/Poznámky:**
   - Jaký bude preferovaný mechanismus zamčení, pokud utilita bude nabízet obě možnosti (celý dokument vs. konkrétní soubor)?
   - Bude stažení souboru po check-outu automatické, nebo bude Widget muset volat samostatnou funkci pro stažení s použitím vráceného ticketu? (Pravděpodobně samostatná funkce, aby byla větší flexibilita).
   - Jak se bude řešit situace, kdy `fileName` není unikátní pod daným `docId`?
