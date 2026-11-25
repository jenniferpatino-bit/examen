interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  const button = 'rounded bg-slate-700 px-3 py-1 text-white disabled:bg-slate-300';
  return (
    <div className="flex items-center justify-center gap-4">
      <button className={button} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button className={button} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </div>
  );
}