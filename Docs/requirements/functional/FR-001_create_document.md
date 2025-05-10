---
**ID Požadavku:** FR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.4 (zapracování rozhodnutí k otevřeným otázkám)
---

### Název Funkčního Požadavku:
Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (pokud provádí interní volání svých vlastních funkcí jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje zajistit existenci "Document" objektu se specifickým titulkem v 3DEXPERIENCE pro následné ukládání JSON souborů (např. konfigurací, malých datových sad). Pokud dokument neexistuje, má být vytvořen.

**3. Popis Funkcionality:**
   - Utilita poskytne funkci, která nejprve ověří existenci "Document" objektu se zadaným titulkem. Pokud dokument neexistuje, vytvoří nový. Pokud existuje, vrátí informace o existujícím dokumentu.
   - **Vstupní podmínky/Data:**
     - Titulek ("title") pro "Document" objekt (povinné).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na zajištění existence "Document" objektu se zadaným titulkem.
     2. Utilita interně zavolá funkci odpovídající požadavku `FR-007` (Vyhledání "Document" objektů) s použitím zadaného titulku jako `searchString`.
     3. **Pokud je nalezen jeden nebo více dokumentů s odpovídajícím titulkem:**
        a. Utilita vrátí Widgetu identifikátor (`id`) a metadata prvního nalezeného dokumentu. (Strategie pro výběr v případě více shod bude definována v `FR-007`).
     4. **Pokud není nalezen žádný dokument s odpovídajícím titulkem:**
        a. Utilita sestaví JSON payload pro request body pro vytvoření nového dokumentu podle schématu `documents` (definovaného v OpenAPI).
           - Povinný atribut v `dataelements`: `title` (zadaný Widgetem).
           - Ostatní atributy (např. `name`, `policy`, `collabspace`, `description`) nebudou explicitně nastaveny utilitou a ponechají se na defaultním chování platformy 3DEXPERIENCE (např. autonaming pro `name`).
        b. Utilita použije `Connector3DSpace.js` pro volání `POST /resources/v1/modeler/documents` s připraveným JSON payloadem.
        c. Utilita zpracuje odpověď od 3DEXPERIENCE.
        d. Utilita vrátí Widgetu identifikátor (`id`) a metadata nově vytvořeného "Document" objektu.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu (dokument nalezen nebo nově vytvořen): Identifikátor (`id`) "Document" objektu a jeho základní metadata.
     - V případě neúspěchu (např. chyba při vyhledávání nebo vytváření): Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE (při vyhledávání nebo vytváření).
     - Nedostatečná oprávnění pro vyhledání nebo vytvoření objektu.
     - Nevalidní vstupní parametry (např. prázdný titulek).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem s validním titulkem:
     - Pokud dokument s daným titulkem existuje, funkce vrátí jeho `id` a metadata.
     - Pokud dokument s daným titulkem neexistuje, je v 3DEXPERIENCE vytvořen nový "Document" objekt se zadaným titulkem a funkce vrátí jeho `id` a metadata.
   - V případě chyby je Widgetu vrácena srozumitelná chybová informace.

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
   - [VYŘEŠENO] Jaká konkrétní WebAPI metoda (přes `Connector3DSpace.js`) bude použita pro vytvoření "Document" objektu? -> `POST /resources/v1/modeler/documents`
   - [ROZHODNUTO] Povinné a volitelné atributy: Povinný bude pouze `title`. Ostatní (např. `name`, `description`, `policy`, `collabspace`) nebudou utilitou explicitně nastavovány.
   - [ROZHODNUTO] Existence dokumentu: Utilita nejprve vyhledá dokument podle titulku (využitím `FR-007`). Pokud existuje, vrátí jeho ID. Pokud neexistuje, vytvoří nový.
   - Je třeba upřesnit v `FR-007`, jak se bude řešit případ, kdy vyhledávání vrátí více dokumentů se stejným titulkem (pro účely `FR-001` se vezme první nalezený).
