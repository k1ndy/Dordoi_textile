import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-clay">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Страница не найдена</h1>
        <p className="mt-2 text-ink-muted">Возможно, товар скрыт или ссылка устарела.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-dark">На главную</Link>
          <Link href="/catalog" className="btn-primary">В каталог</Link>
        </div>
      </div>
    </div>
  );
}
