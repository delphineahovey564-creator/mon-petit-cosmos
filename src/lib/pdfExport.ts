import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFExportOptions {
  elementId: string;
  filename: string;
  childName: string;
  title: string;
  subtitle?: string;
}

export const exportToPDF = async (options: PDFExportOptions): Promise<void> => {
  const { elementId, filename, childName, title, subtitle } = options;

  const btn = document.getElementById("pdf-btn");
  const originalText = btn?.textContent ?? "";
  if (btn) {
    btn.textContent = "Génération...";
    btn.setAttribute("disabled", "true");
  }

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[PDF] Element with id="${elementId}" not found.`);
      alert("Impossible de trouver le contenu à exporter.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (_doc, clonedEl) => {
        (clonedEl as HTMLElement).style.fontFamily = "Nunito, sans-serif";
        (clonedEl as HTMLElement).style.overflow = "visible";
        (clonedEl as HTMLElement).style.height = "auto";
      },
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 14;

    pdf.setFillColor(255, 107, 53);
    pdf.rect(0, 0, pageW, 32, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("EducEnfant", margin, 13);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("Apprendre en jouant, grandir en créant.", margin, 20);
    const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    pdf.text(today, pageW - margin, 13, { align: "right" });

    pdf.setTextColor(26, 26, 46);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, 44);
    if (subtitle) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(107, 114, 128);
      pdf.text(subtitle, margin, 52);
    }

    pdf.setFillColor(255, 240, 232);
    pdf.roundedRect(margin, 56, 85, 9, 2, 2, "F");
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Réalisé par ${childName}`, margin + 3, 62);

    const imgData = canvas.toDataURL("image/png", 1.0);
    const usableW = pageW - margin * 2;
    const imgH = (canvas.height * usableW) / canvas.width;
    const startY = 70;
    const maxH = pageH - startY - 18;

    if (imgH <= maxH) {
      pdf.addImage(imgData, "PNG", margin, startY, usableW, imgH);
    } else {
      const scale = usableW / canvas.width;
      const sliceHpx = maxH / scale;
      let offsetY = 0;
      while (offsetY < canvas.height) {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.min(sliceHpx, canvas.height - offsetY);
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, offsetY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
        const sliceH = sliceCanvas.height * scale;
        const yPos = offsetY === 0 ? startY : 18;
        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, yPos, usableW, sliceH);
        offsetY += sliceHpx;
        if (offsetY < canvas.height) pdf.addPage();
      }
    }

    const total = pdf.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      pdf.setPage(p);
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.4);
      pdf.line(margin, pageH - 12, pageW - margin, pageH - 12);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(156, 163, 175);
      pdf.text(`EducEnfant — ${childName}`, margin, pageH - 7);
      pdf.text(`${p} / ${total}`, pageW - margin, pageH - 7, { align: "right" });
    }

    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error("[PDF] Export failed:", err);
    alert("Une erreur est survenue lors de la création du PDF.\nVérifiez la console pour plus de détails.");
  } finally {
    if (btn) {
      btn.textContent = originalText || "Exporter en PDF";
      btn.removeAttribute("disabled");
    }
  }
};

export const exportLetterPDF = (letter: string, childName: string) =>
  exportToPDF({ elementId: "tracing-area", filename: `lettre_${letter}_EducEnfant`, childName, title: `La lettre ${letter}`, subtitle: "Module Alphabet" });

export const exportNumberPDF = (num: number, childName: string) =>
  exportToPDF({ elementId: "tracing-area", filename: `chiffre_${num}_EducEnfant`, childName, title: `Le chiffre ${num}`, subtitle: "Module Chiffres" });

export const exportDrawingPDF = (childName: string) =>
  exportToPDF({ elementId: "drawing-canvas-area", filename: "dessin_EducEnfant", childName, title: "Mon dessin", subtitle: "Module Dessin & Coloriage" });

export const exportVictoryPDF = (moduleName: string, childName: string) =>
  exportToPDF({ elementId: "victory-card", filename: `reussite_${moduleName}_EducEnfant`, childName, title: `Ma réussite — ${moduleName}`, subtitle: "EducEnfant" });

export const exportParentReportPDF = (childName: string) =>
  exportToPDF({ elementId: "parent-report-area", filename: `rapport_${childName}_EducEnfant`, childName, title: "Rapport de progression", subtitle: `${childName} — EducEnfant` });