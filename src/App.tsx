import React, { useState, useMemo, useEffect } from 'react';
import { JsonEditor } from './components/JsonEditor';
import { QueryInput } from './components/QueryInput';
import { JsonTable } from './components/JsonTable';
import jmespath from 'jmespath';
import inventario from './DB/inventario.json';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [jsonArrayKey, setJsonArrayKey] = useState("");
  const [first, setFirst] = useState(true);
  
  useEffect(() => {
    setJsonInput(JSON.stringify(inventario, null, 2));
  }, []);

  const getNestedKeys = React.useCallback((obj: any, prefix = ''): string[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      if (Array.isArray(value) && typeof value[0] === 'object' && value[0] !== null) {
        // Si es un array de objetos → usar [subKey]
        return Object.keys(value[0]).flatMap((subKey) => {
          // const path = prefix ? `${prefix}.${key}[${subKey}]` : `${key}[${subKey}]`;
          const path = prefix ? `${prefix}.${key}._${subKey}` : `${key}._${subKey}`;
          return path;
        });
      } else if (value && typeof value === 'object') {
        // Si es objeto anidado → seguir profundizando
        const path = prefix ? `${prefix}.${key}` : key;
        return getNestedKeys(value, path);
      } else {
        // Valor simple
        const path = prefix ? `${prefix}.${key}` : key;
        return path;
      }
    });
  }, []);


  const jsonFields = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const entry = Object.entries(parsed).find(
        ([, value]) =>
          Array.isArray(value) && typeof value[0] === 'object' && value[0] !== null
      );
      if (entry) {
        const [key, value] = entry;
        setJsonArrayKey(key);
        return getNestedKeys((value as Record<string, any>[])[0]);
      }
      return [];
    } catch {
      return [];
    }
  }, [getNestedKeys, jsonInput]);


  const handleRun = () => {
    setFirst(false)
    try {
      const json = JSON.parse(jsonInput);
      const result = jmespath.search(json, query);
      setResults(Array.isArray(result) ? result : [result]);
    } catch (err) {
      alert('JSON o Query inválido');
    }
  };

  return (
    <div style={{padding:"4", maxWidth:"100%", margin:"2%"}}>
      <h1
        style={{
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#1f2937', 
          borderBottom: '3px solid #c01c7b', 
          paddingBottom: '8px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        COELSA INVENTARIO
      </h1>

      <div style={{marginLeft: "1%", marginRight: "3%",}}>
        <QueryInput setQuery={setQuery} onRun={handleRun} jsonFields={jsonFields} jsonArrayKey={jsonArrayKey} />
        <JsonEditor value={first? jsonInput : JSON.stringify(results, null, 2)} onChange={()=>("")} readOnly={true}/>
        <JsonTable data={results} />
      </div>
    </div>
  );
}

export default App;

