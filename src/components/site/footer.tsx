export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Essence</p>
        <p>Oráculo 3.1 — DC → AC</p>
      </div>
    </footer>
  );
}
