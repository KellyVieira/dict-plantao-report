
import { 
  Paragraph,
  TextRun,
  Header, 
  Footer,
  AlignmentType,
  PageNumber,
  BorderStyle,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  Table
} from "docx";
import { getEmblems } from "./emblems";
import { MARGINS, SPACING, COLORS, getDocumentFooter, createInstitutionalHeader } from "./styleUtils";

/**
 * Get the document section with margins and styling for Word
 */
export const getDocumentSection = (children: (Paragraph | Table)[], hasHeadersAndFooters: boolean = true) => {
  const section: any = {
    properties: {
      page: {
        margin: {
          top: MARGINS.TOP,
          right: MARGINS.RIGHT,
          bottom: MARGINS.BOTTOM,
          left: MARGINS.LEFT,
        },
        borders: {
          pageBorders: {
            display: PageBorderDisplay.ALL_PAGES,
            offsetFrom: PageBorderOffsetFrom.PAGE,
            zOrder: PageBorderZOrder.BACK,
          },
          top: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          right: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          left: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
        },
      },
    },
    children: children,
  };

  // Add the institutional header and confidential footer if requested
  if (hasHeadersAndFooters) {
    const { brasaoEstadoGoias, brasaoPolicialCivil } = getEmblems();
    
    if (brasaoEstadoGoias.length > 0 && brasaoPolicialCivil.length > 0) {
      section.headers = {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Times New Roman",
                  size: 20, // 10pt
                }),
              ],
            }),
            createInstitutionalHeader(brasaoEstadoGoias, brasaoPolicialCivil),
            // Add spacing after header
            new Paragraph({
              spacing: { after: SPACING.SECTION.DOUBLE },
              children: [new TextRun({ text: "" })]
            })
          ],
        }),
      };
      
      section.footers = {
        default: new Footer({
          children: [getDocumentFooter()],
        }),
      };
    }
  }
  
  return section;
};
