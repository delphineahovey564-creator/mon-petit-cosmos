export async function exportElementAsPdf(el: HTMLElement, opts: { title: string; subtitle?: string; filename: string }) {
  const [{ default: html2canvas }, jspdfMod] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const jsPDF = (jspdfMod as any).jsPDF ?? (jspdfMod as any).default;
  const canvas = await html2canvas(el, { backgroundColor: "#ffffff", scale: 2 });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor("#FF6B35");
  pdf.text(opts.title, w / 2, 60, { align: "center" });
  if (opts.subtitle) {
    pdf.setFontSize(12);
    pdf.setTextColor("#6B7280");
    pdf.text(opts.subtitle, w / 2, 82, { align: "center" });
  }
  const imgW = w - 80;
  const imgH = (canvas.height / canvas.width) * imgW;
  pdf.addImage(img, "PNG", 40, 110, imgW, imgH);
  pdf.setFontSize(11);
  pdf.setTextColor("#9CA3AF");
  pdf.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — EducEnfant`, w / 2, 110 + imgH + 30, { align: "center" });
  pdf.save(opts.filename);
}
