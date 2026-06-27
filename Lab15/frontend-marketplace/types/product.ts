export interface Category {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imageUrl: string | null;
  categoryId: number | null;
  Category?: Category;
}
