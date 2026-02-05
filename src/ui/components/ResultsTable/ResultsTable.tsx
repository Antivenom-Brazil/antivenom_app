import type { Centro } from '../../../domain/models/Centro';

interface ResultsTableProps {
  centros: Centro[];
}

export function ResultsTable({ centros }: ResultsTableProps) {
  return (
    <section className="results-table">
      <h2>📋 Centros de Atendimento</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Município</th>
              <th>UF</th>
              <th>Tipos de Soro</th>
            </tr>
          </thead>
          <tbody>
            {centros.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#666' }}>
                  Nenhum centro encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              centros.map((centro) => (
                <tr key={centro.id}>
                  <td>{centro.nome}</td>
                  <td>{centro.municipio}</td>
                  <td>{centro.uf}</td>
                  <td>{centro.tiposSoro.join(', ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="results-count">
        {centros.length} {centros.length === 1 ? 'centro encontrado' : 'centros encontrados'}
      </div>
    </section>
  );
}
