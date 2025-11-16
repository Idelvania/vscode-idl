/**
 * Gerador de relatórios
 */

import * as fs from 'fs';
import * as path from 'path';

export async function saveReport(
  filePath: string,
  content: string,
  format: string
): Promise<void> {
  // Garantir que o diretório existe
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Adicionar extensão se não tiver
  let finalPath = filePath;
  const ext = path.extname(filePath);
  if (!ext) {
    const extensions: { [key: string]: string } = {
      txt: '.txt',
      json: '.json',
      html: '.html',
      pdf: '.pdf',
    };
    finalPath = filePath + (extensions[format] || '.txt');
  }

  // Salvar arquivo
  fs.writeFileSync(finalPath, content, 'utf-8');
}
