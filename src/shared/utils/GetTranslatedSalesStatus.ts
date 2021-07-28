const getTranslatedSalesStatus = (status: string): string => {
  switch(status){
    case 'PENDING':
      return 'Pendente';
    case 'FINISHED':
      return 'Finalizado';
    case 'CONFIRMED':
      return 'Confirmado';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return ''
  }
}

export default getTranslatedSalesStatus;
