# Paginador en tablas MUI (TablePagination)

Según la [documentación de MUI Table](https://mui.com/material-ui/react-table/#pagination) y [TablePagination API](https://mui.com/material-ui/api/table-pagination/).

## Componente

`TablePagination` es un componente basado en `TableCell` para colocar dentro de `TableFooter` y paginar los datos de la tabla.

## Import

```tsx
import TablePagination from '@mui/material/TablePagination';
// o
import { TablePagination } from '@mui/material';
```

## Ubicación

1. **Dentro de la tabla (TableFooter)**  
   Se usa una fila de pie con una celda que abarca todas las columnas:

   ```tsx
   <TableFooter>
     <TableRow>
       <TablePagination
         count={totalRows}
         page={page}
         onPageChange={handlePageChange}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleRowsPerPageChange}
         rowsPerPageOptions={[5, 10, 25]}
         colSpan={numeroDeColumnas}
       />
     </TableRow>
   </TableFooter>
   ```

2. **Fuera de la tabla**  
   Para que los controles de paginación no hagan scroll con la tabla, se puede poner `TablePagination` fuera del `TableContainer` (por ejemplo en un `TableRow` envuelto en un `Table` solo para el footer, o en un `Box` debajo).

## Props requeridas

| Prop                | Tipo     | Descripción |
|---------------------|----------|-------------|
| `count`             | number   | Total de filas. Usar `-1` en paginación por servidor cuando el total es desconocido. |
| `page`              | number   | Índice de la página actual (base 0). |
| `rowsPerPage`       | number   | Filas por página. `-1` = mostrar todas. |
| `onPageChange`      | function | Se llama al cambiar de página: `(event, page) => void`. |
| `onRowsPerPageChange` | function | Se llama al cambiar “filas por página”: `(event) => void`. |

## Props opcionales útiles

| Prop                   | Default              | Descripción |
|------------------------|----------------------|-------------|
| `rowsPerPageOptions`   | `[10, 25, 50, 100]`  | Opciones del select. Para “Todas”: `[5, 10, 25, { value: -1, label: 'Todas' }]`. |
| `labelRowsPerPage`     | `'Rows per page:'`   | Etiqueta del select (ej. `'Filas por página:'`). |
| `labelDisplayedRows`   | función por defecto  | Texto tipo “1–5 de 13”. Recibe `{ from, to, count, page }`. |
| `showFirstButton`      | `false`              | Mostrar botón “primera página”. |
| `showLastButton`       | `false`              | Mostrar botón “última página”. |
| `colSpan`              | -                    | Obligatorio si va dentro de `TableFooter`: número de columnas de la tabla. |

## Ejemplo mínimo (paginación en cliente)

```tsx
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

const handlePageChange = (_event: unknown, newPage: number) => {
  setPage(newPage);
};

const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

// Filas visibles (si los datos están en memoria)
const visibleRows = movimientos.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

<TableFooter>
  <TableRow>
    <TablePagination
      count={movimientos.length}
      page={page}
      onPageChange={handlePageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25]}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      colSpan={5}
    />
  </TableRow>
</TableFooter>
```

## Ejemplo con paginación en servidor

- `count`: total que devuelve el API (o `-1` si no se conoce).
- `page` y `rowsPerPage`: se envían al API (ej. `?page=0&limit=10`).
- `onPageChange` / `onRowsPerPageChange`: actualizar estado y volver a llamar al API con los nuevos `page` y `rowsPerPage`.

## Nota

`TablePagination` extiende `TableCell`; si se coloca dentro de `TableFooter`, hay que darle `colSpan` igual al número de columnas de la tabla para que ocupe todo el ancho.
