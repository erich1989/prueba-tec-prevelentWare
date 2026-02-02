/**
 * Especificación OpenAPI 3.0 para la API de gestión de ingresos/egresos y usuarios.
 * Sirve en GET /api/openapi y es consumida por Swagger UI en /api/docs.
 */
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Gestión Ingresos y Egresos',
    description: 'API REST para gestión de movimientos financieros, usuarios y reportes. Autenticación con Better Auth (sesión por cookie).',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: 'Origen de la aplicación' }],
  tags: [
    { name: 'Health', description: 'Comprobación de estado' },
    { name: 'Usuarios', description: 'CRUD de usuarios (solo ADMIN)' },
    { name: 'Movimientos', description: 'CRUD de ingresos y egresos' },
    { name: 'Reportes', description: 'Datos agregados y descarga CSV (solo ADMIN)' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Estado de la API',
        description: 'Comprueba que la API responde y que las variables de entorno de autenticación (GitHub OAuth, Better Auth) están cargadas. No requiere autenticación.',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'API operativa. authReady indica si la configuración de auth está lista.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok', 'authReady'],
                  properties: {
                    ok: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API ok' },
                    authEnv: {
                      type: 'object',
                      description: 'Indicadores booleanos de cada variable de auth (sin exponer valores).',
                      properties: {
                        hasGitHubClientId: { type: 'boolean' },
                        hasGitHubClientSecret: { type: 'boolean' },
                        hasBetterAuthSecret: { type: 'boolean' },
                        hasBetterAuthUrl: { type: 'boolean' },
                      },
                    },
                    authReady: { type: 'boolean', example: true, description: 'True si todas las variables de auth están definidas.' },
                  },
                },
                example: {
                  ok: true,
                  message: 'API ok',
                  authEnv: { hasGitHubClientId: true, hasGitHubClientSecret: true, hasBetterAuthSecret: true, hasBetterAuthUrl: true },
                  authReady: true,
                },
              },
            },
          },
        },
      },
    },
    '/api/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        description: 'Devuelve todos los usuarios ordenados por fecha de creación (más recientes primero). Requiere sesión y rol ADMIN.',
        operationId: 'getUsuarios',
        responses: {
          '200': {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', description: 'ID único (cuid)' },
                          name: { type: 'string', nullable: true },
                          email: { type: 'string', format: 'email' },
                          phone: { type: 'string', nullable: true },
                          role: { type: 'string', enum: ['ADMIN', 'USER'] },
                          createdAt: { type: 'string', format: 'date-time' },
                          updatedAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    { id: 'clx...', name: 'Admin', email: 'admin@ejemplo.com', phone: null, role: 'ADMIN', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
                  ],
                },
              },
            },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'No autorizado (solo ADMIN)' },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        description: 'Crea un nuevo usuario. Requiere sesión y rol ADMIN. El correo debe ser único en el sistema. Rol por defecto: ADMIN (según prueba técnica).',
        operationId: 'postUsuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['correo'],
                properties: {
                  nombre: { type: 'string', description: 'Nombre del usuario' },
                  correo: { type: 'string', format: 'email', description: 'Correo único (obligatorio)' },
                  telefono: { type: 'string', nullable: true },
                  rol: { type: 'string', enum: ['ADMIN', 'USER'], description: 'ADMIN o USER' },
                },
              },
              example: { nombre: 'Juan Pérez', correo: 'juan@ejemplo.com', telefono: '+57 300 123 4567', rol: 'ADMIN' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuario creado. Devuelve el objeto usuario (id, name, email, phone, role, etc.).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string', nullable: true },
                        email: { type: 'string' },
                        phone: { type: 'string', nullable: true },
                        role: { type: 'string' },
                      },
                    },
                  },
                },
                example: { data: { id: 'clx...', name: 'Juan Pérez', email: 'juan@ejemplo.com', phone: '+57 300 123 4567', role: 'ADMIN' } },
              },
            },
          },
          '400': {
            description: 'Datos inválidos: correo obligatorio, formato inválido o correo ya registrado.',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'El correo es obligatorio' } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'No autorizado' },
        },
      },
    },
    '/api/usuarios/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del usuario (cuid)' }],
      patch: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        description: 'Actualiza nombre, correo, teléfono o rol. Requiere ADMIN. El correo debe ser único si se cambia. No se puede quitar el rol ADMIN al propio usuario si es el único ADMIN.',
        operationId: 'patchUsuario',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string' },
                  correo: { type: 'string', format: 'email' },
                  telefono: { type: 'string', nullable: true },
                  rol: { type: 'string', enum: ['ADMIN', 'USER'] },
                },
              },
              example: { nombre: 'Juan Pérez Actualizado', correo: 'juan.nuevo@ejemplo.com', rol: 'USER' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuario actualizado. Devuelve el objeto usuario actualizado.',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object' } } }, example: { data: { id: 'clx...', name: 'Juan Pérez Actualizado', email: 'juan.nuevo@ejemplo.com', role: 'USER' } } } },
          },
          '400': {
            description: 'Datos inválidos (ej. correo duplicado) o intento de eliminación de sí mismo',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'El correo ya está registrado' } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'No autorizado' },
          '404': {
            description: 'Usuario no encontrado',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'Usuario no encontrado' } } },
          },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar usuario',
        description: 'Elimina el usuario y en cascada sus sesiones, cuentas y movimientos. Requiere ADMIN. No se puede eliminar al propio usuario.',
        operationId: 'deleteUsuario',
        responses: {
          '200': {
            description: 'Usuario eliminado',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object', properties: { id: { type: 'string' } } } } }, example: { data: { id: 'clx...' } } } },
          },
          '400': {
            description: 'Intento de eliminarse a sí mismo',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'No puedes eliminarte a ti mismo' } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'No autorizado' },
          '404': {
            description: 'Usuario no encontrado',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'Usuario no encontrado' } } },
          },
        },
      },
    },
    '/api/movimientos': {
      get: {
        tags: ['Movimientos'],
        summary: 'Listar movimientos',
        description: 'Devuelve todos los ingresos y egresos ordenados por fecha (más recientes primero). Incluye datos del usuario asociado (name, email). Requiere sesión (USER o ADMIN).',
        operationId: 'getMovimientos',
        responses: {
          '200': {
            description: 'Lista de movimientos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          concepto: { type: 'string' },
                          monto: { type: 'number', description: 'Valor numérico (positivo para ingreso/egreso según tipo)' },
                          fecha: { type: 'string', format: 'date-time' },
                          tipo: { type: 'string', enum: ['ingreso', 'egreso'] },
                          userId: { type: 'string' },
                          user: {
                            type: 'object',
                            nullable: true,
                            properties: { name: { type: 'string', nullable: true }, email: { type: 'string' } },
                            description: 'Usuario que registró el movimiento',
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 'clx...',
                      concepto: 'Venta servicios',
                      monto: 1500000,
                      fecha: '2025-02-01T12:00:00.000Z',
                      tipo: 'ingreso',
                      userId: 'clx...',
                      user: { name: 'Admin', email: 'admin@ejemplo.com' },
                    },
                  ],
                },
              },
            },
          },
          '401': { description: 'No autenticado' },
        },
      },
      post: {
        tags: ['Movimientos'],
        summary: 'Crear movimiento',
        description: 'Crea un ingreso o egreso. Requiere sesión y rol ADMIN. userId debe ser un ID de usuario existente.',
        operationId: 'postMovimiento',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['concepto', 'monto', 'fecha', 'tipo', 'userId'],
                properties: {
                  concepto: { type: 'string', description: 'Descripción del movimiento' },
                  monto: { type: 'number', description: 'Valor (número positivo)' },
                  fecha: { type: 'string', format: 'date-time', description: 'Fecha del movimiento (ISO 8601)' },
                  tipo: { type: 'string', enum: ['ingreso', 'egreso'] },
                  userId: { type: 'string', description: 'ID del usuario que registra el movimiento (cuid)' },
                },
              },
              example: { concepto: 'Venta servicios', monto: 1500000, fecha: '2025-02-01T12:00:00.000Z', tipo: 'ingreso', userId: 'clx...' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Movimiento creado. Devuelve el movimiento con user (name, email).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        concepto: { type: 'string' },
                        monto: { type: 'number' },
                        fecha: { type: 'string', format: 'date-time' },
                        tipo: { type: 'string' },
                        userId: { type: 'string' },
                        user: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
                      },
                    },
                  },
                },
                example: { data: { id: 'clx...', concepto: 'Venta servicios', monto: 1500000, fecha: '2025-02-01T12:00:00.000Z', tipo: 'ingreso', userId: 'clx...', user: { name: 'Admin', email: 'admin@ejemplo.com' } } },
              },
            },
          },
          '400': {
            description: 'Datos inválidos (campos obligatorios faltantes o formato incorrecto)',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'El concepto es obligatorio' } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
        },
      },
    },
    '/api/movimientos/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del movimiento (cuid)' }],
      patch: {
        tags: ['Movimientos'],
        summary: 'Actualizar movimiento',
        description: 'Actualiza concepto, monto, fecha o tipo. Solo se envían los campos a modificar. Requiere ADMIN.',
        operationId: 'patchMovimiento',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  concepto: { type: 'string' },
                  monto: { type: 'number' },
                  fecha: { type: 'string', format: 'date-time' },
                  tipo: { type: 'string', enum: ['ingreso', 'egreso'] },
                },
              },
              example: { concepto: 'Venta actualizada', monto: 2000000, tipo: 'ingreso' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Movimiento actualizado. Devuelve el movimiento actualizado con user.',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object' } } }, example: { data: { id: 'clx...', concepto: 'Venta actualizada', monto: 2000000, tipo: 'ingreso', user: { name: 'Admin', email: 'admin@ejemplo.com' } } } } },
          },
          '400': {
            description: 'Datos inválidos',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'El monto debe ser un número positivo' } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
          '404': {
            description: 'Movimiento no encontrado',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'Movimiento no encontrado' } } },
          },
        },
      },
      delete: {
        tags: ['Movimientos'],
        summary: 'Eliminar movimiento',
        description: 'Elimina el movimiento de forma permanente. Requiere ADMIN.',
        operationId: 'deleteMovimiento',
        responses: {
          '200': {
            description: 'Movimiento eliminado',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object', properties: { id: { type: 'string' } } } } }, example: { data: { id: 'clx...' } } } },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
          '404': {
            description: 'Movimiento no encontrado',
            content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } }, example: { error: 'Movimiento no encontrado' } } },
          },
        },
      },
    },
    '/api/reportes': {
      get: {
        tags: ['Reportes'],
        summary: 'Datos del reporte (gráfico)',
        description:
          'Devuelve datos agregados para el gráfico de reportes. Requiere ADMIN. Debes enviar **solo uno** de estos parámetros: **mes** (vista por día del mes), **año** (vista por mes del año) o **vista=año** (vista por año, últimos 6 años).',
        operationId: 'getReportes',
        parameters: [
          { name: 'mes', in: 'query', required: false, schema: { type: 'string', example: '2025-02' }, description: 'Vista por día: mes en formato YYYY-MM. Respuesta: data.mes, data.ingresosPorDia (31), data.egresosPorDia (31).' },
          { name: 'año', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d{4}$', example: '2025' }, description: 'Vista por mes: año. Respuesta: data.año, data.ingresosPorMes (12), data.egresosPorMes (12).' },
          { name: 'vista', in: 'query', required: false, schema: { type: 'string', enum: ['año'] }, description: 'Vista por año: enviar valor "año". Respuesta: data.años (6), data.ingresosPorAño (6), data.egresosPorAño (6).' },
        ],
        responses: {
          '200': {
            description: 'Datos agregados según el parámetro enviado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      description: 'Si usaste mes: { mes, ingresosPorDia[], egresosPorDia[] }. Si usaste año: { año, ingresosPorMes[], egresosPorMes[] }. Si usaste vista=año: { años[], ingresosPorAño[], egresosPorAño[] }.',
                      properties: {
                        mes: { type: 'string', example: '2025-02', description: 'Presente cuando se consulta por mes.' },
                        ingresosPorDia: { type: 'array', items: { type: 'number' }, maxItems: 31, description: 'Total ingresos por día del mes (índice 0 = día 1).' },
                        egresosPorDia: { type: 'array', items: { type: 'number' }, maxItems: 31, description: 'Total egresos por día del mes.' },
                        año: { type: 'integer', example: 2025, description: 'Presente cuando se consulta por año (vista mes).' },
                        ingresosPorMes: { type: 'array', items: { type: 'number' }, maxItems: 12, description: 'Total ingresos por mes (0=Ene, 11=Dic).' },
                        egresosPorMes: { type: 'array', items: { type: 'number' }, maxItems: 12, description: 'Total egresos por mes.' },
                        años: { type: 'array', items: { type: 'integer' }, maxItems: 6, description: 'Lista de años (últimos 6). Presente cuando vista=año.' },
                        ingresosPorAño: { type: 'array', items: { type: 'number' }, maxItems: 6, description: 'Total ingresos por año.' },
                        egresosPorAño: { type: 'array', items: { type: 'number' }, maxItems: 6, description: 'Total egresos por año.' },
                      },
                    },
                  },
                },
                examples: {
                  vistaDia: {
                    summary: 'Con ?mes=2025-02',
                    value: { data: { mes: '2025-02', ingresosPorDia: [0, 100, 0], egresosPorDia: [0, 50, 0] } },
                  },
                  vistaMes: {
                    summary: 'Con ?año=2025',
                    value: { data: { año: 2025, ingresosPorMes: [1000, 1200], egresosPorMes: [500, 600] } },
                  },
                  vistaAño: {
                    summary: 'Con ?vista=año',
                    value: { data: { años: [2021, 2022, 2023, 2024, 2025, 2026], ingresosPorAño: [10000, 12000], egresosPorAño: [5000, 6000] } },
                  },
                },
              },
            },
          },
          '400': { description: 'Parámetros inválidos, faltantes o enviaste más de uno (mes/año/vista).' },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
        },
      },
    },
    '/api/reportes/saldo': {
      get: {
        tags: ['Reportes'],
        summary: 'Saldo actual',
        description: 'Devuelve el saldo actual: suma de todos los ingresos menos suma de todos los egresos. Requiere ADMIN.',
        operationId: 'getReportesSaldo',
        responses: {
          '200': {
            description: 'Saldo calculado (ingresos - egresos).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      required: ['saldo'],
                      properties: { saldo: { type: 'number', description: 'Total ingresos menos total egresos' } },
                    },
                  },
                },
                example: { data: { saldo: 150000 } },
              },
            },
          },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
        },
      },
    },
    '/api/reportes/csv': {
      get: {
        tags: ['Reportes'],
        summary: 'Descargar reporte CSV',
        description:
          'Devuelve un archivo CSV con los movimientos del rango indicado (mismo criterio que GET /api/reportes). Opcional: filtrar por tipo (ingreso|egreso) y por userId. Requiere ADMIN. Cabeceras: Concepto, Monto, Fecha, Tipo, Usuario.',
        operationId: 'getReportesCsv',
        parameters: [
          { name: 'mes', in: 'query', required: false, schema: { type: 'string', example: '2025-02' }, description: 'Rango: mes (vista día)' },
          { name: 'año', in: 'query', required: false, schema: { type: 'string', example: '2025' }, description: 'Rango: año (vista mes)' },
          { name: 'vista', in: 'query', required: false, schema: { type: 'string', enum: ['año'] }, description: 'Rango: últimos 6 años' },
          { name: 'tipo', in: 'query', required: false, schema: { type: 'string', enum: ['ingreso', 'egreso'] }, description: 'Filtrar por tipo de movimiento' },
          { name: 'userId', in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por ID de usuario' },
        ],
        responses: {
          '200': {
            description: 'Archivo CSV (Content-Type: text/csv; charset=utf-8, Content-Disposition: attachment). Columnas: Concepto, Monto, Fecha, Tipo, Usuario.',
            content: { 'text/csv': { schema: { type: 'string' } } },
          },
          '400': { description: 'Parámetros inválidos (debe indicarse mes, año o vista=año)' },
          '401': { description: 'No autenticado' },
          '403': { description: 'Solo administradores' },
        },
      },
    },
  },
  components: {
    schemas: {},
  },
} as const;
