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
