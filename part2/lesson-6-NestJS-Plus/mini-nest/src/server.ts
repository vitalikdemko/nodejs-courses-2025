import "reflect-metadata";
import { BooksModule } from "./apps/books/books.module";
import { Factory } from "./core/http";
import { HttpExceptionFilter } from "./apps/filters/http-exception.filter";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const app = Factory([BooksModule]);

app.useGlobalFilters([new HttpExceptionFilter()]);

const port = 8080;
app.listen(port, () =>
  console.log(`Mini-Nest listening on http://localhost:${port}`)
);
