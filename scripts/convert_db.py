"""
Convert Excel database to JSON for the frontend app.
Run this script to generate the centros.json file.
"""
import pandas as pd
import json
import math

# Read Excel
df = pd.read_excel('antivenom_db.xlsx')

# Map columns
column_map = {
    'Region': 'regiao',
    'Federal_Un': 'unidadeFederativa',
    'FU': 'uf',
    'Municipio': 'municipio',
    'Unidade de': 'nome',
    'Endereço': 'endereco',
    'Telefone': 'telefone',
    'CNES': 'cnes',
    'Atendiment': 'atendimentoTipo',
    'Atendime_1': 'atendimentoInfo',
    'Lat (Y)': 'latitude',
    'Lon (X)': 'longitude',
}

# Types of soro (distributed across records since not in original database)
soro_types = [
    ['Antibotrópico', 'Anticrotálico'],
    ['Antibotrópico'],
    ['Antibotrópico', 'Anticrotálico', 'Antilaquético'],
    ['Antibotrópico', 'Antielapídico'],
    ['Antibotrópico', 'Anticrotálico', 'Antilaquético', 'Antielapídico'],
]

def clean_value(val):
    """Clean a value, returning None for empty/nan values."""
    if pd.isna(val):
        return None
    val = str(val).strip()
    if val == '' or val.lower() in ['nan', 'none', 'null']:
        return None
    return val

def clean_number(val):
    """Clean a numeric value."""
    if pd.isna(val):
        return 0.0
    try:
        num = float(val)
        if math.isnan(num) or math.isinf(num):
            return 0.0
        return num
    except:
        return 0.0

centros = []
for idx, row in df.iterrows():
    # Cycle through soro types
    tipos_soro = soro_types[idx % len(soro_types)]
    
    # Clean CNES - should be integer as string
    cnes_val = row.get('CNES')
    if pd.notna(cnes_val):
        try:
            cnes = str(int(float(cnes_val)))
        except:
            cnes = None
    else:
        cnes = None
    
    centro = {
        'id': str(idx + 1),
        'nome': clean_value(row.get('Unidade de')) or f'Centro {idx + 1}',
        'municipio': clean_value(row.get('Municipio')) or '',
        'uf': clean_value(row.get('FU')) or '',
        'regiao': clean_value(row.get('Region')) or '',
        'latitude': clean_number(row.get('Lat (Y)')),
        'longitude': clean_number(row.get('Lon (X)')),
        'tiposSoro': tipos_soro,
        'endereco': clean_value(row.get('Endereço')),
        'telefone': clean_value(row.get('Telefone')),
        'cnes': cnes,
        'atendimentoTipo': clean_value(row.get('Atendiment')),
        'atendimentoInfo': clean_value(row.get('Atendime_1')),
    }
    centros.append(centro)

# Save as JSON
output_path = 'public/data/centros.json'

# Ensure directory exists
import os
os.makedirs('public/data', exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(centros, f, ensure_ascii=False, indent=2)

print(f"✅ Generated {len(centros)} centros to {output_path}")
print(f"Sample centro:")
print(json.dumps(centros[0], ensure_ascii=False, indent=2))
