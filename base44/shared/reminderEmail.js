const copy = {
  en: { morning: "Today's move", evening: 'Quick check-in — what moved today?', path: 'your income idea', open: 'Open your coach to continue or log progress', settings: 'Change reminder preferences', disclaimer: 'Results vary. Earnings are not guaranteed.' },
  es: { morning: 'Tu próximo paso', evening: 'Seguimiento rápido: ¿cómo te fue hoy?', path: 'tu idea de ingresos', open: 'Abre tu guía para continuar o registrar tu progreso', settings: 'Cambiar las preferencias de recordatorios', disclaimer: 'Los resultados varían. Los ingresos no están garantizados.' },
  pt: { morning: 'Seu próximo passo', evening: 'Acompanhamento rápido: como foi hoje?', path: 'sua ideia de renda', open: 'Abra seu guia para continuar ou registrar seu progresso', settings: 'Alterar preferências de lembretes', disclaimer: 'Os resultados variam. Os ganhos não são garantidos.' }
};
export function reminderEmail({ language, kind, title, pathId, message }) {
  const text = copy[language] || copy.en;
  const coachUrl = `https://sparkydollar.com/coach?pathId=${encodeURIComponent(pathId)}`;
  return {
    subject: kind === 'morning' ? `${text.morning}: ${title || text.path}` : text.evening,
    text: `${message}\n\n${text.open}:\n${coachUrl}\n\n${text.settings}: https://sparkydollar.com/settings\n\n${text.disclaimer}`,
    coachUrl
  };
}