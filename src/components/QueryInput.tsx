
import React, { useState, useEffect } from 'react';

interface Props {
  setQuery: (q: string) => void;
  onRun: () => void;
  jsonFields: string[];
  jsonArrayKey: string;
}

type Filter = {
  field: string;
  operator: string;
  value: string;
  not: boolean;
};

const operators = [
  { label: "es igual a", value: "==" },
  { label: "es distinto de", value: "!=" },
  { label: "es mayor que", value: ">" },
  { label: "es menor que", value: "<" },
  { label: "contiene", value: "contains" },
];

export const QueryInput: React.FC<Props> = ({ setQuery, onRun, jsonFields, jsonArrayKey }) => {
  
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    const expressions = filters.map(({ field, operator, value, not }) => {
      if (!field) return "";

      const prefix = not ? "!" : "";
      const isNumber = !isNaN(Number(value));
      const valueExpr = isNumber ? `\`${value}\`` : `'${value}'`;

      let left = "";

      // Si ya es una expresión avanzada, como reviews[?rating == `1`], no la toques
      if (field.includes("[?")) {
        left = field;
      }
      else if (field.includes("._") && !field.includes("[")) {
        const [arrayField, nestedField] = field.split("._");
        left = `${arrayField}[?${nestedField} ${operator} ${valueExpr}]`;
      }
      else if (operator === "contains") {
        left = `contains(${field}, '${value}')`;
      }
      else {
        left = `${field} ${operator} ${valueExpr}`;
      }

      return `${prefix}(${left})`;
    });

    const combined = expressions.filter(Boolean).join(" && ");
    const fullQuery = `${jsonArrayKey}[?${combined}]`;
    setQuery(fullQuery);
    console.log("fullQuery:", fullQuery);
  }, [filters, setQuery, jsonArrayKey]);


  const updateFilter = (index: number, newFilter: Partial<Filter>) => {
    setFilters((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newFilter };
      return updated;
    });
  };

  const addFilter = () => {
    setFilters([...filters, { field: jsonFields[0] || "", operator: "==", value: "", not: false }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 'bold' }}>CONSULTAS:</div>

      {filters.map((filter, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <label>
            <input
              type="checkbox"
              checked={filter.not}
              onChange={(e) => updateFilter(index, { not: e.target.checked })}
            /> Negar
          </label>

          <select
            value={filter.field}
            onChange={(e) => updateFilter(index, { field: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '6px', minWidth: '100px' }}
          >
            {jsonFields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => updateFilter(index, { operator: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '6px', minWidth: '120px' }}
          >
            {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>

          <input
            type="text"
            value={filter.value}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            placeholder="valor"
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '6px', minWidth: '160px' }}
          />

          {filters.length > 1 && (
            <button onClick={() => removeFilter(index)} style={{ background: '#aaa', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={addFilter}
          style={{ backgroundColor: '#4caf50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          + Agregar Filtro
        </button>

        <button
          onClick={onRun}
          style={{ backgroundColor: '#c01c7b', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Filtrar
        </button>
        
      </div>
    </div>
  );

};
