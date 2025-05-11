---
**ID Požadavku:** FR-004
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.6 (finalizace otevřených otázek, přejmenování souboru)
---

### Název Funkčního Požadavku:
Zamčení (Rezervace) "Document" objektu pro modifikaci

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (interně, např. před `FR-002` nebo `FR-005`)

**2. Cíl/Potřeba Aktéra:**
   - Widget (nebo utilita) potřebuje zajistit exkluzivní přístup k "Document" objektu před jeho modifikací nebo modifikací jeho souborů, aby se předešlo konfliktům při souběžných úpravách.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro zamčení (rezervaci) zadaného "Document" objektu.
   - **Vstupní podmínky/Data:**
     - Identifikátor "Document" objektu (`docId`).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na zamčení "Document" objektu.
     2. Utilita (nebo `Connector3DSpace.js`) zavolá `PUT /resources/v1/modeler/documents/{docId}/reserve`.
        - Vstup: `docId`.
     3. Utilita zpracuje odpověď a vrátí Widgetu informaci o úspěšnosti zamčení.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Potvrzení o zamčení (např. aktualizovaná metadata Dokumentu potvrzující rezervaci a kým je rezervován).
     - V případě neúspěchu: Chybová zpráva/kód (např. objekt neexistuje, je již zamčen jiným uživatelem, nedostatečná oprávnění).
   - **Alternativní scénáře/Chybové stavy:**
     - "Document" objekt neexistuje.
     - "Document" objekt je již zamčen jiným uživatelem.
     - Widget nemá oprávnění k zamčení.
     - Selhání komunikace s 3DEXPERIENCE.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem je specifikovaný "Document" objekt úspěšně zamčen v 3DEXPERIENCE.
   - V případě, že je objekt již zamčen nebo dojde k jiné chybě, Widget obdrží srozumitelnou chybovou informaci.

**5. Priorita:**
   - [X] Mělo by být (High/Should-have) - Důležité pro řízenou modifikaci.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro operaci `reserve` na dokumentu (`PUT /resources/v1/modeler/documents/{docId}/reserve`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován a má potřebná oprávnění.

**8. Otevřené Otázky/Poznámky:**
   - [ROZHODNUTO] Zamčení se bude provádět na úrovni celého dokumentu pomocí `PUT .../{docId}/reserve`.
   - [VYŘEŠENO] Stažení souboru po check-outu: Není součástí tohoto požadavku; řeší `FR-003`.
   - [NEPATŘÍ SEM] Jak se bude řešit situace, kdy `fileName` není unikátní: Tato otázka se přesouvá k požadavkům, které pracují s `fileName`.
