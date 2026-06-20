import { Project, Skill } from '@/types';

export const projects: Project[] = [
  {
    slug: 'techstore-ecommerce',
    title: 'TechStore — E-commerce de tecnología',
    description:
      'Plataforma de e-commerce para productos tecnológicos. Catálogo, carrito y pasarela de pagos. Backend modular en NestJS con TypeORM sobre PostgreSQL; frontend en Next.js.',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=900&auto=format&fit=crop',
    technologies: ['NestJS', 'Next.js', 'PostgreSQL', 'TypeScript'],
    techIcons: [
      { name: 'NestJS',      icon: 'nestjs/nestjs-original.svg' },
      { name: 'Next.js',     icon: 'nextjs/nextjs-original.svg', invert: true },
      { name: 'PostgreSQL',  icon: 'postgresql/postgresql-original.svg' },
      { name: 'TypeScript',  icon: 'typescript/typescript-original.svg' },
    ],
    browserUrl: 'techstore-ecommerce.vercel.app',
    githubUrl: 'https://github.com/AlfredoNavarroDev',
    featured: true,
  },
  {
    slug: 'essalud-app',
    title: 'EsSalud App — Citas médicas con IA',
    description:
      'Sistema de citas médicas web y móvil con IA. Stack multi-plataforma: Kotlin + Jetpack Compose, Python + Django, Java + Spring Boot.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop',
    technologies: ['Python', 'Django', 'Kotlin', 'Spring Boot'],
    techIcons: [
      { name: 'Python',      icon: 'python/python-original.svg' },
      { name: 'Django',      icon: 'django/django-plain.svg', invert: true },
      { name: 'Kotlin',      icon: 'kotlin/kotlin-original.svg' },
      { name: 'Spring Boot', icon: 'spring/spring-original.svg' },
    ],
    browserUrl: 'essalud-app.vercel.app',
    githubUrl: 'https://github.com/AlfredoNavarroDev',
    featured: true,
  },
  {
    slug: 'coffe-vibes',
    title: 'Coffe Vibes — Cafetería online',
    description:
      'Cafetería online con recojo en local y delivery. Catálogo de productos, pasarela de pago y gestión de pedidos. JavaScript, EJS y Node.js.',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop',
    technologies: ['JavaScript', 'Node.js', 'Express', 'EJS'],
    techIcons: [
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
      { name: 'Node.js',    icon: 'nodejs/nodejs-original.svg' },
      { name: 'Express',    icon: 'express/express-original.svg', invert: true },
    ],
    browserUrl: 'coffe-vibes.vercel.app',
    githubUrl: 'https://github.com/AlfredoNavarroDev',
    featured: true,
  },
];

export const skills: Skill[] = [
  { name: 'NestJS',      icon: 'nestjs/nestjs-original.svg',         level: 'Mid',      pct: 73 },
  { name: 'Node.js',     icon: 'nodejs/nodejs-original.svg',          level: 'Mid',      pct: 68 },
  { name: 'TypeScript',  icon: 'typescript/typescript-original.svg',  level: 'Mid',      pct: 70 },
  { name: 'JavaScript',  icon: 'javascript/javascript-original.svg',  level: 'Mid',   pct: 70 },
  { name: 'Python',      icon: 'python/python-original.svg',          level: 'Mid',   pct: 65 },
  { name: 'Next.js',     icon: 'nextjs/nextjs-original.svg',          level: 'Learning', pct: 50, invert: true },
];

export const personalInfo = {
  name: 'Alfredo Navarro',
  fullName: 'Alfredo Navarro Tejeda',
  title: 'Backend Developer',
  description:
    'Estudiante de Diseño y Desarrollo de Software en TECSUP. Construyo APIs sólidas y sistemas escalables.',
  role: 'Node.js · NestJS · TypeScript',
  email: 'alfredont1088@gmail.com',
  github: 'https://github.com/AlfredoNavarroDev',
  linkedin: 'https://linkedin.com/in/alfredont',
  siteUrl: 'https://alfredo-navarro.vercel.app',
};
