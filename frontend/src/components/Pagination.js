// src/components/Pagination.jsx
import './Pagination.css'
export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(pages, page + 1));

  return (
    <div style={{ marginTop: 18 }}>
      <button onClick={prev} disabled={page === 1}>Previous</button>
      <span style={{ margin: '0 10px' }}>{page} / {pages}</span>
      <button onClick={next} disabled={page === pages}>Next</button>
    </div>
  );
}
