"""
Generate centros.mock.ts from Excel database.
"""
import pandas as pd
import json

# Read Excel
df = pd.read_excel('antivenom_db.xlsx')

# Take first 50 records as sample
sample = df.head(50)

# Types of soro (mock for now since not in database)
soro_types = [
    ['Antibotrópico', 'Anticrotálico'],
    ['Antibotrópico'],
    ['Antibotrópico', 'Anticrotálico', 'Antilaquético'],
    ['Antibotrópico', 'Antielapídico'],
    ['Antibotrópico', 'Anticrotálico', 'Antilaquético', 'Antielapídico'],
]

centros = []
for idx, row in sample.iterrows():
    # Cycle through soro types
    tipos_soro = soro_types[idx % len(soro_types)]
    
    centro = {
        'id': str(idx + 1),
        'nome': str(row.get('Unidade de', '')).strip() if pd.notna(row.get('Unidade de')) else f'Centro {idx + 1}',
        'municipio': str(row.get('Municipio', '')).strip() if pd.notna(row.get('Municipio')) else '',
        'uf': str(row.get('FU', '')).strip() if pd.notna(row.get('FU')) else '',
        'regiao': str(row.get('Region', '')).strip() if pd.notna(row.get('Region')) else '',
        'latitude': float(row.get('Lat (Y)', 0)) if pd.notna(row.get('Lat (Y)')) else 0,
        'longitude': float(row.get('Lon (X)', 0)) if pd.notna(row.get('Lon (X)')) else 0,
        'tiposSoro': tipos_soro,
        'endereco': str(row.get('Endereço', '')).strip() if pd.notna(row.get('Endereço')) and str(row.get('Endereço')).strip() else None,
        'telefone': str(row.get('Telefone', '')).strip() if pd.notna(row.get('Telefone')) and str(row.get('Telefone')).strip() else None,
        'cnes': str(int(row.get('CNES', 0))) if pd.notna(row.get('CNES')) else None,
        'atendimentoTipo': str(row.get('Atendiment', '')).strip() if pd.notna(row.get('Atendiment')) and str(row.get('Atendiment')).strip() else None,
    }
    centros.append(centro)

# Generate TypeScript file
ts_content = '''import type { Centro } from '../../domain/models/Centro';

export const centrosMock: Centro[] = [
'''

for c in centros:
    ts_content += f'''  {{
    id: '{c["id"]}',
    nome: '{c["nome"].replace("'", "\\'")}',
    municipio: '{c["municipio"].replace("'", "\\'")}',
    uf: '{c["uf"]}',
    regiao: '{c["regiao"]}',
    latitude: {c["latitude"]},
    longitude: {c["longitude"]},
    tiposSoro: {json.dumps(c["tiposSoro"])},
    endereco: {f"'{c['endereco'].replace(chr(39), chr(92)+chr(39))}'" if c["endereco"] else 'undefined'},
    telefone: {f"'{c['telefone']}'" if c["telefone"] else 'undefined'},
    cnes: {f"'{c['cnes']}'" if c["cnes"] else 'undefined'},
    atendimentoTipo: {f"'{c['atendimentoTipo'].replace(chr(39), chr(92)+chr(39))}'" if c["atendimentoTipo"] else 'undefined'},
  }},
'''

ts_content += '''];

// Extrair UFs únicas para o filtro
export const ufsDisponiveis = [...new Set(centrosMock.map((c) => c.uf))].sort();

// Extrair tipos de soro únicos para o filtro
export const tiposSoroDisponiveis = [
  ...new Set(centrosMock.flatMap((c) => c.tiposSoro)),
].sort();
'''

with open('src/infrastructure/data/centros.mock.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated {len(centros)} centros")
print("First centro:", json.dumps(centros[0], ensure_ascii=False, indent=2))
