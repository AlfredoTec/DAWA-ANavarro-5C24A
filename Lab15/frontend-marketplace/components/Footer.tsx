export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-4 mt-auto border-t-4 border-[#C7F33C]">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-[#C7F33C] font-semibold">Marketplace</span> - Todos los derechos reservados
      </p>
    </footer>
  );
}
