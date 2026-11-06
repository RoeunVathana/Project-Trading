const ascii = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[\u2010-\u2015]/g, "-")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[^\x20-\x7e]/g, " ");

const wrap = (value, limit) => {
  const lines = [""];
  for (const word of ascii(value).split(/\s+/)) {
    const last = lines.length - 1;
    if (lines[last] && lines[last].length + word.length + 1 > limit) lines.push(word);
    else lines[last] += `${lines[last] ? " " : ""}${word}`;
  }
  return lines;
};

export const downloadReferenceDossier = (projects) => {
  if (!projects.length) return;

  // All PDF source is ASCII, so string lengths are also exact byte offsets.
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Count ${projects.length} /Kids [${projects.map((_, index) => `${6 + index * 2} 0 R`).join(" ")}] >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  projects.forEach((project, index) => {
    const commands = [];
    let y = 790;
    const text = (value, size = 11, bold = false, color = "0.13 0.18 0.26") => {
      const escaped = ascii(value).replace(/([\\()])/g, "\\$1");
      commands.push(`BT /F${bold ? 2 : 1} ${size} Tf ${color} rg 1 0 0 1 48 ${y} Tm (${escaped}) Tj ET`);
      y -= size + 8;
    };

    text("CHINT | GLOBAL PROJECT REFERENCES", 11, true, "0.1 0.36 0.7");
    y -= 32;
    wrap(project.title, 42).forEach((line) => text(line, 21, true));
    y -= 8;
    wrap([project.location, project.year].filter(Boolean).join(" | "), 76).forEach((line) => text(line));
    y -= 28;
    text("PROJECT OVERVIEW", 10, true, "0.1 0.36 0.7");
    wrap(project.description, 83).forEach((line) => text(line));
    y -= 24;
    text("TECHNICAL SPECIFICATIONS", 10, true, "0.1 0.36 0.7");
    (project.specs ?? []).forEach(([label, value]) => {
      wrap(`${label}: ${value}`, 78).forEach((line) => text(line));
      y -= 5;
    });
    y = 48;
    text(`CHINT Reference Dossier | ${index + 1} / ${projects.length}`, 9);

    const stream = commands.join("\n");
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "CHINT-project-reference-dossier.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
