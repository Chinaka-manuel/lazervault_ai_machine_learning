const Spinner = ({ full = false }: { full?: boolean }) => (
  <div className={full ? 'flex min-h-[60vh] items-center justify-center' : 'flex justify-center py-8'}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
  </div>
);

export default Spinner;
