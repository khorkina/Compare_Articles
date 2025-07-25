import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export class ExportService {
  async generateDocx(comparisonData: {
    articleTitle: string;
    languages: string[];
    outputLanguage: string;
    content: string;
    isFunnyMode: boolean;
  }): Promise<Buffer> {
    try {
      console.log('Generating DOCX for:', comparisonData.articleTitle);
      console.log('Content length:', comparisonData.content.length);
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: `Wiki Truth Comparison Report`,
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Article: `,
                  bold: true,
                }),
                new TextRun({
                  text: comparisonData.articleTitle,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Languages Compared: `,
                  bold: true,
                }),
                new TextRun({
                  text: comparisonData.languages.join(', '),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Output Language: `,
                  bold: true,
                }),
                new TextRun({
                  text: comparisonData.outputLanguage,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Mode: `,
                  bold: true,
                }),
                new TextRun({
                  text: comparisonData.isFunnyMode ? 'Funny Mode' : 'Standard Analysis',
                }),
              ],
            }),
            new Paragraph({
              text: '', // Empty line
            }),
            new Paragraph({
              text: 'Comparison Analysis',
              heading: HeadingLevel.HEADING_1,
            }),
            ...this.convertTextToParagraphs(comparisonData.content),
            new Paragraph({
              text: '', // Empty line
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated by Wiki Truth on ${new Date().toLocaleDateString()}`,
                  italics: true,
                  size: 20,
                }),
              ],
            }),
          ],
        }],
      });

      return await Packer.toBuffer(doc);
    } catch (error) {
      console.error('DOCX generation error:', error);
      throw new Error('Failed to generate DOCX document');
    }
  }

  private convertTextToParagraphs(text: string): Paragraph[] {
    // Clean HTML tags and formatting symbols that might be in the text
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/^\s*[=\-\*]{3,}\s*$/gm, '') // Remove divider lines
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .trim();

    const lines = cleanText.split('\n');
    const paragraphs: Paragraph[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines or lines with only symbols
      if (!trimmedLine || /^[=\-\*\s]+$/.test(trimmedLine)) {
        continue;
      }
      
      // Check if line starts with bullet point
      if (trimmedLine.match(/^[-*+]\s+/)) {
        const bulletText = trimmedLine.replace(/^[-*+]\s+/, '');
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: `• ${bulletText}`,
            }),
          ],
        }));
      }
      // Check if line looks like a header (bold text or all caps)
      else if (trimmedLine.length < 100 && (trimmedLine === trimmedLine.toUpperCase() || trimmedLine.endsWith(':'))) {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 24,
            }),
          ],
        }));
      }
      // Regular paragraph
      else {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
            }),
          ],
        }));
      }
    }
    
    return paragraphs;
  }
}

export const exportService = new ExportService();
