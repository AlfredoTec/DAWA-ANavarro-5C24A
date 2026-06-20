import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  })); 
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/projects"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Volver a Proyectos
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {project.title}
        </h1>
        
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        
        <p className="text-lg text-gray-700 mb-6">{project.description}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tecnologías</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {technology}
              </span>
            ))}
          </div>
        </section>

        <div className="flex gap-4">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver demo
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver código
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
