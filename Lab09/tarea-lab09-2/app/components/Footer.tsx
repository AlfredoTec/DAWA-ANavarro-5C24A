export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-lg font-bold text-white mb-4">
          Justificación de estrategias de renderizado (CSR vs SSR)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-blue-400 font-semibold mb-2">
              SSR — Server-Side Rendering
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-white font-medium">PopularMovies:</span> Los
                datos de películas populares son semi-estáticos. Usar SSR con ISR
                (revalidate: 3600) permite que el HTML llegue completo al cliente,
                mejorando SEO y rendimiento en la carga inicial.
              </li>
              <li>
                <span className="text-white font-medium">page.tsx:</span> Es un
                Server Component que solo compone otros componentes, sin lógica
                interactiva. Mantenerlo en el servidor reduce el JavaScript enviado
                al cliente.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold mb-2">
              CSR — Client-Side Rendering
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-white font-medium">SearchBar:</span> La
                búsqueda requiere interactividad en tiempo real (debounce, estados,
                clics fuera del componente). CSR permite responder instantáneamente
                sin recargar la página.
              </li>
              <li>
                <span className="text-white font-medium">MovieModal:</span> Se
                activa por interacción del usuario. Los detalles se obtienen
                dinámicamente según el imdbID seleccionado, y requiere manejo de
                eventos de teclado (Escape).
              </li>
              <li>
                <span className="text-white font-medium">MovieCard:</span> Necesita
                el evento onClick para comunicar la película seleccionada al
                contexto global, lo cual solo es posible en el cliente.
              </li>
              <li>
                <span className="text-white font-medium">
                  MovieContext + ClientHome:
                </span>{" "}
                El Context API de React con useState solo funciona en el cliente.
                ClientHome actúa como frontera entre Server y Client Components.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}