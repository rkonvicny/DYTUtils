# DYTUtils - Knihovna pro práci s dokumenty v 3DEXPERIENCE

`DYTUtils` je JavaScriptová/TypeScriptová knihovna navržená pro zjednodušení interakce s dokumenty a soubory uloženými v platformě 3DEXPERIENCE. Primárně se zaměřuje na snadné načítání a ukládání JSON dat do souborů v dokumentech, ale poskytuje i sadu nízkoúrovňovějších utilit pro přímou manipulaci s dokumenty a soubory.

## Klíčové Funkcionality

*   **Načítání JSON dat**: Jednoduše načtěte JSON data ze specifikovaného souboru v rámci dokumentu 3DEXPERIENCE. Knihovna se postará o vyhledání dokumentu, stažení souboru a deserializaci JSON obsahu.
*   **Ukládání JSON dat**: Uložte JavaScriptové objekty jako JSON data do souboru v dokumentu. Knihovna zvládne zajištění existence dokumentu, jeho zamčení (volitelně), nahrání souboru a jeho připojení k dokumentu.
*   **Správa dokumentů a souborů**: Poskytuje rozhraní pro běžné operace jako vyhledání dokumentu, vytvoření dokumentu, získání metadat souborů, zamčení/odemčení dokumentu, smazání souboru atd.

## Hlavní Komponenty

1.  **`JsonManager`**:
    *   Vysokoúrovňové API pro práci s JSON daty.
    *   Zapouzdřuje komplexní logiku pro načítání a ukládání JSON.
    *   Ideální pro většinu běžných scénářů práce s konfiguračními daty nebo strukturovanými daty.

2.  **`DocumentHelper`**:
    *   Střední vrstva poskytující fasádu pro všechny operace s dokumenty a soubory.
    *   Orchestruje volání na `Connector3DSpace` a implementuje logiku jednotlivých případů užití (UC).
    *   Může být použit přímo pro pokročilejší scénáře, které `JsonManager` nepokrývá.

3.  **`Connector3DSpace`**:
    *   Nízkoúrovňová komponenta zodpovědná za skutečnou HTTP komunikaci s API platformy 3DEXPERIENCE a File Collaboration Serverem (FCS).
    *   Spravuje CSRF tokeny a zpracovává odpovědi ze serveru.

## Základní Příklady Použití

Následující příklady předpokládají, že máte instanci `JsonManager` (nebo `DocumentHelper`) správně nakonfigurovanou a dostupnou.

### Načtení JSON dat z dokumentu

```javascript
// Předpokládáme, že máte instanci jsonManager

async function loadConfiguration(documentTitle, configFileName) {
  try {
    const configData = await jsonManager.loadJsonFromDocument(documentTitle, configFileName);
    console.log("Konfigurace úspěšně načtena:", configData);
    // ... práce s configData
  } catch (error) {
    console.error("Chyba při načítání konfigurace:", error);
  }
}

loadConfiguration("MojeAppKonfigurace", "settings.json");
```

### Uložení JSON dat do dokumentu

```javascript
// Předpokládáme, že máte instanci jsonManager

async function saveConfiguration(documentTitle, configFileName, newConfigData) {
  try {
    const saveOptions = {
      ensureDocExists: true, // Vytvoří dokument, pokud neexistuje
      lockDoc: true,         // Zamkne dokument před úpravou
      overwrite: true,       // Přepíše existující soubor
      documentType: "DYT_ConfigDocument" // Typ dokumentu, pokud se vytváří nový
    };
    const result = await jsonManager.saveJsonToDocument(documentTitle, configFileName, newConfigData, saveOptions);
    console.log("Konfigurace úspěšně uložena:", result);
  } catch (error) {
    console.error("Chyba při ukládání konfigurace:", error);
  }
}

const myData = { version: "1.0", theme: "dark" };
saveConfiguration("MojeAppKonfigurace", "settings.json", myData);
```

## Detailní Dokumentace

Pro hlubší pochopení architektury a funkcionality knihovny `DYTUtils` se podívejte na následující zdroje v adresáři `Docs/`:

*   **Případy Užití (Use Cases)**:
    *   Hlavní diagram případů užití
    *   Detailní popisy případů užití
*   **Robustness Diagramy**:
    *   Přehled Robustness diagramů
*   **Sekvenční Diagramy**:
    *   Přehled Sekvenčních diagramů
*   **Třídní Diagramy**:
    *   Diagram klíčových tříd

## Předpoklady a Nastavení

*(Tato sekce bude doplněna později - např. jak získat a konfigurovat Connector3DSpace, autentizace atd.)*

## Vývoj a Přispívání

*(Tato sekce bude doplněna později - informace pro vývojáře, jak spouštět testy, konvence kódování atd.)*

---
*Tento dokument byl naposledy aktualizován: 2025-05-14*