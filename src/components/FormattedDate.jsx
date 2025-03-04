import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FormattedDate = ({ date }) => {
    if (!date) return null;

    // Formatea la fecha usando date-fns
    return <span>{'"'+format(new Date(date), 'MMMM yyyy', { locale: es })+'"'}</span>;
};

export default FormattedDate;
