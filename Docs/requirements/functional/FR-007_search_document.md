---
**ID Požadavku:** FR-007
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.1
---

### Název Funkčního Požadavku:
Vyhledání "Document" objektů

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje vyhledat existující "Document" objekty v 3DEXPERIENCE na základě zadaných kritérií (např. názvu, titulku), aby mohl ověřit jejich existenci před vytvořením nového, nebo aby mohl s nalezenými dokumenty dále pracovat.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro vyhledání "Document" objektů.
   - **Vstupní podmínky/Data:**
     - Vyhledávací řetězec (`searchString`), který se má použít pro hledání (např. název dokumentu, část titulku).
     - Volitelně parametry pro stránkování (např. `$top`, `$skip`), pokud je API podporuje a utilita je má zprostředkovat.
     - Volitelně parametry pro upřesnění, jaká data o nalezených dokumentech vrátit (`$include`, `$fields`).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na vyhledání "Document" objektů se zadaným `searchString` a volitelnými parametry.
     2. Utilita sestaví dotaz pro API endpoint `GET /resources/v1/modeler/documents/search`.
        - Povinný parametr: `searchStr={searchString}`.
        - Volitelné parametry: `$top`, `$skip`, `$include`, `$fields` dle vstupu od Widgetu.
     3. Utilita použije `Connector3DSpace.js` pro volání tohoto endpointu.
     4. Utilita zpracuje odpověď od 3DEXPERIENCE, která bude obsahovat pole nalezených dokumentů (nebo prázdné pole).
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Pole objektů reprezentujících nalezené "Document" objekty (např. obsahující jejich `id`, `title`, `name` a další relevantní metadata dle parametrů `$include`/`$fields`).
     - V případě neúspěchu (chyba API, nevalidní vstup): Chybová zpráva/kód.
     - Pokud nejsou nalezeny žádné dokumenty: Prázdné pole.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE.
     - Nevalidní vyhledávací řetězec nebo parametry.
     - API vrátí chybu (např. problém s indexem).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem s validním vyhledávacím řetězcem utilita vrátí seznam "Document" objektů, které odpovídají kritériím.
   - Vrácená data o dokumentech jsou v souladu s požadovanými parametry (`$include`/`$fields`).
   - Pokud nejsou nalezeny žádné dokumenty, je vráceno prázdné pole.
   - V případě chyby je Widgetu vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [ ] Mělo by být (High/Should-have) - Užitečné pro kontrolu duplicit a vyhledávání.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js`.
   - WebAPI 3DEXPERIENCE pro vyhledávání dokumentů (`/resources/v1/modeler/documents/search`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován v 3DEXPERIENCE.
   - Vyhledávací služba (Exalead index) na straně 3DEXPERIENCE je funkční.

**8. Otevřené Otázky/Poznámky:**
   - Jaké konkrétní atributy dokumentu by měly být primárně prohledávány (např. `title`, `name`, `description`)? API prohledává metadata i obsah souborů.
   - Jak se utilita postaví k limitu 50 dokumentů vrácených API? Bude podporovat stránkování (`$top`, `$skip`)?
   - Jaké minimální informace o nalezených dokumentech by měla funkce standardně vracet, pokud Widget nespecifikuje `$include` nebo `$fields`? (Např. `id`, `title`, `name`).
   - Bude utilita nabízet nějakou formu pokročilejšího vyhledávání (např. kombinace více kritérií, pokud to `searchStr` syntaxe API umožňuje)? API popis zmiňuje `TitleOfDocument+(current:Frozen)`.
