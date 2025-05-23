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
