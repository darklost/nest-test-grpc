import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


function format(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}

function printMemoryUsage() {
  const { heapTotal, heapUsed, rss, external, arrayBuffers } =
    process.memoryUsage();

  console.log(
    `rss ${format(rss)} heapTotal ${format(heapTotal)} heapUsed ${format(
      heapUsed,
    )} external ${format(external)} arrayBuffers ${format(arrayBuffers)}`,
    'Process MemoryUsage',
  );
}
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  setInterval(printMemoryUsage, 5000);
}
bootstrap();
