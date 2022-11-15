const getTranslatedProductionSalesStatus = (status: string): string => {
  switch (status) {
    case 'TO_DO':
      return 'A REALIZAR';
    case 'IN_PROGRESS':
      return 'EM ANDAMENTO';
    case 'PENDING':
      return 'PENDENTE';
    case 'DONE':
      return 'FINALIZADO';
    default:
      return '';
  }
};

export default getTranslatedProductionSalesStatus;
