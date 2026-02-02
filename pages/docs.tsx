'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div style={{ padding: 24 }}>Cargando documentación...</div>,
});

/**
 * Página de documentación OpenAPI/Swagger.
 * Accesible también en /api/docs mediante rewrite en next.config.
 */
export default function DocsPage() {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url="/api/openapi" />
    </div>
  );
}
